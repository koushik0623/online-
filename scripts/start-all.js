import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\n========================================================');
console.log(' ✨ Starting Sparkle @ KKV Backend & Frontend Servers...');
console.log('========================================================\n');

// 0. Prepare dev environment & index.html for Vite
try {
  execSync('node scripts/prepare-dev.cjs', { cwd: rootDir, stdio: 'inherit' });
} catch (e) {}

// 1. Start Backend Server
const serverProcess = spawn('node', ['server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

// 2. Prepare dev & start Vite Frontend
const viteProcess = spawn('npx', ['vite'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nShutting down Sparkle @ KKV servers...');
  serverProcess.kill();
  viteProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
