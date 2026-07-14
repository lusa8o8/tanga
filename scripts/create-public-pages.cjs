const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'artifacts/web/src/app/page.tsx', component: 'Home', importPath: '@/pages_old/home' },
  { path: 'artifacts/web/src/app/catalog/page.tsx', component: 'Catalog', importPath: '@/pages_old/catalog' },
  { path: 'artifacts/web/src/app/books/[slug]/page.tsx', component: 'BookDetail', importPath: '@/pages_old/book-detail' },
  { path: 'artifacts/web/src/app/authors/[slug]/page.tsx', component: 'AuthorDetail', importPath: '@/pages_old/author-detail' },
  { path: 'artifacts/web/src/app/bulk-orders/page.tsx', component: 'BulkOrders', importPath: '@/pages_old/bulk-orders' },
  { path: 'artifacts/web/src/app/about/page.tsx', component: 'About', importPath: '@/pages_old/about' },
];

for (const page of pages) {
  const dir = path.dirname(page.path);
  fs.mkdirSync(dir, { recursive: true });
  const content = `"use client";\nimport ${page.component} from "${page.importPath}";\nexport default function Page() {\n  return <${page.component} />;\n}\n`;
  fs.writeFileSync(page.path, content);
}
