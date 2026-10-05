# ProjectPulse

**Explainable, read-only GitHub repository health analytics.**

ProjectPulse converts observable repository controls into a transparent 0–100 engineering-health score. It is intentionally conservative: it inspects metadata and repository structure, never executes analyzed repository code, and never uses stars or follower counts as quality signals.

## Scoring model

| Signal | Weight |
| --- | ---: |
| README | 15 |
| License | 10 |
| CI workflow | 20 |
| Security policy | 10 |
| Contribution guide | 10 |
| Tests | 20 |
| Recent maintenance activity | 15 |

Health bands are **Excellent ≥90**, **Healthy ≥75**, **Needs attention ≥50**, and **Critical <50**. Every component includes an explanation and remediation guidance when points are missing.

## CLI and JSON reports

Requires Node.js 22+.

```bash
npm install
npm run build
node dist/cli.js --repository owner/repo --signals ./signals.json --pretty
```

The CLI emits a machine-readable, versioned report with `schemaVersion: "1.0"`. The signals file follows the exported `RepositorySignals` interface.

## Portfolio bot

`scripts/profile-pulse.mjs` powers the profile automation. It discovers repositories visible to its credential, scores maintained repositories using the same 100-point model, and generates a marker-bounded Markdown snapshot.

Private repositories are privacy-safe by design: they may contribute to aggregate counts and the combined score, but their names and individual scores are never written to the public profile. Private discovery requires an account credential authorized by GitHub; missing authorization is surfaced explicitly as bot status.

## Security model

- Read-only analysis.
- Never execute code from analyzed repositories.
- Treat repository metadata and file paths as untrusted input.
- Never publish private repository identities in profile output.
- Never log or commit access tokens.
- Use least-privilege credentials.

See `SECURITY.md` for reporting guidance.

## Development

```bash
npm install
npm run check
npm test
npm run build
```

CI runs type checking, tests and a production build on pushes and pull requests to `main`.

## v1 scope

ProjectPulse v1 includes the explainable scoring engine, GitHub signal derivation, versioned JSON reports, CLI output, automated account portfolio snapshots, public/private privacy boundaries, scheduled profile integration and authorization diagnostics.

Future signals such as branch protection can be added only when they remain explainable, read-only and independently testable.

## License

Apache-2.0.
