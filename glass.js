(() => {
const siteHeader=document.querySelector('body>header');
if(siteHeader){
  const measureHeader=()=>document.documentElement.style.setProperty('--site-header-height',Math.ceil(siteHeader.getBoundingClientRect().height)+'px');
  measureHeader();
  if('ResizeObserver' in window)new ResizeObserver(measureHeader).observe(siteHeader);
  else window.addEventListener('resize',measureHeader);
}

const axisSections=[...document.querySelectorAll('.axis-section')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{axisSections.forEach(section=>section.hidden=button.dataset.filter!=='All'&&section.dataset.axis!==button.dataset.filter)}));
const mapText=document.querySelector('.map-insight');
document.querySelectorAll('[data-axis-link]').forEach(link=>{const show=()=>{mapText.textContent=link.dataset.insight};link.addEventListener('pointerenter',show);link.addEventListener('focus',show);link.addEventListener('click',()=>{document.querySelector('[data-filter="All"]')?.click()})});
document.querySelectorAll('[data-step]').forEach(button=>{button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')button.click()});button.addEventListener('focus',()=>button.click())});
const tooltip=document.createElement('div');tooltip.className='insight-tooltip';tooltip.id='visual-tooltip';tooltip.role='tooltip';tooltip.hidden=true;document.body.append(tooltip);
let active=null;
function show(el,event){active=el;tooltip.textContent=el.dataset.insight;tooltip.hidden=false;const rect=el.getBoundingClientRect();const x=event?.clientX??rect.left+rect.width/2,y=event?.clientY??rect.bottom;tooltip.style.left=Math.max(8,Math.min(x+12,window.innerWidth-tooltip.offsetWidth-12))+'px';tooltip.style.top=Math.max(8,Math.min(y+16,window.innerHeight-tooltip.offsetHeight-12))+'px';const readout=el.closest('.chart-card')?.querySelector('.hover-readout');if(readout)readout.textContent=el.dataset.insight;}
function hide(){tooltip.hidden=true;active=null;}
document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});window.addEventListener('scroll',hide,{passive:true});
function hot(el,text){if(el.dataset.insightBound)return;el.dataset.insightBound='true';el.dataset.insight=text;el.classList.add('data-hotspot');el.setAttribute('tabindex','0');el.setAttribute('aria-label',text);el.setAttribute('aria-describedby','visual-tooltip');el.addEventListener('pointerenter',e=>show(el,e));el.addEventListener('pointermove',e=>{if(active===el)show(el,e)});el.addEventListener('pointerleave',hide);el.addEventListener('focus',()=>show(el));el.addEventListener('blur',hide);el.addEventListener('click',e=>show(el,e));}
document.querySelectorAll('.chart-card').forEach(card=>{const readout=document.createElement('p');readout.className='hover-readout';readout.setAttribute('aria-live','polite');readout.textContent='مرّر الماوس أو المس عناصر الرسم، أو استخدم Tab، لاستكشاف البيانات.';card.append(readout)});
function wireCharts(){document.querySelectorAll('.chart-card svg').forEach(svg=>{svg.removeAttribute('role');svg.setAttribute('role','group');svg.querySelectorAll('circle').forEach((circle,i)=>{let text=circle.querySelector('title')?.textContent;if(!text){const values=[12,11,13,12,8,7,6,5];text=`الأسبوع ${i+1}: ${values[i]} وحدة معيبة لكل 100 وحدة — بيانات افتراضية`;}else{text=text.replace('Sample','العينة').replace('minutes','دقائق')+' — بيانات افتراضية';}hot(circle,text)})});}
wireCharts();const control=document.querySelector('#control-chart');if(control)new MutationObserver(wireCharts).observe(control,{childList:true});
document.querySelector('#cost-chart')?.setAttribute('role','group');
document.querySelectorAll('.bar-row').forEach((row,i)=>row.querySelectorAll('.purchase,.hidden-cost').forEach(el=>hot(el,`المورد ${i?'B':'A'} · ${el.classList.contains('purchase')?'سعر الشراء':'العيوب والتأخير'}: ${el.textContent.trim()} وحدة تكلفة افتراضية`)));
const costLabels=['الوقاية','التقييم والفحص','الفشل الداخلي','الفشل الخارجي'];document.querySelectorAll('.mix-track').forEach((row,i)=>row.querySelectorAll('span').forEach((el,j)=>hot(el,`${i?'سيناريو الوقاية':'سيناريو الفحص'} · ${costLabels[j]}: ${el.textContent} وحدة تكلفة افتراضية`)));
document.querySelectorAll('.pillars article').forEach(el=>hot(el,el.querySelector('h4').textContent+' — '+el.querySelector('p').textContent));
const flowNotes=['ابدأ بتصميم أفضل وتدريب ووقاية من الأخطاء.','تقليل العيوب قد يقلل الهدر ووقت إعادة العمل.','الوقت المحرر يمكن توجيهه إلى تقديم قيمة أكبر.','الجودة والاتساق يدعمان الثقة؛ الأثر ليس مضموناً.'];document.querySelectorAll('.quality-flow li').forEach((el,i)=>hot(el,flowNotes[i]));
document.querySelectorAll('.timeline article').forEach(el=>hot(el,el.innerText.replace(/\s+/g,' ').trim()));
const sections=[...document.querySelectorAll('.axis-section,main>.section,.hero,.principles-hero')];const tints=['#f5f4ee','#eeece7','#f0f2e9','#f2eee9','#eef0ea'];let scheduled=false;
function tint(){scheduled=false;const candidates=sections.filter(el=>!el.hidden&&el.getClientRects().length);const target=candidates.find(el=>{const r=el.getBoundingClientRect();return r.top<window.innerHeight*.48&&r.bottom>window.innerHeight*.48});if(target)document.body.style.setProperty('--section-tint',tints[sections.indexOf(target)%tints.length]);}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(tint)}},{passive:true});window.addEventListener('resize',tint);tint();
})();
