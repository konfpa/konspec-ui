<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.png">
  <img src="assets/logo.png" alt="Konspec UI" width="88" height="88">
</picture>

# Konspec UI

Copy-paste HTML components and page patterns for internal data applications.

[Browse the library](https://konfpa.github.io/konspec-ui/) · [Component index](https://konfpa.github.io/konspec-ui/r/index.json) · [Agent reference](https://konfpa.github.io/konspec-ui/llms.txt)

</div>

## What it is

Konspec UI is a deliberately opinionated library for operational software: registers, approvals, records, imports, reconciliation, and the dense forms that support them. It is not a package to install. You choose a documented variant, copy its HTML, and adapt the content in your own application.

The demos use Tailwind CSS v4, Alpine.js, htmx, and Lucide. The snippets are plain HTML, so you remain in control of your template system, data handling, CSP, and deployment.

## Start here

### Using the library

1. Browse the [component index](https://konfpa.github.io/konspec-ui/) and select a component or page pattern.
2. Read its guidance and choose the closest existing variant.
3. Copy the variant markup from `/r/<component>/<variant>.html` and change the data, labels, and links for your application.

For example, the raw markup for the first Button variant is at [`/r/button/default.html`](https://konfpa.github.io/konspec-ui/r/button/default.html). Component rules, anatomy, behaviour, and accessibility notes live at `/r/<component>.json`.

Every authenticated application screen uses `app-shell`, with page content inside its `<main>`. The documented exceptions are `auth-page`, `error-page`, `portal-page`, and `focus-page`.

### Working with an agent

Read [`llms.txt`](https://konfpa.github.io/konspec-ui/llms.txt) in full before asking an agent to build with Konspec UI. It contains the visual rules, token choices, component inventory, and variant identifiers. Then fetch only the needed raw variant endpoint and copy its markup before editing it.

Do not recreate a component from a prose description or invent an undocumented variant. If the library lacks a pattern, open a request so it can be designed once instead of diverging across applications.

## Design commitments

- Designed for internal, data-heavy tools rather than marketing sites.
- Light theme only; graphite is the accent.
- Semantic colour communicates record state, not decoration.
- Status colour appears in a dot, icon, or other small signal—not a tinted field behind text.
- Pages must remain usable at 390px without horizontal page scrolling.
- Existing component variants are the source of truth for interaction and accessibility patterns.

<!-- components:start -->
## Components

**78 components · 916 variants · 78 written up.** Every one of them is at `/r/<id>/<variant>.html`, written up or not — a page is documentation, not a precondition for using the markup. The [index](https://konfpa.github.io/konspec-ui/r/index.json) lists them all with their variant ids.

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
| Checkbox | `checkbox` | 16 | [open](https://konfpa.github.io/konspec-ui/components/checkbox.html) |
| Radio | `radio` | 13 | [open](https://konfpa.github.io/konspec-ui/components/radio.html) |
| Toggle | `toggle` | 13 | [open](https://konfpa.github.io/konspec-ui/components/toggle.html) |
| Combobox | `combobox` | 14 | [open](https://konfpa.github.io/konspec-ui/components/combobox.html) |
| Attachment | `attachment` | 13 | [open](https://konfpa.github.io/konspec-ui/components/attachment.html) |
| Calendar | `calendar` | 14 | [open](https://konfpa.github.io/konspec-ui/components/calendar.html) |
| Questionnaire | `questionnaire` | 14 | [open](https://konfpa.github.io/konspec-ui/components/questionnaire.html) |
| Filter builder | `filter-builder` | 14 | [open](https://konfpa.github.io/konspec-ui/components/filter-builder.html) |

### Data display

| Component | id | Variants | Page |
|---|---|--:|---|
| Table | `table` | 13 | [open](https://konfpa.github.io/konspec-ui/components/table.html) |
| Data table | `data-table` | 11 | [open](https://konfpa.github.io/konspec-ui/components/data-table.html) |
| Pagination | `pagination` | 15 | [open](https://konfpa.github.io/konspec-ui/components/pagination.html) |
| Stat card | `stat-card` | 14 | [open](https://konfpa.github.io/konspec-ui/components/stat-card.html) |
| Chart | `chart` | 15 | [open](https://konfpa.github.io/konspec-ui/components/chart.html) |
| Progress | `progress` | 14 | [open](https://konfpa.github.io/konspec-ui/components/progress.html) |
| Empty state | `empty-state` | 14 | [open](https://konfpa.github.io/konspec-ui/components/empty-state.html) |
| Skeleton | `skeleton` | 15 | [open](https://konfpa.github.io/konspec-ui/components/skeleton.html) |
| Marker | `marker` | 14 | [open](https://konfpa.github.io/konspec-ui/components/marker.html) |
| Spinner | `spinner` | 14 | [open](https://konfpa.github.io/konspec-ui/components/spinner.html) |
| Timeline | `timeline` | 15 | [open](https://konfpa.github.io/konspec-ui/components/timeline.html) |
| Permission matrix | `permission-matrix` | 13 | [open](https://konfpa.github.io/konspec-ui/components/permission-matrix.html) |
| Tree view | `tree-view` | 14 | [open](https://konfpa.github.io/konspec-ui/components/tree-view.html) |

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
| Container | `container` | 9 | [open](https://konfpa.github.io/konspec-ui/components/container.html) |
| App shell | `app-shell` | 1 | [open](https://konfpa.github.io/konspec-ui/components/app-shell.html) |
| Page header | `page-header` | 8 | [open](https://konfpa.github.io/konspec-ui/components/page-header.html) |
| Card | `card` | 9 | [open](https://konfpa.github.io/konspec-ui/components/card.html) |
| Separator | `separator` | 6 | [open](https://konfpa.github.io/konspec-ui/components/separator.html) |
| Carousel | `carousel` | 8 | [open](https://konfpa.github.io/konspec-ui/components/carousel.html) |
| List and detail | `list-detail` | 7 | [open](https://konfpa.github.io/konspec-ui/components/list-detail.html) |
| Form page | `form-page` | 8 | [open](https://konfpa.github.io/konspec-ui/components/form-page.html) |
| Auth page | `auth-page` | 8 | [open](https://konfpa.github.io/konspec-ui/components/auth-page.html) |
| Error page | `error-page` | 7 | [open](https://konfpa.github.io/konspec-ui/components/error-page.html) |
| Dashboard | `dashboard` | 9 | [open](https://konfpa.github.io/konspec-ui/components/dashboard.html) |
| Index page | `index-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/index-page.html) |
| Record page | `record-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/record-page.html) |
| Approval inbox | `inbox-page` | 10 | [open](https://konfpa.github.io/konspec-ui/components/inbox-page.html) |
| Board | `board` | 10 | [open](https://konfpa.github.io/konspec-ui/components/board.html) |
| Schedule page | `schedule-page` | 10 | [open](https://konfpa.github.io/konspec-ui/components/schedule-page.html) |
| Compare page | `compare-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/compare-page.html) |
| Reconcile page | `reconcile-page` | 10 | [open](https://konfpa.github.io/konspec-ui/components/reconcile-page.html) |
| Import page | `import-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/import-page.html) |
| Search page | `search-page` | 10 | [open](https://konfpa.github.io/konspec-ui/components/search-page.html) |
| Focus page | `focus-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/focus-page.html) |
| Settings page | `settings-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/settings-page.html) |
| Onboarding page | `onboarding-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/onboarding-page.html) |
| Audit page | `audit-page` | 10 | [open](https://konfpa.github.io/konspec-ui/components/audit-page.html) |
| Docs page | `docs-page` | 10 | [open](https://konfpa.github.io/konspec-ui/components/docs-page.html) |
| Document page | `document-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/document-page.html) |
| Label sheet | `label-sheet` | 9 | [open](https://konfpa.github.io/konspec-ui/components/label-sheet.html) |
| Portal page | `portal-page` | 9 | [open](https://konfpa.github.io/konspec-ui/components/portal-page.html) |

<!-- components:end -->

## Local development

```bash
git clone git@github.com:konfpa/konspec-ui.git
cd konspec-ui
python3 serve.py 8051
```

Open <http://localhost:8051>. The included server sends UTF-8 headers so text-based endpoints render correctly.

Consumers do not need a build step. Contributors use the following commands:

```bash
node tools/build.js          # regenerate derived files
node tools/build.js --check  # verify generated files are current

npm ci                       # required only for browser checks
npx playwright install chromium
node tools/sweep.js          # run the responsive browser sweep
```

## Repository guide

| Path | Purpose |
|---|---|
| `assets/spec.js` | Shared design rules and system metadata. |
| `assets/reg/*.js` | Component definitions and variant markup. |
| `components/` | Documentation-page shells for rendered components. |
| `tools/build.js` | Generates the catalog, agent reference, registry endpoints, and counts. |
| `tools/sweep.js` | Browser-level checks for runtime, focus, and responsive defects. |
| `r/`, `llms.txt`, `registry.json` | Generated output; do not edit by hand. |

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution workflow, [SECURITY.md](SECURITY.md) for vulnerability reporting, and [CHANGELOG.md](CHANGELOG.md) for release history.

## Licence

MIT © Konspec Industries.
