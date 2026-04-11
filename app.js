
const STORAGE_PREFIX = "monikitaFitnessApp:";
const ASSIGNMENTS_KEY = STORAGE_PREFIX + "assignments";

const DAY_TITLES = {
  "monday": "Monday — Lower Body A + Sprint",
  "tuesday": "Tuesday — Upper Push + Pull‑Up Work",
  "wednesday": "Wednesday — Recovery & Mobility",
  "thursday": "Thursday — Lower Body B + Sprint",
  "friday": "Friday — Upper Pull + Shoulders & Triceps",
  "saturday": "Saturday — Sprints & Core",
  "sunday": "Sunday — Rest Day",
  "shoulders-triceps": "Shoulders & Triceps"
};

function loadAssignments() {
  try {
    return JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function saveAssignments(assignments) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

function saveInputValue(input) {
  const key = input.dataset.key;
  if (!key) return;
  const value = input.type === "checkbox" ? input.checked : input.value;
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

function loadInputValue(input) {
  const key = input.dataset.key;
  if (!key) return;
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  if (raw === null) return;
  try {
    const value = JSON.parse(raw);
    if (input.type === "checkbox") input.checked = Boolean(value);
    else input.value = value;
  } catch (e) {}
}

function updateSummary() {
  const summaryEl = document.getElementById("daily-summary");
  if (!summaryEl) return;

  const checkboxInputs = document.querySelectorAll('input[type="checkbox"][data-key]');
  let completed = 0;
  checkboxInputs.forEach(cb => { if (cb.checked) completed++; });

  let energySum = 0, energyCount = 0, effortSum = 0, effortCount = 0;
  document.querySelectorAll('input[data-type="energy"]').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) { energySum += val; energyCount++; }
  });
  document.querySelectorAll('input[data-type="effort"]').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) { effortSum += val; effortCount++; }
  });

  const energyAvg = energyCount ? (energySum / energyCount).toFixed(1) : "—";
  const effortAvg = effortCount ? (effortSum / effortCount).toFixed(1) : "—";
  summaryEl.innerHTML = `
    <div><strong>Completed exercises:</strong> <span>${completed}</span></div>
    <div><strong>Average energy:</strong> <span>${energyAvg}</span></div>
    <div><strong>Average effort:</strong> <span>${effortAvg}</span></div>
  `;
}

function getPageFile() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function getDaySlot() {
  return document.body.dataset.daySlot || "";
}

function getCurrentSelection() {
  const select = document.querySelector(".swap-select");
  if (!select || !select.value) return null;
  const opt = select.options[select.selectedIndex];
  return {
    page: opt.value,
    label: opt.dataset.label || opt.textContent.trim()
  };
}

function getBaseTitle() {
  const titleEl = document.querySelector("[data-page-title]");
  if (!titleEl) return "";
  return titleEl.dataset.pageTitle || titleEl.textContent.trim();
}

function applySavedSelectionToSelect() {
  const slot = getDaySlot();
  const select = document.querySelector(".swap-select");
  if (!slot || !select) return;
  const assignments = loadAssignments();
  const saved = assignments[slot];
  if (saved && saved.page) {
    select.value = saved.page;
  }
}

function refreshAssignedUI() {
  const slot = getDaySlot();
  if (!slot) return;

  const assignments = loadAssignments();
  const saved = assignments[slot];
  const pageFile = getPageFile();
  const status = document.querySelector(".swap-status");
  const titleEl = document.querySelector("[data-page-title]");
  const baseTitle = getBaseTitle();
  const original = document.querySelectorAll(".original-workout");

  if (!status) return;

  if (saved && saved.page && saved.page !== pageFile) {
    status.innerHTML = `
      <div class="swap-banner">
        <div class="swap-banner-kicker">Saved assignment</div>
        <h3>${saved.label}</h3>
        <p>This day is currently assigned to <strong>${saved.label}</strong>. The original workout is hidden so the screen matches what you saved.</p>
        <div class="swap-actions">
          <a class="action-primary" href="${saved.page}">Open ${saved.label}</a>
          <button type="button" class="action-secondary" onclick="clearSavedAssignment()">Clear saved swap</button>
        </div>
      </div>
    `;
    original.forEach(el => el.style.display = "none");
    if (titleEl) titleEl.textContent = `${baseTitle} → ${saved.label}`;
  } else {
    if (saved && saved.page === pageFile) {
      status.innerHTML = `<div class="swap-note">Saved choice: <strong>${saved.label}</strong></div>`;
      if (titleEl) titleEl.textContent = saved.label;
    } else {
      status.innerHTML = `<div class="swap-note">No saved swap for this day yet.</div>`;
      if (titleEl) titleEl.textContent = baseTitle;
    }
    original.forEach(el => el.style.display = "");
  }

  updateHomeCards();
}

function saveCurrentAssignment() {
  const slot = getDaySlot();
  if (!slot) return;
  const selection = getCurrentSelection();
  const assignments = loadAssignments();
  if (selection) {
    assignments[slot] = selection;
  } else {
    delete assignments[slot];
  }
  saveAssignments(assignments);
  refreshAssignedUI();
}

function clearSavedAssignment() {
  const slot = getDaySlot();
  if (!slot) return;
  const assignments = loadAssignments();
  delete assignments[slot];
  saveAssignments(assignments);
  const select = document.querySelector(".swap-select");
  if (select) select.value = "";
  refreshAssignedUI();
}

function openSelection() {
  const selection = getCurrentSelection();
  if (selection && selection.page) {
    window.location.href = selection.page;
  }
}

function updateHomeCards() {
  const cards = document.querySelectorAll("[data-slot-card]");
  if (!cards.length) return;
  const assignments = loadAssignments();

  cards.forEach(card => {
    const slot = card.dataset.slotCard;
    const saved = assignments[slot];
    const titleEl = card.querySelector("[data-slot-label]");
    const noteEl = card.querySelector("[data-slot-note]");
    const linkEl = card.querySelector("[data-slot-open]");
    if (!titleEl || !noteEl || !linkEl) return;

    const defaultTitle = titleEl.dataset.defaultLabel;
    const defaultNote = noteEl.dataset.defaultNote;
    const defaultHref = linkEl.dataset.defaultHref;

    if (saved && saved.page) {
      titleEl.textContent = `${slot.charAt(0).toUpperCase() + slot.slice(1).replace("-", " ")}: ${saved.label}`;
      noteEl.textContent = "Saved swap active";
      linkEl.href = saved.page;
      card.classList.add("card-swapped");
    } else {
      titleEl.textContent = defaultTitle;
      noteEl.textContent = defaultNote;
      linkEl.href = defaultHref;
      card.classList.remove("card-swapped");
    }
  });
}

function moveWorkout(selectEl) {
  if (selectEl && selectEl.value) {
    window.location.href = selectEl.value;
  }
}

function recommendWorkout() {
  const resultContainer = document.getElementById('advisor-result');
  if (!resultContainer) return;
  const last = document.getElementById('advisor-last').value;
  const energy = parseInt(document.getElementById('advisor-energy').value, 10);
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
    note = 'You recently hit lower body, so upper body makes more sense today.';
  } else if (last.includes('Upper') || last.includes('Shoulder')) {
    recommendation = fresh === 'lower' ? 'Lower Body A (Glutes / Hamstrings)' : 'Lower Body B (Quads / Glutes)';
    page = fresh === 'lower' ? 'monday.html' : 'thursday.html';
    note = 'Your upper body worked recently, so lower body is the better fit.';
  } else {
    recommendation = 'Featured Workout';
    page = 'featured.html';
    note = 'A featured workout is a good plug-in when the week gets messy.';
  }

  resultContainer.innerHTML = `<p><strong>Recommended workout:</strong> ${recommendation}</p><p>${note}</p><p><a href="${page}">Open workout</a></p>`;
  resultContainer.style.display = 'block';
}

function initialiseStorage() {
  document.querySelectorAll('[data-key]').forEach(input => {
    loadInputValue(input);
    input.addEventListener('change', () => {
      saveInputValue(input);
      updateSummary();
    });
  });

  applySavedSelectionToSelect();
  refreshAssignedUI();
  updateHomeCards();
  updateSummary();

  const saveBtn = document.querySelector(".swap-save-btn");
  const openBtn = document.querySelector(".swap-open-btn");
  const clearBtn = document.querySelector(".swap-clear-btn");
  if (saveBtn) saveBtn.addEventListener("click", saveCurrentAssignment);
  if (openBtn) openBtn.addEventListener("click", openSelection);
  if (clearBtn) clearBtn.addEventListener("click", clearSavedAssignment);
}

document.addEventListener('DOMContentLoaded', initialiseStorage);
