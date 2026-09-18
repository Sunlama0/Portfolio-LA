import { readFile, writeFile } from 'node:fs/promises';
import { projects } from '../src/projects.mjs';
for(const project of projects.filter(item=>item.url?.startsWith('projets/'))){
 let html=await readFile(project.url,'utf8');
 if(!html.includes('demo-navigation.css')) html=html.replace('</head>','<link rel="stylesheet" href="../../src/demo-navigation.css">\n</head>');
 if(!html.includes('portfolio-demo-back')) html=html.replace(/<body([^>]*)>/,'<body$1>\n<a class="portfolio-demo-back" href="../../pages/jeux.html">← Retour aux démos</a>');
 if(project.id==='chat')html=html.replace('http://code.jquery.com/','https://code.jquery.com/');
 if(project.id==='password')html=html.replace('href="./css/queries.css "','href="./css/queries.css"');
 if(project.id==='qcm'){
  if(!html.includes('id="result"'))html=html.replace('<div class="footer-text">','<p id="result" role="status" style="display:none"></p>\n            <div class="footer-text">');
  html=html.replace(/(data-question-name="question4"[\s\S]*?<p>)[\s\S]*?<\/p>/,'$1Quelle est la capitale de la Slovénie ?</p>');
  html=html.replace('La chute de l\'Empire Romain se situe en ?','En quelle année l’Empire romain est-il partagé entre Orient et Occident ?');
 }
 await writeFile(project.url,html);
}
const server=await readFile('scripts/serve.mjs','utf8');
await writeFile('scripts/serve.mjs',server.replace("'.js':'text/javascript'","'.js':'text/javascript', '.mjs':'text/javascript'"));
const pkg=JSON.parse(await readFile('package.json','utf8'));
pkg.scripts.generate='node scripts/generate.mjs';pkg.scripts.build='node scripts/generate.mjs && node scripts/build.mjs';
await writeFile('package.json',JSON.stringify(pkg,null,2)+'\n');
