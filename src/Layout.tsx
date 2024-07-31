import { FC } from "hono/jsx";

export const Layout: FC = props => {
    return (
        <html>
            <head>
                <link href="/static/style.css" rel="stylesheet" />
            </head>
            <body>{props.children}</body>
        </html>
    );
};

