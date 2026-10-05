import type { RepositorySignals } from './types.js'

export interface GitHubRepositorySnapshot {
  archived: boolean
  open_issues_count: number
  pushed_at: string
}

export interface RepositoryFileIndex {
  paths: readonly string[]
}

function hasPath(paths: readonly string[], pattern: RegExp): boolean {
  return paths.some((path) => pattern.test(path))
}

export function deriveSignals(repository: GitHubRepositorySnapshot, files: RepositoryFileIndex, now = new Date()): RepositorySignals {
  const pushedAt = new Date(repository.pushed_at)
  const daysSincePush = Number.isNaN(pushedAt.getTime())
    ? Number.MAX_SAFE_INTEGER
    : Math.max(0, Math.floor((now.getTime() - pushedAt.getTime()) / 86_400_000))

  return {
    hasReadme: hasPath(files.paths, /^readme(?:\.[^/]+)?$/i),
    hasLicense: hasPath(files.paths, /^(license|licence)(?:\.[^/]+)?$/i),
    hasCi: hasPath(files.paths, /^\.github\/workflows\/.+\.ya?ml$/i),
    hasSecurityPolicy: hasPath(files.paths, /^(?:\.github\/)?security\.md$/i),
    hasContributingGuide: hasPath(files.paths, /^(?:\.github\/)?contributing\.md$/i),
    hasTests: hasPath(files.paths, /(^|\/)(test|tests|__tests__)(\/|$)|\.(test|spec)\.[^/]+$/i),
    archived: repository.archived,
    openIssues: repository.open_issues_count,
    daysSincePush
  }
}
