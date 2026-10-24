import { cp, mkdir, rm } from 'node:fs/promises'

const outputDirectory = new URL('./dist/', import.meta.url)
await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })

for (const file of ['index.html', 'learnings.html', 'resources.html', 'about.html', 'admin.html', 'styles.css', 'script.js', 'admin.css', 'admin.js', 'robots.txt', 'sitemap.xml']) {
  await cp(new URL(`./${file}`, import.meta.url), new URL(`./dist/${file}`, import.meta.url))
}

await cp(new URL('./functions/', import.meta.url), new URL('./dist/functions/', import.meta.url), { recursive: true })

console.log('Static site copied to dist/.')
