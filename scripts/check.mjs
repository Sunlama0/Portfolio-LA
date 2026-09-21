import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { projects } from '../src/projects.mjs';
const base='http://127.0.0.1:4173/';
let server;
try{await fetch(base);}catch{server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'ignore'});for(let i=0;i<50;i++){try{await fetch(base);break;}catch{await new Promise(resolve=>setTimeout(resolve,100));}}}
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',error=>errors.push({url:page.url(),message:error.message}));
const paths=['index.html','pages/realisations.html','pages/jeux.html','pages/experiences.html','pages/formations.html','pages/projets.html','pages/veille.html','pages/contact.html'];
await mkdir('.playwright',{recursive:true});
try{
 for(const path of paths){
  await page.goto(base+path,{waitUntil:'networkidle'});
  await expect(page.locator('h1')).toHaveCount(1);
  const links=await page.locator('a[href]').evaluateAll(items=>items.map(item=>item.getAttribute('href')).filter(href=>!href.startsWith('http')&&!href.startsWith('#')));
  for(const href of links){const response=await page.request.get(new URL(href,page.url()).href);assert.equal(response.status(),200,`${path}: ${href}`);}
  for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),{message:`Overflow: ${path} at ${width}`}).toBe(true);}
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'pages/realisations.html');
 await expect(page.locator('.project-card:visible')).toHaveCount(7);
 await page.getByRole('button',{name:'Applications',exact:true}).click();
 await expect(page.locator('.project-card:visible')).toHaveCount(6);
 await page.getByRole('button',{name:'Tout voir',exact:true}).click();
 await page.getByRole('searchbox').fill('laravel');
 await expect(page.locator('.project-card:visible')).toHaveCount(1);
 await page.getByRole('searchbox').fill('introuvable123');
 await expect(page.locator('.empty-state')).toBeVisible();
 await page.getByRole('button',{name:'Tout afficher'}).click();
 await expect(page.locator('.project-card:visible')).toHaveCount(7);
 await page.locator('[data-project="crm"]').click();
 await expect(page.locator('dialog')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();
 await page.evaluate(()=>document.activeElement.blur());
 await page.screenshot({path:'.playwright/gallery-v2.png',fullPage:true});
 await page.goto(base+'index.html');await page.screenshot({path:'.playwright/home-v2.png',fullPage:true});
 await page.screenshot({path:'.playwright/hero-v2.png'});
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Menu'}).click();await expect(page.locator('#navigation')).toBeVisible();
 await page.locator('#navigation').getByRole('link',{name:'Jeux & autres',exact:true}).click();
 await expect(page.locator('.project-card')).toHaveCount(10);
 await page.screenshot({path:'.playwright/games-mobile-v2.png',fullPage:true});
 await page.goto(base);await page.screenshot({path:'.playwright/home-mobile-v2.png',fullPage:true});
 await page.setViewportSize({width:1280,height:900});
 for(const project of projects.filter(item=>item.url?.startsWith('projets/'))){
  await page.goto(base+project.url,{waitUntil:'networkidle'});
  await expect(page.getByRole('link',{name:'Retour aux jeux & autres'})).toBeVisible();
  console.log(`Démo chargée: ${project.title}`);
 }
 await page.goto(base+'projets/Tic-Tac-Toe/index.html');
 await page.locator('[data-icon="x"]').click();
 await page.locator('[data-vs="player"]').click();
 await expect(page.locator('.btn--tile')).toHaveCount(9);
 await page.locator('.btn--tile').first().click();
 assert.equal(await page.locator('.btn--tile').first().getAttribute('data-filled'),'true');
 await page.goto(base+'projets/QCM/index.html');
 for(const [name,value] of [['question1','Napoleon BONAPARTE'],['question2','4 juillet 1776'],['question3','395 après J.C.'],['question4','Ljubljana'],['question5','4,9 millions']])await page.locator(`input[name="${name}"][value="${value}"]`).check();
 await page.getByRole('button',{name:'Valide ton choix !'}).click();
 await expect(page.locator('#result')).toContainText('5 bonnes réponses');
 await page.goto(base+'projets/Password-Generator/index.html');
 await page.getByRole('button',{name:'Générer',exact:true}).click();
 assert.ok((await page.locator('.password-display').innerText()).length>0);
 await page.goto(base+'projets/faq-accordion/index.html');
 const faq=page.locator('.accordeon__panel button').first();const before=await faq.getAttribute('aria-expanded');await faq.click();assert.notEqual(await faq.getAttribute('aria-expanded'),before);
 await page.goto(base+'projets/interactive-rating/index.html');
 await page.locator('label[for="rating__4"]').click();await page.getByRole('button',{name:'Envoyer',exact:true}).click();await expect(page.locator('#rating__score')).toHaveText('4');

 await page.goto(base+'pages/formations.html');
 await expect(page.locator('.timeline article')).toHaveCount(4);
 await expect(page.locator('main')).toContainText('sept'.toUpperCase());
 await page.goto(base+'pages/experiences.html');
 await expect(page.locator('.timeline article')).toHaveCount(6);
 await expect(page.locator('main')).toContainText('NexSecure');
 assert.equal((await page.request.get(base+'pages/bts-sio.html')).status(),404);
 await page.goto(base+'pages/veille.html');
 await expect(page.locator('.news-card')).toHaveCount(24);
 await page.getByRole('button',{name:'Cloud & sécurité',exact:true}).click();
 await expect(page.locator('.news-card:visible')).toHaveCount(8);
 await page.getByRole('button',{name:'Tout le journal'}).click();
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'.playwright/veille-v3.png',fullPage:true});
 await page.goto(base);
 const theme=await page.locator('html').getAttribute('data-theme');
 await page.locator('.theme-toggle').click();
 const next=await page.locator('html').getAttribute('data-theme');assert.notEqual(theme,next);
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme',next);
 for(const mode of ['light','dark']){
  if(await page.locator('html').getAttribute('data-theme')!==mode)await page.locator('.theme-toggle').click();
  await page.screenshot({path:`.playwright/hero-${mode}-v3.png`});
  for(const path of paths){await page.goto(base+path);await expect(page.locator('html')).toHaveAttribute('data-theme',mode);for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),{message:`Overflow: ${path}/${mode}/${width}`}).toBe(true);}}
  await page.setViewportSize({width:1440,height:1000});await page.goto(base);
 }
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.playwright/home-mobile-v3.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('OK : 8 pages, 7 réalisations, 10 expériences interactives, 10 démos, 4 formations, 6 expériences/engagements, 24 articles, thèmes clair/sombre persistants, documents, filtres/recherche, navigation, modale, 4 tailles d’écran, interactions morpion/QCM/générateur/FAQ/notation.');
}finally{await browser.close();server?.kill();}
