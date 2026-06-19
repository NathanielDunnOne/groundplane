#!/usr/bin/env node
/* ============================================================
   BenchtopBuild — scripts/validate.mjs
   Content validator for the data files. Run it after editing
   anything in data/ to catch mistakes before they hit the site.

   Usage:
     node scripts/validate.mjs            # validate the real site
     node scripts/validate.mjs a.js b.js  # validate a custom file set

   Exit code 0 = clean, 1 = problems found.
   No dependencies — plain Node (ES module).
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(HERE, "..", "data");
const DEFAULT_FILES = [
  "site.js",
  "papers-ops.js",
  "papers-energy.js",
  "papers-space.js",
  "papers-bench.js",
].map((f) => path.join(DATA, f));

/* Load the data files the same way the browser does: a sandbox whose
   `window` is the global object itself, so `window.SITE = …` and bare
   `PAPERS.push(…)` both resolve. */
function load(files) {
  const sandbox = {};
  sandbox.window = sandbox;
  sandbox.console = console;
  vm.createContext(sandbox);
  for (const file of files) {
    const code = fs.readFileSync(file, "utf8");
    vm.runInContext(code, sandbox, { filename: file });
  }
  return { SITE: sandbox.SITE, PAPERS: sandbox.PAPERS || [] };
}

const ID_RE = /^gp-\d{4}-\d{4}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const REQUIRED = ["id", "board", "kind", "title", "posted"];

function validate(files) {
  const errors = [];
  const warns = [];
  const { SITE, PAPERS } = load(files);

  if (!SITE || !Array.isArray(SITE.sections)) {
    errors.push("site.js: window.SITE.sections missing or not an array");
    return { errors, warns, counts: { papers: 0, boards: 0 } };
  }

  // Collect valid board slugs + check board shape.
  const boardSlugs = new Set();
  for (const sec of SITE.sections) {
    if (!sec.title) errors.push(`section "${sec.id || "?"}": missing title`);
    for (const b of sec.boards || []) {
      if (!b.slug) errors.push(`board in "${sec.title}": missing slug`);
      else if (boardSlugs.has(b.slug)) errors.push(`duplicate board slug: ${b.slug}`);
      else boardSlugs.add(b.slug);
      if (!b.code) warns.push(`board ${b.slug}: missing code`);
      if (!b.name) errors.push(`board ${b.slug}: missing name`);
    }
  }

  // Validate every thread.
  const ids = new Set();
  for (const p of PAPERS) {
    const where = p.id || p.title || "(unidentified thread)";
    for (const f of REQUIRED) {
      if (p[f] === undefined || p[f] === "") errors.push(`${where}: missing required field "${f}"`);
    }
    if (p.id && !ID_RE.test(p.id)) errors.push(`${where}: id not in gp-YYYY-NNNN form`);
    if (p.id && ids.has(p.id)) errors.push(`duplicate thread id: ${p.id}`);
    if (p.id) ids.add(p.id);
    if (p.board && !boardSlugs.has(p.board)) errors.push(`${where}: board "${p.board}" is not a real board slug`);
    for (const d of ["posted", "updated"]) {
      if (p[d] !== undefined && !DATE_RE.test(p[d])) errors.push(`${where}: ${d} "${p[d]}" not YYYY-MM-DD`);
    }
    if (p.tags !== undefined && !Array.isArray(p.tags)) errors.push(`${where}: tags must be an array`);
  }

  // Cross-check internal links inside every thread's text.
  for (const p of PAPERS) {
    const blob = JSON.stringify(p);
    const where = p.id || "(thread)";
    for (const m of blob.matchAll(/paper\.html\?id=([a-z0-9-]+)/gi)) {
      if (!ids.has(m[1])) errors.push(`${where}: links to missing thread "${m[1]}"`);
    }
    for (const m of blob.matchAll(/board\.html\?b=([a-z0-9-]+)/gi)) {
      if (!boardSlugs.has(m[1])) errors.push(`${where}: links to missing board "${m[1]}"`);
    }
  }

  return { errors, warns, counts: { papers: PAPERS.length, boards: boardSlugs.size } };
}

/* ---- run ---- */
const argv = process.argv.slice(2);
const files = argv.length ? argv.map((f) => path.resolve(f)) : DEFAULT_FILES;
const { errors, warns, counts } = validate(files);

console.log(`Groundplane validator — ${counts.papers} threads, ${counts.boards} boards`);
for (const w of warns) console.log(`  warn:  ${w}`);
if (errors.length === 0) {
  console.log(`✔ PASS — no problems found`);
  process.exit(0);
} else {
  for (const e of errors) console.log(`  ERROR: ${e}`);
  console.log(`✖ FAIL — ${errors.length} problem(s)`);
  process.exit(1);
}
