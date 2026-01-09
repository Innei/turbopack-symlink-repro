# Turbopack Symlink node_modules Reproduction

This repository demonstrates a bug where Turbopack build fails when `node_modules` is a symlink pointing to a parent directory.

## Bug Description

When building a Next.js application with Turbopack in a subdirectory that has `node_modules` symlinked from a parent directory, the build fails with:

```
Error [TurbopackInternalError]: Symlink node_modules is invalid, it points out of the filesystem root
```

## Environment

- Next.js: 16.1.1
- Platform: macOS (darwin arm64)
- Node: 20.x

## Steps to Reproduce

### Quick reproduction

```bash
chmod +x reproduce.sh
./reproduce.sh
```

### Manual reproduction

1. Clone this repository and install dependencies:
   ```bash
   pnpm install
   ```

2. Create a temporary build directory:
   ```bash
   mkdir -p tmp/build
   ```

3. Symlink `node_modules` from parent directory:
   ```bash
   ln -s "$(pwd)/node_modules" tmp/build/node_modules
   ```

4. Copy source files:
   ```bash
   cp -r src tmp/build/
   cp package.json next.config.ts tsconfig.json tmp/build/
   ```

5. Run Next.js build in the temporary directory:
   ```bash
   cd tmp/build
   pnpm next build
   ```

6. Observe the error:
   ```
   Error [TurbopackInternalError]: Symlink node_modules is invalid, it points out of the filesystem root
   ```

## Use Case

This pattern is common for:
- **Shadow/isolated builds**: Building in a temporary directory with modified source code while sharing dependencies
- **Electron app builds**: Desktop apps that need modified source but shared `node_modules`
- **Monorepo setups**: Shared dependencies across packages

## Expected Behavior

Turbopack should correctly resolve symlinked `node_modules` that point to parent directories, similar to how Webpack handles this scenario.

## Notes

- This worked fine with Webpack-based Next.js builds
- Copying `node_modules` instead of symlinking works, but defeats the purpose of avoiding ~1GB+ duplication
