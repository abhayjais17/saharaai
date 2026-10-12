import { readFile, writeFile } from 'node:fs/promises'

const files = process.argv.slice(2)
const samples = files.length ? files : [
  'public/mock/sample-form.svg',
  'public/mock/sample-bill-sms.svg',
  'public/mock/sample-scam-sms.svg',
]

const response = await fetch('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap', {
  headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' },
})
if (!response.ok) throw new Error(`Font stylesheet request failed: ${response.status}`)
let css = await response.text()
const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(match => match[1]))]
if (!urls.length) throw new Error('No Mukta font sources found')
for (const url of urls) {
  const font = await fetch(url)
  if (!font.ok) throw new Error(`Font request failed: ${font.status}`)
  const mime = url.endsWith('.woff2') ? 'font/woff2' : 'font/ttf'
  css = css.replaceAll(url, `data:${mime};base64,${Buffer.from(await font.arrayBuffer()).toString('base64')}`)
}
css = css.replaceAll('font-display: swap;', 'font-display: block;')
for (const file of samples) {
  const original = await readFile(file, 'utf8')
  const svg = original.replace(/\n?  <defs data-embedded-font="Mukta">[\s\S]*?<\/defs>\n?/, '\n')
  const embedded = svg.replace(/(<svg[^>]*>)/, `$1\n  <defs data-embedded-font="Mukta"><style>${css}</style></defs>`)
  await writeFile(file, embedded)
}
console.log(`Embedded self-contained Mukta fonts in ${samples.length} sample SVGs`)
