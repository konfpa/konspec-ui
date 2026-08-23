# Contributing to Konspec UI

Konspec UI is a small, opinionated system. Contributions are welcome when they make existing patterns clearer, safer, more consistent, or more useful for internal data applications.

## Before you begin

Read the [agent reference](llms.txt), inspect the closest existing component, and check whether the request is a content change, a new variant, or an entirely new pattern.

Do not solve a missing pattern by assembling an unofficial substitute. Components and variants become copy-paste API once published; a locally plausible addition can create long-term inconsistency. Open a [missing-component request](https://github.com/konfpa/konspec-ui/issues/new?template=missing-component.yml) instead, explaining the job it must perform and why the existing patterns do not fit.

## Principles

- Build for internal operations software, not promotional pages.
- Preserve the light-theme, graphite-accent visual language.
- Use colour as a compact semantic signal, never decorative background fill.
- Keep pages usable at 390px without page-level horizontal scrolling.
- Treat keyboard operation, visible focus, and semantic HTML as required behaviour.
- Prefer an established variant over a near-duplicate.

## Project structure

The editable sources are `assets/spec.js` and `assets/reg/*.js`. The build derives `llms.txt`, `registry.json`, `r/`, `assets/counts.js`, and the generated component catalog inside `README.md`.

Never edit generated output directly. It will be overwritten, and CI checks it for staleness.

## Setup and checks

```bash
git clone git@github.com:konfpa/konspec-ui.git
cd konspec-ui
python3 serve.py 8051

node tools/build.js
node tools/build.js --check

npm ci
npx playwright install chromium
node tools/sweep.js
```

`tools/build.js` has no package dependency. Playwright is only needed for `tools/sweep.js`, which loads documentation pages at desktop and phone widths.

## Making a change

1. Find the closest registry entry in `assets/reg/`.
2. Make the smallest source change that solves the stated problem.
3. For a new component, add its registry definition in the appropriate group and create a matching page in `components/` by adapting an existing page’s title, description, and `window.COMPONENT_ID`.
4. Run `node tools/build.js` and commit the regenerated output with the source change.
5. Run `node tools/build.js --check`; run the browser sweep for visual or interactive changes.
6. Test the changed pattern with a keyboard and at 390px.

## Pull requests

Use a focused title following Conventional Commits, for example `fix(table): preserve focus after filtering` or `docs(readme): clarify local setup`.

In the pull request, describe the user problem, identify the affected component and variants, and mention the checks you ran. Include screenshots or a short recording when visual behaviour changes.

By participating, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
