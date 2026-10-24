# Aiman’s Archive

A responsive, four-page personal site made with plain HTML, CSS, and a small amount of vanilla JavaScript. It has no front-end framework or runtime dependencies.

## Pages

- `index.html` — Home
- `learnings.html` — An illustrated, swipeable eight-page book about how the site was built
- `resources.html` — Searchable AI tools directory
- `about.html` — About Aiman

All pages share `styles.css` and `script.js`. The script handles the mobile menu, saved light/dark theme, current footer year, resource search/category filters, the swipeable book, and the Gemma chat interface. Search metadata, structured data, `robots.txt`, and `sitemap.xml` help search engines understand the site.

## Gemma chat on Cloudflare Pages

The floating **Ask Gemma** button is available across all four pages. Its browser code sends messages only to the same-site `/api/chat` endpoint. The Cloudflare Pages Function in `functions/api/chat.js` calls Gemma 4 through Workers AI, so no model API key is exposed in the browser. The function limits message sizes and applies a basic per-IP request limit. Messages are not saved by this website.

To turn the chat on in Cloudflare, open **Workers & Pages → personalapps → Settings → Bindings → Add → Workers AI**, name the binding `AI`, save it for the Production environment, and redeploy. Add a separate binding to Preview if you want chat to work on preview URLs. Without the binding, the chat displays a setup message. Workers AI has a limited daily free allowance; usage beyond applicable free quotas may be billed according to the Cloudflare account plan. Do not enable a paid plan or add billing details unless you choose to.

## Edit the site

Open this folder in a code editor such as VS Code.

- Edit the text and page sections directly in the matching `.html` file.
- Edit the eight book pages in `learnings.html`. Each page is an `<article class="book-page">`; its illustration is made from HTML elements and CSS, so it can be changed without image software.
- Edit colors, type, spacing, layout, and phone/tablet styles in `styles.css`. Theme colors are the CSS variables at the top. Responsive rules are in the `@media` blocks at the bottom.
- Add, remove, or update a tool card in `resources.html`. Use `data-categories="learn research create code"` to control which filters include the card. Keep its official website link in the card.
- Change the footer contact details and social profiles in each page’s footer. Current links are `query@aimansarchive.xyz`, Facebook `1aimanhusen`, and Instagram `1aimanhusen`.
- `script.js` contains the small interactive features, including the chat widget behavior. `functions/api/chat.js` validates requests and calls Gemma; edit the system prompt or model limits there.
- Update the page title, description, canonical URL, and social metadata in each file’s `<head>` section when you change the page topic. Keep `sitemap.xml` current when pages are added or removed.

## Preview locally

The site uses no build tool. You can open `index.html` directly in a browser. For a local web server, run this from the project folder if Python is installed:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. Open the other pages from the navigation.

## Publish

These are static files. Upload the HTML files, `styles.css`, `script.js`, `robots.txt`, and `sitemap.xml` to any static web host. For Cloudflare Pages, use the project’s root folder as the output directory and leave the build command empty. If you choose to publish the generated `dist/` folder instead, run:

```sh
npm run build
```

The build script copies the static site files into `dist/`; it does not bundle or transform them. Cloudflare Pages can also publish the project root directly without a build step.

