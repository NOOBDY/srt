import { Hono } from "hono";
import { Layout } from "./Layout";
import { hash } from "./lib/hash";
import { methodOverride } from "hono/method-override";

type Bindings = {
    URLS: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/", methodOverride({ app }));
app.get("/", c => {
    return c.render(
        <Layout>
            <h1>Hello!</h1>
            <form method="POST" action="/">
                <input type="hidden" name="_method" value="PUT" />
                <input type="text" name="url" />
                <button type="submit">Submit</button>
            </form>
        </Layout>
    );
});

app.get("/:hash", async c => {
    const hash = c.req.param("hash");

    try {
        const url = await c.env.URLS.get(hash);

        if (!url) {
            return c.status(404);
        }

        return c.redirect(url);
    } catch (e) {
        console.error(e);
        return c.json({ message: "Error getting URL" }, 500);
    }
});

app.put("/", async c => {
    const formData = await c.req.formData();
    const url = formData.get("url");

    if (!url) {
        return c.text("No URL", 400);
    }

    const h = hash(url);

    try {
        await c.env.URLS.put(h, url, { expirationTtl: 3 * 24 * 60 * 60 });
    } catch (e) {
        console.error(e);
        return c.json({ message: "Error generating URL" }, 500);
    }

    const userAgent = c.req.header("User-Agent");

    return c.json({ hash: h }, 200);
});

export default app;
