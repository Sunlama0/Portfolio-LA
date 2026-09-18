import { projects } from './projects.mjs';
const root = document.body.dataset.root || '';
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { toggle.setAttribute('aria-expanded','false'); navigation.classList.remove('is-open'); toggle.querySelector('.menu-label').textContent='Menu';toggle.querySelector('.menu-symbol').textContent='☰'; }
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);toggle.querySelector('.menu-label').textContent=open?'Fermer':'Menu';toggle.querySelector('.menu-symbol').textContent=open?'✕':'☰';});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
let activeFilter='all';
const search=document.querySelector('#project-search');
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function filterProjects(){
 const query=normalize(search?.value.trim()||'');let count=0;
 document.querySelectorAll('.project-card').forEach(card=>{card.hidden=!(activeFilter==='all'||card.dataset.category===activeFilter)||!normalize(card.dataset.search).includes(query);if(!card.hidden)count++;});
 document.querySelector('#filter-status').textContent=`${count} réalisation${count===1?'':'s'}`;
 document.querySelector('.empty-state').hidden=count!==0;
 document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===activeFilter)));
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;filterProjects();}));
search?.addEventListener('input',filterProjects);
document.querySelector('#reset-filters')?.addEventListener('click',()=>{activeFilter='all';search.value='';filterProjects();search.focus();});
const dialog=document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const project=projects.find(item=>item.id===button.dataset.project);
 document.querySelector('#dialog-title').textContent=project.title;
 document.querySelector('#dialog-category').textContent=project.label;
 document.querySelector('#dialog-description').textContent=project.description;
 const image=document.querySelector('#dialog-image');image.src=`${root}src/img/${project.image}`;image.alt=`Capture du projet ${project.title}`;
 document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span;}));
 dialog.showModal();document.body.classList.add('dialog-open');
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();});
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));

// The feed is cached locally: no third-party JavaScript or HTML is injected.
const newsGrid=document.querySelector('#news-grid');
if(newsGrid){
 let sourceFilter='all';
 const filterNews=()=>{let count=0;newsGrid.querySelectorAll('.news-card').forEach(card=>{card.hidden=sourceFilter!=='all'&&card.dataset.source!==sourceFilter;if(!card.hidden)count++;});document.querySelector('#news-count').textContent=`${count} publication${count===1?'':'s'}`;document.querySelector('#news-empty').hidden=count>0;document.querySelectorAll('[data-source-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.sourceFilter===sourceFilter)));};
 document.querySelectorAll('[data-source-filter]').forEach(button=>button.addEventListener('click',()=>{sourceFilter=button.dataset.sourceFilter;filterNews();}));
 const element=(tag,className,text)=>{const node=document.createElement(tag);node.className=className;if(text)node.textContent=text;return node;};
 const allowedHosts=new Set(['developer.mozilla.org','github.blog','blog.cloudflare.com']);
 const updateNews=async()=>{
  try{
   const response=await fetch(`${root}src/data/veille.json`,{cache:'no-cache'});if(!response.ok)throw new Error('Feed unavailable');
   const feed=await response.json();if(!Array.isArray(feed.articles)||!Array.isArray(feed.sources))throw new Error('Invalid feed');
   const cards=[];
   for(const item of feed.articles){
    let url;try{url=new URL(item.url);}catch{continue;}
    if(url.protocol!=='https:'||!allowedHosts.has(url.hostname)||url.username||!Number.isFinite(Date.parse(item.publishedAt)))continue;
    const card=element('article','news-card');card.dataset.source=item.sourceId;
    const top=element('div','news-top');const time=element('time','',new Date(item.publishedAt).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}));time.dateTime=item.publishedAt;top.append(element('span','news-category',item.category),time);
    const link=(text)=>{const a=element('a','',text);a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';return a;};
    const heading=element('h2','');heading.append(link(item.title));const bottom=element('div','news-bottom');const read=link('Lire à la source ↗');read.setAttribute('aria-label',`Lire ${item.title}`);bottom.append(element('span','',item.source),read);card.append(top,heading,element('p','',item.context),bottom);cards.push(card);
   }
   if(cards.length){newsGrid.replaceChildren(...cards);filterNews();}
   const checked=new Date(feed.checkedAt);const stale=Date.now()-checked.getTime()>48*60*60*1000;
   document.querySelector('#feed-status').textContent=`Dernière vérification : ${checked.toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short'})}${stale?' · Actualisation en attente':''}`;
   const unavailable=feed.sources.filter(source=>source.status!=='ok');document.querySelector('#feed-health').textContent=unavailable.length?`Dernière collecte : ${unavailable.map(source=>source.name).join(', ')} indisponible(s). Les articles déjà récupérés sont conservés.`:'Les trois sources ont répondu lors de la dernière collecte.';
  }catch{document.querySelector('#feed-health').textContent='Actualisation temporairement indisponible. Les dernières publications enregistrées restent consultables.';}
 };
 updateNews();setInterval(updateNews,5*60*1000);
}
