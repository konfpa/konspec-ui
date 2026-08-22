<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.png">
  <img src="assets/logo.png" alt="Konspec UI" width="88" height="88">
</picture>

# Konspec UI

**A component library for internal data applications — written for the agents that build them.**

[![CI](https://github.com/konfpa/konspec-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/konfpa/konspec-ui/actions/workflows/ci.yml)
[![components](https://img.shields.io/badge/components-55-18181b?style=flat-square)](#components)
[![variants](https://img.shields.io/badge/variants-679-18181b?style=flat-square)](#components)
[![build step](https://img.shields.io/badge/build_step-none-18181b?style=flat-square)](#running-it-locally)
[![licence](https://img.shields.io/badge/licence-MIT-18181b?style=flat-square)](LICENSE)

**[konfpa.github.io/konspec-ui](https://konfpa.github.io/konspec-ui/)** · [llms.txt](https://konfpa.github.io/konspec-ui/llms.txt) · [r/index.json](https://konfpa.github.io/konspec-ui/r/index.json)

Tailwind CSS v4, Alpine.js, htmx and Lucide. No build step, no npm install,<br>no design tokens to import — the Tailwind class *is* the token. Every component is HTML you copy.

</div>

---

## If you are an agent

Three steps, in order. Do not skip the first.

```
1. Read   https://konfpa.github.io/konspec-ui/llms.txt
          rules, tokens, and every component with its variant ids

2. Fetch  https://konfpa.github.io/konspec-ui/r/<id>/<variant>.html
          the markup, one variant at a time. The body IS the markup.

3. Copy   the response body verbatim, then change the copy

Component rules, anatomy, accessibility:  /r/<id>.json
Arrived without reading llms.txt:         /r/index.json
Never fetch /registry.json — the whole system in one file, ~725k tokens.
```

`llms.txt` is 39 KB and written to be read in full. It carries the rules that break things when ignored, the seven type sizes, the surface and text tokens, the locked status mapping, and the closed list of components with their variant ids. Because it lists those ids, an agent that has read it can build any `r/<id>/<variant>.html` URL directly and never needs an index: one read, then a few small ones.

Copy the HTML **verbatim**, then edit the copy. Do not reconstruct a component from its description — the descriptions exist to tell you which one to fetch, not what it looks like.

**Every signed-in screen is `app-shell`.** That one is not a choice to weigh. If a
signed-in user can reach the page, the page is the shell with your content inside
`<main>`. `auth-page` and `error-page` are the only two screens that sit outside it.
Do not assemble a substitute out of `sidebar` and `topbar`, and do not start a page at
`<main>` because the screen looked simple — the shell carries the skip link, the nav
landmark, the off-canvas focus trap, the command palette and the keyboard shortcuts,
and a page without it drops all of them without ever looking wrong. See rule 2.

## If you are a person

Browse the [component index](https://konfpa.github.io/konspec-ui/#components). Each written-up component has a page with every variant rendered live beside the exact string that produced it, plus its rules, behaviour, anatomy and accessibility requirements — and a **Copy for agent** button that puts the whole thing on your clipboard as markdown.

## What it is for

Internal tools: purchase orders, GRNs, approvals, ledgers. Dense tables, long forms, real records with money and dates in them. It is deliberately not a marketing-site kit.

- **Light theme only.** A second theme doubles the review surface for no benefit in an office tool.
- **The accent is graphite.** `zinc-700`. Red, amber and green are reserved for what a record is *doing*, never for decoration — so an overdue row still means something.
- **Colour lives in a dot or an icon**, never as a field of colour behind text. Twelve tinted pills down a column read as a traffic light and stop meaning anything by the twelfth row.
- **Survives 390px.** Nothing scrolls sideways on a phone.
- **Nothing left to choice.** Where two agents could reasonably pick differently, the mapping is locked and written down.

Every rule in `llms.txt` exists because breaking it produced a visible defect at least once. They are not style preferences.

<!-- components:start -->
## Components

**55 components · 679 variants · 55 written up.** Every one of them is at `/r/<id>/<variant>.html`, written up or not — a page is documentation, not a precondition for using the markup. The [index](https://konfpa.github.io/konspec-ui/r/index.json) lists them all with their variant ids.

### Actions

| Component | id | Variants | Page |
|---|---|--:|---|
| Button | `button` | 14 | [open](https://konfpa.github.io/konspec-ui/components/button.html) |
| Button group | `button-group` | 15 | [open](https://konfpa.github.io/konspec-ui/components/button-group.html) |
| Dropdown menu | `dropdown` | 15 | [open](https://konfpa.github.io/konspec-ui/components/dropdown.html) |

### Forms

| Component | id | Variants | Page |
|---|---|--:|---|
| Label | `label` | 15 | [open](https://konfpa.github.io/konspec-ui/components/label.html) |
| Field | `field` | 14 | [open](https://konfpa.github.io/konspec-ui/components/field.html) |
| Input | `input` | 14 | [open](https://konfpa.github.io/konspec-ui/components/input.html) |
| Input group | `input-group` | 15 | [open](https://konfpa.github.io/konspec-ui/components/input-group.html) |
| Select | `select` | 14 | [open](https://konfpa.github.io/konspec-ui/components/select.html) |
| Textarea | `textarea` | 13 | [open](https://konfpa.github.io/konspec-ui/components/textarea.html) |
| Checkbox | `checkbox` | 14 | [open](https://konfpa.github.io/konspec-ui/components/checkbox.html) |
| Radio | `radio` | 13 | [open](https://konfpa.github.io/konspec-ui/components/radio.html) |
| Toggle | `toggle` | 13 | [open](https://konfpa.github.io/konspec-ui/components/toggle.html) |
| Combobox | `combobox` | 14 | [open](https://konfpa.github.io/konspec-ui/components/combobox.html) |
| Attachment | `attachment` | 13 | [open](https://konfpa.github.io/konspec-ui/components/attachment.html) |
| Calendar | `calendar` | 14 | [open](https://konfpa.github.io/konspec-ui/components/calendar.html) |
| Questionnaire | `questionnaire` | 14 | [open](https://konfpa.github.io/konspec-ui/components/questionnaire.html) |

### Data display

| Component | id | Variants | Page |
|---|---|--:|---|
| Table | `table` | 12 | [open](https://konfpa.github.io/konspec-ui/components/table.html) |
| Data table | `data-table` | 11 | [open](https://konfpa.github.io/konspec-ui/components/data-table.html) |
| Pagination | `pagination` | 15 | [open](https://konfpa.github.io/konspec-ui/components/pagination.html) |
| Stat card | `stat-card` | 14 | [open](https://konfpa.github.io/konspec-ui/components/stat-card.html) |
| Chart | `chart` | 15 | [open](https://konfpa.github.io/konspec-ui/components/chart.html) |
| Progress | `progress` | 14 | [open](https://konfpa.github.io/konspec-ui/components/progress.html) |
| Empty state | `empty-state` | 14 | [open](https://konfpa.github.io/konspec-ui/components/empty-state.html) |
| Skeleton | `skeleton` | 15 | [open](https://konfpa.github.io/konspec-ui/components/skeleton.html) |
| Marker | `marker` | 14 | [open](https://konfpa.github.io/konspec-ui/components/marker.html) |
| Spinner | `spinner` | 14 | [open](https://konfpa.github.io/konspec-ui/components/spinner.html) |

### Feedback

| Component | id | Variants | Page |
|---|---|--:|---|
| Alert | `alert` | 14 | [open](https://konfpa.github.io/konspec-ui/components/alert.html) |
| Toast | `toast` | 15 | [open](https://konfpa.github.io/konspec-ui/components/toast.html) |
| Alert dialog | `alert-dialog` | 11 | [open](https://konfpa.github.io/konspec-ui/components/alert-dialog.html) |
| Dialog | `dialog` | 10 | [open](https://konfpa.github.io/konspec-ui/components/dialog.html) |
| Sheet | `sheet` | 10 | [open](https://konfpa.github.io/konspec-ui/components/sheet.html) |
| Drawer | `drawer` | 11 | [open](https://konfpa.github.io/konspec-ui/components/drawer.html) |
| Badge | `badge` | 14 | [open](https://konfpa.github.io/konspec-ui/components/badge.html) |
| Tooltip | `tooltip` | 14 | [open](https://konfpa.github.io/konspec-ui/components/tooltip.html) |
| Hovercard | `hovercard` | 14 | [open](https://konfpa.github.io/konspec-ui/components/hovercard.html) |
| Popover | `popover` | 14 | [open](https://konfpa.github.io/konspec-ui/components/popover.html) |
| Avatar | `avatar` | 13 | [open](https://konfpa.github.io/konspec-ui/components/avatar.html) |

### Navigation

| Component | id | Variants | Page |
|---|---|--:|---|
| Tabs | `tabs` | 13 | [open](https://konfpa.github.io/konspec-ui/components/tabs.html) |
| Breadcrumbs | `breadcrumbs` | 13 | [open](https://konfpa.github.io/konspec-ui/components/breadcrumbs.html) |
| Menubar | `menubar` | 14 | [open](https://konfpa.github.io/konspec-ui/components/menubar.html) |
| Navigation menu | `navigation-menu` | 14 | [open](https://konfpa.github.io/konspec-ui/components/navigation-menu.html) |
| Sidebar | `sidebar` | 14 | [open](https://konfpa.github.io/konspec-ui/components/sidebar.html) |
| Topbar | `topbar` | 14 | [open](https://konfpa.github.io/konspec-ui/components/topbar.html) |
| Accordion | `accordion` | 10 | [open](https://konfpa.github.io/konspec-ui/components/accordion.html) |
| Collapsible | `collapsible` | 13 | [open](https://konfpa.github.io/konspec-ui/components/collapsible.html) |
| Command palette | `command-palette` | 10 | [open](https://konfpa.github.io/konspec-ui/components/command-palette.html) |

### Layout

| Component | id | Variants | Page |
|---|---|--:|---|
| App shell | `app-shell` | 1 | [open](https://konfpa.github.io/konspec-ui/components/app-shell.html) |
| Page header | `page-header` | 8 | [open](https://konfpa.github.io/konspec-ui/components/page-header.html) |
| Card | `card` | 9 | [open](https://konfpa.github.io/konspec-ui/components/card.html) |
| Separator | `separator` | 6 | [open](https://konfpa.github.io/konspec-ui/components/separator.html) |
| Carousel | `carousel` | 8 | [open](https://konfpa.github.io/konspec-ui/components/carousel.html) |
| List and detail | `list-detail` | 7 | [open](https://konfpa.github.io/konspec-ui/components/list-detail.html) |
| Form page | `form-page` | 8 | [open](https://konfpa.github.io/konspec-ui/components/form-page.html) |
| Auth page | `auth-page` | 8 | [open](https://konfpa.github.io/konspec-ui/components/auth-page.html) |
| Error page | `error-page` | 7 | [open](https://konfpa.github.io/konspec-ui/components/error-page.html) |

<!-- components:end -->

## Running it locally

```bash
git clone git@github.com:konfpa/konspec-ui.git
cd konspec-ui
python3 serve.py 8051          # http://localhost:8051
```

`serve.py` exists only to send `charset=utf-8`; `python -m http.server` defaults to windows-1252 and turns every em dash into `â€"`.

## Changing something

`assets/spec.js` and `assets/reg/*.js` are the only sources. Everything else — `r/`, `registry.json`, `llms.txt`, `assets/counts.js`, the component table above — is generated. `r/` is wiped and rewritten on every build, so a renamed variant cannot leave a stale endpoint behind serving markup that no longer exists.

```bash
node tools/build.js            # regenerate
node tools/build.js --check    # fail if the generated files are stale
```

Never hand-edit a generated file. The landing page and the component pages render from the same two sources, so a component only has to be described once.

To add a component: append it to the right group in `assets/reg/`, run the build, then copy any existing page in `components/` and change three lines — the `<title>`, the meta description and `window.COMPONENT_ID`. The page needs nothing else.

[CONTRIBUTING.md](CONTRIBUTING.md) has the long version — the source layout, what the build lints for, and what makes a variant worth adding.

## Contributing

A missing component is a decision for a person, not a gap for an agent to fill. If you needed something that is not here, [open a request](https://github.com/konfpa/konspec-ui/issues/new?template=missing-component.yml) — name it, say what it has to do, and it gets added properly once rather than approximated in five codebases.

Bug reports, variant requests and pull requests are all welcome: see [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

## Licence

[MIT](LICENSE) © Konspec Industries.
