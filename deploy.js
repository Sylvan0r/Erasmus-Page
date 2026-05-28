import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repo = 'https://github.com/Sylvan0r/Erasmus-Page.git';
const branch = 'gh-pages';
const root = process.cwd();
const distDir = path.resolve(root, 'dist');
const deployDir = path.resolve(root, '.gh-pages-deploy');

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function ensureDist() {
  if (!fs.existsSync(distDir) || !fs.statSync(distDir).isDirectory()) {
    throw new Error('The dist directory does not exist. Run `npm run build` first.');
  }
}

function cleanDeployDir() {
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
}

function cloneBranch() {
  try {
    run(`git clone --branch ${branch} --single-branch --depth 1 ${repo} "${deployDir}"`);
  } catch (error) {
    console.log(`Branch ${branch} not found or clone failed. Creating orphan branch instead.`);
    run(`git clone ${repo} "${deployDir}"`);
    run(`git -C "${deployDir}" checkout --orphan ${branch}`);
  }
}

function cleanDeployContents() {
  for (const entry of fs.readdirSync(deployDir)) {
    if (entry === '.git') continue;
    fs.rmSync(path.join(deployDir, entry), { recursive: true, force: true });
  }
}

function copyDist() {
  // 🔥 CORREGIDO: Subimos el límite a 100MB (el límite máximo real de GitHub)
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else if (entry.isFile()) {
        const stats = fs.statSync(srcPath);
        if (stats.size <= MAX_FILE_SIZE) {
          fs.copyFileSync(srcPath, destPath);
        } else {
          console.log(`⚠️ Skipping ultra large file: ${srcPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        }
      }
    }
  }

  copyRecursive(distDir, deployDir);

  // ✅ EXTRA: Crea el archivo .nojekyll automáticamente para asegurar la carga de multimedia
  fs.writeFileSync(path.join(deployDir, '.nojekyll'), '');
}

function commitAndPush() {
  run(`git -C "${deployDir}" add --all`);
  try {
    run(`git -C "${deployDir}" commit -m "Deploy to GitHub Pages"`);
  } catch (error) {
    console.log('No changes to commit. Skipping commit.');
  }
  run(`git -C "${deployDir}" push origin ${branch} --force`);
}

function main() {
  ensureDist();
  cleanDeployDir();
  cloneBranch();
  cleanDeployContents();
  copyDist();
  commitAndPush();
  cleanDeployDir();
  console.log('Deployment completed successfully.');
}

main();