/* ─────────────────────────────────────────────────────────────────────────────
   Konspec UI — the specification.
   The landing page renders from this. tools/build.js generates llms.txt and
   registry.json from this. There is no second copy of any of it.
   ───────────────────────────────────────────────────────────────────────────── */
window.SPEC = {

  meta: {
    name: 'Konspec UI',
    version: '0.1.0',
    tagline: 'A component library written for the agent building your app.',
    purpose: 'Copy-paste HTML components for internal data applications. Light theme only.',
    audience: 'AI coding agents first, humans second.'
  },

  stack: {
    css:   'Tailwind CSS v4 — utility classes only. No component CSS, no @apply, no custom colour tokens.',
    js:    'Alpine.js 3 for local UI state, plus two official plugins — @alpinejs/collapse for animated panels and @alpinejs/focus for dialog focus traps. Both load before Alpine core. State lives on the component root, never in a global store.',
    server:'htmx for partial swaps. Alpine does not fetch.',
    charts:'Chart.js 4 via CDN, pinned, and only on pages that plot something. Colours are read out of the DOM at init, never written as hex: series from the HTML legend swatches, grid from the card border.',
    icons: 'Lucide via CDN — <i data-lucide="name"></i>, hydrated by lucide.createIcons().',
    build: 'None. Snippets are plain HTML and paste into Django, Flask or a static file unchanged.'
  },

  /* what an agent does, in order, before writing markup */
  protocol: [
    { t: 'Read llms.txt',
      d: 'The stack, the tokens and the hard rules in one file, generated from the same source as this page. It is short. Read all of it.',
      code: 'GET /llms.txt' },
    { t: 'Fetch registry.json and copy verbatim',
      d: 'Every component and every variant, with exact HTML. Copy the string. Do not paraphrase markup you have already been handed, and do not reformat it into your own idiom.',
      code: 'GET /registry.json  →  components[].variants[].html' },
    { t: 'Match the reference implementation',
      d: 'A complete procurement dashboard built only from these components. When the docs and a real screen disagree about spacing or hierarchy, the screen wins.',
      code: 'GET /reference/' },
    { t: 'Ask rather than choose',
      d: 'If a colour, size or pattern is not defined here, it does not exist yet. Adding one is a decision for a person, not a default you pick because the page looked empty.',
      code: '// no new tokens without a human' }
  ],

  /* every one of these exists because breaking it produced a visible defect */
  rules: [
    { t: 'Stock Tailwind only',
      d: 'No custom CSS, no @theme colours, no arbitrary hex. Arbitrary values are for one-off sizes, never for colour.' },
    { t: 'Light theme only',
      d: 'There is no dark mode and none is planned. A second theme doubles the review surface for no benefit in an office tool.' },
    { t: 'Never bind Alpine on a Lucide icon',
      d: 'createIcons() replaces the <i> with an <svg>, destroying any :class on it. Bind on a wrapping span instead.' },
    { t: 'Never add cursor-pointer',
      d: 'Tailwind v4 preflight drops it from buttons. One base rule fixes every element; 300 utility classes do not.' },
    { t: 'Colour means data state',
      d: 'Red, amber and green describe what a record is doing. Never decoration, never a brand accent. They appear as a dot or an icon, never as a field of colour behind text.' },
    { t: 'The accent is graphite',
      d: 'zinc-700. Interactive text is zinc-900 plus an underline, not a colour.' },
    { t: 'Alerts are neutral',
      d: 'White card, zinc border, colour only in the icon. A full-width red field shouts louder than the overdue rows it describes.' },
    { t: 'Focus is an outline, never a ring',
      d: 'ring-* compiles to box-shadow, and forced-colours mode drops every box-shadow, so a ring is the one focus style guaranteed to vanish for the users who most need it. Write focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15, and take the negative offset when the control sits flush inside a scroller that would clip it. outline-none is allowed only on a field whose wrapper draws the outline for it, because Tailwind resolves outline-style through a variable: outline-none on the same element kills its own focus outline while leaving the width and colour set, which measures as styled and renders as nothing.' },
    { t: 'Every tinted shape carries its ring',
      d: 'A tinted shape is bg-zinc-200 with ring-1 ring-inset ring-zinc-300 — pills, chips, avatars, icon wells, all of them. A tinted surface is bg-zinc-100 — the page, selected rows, active nav, table headers. Give a shape the surface fill and it measures 1.00 contrast against the surface it sits on, which is not low contrast but the identical colour, and it disappears. One step of fill separates them and the ring holds the edge. Solid shapes need no ring, and it is ring rather than border so adding it reflows nothing.' },
    { t: 'Status colour lives in the dot',
      d: 'Every status pill is the same graphite shape — bg-zinc-200, ring-zinc-300, zinc-700 text, the same fill an avatar takes. What separates Open from Overdue is a 6px dot. A column of tinted pills reads as a traffic light and stops meaning anything by the twelfth row; a column of identical pills with one red dot in it reads at a glance. This is the alert rule — colour only in the marker — applied to a pill.' },
    { t: 'One shade per meaning',
      d: 'Info is zinc-400, success emerald-600, warning amber-700, danger red-600 — and a warning is amber-700 in a component and amber-500 only when it is a dot, because a 1.5px stroke and a 6px disc need different weights of the same colour. Nothing takes a -50 tint or a -200 ring: a coloured icon well is still bg-zinc-200 with ring-zinc-300. Pick the shade from the token table, never by eye.' },
    { t: 'Survive 390px',
      d: 'Tables become stacked cards. Nothing scrolls sideways on a phone, with one exception: a carousel, where the sideways scroll is the component itself, and which snaps and peeks so it never looks like a layout that broke.' },
    { t: 'No template x-for inside svg',
      d: 'It is parsed in the SVG namespace and has no .content. Use divs, or a conic-gradient for donuts.' },
    { t: 'x-cloak on anything hidden at first paint',
      d: 'Alpine boots after the HTML renders. Without it, every dropdown flashes on load.' },
    { t: 'Every text size carries its leading',
      d: 'text-[13px] compiles to font-size alone — arbitrary sizes emit no line-height, so the element silently inherits whatever an ancestor left. Always write the slash form, text-[13px]/5. Sizes come from the seven steps; only prose may take a looser leading than the default pairing.' },
    { t: 'Guard the Lucide re-hydration loop',
      d: 'createIcons() leaves data-lucide on the <svg> it generates, so re-running it on every DOM mutation re-renders every icon forever. Guard on document.querySelector("[data-lucide]:not(svg)") or animations stutter while the DOM never settles.' }
  ],

  tokens: {
    surfaces: [
      ['Page',        'bg-zinc-100', 'The scrolling page behind everything.'],
      ['Surface',     'bg-white',    'Cards, panels, sidebar, topbar, table bodies.'],
      ['Border',      'border-zinc-200', 'Card edges, table rules, input borders.'],
      ['Divider',     'border-zinc-100', 'Rows inside a card that is already bordered.']
    ],
    text: [
      ['Primary',   'text-zinc-900', 'Headings, values, anything you read first.'],
      ['Secondary', 'text-zinc-600', 'Labels, descriptions, secondary copy.'],
      ['Tertiary',  'text-zinc-500', 'Timestamps, hints, placeholder text.'],
      ['On dark',   'text-zinc-400', 'The scale inverts on a zinc-900 band — the footer, the agent handoff. Darkening secondary text there makes it less readable, not more.']
    ],
    accent: [
      ['Solid', 'bg-zinc-700', 'Primary buttons, progress fills, chart bars, the active nav marker.'],
      ['Hover', 'bg-zinc-800', 'Hover state of anything accent-filled.'],
      ['Tint',  'bg-zinc-100', 'Selected rows, active nav, table headers — surfaces, never shapes.'],
      ['Chip',  'bg-zinc-200', 'Every tinted shape sitting on the page: badges, avatars, icon wells. One step deeper than the page so it has a fill of its own, and one step deeper again for its ring.'],
      ['Link',  'text-zinc-900 underline underline-offset-2', 'Interactive text. Colour is not the signal — the underline is.']
    ],
    /* One shade per meaning, and the same shade wherever that meaning appears.
       The four alert severities fix it; every other component borrows from here. */
    semantic: [
      ['Info',    'info',            'text-zinc-500',   'Neutral notice. Grey, because nothing is wrong.'],
      ['Success', 'check-circle-2',  'text-emerald-600', 'Finished, posted, sent. Same green as the Closed dot.'],
      ['Warning', 'alert-triangle',  'text-amber-700',   'Waiting, expiring, over a limit. 700 for marks you read — a 1.5px amber-500 stroke on white is illegible.'],
      ['Danger',  'alert-circle',    'text-red-600',     'Overdue, failed, destructive. Same red as the Overdue dot.']
    ],
    /* Dots and fills are shapes, not strokes, so warning takes the lighter amber. */
    semanticFill: [
      ['Success', 'bg-emerald-600', 'Status dot, presence dot, healthy indicator.'],
      ['Warning', 'bg-amber-500',   'Status dot only. There is no amber fill larger than 6px.'],
      ['Danger',  'bg-red-600',     'Status dot, notification dot, an overdue progress bar, the destructive button — hover:bg-red-700.']
    ],
    /* Rejected: bg-red-50 / bg-amber-50 / ring-red-200. A tinted shape is
       bg-zinc-200 + ring-zinc-300 whatever it means; the colour is the icon inside it. */
    ramp: [
      ['white',    'bg-white ring-1 ring-inset ring-zinc-200'],
      ['zinc-50',  'bg-zinc-50'],
      ['zinc-100', 'bg-zinc-100'],
      ['zinc-200', 'bg-zinc-200'],
      ['zinc-400', 'bg-zinc-400'],
      ['zinc-700', 'bg-zinc-700'],
      ['zinc-900', 'bg-zinc-900']
    ],
    type: [
      ['text-[11px]/4', 'uppercase labels, counts, badge text'],
      ['text-[12px]/4', 'help text, timestamps, secondary lines'],
      ['text-[13px]/5', 'buttons, table cells, default component text'],
      ['text-[14px]/5', 'body copy, inputs, prose'],
      ['text-[16px]/6', 'card, dialog and panel titles'],
      ['text-[20px]/7', 'section headings, error page titles'],
      ['text-[24px]/7', 'page titles, KPI figures']
    ],
    weight: [
      ['font-normal',   '400', 'body copy, table cells, anything you read as a sentence'],
      ['font-medium',   '500', 'anything that labels or acts — buttons, table headers, alert titles, nav items'],
      ['font-semibold', '600', 'headings, KPI figures, panel titles']
    ],
    tracking: [
      ['tracking-wider', '11px uppercase labels only'],
      ['tracking-tight', 'headings at 20px and above'],
      ['normal',         'everywhere else. No arbitrary em values.']
    ],
    shape: [
      ['rounded-lg',   'controls'],
      ['rounded-xl',   'panels'],
      ['rounded-full', 'pills'],
      ['36–44px',      'control height']
    ],
    numbers: 'Every number gets tabular-nums, without exception. Columns of figures that do not line up are a bug.'
  },

  /* fixed by themes/10-triage.html. Three agents each invented their own version
     of this when it was left unstated; one put Overdue in amber. */
  /* One pill, five dots. The pill class is identical on every row — what changes
     between Open and Overdue is six pixels of colour. */
  status: [
    { s: 'Open',     pill: 'bg-zinc-200 text-zinc-700 ring-1 ring-inset ring-zinc-300', dot: 'bg-zinc-500',    why: 'The ordinary case' },
    { s: 'Approved', pill: 'bg-zinc-200 text-zinc-700 ring-1 ring-inset ring-zinc-300', dot: 'bg-amber-500',   why: 'Waiting on someone' },
    { s: 'Overdue',  pill: 'bg-zinc-200 text-zinc-700 ring-1 ring-inset ring-zinc-300', dot: 'bg-red-600',     why: 'The alarm state' },
    { s: 'Closed',   pill: 'bg-zinc-200 text-zinc-700 ring-1 ring-inset ring-zinc-300', dot: 'bg-emerald-600', why: 'Finished' },
    { s: 'Draft',    pill: 'bg-zinc-200 text-zinc-600 ring-1 ring-inset ring-zinc-300', dot: 'bg-zinc-400',    why: 'Not real yet' }
  ],

  categories: [
    { id: 'actions',    label: 'Actions' },
    { id: 'forms',      label: 'Forms' },
    { id: 'data',       label: 'Data display' },
    { id: 'feedback',   label: 'Feedback' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'layout',     label: 'Layout' }
  ]
};
