import { readFile, writeFile } from 'node:fs/promises';
const config=JSON.parse(await readFile('site.config.json','utf8'));
export const siteUrl=process.env.SITE_URL||config.url;
const base=siteUrl?new URL(siteUrl.endsWith('/')?siteUrl:siteUrl+'/'):null;
if(base&&(base.protocol!=='https:'||base.search||base.hash||base.username))throw new Error('SITE_URL doit être une URL HTTPS publique sans paramètres.');
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const descriptions={
 'index.html':'Lucas Aveline, coordinateur de projets IT et fondateur de NexSecure. Cybersécurité, automatisation, développement et data : découvrez mon portfolio.',
 'pages/realisations.html':'Découvrez les applications métier et projets collectifs de Lucas Aveline : CRM, solutions web et analyse de données.',
 'pages/jeux.html':'Testez les jeux, outils et interfaces de Lucas Aveline : morpion, quiz, calculateur, générateur de mots de passe et démos web.',
 'pages/experiences.html':'Le parcours professionnel de Lucas Aveline : coordination IT, cybersécurité, automatisation et entrepreneuriat avec NexSecure.',
 'pages/formations.html':'Formations et diplômes de Lucas Aveline : Sup de Vinci, Webitech, parcours informatique et gestion de projets. CV 2026 et certifications.',
 'pages/veille.html':'Le journal de veille de Lucas Aveline : publications techniques de MDN, GitHub et Cloudflare sur le Web, les outils, le cloud et la sécurité.',
 'pages/contact.html':'Contactez Lucas Aveline pour échanger sur vos projets IT, le développement, l’automatisation ou les solutions proposées par NexSecure.',
 'pages/projets.html':'Archives des projets de formation informatique de Lucas Aveline et accès aux documents associés.'
};
const indexable=Object.keys(descriptions).filter(path=>path!=='pages/projets.html');
export function seoHead(path,title){
 const description=descriptions[path]||descriptions['index.html'];
 const canonical=base?new URL(path==='index.html'?'':path,base).href:null;
 const image=base?new URL('src/img/lucas-2026.jpg',base).href:null;
 const schema={'@context':'https://schema.org','@type':path==='index.html'?'ProfilePage':'WebPage',name:`${title} — Lucas Aveline`,description,inLanguage:'fr-FR',...(canonical?{url:canonical}:{}),...(path==='index.html'?{mainEntity:{'@type':'Person',name:'Lucas Aveline',jobTitle:'Coordinateur de projets IT',...(canonical?{url:canonical,image}:{}),sameAs:['https://www.linkedin.com/in/lucas-aveline/','https://github.com/Sunlama0'],affiliation:{'@type':'Organization',name:'NexSecure',url:'https://nexsecure.fr/'}}}:{})};
 return `<meta name="description" content="${esc(description)}"><meta name="robots" content="${indexable.includes(path)?'index,follow,max-image-preview:large':'noindex,follow'}"><meta name="author" content="Lucas Aveline">${canonical?`<link rel="canonical" href="${esc(canonical)}">`:''}<meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:site_name" content="Lucas Aveline — Portfolio"><meta property="og:title" content="${esc(title)} — Lucas Aveline"><meta property="og:description" content="${esc(description)}">${canonical?`<meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(image)}"><meta property="og:image:alt" content="Portrait de Lucas Aveline">`:''}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)} — Lucas Aveline"><meta name="twitter:description" content="${esc(description)}">${image?`<meta name="twitter:image" content="${esc(image)}">`:''}<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
}
export async function generateDiscovery(){
 if(!base)throw new Error('Renseigner url dans site.config.json ou SITE_URL pour générer le sitemap.');
 const urls=indexable.map(path=>new URL(path==='index.html'?'':path,base).href);
 await writeFile('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${esc(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
 await writeFile('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml',base).href}\n`);
 await writeFile('404.html',`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page introuvable — Lucas Aveline</title><style>body{font:17px/1.8 system-ui;margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1220;color:#edf4ff}main{max-width:520px;padding:30px}h1{font-size:42px;line-height:1.2}a{color:#91b7ff}small{letter-spacing:3px}</style></head><body><main><small>ERREUR 404</small><h1>Cette page n’existe plus.</h1><p>Le portfolio a évolué. Retrouvez les projets, le parcours et les expériences interactives depuis l’accueil.</p><a href="${esc(base.href)}">Revenir à l’accueil ↗</a></main></body></html>`);
}
