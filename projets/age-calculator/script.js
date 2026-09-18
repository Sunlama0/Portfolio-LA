const day=document.querySelector('#day'),month=document.querySelector('#month'),year=document.querySelector('#year');
const inputs=[day,month,year];
inputs.forEach(input=>{input.inputMode='numeric';input.setAttribute('aria-describedby',`${input.id}-error`);document.querySelector(`.${input.id}-error`).id=`${input.id}-error`;});
document.querySelector('.result').setAttribute('aria-live','polite');
document.querySelector('.btn').addEventListener('click',()=>{
 inputs.forEach(input=>{document.querySelector(`.${input.id}-error`).textContent='';input.removeAttribute('aria-invalid');});
 const values=inputs.map(input=>Number(input.value));
 const [d,m,y]=values;const birth=new Date(y,m-1,d);birth.setFullYear(y);
 const today=new Date();today.setHours(0,0,0,0);
 let invalid=inputs.find(input=>!/^\d+$/.test(input.value.trim()));
 if(!invalid&&(y<1||m<1||m>12||d<1||birth.getFullYear()!==y||birth.getMonth()!==m-1||birth.getDate()!==d))invalid=day;
 if(!invalid&&birth>today)invalid=year;
 if(invalid){document.querySelector(`.${invalid.id}-error`).textContent='Saisissez une date passée valide.';invalid.setAttribute('aria-invalid','true');invalid.focus();return;}
 let years=today.getFullYear()-y;
 const anniversary=n=>new Date(y+n,m-1,Math.min(d,new Date(y+n,m,0).getDate()));
 if(anniversary(years)>today)years--;
 const anchor=anniversary(years);
 const addMonths=n=>{const first=new Date(anchor.getFullYear(),anchor.getMonth()+n,1);return new Date(first.getFullYear(),first.getMonth(),Math.min(anchor.getDate(),new Date(first.getFullYear(),first.getMonth()+1,0).getDate()));};
 let months=0;while(months<11&&addMonths(months+1)<=today)months++;
 const base=addMonths(months);
 const days=Math.round((Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())-Date.UTC(base.getFullYear(),base.getMonth(),base.getDate()))/86400000);
 document.querySelector('.year-result').textContent=years;document.querySelector('.month-result').textContent=months;document.querySelector('.day-result').textContent=days;
});
