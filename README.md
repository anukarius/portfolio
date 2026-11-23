# Anujin Naranbaatar — portfolio

A static website. No build step: upload this folder as it is.

## What's inside

- `index.html` — the page
- `app.js` — the portfolio (diagram, projects, About me)
- `lit-html.js` — the small library that draws the page (BSD-3-Clause, see `LICENSE-lit-html.txt`)
- `images/` — project and photography images
- `.nojekyll` — tells GitHub Pages to serve the files as they are

## Put it on GitHub Pages

1. Create a public repository and upload everything in this folder to its top level
   (Add file → Upload files → drag the files and the `images` folder in → Commit changes).
2. Settings → Pages → Deploy from a branch → `main`, folder `/ (root)` → Save.
3. Under Custom domain, enter your domain and save. Tick Enforce HTTPS when it appears.
4. At your registrar (Namecheap → Advanced DNS), remove the parking records and add:
   - A records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - CNAME for `www`: `yourusername.github.io`

## Preview on your computer

Opening `index.html` directly may show a blank page, because browsers block
`app.js` modules from local files. Run a tiny local server instead, for example
`python3 -m http.server` inside this folder, then visit http://localhost:8000.
