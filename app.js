// JavaScript to handle local storage, summary calculation and workout swapping

// Helper function to save and load input values
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
        localStorage.setItem(key, input.checked);
      } else {
        localStorage.setItem(key, input.value);
      }
      // update summary whenever data changes
      updateSummary();
    });
  });
  // initial summary calculation
  updateSummary();
}

// Automatically initialise storage on page load
document.addEventListener('DOMContentLoaded', initialiseStorage);

// Calculate summary: count completed exercises and averages
function updateSummary() {
  const summaryEl = document.getElementById('daily-summary');
  if (!summaryEl) return;
  const checkboxInputs = document.querySelectorAll('input[type="checkbox"][data-key]');
  let completed = 0;
  checkboxInputs.forEach(cb => { if (cb.checked) completed++; });
  // compute averages for effort and energy
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
  summaryEl.innerHTML = `Completed exercises: <span>${completed}</span> | Average energy: <span>${energyAvg}</span> | Average effort: <span>${effortAvg}</span>`;
}

// Function to navigate when moving workout
function moveWorkout(selectEl) {
  const dest = selectEl.value;
  if (dest) {
    window.location.href = dest;
  }
}

// Advisor recommendation logic
function recommendWorkout() {
  const resultContainer = document.getElementById('advisor-result');
  if (!resultContainer) return;
  // gather form values
  const today = document.getElementById('advisor-today').value;
  const last = document.getElementById('advisor-last').value;
  const missed = document.getElementById('advisor-missed').value;
  const time = document.getElementById('advisor-time').value;
  const energy = parseInt(document.getElementById('advisor-energy').value, 10);
  const effort = parseInt(document.getElementById('advisor-effort').value, 10);
  const sick = document.getElementById('advisor-sick').value;
  const fresh = document.getElementById('advisor-fresh').value;
  // Basic recommendation algorithm: choose a workout based on freshness and last workout
  // If still sick or energy low, recommend recovery
  let recommendation = '';
  let page = '';
  let note = '';
  const isSick = sick === 'yes';
  if (isSick || energy <= 4) {
    recommendation = 'Recovery and Mobility';
    page = 'wednesday.html';
    note = 'Since you are sick or your energy is low, focus on gentle mobility work and a light walk.';
  } else {
    // Determine which muscle group to hit
    // Avoid repeating last workout
    if (last.includes('Lower') || last.includes('Glute')) {
      if (fresh === 'upper') {
        recommendation = 'Upper Push (Chest/Shoulders/Triceps)';
        page = 'tuesday.html';
        note = 'Your lower body needs more rest. Hit your upper body today with pressing and shoulder work.';
      } else {
        recommendation = 'Upper Pull (Back/Biceps/Shoulders)';
        page = 'friday.html';
        note = 'Avoid repeating lower body work. Focus on pulls and shoulders instead.';
      }
    } else if (last.includes('Upper') || last.includes('Shoulder')) {
      if (fresh === 'lower') {
        recommendation = 'Lower Body (Glutes/Hamstrings)';
        page = 'monday.html';
        note = 'Give your upper body a break. Train lower body movements with emphasis on glutes.';
      } else {
        recommendation = 'Lower Body (Quads/Glutes)';
        page = 'thursday.html';
        note = 'Switch to lower body training to keep muscle balance.';
      }
    } else {
      // Default: if no last workout or unclear, recommend a featured workout
      recommendation = 'Featured Workout (Zone 2 Cardio or Mobility)';
      page = 'featured-12-3-30.html';
      note = 'Try the 12‑3‑30 incline walk for a cardio boost or explore the other featured workouts.';
    }
  }
  resultContainer.innerHTML = `<p><strong>Recommended workout:</strong> ${recommendation}</p><p>${note}</p><p><a href="${page}">Open workout</a></p>`;
  resultContainer.style.display = 'block';
}