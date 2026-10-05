import { describe, expect, it } from 'vitest'
import { calculateRepositoryHealth } from '../src/scoring.js'

describe('calculateRepositoryHealth', () => {
  it('scores a well-maintained repository at 100', () => {
    const result = calculateRepositoryHealth({
      hasReadme: true, hasLicense: true, hasCi: true, hasSecurityPolicy: true,
      hasContributingGuide: true, hasTests: true, archived: false, openIssues: 3, daysSincePush: 7
    })
    expect(result.score).toBe(100)
    expect(result.level).toBe('excellent')
  })

  it('explains missing engineering controls', () => {
    const result = calculateRepositoryHealth({
      hasReadme: true, hasLicense: false, hasCi: false, hasSecurityPolicy: false,
      hasContributingGuide: false, hasTests: false, archived: false, openIssues: 0, daysSincePush: 400
    })
    expect(result.score).toBe(15)
    expect(result.level).toBe('critical')
    expect(result.components.some((item) => item.points === 0 && item.explanation.length > 0)).toBe(true)
  })
})
