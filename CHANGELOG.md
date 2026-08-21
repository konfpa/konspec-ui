# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
