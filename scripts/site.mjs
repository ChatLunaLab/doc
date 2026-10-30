import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const [command, version] = process.argv.slice(2)
if (!['build', 'dev', 'preview'].includes(command) || !['v1', 'v2'].includes(version)) {
  throw new Error('Usage: node scripts/site.mjs build|dev|preview v1|v2')
}
const result = spawnSync(process.execPath, [
  fileURLToPath(new URL('../node_modules/vitepress/bin/vitepress.js', import.meta.url)),
  command, 'docs', ...process.argv.slice(4),
], {
  cwd: fileURLToPath(new URL('..', import.meta.url)),
  env: { ...process.env, CHATLUNA_DOCS_VERSION: version },
  stdio: 'inherit',
})
if (result.error) throw result.error
process.exit(result.status ?? 1)
