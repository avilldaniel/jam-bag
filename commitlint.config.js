export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only
        'style', // Formatting, whitespace (not CSS)
        'refactor', // Code change that neither fixes nor adds
        'perf', // Performance improvement
        'test', // Adding or updating tests
        'build', // Build system or dependencies
        'ci', // CI configuration
        'chore', // Maintenance tasks
        'revert', // Reverting a previous commit
        'wip', // Work in progress
      ],
    ],
  },
}
