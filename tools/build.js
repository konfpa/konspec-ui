#!/usr/bin/env node
/* Generates llms.txt and registry.json from assets/spec.js + assets/reg/*.js.
   Run: node tools/build.js
   Never hand-edit the outputs — they are derived, and the landing page renders
   from the same two sources. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

global.window = {};
require(path.join(root, 'assets/spec.js'));
require(path.join(root, 'assets/registry.js'));
global.register = window.register;

const groups = fs.readdirSync(path.join(root, 'assets/reg'))
  .filter(f => f.endsWith('.js')).sort();
groups.forEach(f => require(path.join(root, 'assets/reg', f)));

const S = window.SPEC;
const R = window.REGISTRY;

/* ── registry.json ─────────────────────────────────────────────────────────── */
const json = {
  $schema: 'https://konspec.internal/ui/registry.schema.json',
  name: S.meta.name,
  version: S.meta.version,
  purpose: S.meta.purpose,
  generated_by: 'node tools/build.js',
  read_first: 'llms.txt',
  stack: S.stack,
  rules: S.rules.map(r => r.t + ' — ' + r.d),
  semantic_colours: {
    note: 'One shade per meaning, everywhere. A mark you read takes the text class; a dot or bar takes the fill class. No -50 tints and no coloured rings — a coloured icon well is still bg-zinc-200 ring-zinc-300.',
    tone: S.tokens.semantic.reduce((acc, t) => {
      acc[t[0].toLowerCase()] = { icon: t[1], text: t[2], use: t[3] };
      return acc;
    }, {}),
    fill: S.tokens.semanticFill.reduce((acc, t) => {
      acc[t[0].toLowerCase()] = { fill: t[1], use: t[2] };
      return acc;
    }, {})
  },
  status_colours: S.status.reduce((acc, s) => {
    acc[s.s.toLowerCase()] = { pill: s.pill, dot: s.dot, meaning: s.why };
    return acc;
  }, {}),
  typography: {
    families: { sans: 'Inter', mono: 'JetBrains Mono' },
    hosting: 'self-hosted, assets/fonts.css — no font CDN at runtime',
    note: 'An arbitrary font size emits no line-height. Always write the slash form: text-[13px]/5.',
    scale: S.tokens.type.map(t => ({ token: t[0], use: t[1] })),
    weight: S.tokens.weight.map(t => ({ token: t[0], value: t[1], use: t[2] })),
    tracking: S.tokens.tracking.map(t => ({ token: t[0], use: t[1] }))
  },
  categories: S.categories,
  components: R.components.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category,
    description: c.description,
    when_to_use: c.when,
    rules: c.notes || [],
    anatomy: (c.anatomy || []).map(a => ({ part: a[0], description: a[1] })),
    behaviour: c.behaviour || [],
    accessibility: c.a11y || [],
    related: c.related || [],
    variants: c.variants.map(v => ({ id: v.id, name: v.name, html: v.code }))
  }))
};
/* Two passes: the warning quotes the file's own size, so measure the body
   first and then stamp the number into it. The warning sits second, right
   after $schema, because an agent streaming this file has to read it before
   it has burned the context the warning is about. */
const tok = bytes => Math.round(bytes / 3.6);
const fmtTok = bytes => {
  const t = tok(bytes);
  return t >= 1000 ? Math.round(t / 1000) + 'k tokens' : t + ' tokens';
};
const fmtSize = bytes => bytes >= 1024 * 1024
  ? (bytes / 1024 / 1024).toFixed(1) + ' MB'
  : Math.round(bytes / 1024) + ' KB';

const registryBody = JSON.stringify(json, null, 2) + '\n';
const registryBytes = Buffer.byteLength(registryBody);
const WARNING =
  'This file is the entire system in one response: ' + fmtSize(registryBytes) +
  ', roughly ' + tok(registryBytes).toLocaleString('en-US') + ' tokens. It will not ' +
  'fit in an agent context window. Fetch /r/index.json, then /r/<id>/<variant>.html.';

const registryOut =
  JSON.stringify({ $schema: json.$schema, warning: WARNING, ...json }, null, 2) + '\n';

/* ── /r — the registry, fetchable in pieces ────────────────────────────────
   registry.json is one 2.5 MB response and the protocol used to tell agents to
   fetch it whole, which is not a thing any of them can do. These are the same
   data at three granularities, generated from the same source, so there is no
   second source of truth to drift.

     r/index.json            spec + one summary per component, no html
     r/<id>.json             one component, complete, with its variants
     r/<id>/<variant>.html   the markup and nothing else

   The variant endpoint is raw HTML rather than JSON on purpose: the whole point
   is paste with zero parsing, and an envelope would put escaping back in. */
const rFiles = new Map();

const indexJson = {
  $schema: json.$schema,
  endpoints: {
    index: '/r/index.json — this file: the spec, and every component summarised with its variant ids. No markup, no per-component prose.',
    note: 'Fetch the smallest thing that answers the question. llms.txt already ' +
          'lists every component with its variant ids, so an agent that read it ' +
          'can build a variant URL directly and never needs this file.',
    component: '/r/<id>.json — one component: rules, anatomy, behaviour, accessibility, and every variant with its html',
    variant: '/r/<id>/<variant>.html — the markup, raw, ready to paste',
    full: '/registry.json — the whole system in one file. Do not fetch it; it will not fit in context.'
  },
  ...json,
  /* A summary, not the component minus its html. Stripping only html still
     leaves 590 KB: the per-component prose is 463 KB of it (rules alone are
     242 KB), which would make the one file an agent is told to read whole the
     largest thing in the system after registry.json. What stays is what you
     need to choose a component and build its URL; the rules, anatomy,
     behaviour and accessibility notes are one fetch away at r/<id>.json. */
  components: json.components.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category,
    description: c.description,
    related: c.related,
    variants: c.variants.map(v => ({ id: v.id, name: v.name })),
    detail: 'r/' + c.id + '.json'
  }))
};
rFiles.set('r/index.json', JSON.stringify(indexJson, null, 2) + '\n');

for (const c of json.components) {
  rFiles.set('r/' + c.id + '.json', JSON.stringify(c, null, 2) + '\n');
  for (const v of c.variants) {
    rFiles.set('r/' + c.id + '/' + v.id + '.html',
               v.html.endsWith('\n') ? v.html : v.html + '\n');
  }
}

/* sizes quoted in llms.txt, measured rather than guessed */
const median = ns => {
  const a = [...ns].sort((x, y) => x - y);
  return a.length ? a[Math.floor((a.length - 1) / 2)] : 0;
};
const idxBytes = Buffer.byteLength(rFiles.get('r/index.json'));
const compSizes = json.components.map(c => ({
  id: c.id, bytes: Buffer.byteLength(rFiles.get('r/' + c.id + '.json'))
}));
const varSizes = json.components.flatMap(c => c.variants.map(v => ({
  id: c.id + '/' + v.id, bytes: Buffer.byteLength(rFiles.get('r/' + c.id + '/' + v.id + '.html'))
})));
const compMed = median(compSizes.map(x => x.bytes));
const varMed = median(varSizes.map(x => x.bytes));
const compMax = compSizes.reduce((a, b) => (b.bytes > a.bytes ? b : a));
const varMax = varSizes.reduce((a, b) => (b.bytes > a.bytes ? b : a));

/* ── llms.txt ──────────────────────────────────────────────────────────────── */
const L = [];
const P = (...lines) => L.push(...lines);

P('# ' + S.meta.name);
P('');
P('> ' + S.meta.purpose + ' ' + S.meta.tagline);
P('');
P('You are reading the entry point for this design system. It is written for agents.');
P('Read all of it before writing markup for a Konspec application, then fetch the');
P('variants you need one at a time from /r/ and copy their markup verbatim.');
P('Do not fetch registry.json: it is the whole system in one response and will');
P('not fit in your context. The Machine-readable section at the end has the');
P('endpoints and what each one costs.');
P('');

P('## Protocol');
P('');
S.protocol.forEach((s, i) => {
  P((i + 1) + '. **' + s.t + '** — ' + s.d);
  P('   `' + s.code + '`');
});
P('');

P('## Stack');
P('');
Object.entries(S.stack).forEach(([k, v]) => P('- **' + k + '**: ' + v));
P('');

P('## Rules');
P('');
P('Every one of these exists because breaking it produced a visible defect at');
P('least once. They are not style preferences.');
P('');
S.rules.forEach((r, i) => P((i + 1) + '. **' + r.t + '.** ' + r.d));
P('');

P('## Tokens');
P('');
P('Stock Tailwind. The class name is the token — there is no theme file to import.');
P('');
P('### Surfaces');
P('');
S.tokens.surfaces.forEach(t => P('- **' + t[0] + '** `' + t[1] + '` — ' + t[2]));
P('');
P('### Text');
P('');
S.tokens.text.forEach(t => P('- **' + t[0] + '** `' + t[1] + '` — ' + t[2]));
P('');
P('### Accent');
P('');
S.tokens.accent.forEach(t => P('- **' + t[0] + '** `' + t[1] + '` — ' + t[2]));
P('');
P('### Semantic colour');
P('');
P('One shade per meaning, and the same shade in every component. Pick from this');
P('table rather than by eye. No -50 tints, no coloured rings — a coloured icon');
P('well is still bg-zinc-200 with ring-zinc-300.');
P('');
P('| tone | icon | mark you read | dot or bar | means |');
P('| --- | --- | --- | --- | --- |');
S.tokens.semantic.forEach(t => {
  const fill = (S.tokens.semanticFill.find(f => f[0] === t[0]) || [])[1] || '—';
  P('| ' + t[0] + ' | `' + t[1] + '` | `' + t[2] + '` | ' + (fill === '—' ? '—' : '`' + fill + '`') + ' | ' + t[3] + ' |');
});
P('');
P('### Typography');
P('');
P('Inter and JetBrains Mono, self-hosted at assets/fonts.css. Nothing is fetched');
P('from a font CDN at runtime.');
P('');
P('Arbitrary font sizes compile to a font-size with no line-height, so every size');
P('is written in the slash form and the pairing below is the default.');
P('');
S.tokens.type.forEach(t => P('- `' + t[0] + '` — ' + t[1]));
P('');
P('Three weights, and no others:');
P('');
S.tokens.weight.forEach(t => P('- `' + t[0] + '` (' + t[1] + ') — ' + t[2]));
P('');
P('Two tracking values, plus the default:');
P('');
S.tokens.tracking.forEach(t => P('- `' + t[0] + '` — ' + t[1]));
P('');
P('### Shape');
P('');
P('- ' + S.tokens.shape.map(t => t[0] + ' ' + t[1]).join('; ') + '.');
P('- ' + S.tokens.numbers);
P('');

P('## Status colours');
P('');
P('Fixed. Do not reinterpret per screen. Colour describes what the record is');
P('doing; the accent is graphite precisely so these stay meaningful.');
P('');
P('| status | pill | dot | meaning |');
P('|---|---|---|---|');
S.status.forEach(s => P('| ' + s.s + ' | `' + s.pill + '` | `' + s.dot + '` | ' + s.why + ' |'));
P('');

P('## Components');
P('');
P('One line each, with the variant ids that entry has. The markup for one variant');
P('is at /r/<id>/<variant>.html and the rules, anatomy and accessibility notes for');
P('a component are at /r/<id>.json. Fetch those before building anything, rather');
P('than reconstructing a component from the one-line description here: the');
P('description tells you which one to fetch, not what it looks like.');
P('');
P('This list is a closed set, not a starting point. If what you are about to build');
P('is on it, you must build it from the registry entry rather than from scratch.');
P('That applies hardest to Layout: those entries are whole screens, and a screen');
P('that is one of them is assembled from that entry, not redrawn.');
P('');
P('If what you need is not on this list, it does not exist yet. Stop and flag it —');
P('name the thing and what it has to do, and let a person add it to the framework.');
P('Do not invent a component or a layout, and do not approximate one out of the');
P('parts of another. Handing back a screen with a gap and a question is correct;');
P('handing back a screen with an invented component in it is not.');
P('');
P('Variants work the same way. Each entry below lists the variant ids it has, and');
P('that list is closed too. Editing the labels, figures and records inside a');
P('variant is expected. Reshaping one into a state, density or arrangement that is');
P('not listed is a new variant, so flag it and let a person add it rather than');
P('keeping it to yourself in one screen.');
P('');
S.categories.forEach(cat => {
  const items = R.components.filter(c => c.category === cat.id);
  if (!items.length) return;
  P('### ' + cat.label);
  P('');
  items.forEach(c => {
    P('- **' + c.name + '** `' + c.id + '` — ' + c.description +
      ' Variants: ' + c.variants.map(v => v.id).join(', ') + '.');
  });
  P('');
});

P('## Machine-readable');
P('');
P('Cost is why this is split, so the cost is on the label. Fetch the smallest');
P('thing that answers the question.');
P('');
P('| endpoint | size | cost | what it is |');
P('|---|---|--:|---|');
P('| [r/index.json](r/index.json) | ' + fmtSize(idxBytes) + ' | ~' + fmtTok(idxBytes) +
  ' | The spec and every component summarised, with variant ids. No markup. The largest thing you are ever asked to fetch whole. |');
P('| `r/<id>.json` | median ' + fmtSize(compMed) + ', largest ' + fmtSize(compMax.bytes) +
  ' (`' + compMax.id + '`) | ~' + fmtTok(compMed) + ' / ~' + fmtTok(compMax.bytes) +
  ' | One component: rules, anatomy, behaviour, accessibility, and every variant with its html. |');
P('| `r/<id>/<variant>.html` | median ' + fmtSize(varMed) + ', largest ' + fmtSize(varMax.bytes) +
  ' (`' + varMax.id + '`) | ~' + fmtTok(varMed) + ' / ~' + fmtTok(varMax.bytes) +
  ' | The markup, raw. No JSON envelope, no escaping, paste as-is. |');
P('| [registry.json](registry.json) | ' + fmtSize(registryBytes) + ' | ~' + fmtTok(registryBytes) +
  ' | Everything at once. **Do not fetch this.** It is roughly ' +
  Math.round(tok(registryBytes) / 200000) + '× a 200k context window and exists only so older ' +
  'integrations do not break. |');
P('');
P('The component list above prints every variant id, so once you have read this');
P('file you can build a variant URL yourself and skip r/index.json entirely:');
P('`GET /r/button/primary.html` returns the markup for button/primary and nothing');
P('else. That is the common path — one read of llms.txt, then a few small ones.');
P('');

const llmsOut = L.join('\n');

/* which component pages actually exist on disk, so the index cannot advertise
   a page that has not been built yet */
const pagesDir = path.join(root, 'components');
/* only a page named after a component counts — a scratch file dropped in here
   should not turn up in the README as documentation */
const ids = new Set(R.components.map(c => c.id));
const built = fs.existsSync(pagesDir)
  ? fs.readdirSync(pagesDir)
      .filter(f => f.endsWith('.html'))
      .map(f => f.replace(/\.html$/, ''))
      .filter(id => ids.has(id))
  : [];

const kb = str => Math.round(Buffer.byteLength(str) / 1024);
const llmsKB = kb(llmsOut);
const countsOut =
  '/* generated by tools/build.js — do not edit */\n' +
  'window.COUNTS = ' + JSON.stringify({
    components: R.components.length,
    variants: R.components.reduce((a, c) => a + c.variants.length, 0),
    buildSteps: 0,
    pages: built.length,
    llmsKB,
    llmsLines: L.length,
    registryKB: kb(registryOut)
  }) + ';\n' +
  'window.INDEX = ' + JSON.stringify(R.components.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category,
    variants: c.variants.length,
    page: built.includes(c.id) ? 'components/' + c.id + '.html' : null
  }))) + ';\n';

/* ── README component table ─────────────────────────────────────────────────
   Generated between the markers so the table cannot drift from the registry.
   The prose around it is hand-written and left alone. */
const SITE = 'https://konfpa.github.io/konspec-ui';
const readmePath = path.join(root, 'README.md');
const readmeOnDisk = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';

const T = [];
T.push('## Components');
T.push('');
T.push('**' + R.components.length + ' components · ' +
       R.components.reduce((a, c) => a + c.variants.length, 0) + ' variants · ' +
       built.length + ' written up.** Every one of them is at ' +
       '`/r/<id>/<variant>.html`, written up or not — a page is documentation, ' +
       'not a precondition for using the markup. The [index](' + SITE + '/r/index.json) ' +
       'lists them all with their variant ids.');
T.push('');
S.categories.forEach(cat => {
  const items = R.components.filter(c => c.category === cat.id);
  if (!items.length) return;
  T.push('### ' + cat.label);
  T.push('');
  T.push('| Component | id | Variants | Page |');
  T.push('|---|---|--:|---|');
  items.forEach(c => {
    const page = built.includes(c.id)
      ? '[open](' + SITE + '/components/' + c.id + '.html)'
      : '—';
    T.push('| ' + c.name + ' | `' + c.id + '` | ' + c.variants.length + ' | ' + page + ' |');
  });
  T.push('');
});

const START = '<!-- components:start -->';
const END = '<!-- components:end -->';
let readmeOut = readmeOnDisk;
if (readmeOnDisk.includes(START) && readmeOnDisk.includes(END)) {
  readmeOut = readmeOnDisk.slice(0, readmeOnDisk.indexOf(START) + START.length) +
              '\n' + T.join('\n') + '\n' +
              readmeOnDisk.slice(readmeOnDisk.indexOf(END));
}

/* ── focus lint ────────────────────────────────────────────────────────────
   Two failures that both measure as styled and render as nothing. A ring is a
   box-shadow and forced-colours mode drops every box-shadow; and Tailwind
   resolves outline-style through a variable, so outline-none on an element
   silences its own focus outline while leaving width and colour set. */
const focusProblems = [];
for (const c of R.components) for (const v of c.variants) {
  const halo = v.code.match(/(?:peer-|group-)?focus(?:-visible|-within)?:ring-\d/g);
  if (halo) focusProblems.push(c.id + '/' + v.id + ': focus ring (' + [...new Set(halo)].join(' ') + '), use outline-*');
  for (const m of v.code.matchAll(/class="([^"]*)"/g)) {
    const cls = m[1];
    if (/(?:^|\s)outline-none(?:\s|$)/.test(cls) && /focus[a-z-]*:-?outline-\d/.test(cls))
      focusProblems.push(c.id + '/' + v.id + ': outline-none cancels this element\'s own focus outline');
  }
}
if (focusProblems.length) {
  console.error('FOCUS LINT failed:');
  [...new Set(focusProblems)].forEach(f => console.error('  ' + f));
  process.exit(1);
}

/* the size README quotes sits outside the generated block, so patch it here
   rather than leave a number nobody rebuilds */
readmeOut = readmeOut.replace(/`llms\.txt` is \d+ KB/, '`llms.txt` is ' + llmsKB + ' KB');

const outputs = [
  ['README.md',         readmeOut],
  ['registry.json',     registryOut],
  ['llms.txt',          llmsOut],
  ['assets/counts.js',  countsOut],
];

/* ── /r on disk ────────────────────────────────────────────────────────────
   Wiped and rewritten every build. A stale endpoint left behind by a renamed
   variant is worse than a missing one: an agent will fetch it, get markup that
   no longer exists anywhere in the source, and paste it. --check therefore has
   to catch files the build no longer emits, not just files whose contents
   drifted, or a stale r/ passes a green check. */
const rDir = path.join(root, 'r');

function walk(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, base, out);
    else out.push(path.relative(root, abs).split(path.sep).join('/'));
  }
  return out;
}

function syncR(check) {
  const onDisk = new Set(walk(rDir));
  const problems = [];

  for (const [rel, content] of rFiles) {
    const abs = path.join(root, rel);
    const cur = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    if (cur !== content) problems.push(cur === null ? rel + ' (missing)' : rel);
    onDisk.delete(rel);
  }
  for (const orphan of onDisk) problems.push(orphan + ' (no longer generated)');

  if (check) return problems;

  if (problems.length) {
    fs.rmSync(rDir, { recursive: true, force: true });
    for (const [rel, content] of rFiles) {
      const abs = path.join(root, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content);
    }
  }
  return problems;
}

const check = process.argv.includes('--check');
let stale = [];
for (const [rel, content] of outputs) {
  const abs = path.join(root, rel);
  const onDisk = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  if (onDisk === content) continue;
  stale.push(rel);
  if (!check) fs.writeFileSync(abs, content);
}

const rProblems = syncR(check);
if (rProblems.length) {
  stale.push('r/ (' + rProblems.length + ' file' + (rProblems.length === 1 ? '' : 's') + ')');
}

if (check) {
  if (stale.length) {
    console.error('STALE — these do not match assets/spec.js + assets/reg/*.js:');
    stale.forEach(f => console.error('  ' + f));
    rProblems.slice(0, 20).forEach(f => console.error('    ' + f));
    if (rProblems.length > 20) console.error('    … and ' + (rProblems.length - 20) + ' more');
    console.error('\nRun: node tools/build.js');
    process.exit(1);
  }
  console.log('generated files are current (' + outputs.map(o => o[0]).join(', ') + ', r/ — ' + rFiles.size + ' files)');
  process.exit(0);
}

console.log('pages built : ' + (built.join(', ') || 'none'));
console.log('rewritten   : ' + (stale.join(', ') || 'nothing changed'));

console.log('groups      : ' + groups.join(', '));
console.log('components  : ' + R.components.length);
console.log('variants    : ' + R.components.reduce((a, c) => a + c.variants.length, 0));
console.log('llms.txt    : ' + L.length + ' lines, ' + (fs.statSync(path.join(root,'llms.txt')).size/1024).toFixed(1) + ' KB');
console.log('registry    : ' + (fs.statSync(path.join(root,'registry.json')).size/1024).toFixed(1) + ' KB');
