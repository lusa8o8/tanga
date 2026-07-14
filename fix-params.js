const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'artifacts/web/src/app');

function fixParams(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixParams(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Fix route handlers and server pages params typing
      // Match something like: ({ params }: { params: { id: string } })
      // Or: (request: Request, { params }: { params: { id: string } })
      const regexType = /({ params }: {\s*params:\s*{\s*(id|slug):\s*string;?\s*}\s*})/g;
      
      content = content.replace(regexType, (match, p1, p2) => {
        modified = true;
        return `{ params }: { params: Promise<{ ${p2}: string }> }`;
      });

      // Also fix places where params is just passed without destructuring in the signature but destructured later
      // Wait, let's also fix the usage: `const { id } = params;` -> `const { id } = await params;`
      // Or `params.id` -> `(await params).id`
      
      // Let's just do a regex for `const { id } = params;` or `const { slug } = params;`
      const regexUsage = /const\s+{\s*(id|slug)\s*}\s*=\s*params;/g;
      content = content.replace(regexUsage, (match, p1) => {
        modified = true;
        return `const { ${p1} } = await params;`;
      });

      // And what if the signature was `export async function GET(request: Request, { params }: { params: { id: string } })`
      // but it used `params.id` directly?
      const regexUsageDotId = /params\.id/g;
      if (regexUsageDotId.test(content) && content.includes('Promise<{')) {
        content = content.replace(regexUsageDotId, '(await params).id');
        modified = true;
      }
      
      const regexUsageDotSlug = /params\.slug/g;
      if (regexUsageDotSlug.test(content) && content.includes('Promise<{')) {
        content = content.replace(regexUsageDotSlug, '(await params).slug');
        modified = true;
      }

      // Check if it's a client component Page that receives params prop
      // Client components using `useParams()` don't need signature change for `params` prop unless it's used.
      // Usually, `useParams()` is used in our client pages instead of `params` prop. 
      // But let's check if the page uses `React.use()` or if it's already an async component.
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

fixParams(srcDir);
