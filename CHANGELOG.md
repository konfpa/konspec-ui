# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`tools/sweep.js`**, and a CI job that runs it. It loads all 75 pages in
  headless Chromium, at 1280px and again at 390px, and fails on the defects
  `build.js` cannot see because they do not exist until the page runs: a console
  error or a 404 on a file this repo serves, a Lucide icon that never hydrated,
  an element still carrying `x-cloak` after Alpine initialised, a control that
  draws no focus outline, and a page wider than the phone. The focus check is
  the reason it exists — `build.js` reads class strings, so
  `has-[:focus-visible]:ring-3` slips past its regex, while focusing all 6,934
  controls one at a time under keyboard modality and reading the outline back
  off the rendered box does not care how the outline was written. It credits an
  outline drawn by a wrapper, which is where the whole forms group puts it.
  `npm ci` and `npx playwright install chromium` are a contributor's
  dependency; `node tools/build.js` is still plain Node with none.

### Changed

- The app-shell sidebar foot reads **Konspec Apps** rather than Konspec Gateway.

### Fixed

- The landing page's type-scale column was 599px wide at 390px and took the
  whole page out to 648px. A grid item will not shrink below its min-content
  without `min-w-0`, and the specimen row sets its own font size.

## [0.4.0] - 2026-08-22

### Added

- **Nineteen page layouts**, which take Layout from 9 components to 28 and the
  library from 55 components to 74: `container`, `dashboard`, `index-page`,
  `record-page`, `inbox-page`, `board`, `schedule-page`, `compare-page`,
  `reconcile-page`, `import-page`, `search-page`, `focus-page`,
  `settings-page`, `onboarding-page`, `audit-page`, `docs-page`,
  `document-page`, `label-sheet` and `portal-page`. Until now the library had
  the parts of a screen and almost none of the screens: the register, the
  record, the approval queue, the comparative statement and the import run
  were each assembled from scratch every time. `container` is the odd one out
  and derives rather than decides — the gutter is `p-4 lg:p-6` because none of
  its 86 occurrences take a step in between, and the grid ladder is `sm:` then
  `xl:` because there are 117 `sm:grid-cols-*` in the library and zero `md:`.
- **Printing**, which the library had no answer for at all. `document-page`
  puts a purchase order, a tax invoice, a challan and a GRN on A4, and
  `label-sheet` sizes bin, batch, pallet and QC-hold labels in millimetres
  because the stock in the printer is. With them comes a rule, *paper is a
  medium, not a breakpoint*, and the two findings behind it: backgrounds do
  not print, so a printed document cannot carry a status pill at all and the
  state has to become a word; and A4 is 794 CSS px, but the print dialog's
  Scale field moves the layout width, so at 50% every `lg:` rule switches on.
- **443 variants**, 417 → 860, spread across every group — forms 111 → 182,
  data display 80 → 139, feedback 75 → 140, navigation 64 → 115, actions
  25 → 44, and the rest with the new layouts. Every existing variant id
  survives, since those ids are public `/r` endpoint URLs. The thinnest
  entries got the most (command palette 1 → 10, sheet 2 → 10, dialog 3 → 10,
  drawer 3 → 11, accordion 3 → 10, data table 3 → 11), because they were
  written once early and never revisited, and what they were missing was the
  states a real console spends its day in: a panel whose fetch failed, a
  record locked because it is posted, a wait long enough to need a way out, a
  register with nothing in it as against nothing matching the filter. Six
  forms entries gained a `django` variant and nine gained `htmx`.
- **A New chip** beside the variant name on the component pages, so anyone
  returning to the docs can see what this release added rather than hunting
  it. It is built to be deleted: one `tagNew: true` on the variant object and
  one fenced `<template x-if="v.tagNew">` block per page, with the removal
  steps written into the fence. Nothing else reads the flag — it reaches no
  generated file and no `/r` endpoint.
- **Three rules**, each of which had been enforced by hand until now.
  *Hover never lands on the surface behind it*, which is the model the whole
  hover pass below was derived from. *A region may scroll sideways, the page
  may not*, with the three things a horizontal scroller has to carry. And the
  print rule above.
- **Four build lints** that fail the build rather than warn, so none of the
  defect classes this release fixed can come back. A hover that lands on its
  own surface; a Django tag written as prose inside an HTML comment, which
  Django executes; an `sr-only` span with nothing positioned between it and
  its scroller, which escapes the clip and widens the page; and a dialog that
  renders open with a live `x-trap`, which traps focus for every other
  component on the page. The hover rule text and its lint are driven by one
  function, so the documentation and its enforcement cannot drift.
- The status table gains **Cancelled, Pending and On hold**, and the five dots
  are now documented as *meanings* rather than as a row per word, so a verdict
  or a state the table does not list maps onto one without inventing a colour.
- `text-[32px]/9` joins the type scale: the step read at arm's length on a
  shop-floor screen, `focus-page` only and never more than one per screen.

### Changed

- **Hover is a stated model rather than a per-component decision.** The page
  is `bg-zinc-100`, so a bordered white control that hovered to `zinc-100`
  landed on exactly the surface behind it — the fill vanished, and the one
  control the cursor was on read as less present than the ones it was not on.
  150 hover targets across 83 variants in 31 components now follow one model:
  a control with a solid fill of its own steps one deeper; a shape takes the
  chip fill `zinc-200`, stays at `zinc-100` when it rests white on white, and
  steps to `zinc-300` on a `zinc-200` track; a surface steps once off the band
  it crosses. The same collision existed at rest, so locked and read-only
  field fills, selected checkbox and radio cards, image placeholder wells, the
  stat-card divider grid and inline code chips move off the page colour too.
  `drawer/actions` was the last `hover:bg-red-50` in the registry and is now
  neutral like everything else.
- **`Approved` means approved and awaiting delivery**, not awaiting approval,
  which is `Pending`. Six entries independently read it the other way, so the
  table now says so in as many words.
- **The app-shell sidebar foot** is a Konspec Gateway row — the same 36px row
  and 32px icon box as the nav above it, in its own named landmark — instead
  of a wordmark with the running version beside it. Collapsed, it centres on
  the rail at 34px like every other icon. A group label on the collapsed rail
  used to fade out and leave its height behind; a hairline now fades in over
  the same box, so the groups stay divided and nothing relays out.
- **Rule 2 admits four exceptions to `app-shell`**, not two: `portal-page` and
  `focus-page` join `auth-page` and `error-page`, under a narrow test — the
  shell has to be actively wrong for that reader, not merely unnecessary.
- The overlapping entries now say where their boundaries are, each from its
  own side: `dialog` is centred, `sheet` is the right edge at full height,
  `drawer` takes the top and bottom edges at content size, the left edge stays
  `sidebar/mobile`, and `alert-dialog` keeps confirming and destroying.
  `tooltip`, `hovercard` and `popover` do the same for hover hint, record
  preview and click-opened panel.
- Money takes a rupees filter rather than `|intcomma`, which returns
  `1,245,000` where an Indian register reads `12,45,000`.
- The two Django variants that were previewed as rendered HTML now open on the
  code tab. A browser has no template engine, so `{% if %}` and `{% else %}`
  both showed.

### Fixed

- **Thirty live Django tags written as prose inside HTML comments**, across 16
  components that shipped in earlier releases. Django does not know what an
  HTML comment is, so a `{% extends %}` or `{% include %}` in one is live and
  raises `TemplateDoesNotExist` the moment the snippet is pasted. Twenty-four
  multi-line `{# #}` comments across 10 variants had the matching problem:
  Django's tag regex is not DOTALL, so only the first line was a comment and
  the rest rendered into the page. Several templates also used `|intcomma`
  with no `{% load humanize %}`, which is a `TemplateSyntaxError` on paste.
- **Code that reads as working and does nothing.** `tabs/lazy` bound `hx-get`
  through Alpine inside `x-for`, and htmx never processes an element Alpine
  created after load, so the entry demonstrating lazy loading loaded nothing —
  no fetch, no error, no warning. `alert/django` contained no Django at all.
  `menubar`'s `first:border-t-0` could never match, because `x-for` inserts
  after the `<template>` and the first group is never `:first-child`.
  `chart/failed` targeted `closest [data-kui]`, so one failed plot inside a
  composed page swapped out every sibling region that had loaded.
- **Focus and naming, across the library.** `checkbox/cards` and `radio/cards`
  drew focus with a ring, and forced-colours mode drops every box-shadow, so
  the users the rule exists for got no focus mark at all. `button` declared no
  focus style on any of its eight variants while its own note claimed the
  opposite, and had no accessible name at all while busy. 37 required
  asterisks sat inside labels without `aria-hidden`, so a field announced as
  "Vendor star". Units and prefixes were on screen only and in no accessible
  name, so a tolerance of 2 announced as "2" and an item code lost its `KSP-`
  prefix. `attachment/single` carried two `<label for>` on one input.
  `label/states` left a read-only field tabbable with no indicator anywhere.
- **Keyboard reachability.** `calendar/range` and `calendar/presets` had no
  roving tabindex and no arrow keys, which is over sixty tab stops across two
  months; `calendar/constrained` could park the only tab stop on a disabled
  day. `combobox/select-all`'s bulk buttons were unreachable because Tab
  closed the popup out from under them. `topbar/assembled`'s account menu was
  `role="menu"` with every item at `tabindex="-1"` and nothing moving focus
  in, so Tab skipped it entirely. Across `pagination`, `spinner`,
  `empty-state` and `overlay`, disabling the control that was just pressed
  blurred it to `<body>` and dropped the user at the top of the document.
- **Announcements that never happened.** A live region that enters the DOM
  with its message already in it announces nothing: `stat-card`, `spinner`,
  `sidebar`, `popover` and `badge` all did that. `navigation-menu` had eight
  `aria-labelledby` on role-less divs, and a browser will not name a generic
  element, so those panels were unnamed while the note claimed otherwise.
  `avatar/menu` had no accessible name below 640px, its only visible name
  being `sm:block`. `breadcrumbs/overflow` announced an application menu it
  had no keyboard model for.
- `tooltip` failed WCAG 1.4.13 in all nine of its original variants: a touch
  screen fires a synthetic `mouseenter` before the click, so a tap opened a
  bubble that then sat over the button just pressed. Every pointer path now
  tests `(hover: hover)` and `(pointer: fine)` at call time.
- `alert/banner`'s controls on the `zinc-900` band take the on-dark focus
  idiom, `outline-white` at a negative offset, rather than an outline that
  renders as nothing there.
- **390px.** `data-table/server` rendered its table at every width and pushed
  the gallery to 1039px; it now hides below `md` with a card list like every
  other register variant. `table/row-actions` did the same at 505px and now
  scrolls inside its own box. An `sr-only` span in `popover/inline-edit`
  escaped a table's clipping and widened the document to 510px. The phone
  panel cap is normalised: 47 panels used `calc(100vw - 1.5rem)` against 59
  using `calc(100vw - 2rem)`, which is the page gutter.
- `app-shell` carries `print:hidden` on the rail, topbar and backdrop, so a
  document printed from inside the shell no longer comes out with the
  navigation down the left margin, and its Open dot is corrected to
  `zinc-500`.
- The `table` header band settled on `bg-zinc-50` across ten variants, which
  0.3.0 changed in principle and left inconsistent in practice. `table` gains
  a `sticky-both` variant, and `checkbox` gains `wide-matrix` and
  `wide-matrix-phone`, so six roles no longer need two matrices.
- `auth-page` had a read-only input and a focused error summary that drew no
  focus outline at all. `form-page`'s drop zone had a browse button that
  dissolved into its own zone. `stat-card` and `chart` disagreed on announcing
  a period change.

## [0.3.0] - 2026-08-21

### Added

- **`data-kui` on every variant.** Each variant's root element now carries
  `data-kui="<component>/<variant>"`, so markup pasted into an application
  stops being anonymous: `grep -r data-kui` lists every copied component and
  each one names the entry it came from. Inert, and carried through to
  `registry.json` and every `/r/` endpoint. No version is stamped into it, so
  a release does not churn all 417 snippets.
- **How to update a pasted component**, stated as a rule rather than left to
  guesswork. Grep the ids, fetch `/r/<component>/<variant>.html`, diff, and
  carry across the class list and structure only. It says plainly what an
  update must not touch: the labels, template tags, `hx-*` attributes, Alpine
  state, ids and form field names that make a pasted block a real screen.
- **The Konspec mark in the app shell.** The sidebar header names the app it
  is, with an icon tile and the app name; the company mark signs the sidebar
  footer with the running version beside it. Collapsed, the rail keeps the
  icon tile and the version, and drops the mark, which is a 4:1 lockup and
  cannot read at 43px. The mark is inlined as a data URI so a snippet stays
  self-contained in a blob preview, under a project path, and in a consuming
  application alike.
- **CI that fails when generated files drift.** `node tools/build.js --check`
  regenerates nothing and fails if `registry.json`, `llms.txt`,
  `assets/counts.js`, the README table or any `/r/` endpoint no longer match
  `assets/reg/*.js`. Issue and pull request templates alongside it.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` and `SECURITY.md`. The contributing
  guide leads with what the library refuses to do, since most rejected changes
  are rejected on principle rather than on quality.

### Changed

- **The neutral ramp no longer uses one value for two jobs.** `bg-zinc-100`
  was the page, the table header, the zebra row and the control track at once,
  so a header inside a white card measured 1.00 against the page behind that
  card: not low contrast, the identical colour. On a washed-out panel the
  stripes read as holes in the card and a graphite pill sank into its row.
  Table headers and zebra rows drop to `bg-zinc-50`; the outer edge of
  anything sitting on the page steps up to `border-zinc-300`; control tracks,
  selected nav items and open menu triggers move to `bg-zinc-200`, which reads
  on white and on the page alike. Dividers are untouched: the two-shade rule,
  `border-zinc-100` inside a bordered card against `border-zinc-200` for an
  edge, is deliberate and is now three shades rather than two.
- The token table documents the ramp as `Page`, `Surface`, `Recessed`, `Edge`,
  `Border` and `Divider`, and `zinc-300` joins the ramp swatches.
- The nav components follow the shell: sidebar, topbar, navigation-menu and
  command-palette name the app rather than the company. `auth-page` and
  `error-page` still carry the full name, since a visitor who has not signed
  in does need telling whose system this is.
- The README component and variant badges are derived from the registry
  instead of hand-kept.

### Removed

- **The server clock at the foot of the sidebar**, and the note and anatomy
  entry that documented it. It existed to show the clock a posting date and a
  period cut-off are judged against, seeded from the server so a browser with
  a wrong clock could never decide it. If you rely on that, it now has no home
  in the shell.

## [0.2.0] - 2026-08-21

### Added

- **Search on the component index.** Client-side filtering over the 55
  components already in the page, so there is no request and no index to
  build. Every term has to match, so `form date` narrows rather than widens,
  and a term matches the name, the id, the category or the description:
  searching `date` finds `calendar`, and `queue` finds `list-detail`.
- **Search aliases** in `assets/spec.js`, mapping the words people reach for
  onto the ids the library uses. `modal`, `popup`, `snackbar`, `chip`,
  `date picker`, `autocomplete`, `notification`, `loading`, `stepper` and
  `wizard` all returned nothing before this, while the component they wanted
  was in the list. Site chrome only, not emitted into `llms.txt` or the
  registry.
- `/` focuses the search box (ignored while focus is in a field), Escape
  clears it, a live count shows how many of the 55 match, and an empty state
  says the list is a closed set rather than implying the search broke.
- Component descriptions now ride along in `window.INDEX` so the search can
  match on what a component is for. Costs ~9 KB; variant ids are deliberately
  left out.

### Fixed

- The version badge in the navbar was the literal string `v0.1.0` and went on
  saying so through the v0.1.1 release. It now reads `spec.meta.version`, so
  it cannot drift from the version it claims.

## [0.1.1] - 2026-08-21

### Fixed

- The one worked variant URL in `llms.txt` pointed at `/r/button/primary.html`,
  which has never existed: `button`'s variants are `variants`, `sizes`, `icons`,
  `states`, `link`, `full-width`, `toolbar` and `django`. It sat in the
  paragraph telling agents they can construct URLs without fetching an index,
  so it was the example most likely to be copied. It is now derived from a real
  component and its first real variant instead of written by hand.

### Added

- `llms.txt` now says to read variant ids rather than guess them, with the
  reason: 32 of 55 components have a `default` variant and 23 do not, so a
  guessed URL is a 404 and not a fallback.
- A build-time endpoint lint fails the build if any concrete `/r/` URL printed
  in `llms.txt` does not resolve to a file the build emits.

## [0.1.0] - 2026-08-21

First release. Everything below is new, so there is nothing to change or
remove yet.

### Added

- **55 components, 417 variants**, every one written up with its own page.
  Actions, forms, data display, feedback, navigation and layout, named to
  match shadcn where an equivalent exists so the vocabulary is not a third
  thing to learn.
- **Six page layouts** that are whole screens rather than parts: `app-shell`,
  `page-header`, `form-page`, `list-detail`, `auth-page` and `error-page`.
  `app-shell` is mandatory for every signed-in screen; `auth-page` and
  `error-page` are the only two that sit outside it.
- **`llms.txt`**, 33 KB, written to be read in full by an agent before it
  writes markup. Carries the stack, the hard rules, the seven type sizes, the
  surface and text tokens, the locked status mapping, and the closed list of
  components with their variant ids.
- **The registry in fetchable pieces** under `r/`, 473 endpoints generated
  from the same source as everything else:
  - `r/index.json` — the spec and every component summarised, no markup.
  - `r/<id>.json` — one component with its rules, anatomy, behaviour and
    accessibility notes.
  - `r/<id>/<variant>.html` — the raw markup, median ~1k tokens, ready to
    paste with nothing to parse.
- **`registry.json`**, the whole system in one file, kept for anything that
  already points at it. It carries a warning naming its own size, because at
  ~725k tokens it will not fit in an agent's context and a truncated registry
  is worse than none.
- **A documentation site** rendering from the same two sources as the machine
  outputs, so a page cannot drift from the markup it documents. Every variant
  previews live beside the exact string that produced it, at full width or in
  a real 390px viewport, with a copy-for-agent button on every page.
- **A build that refuses to go stale.** `node tools/build.js --check` fails on
  any generated file that no longer matches `assets/spec.js` and
  `assets/reg/*.js`, including endpoints under `r/` that the build no longer
  emits, so a renamed variant cannot leave markup behind that no longer
  exists anywhere.
- **Accessibility carried by the components rather than left to the caller**:
  focus as an outline so it survives forced-colours mode, real focus traps in
  the dialog, drawer and off-canvas navigation, `aria-activedescendant` for
  comboboxes and roving focus for menus, and a skip link ahead of the
  navigation on every shell.
- **A fixed palette and a locked status mapping.** Graphite accent, colour
  reserved for what a record is doing, and status carried by a dot rather than
  a tinted pill, so a column of twelve rows still means something at the
  twelfth.

[0.2.0]: https://github.com/konfpa/konspec-ui/releases/tag/v0.2.0
[0.1.1]: https://github.com/konfpa/konspec-ui/releases/tag/v0.1.1
[0.1.0]: https://github.com/konfpa/konspec-ui/releases/tag/v0.1.0
