
const STORAGE_KEY = "monikita-fitness-app-v3";
function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");}catch(e){return {};}}
function saveState(state){localStorage.setItem(STORAGE_KEY, JSON.stringify(state));}
function ensureState(){const s=loadState(); s.exerciseChecks=s.exerciseChecks||{}; s.exerciseLogs=s.exerciseLogs||{}; s.advisorHistory=s.advisorHistory||[]; s.daySwapHistory=s.daySwapHistory||{}; return s;}
function exKey(el){return (el.dataset.day||"unknown")+"|"+(el.dataset.exercise||"unknown");}
function applyExerciseState(){
  const s=ensureState();
  document.querySelectorAll(".exercise-checkbox").forEach(cb=>{const k=exKey(cb); if(s.exerciseChecks[k]===true) cb.checked=true;});
  document.querySelectorAll(".log-input").forEach(inp=>{const k=exKey(inp), f=inp.dataset.field; if(s.exerciseLogs[k]&&s.exerciseLogs[k][f]!==undefined) inp.value=s.exerciseLogs[k][f];});
  const swapSelect=document.getElementById("swapSelect"), swapSaved=document.getElementById("swapSaved");
  if(swapSelect){
    const dayKey=swapSelect.dataset.daykey;
    if(s.daySwapHistory[dayKey]) swapSelect.value=s.daySwapHistory[dayKey];
    if(s.daySwapHistory[dayKey] && swapSaved) swapSaved.textContent="Saved swap choice: "+swapSelect.options[swapSelect.selectedIndex].text;
  }
  updatePageSummary();
}
function updatePageSummary(){
  const checks=[...document.querySelectorAll(".exercise-checkbox")];
  const done=checks.filter(x=>x.checked).length, total=checks.length;
  const c=document.getElementById("completedCount"); if(c) c.textContent=done+" / "+total;
  const efforts=[...document.querySelectorAll('.log-input[data-field="effort"]')].map(x=>parseFloat(x.value)).filter(x=>!isNaN(x));
  const energy=[...document.querySelectorAll('.log-input[data-field="energy"]')].map(x=>parseFloat(x.value)).filter(x=>!isNaN(x));
  const ae=document.getElementById("avgEffort"); if(ae) ae.textContent=efforts.length?(efforts.reduce((a,b)=>a+b,0)/efforts.length).toFixed(1):"—";
  const ag=document.getElementById("avgEnergy"); if(ag) ag.textContent=energy.length?(energy.reduce((a,b)=>a+b,0)/energy.length).toFixed(1):"—";
}
function resetDay(){
  if(!confirm("Reset this day's tracking?")) return;
  const s=ensureState();
  document.querySelectorAll(".exercise-checkbox,.log-input").forEach(el=>{const k=exKey(el); delete s.exerciseChecks[k]; delete s.exerciseLogs[k]; if(el.type==="checkbox") el.checked=false; else el.value="";});
  saveState(s); updatePageSummary();
}
function recommendationLink(dayName){
  const m={"Monday":"monday.html","Tuesday":"tuesday.html","Wednesday":"wednesday.html","Thursday":"thursday.html","Friday":"friday.html","Saturday":"saturday.html","Sunday":"sunday.html","Upper Push":"tuesday.html","Upper Pull":"friday.html","Lower Body A":"monday.html","Lower Body B":"thursday.html","Sprint + Core":"saturday.html","Recovery":"wednesday.html","Rest":"sunday.html","Shoulders + Triceps":"shoulders-triceps.html"};
  return m[dayName]||"index.html";
}
function buildRecommendation(data){
  const energy=Number(data.energy||0), soreness=data.soreness||"none", sick=data.sick, last=data.lastWorkout||"", fresh=data.upperLowerFresh||"", time=Number(data.timeAvailable||0);
  let title="", reason="", day="", intensity="Normal", modifications=[];
  if(sick==="yes"||energy<=3){day="Recovery"; title="Recovery day is the smart move"; reason="You either still feel sick or your energy is too low for quality training. Forcing a hard workout here usually backfires."; intensity="Low"; modifications=["20–30 minute walk","Mobility only","Dead hang optional if it feels good","Skip hard intervals"];}
  else if(last.includes("Lower")||last.includes("Glute")||fresh==="upper"){day="Upper Pull"; title="Do an upper-body day today"; reason="You recently hit lower body, so the best practice is to avoid stacking leg fatigue and use your fresher upper body instead."; if(time>0&&time<40){day="Shoulders + Triceps"; reason+=" Since time is tight, shoulders + triceps is an easier focused session to complete well.";} if(soreness==="high"){intensity="Moderate"; modifications.push("Keep 1–2 reps in reserve on compounds");}}
  else if(last.includes("Upper")||fresh==="lower"){day="Lower Body B"; title="Lower body is the best fit today"; reason="Your upper body was hit more recently, so a lower day balances the week better."; if(soreness==="high"){day="Recovery"; title="Recovery beats forced lower body today"; reason="High soreness plus recent training is a bad combo. Recover now so your next lower session is actually productive."; intensity="Low"; modifications=["Walk","Mobility","Glute activation only if it feels easy"];}}
  else if(energy>=8&&soreness==="low"&&time>=30){day="Sprint + Core"; title="Good day for conditioning and core"; reason="Energy is solid and soreness is low, so a sprint/core day can fit well without derailing the week.";}
  else {day="Shoulders + Triceps"; title="Shoulders + triceps is the safe default"; reason="When the picture is mixed, shoulders + triceps gives you a productive upper session without overloading sore legs.";}
  if(time>0&&time<25&&day!=="Recovery"&&day!=="Rest"){modifications.push("Trim to the first 3–4 exercises only"); modifications.push("Skip optional finisher"); intensity=intensity==="Low"?"Low":"Efficient";}
  if(data.missedWorkouts&&data.missedWorkouts.trim()) modifications.push("Do not try to cram every missed workout into one day");
  return {title,reason,day,intensity,modifications};
}
function saveAdvisorResult(entry){const s=ensureState(); s.advisorHistory.unshift(entry); s.advisorHistory=s.advisorHistory.slice(0,10); saveState(s);}
function renderAdvisorHistory(){
  const box=document.getElementById("advisorHistory"); if(!box) return;
  const s=ensureState();
  if(!s.advisorHistory.length){box.innerHTML='<div class="note">No saved recommendations yet.</div>'; return;}
  box.innerHTML=s.advisorHistory.map(item=>'<div class="note" style="margin-top:10px;"><strong>'+item.date+'</strong><br>Recommended: '+item.day+'<br>Why: '+item.title+'</div>').join("");
}
function runAdvisor(){
  const form=document.getElementById("advisorForm"); if(!form) return;
  const data=Object.fromEntries(new FormData(form).entries()); const rec=buildRecommendation(data); const result=document.getElementById("advisorResult"); const href=recommendationLink(rec.day);
  result.innerHTML='<div class="note ok" style="margin-top:16px;"><div class="result-title">'+rec.title+'</div><p><strong>Recommended workout:</strong> '+rec.day+'</p><p><strong>Suggested intensity:</strong> '+rec.intensity+'</p><p>'+rec.reason+'</p>'+(rec.modifications.length?'<ul class="checklist">'+rec.modifications.map(x=>'<li>'+x+'</li>').join("")+'</ul>':'')+'<div class="links"><a href="'+href+'">Open recommended workout</a></div></div>';
  saveAdvisorResult({date:new Date().toLocaleString(),day:rec.day,title:rec.title}); renderAdvisorHistory();
}
function openSwapTarget(){const select=document.getElementById("swapSelect"); if(!select||!select.value) return; window.location.href=select.value;}
function saveSwapChoice(){const select=document.getElementById("swapSelect"), saved=document.getElementById("swapSaved"); if(!select) return; const s=ensureState(); const dayKey=select.dataset.daykey; s.daySwapHistory[dayKey]=select.value; saveState(s); if(saved) saved.textContent="Saved swap choice: "+select.options[select.selectedIndex].text;}
document.addEventListener("change", function(e){
  const t=e.target, s=ensureState();
  if(t.matches(".exercise-checkbox")){s.exerciseChecks[exKey(t)]=t.checked; saveState(s); updatePageSummary();}
  if(t.matches(".log-input")){const k=exKey(t), f=t.dataset.field; s.exerciseLogs[k]=s.exerciseLogs[k]||{}; s.exerciseLogs[k][f]=t.value; saveState(s); updatePageSummary();}
});
document.addEventListener("input", function(e){
  const t=e.target; if(!t.matches(".log-input")) return;
  const s=ensureState(), k=exKey(t), f=t.dataset.field; s.exerciseLogs[k]=s.exerciseLogs[k]||{}; s.exerciseLogs[k][f]=t.value; saveState(s); updatePageSummary();
});
document.addEventListener("DOMContentLoaded", function(){
  applyExerciseState(); renderAdvisorHistory();
  const btn=document.getElementById("advisorRun"); if(btn) btn.addEventListener("click", runAdvisor);
  const swapGo=document.getElementById("swapGo"); if(swapGo) swapGo.addEventListener("click", openSwapTarget);
  const swapSave=document.getElementById("swapSave"); if(swapSave) swapSave.addEventListener("click", saveSwapChoice);
});
