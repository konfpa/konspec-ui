# Konspec UI

A component library for internal data applications, written for the agents that build them.

**[konfpa.github.io/konspec-ui](https://konfpa.github.io/konspec-ui/)** · [llms.txt](https://konfpa.github.io/konspec-ui/llms.txt) · [registry.json](https://konfpa.github.io/konspec-ui/registry.json)

Tailwind CSS v4, Alpine.js, htmx and Lucide. No build step, no npm install, no design tokens to import — the Tailwind class *is* the token. Every component is HTML you copy.

---

## If you are an agent

Three steps, in order. Do not skip the first.

```
1. Read  https://konfpa.github.io/konspec-ui/llms.txt          the rules, tokens and status colours
2. Fetch https://konfpa.github.io/konspec-ui/registry.json     every component, every variant, exact HTML
3. Copy  registry.json → components[id].variants[].html        verbatim, then change the copy
```

`llms.txt` is 29 KB and written to be read in full. It carries the rules that break things when ignored, the seven type sizes, the surface and text tokens, and the locked status mapping. `registry.json` carries the markup.

Copy the HTML **verbatim**, then edit the copy. Do not reconstruct a component from its description — the descriptions exist to tell you which one to fetch, not what it looks like.

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

**55 components · 417 variants · 54 written up.** Every one of them is in [registry.json](https://konfpa.github.io/konspec-ui/registry.json), written up or not — a page is documentation, not a precondition for using the markup.

### Actions

| Component | id | Variants | Page |
|---|---|--:|---|
| Button | `button` | 8 | [open](https://konfpa.github.io/konspec-ui/components/button.html) |
| Button group | `button-group` | 8 | [open](https://konfpa.github.io/konspec-ui/components/button-group.html) |
| Dropdown menu | `dropdown` | 9 | [open](https://konfpa.github.io/konspec-ui/components/dropdown.html) |

### Forms

| Component | id | Variants | Page |
|---|---|--:|---|
| Label | `label` | 9 | [open](https://konfpa.github.io/konspec-ui/components/label.html) |
| Field | `field` | 9 | [open](https://konfpa.github.io/konspec-ui/components/field.html) |
| Input | `input` | 9 | [open](https://konfpa.github.io/konspec-ui/components/input.html) |
| Input group | `input-group` | 9 | [open](https://konfpa.github.io/konspec-ui/components/input-group.html) |
| Select | `select` | 9 | [open](https://konfpa.github.io/konspec-ui/components/select.html) |
| Textarea | `textarea` | 8 | [open](https://konfpa.github.io/konspec-ui/components/textarea.html) |
| Checkbox | `checkbox` | 8 | [open](https://konfpa.github.io/konspec-ui/components/checkbox.html) |
| Radio | `radio` | 8 | [open](https://konfpa.github.io/konspec-ui/components/radio.html) |
| Toggle | `toggle` | 8 | [open](https://konfpa.github.io/konspec-ui/components/toggle.html) |
| Combobox | `combobox` | 9 | [open](https://konfpa.github.io/konspec-ui/components/combobox.html) |
| Attachment | `attachment` | 8 | [open](https://konfpa.github.io/konspec-ui/components/attachment.html) |
| Calendar | `calendar` | 8 | [open](https://konfpa.github.io/konspec-ui/components/calendar.html) |
| Questionnaire | `questionnaire` | 9 | [open](https://konfpa.github.io/konspec-ui/components/questionnaire.html) |

### Data display

| Component | id | Variants | Page |
|---|---|--:|---|
| Table | `table` | 5 | [open](https://konfpa.github.io/konspec-ui/components/table.html) |
| Data table | `data-table` | 3 | [open](https://konfpa.github.io/konspec-ui/components/data-table.html) |
| Pagination | `pagination` | 9 | [open](https://konfpa.github.io/konspec-ui/components/pagination.html) |
| Stat card | `stat-card` | 9 | [open](https://konfpa.github.io/konspec-ui/components/stat-card.html) |
| Chart | `chart` | 9 | [open](https://konfpa.github.io/konspec-ui/components/chart.html) |
| Progress | `progress` | 9 | [open](https://konfpa.github.io/konspec-ui/components/progress.html) |
| Empty state | `empty-state` | 9 | [open](https://konfpa.github.io/konspec-ui/components/empty-state.html) |
| Skeleton | `skeleton` | 9 | [open](https://konfpa.github.io/konspec-ui/components/skeleton.html) |
| Marker | `marker` | 9 | [open](https://konfpa.github.io/konspec-ui/components/marker.html) |
| Spinner | `spinner` | 9 | [open](https://konfpa.github.io/konspec-ui/components/spinner.html) |

### Feedback

| Component | id | Variants | Page |
|---|---|--:|---|
| Alert | `alert` | 9 | [open](https://konfpa.github.io/konspec-ui/components/alert.html) |
| Toast | `toast` | 9 | [open](https://konfpa.github.io/konspec-ui/components/toast.html) |
| Alert dialog | `alert-dialog` | 5 | [open](https://konfpa.github.io/konspec-ui/components/alert-dialog.html) |
| Dialog | `dialog` | 3 | [open](https://konfpa.github.io/konspec-ui/components/dialog.html) |
| Sheet | `sheet` | 2 | [open](https://konfpa.github.io/konspec-ui/components/sheet.html) |
| Drawer | `drawer` | 3 | [open](https://konfpa.github.io/konspec-ui/components/drawer.html) |
| Badge | `badge` | 9 | [open](https://konfpa.github.io/konspec-ui/components/badge.html) |
| Tooltip | `tooltip` | 9 | [open](https://konfpa.github.io/konspec-ui/components/tooltip.html) |
| Hovercard | `hovercard` | 9 | [open](https://konfpa.github.io/konspec-ui/components/hovercard.html) |
| Popover | `popover` | 9 | [open](https://konfpa.github.io/konspec-ui/components/popover.html) |
| Avatar | `avatar` | 8 | [open](https://konfpa.github.io/konspec-ui/components/avatar.html) |

### Navigation

| Component | id | Variants | Page |
|---|---|--:|---|
| Tabs | `tabs` | 8 | [open](https://konfpa.github.io/konspec-ui/components/tabs.html) |
| Breadcrumbs | `breadcrumbs` | 8 | [open](https://konfpa.github.io/konspec-ui/components/breadcrumbs.html) |
| Menubar | `menubar` | 9 | [open](https://konfpa.github.io/konspec-ui/components/menubar.html) |
| Navigation menu | `navigation-menu` | 9 | [open](https://konfpa.github.io/konspec-ui/components/navigation-menu.html) |
| Sidebar | `sidebar` | 9 | [open](https://konfpa.github.io/konspec-ui/components/sidebar.html) |
| Topbar | `topbar` | 9 | [open](https://konfpa.github.io/konspec-ui/components/topbar.html) |
| Accordion | `accordion` | 3 | [open](https://konfpa.github.io/konspec-ui/components/accordion.html) |
| Collapsible | `collapsible` | 8 | [open](https://konfpa.github.io/konspec-ui/components/collapsible.html) |
| Command palette | `command-palette` | 1 | [open](https://konfpa.github.io/konspec-ui/components/command-palette.html) |

### Layout

| Component | id | Variants | Page |
|---|---|--:|---|
| App shell | `app-shell` | 1 | — |
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

`assets/spec.js` and `assets/reg/*.js` are the only sources. Everything else — `registry.json`, `llms.txt`, `assets/counts.js`, the component table above — is generated.

```bash
node tools/build.js            # regenerate
node tools/build.js --check    # fail if the generated files are stale
```

Never hand-edit a generated file. The landing page and the component pages render from the same two sources, so a component only has to be described once.

To add a component: append it to the right group in `assets/reg/`, run the build, then copy any existing page in `components/` and change three lines — the `<title>`, the meta description and `window.COMPONENT_ID`. The page needs nothing else.

## Licence

[MIT](LICENSE).
