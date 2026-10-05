# ProjectPulse

**Explainable GitHub repository health and engineering analytics.**

ProjectPulse turns observable repository signals into a transparent engineering-health score. It is designed for maintainers who want a fast view of documentation, automation, security hygiene, testing and maintenance activity without pretending that a single score can measure software quality.

## What it measures

The initial model scores seven observable controls:

| Signal | Weight |
| --- | ---: |
| README | 15 |
| License | 10 |
| CI workflow | 20 |
| Security policy | 10 |
| Contribution guide | 10 |
| Tests | 20 |
| Recent maintenance activity | 15 |

Every point is explainable. Missing points include a remediation message.

## Principles

- **Explainable:** no opaque scoring.
- **Read-only by default:** analysis should not mutate repositories.
- **No vanity metrics:** stars and follower counts do not determine engineering health.
- **Safe automation:** never execute code from a repository merely to score it.
- **Extensible:** new signals should be independently testable.

## Development

Requires Node.js 22+.

```bash
npm install
npm run check
npm test
npm run build
```

## Roadmap

1. GitHub public-repository adapter.
2. CLI for `owner/repo` analysis.
3. JSON report schema.
4. Account-level portfolio summary.
5. Profile README integration.
6. Scheduled repository-health snapshots.

ProjectPulse is early-stage and the scoring model may evolve before a stable release.
