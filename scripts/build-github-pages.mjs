#!/usr/bin/env node
/**
 * Static export for GitHub Pages: API and server-only routes are moved aside
 * because `output: 'export'` does not support Route Handlers or Prisma.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const stashDir = path.join(root, '.pages-stash');

const moveAside = [
  'app/api',
  'app/dev',
  'app/admin',
  'app/casos',
];

function stash() {
  fs.mkdirSync(stashDir, { recursive: true });
  for (const rel of moveAside) {
    const src = path.join(root, rel);
    const dest = path.join(stashDir, rel);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.renameSync(src, dest);
    }
  }
}

function restore() {
  for (const rel of moveAside) {
    const dest = path.join(root, rel);
    const src = path.join(stashDir, rel);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
      fs.renameSync(src, dest);
    }
  }
  if (fs.existsSync(stashDir)) fs.rmSync(stashDir, { recursive: true });
}

stash();
try {
  const result = spawnSync(
    'npx',
    ['next', 'build'],
    {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        GITHUB_PAGES: 'true',
        GITHUB_PAGES_BASE_PATH: process.env.GITHUB_PAGES_BASE_PATH || 'reclama-es',
        NEXT_PUBLIC_GITHUB_PAGES: 'true',
      },
    },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
} finally {
  restore();
}
