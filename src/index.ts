import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

const randomString = (bytes: number) => {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);

  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

app.get("/", (c) => {
  return c.text("see usage on: https://github.com/NOOBDY/srt\n");
});

app.put("/", async (c) => {
  const url = await c.req.text();
  let code = "";

  while (true) {
    code = randomString(3);
    const res = await c.env.SRT.get(code);
    if (res == null) {
      break;
    }
  }

  await c.env.SRT.put(code, url, { expirationTtl: 24 * 60 * 60 });
  return c.text(c.req.url + code + "\n");
});

app.get("/:code", async (c) => {
  const code = c.req.param("code");

  const res = await c.env.SRT.get(code);
  if (res == null) {
    return c.notFound();
  }

  return c.redirect(res);
});

export default app;
