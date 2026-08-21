# Security

Konspec UI ships static HTML, CSS classes and small Alpine expressions. It has
no server, no build step and no runtime dependencies of its own — the markup you
copy runs entirely in your application, under your CSP.

## Reporting

If you find something exploitable in the markup — an XSS-prone pattern in a
component, an Alpine expression that evaluates user data unsafely, an
`href`/`src` shape that invites injection — report it privately through
[GitHub Security Advisories](https://github.com/konfpa/konspec-ui/security/advisories/new)
rather than opening a public issue.

Please include the component and variant id (`select/cascade`), and the input
that triggers it.

## Scope notes

- The site loads Tailwind, Alpine, htmx and Lucide **from CDNs** for the demo
  pages. That is a documentation convenience, not a recommendation — pin and
  self-host those in production.
- Every component assumes the values placed into it are already escaped by your
  template layer. No component uses `x-html`; if a change introduces one, it
  needs justifying in review.

## Supported versions

The `main` branch is the only supported version. Fixes land there.
