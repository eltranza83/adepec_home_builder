import fs from 'fs';
import path from 'path';

const filesToScan = [
  'index.html',
  'portfolio.html',
  'src/main.js',
  'src/data/portfolio.js',
  'src/portfolio.js',
  'src/style.css'
];

const publicDir = 'public';
const assetRegex = /\/assets\/[a-zA-Z0-9_\-\.\/]+/g;

let missingCount = 0;
let checkedCount = 0;
const uniqueAssets = new Set();

console.log('🔍 Starting Quality Check: Verifying project asset references...');

filesToScan.forEach(filePath => {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    // Some files like portfolio.js might not exist yet when running this initially
    return;
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    uniqueAssets.add(match[0]);
  }
});

uniqueAssets.forEach(assetPath => {
  // Vite serving: /assets/xyz matches public/assets/xyz on disk
  const diskPath = path.join(publicDir, assetPath);
  checkedCount++;
  
  if (!fs.existsSync(diskPath)) {
    console.error(`❌ Broken Asset Link: "${assetPath}" referenced in code but missing on disk at "${diskPath}"`);
    missingCount++;
  }
});

console.log(`\n📊 Summary: Checked ${checkedCount} unique asset paths.`);

if (missingCount > 0) {
  console.error(`💥 Failed: ${missingCount} broken asset path(s) found! Please fix them.`);
  process.exit(1);
} else {
  console.log('✅ Success: All referenced assets exist on disk.');
  process.exit(0);
}
