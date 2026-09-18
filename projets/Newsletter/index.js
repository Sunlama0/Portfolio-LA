const form=document.querySelector('#form');
const email=document.querySelector('#email');
const error=document.querySelector('#error');
const container=document.querySelector('.main-container');
const original=[...container.children];
form.noValidate=true;
form.addEventListener('submit',event=>{
 event.preventDefault();
 if(!email.value.trim()||!email.validity.valid){error.textContent='Saisissez une adresse e-mail valide.';email.setAttribute('aria-invalid','true');email.focus();return;}
 error.textContent='';email.removeAttribute('aria-invalid');
 const panel=document.createElement('section');panel.className='newsletter-success';
 const title=document.createElement('h1');title.textContent='Démo réussie !';title.tabIndex=-1;
 const text=document.createElement('p');text.textContent=`L’adresse ${email.value.trim()} a été validée. Il s’agit d’une démonstration : aucun e-mail n’est envoyé et aucune inscription n’est enregistrée.`;
 const back=document.createElement('button');back.type='button';back.textContent='Essayer à nouveau';back.addEventListener('click',()=>{container.replaceChildren(...original);container.classList.remove('is-success');form.reset();email.focus();});
 panel.append(title,text,back);container.replaceChildren(panel);container.classList.add('is-success');title.focus();
});
