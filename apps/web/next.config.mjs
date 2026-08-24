import path from 'node:path'
import { fileURLToPath } from 'node:url'

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** @type {import('next').NextConfig} */
export default {
  transpilePackages: ['@scope/ui'],
  // Not part of the bug — the vendored package has no React types of its own.
  typescript: { ignoreBuildErrors: true },
  outputFileTracingRoot: monorepoRoot,
  turbopack: { root: monorepoRoot },
}
