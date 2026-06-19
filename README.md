# GROUNDPLANE

ND's Research & Projects Forum. Every thread is a technical
document — abstract, numbered sections, figures, references — presented
IEEE-Xplore style, with a discussion trail of corrections and follow-ups
underneath. Written, measured, and answered by one person: **ND**.

Built as plain HTML + CSS + JavaScript. **No frameworks, no build step,
no backend, no trackers.** Posting = editing a text file. The "only I can
post" guarantee is structural: there is no write path except file access.

## Run it

Double-click `index.html`. That's it — the site runs from a folder.

If your browser is strict about `file://` pages, serve it instead:

```
python -m http.server 8000
# then open http://localhost:8000
```

## Publish it (free)

**GitHub Pages**

1. Create a public repo, upload this folder's contents (just this
   `groundplane` folder — nothing above it).
2. Settings → Pages → Deploy from branch → `main`, root.
3. Live at `https://<username>.github.io/<repo>/`.
4. Set `canonicalUrl` in `data/site.js` to that address (feeds the Cite button).

Netlify / Cloudflare Pages: drag-and-drop the folder. Identical result.

## Post to it

Full instructions live in **`Groundplane_Posting_Guide.pdf`** (kept alongside
the project), and the thread template is at the top of `data/papers-ops.js`.
Short version:

| To…                 | Edit…                                                      |
| ------------------- | ---------------------------------------------------------- |
| Add a thread        | any `data/papers-*.js` — copy a `PAPERS.push({...})` block |
| Reply to a thread   | that thread's `discussion: []` array                       |
| Add a board/section | `data/site.js`                                             |
| Edit your bio       | `about.html` (dashed boxes mark the fill-ins)              |
| Rename site/owner   | top of `data/site.js`                                      |

## Layout

```
index.html              forum index (sections → boards)
board.html?b=slug       thread list for one board
paper.html?id=gp-...    a document + its discussion
search.html?q=...       full-text search
about.html              bio / operator card  ← fill in the dashed boxes
tags.html               tag index / filter
404.html                wrong turns
assets/style.css        design system (dark default + light theme + print)
assets/app.js           renderer
data/site.js            identity, sections, boards
data/papers-*.js        all content, one PAPERS.push() per thread
```

## Notes

- **Seed content:** the initial 14 threads were written in one pass when the
  site was built (disclosed in the pinned Bulletin thread). Revise, replace,
  or delete them as your own work accumulates — they're ordinary thread
  blocks like any other.
- **Unread markers** are localStorage-only (per visitor, per browser).
- **Printing** a thread (`Ctrl+P`) produces a clean typeset document —
  useful for sharing a single write-up as PDF.
- Webfonts (IBM Plex) load from Google Fonts when online; offline, the
  site falls back to system fonts and remains fully usable.
- The folder **above** this one contains an unrelated earlier prototype
  (a Flask app). This site neither uses nor requires it.
