Reproduction steps:

- `npm ci`
- `npm run dev`
- Hit `/images/cat.jpg` on your dev server.

Expected result:

Asset is served within a few miliseconds.

Actual result:

Asset is served quickly, but the browser hangs for ~5s and you'll see this reported in the network tab too.

Workaround:

- If I comment out `app.use('*', etag());`, things work as expected, leading me to believe this is somehow releated to the streams behaviour with etags.
- Downgrading to Miniflare 2.7.1 also resolves the issue