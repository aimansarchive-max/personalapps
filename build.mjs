import { cp, mkdir, rm } from 'node:fs/promises'

const outputDirectory = new URL('./dist/', import.meta.url)
await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })

for (const file of ['index.html', 'learnings.html', 'resources.html', 'about.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml']) {
  await cp(new URL(`./${file}`, import.meta.url), new URL(`./dist/${file}`, import.meta.url))
}

console.log('Static site copied to dist/.')
