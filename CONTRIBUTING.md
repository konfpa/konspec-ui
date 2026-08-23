# Contributing

Thanks for looking. This is a small, deliberately opinionated library, so the
most useful thing to know before you start is what it refuses to do — most
rejected changes are rejected on principle rather than on quality.

## The one rule that matters

**A missing component is a decision for a person.** `llms.txt` tells every agent
that reads it to stop and flag a gap rather than invent something to fill it,
because an invented component ships, gets copied, and then drifts. The same
applies one level down to variants.

So if what you need is not here, the contribution is the *request*, not the
markup: [open a missing-component issue](https://github.com/konfpa/konspec-ui/issues/new?template=missing-component.yml),
name the thing, and say what it has to do. That is a wanted contribution, not a
lesser one.

Changing the labels, figures and records inside a variant is expected and is
what copying it is for. Reshaping one into a density, state or arrangement the
registry does not list is a *new variant* — which is an addition to the
framework, not a local edit.

## What belongs here

Internal tools: purchase orders, GRNs, approvals, ledgers. Dense tables, long
forms, real records with money and dates in them. It is deliberately not a
marketing-site kit.

Four constraints apply to everything:

- **Light theme only.** A second theme doubles the review surface for no benefit
  in an office tool.
- **The accent is graphite** (`zinc-700`). Red, amber and green are reserved for
  what a record is *doing* — so an overdue row still means something.
- **Colour lives in a dot or an icon**, never as a field of colour behind text.
- **Survives 390px.** Nothing scrolls sideways on a phone.

Every rule in [`llms.txt`](llms.txt) exists because breaking it produced a
visible defect at least once. They are not style preferences, and a PR that
breaks one needs to argue with the defect, not the rule.

## Source layout

`assets/spec.js` and `assets/reg/*.js` are the **only** sources. Everything
else is generated:

| Generated | From |
|---|---|
| `registry.json` | `assets/reg/*.js` |
| `r/**` — one endpoint per variant | `assets/reg/*.js` |
| `llms.txt` | `assets/spec.js` + the registry |
| `assets/counts.js` | the registry |
| the component table and badge counts in `README.md` | the registry |

Never hand-edit a generated file — the build overwrites it and `--check` fails
the PR. `r/` is wiped and rewritten on every build, so a renamed variant cannot
leave a stale endpoint behind serving markup that no longer exists.

## Working on it

```bash
git clone git@github.com:konfpa/konspec-ui.git
cd konspec-ui
python3 serve.py 8051          # http://localhost:8051

node tools/build.js            # regenerate after any source change
node tools/build.js --check    # what CI runs; fails if generated files are stale

npm ci                         # once, for the sweep only
npx playwright install chromium
node tools/sweep.js            # load every page in a browser and check it
node tools/sweep.js select     # or just the one you are working on
```

`serve.py` exists only to send `charset=utf-8`; `python -m http.server` defaults
to windows-1252 and turns every em dash into `â€"`.

There is no npm install and no build step for *consumers*, and `tools/build.js`
is still plain Node with no dependencies. The `npm ci` above buys one thing: a
browser for `tools/sweep.js`. Nothing this repo publishes needs it.

## Adding a component

1. Append it to the right group in `assets/reg/` — `actions`, `forms`, `data`,
   `feedback`, `navigation` or `layout`. Copy the nearest existing entry in that
   file for the shape — name, id, category, the prose fields, then the variants.
2. `node tools/build.js`.
3. Copy any existing page in `components/` and change three lines: the
   `<title>`, the meta description and `window.COMPONENT_ID`. The page needs
   nothing else — it renders from the same source as the landing page, so a
   component is only ever described once.

## What the checks catch

There are two, and the split is what they can see. `build.js` reads the markup,
so it catches anything wrong in the string. `sweep.js` reads the rendered page,
so it catches what is only wrong once the page has run.

`node tools/build.js` fails, not warns, on:

- **Focus lint.** `focus:ring-*` is a `box-shadow`, and forced-colours mode drops
  every box-shadow — use `outline-*`. And `outline-none` on an element silences
  that element's own focus outline while leaving its width and colour set, which
  measures as styled and renders as nothing.
- **Endpoint lint.** Every concrete `/r/` URL printed in `llms.txt` has to
  resolve to a file the build emits. A worked example that 404s is worse than
  none, because it sits in the paragraph telling agents they can construct URLs.
- **Staleness.** `--check` compares all 470+ generated files, including files the
  build no longer emits.

`node tools/sweep.js` loads all 75 pages in headless Chromium, at 1280px and
again at 390px, and fails on:

- **A console error**, uncaught exception, or 404 on a file this repo serves. A
  path a snippet is only demonstrating — `avatar/photo` points an `<img>` at a
  file that is meant to 404 so the fallback runs — is not one of ours.
- **An icon that never hydrated.** Lucide swaps `<i data-lucide>` for an `<svg>`;
  one left behind is a control that renders empty.
- **An element still carrying `x-cloak`** once Alpine has initialised, which
  means Alpine never reached it and the page is showing a hole.
- **A control with no focus outline.** Every keyboard-reachable control is
  focused one at a time under keyboard modality and the outline is read back off
  the rendered box — its own, or the wrapper's, which is where half the forms
  group draws it. This is the check `build.js` cannot do: its focus lint reads
  class strings, and `has-[:focus-visible]:ring-3` breaks the regex.
- **A page wider than 390px**, naming the element that pushed it. Content inside
  a horizontal scroller is exempt, because a region may scroll sideways.

All of these exist because the failure they catch is invisible in review.

## Pull requests

- Commits follow [Conventional Commits](https://www.conventionalcommits.org):
  `feat(select): …`, `fix(site): …`, `docs(spec): …`.
- Run `node tools/build.js` and commit the generated output with the source
  change, in the same commit.
- Check the component at 390px before you push. That is where these break.
- Keyboard first: tab to it, operate it, leave it. If focus goes somewhere
  invisible, it is not done.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
