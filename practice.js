const practiced=new Set();
function updatePractice(){document.querySelector('#learning-status').textContent=`جرّبت ${practiced.size} من 14 موقفاً`;document.querySelector('#learning-meter').value=practiced.size;}
document.querySelectorAll('.practice').forEach(panel=>{panel.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
panel.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(b===button));b.classList.toggle('chosen',b===button)});
const correct=button.dataset.choice===panel.dataset.answer,feedback=panel.querySelector('.practice-feedback');
feedback.textContent=(correct?'اختيار مناسب. ':'جرّب الاختيار الآخر. ')+feedback.dataset.explanation;feedback.classList.toggle('correct',correct);practiced.add(panel.dataset.point);updatePractice();
}));});
document.querySelector('#reset-practice').addEventListener('click',()=>{practiced.clear();updatePractice();document.querySelectorAll('.practice').forEach(panel=>{panel.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed','false');b.classList.remove('chosen')});const feedback=panel.querySelector('.practice-feedback');feedback.textContent='اختر إجابة لعرض التفسير.';feedback.classList.remove('correct');});});
