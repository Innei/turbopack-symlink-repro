# Turbopack cannot resolve a package through a symlink-to-symlink chain

Next.js 16.3.0 · pnpm 11.20.0 · Node 24 · macOS arm64

## The shape

One workspace member is itself a symlink to a directory elsewhere in the repo
(here `vendor/`, in the original report a git submodule holding the sources):

```
packages/ui -> ../vendor/packages/ui      # the workspace member is a symlink
vendor/packages/ui/                       # the real package, "@scope/ui"
```

`pnpm install` links the dependency to the *workspace* path, so the consumer's
entry is a symlink pointing at another symlink:

```
apps/web/node_modules/@scope/ui -> ../../../../packages/ui   (symlink)
packages/ui                     -> ../vendor/packages/ui     (symlink)
vendor/packages/ui                                           (real directory)
```

Every real path stays inside `turbopack.root` / `outputFileTracingRoot`, both
pinned to the repo root in `apps/web/next.config.mjs`.

## Reproduce

```bash
pnpm install
cd apps/web
pnpm dev          # Turbopack  -> 500, Can't resolve '@scope/ui/hello'
pnpm dev:webpack  # webpack    -> 200
pnpm build        # Turbopack  -> Build error: Can't resolve '@scope/ui/hello'
```

Node itself resolves the same specifier from the same directory:

```bash
node -e "console.log(require.resolve('@scope/ui/hello', { paths: [process.cwd()] }))"
```

## The isolation

Repoint the consumer link at the **same real directory** with a single hop and
Turbopack resolves it:

```bash
cd apps/web
rm node_modules/@scope/ui
ln -s ../../../../vendor/packages/ui node_modules/@scope/ui
rm -rf .next
pnpm dev     # -> 200
pnpm build   # -> Compiled successfully
```

Same target, same `package.json`, same `exports`, same config. Only the shape
of the link changes.

## Observed

| consumer link | Turbopack dev | Turbopack build | webpack dev |
| --- | --- | --- | --- |
| chained (what pnpm creates) | 500, `Can't resolve` | fails, `Can't resolve` | 200 |
| flattened to the real dir | 200 | Compiled successfully | 200 |
