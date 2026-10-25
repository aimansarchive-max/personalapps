# Aiman’s Archive

A responsive, four-page personal site made with plain HTML, CSS, and a small amount of vanilla JavaScript. It has no front-end framework or runtime dependencies.

## Pages

- `index.html` — Home
- `learnings.html` — An illustrated, swipeable eight-page book about how the site was built
- `resources.html` — Searchable AI tools directory
- `about.html` — About Aiman

All pages share `styles.css` and `script.js`. The script handles the mobile menu, saved light/dark theme, current footer year, resource search/category filters, and the swipeable book. Search metadata, structured data, `robots.txt`, and `sitemap.xml` help search engines understand the site.

## Edit the site

Open this folder in a code editor such as VS Code.

- Edit the text and page sections directly in the matching `.html` file.
- Edit the eight book pages in `learnings.html`. Each page is an `<article class="book-page">`; its illustration is made from HTML elements and CSS, so it can be changed without image software.
- Edit colors, type, spacing, layout, and phone/tablet styles in `styles.css`. Theme colors are the CSS variables at the top. Responsive rules are in the `@media` blocks at the bottom.
- Add, remove, or update a tool card in `resources.html`. Use `data-categories="learn research create code"` to control which filters include the card. Keep its official website link in the card.
- Change the footer contact details and social profiles in each page’s footer. Current links are `query@aimansarchive.xyz`, Facebook `1aimanhusen`, and Instagram `1aimanhusen`.
- `script.js` contains the small interactive features. You can edit the page text and artwork without changing this file.
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

## Private CRM dashboard (Cloudflare Pages)

The private dashboard is at `/admin.html` (noindex). It includes a contact inbox and pipeline, private contact notes, follow-up tasks, and a website editor. In **Site control**, edit site-wide identity, navigation and social links, theme colors, homepage copy and collection cards, all seven chapters in the interactive learning book, AI resource listings and official links, About/philosophy copy and value cards, plus SEO titles and descriptions for all four pages. Save changes to publish them through the D1-backed content API; the public pages fetch the latest settings without a stale cache. The About page contact form saves submissions to the CRM. The interface and site remain plain HTML, CSS, and vanilla JavaScript; the private API runs as Cloudflare Pages Functions and stores data in D1. Page structure and custom illustrations remain part of the source files.

### One-time Cloudflare setup

1. In Cloudflare Dashboard, open **Workers & Pages → D1 SQL Database → Create database**. Name it `aimansarchive-crm`.
2. Apply `migrations/0001_crm.sql` to that database in the D1 **Console**. This creates the CRM tables and default homepage copy.
3. Open **Workers & Pages → Pages → personalapps → Settings → Functions → Bindings**. Add a **D1 database** binding named `CRM_DB` and choose `aimansarchive-crm`.
4. Add these three **Secrets** under the Pages project's **Settings → Variables and Secrets**:
   - `CRM_ADMIN_EMAIL` — the email you will use to sign in.
   - `CRM_ADMIN_PASSWORD` — a unique, long password.
   - `CRM_SESSION_SECRET` — a random secret of at least 32 bytes. Generate locally with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.
5. Trigger a new Pages deployment so the binding and secrets are available to Functions.
6. Open `https://aimansarchive.xyz/admin.html` and sign in. New messages sent through the About page contact form appear in Contacts.

Never put the admin password or session secret in HTML, JavaScript, GitHub, or a public `.env` file. Dashboard access is a private-cookie session; the database binding and credentials must be configured in Cloudflare. The API intentionally returns a setup error until the binding and secrets exist.

### Local preview

`npm run build` includes the Pages Functions under `dist/functions/`. The CRM APIs require Cloudflare Pages Functions and D1; opening the HTML directly cannot run the private data layer. For a complete local CRM preview, use Cloudflare's Wrangler Pages dev server after configuring a local D1 database and bindings.
