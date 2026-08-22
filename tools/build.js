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
  status_meanings: {
    note: S.statusMeanings.d,
    dots: S.statusMeanings.map.reduce((acc, [dot, means]) => { acc[dot] = means; return acc; }, {}),
    verdicts: S.statusMeanings.note
  },
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
/* The worked example is taken from a real component and its first real
   variant, never written as a literal. A hand-typed example is a URL nobody
   builds and nobody tests: the last one said button/primary, which has never
   existed, and it sat in the paragraph telling agents they can construct
   URLs, so it was the one line a model would pattern-match on. */
const ex = json.components.find(c => c.id === 'button') || json.components[0];
const exUrl = ex.id + '/' + ex.variants[0].id;
const withDefault = json.components.filter(c => c.variants.some(v => v.id === 'default')).length;
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
P(S.statusMeanings.d);
P('');
P('| dot | what it means |');
P('|---|---|');
S.statusMeanings.map.forEach(([dot, means]) => P('| `' + dot + '` | ' + means + ' |'));
P('');
P(S.statusMeanings.note);
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
P('`GET /r/' + exUrl + '.html` returns the markup for ' + exUrl + ' and nothing');
P('else. That is the common path — one read of llms.txt, then a few small ones.');
P('');
P('Read the ids; do not guess them. Only ' + withDefault + ' of the ' + json.components.length +
  ' components have a variant');
P('called `default`, and ' + (json.components.length - withDefault) + ' do not, so a guessed URL is a 404 rather');
P('than a fallback. The ids are listed above precisely because they are not');
P('predictable from the component name.');
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
  /* description rides along so the landing page can search on what a component
     is for, not only what it is called: somebody looking for a date picker
     types "date", and calendar is the answer whether or not the word is in the
     name. It costs ~9 KB, the one field worth carrying on every page. Variant
     ids are deliberately left out: another ~18 KB for terms nobody searches. */
  'window.INDEX = ' + JSON.stringify(R.components.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category,
    description: c.description,
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
/* ── hover lint ────────────────────────────────────────────────────────────
   A hover fill equal to the fill behind it is not a subtle hover, it is no
   hover: the control loses its surface and the one thing the cursor is on
   reads as less present than the things it is not on. Caught in the wild as a
   white toolbar button on the zinc-100 page hovering to zinc-100, which left
   a hairline border with a hole in it.

   The model, and the same split the tinted-shape rule draws:

     solid fill of its own  one step deeper, always. zinc-700 to zinc-800,
                            red-600 to red-700, zinc-200 to zinc-300.
     shape                  self-sized, rounded on every corner — a button, an
                            icon button, a trigger, a chip. Takes the chip fill
                            zinc-200 wherever it sits, because it has to read
                            against whatever it is dropped onto. White on white
                            is the exception that stays zinc-100, and a shape
                            already on a zinc-200 track steps to zinc-300.
     surface                a full-bleed band — a table row, a menu item, a
                            sidebar link, a strip member whose corners are
                            shared with its wrapper. Steps once off the band it
                            crosses: zinc-100 in a white panel, zinc-200 on the
                            page.

   One exception, and it is the reason this lint was widened. A selectable tile
   — an option card, an answer tile, a radio band — marks SELECTED with the
   tinted-shape token has-[:checked]:bg-zinc-200. Hover cannot also be zinc-200
   there, because hovering an unselected tile would then be indistinguishable
   from a selected one, which is a worse defect than a soft hover. Those tiles
   take zinc-50 from white, and they scope the hover to :not(:has(:checked)) so
   it cannot fight the selected fill. Detected here rather than exempted by
   hand, so a tile that does NOT mark selection still has to obey the model. */
const STEP = { 'bg-white': 'bg-zinc-100', 'bg-zinc-50': 'bg-zinc-100',
               'bg-zinc-100': 'bg-zinc-200', 'bg-zinc-200': 'bg-zinc-300',
               'bg-zinc-300': 'bg-zinc-400', 'bg-zinc-700': 'bg-zinc-800',
               'bg-zinc-800': 'bg-zinc-900', 'bg-zinc-900': 'bg-zinc-800',
               'bg-red-600': 'bg-red-700' };
const wantHover = (surface, resting, isShape) => {
  if (resting && resting !== 'bg-white') return STEP[resting] || null;
  if (!isShape) return STEP[surface || 'bg-zinc-100'] || null;
  if (resting === 'bg-white')
    return surface === 'bg-white' ? 'bg-zinc-100' : (STEP[surface] || 'bg-zinc-200');
  if (surface === 'bg-zinc-200') return 'bg-zinc-300';
  if (surface === 'bg-zinc-900' || surface === 'bg-zinc-800') return 'bg-zinc-800';
  return 'bg-zinc-200';
};
/* Comments carry stray tags, so they come out before the tag stack is walked;
   left in, one </div> inside a comment pops a surface that is still open and
   every element after it is measured against the wrong background. */
const VOIDT = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|path|circle|rect|line|polyline|polygon|ellipse|use|stop)$/i;
const hoverProblems = [];
for (const c of R.components) for (const v of c.variants) {
  const src = v.code.replace(/<!--[\s\S]*?-->/g, '');
  const stack = [], ctx = [];
  const re = /<(\/?)([a-z0-9-]+)((?:"[^"]*"|'[^']*'|[^>'"])*?)(\/?)>/gi;
  let m;
  while ((m = re.exec(src))) {
    const [, close, tag, attrs, self] = m;
    if (close) { stack.pop(); ctx.pop(); continue; }
    const cls = (attrs.match(/(?<![:\w-])class="([^"]*)"/) || [])[1] || '';
    const resting = (cls.match(/(?:^|\s)(bg-(?:white|zinc-\d+|red-\d+))(?:\s|$)/) || [])[1] || null;
    /* the boundary is whitespace OR a colon: a hover written inside an arbitrary
       variant — [&:not(:has(:checked))]:hover:bg-zinc-50 — is still a hover, and
       for a long time this lint could not see one. group-hover: and peer-hover:
       stay excluded, because the character before hover: there is a hyphen. */
    const hov = (cls.match(/(?:^|\s|:)(?:enabled:)?hover:(bg-(?:white|zinc-\d+|red-\d+))/) || [])[1];
    const surface = [...stack].reverse().find(Boolean) || 'bg-zinc-100';
    /* rounded on one side only means the other corners belong to a wrapper */
    const partial = /\brounded-[lrtbse]-/.test(cls) || /\brounded-[lrtb][lrtb]-/.test(cls);
    const isShape = /\brounded-/.test(cls) && !partial && !/\bw-full\b/.test(cls)
                    && !/^(tr|li)$/i.test(tag) && !ctx.some(Boolean);
    /* the fill this element uses to mean SELECTED is spoken for — see the note above */
    const selectedFill = (cls.match(/:checked\]:(bg-(?:white|zinc-\d+))/) || [])[1] || null;
    if (hov) {
      const id = c.id + '/' + v.id;
      if (hov === surface)
        hoverProblems.push(id + ': hover:' + hov + ' is the fill behind it — the control dissolves');
      else {
        let want = wantHover(surface, resting, isShape);
        /* Hover has to differ from the resting fill AND from the selected fill, or
           hovering an unselected tile looks exactly like a selected one. Off white,
           that leaves zinc-50 — which is why every selectable tile and band in the
           library reaches for it, and why this lint used to disagree with all of them. */
        if (selectedFill && (resting || surface) === 'bg-white') want = 'bg-zinc-50';
        if (want && want !== hov)
          hoverProblems.push(id + ': ' + (isShape ? 'shape' : 'row') + ' on ' + surface +
                             ' resting ' + (resting || 'none') + ' hovers to ' + hov +
                             ', model says ' + want);
      }
    }
    if (!self && !VOIDT.test(tag)) {
      stack.push(resting);
      ctx.push(/role="(menu|menubar|listbox|list|tablist|radiogroup)"/.test(attrs)
               || /^(nav|ul|ol|tbody|table|menu)$/i.test(tag));
    }
  }
}

/* ── endpoint lint ─────────────────────────────────────────────────────────
   Every concrete /r/ URL printed in llms.txt has to resolve to a file this
   build actually emits. A worked example that 404s is worse than none: it sits
   in the paragraph telling agents they can construct URLs, so it is the line
   they pattern-match on, and variant ids are not guessable (23 of 55
   components have no `default`). Placeholders like <id> are skipped. */
const badLinks = [];
for (const m of llmsOut.matchAll(/\/r\/([a-z0-9][a-z0-9-]*)\/([a-z0-9][a-z0-9-]*)\.html/g)) {
  const rel = 'r/' + m[1] + '/' + m[2] + '.html';
  if (!rFiles.has(rel)) badLinks.push(m[0] + ' — no such endpoint');
}
for (const m of llmsOut.matchAll(/\/r\/([a-z0-9][a-z0-9-]*)\.json/g)) {
  const rel = 'r/' + m[1] + '.json';
  if (m[1] !== 'index' && !rFiles.has(rel)) badLinks.push(m[0] + ' — no such endpoint');
}
if (badLinks.length) {
  console.error('ENDPOINT LINT failed — llms.txt points at URLs this build does not emit:');
  [...new Set(badLinks)].forEach(f => console.error('  ' + f));
  process.exit(1);
}

if (focusProblems.length) {
  console.error('FOCUS LINT failed:');
  [...new Set(focusProblems)].forEach(f => console.error('  ' + f));
  process.exit(1);
}

/* ── template lint ─────────────────────────────────────────────────────────
   Django does not know what an HTML comment is. It compiles the whole file, so
   a template tag written as prose inside <!-- --> executes: {% comment %} opens
   a real block and swallows the template to the next {% endcomment %}, a bare
   {% if %} raises Unclosed tag, {% empty %} outside a for raises Invalid block
   tag, {% extends %} silently reparents, {% include %} tries to resolve. Nine
   entries shipped with the first of those, and the worst of them was the
   preamble WARNING about the {# #} trap, which mentioned {% comment %} in
   prose. Name tags in words inside a comment, or write them without braces.

   Also here: a filter that needs a {% load %} in the same fragment, because a
   template is compiled per file and a load in a base or a sibling does nothing;
   a multi-line {# #}, which is not a comment at all since tag_re has no DOTALL;
   and a focus trap that renders open, which traps the whole component gallery
   page and makes every other variant on it unreachable. */
const LIVE_OK = /^(load|csrf_token|url|static|now|spaceless|endspaceless)\b/;
const NEEDS_LOAD = { humanize: ['intcomma','naturaltime','naturalday','intword','ordinal','apnumber'],
                     money: ['rupees'], ui: ['status_dot'] };
const tplProblems = [];
for (const c of R.components) for (const v of c.variants) {
  const id = c.id + '/' + v.id;
  for (const m of v.code.matchAll(/<!--[\s\S]*?-->/g))
    for (const t of m[0].matchAll(/\{%\s*([a-z_]+)[^%]*%\}/g))
      if (!LIVE_OK.test(t[1]))
        tplProblems.push(id + ': ' + t[0].trim() + ' written as prose inside an HTML comment — Django executes it');
  for (const m of v.code.matchAll(/\{#(?![^#]*#\})[\s\S]{0,400}?#\}/g))
    if (m[0].includes('\n'))
      tplProblems.push(id + ': multi-line {# #} — tag_re has no DOTALL, so only the first line is a comment');
  for (const [lib, filters] of Object.entries(NEEDS_LOAD))
    for (const f of filters)
      if (new RegExp('\\|\\s*' + f + '\\b').test(v.code) &&
          !new RegExp('\\{%\\s*load\\b[^%]*\\b' + lib + '\\b').test(v.code))
        tplProblems.push(id + ': uses |' + f + ' with no {% load ' + lib + ' %} in the same fragment');
  for (const m of v.code.matchAll(/x-trap[.\w]*="([a-zA-Z_$][\w]*)"/g))
    if (new RegExp(m[1] + '\\s*:\\s*true').test(v.code))
      tplProblems.push(id + ': x-trap on "' + m[1] + '" is initialised true — it traps the whole gallery page');
}
/* ── sr-only escape lint ───────────────────────────────────────────────────
   sr-only is position:absolute. With no positioned ancestor it resolves against
   the document, escapes whatever was clipping it, and stretches the PAGE — a
   390px overflow whose cause is invisible, because the element doing it cannot
   be seen. It has now done this in popover (390 to 510), board (390 to 1129),
   compare-page (390 to 823) and table/sticky-both. The fix is `relative` on the
   scroller. So: between an sr-only element and its nearest clipping ancestor
   there must be something positioned. */
/* Only a HORIZONTAL scroller can do the damage. sr-only is a 1px box, so it
   never widens anything by itself — what widens the page is its static
   POSITION: deep inside content wider than the viewport, resolved against the
   document instead of against the scroller. A plain overflow-hidden card is
   never wider than itself, so nothing escapes it. */
const CLIP = /\boverflow-x-(?:auto|scroll)\b|\boverflow-(?:auto|scroll)\b/;
const POS  = /\b(?:relative|absolute|fixed|sticky)\b/;
const srProblems = [];
for (const c of R.components) for (const v of c.variants) {
  const src = v.code.replace(/<!--[\s\S]*?-->/g, '');
  const stack = [];
  const re = /<(\/?)([a-z0-9-]+)((?:"[^"]*"|'[^']*'|[^>'"])*?)(\/?)>/gi;
  let m;
  while ((m = re.exec(src))) {
    const [, close, tag, attrs, self] = m;
    if (close) { stack.pop(); continue; }
    const cls = (attrs.match(/(?<![:\w-])class="([^"]*)"/) || [])[1] || '';
    const node = { clip: CLIP.test(cls), pos: POS.test(cls) };
    if (/\bsr-only\b/.test(cls)) {
      /* walk out to the nearest clipping ancestor, looking for anything positioned */
      let positioned = node.pos;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].pos) positioned = true;
        if (stack[i].clip) {
          if (!positioned)
            srProblems.push(c.id + '/' + v.id + ': an sr-only element inside a scroller with nothing positioned between them — it escapes the clip and widens the page');
          break;
        }
      }
    }
    if (!self && !/^(br|hr|img|input|meta|link|source|area|base|col|embed|track|wbr)$/i.test(tag)) stack.push(node);
  }
}
if (srProblems.length) {
  console.error('SR-ONLY LINT failed — position:absolute with no positioned ancestor:');
  [...new Set(srProblems)].forEach(f => console.error('  ' + f));
  process.exitCode = 1;
}

if (tplProblems.length) {
  console.error('TEMPLATE LINT failed — these snippets cannot be pasted:');
  [...new Set(tplProblems)].forEach(f => console.error('  ' + f));
  process.exitCode = 1;
}

if (hoverProblems.length) {
  console.error('HOVER LINT failed — a hover fill must never equal the fill behind it:');
  [...new Set(hoverProblems)].forEach(f => console.error('  ' + f));
  process.exit(1);
}

/* the size README quotes sits outside the generated block, so patch it here
   rather than leave a number nobody rebuilds */
readmeOut = readmeOut.replace(/`llms\.txt` is \d+ KB/, '`llms.txt` is ' + llmsKB + ' KB');

/* same for the header badges — a hand-kept count in a badge is a count that is
   wrong by the next component, and it is the first thing anyone reads */
const nVariants = R.components.reduce((a, c) => a + c.variants.length, 0);
readmeOut = readmeOut
  .replace(/badge\/components-\d+-/, 'badge/components-' + R.components.length + '-')
  .replace(/badge\/variants-\d+-/,   'badge/variants-' + nVariants + '-');

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
