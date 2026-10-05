# Contributing to ProjectPulse

Thanks for contributing.

## Development

Use Node.js 22 or newer.

```bash
npm install
npm run check
npm test
npm run build
```

Create focused branches from `main` and use Conventional Commit messages.

## Engineering rules

- Keep health signals explainable and independently testable.
- Do not add vanity metrics as health criteria.
- Do not execute analyzed repository code.
- Use synthetic fixtures only.
- Avoid network access inside scoring rules.
- Include positive and negative tests for new signals.
- Document the rationale for any scoring-weight change.

## Pull requests

Explain what changed, why, how it was tested and any limitations. Link the relevant issue when applicable.
