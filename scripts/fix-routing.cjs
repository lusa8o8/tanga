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

      // fix useLocation to useRouter inside wouter import if it was left there
      if (content.includes('from "wouter"') || content.includes("from 'wouter'")) {
        content = content.replace(/import\s+\{([^}]*?)\}\s+from\s+['"]wouter['"]/g, (match, imports) => {
          let newImports = [];
          if (imports.includes('useRouter')) newImports.push('useRouter');
          if (imports.includes('useParams')) newImports.push('useParams');
          return newImports.length > 0 ? `import { ${newImports.join(', ')} } from "next/navigation"` : '';
        });
        changed = true;
      }

      // fix setLocation
      if (content.includes('const [, setLocation] = useRouter()')) {
        content = content.replace(/const\s+\[\s*,\s*setLocation\s*\]\s*=\s*useRouter\(\);?/g, 'const router = useRouter();');
        content = content.replace(/setLocation\(/g, 'router.push(');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('artifacts/web/src/components');
processDir('artifacts/web/src/pages_old');
