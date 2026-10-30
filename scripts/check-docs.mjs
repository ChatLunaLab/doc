import { existsSync, readFileSync } from 'node:fs'
import { dirname, extname, join, posix, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'

const root = fileURLToPath(new URL('..', import.meta.url))

export function referenceTarget(reference, page) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) return
  const path = decodeURIComponent(reference.split(/[?#]/, 1)[0])
  if (!path) return
  const target = posix.normalize(path.startsWith('/') ? path.slice(1) : posix.join(posix.dirname(page), path))
  if (target.startsWith('../')) throw new Error(`Reference escapes the site: ${reference}`)
  if (target === '.' || path.endsWith('/')) return `${target === '.' ? '' : `${target}/`}index.html`
  if (target.endsWith('.md')) return target.slice(0, -3) + '.html'
  return extname(target) ? target : `${target}.html`
}

export function referencesOf(source) {
  const md = new MarkdownIt({ html: true })
  const references = []
  function visit(tokens) {
    for (const token of tokens) {
      if (token.type === 'link_open') references.push(token.attrGet('href'))
      if (token.type === 'image') references.push(token.attrGet('src'))
      if (token.type === 'html_block' || token.type === 'html_inline') {
        for (const match of token.content.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g)) references.push(match[1])
      }
      if (token.children) visit(token.children)
    }
  }
  const tokens = md.parse(source, {})
  visit(tokens)
  return { references, tokens }
}

export function checkPages(site, version) {
  const routes = new Set(site.pages.map(page => (site.rewrites.map[page] || page).replace(/\.md$/, '.html')))
  const errors = []
  let links = 0
  for (const page of site.pages) {
    const path = join(site.srcDir, page)
    const source = readFileSync(path, 'utf8')
    const route = site.rewrites.map[page] || page
    const { references, tokens } = referencesOf(source)
    if (version === 'v2' && route !== 'index.md' && !tokens.some(token => token.type === 'heading_open' && token.tag === 'h1')) {
      errors.push(`${page}: missing article heading`)
    }
    for (const reference of references) {
      const target = referenceTarget(reference, route)
      if (!target) continue
      links++
      if (routes.has(target) || existsSync(join(site.srcDir, 'public', target))) continue
      errors.push(`${page}: missing ${target} (from ${reference})`)
    }
    const prose = source.replace(/(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1/g, '')
    for (const match of prose.matchAll(/^\s*<<<\s+([^\s{#]+)/gm)) {
      if (!existsSync(resolve(dirname(path), match[1]))) errors.push(`${page}: missing include ${match[1]}`)
    }
  }
  const walk = (items) => {
    for (const item of items ?? []) {
      if (item.link) {
        const target = referenceTarget(item.link, 'index.md')
        if (target && !routes.has(target)) {
          errors.push(`navigation: missing ${target}`)
        }
      }
      if (item.items) walk(item.items)
    }
  }
  walk(site.site.themeConfig.nav)
  for (const items of Object.values(site.site.themeConfig.sidebar)) walk(items)
  if (version === 'v1' && site.pages.some(page => !page.startsWith('v1/'))) errors.push('v1 includes v2 source pages')
  if (version === 'v2' && site.pages.some(page => page.startsWith('v1/'))) errors.push('v2 includes archived source pages')
  return { errors, links, pages: site.pages.length }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const version = process.argv[2]
  if (!['v1', 'v2'].includes(version)) throw new Error('Usage: node scripts/check-docs.mjs v1|v2')
  process.env.CHATLUNA_DOCS_VERSION = version
  const { resolveConfig } = await import('vitepress')
  const site = await resolveConfig(join(root, 'docs'))
  const result = checkPages(site, version)
  for (const error of result.errors) console.error(error)
  console.log(`${version}: checked ${result.pages} pages and ${result.links} local references; ${result.errors.length} errors.`)
  if (result.errors.length) process.exitCode = 1
}
