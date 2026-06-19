/* ============================================================
   GROUNDPLANE — papers-ops.js
   Threads for the Operations section.

   THREAD TEMPLATE — copy, fill, and push. (Full reference also
   in the Posting Guide PDF, kept alongside the project.)

   PAPERS.push({
     id: "gp-2026-0015",            // unique, keep sequential
     board: "bulletin",             // a board slug from site.js
     kind: "NOTES",                 // SURVEY | BUILD LOG | NOTES | REVIEW | ADMIN
     pinned: false,
     rev: "A",
     title: "Title of the thread",
     posted: "2026-06-11",
     updated: "2026-06-11",
     tags: ["tag-one", "tag-two"],
     abstract: "One paragraph. Plain HTML allowed.",
     sections: [
       { h: "Section heading", body: [
         "A paragraph. <i>Inline HTML</i> is allowed; [1] auto-links to reference 1.",
         { list: ["bullet", "bullet"] },
         { eq: "<i>V</i> = <i>IR</i>", no: "(1)" },
         { code: "preformatted text" },
         { table: { caption: "TABLE I — name", head: ["A", "B"], rows: [["1", "2"]] } },
         { fig: { id: "fig1", caption: "Caption text.", svg: "<svg>…</svg>" } }
       ]}
     ],
     references: [ "A. Author, <i>Title</i>, Publisher, Year." ],
     discussion: [
       { date: "2026-06-12", body: ["A follow-up post. Plain HTML."] }
     ]
   });
   ============================================================ */

/* No threads here yet — this board is ready for you to fill in.
   Copy the template above, set a unique id, and add your PAPERS.push({...}). */
