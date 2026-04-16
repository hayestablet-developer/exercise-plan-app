
// JavaScript to handle local storage, summary calculation, extra set toggles, and workout swapping

function toggleOptionalSet(groupKey, forceShow) {
  const optionalFields = document.querySelectorAll(`[data-optional-group="${groupKey}"]`);
  if (!optionalFields.length) return;
  const storageKey = `${groupKey}__show4`;
  const shouldShow = typeof forceShow === 'boolean'
    ? forceShow
    : localStorage.getItem(storageKey) === 'true';

  optionalFields.forEach(field => {
    field.style.display = shouldShow ? 'flex' : 'none';
  });

  const btn = document.querySelector(`.add-set-btn[data-target="${groupKey}"]`);
  if (btn) {
    btn.textContent = shouldShow ? 'Hide set 4' : '+ Add set 4';
  }
}

function initialiseStorage() {
  const inputs = document.querySelectorAll('[data-key]');
  inputs.forEach(input => {
    const key = input.dataset.key;
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      if (input.type === 'checkbox') {
        input.checked = storedValue === 'true';
      } else {
        input.value = storedValue;
      }
    }
    input.addEventListener('change', () => {
      if (input.type === 'checkbox') {
        localStorage.setItem(key, String(input.checked));
      } else {
        localStorage.setItem(key, input.value);
      }
      updateSummary();
    });
  });

  const addSetButtons = document.querySelectorAll('.add-set-btn');
  addSetButtons.forEach(btn => {
    const groupKey = btn.dataset.target;
    toggleOptionalSet(groupKey, localStorage.getItem(`${groupKey}__show4`) === 'true');
    btn.addEventListener('click', () => {
      const isShowing = localStorage.getItem(`${groupKey}__show4`) === 'true';
      localStorage.setItem(`${groupKey}__show4`, String(!isShowing));
      toggleOptionalSet(groupKey, !isShowing);
    });
  });

  updateSummary();
}

document.addEventListener('DOMContentLoaded', initialiseStorage);

// Calculate summary: count completed exercises and averages
function updateSummary() {
  const summaryEl = document.getElementById('daily-summary');
  if (!summaryEl) return;
  const checkboxInputs = document.querySelectorAll('input[type="checkbox"][data-key]');
  let completed = 0;
  checkboxInputs.forEach(cb => { if (cb.checked) completed++; });

  let energySum = 0, energyCount = 0;
  let effortSum = 0, effortCount = 0;

  const energyInputs = document.querySelectorAll('input[data-type="energy"]');
  energyInputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) {
      energySum += val;
      energyCount++;
    }
  });

  const effortInputs = document.querySelectorAll('input[data-type="effort"]');
  effortInputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) {
      effortSum += val;
      effortCount++;
    }
  });

  const energyAvg = energyCount > 0 ? (energySum / energyCount).toFixed(1) : 'N/A';
  const effortAvg = effortCount > 0 ? (effortSum / effortCount).toFixed(1) : 'N/A';

  summaryEl.innerHTML = `
    <strong>Completed exercises:</strong> ${completed} |
    <strong>Average energy:</strong> ${energyAvg} |
    <strong>Average effort:</strong> ${effortAvg}
  `;
}

// Redirect to selected workout page when changing selection
function moveWorkout(selectElement) {
  const url = selectElement.value;
  if (url) {
    window.location.href = url;
  }
}

// Advisor recommendation logic
function recommendWorkout() {
  const resultContainer = document.getElementById('advisor-result');
  if (!resultContainer) return;
  const today = document.getElementById('advisor-today').value;
  const last = document.getElementById('advisor-last').value;
  const missed = document.getElementById('advisor-missed').value;
  const time = document.getElementById('advisor-time').value;
  const energy = parseInt(document.getElementById('advisor-energy').value, 10);
  const effort = parseInt(document.getElementById('advisor-effort').value, 10);
  const sick = document.getElementById('advisor-sick').value;
  const fresh = document.getElementById('advisor-fresh').value;

  let recommendation = '';
  let page = '';
  let note = '';

  if (sick === 'yes' || energy <= 4) {
    recommendation = 'Recovery and Mobility';
    page = 'wednesday.html';
    note = 'Because you are sick or low energy, the best move is recovery, mobility, and a light walk.';
  } else if (last.includes('Lower') || last.includes('Glute')) {
    recommendation = fresh === 'upper' ? 'Upper Push (Chest / Shoulders / Triceps)' : 'Upper Pull (Back / Biceps / Shoulders)';
    page = fresh === 'upper' ? 'tuesday.html' : 'friday.html';
    note = 'You recently hit lower body, so give your legs more recovery and train upper body today.';
  } else if (last.includes('Upper') || last.includes('Shoulder')) {
    recommendation = fresh === 'lower' ? 'Lower Body A (Glutes / Hamstrings)' : 'Lower Body B (Quads / Glutes)';
    page = fresh === 'lower' ? 'monday.html' : 'thursday.html';
    note = 'Your upper body worked recently, so shifting to lower body keeps the week balanced.';
  } else {
    recommendation = 'Featured Workout';
    page = 'featured.html';
    note = 'You can plug in one of the featured trend-based workouts this week without replacing your main split.';
  }

  resultContainer.innerHTML = `<p><strong>Recommended workout:</strong> ${recommendation}</p><p>${note}</p><p><a href="${page}">Open workout</a></p>`;
  resultContainer.style.display = 'block';
}
