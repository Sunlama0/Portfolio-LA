import { cp, mkdir } from 'node:fs/promises';
await mkdir('site-dist', { recursive: true });
for (const path of ['index.html', 'src', 'pages', 'projets', 'dist', 'robots.txt', 'sitemap.xml', '404.html']) await cp(path, `site-dist/${path}`, { recursive: true });
console.log('Site statique prêt dans site-dist/');
