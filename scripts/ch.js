import { execSync } from 'node:child_process'

const steps = [
  { name: 'Lint', command: 'pnpm run lint' },
  { name: 'Test', command: 'pnpm run test' },
  { name: 'TypeScript check', command: 'pnpm run ts-check' },
  { name: 'Build', command: 'pnpm run build' }
]

console.log('\n========== Starting code health checks ==========\n')

for (const step of steps) {
  const startedAt = Date.now()

  try {
    console.log(`\n▶ ${step.name}...`)
    execSync(step.command, { stdio: 'inherit' })
    console.log(
      `✔ ${step.name} finished in ${((Date.now() - startedAt) / 1000).toFixed(2)}s`
    )
  } catch {
    console.error(
      `\n✖ ${step.name} failed. Fix the issues above and try again.`
    )
    process.exit(1)
  }
}

console.log('\n🏁 All checks passed. You can commit now.\n')
