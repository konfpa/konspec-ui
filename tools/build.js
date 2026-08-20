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
const registryOut = JSON.stringify(json, null, 2) + '\n';

/* ── llms.txt ──────────────────────────────────────────────────────────────── */
const L = [];
const P = (...lines) => L.push(...lines);

P('# ' + S.meta.name);
P('');
P('> ' + S.meta.purpose + ' ' + S.meta.tagline);
P('');
P('You are reading the entry point for this design system. It is written for agents.');
P('Read all of it before writing markup for a Konspec application, then fetch');
P('registry.json and copy component HTML from it verbatim.');
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
P('One line each. When-to-use notes, per-component rules and the exact markup for');
P('every variant are in registry.json under the matching id — fetch that before');
P('building anything, rather than reconstructing a component from its description.');
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
P('- [registry.json](registry.json) — every component, every variant, exact HTML.');
P('');

const llmsOut = L.join('\n');

/* which component pages actually exist on disk, so the index cannot advertise
   a page that has not been built yet */
const pagesDir = path.join(root, 'components');
const built = fs.existsSync(pagesDir)
  ? fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, ''))
  : [];

const countsOut =
  '/* generated by tools/build.js — do not edit */\n' +
  'window.COUNTS = ' + JSON.stringify({
    components: R.components.length,
    variants: R.components.reduce((a, c) => a + c.variants.length, 0),
    dependencies: 0,
    pages: built.length
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
       built.length + ' written up.** Every one of them is in ' +
       '[registry.json](' + SITE + '/registry.json), written up or not — a page is documentation, ' +
       'not a precondition for using the markup.');
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

const outputs = [
  ['README.md',         readmeOut],
  ['registry.json',     registryOut],
  ['llms.txt',          llmsOut],
  ['assets/counts.js',  countsOut],
];

const check = process.argv.includes('--check');
let stale = [];
for (const [rel, content] of outputs) {
  const abs = path.join(root, rel);
  const onDisk = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  if (onDisk === content) continue;
  stale.push(rel);
  if (!check) fs.writeFileSync(abs, content);
}

if (check) {
  if (stale.length) {
    console.error('STALE — these do not match assets/spec.js + assets/reg/*.js:');
    stale.forEach(f => console.error('  ' + f));
    console.error('\nRun: node tools/build.js');
    process.exit(1);
  }
  console.log('generated files are current (' + outputs.map(o => o[0]).join(', ') + ')');
  process.exit(0);
}

console.log('pages built : ' + (built.join(', ') || 'none'));
console.log('rewritten   : ' + (stale.join(', ') || 'nothing changed'));

console.log('groups      : ' + groups.join(', '));
console.log('components  : ' + R.components.length);
console.log('variants    : ' + R.components.reduce((a, c) => a + c.variants.length, 0));
console.log('llms.txt    : ' + L.length + ' lines, ' + (fs.statSync(path.join(root,'llms.txt')).size/1024).toFixed(1) + ' KB');
console.log('registry    : ' + (fs.statSync(path.join(root,'registry.json')).size/1024).toFixed(1) + ' KB');
