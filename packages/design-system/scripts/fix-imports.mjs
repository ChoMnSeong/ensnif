import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'

const walk = (dir) => {
    const out = []
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name)
        if (entry.isDirectory()) out.push(...walk(p))
        else if (/\.(ts|tsx)$/.test(entry.name)) out.push(p)
    }
    return out
}

const fixImport = (importPath, fromFile) => {
    if (importPath.endsWith('.js') || importPath.endsWith('.json')) return importPath
    const fromDir = dirname(fromFile)
    const abs = resolve(fromDir, importPath)
    if (existsSync(abs + '.ts') || existsSync(abs + '.tsx')) return importPath + '.js'
    if (existsSync(abs) && statSync(abs).isDirectory()) {
        if (existsSync(join(abs, 'index.ts')) || existsSync(join(abs, 'index.tsx'))) {
            return importPath + '/index.js'
        }
    }
    return importPath
}

const files = walk('src')
let total = 0
for (const file of files) {
    const content = readFileSync(file, 'utf8')
    const next = content.replace(
        /from '(\.\.?\/[^']+)'/g,
        (_m, p) => `from '${fixImport(p, file)}'`,
    )
    if (next !== content) {
        writeFileSync(file, next)
        total += 1
        console.log('fixed', file)
    }
}
console.log(`done, ${total} files updated`)
