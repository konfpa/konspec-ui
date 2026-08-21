# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.0]: https://github.com/konfpa/konspec-ui/releases/tag/v0.1.0
