import { describe, expect, it } from 'vitest'
import { createReport, REPORT_SCHEMA_VERSION } from '../src/report.js'
import { calculateRepositoryHealth } from '../src/scoring.js'

describe('createReport', () => {
  it('creates a stable versioned JSON report', () => {
    const health=calculateRepositoryHealth({hasReadme:true,hasLicense:true,hasCi:true,hasSecurityPolicy:true,hasContributingGuide:true,hasTests:true,archived:false,openIssues:0,daysSincePush:1})
    const report=createReport('owner/repo',health,new Date('2026-10-05T00:00:00Z'))
    expect(report).toMatchObject({schemaVersion:REPORT_SCHEMA_VERSION,repository:'owner/repo',generatedAt:'2026-10-05T00:00:00.000Z'})
    expect(report.health.score).toBe(100)
  })
  it('rejects an empty repository identifier',()=>expect(()=>createReport(' ',{score:0,level:'critical',components:[]})).toThrow())
})
