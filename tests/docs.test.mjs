import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { checkPages, referenceTarget, referencesOf } from '../scripts/check-docs.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))

test('references resolve against published routes, not archive source paths', () => {
  assert.equal(referenceTarget('/guide/setup', 'index.md'), 'guide/setup.html')
  assert.equal(referenceTarget('./setup.md#model', 'guide/start.md'), 'guide/setup.html')
  assert.equal(referenceTarget('../images/example%20image.png', 'guide/start.md'), 'images/example image.png')
  assert.equal(referenceTarget('/', 'guide/start.md'), 'index.html')
  assert.equal(referenceTarget('https://v1.chatluna.chat/guide/', 'index.md'), undefined)
  assert.equal(referenceTarget('#next', 'guide/start.md'), undefined)
  assert.throws(() => referenceTarget('../../private', 'guide/start.md'), /escapes/)
})

test('extracts Markdown and HTML links without treating code samples as navigation', () => {
  const { references } = referencesOf('[Guide](/guide/setup)\n\n![Image](/images/logo.png)\n\n<a href="/reference/cli.html">CLI</a>\n\n```html\n<a href="/not-a-route">example</a>\n```')
  assert.deepEqual(references, ['/guide/setup', '/images/logo.png', '/reference/cli.html'])
})

test('checks includes, assets and navigation through the actual archive rewrite', () => {
  const dir = mkdtempSync(join(tmpdir(), 'chatluna-doc-check-'))
  try {
    mkdirSync(join(dir, 'v1/guide'), { recursive: true })
    mkdirSync(join(dir, 'public/images'), { recursive: true })
    writeFileSync(join(dir, 'public/images/test.svg'), '<svg/>')
    writeFileSync(join(dir, 'v1/guide/start.md'), '# Start\n\n[Home](/)\n\n![Asset](/images/test.svg)')
    writeFileSync(join(dir, 'v1/index.md'), '# Home\n\n[Start](/guide/start)')
    const site = {
      srcDir: dir,
      pages: ['v1/index.md', 'v1/guide/start.md'],
      rewrites: { map: { 'v1/index.md': 'index.md', 'v1/guide/start.md': 'guide/start.md' } },
      site: { themeConfig: { nav: [{ link: '/guide/start' }], sidebar: {} } },
    }
    assert.deepEqual(checkPages(site, 'v1').errors, [])
    writeFileSync(join(dir, 'v1/guide/start.md'), '# Start\n\n![Missing](/images/missing.svg)\n\n<<< ../../public/missing.yml')
    const result = checkPages(site, 'v1')
    assert.equal(result.errors.length, 2)
    assert.match(result.errors.join('\n'), /missing\.svg/)
    assert.match(result.errors.join('\n'), /missing include/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('both versions fail missing routes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'chatluna-doc-links-'))
  try {
    writeFileSync(join(dir, 'index.md'), '# Home\n\n[Missing](/missing)')
    const site = { srcDir: dir, pages: ['index.md'], rewrites: { map: {} }, site: { themeConfig: { nav: [], sidebar: {} } } }
    assert.equal(checkPages(site, 'v2').errors.length, 1)
    assert.match(checkPages(site, 'v1').errors.join('\n'), /missing\.html/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('site launcher rejects unsupported commands and versions before launching VitePress', () => {
  for (const args of [['build', 'v3'], ['publish', 'v2'], []]) {
    const result = spawnSync(process.execPath, [join(root, 'scripts/site.mjs'), ...args], { encoding: 'utf8' })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Usage: node scripts\/site\.mjs/)
  }
})
