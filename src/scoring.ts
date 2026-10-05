import type { HealthLevel, RepositoryHealth, RepositorySignals, ScoreComponent } from './types.js'

function component(id: string, label: string, pass: boolean, maxPoints: number, explanation: string): ScoreComponent {
  return { id, label, points: pass ? maxPoints : 0, maxPoints, explanation }
}

export function calculateRepositoryHealth(signals: RepositorySignals): RepositoryHealth {
  const components: ScoreComponent[] = [
    component('docs/readme', 'README', signals.hasReadme, 15, signals.hasReadme ? 'Repository explains itself.' : 'Add a README with purpose, setup and usage.'),
    component('governance/license', 'License', signals.hasLicense, 10, signals.hasLicense ? 'License is present.' : 'Add an explicit open-source license.'),
    component('automation/ci', 'Continuous integration', signals.hasCi, 20, signals.hasCi ? 'CI automation is present.' : 'Add automated checks for pull requests.'),
    component('security/policy', 'Security policy', signals.hasSecurityPolicy, 10, signals.hasSecurityPolicy ? 'Security reporting guidance is present.' : 'Add SECURITY.md with responsible reporting guidance.'),
    component('community/contributing', 'Contribution guide', signals.hasContributingGuide, 10, signals.hasContributingGuide ? 'Contribution guidance is present.' : 'Add CONTRIBUTING.md.'),
    component('quality/tests', 'Tests', signals.hasTests, 20, signals.hasTests ? 'Automated tests are present.' : 'Add automated tests for core behavior.'),
    component('maintenance/activity', 'Recent maintenance', !signals.archived && signals.daysSincePush <= 180, 15, signals.archived ? 'Repository is archived.' : signals.daysSincePush <= 180 ? 'Repository has recent activity.' : 'Repository has not been pushed to in more than 180 days.')
  ]

  const score = components.reduce((sum, item) => sum + item.points, 0)
  const level: HealthLevel = score >= 90 ? 'excellent' : score >= 75 ? 'healthy' : score >= 50 ? 'attention' : 'critical'
  return { score, level, components }
}
