import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)
const requireFromNext = createRequire(require.resolve('next/package.json'))
const sharp = requireFromNext('sharp')
const source = await readFile(new URL('../public/icons/sahara.svg', import.meta.url))

for (const [path, size] of [
  ['icons/icon-192.png', 192],
  ['icons/icon-512.png', 512],
  ['apple-icon.png', 180],
  ['icon-dark-32x32.png', 32],
  ['icon-light-32x32.png', 32],
]) {
  await sharp(source).resize(size, size).png().toFile(new URL(`../public/${path}`, import.meta.url).pathname)
}
