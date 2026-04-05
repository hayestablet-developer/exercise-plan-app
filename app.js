
const STORAGE_KEY = "monikita-fitness-app-v1";

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch(e){ return {}; }
}
function saveState(state){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function ensureState(){
  const state = loadState();
  state.exerciseChecks = state.exerciseChecks || {};
  state.exerciseLogs = state.exerciseLogs || {};
  return state;
}
function exKey(el){
  const day = el.dataset.day || "unknown";
  const ex = el.dataset.exercise || "unknown";
  return day + "|" + ex;
}
function applyExerciseState(){
  const state = ensureState();

  document.querySelectorAll(".exercise-checkbox").forEach(cb => {
    const key = exKey(cb);
    if (state.exerciseChecks[key] === true) cb.checked = true;
  });

  document.querySelectorAll(".log-input").forEach(input => {
    const key = exKey(input);
    const field = input.dataset.field;
    if (state.exerciseLogs[key] && state.exerciseLogs[key][field] !== undefined) {
      input.value = state.exerciseLogs[key][field];
    }
  });

  updatePageSummary();
}
function updatePageSummary(){
  const checks = Array.from(document.querySelectorAll(".exercise-checkbox"));
  const done = checks.filter(x => x.checked).length;
  const total = checks.length;
  const completedEl = document.getElementById("completedCount");
  if (completedEl) completedEl.textContent = done + " / " + total;

  const effortInputs = Array.from(document.querySelectorAll('.log-input[data-field="effort"]'))
    .map(x => parseFloat(x.value))
    .filter(x => !isNaN(x));
  const energyInputs = Array.from(document.querySelectorAll('.log-input[data-field="energy"]'))
    .map(x => parseFloat(x.value))
    .filter(x => !isNaN(x));

  const avgEffort = effortInputs.length ? (effortInputs.reduce((a,b)=>a+b,0)/effortInputs.length).toFixed(1) : "—";
  const avgEnergy = energyInputs.length ? (energyInputs.reduce((a,b)=>a+b,0)/energyInputs.length).toFixed(1) : "—";

  const effortEl = document.getElementById("avgEffort");
  const energyEl = document.getElementById("avgEnergy");
  if (effortEl) effortEl.textContent = avgEffort;
  if (energyEl) energyEl.textContent = avgEnergy;
}
function resetDay(){
  if (!confirm("Reset this day's tracking?")) return;
  const state = ensureState();
  document.querySelectorAll(".exercise-checkbox,.log-input").forEach(el => {
    const key = exKey(el);
    delete state.exerciseChecks[key];
    delete state.exerciseLogs[key];
    if (el.type === "checkbox") el.checked = false;
    else el.value = "";
  });
  saveState(state);
  updatePageSummary();
}
document.addEventListener("change", function(e){
  const target = e.target;
  const state = ensureState();

  if (target.matches(".exercise-checkbox")){
    state.exerciseChecks[exKey(target)] = target.checked;
    saveState(state);
    updatePageSummary();
  }
  if (target.matches(".log-input")){
    const key = exKey(target);
    const field = target.dataset.field;
    state.exerciseLogs[key] = state.exerciseLogs[key] || {};
    state.exerciseLogs[key][field] = target.value;
    saveState(state);
    updatePageSummary();
  }
});
document.addEventListener("input", function(e){
  const target = e.target;
  if (!target.matches(".log-input")) return;
  const state = ensureState();
  const key = exKey(target);
  const field = target.dataset.field;
  state.exerciseLogs[key] = state.exerciseLogs[key] || {};
  state.exerciseLogs[key][field] = target.value;
  saveState(state);
  updatePageSummary();
});
document.addEventListener("DOMContentLoaded", applyExerciseState);
