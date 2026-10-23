# Aiman’s Archive

A responsive, four-page personal site made with plain HTML, CSS, and a small amount of vanilla JavaScript. It has no front-end framework or runtime dependencies.

## Pages

- `index.html` — Home
- `learnings.html` — An illustrated, swipeable eight-page book about how the site was built
- `resources.html` — Searchable AI tools directory
- `about.html` — About Aiman

All pages share `styles.css` and `script.js`. The script handles the mobile menu, saved light/dark theme, current footer year, resource search/category filters, and the book’s page turning, swipe gestures, and optional generated page sound.

## Edit the site

Open this folder in a code editor such as VS Code.

- Edit the text and page sections directly in the matching `.html` file.
- Edit the eight book pages in `learnings.html`. Each page is an `<article class="book-page">`; its illustration is made from HTML elements and CSS, so it can be changed without image software.
- Edit colors, type, spacing, layout, and phone/tablet styles in `styles.css`. Theme colors are the CSS variables at the top. Responsive rules are in the `@media` blocks at the bottom.
- Add, remove, or update a tool card in `resources.html`. Use `data-categories="learn research create code"` to control which filters include the card. Keep its official website link in the card.
- Change the footer contact details and social profiles in each page’s footer. Current links are `query@aimansarchive.xyz`, Facebook `1aimanhusen`, and Instagram `1aimanhusen`.
- `script.js` contains the small interactive features. You can edit the page text and artwork without changing this file.
- Update the page title and description in each file’s `<head>` section when you change the page topic.

## Preview locally

The site uses no build tool. You can open `index.html` directly in a browser. For a local web server, run this from the project folder if Python is installed:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. Open the other pages from the navigation.

## Publish

These are static files. Upload the HTML files, `styles.css`, and `script.js` to any static web host. For Cloudflare Pages, use the project’s root folder as the output directory and leave the build command empty. If you choose to publish the generated `dist/` folder instead, run:

```sh
npm run build
```

The build script copies the static site files into `dist/`; it does not bundle or transform them. Cloudflare Pages can also publish the project root directly without a build step.
