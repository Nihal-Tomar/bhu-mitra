const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const shimFile = path.join(distDir, 'main.js');

if (fs.existsSync(distDir)) {
  const content = `// Auto-generated entrypoint shim\nrequire('./apps/api/src/main.js');\n`;
  fs.writeFileSync(shimFile, content, 'utf8');
  console.log('[Postbuild] Created entrypoint shim at dist/main.js');
}
