// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { join } = require('path');


app.prepare()
    .then(() => {
        createServer((req, res) => {
            const parsedUrl = parse(req.url, true);
            const { pathname } = parsedUrl;

            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.

            if (pathname === '/sw.js' || pathname.startsWith('/workbox-')) {
                const filePath = join(__dirname, '.next', pathname);
                app.serveStatic(req, res, filePath);
            }

            if (pathname === '/a') {
                app.render(req, res, '/b', query);
            } else if (pathname === '/b') {
                app.render(req, res, '/a', query);
            } else {
                handle(req, res, parsedUrl);
            }

        })
            .listen(3000, () => {
                console.log(`> Ready on http://localhost:${3000}`);
            });
    });
