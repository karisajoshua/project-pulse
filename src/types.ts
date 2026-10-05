export type HealthLevel = 'excellent' | 'healthy' | 'attention' | 'critical'

export interface RepositorySignals {
  hasReadme: boolean
  hasLicense: boolean
  hasCi: boolean
  hasSecurityPolicy: boolean
  hasContributingGuide: boolean
  hasTests: boolean
  archived: boolean
  openIssues: number
  daysSincePush: number
}

export interface ScoreComponent {
  id: string
  label: string
  points: number
  maxPoints: number
  explanation: string
}

export interface RepositoryHealth {
  score: number
  level: HealthLevel
  components: readonly ScoreComponent[]
}
