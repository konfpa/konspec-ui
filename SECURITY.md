# Security policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately through [GitHub Security Advisories](https://github.com/konfpa/konspec-ui/security/advisories/new). Do not open a public issue for a reproducible security flaw.

Include the affected component and variant, a minimal reproduction, the input or conditions required to trigger it, and any suggested mitigation. We will acknowledge the report, investigate it, and coordinate disclosure where appropriate.

## Scope

Konspec UI publishes static HTML examples and small client-side expressions. Security concerns in scope include unsafe markup patterns, injection-prone handling of links or untrusted values, and client-side expressions that could evaluate user-controlled data unexpectedly.

Applications that copy these snippets remain responsible for escaping data, validating URLs, authentication and authorization, CSP, dependency pinning, and their own server-side security controls.

The documentation site demonstrates Tailwind CSS, Alpine.js, htmx, and Lucide through CDN assets. That is for documentation convenience; production applications should choose, pin, and preferably self-host their dependencies according to their security requirements.

## Supported versions

The current `main` branch is supported. Security fixes are published there first.
