const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
        content = '"use client";\n' + content;
        changed = true;
      }
      if (content.includes('from "wouter"') || content.includes("from 'wouter'")) {
        content = content.replace(/import\s+\{\s*Link(.*?)\}\s+from\s+['"]wouter['"]/g, 'import Link from "next/link"');
        content = content.replace(/useLocation/g, 'useRouter');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('artifacts/web/src/pages');
