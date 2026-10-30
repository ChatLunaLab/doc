import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { referenceTarget } from './check-docs.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const version = process.argv[2]
if (version === undefined) {
  for (const name of ['v2', 'v1']) {
    const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url), name], { stdio: 'inherit' })
    if (result.status !== 0) process.exit(result.status ?? 1)
  }
} else {
  assert.ok(['v1', 'v2'].includes(version), 'Expected v1 or v2')
  process.env.CHATLUNA_DOCS_VERSION = version
  const { resolveConfig } = await import('vitepress')
  const site = await resolveConfig(join(root, 'docs'))
  const dir = site.outDir
  const hostname = version === 'v1' ? 'v1.chatluna.chat' : 'chatluna.chat'
  const routes = site.pages.map(page => (site.rewrites.map[page] || page).replace(/\.md$/, '.html'))
  assert.equal(readFileSync(join(dir, 'CNAME'), 'utf8').trim(), hostname)
  const sitemap = readFileSync(join(dir, 'sitemap.xml'), 'utf8')
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]))
  assert.equal(locations.length, routes.length)
  for (const location of locations) {
    assert.equal(location.hostname, hostname)
    assert.ok(!location.pathname.startsWith('/v1/'), `Archive prefix in sitemap: ${location}`)
    assert.ok(existsSync(join(dir, decodeURIComponent(location.pathname))))
  }
  const sitemapRoutes = new Set(locations.map(location => decodeURIComponent(location.pathname.slice(1))))
  for (const route of routes.filter(route => route !== 'index.html')) assert.ok(sitemapRoutes.has(route), `Missing sitemap route: ${route}`)
  const hashmap = JSON.parse(readFileSync(join(dir, 'hashmap.json'), 'utf8'))
  assert.equal(Object.keys(hashmap).length, routes.length)
  if (version === 'v2') assert.ok(Object.keys(hashmap).every(key => !key.startsWith('v1_')))
  else assert.ok(Object.keys(hashmap).some(key => key === 'guide_introduction.md'))
  const chunks = join(dir, 'assets/chunks')
  const indexFile = readdirSync(chunks).find(name => name.startsWith('@localSearchIndexroot.'))
  assert.ok(indexFile, 'Missing local search index')
  const search = JSON.parse((await import(pathToFileURL(join(chunks, indexFile)).href)).default)
  assert.ok(search.documentCount > 0)
  const searchRoutes = new Set(Object.values(search.documentIds).map(id => id.split('#')[0].slice(1)))
  for (const route of searchRoutes) assert.ok(routes.includes(route), `Foreign search route: ${route}`)
  assert.ok(searchRoutes.has(version === 'v1' ? 'guide/introduction.html' : 'guide/getting-started.html'))
  let references = 0
  const errors = []
  for (const [index, route] of routes.entries()) {
    const html = readFileSync(join(dir, route), 'utf8')
    if (route !== 'index.html') {
      assert.ok(html.includes(`https://github.com/ChatLunaLab/doc/edit/v2/docs/${site.pages[index]}`), `Wrong edit URL in ${route}`)
    }
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = referenceTarget(match[1], route)
      if (!target) continue
      references++
      if (!existsSync(join(dir, target))) errors.push(`${route}: missing ${target}`)
    }
  }
  assert.deepEqual([...new Set(errors)], [])
  assert.ok(existsSync(join(dir, '404.html')))
  if (version === 'v1') {
    assert.ok(existsSync(join(dir, 'guide/introduction.html')))
    assert.ok(!existsSync(join(dir, 'architecture/overview.html')))
  } else {
    assert.ok(existsSync(join(dir, 'architecture/overview.html')))
    assert.ok(!existsSync(join(dir, 'ecosystem/introduction.html')))
  }
  console.log(`${version}: checked ${routes.length} HTML pages, ${references} local references, search, edit links, sitemap and CNAME.`)
}
