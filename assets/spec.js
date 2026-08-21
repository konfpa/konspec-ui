/* ─────────────────────────────────────────────────────────────────────────────
   Konspec UI — the specification.
   The landing page renders from this. tools/build.js generates llms.txt and
   registry.json from this. There is no second copy of any of it.
   ───────────────────────────────────────────────────────────────────────────── */
window.SPEC = {

  meta: {
    name: 'Konspec UI',
    version: '0.3.0',
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

  /* Search synonyms for the landing page only. Not part of the specification
     and not emitted into llms.txt or the registry: this is what a person types
     into the filter box before they know what the library calls the thing.
     Someone looking for a "snackbar" has to land on toast, or the search says
     the component does not exist when it plainly does. Edit freely; a wrong
     entry here costs a confusing search result, nothing more. */
  searchAliases: {
    dialog:      'modal popup overlay confirm',
    'alert-dialog': 'modal confirm destructive are you sure',
    popover:     'popup flyout',
    tooltip:     'popup hint title',
    dropdown:    'menu popup contextmenu',
    toast:       'snackbar notification flash message',
    alert:       'notification banner callout notice',
    badge:       'chip tag pill label status',
    calendar:    'date picker datepicker day month',
    combobox:    'autocomplete typeahead search select',
    select:      'picker choose option',
    spinner:     'loading loader busy wait',
    skeleton:    'loading placeholder shimmer',
    progress:    'loading bar percent',
    'form-page': 'stepper wizard steps create edit',
    'list-detail': 'queue inbox master detail split',
    'app-shell': 'layout chrome frame sidebar topbar navigation',
    'data-table': 'grid datagrid rows sorting',
    sheet:       'slideover panel drawer',
    drawer:      'bottomsheet sheet slideup',
    avatar:      'profile picture initials user',
    marker:      'dot indicator status',
    separator:   'divider rule hr line',
    'empty-state': 'blank nothing zero no results',
    'error-page': '404 403 500 not found permission',
    'auth-page': 'login signin sign in password',
    attachment:  'file upload document',
    questionnaire: 'survey form questions',
    menubar:     'menu bar application menu',
    'navigation-menu': 'megamenu nav links',
    breadcrumbs: 'trail path where am i',
    'command-palette': 'cmdk quick open jump to search',
    'stat-card': 'kpi metric figure number',
    carousel:    'slider swipe gallery',
    collapsible: 'disclosure expand show more',
    accordion:   'faq expand collapse sections',
    toggle:      'switch on off',
    checkbox:    'tickbox multiple choice',
    radio:       'option single choice',
    textarea:    'multiline long text notes',
    'input-group': 'prefix suffix addon unit',
    'button-group': 'segmented toggle group',
    pagination:  'pager paging next previous',
    hovercard:   'preview peek',
    topbar:      'header appbar navbar',
    sidebar:     'nav rail drawer navigation',
    'page-header': 'title heading actions'
  },

  /* what an agent does, in order, before writing markup */
  protocol: [
    { t: 'Read llms.txt',
      d: 'The stack, the tokens and the hard rules in one file, generated from the same source as this page. It is short. Read all of it.',
      code: 'GET /llms.txt' },
    { t: 'Fetch one variant at a time and copy verbatim',
      d: 'The response body of a variant endpoint is the markup itself: no JSON envelope, no escaping, nothing to parse. Copy the string. Do not paraphrase markup you have already been handed, and do not reformat it into your own idiom. llms.txt lists every component with its variant ids, so once you have read it you can build these URLs yourself and never need an index. Fetch r/<id>.json when you need a component\'s rules, anatomy or accessibility notes rather than its markup, and r/index.json only if you arrived without reading llms.txt.',
      code: 'GET /r/<id>/<variant>.html  →  the markup, ready to paste' },
    { t: 'Never fetch registry.json',
      d: 'It still exists and is still generated, so nothing that already points at it breaks, but it is the entire system in one response and it will not fit in your context: a few megabytes, several times a 200k window. An agent that fetches it gets a truncated file, and a truncated registry is worse than none, because the components that survived the cut look complete and the ones that did not look absent. This is stated as its own step because an agent told only to use the new endpoints will reach for the old file the moment the new ones look incomplete.',
      code: '// use /r/ — registry.json is back-compat only' },
    { t: 'Match the reference implementation',
      d: 'A complete procurement dashboard built only from these components. When the docs and a real screen disagree about spacing or hierarchy, the screen wins.',
      code: 'GET /reference/' },
    { t: 'Ask rather than choose',
      d: 'If a colour, size, pattern, component or layout is not defined here, it does not exist yet. Stop and flag it rather than filling the gap yourself: name what is missing and what it has to do, and let a person add it to the framework. Adding one is a decision for a person, not a default you pick because the page looked empty. An invented component is worse than a blocked screen, because it ships, gets copied, and never gets the accessibility work. This covers missing variants of components that do exist, not just missing components.',
      code: '// no new tokens, components or layouts without a human' }
  ],

  /* every one of these exists because breaking it produced a visible defect */
  rules: [
    { t: 'Use what is already here',
      d: 'Before writing any markup, look for it in the component list in llms.txt. If a component or a page layout is already defined, copy its markup from /r/<id>/<variant>.html — writing your own version of something the registry defines is the defect this rule exists to prevent, because two implementations of one thing drift apart and only one of them ever gets the accessibility work. The layout entries are mandatory, not examples: a screen with a title and actions is page-header, a create-or-edit screen is form-page, and a queue worked one record at a time is list-detail. The shell that holds all of them is the next rule, and it is not optional. If what you need is not here, stop and flag it: name the thing, say what it has to do, and let a person add it to the framework. Do not invent a component, a layout or a pattern to fill the gap, and do not ship a one-off approximation of one under another name. A missing entry is a decision for a person; an invented one is a defect that ships and then gets copied. The same applies one level down, to variants: if the component is here but the variant you need is not, flag that too. Changing the labels, figures and records inside a variant is expected and is what copying it is for; reshaping one into a state, density or arrangement the registry does not list is a new variant, and a new variant is an addition to the framework rather than a local edit.' },
    { t: 'Every signed-in screen is app-shell',
      d: 'This is the one layout decision that is already made, and it is not a default you may weigh against alternatives. If a signed-in user can reach the page, the page is app-shell with the screen\'s own content inside <main>, copied from /r/app-shell/default.html like any other component. There are exactly two exceptions, auth-page and error-page, and they are exceptions for a reason rather than by taste: the shell reads the navigation, the counts and the signed-in user out of context that a signed-out visitor or a failed request may not have. Do not assemble a shell of your own out of sidebar and topbar. Those entries document the shell\'s parts and exist so its own variants can be built; a hand-rolled sidebar-plus-topbar is a second implementation of app-shell, and two implementations of one thing drift apart while only one of them keeps the accessibility work. Do not ship a lighter shell for one screen, and do not start a page at <main> because the screen looked simple enough not to need chrome. The shell owns the skip link, the nav landmark, the off-canvas focus trap, the collapse persistence, the command palette and the keyboard shortcuts; a page that skips it loses every one of them silently and still reviews as fine, because everything it dropped is invisible until somebody uses a keyboard or a phone. The test is the response, not the screen: if a signed-in request returns a page, it is app-shell. An htmx partial swapped into a shell already on screen is not a page and must not repeat it.' },
    { t: 'Keep the data-kui attribute',
      d: 'Every variant\'s root element carries data-kui="<component>/<variant>" — badge/table, app-shell/default. It is the only way to find, in an application nobody has touched for a year, which markup came from this framework and which entry it came from: grep data-kui across the repo and every pasted component answers for itself. Keep it on the element you copied it onto, keep the value exactly as the registry gives it, and do not add one by hand to markup that is not a copy of that variant — a wrong id is worse than none, because the next person updating that component will trust it. It is inert: no styling, no behaviour, no script reads it at runtime. Updating from it is something you do when a person asks for it and never on your own initiative: grep data-kui across the application, and for each hit fetch /r/<component>/<variant>.html, which is always the current markup for that entry, and diff it against the pasted copy. Nothing records which copies are stale, and nothing needs to \u2014 the diff is the answer. What you carry across is the class list and the structure. What you leave alone is everything the application put there: the labels, the template variables and tags, the hx-* attributes, the Alpine state and handlers, the ids and the form field names. A component is a shape, not content, so replacing a pasted block wholesale with the registry version silently deletes the work that made it a real screen. Where the two disagree on structure rather than on classes, stop and say so rather than reshaping the copy to match: the local version may have been changed deliberately, and that is a question for a person.' },
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
      d: 'A tinted shape is bg-zinc-200 with ring-1 ring-inset ring-zinc-300 — pills, chips, avatars, icon wells, control tracks, the selected nav item, all of them. A tinted surface is bg-zinc-100 — the page, a selected row, the highlighted option in a menu — and a band recessed inside a white surface is bg-zinc-50, which is a table header or a zebra row. Give a shape the surface fill and it measures 1.00 contrast against the surface it sits on, which is not low contrast but the identical colour, and it disappears. One step of fill separates them and the ring holds the edge. Solid shapes need no ring, and it is ring rather than border so adding it reflows nothing.' },
    { t: 'Hover never lands on the surface behind it',
      d: 'A hover fill that equals the fill underneath it is not a subtle hover, it is no hover: the control loses its surface and the one thing the cursor is on reads as less present than the things it is not on. The page is bg-zinc-100, so a bordered white button sitting on the page cannot hover to zinc-100 \u2014 it dissolves and leaves its border behind. Two kinds of interactive thing, and the split is the same one the tinted-shape rule draws. A SHAPE is self-sized and rounded on every corner: a button, an icon button, a menu trigger, a chip. It hovers to the chip fill zinc-200 wherever it sits, because a shape has to read against whatever it is dropped onto \u2014 white if it rests white on a white card, and one step further to zinc-300 if it is already sitting on a zinc-200 track. A SURFACE is a full-bleed band: a table row, a menu item, a sidebar link, a member of a joined strip whose corners are shared with its wrapper. It steps once off the band it crosses, so zinc-100 inside a white panel and zinc-200 on the page. Anything with a solid fill of its own ignores all of this and steps one deeper: zinc-700 to zinc-800, red-600 to red-700, zinc-200 to zinc-300. node tools/build.js checks every variant against this and fails the build rather than warning, so the rule is not something anyone has to remember at the call site.' },
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
      ['Page',        'bg-zinc-100', 'The scrolling page behind everything. Nothing inside a white surface may take this fill — same hex twice is a 1.00 contrast, and the card reads as a hole.'],
      ['Surface',     'bg-white',    'Cards, panels, sidebar, topbar, table bodies.'],
      ['Recessed',    'bg-zinc-50',  'A band inside a white surface: table header, zebra row. Lighter than the page, so it can never be read as the page showing through.'],
      ['Edge',        'border-zinc-300', 'The outer edge of anything sitting on the page. White on zinc-100 is 1.10 and a zinc-200 edge is the first thing a washed-out panel drops.'],
      ['Border',      'border-zinc-200', 'Edges inside a surface: inputs, a strip that ends a region, a nested panel.'],
      ['Divider',     'border-zinc-100', 'Rows inside a card that is already bordered. On white only — on any tinted surface it computes to the surface.']
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
      ['Tint',  'bg-zinc-100', 'A selected row, the highlighted option in a menu — surfaces, never shapes.'],
      ['Chip',  'bg-zinc-200', 'Every tinted shape: badges, avatars, icon wells, control tracks, the selected nav item. One step deeper than the page so it keeps a fill of its own on either surface, and one deeper again for its ring.'],
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
      ['zinc-300', 'bg-zinc-300'],
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
