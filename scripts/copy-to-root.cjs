const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        try {
          fs.copyFileSync(curSource, curTarget);
        } catch (copyErr) {}
      }
    });
  }
}

// Clean old js bundle files in assets directory before copying new build
if (fs.existsSync('assets')) {
  const oldFiles = fs.readdirSync('assets');
  oldFiles.forEach(f => {
    if (f.endsWith('.js')) {
      try { fs.unlinkSync(path.join('assets', f)); } catch (e) {}
    }
  });
}

// Sync compiled build to root directory for GitHub Pages direct branch deployment
if (fs.existsSync('dist')) {
  if (fs.existsSync('dist/index.html')) fs.copyFileSync('dist/index.html', 'index.html');
  if (fs.existsSync('dist/404.html')) fs.copyFileSync('dist/404.html', '404.html');
  if (fs.existsSync('dist/.nojekyll')) fs.copyFileSync('dist/.nojekyll', '.nojekyll');
  if (fs.existsSync('dist/CNAME')) fs.copyFileSync('dist/CNAME', 'CNAME');
  if (fs.existsSync('dist/assets')) copyFolderRecursiveSync('dist/assets', 'assets');
  if (fs.existsSync('dist/images')) copyFolderRecursiveSync('dist/images', 'images');
  if (fs.existsSync('public/images')) copyFolderRecursiveSync('public/images', 'images');
  console.log('Successfully cleaned old bundles and copied dist build assets for GitHub Pages!');
}
