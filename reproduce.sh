#!/bin/bash
set -e

echo "🔧 Setting up reproduction environment..."

# Install dependencies in the root directory
echo "📦 Installing dependencies..."
pnpm install

# Create a subdirectory for isolated build
TEMP_DIR="tmp/build"
echo "📂 Creating temporary build directory: $TEMP_DIR"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Symlink node_modules and packages from parent directory using RELATIVE path
# This is key - the symlinks point "out" of the build directory
echo "🔗 Creating symlinks (relative paths)..."
cd "$TEMP_DIR"
ln -s ../../node_modules node_modules
ln -s ../../packages packages
cd - > /dev/null

# Copy necessary files
echo "📋 Copying source files..."
cp -r src "$TEMP_DIR/"
cp package.json "$TEMP_DIR/"
cp next.config.ts "$TEMP_DIR/"
cp tsconfig.json "$TEMP_DIR/"

# Run build in the temporary directory
echo "🏗  Running next build with Turbopack in $TEMP_DIR..."
cd "$TEMP_DIR"

# This will fail with: "Symlink node_modules is invalid, it points out of the filesystem root"
pnpm next build

echo "✅ Build completed (if you see this, the bug is fixed!)"
