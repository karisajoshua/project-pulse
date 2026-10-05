import { describe, expect, it } from 'vitest'
import { deriveSignals } from '../src/github.js'

describe('deriveSignals', () => {
  it('derives repository health signals from metadata and paths', () => {
    const result = deriveSignals(
      { archived: false, open_issues_count: 4, pushed_at: '2026-10-01T00:00:00Z' },
      { paths: ['README.md', 'LICENSE', 'SECURITY.md', 'CONTRIBUTING.md', '.github/workflows/ci.yml', 'tests/core.test.ts'] },
      new Date('2026-10-05T00:00:00Z')
    )
    expect(result).toMatchObject({ hasReadme: true, hasLicense: true, hasCi: true, hasSecurityPolicy: true, hasContributingGuide: true, hasTests: true, daysSincePush: 4 })
  })
})
