(() => {
 const system=matchMedia('(prefers-color-scheme: dark)');
 let saved;try{saved=localStorage.getItem('portfolio-theme');}catch{}
 const apply=theme=>{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#0b1220':'#f7f8fc');};
 apply(saved==='light'||saved==='dark'?saved:(system.matches?'dark':'light'));
 const updateButton=()=>{const button=document.querySelector('.theme-toggle');if(!button)return;const dark=document.documentElement.dataset.theme==='dark';button.setAttribute('aria-label',dark?'Activer le mode clair':'Activer le mode sombre');button.title=button.getAttribute('aria-label');button.querySelector('.theme-icon').textContent=dark?'☀':'☾';button.querySelector('.theme-label').textContent=dark?'Clair':'Sombre';};
 document.addEventListener('DOMContentLoaded',()=>{updateButton();document.querySelector('.theme-toggle')?.addEventListener('click',()=>{saved=document.documentElement.dataset.theme==='dark'?'light':'dark';apply(saved);try{localStorage.setItem('portfolio-theme',saved);}catch{}updateButton();});});
 system.addEventListener('change',()=>{if(saved!=='light'&&saved!=='dark'){apply(system.matches?'dark':'light');updateButton();}});
})();
