const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'artifacts/web/src/app/admin/page.tsx', component: 'AdminDashboard', importPath: '@/pages_old/admin/dashboard' },
  { path: 'artifacts/web/src/app/admin/books/page.tsx', component: 'AdminBooksList', importPath: '@/pages_old/admin/books/list' },
  { path: 'artifacts/web/src/app/admin/books/new/page.tsx', component: 'AdminBooksForm', importPath: '@/pages_old/admin/books/form' },
  { path: 'artifacts/web/src/app/admin/books/[id]/edit/page.tsx', component: 'AdminBooksForm', importPath: '@/pages_old/admin/books/form' },
  { path: 'artifacts/web/src/app/admin/authors/page.tsx', component: 'AdminAuthorsList', importPath: '@/pages_old/admin/authors/list' },
  { path: 'artifacts/web/src/app/admin/authors/new/page.tsx', component: 'AdminAuthorsForm', importPath: '@/pages_old/admin/authors/form' },
  { path: 'artifacts/web/src/app/admin/authors/[id]/edit/page.tsx', component: 'AdminAuthorsForm', importPath: '@/pages_old/admin/authors/form' },
  { path: 'artifacts/web/src/app/inquiry/page.tsx', component: 'Inquiry', importPath: '@/pages_old/inquiry' },
];

for (const page of pages) {
  const dir = path.dirname(page.path);
  fs.mkdirSync(dir, { recursive: true });
  const content = `"use client";\nimport ${page.component} from "${page.importPath}";\nexport default function Page() {\n  return <${page.component} />;\n}\n`;
  fs.writeFileSync(page.path, content);
}
