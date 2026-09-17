import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

try {
  console.log('⚔️  Building and generating static crypt...')
  execSync('npm run generate', { stdio: 'inherit' })

  const outputDir = join(process.cwd(), '.output', 'public')
  const gitDir = join(outputDir, '.git')

  if (existsSync(gitDir)) {
    rmSync(gitDir, { recursive: true, force: true })
  }

  console.log('🚀 Pushing to gh-pages branch...')
  execSync('git init', { cwd: outputDir, stdio: 'inherit' })
  execSync('git checkout -b gh-pages', { cwd: outputDir, stdio: 'inherit' })
  execSync('git add -A', { cwd: outputDir, stdio: 'inherit' })
  execSync('git commit -m "deploy: update static crypt on GitHub Pages"', { cwd: outputDir, stdio: 'inherit' })
  execSync('git remote add origin https://github.com/McMmax/typeshi.git', { cwd: outputDir, stdio: 'inherit' })
  execSync('git push -f origin gh-pages', { cwd: outputDir, stdio: 'inherit' })

  if (existsSync(gitDir)) {
    rmSync(gitDir, { recursive: true, force: true })
  }

  console.log('✨ Deployed successfully to https://mcmmax.github.io/typeshi/ !')
} catch (error) {
  console.error('Deployment failed:', error)
  process.exit(1)
}
