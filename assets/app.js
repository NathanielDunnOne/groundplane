/* ============================================================
   Benchtop Build — app.js
   Client-side renderer. No dependencies, no build step.
   Works from file:// and any static host.
   You should not need to edit this file to post — content
   lives in /data. See the Posting Guide PDF kept with the project.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- storage helpers (fail-safe on odd contexts) ---------- */
  function lsGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* ignore */ }
  }

  /* ---------- theme ---------- */
  var THEME_KEY = "gp.theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");
  }
  applyTheme(lsGet(THEME_KEY) || "dark");

  /* ---------- data lookups ---------- */
  var SITE = window.SITE || { name: "SITE", sections: [], owner: { handle: "??", name: "", role: "" } };
  var PAPERS = window.PAPERS || [];

  var BOARDS = {};
  SITE.sections.forEach(function (sec) {
    sec.boards.forEach(function (b) { b.section = sec; BOARDS[b.slug] = b; });
  });

  function threadsOf(slug) {
    return PAPERS.filter(function (p) { return p.board === slug; });
  }
  function paperById(id) {
    for (var i = 0; i < PAPERS.length; i++) if (PAPERS[i].id === id) return PAPERS[i];
    return null;
  }
  function lastActivity(p) {
    var d = p.posted;
    if (p.updated && p.updated > d) d = p.updated;
    (p.discussion || []).forEach(function (post) { if (post.date > d) d = post.date; });
    return d;
  }
  function replyCount(p) { return (p.discussion || []).length; }

  /* ---------- read tracking ---------- */
  var READ_KEY = "gp.read";
  function readMap() {
    try { return JSON.parse(lsGet(READ_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function isUnread(p) {
    var m = readMap();
    return !m[p.id] || m[p.id] < lastActivity(p);
  }
  function markRead(p) {
    var m = readMap();
    m[p.id] = lastActivity(p);
    lsSet(READ_KEY, JSON.stringify(m));
  }
  function markAllRead() {
    var m = {};
    PAPERS.forEach(function (p) { m[p.id] = lastActivity(p); });
    lsSet(READ_KEY, JSON.stringify(m));
  }

  /* ---------- small utils ---------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function stripTags(s) { return String(s).replace(/<[^>]*>/g, " "); }
  function param(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }
  function roman(n) {
    var t = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], out = "";
    t.forEach(function (pair) { while (n >= pair[0]) { out += pair[1]; n -= pair[0]; } });
    return out;
  }
  function fmtWhen(iso) {
    if (!iso) return "";
    var then = new Date(iso + "T12:00:00");
    var days = Math.floor((Date.now() - then.getTime()) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "1 d ago";
    if (days < 30) return days + " d ago";
    return iso;
  }
  function whenCell(iso) {
    return "<span title='" + esc(iso) + "'>" + esc(fmtWhen(iso)) + "</span>";
  }
  /* var() in SVG presentation attributes is not honored by browsers;
     move such values onto inline style so theme tokens apply. */
  function fixSvgVars(root) {
    var nodes = root.querySelectorAll("*");
    ["fill", "stroke"].forEach(function (attr) {
      for (var i = 0; i < nodes.length; i++) {
        var v = nodes[i].getAttribute && nodes[i].getAttribute(attr);
        if (v && v.indexOf("var(") === 0) {
          nodes[i].style[attr] = v;
          nodes[i].removeAttribute(attr);
        }
      }
    });
  }
  function copyText(text, btn) {
    function done(ok) {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = ok ? "COPIED" : "COPY FAILED";
      setTimeout(function () { btn.textContent = old; }, 1400);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { legacy(); });
    } else { legacy(); }
    function legacy() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      done(ok);
    }
  }
  /* auto-link [n] citation markers to the reference list */
  function linkCites(html, refCount, idPrefix) {
    if (!refCount) return html;
    return String(html).replace(/\[(\d{1,2})\]/g, function (m, n) {
      n = parseInt(n, 10);
      if (n < 1 || n > refCount) return m;
      return "<sup><a href='#" + idPrefix + n + "'>[" + n + "]</a></sup>";
    });
  }

  /* ---------- chrome: masthead, readout, footer ---------- */
  var OPAMP =
    "<svg width='26' height='26' viewBox='0 0 26 26' aria-hidden='true'>" +
    "<path class='opamp-stroke' d='M6 4 L22 13 L6 22 Z' fill='none' stroke-width='1.6'/>" +
    "<path class='opamp-stroke' d='M1 9 L6 9 M1 17 L6 17 M22 13 L25 13' fill='none' stroke-width='1.4'/>" +
    "<text class='opamp-ink' x='8' y='11.5' font-size='6.5' font-family='monospace'>+</text>" +
    "<text class='opamp-ink' x='8' y='20' font-size='6.5' font-family='monospace'>&#8722;</text>" +
    "</svg>";

  function buildChrome(pageId) {
    var totalThreads = PAPERS.length;
    var totalPosts = PAPERS.reduce(function (n, p) { return n + 1 + replyCount(p); }, 0);
    var last = PAPERS.reduce(function (d, p) { var a = lastActivity(p); return a > d ? a : d; }, "");
    var unread = PAPERS.filter(isUnread).length;

    /* Nav items. Tuple = [href, label, isCurrentPage].
       (SEARCH is hidden on desktop via CSS and shown on mobile.) */
    var nav = [
      ["index.html", "INDEX", pageId === "index"],
      ["about.html", "ABOUT", pageId === "about"],
      ["tags.html", "TAGS", pageId === "tags"],
      ["search.html", "SEARCH", pageId === "search"]
    ].map(function (it) {
      return "<a href='" + it[0] + "'" + (it[2] ? " aria-current='page'" : "") + ">" + it[1] + "</a>";
    }).join("");

    var mast = document.getElementById("mast");
    if (mast) {
      mast.innerHTML =
        "<div class='mast-inner'>" +
        "<div class='mast-top'>" +
        "<a class='brand' href='index.html'>" + OPAMP +
        "<span><span class='brand-name'>" + esc(SITE.name) + "<span class='tld'>_</span></span><br>" +
        "<span class='brand-tag'>" + esc(SITE.tagline || "") + "</span></span></a>" +
        "<nav class='mast-nav' aria-label='Site'>" + nav +
        "<form class='mast-search' action='search.html' role='search'>" +
        "<input type='search' name='q' id='mast-q' placeholder='search threads' aria-label='Search threads'>" +
        "<kbd>/</kbd></form></nav>" +
        "</div>" +
        "<div class='readout' aria-label='Site status readout'>" +
        "<span><span class='led' aria-hidden='true'></span> SYS OK</span>" +
        "<span>THREADS <span class='ro-val'>" + totalThreads + "</span></span>" +
        "<span>POSTS <span class='ro-val'>" + totalPosts + "</span></span>" +
        "<span>UNREAD <span class='ro-val" + (unread ? " hot" : "") + "'>" + unread + "</span></span>" +
        "<span>LAST <span class='ro-val'>" + esc(last) + "</span></span>" +
        "<span class='ro-end'>OPERATOR <span class='ro-val hot'>" + esc(SITE.owner.handle) + "</span></span>" +
        "<button type='button' id='theme-btn' title='Toggle color theme'>THEME</button>" +
        "</div></div>";

      document.getElementById("theme-btn").addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        applyTheme(cur);
        lsSet(THEME_KEY, cur);
      });
    }

    var foot = document.getElementById("foot");
    if (foot) {
      foot.innerHTML =
        "<div class='foot-inner'>" +
        "<span>" + esc(SITE.name) + " — all posts by " + esc(SITE.owner.handle) + "</span>" +
        "<span class='grow'></span>" +
        "</div>";
    }

    /* "/" focuses search */
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "/" || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var t = ev.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      var box = document.getElementById("mast-q") || document.getElementById("search-q");
      if (box) { ev.preventDefault(); box.focus(); }
    });
  }

  /* ---------- shared row builders ---------- */
  function kindClass(kind) {
    return "k-" + String(kind || "").toLowerCase().replace(/[^a-z]/g, "");
  }
  function threadRow(p) {
    var unread = isUnread(p);
    return "<div class='thread-row" + (p.pinned ? " pinned" : "") + "'>" +
      "<span class='b-dot'><span class='dot" + (unread ? " unread" : "") + "' title='" + (unread ? "unread" : "read") + "'></span></span>" +
      "<span class='kind-chip " + kindClass(p.kind) + "'>" + esc(p.kind) + "</span>" +
      "<span class='t-main'><span class='t-title'>" + (p.pinned ? "<span class='pin'>PINNED</span>" : "") +
      "<a href='paper.html?id=" + encodeURIComponent(p.id) + "'>" + esc(p.title) + "</a></span>" +
      "<span class='t-meta'>" + p.id.toUpperCase() + " · rev " + esc(p.rev || "A") + " · " +
      (p.tags || []).slice(0, 4).map(function (t) { return "<span class='tag'>" + esc(t) + "</span>"; }).join(" ") +
      "</span></span>" +
      "<span class='t-replies'><span class='lbl'>replies</span>" + replyCount(p) + "</span>" +
      "<span class='t-when'>" + whenCell(lastActivity(p)) + "</span>" +
      "</div>";
  }

  /* ---------- page: index ---------- */
  function renderIndex(main) {
    var html = "<div class='page-head'><h1>Forum Index</h1></div>";

    SITE.sections.forEach(function (sec) {
      var rows = sec.boards.map(function (b) {
        var ths = threadsOf(b.slug);
        var posts = ths.reduce(function (n, p) { return n + 1 + replyCount(p); }, 0);
        var unread = ths.filter(isUnread).length;
        var newest = ths.slice().sort(function (a, x) { return lastActivity(x) < lastActivity(a) ? -1 : 1; })[0];
        return "<div class='board-row'>" +
          "<span class='b-dot'><span class='dot" + (unread ? " unread" : "") + "'></span></span>" +
          "<span class='b-main'><span class='b-name'><a href='board.html?b=" + esc(b.slug) + "'>" + esc(b.name) + "</a>" +
          "<span class='b-code'>" + esc(b.code) + "</span></span>" +
          "<span class='b-blurb'>" + esc(b.blurb) + "</span></span>" +
          "<span class='b-stat'><span class='lbl'>threads</span>" + ths.length +
          (unread ? " <span class='unread-n'>(" + unread + ")</span>" : "") + "</span>" +
          "<span class='b-stat posts'><span class='lbl'>posts</span>" + posts + "</span>" +
          "<span class='b-last'>" + (newest ?
            "<a href='paper.html?id=" + encodeURIComponent(newest.id) + "'>" + esc(newest.title) + "</a>" +
            "<span class='when'>" + esc(lastActivity(newest)) + " · " + esc(SITE.owner.handle) + "</span>"
            : "<span class='b-empty'>No threads yet</span>") + "</span>" +
          "</div>";
      }).join("");
      var secThreads = sec.boards.reduce(function (n, b) { return n + threadsOf(b.slug).length; }, 0);
      html += "<section class='section-block'>" +
        "<h2 class='section-label'>" + esc(sec.title) + " <span class='sec-count'>" + secThreads + " thread" + (secThreads === 1 ? "" : "s") + "</span></h2>" +
        "<div class='board-table'>" + rows + "</div></section>";
    });

    html += "<div class='index-foot'><button type='button' id='mark-read'>Mark all read</button></div>";

    main.innerHTML = html;
    document.getElementById("mark-read").addEventListener("click", function () {
      markAllRead();
      location.reload();
    });
  }

  /* ---------- page: board ---------- */
  function renderBoard(main) {
    var slug = param("b");
    var board = BOARDS[slug];
    if (!board) { renderMissing(main, "No such board: " + esc(slug || "(none)")); return; }
    document.title = board.name + " · " + SITE.name;

    var sortKey = param("sort") || "activity";
    var ths = threadsOf(slug);
    var sorters = {
      activity: function (a, b) { return lastActivity(b) < lastActivity(a) ? -1 : 1; },
      posted: function (a, b) { return b.posted < a.posted ? -1 : 1; },
      replies: function (a, b) { return replyCount(b) - replyCount(a); },
      title: function (a, b) { return a.title.localeCompare(b.title); }
    };
    ths.sort(sorters[sortKey] || sorters.activity);
    ths.sort(function (a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); });

    var html = "<nav class='crumbs'><a href='index.html'>index</a><span class='sep'>/</span>" +
      esc(board.section.title.toLowerCase()) + "<span class='sep'>/</span>" + esc(board.name.toLowerCase()) + "</nav>" +
      "<div class='board-head'><span class='b-code'>" + esc(board.code) + "</span>" +
      "<h1>" + esc(board.name) + "</h1><div class='sub'>" + esc(board.blurb) + "</div></div>" +
      "<div class='list-controls'><label for='sort-sel'>sort</label>" +
      "<select id='sort-sel'>" +
      "<option value='activity'>last activity</option>" +
      "<option value='posted'>date posted</option>" +
      "<option value='replies'>replies</option>" +
      "<option value='title'>title</option>" +
      "</select><span>" + ths.length + " thread" + (ths.length === 1 ? "" : "s") + "</span></div>";

    html += ths.length
      ? "<div class='thread-table'>" + ths.map(threadRow).join("") + "</div>"
      : "<div class='empty-state'>No Threads Yet</div>";

    main.innerHTML = html;
    var sel = document.getElementById("sort-sel");
    sel.value = sortKey;
    sel.addEventListener("change", function () {
      location.search = "?b=" + encodeURIComponent(slug) + "&sort=" + sel.value;
    });
  }

  /* ---------- page: paper ---------- */
  function blockHtml(block, p, fig) {
    if (typeof block === "string") {
      return "<p>" + linkCites(block, (p.references || []).length, "ref-") + "</p>";
    }
    if (block.list || block.olist) {
      var items = (block.list || block.olist).map(function (it) {
        return "<li>" + linkCites(it, (p.references || []).length, "ref-") + "</li>";
      }).join("");
      return block.list ? "<ul>" + items + "</ul>" : "<ol>" + items + "</ol>";
    }
    if (block.eq) {
      return "<div class='eq'><span class='eq-body'>" + block.eq + "</span>" +
        (block.no ? "<span class='eq-no'>" + esc(block.no) + "</span>" : "") + "</div>";
    }
    if (block.code) {
      return "<pre class='codeblock'>" + esc(block.code) + "</pre>";
    }
    if (block.table) {
      var t = block.table;
      return "<div class='dtable-wrap'><table class='dtable'>" +
        (t.caption ? "<caption>" + esc(t.caption) + "</caption>" : "") +
        "<thead><tr>" + t.head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") + "</tr></thead>" +
        "<tbody>" + t.rows.map(function (r) {
          return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>";
    }
    if (block.fig) {
      fig.n += 1;
      return "<figure class='figure' id='" + esc(block.fig.id || ("fig" + fig.n)) + "'>" +
        "<div class='fig-art'>" + block.fig.svg + "</div>" +
        "<figcaption>" + block.fig.caption + "</figcaption></figure>";
    }
    return "";
  }

  function bibtex(p) {
    var url = (SITE.canonicalUrl || "") + "/paper.html?id=" + p.id;
    return "@misc{" + p.id.replace(/[^a-z0-9]/gi, "") + ",\n" +
      "  author       = {" + (SITE.owner.name || SITE.owner.handle) + "},\n" +
      "  title        = {" + p.title.replace(/[{}]/g, "") + "},\n" +
      "  howpublished = {" + SITE.name + " (Research \\& Projects Forum), thread " + p.id.toUpperCase() + ", rev. " + (p.rev || "A") + "},\n" +
      "  year         = {" + p.posted.slice(0, 4) + "},\n" +
      "  note         = {Posted " + p.posted + (p.updated && p.updated !== p.posted ? ", updated " + p.updated : "") + "},\n" +
      "  url          = {" + url + "}\n}";
  }
  function citeText(p) {
    var url = (SITE.canonicalUrl || "") + "/paper.html?id=" + p.id;
    return (SITE.owner.name || SITE.owner.handle) + ", “" + p.title + ",” " + SITE.name +
      " (Research & Projects Forum), doc. " + p.id.toUpperCase() + ", rev. " + (p.rev || "A") +
      ", " + p.posted + ". [Online]. Available: " + url;
  }

  function renderPaper(main) {
    var p = paperById(param("id"));
    if (!p) { renderMissing(main, "No such document: " + esc(param("id") || "(none)")); return; }
    var board = BOARDS[p.board] || { name: p.board, code: "?", section: { title: "" } };
    document.title = p.title + " · " + SITE.name;

    var refCount = (p.references || []).length;
    var figCounter = { n: 0 };

    /* body sections */
    var sectionsHtml = (p.sections || []).map(function (sec, i) {
      var id = "sec-" + (i + 1);
      return "<section id='" + id + "'><h2><span class='secno'>" + roman(i + 1) + ".</span>" + esc(sec.h) + "</h2>" +
        sec.body.map(function (b) { return blockHtml(b, p, figCounter); }).join("") + "</section>";
    }).join("");

    var figTotal = figCounter.n;

    /* rail */
    var rail = "<p class='rail-label'>Document</p><nav aria-label='Document outline'>" +
      "<a href='#abstract'>Abstract</a>" +
      (p.sections || []).map(function (sec, i) {
        return "<a href='#sec-" + (i + 1) + "'>" + roman(i + 1) + ". " + esc(sec.h) + "</a>";
      }).join("") +
      (refCount ? "<a href='#refs'>References</a>" : "") +
      "<a href='#discussion'>Discussion (" + replyCount(p) + ")</a></nav>" +
      "<div class='rail-foot'>" + p.id.toUpperCase() + " · REV " + esc(p.rev || "A") +
      "<br>posted " + esc(p.posted) +
      (p.updated && p.updated !== p.posted ? "<br>updated " + esc(p.updated) : "") +
      "<br>board " + esc(board.code) + "</div>";

    /* discussion */
    var posts = (p.discussion || []).map(function (post, i) {
      var body = post.body.map(function (para) {
        return "<p>" + linkCites(para, refCount, "ref-") + "</p>";
      }).join("");
      return "<article class='post' id='post-" + (i + 1) + "'>" +
        "<div class='post-side'><div class='avatar'>" + esc(SITE.owner.handle) + "</div>" +
        "<div><div class='who'>" + esc(SITE.owner.handle) + "</div>" +
        "<div class='role'>" + esc(SITE.owner.role) + "</div></div></div>" +
        "<div class='post-main'><div class='post-head'><span>" + esc(post.date) + "</span></div>" +
        "<div class='post-body'>" + body + "</div></div></article>";
    }).join("");

    /* prev / next within board, by posted date */
    var sibs = threadsOf(p.board).sort(function (a, b) { return a.posted < b.posted ? -1 : 1; });
    var idx = sibs.indexOf(p);
    var prev = idx > 0 ? sibs[idx - 1] : null;
    var next = idx < sibs.length - 1 ? sibs[idx + 1] : null;

    var html =
      "<nav class='crumbs'><a href='index.html'>index</a><span class='sep'>/</span>" +
      "<a href='board.html?b=" + esc(p.board) + "'>" + esc(board.name.toLowerCase()) + "</a>" +
      "<span class='sep'>/</span>" + p.id.toUpperCase() + "</nav>" +

      "<div class='paper-layout'><aside class='paper-rail'>" + rail + "</aside>" +
      "<article class='doc'>" +

      "<div class='doc-idline'>" +
      "<span class='seg hot'>" + p.id.toUpperCase() + "</span>" +
      "<span class='seg'>" + esc(board.name) + "</span>" +
      "<span class='seg'>" + esc(p.kind) + "</span>" +
      "<span class='seg'>REV " + esc(p.rev || "A") + "</span></div>" +

      "<h1 class='doc-title'>" + esc(p.title) + "</h1>" +
      "<div class='doc-byline'><span class='auth'>" + esc(SITE.owner.name) + "</span> · " + esc(SITE.owner.affiliation || "") + "</div>" +
      "<div class='doc-pub'>Posted in: <b>" + esc(board.name) + "</b> · " + esc(p.posted) +
      (p.updated && p.updated !== p.posted ? " (rev. " + esc(p.updated) + ")" : "") + "</div>" +

      "<div class='doc-actions'>" +
      "<span class='doc-metrics'>" + figTotal + " fig · " + refCount + " ref · " + replyCount(p) + " repl</span></div>" +

      "<div class='doc-rule'></div>" +
      "<div class='abstract' id='abstract'><span class='abs-label'>Abstract —</span>" + p.abstract + "</div>" +

      ((p.tags || []).length ?
        "<div class='index-terms'><span class='it-label'>Index terms —</span>" +
        p.tags.map(function (t) {
          return "<a class='term-chip' href='tags.html?t=" + encodeURIComponent(t) + "'>" + esc(t) + "</a>";
        }).join("") + "</div>" : "") +

      "<div class='doc-body'>" + sectionsHtml + "</div>" +

      (refCount ?
        "<section class='refs' id='refs'><h2 class='discussion-label'>References</h2><ol>" +
        p.references.map(function (r, i) { return "<li id='ref-" + (i + 1) + "'>" + r + "</li>"; }).join("") +
        "</ol></section>" : "") +

      "<section id='discussion'><h2 class='discussion-label'>Discussion (" + replyCount(p) + ")</h2>" +
      (posts || "<div class='empty-state'>No replies yet.</div>") + "</section>" +

      "<nav class='pager'>" +
      (prev ? "<a href='paper.html?id=" + encodeURIComponent(prev.id) + "'><span class='dir'>&#9666; earlier in board</span>" + esc(prev.title) + "</a>" : "<span></span>") +
      (next ? "<a href='paper.html?id=" + encodeURIComponent(next.id) + "'><span class='dir'>later in board &#9656;</span>" + esc(next.title) + "</a>" : "<span></span>") +
      "</nav>" +

      "</article></div>";

    main.innerHTML = html;
    fixSvgVars(main);
    markRead(p);

  }

  /* ---------- page: tags ---------- */
  function tagMap() {
    var m = {};
    PAPERS.forEach(function (p) {
      (p.tags || []).forEach(function (t) { (m[t] = m[t] || []).push(p); });
    });
    return m;
  }
  function renderTags(main) {
    var t = param("t");
    var m = tagMap();
    if (t) {
      document.title = "#" + t + " · " + SITE.name;
      var hits = (m[t] || []).slice().sort(function (a, b) { return lastActivity(b) < lastActivity(a) ? -1 : 1; });
      var html = "<nav class='crumbs'><a href='index.html'>index</a><span class='sep'>/</span>" +
        "<a href='tags.html'>tags</a><span class='sep'>/</span>" + esc(t) + "</nav>" +
        "<div class='page-head'><h1>Threads tagged <span class='hot-tag'>#" + esc(t) + "</span></h1>" +
        "<div class='sub'>" + hits.length + " thread" + (hits.length === 1 ? "" : "s") + "</div></div>";
      html += hits.length
        ? "<div class='thread-table'>" + hits.map(threadRow).join("") + "</div>"
        : "<div class='empty-state'>No Threads Yet</div>";
      main.innerHTML = html;
    } else {
      document.title = "Tags · " + SITE.name;
      var tags = Object.keys(m).sort();
      var out = "<div class='page-head'><h1>Tags</h1>" +
        "<div class='sub'>Browse by interest — every tag across all threads.</div></div>";
      out += tags.length
        ? "<div class='tag-cloud'>" + tags.map(function (tg) {
            return "<a href='tags.html?t=" + encodeURIComponent(tg) + "'>" + esc(tg) +
              "<span class='c'>" + m[tg].length + "</span></a>";
          }).join("") + "</div>"
        : "<div class='empty-state'>No Tags Yet</div>";
      main.innerHTML = out;
    }
  }

  /* ---------- page: search ---------- */
  function corpus(p) {
    if (!p._corpus) {
      var sectionText = (p.sections || []).map(function (s) {
        return s.h + " " + s.body.map(function (b) {
          if (typeof b === "string") return b;
          if (b.list || b.olist) return (b.list || b.olist).join(" ");
          if (b.table) return b.table.head.join(" ") + " " + b.table.rows.map(function (r) { return r.join(" "); }).join(" ");
          if (b.fig) return b.fig.caption || "";
          if (b.eq) return "";
          if (b.code) return b.code;
          return "";
        }).join(" ");
      }).join(" ");
      var disc = (p.discussion || []).map(function (d) { return d.body.join(" "); }).join(" ");
      p._corpus = {
        title: stripTags(p.title).toLowerCase(),
        tags: (p.tags || []).join(" ").toLowerCase(),
        abstract: stripTags(p.abstract).toLowerCase(),
        body: stripTags(sectionText).toLowerCase(),
        disc: stripTags(disc).toLowerCase(),
        plain: stripTags(p.abstract + " " + sectionText + " " + disc).replace(/\s+/g, " ")
      };
    }
    return p._corpus;
  }
  function searchAll(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) return [];
    var hits = [];
    PAPERS.forEach(function (p) {
      var c = corpus(p), score = 0;
      terms.forEach(function (t) {
        if (c.title.indexOf(t) !== -1) score += 6;
        if (c.tags.indexOf(t) !== -1) score += 5;
        if (c.abstract.indexOf(t) !== -1) score += 3;
        if (c.body.indexOf(t) !== -1) score += 1;
        if (c.disc.indexOf(t) !== -1) score += 1;
      });
      var all = terms.every(function (t) {
        return (c.title + " " + c.tags + " " + c.abstract + " " + c.body + " " + c.disc).indexOf(t) !== -1;
      });
      if (score > 0) hits.push({ p: p, score: score + (all ? 4 : 0) });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return hits;
  }
  function snippet(p, terms) {
    var plain = corpus(p).plain;
    var lower = plain.toLowerCase();
    var pos = -1;
    for (var i = 0; i < terms.length && pos === -1; i++) pos = lower.indexOf(terms[i]);
    if (pos === -1) pos = 0;
    var start = Math.max(0, pos - 80);
    var seg = (start > 0 ? "…" : "") + plain.slice(start, pos + 160) + "…";
    var out = esc(seg);
    terms.forEach(function (t) {
      out = out.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>");
    });
    return out;
  }
  function renderSearch(main) {
    var q = param("q") || "";
    document.title = (q ? "“" + q + "” · " : "") + "Search · " + SITE.name;
    var html = "<div class='page-head'><h1>Search</h1>" +
      "<div class='sub'>Searches titles, index terms, abstracts, body text, and discussion replies.</div></div>" +
      "<form class='search-bar' action='search.html'>" +
      "<input type='search' name='q' id='search-q' value='" + esc(q) + "' placeholder='e.g. quench, return path, droop' aria-label='Search query'>" +
      "<button type='submit'>Search</button></form>";

    if (q) {
      var terms = q.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 1; });
      var hits = searchAll(q);
      html += "<div class='list-controls'><span>" + hits.length + " result" + (hits.length === 1 ? "" : "s") +
        " for “" + esc(q) + "”</span></div>";
      if (hits.length) {
        html += hits.map(function (h) {
          var b = BOARDS[h.p.board];
          return "<div class='result'>" +
            "<div class='r-title'><a href='paper.html?id=" + encodeURIComponent(h.p.id) + "'>" + esc(h.p.title) + "</a></div>" +
            "<div class='r-meta'>" + h.p.id.toUpperCase() + " · " + esc(b ? b.name : h.p.board) + " · " + esc(h.p.kind) +
            " · score " + h.score + "</div>" +
            "<div class='r-snip'>" + snippet(h.p, terms) + "</div></div>";
        }).join("");
      } else {
        html += "<div class='empty-state'>No matches. Try fewer or shorter terms — the index is small but literal.</div>";
      }
    }
    main.innerHTML = html;
    var box = document.getElementById("search-q");
    if (box && !q) box.focus();
  }

  /* ---------- misc pages ---------- */
  function renderMissing(main, msg) {
    document.title = "Not found · " + SITE.name;
    main.innerHTML = "<div class='page-head'><h1>Signal not found</h1></div>" +
      "<div class='empty-state'>" + msg + "<br><br><a href='index.html'>Return to the index</a></div>";
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var main = document.getElementById("main");
    var page = document.body.getAttribute("data-page") || "index";
    buildChrome(page);
    if (!main) return;
    if (page === "index") renderIndex(main);
    else if (page === "board") renderBoard(main);
    else if (page === "paper") renderPaper(main);
    else if (page === "search") renderSearch(main);
    else if (page === "tags") renderTags(main);
    else if (page === "notfound") renderMissing(main, "The address asked for a page that does not exist.");
    /* about / guide are static HTML inside #main — chrome only */
  });
})();
