import type { RepositoryHealth } from './types.js'

export const REPORT_SCHEMA_VERSION = '1.0' as const

export interface ProjectPulseReport {
  schemaVersion: typeof REPORT_SCHEMA_VERSION
  repository: string
  generatedAt: string
  health: RepositoryHealth
}

export function createReport(repository: string, health: RepositoryHealth, generatedAt = new Date()): ProjectPulseReport {
  if (!repository.trim()) throw new Error('repository is required')
  return { schemaVersion: REPORT_SCHEMA_VERSION, repository, generatedAt: generatedAt.toISOString(), health }
}
