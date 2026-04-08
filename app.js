
const STORAGE_PREFIX = "monikitaFitnessApp:";
const SWAP_KEY = STORAGE_PREFIX + "dayAssignments";

function safeJsonParse(value, fallback) {
  try { return JSON.parse(value); } catch (e) { return fallback; }
}

function getAssignments() {
  return safeJsonParse(localStorage.getItem(SWAP_KEY), {});
}

function saveAssignments(assignments) {
  localStorage.setItem(SWAP_KEY, JSON.stringify(assignments));
}

function saveFormValue(input) {
  const key = input.dataset.key;
  if (!key) return;
  const value = input.type === "checkbox" ? input.checked : input.value;
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

function loadFormValue(input) {
  const key = input.dataset.key;
  if (!key) return;
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  if (raw === null) return;
  const value = safeJsonParse(raw, null);
  if (value === null) return;
  if (input.type === "checkbox") input.checked = Boolean(value);
  else input.value = value;
}

function updateSummary() {
  const summaryEl = document.getElementById("daily-summary");
  if (!summaryEl) return;
  const checkboxInputs = document.querySelectorAll('input[type="checkbox"][data-key]');
  const total = checkboxInputs.length;
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
    <div><strong>Completed exercises:</strong> <span>${completed}/${total}</span></div>
    <div><strong>Average energy:</strong> <span>${energyAvg}</span></div>
    <div><strong>Average effort:</strong> <span>${effortAvg}</span></div>
  `;
}

function getCurrentFileName() {
  const path = window.location.pathname.split("/").pop();
  return path || "index.html";
}

function slotLabel(slot) {
  const map = {
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday",
    "shoulders-triceps": "Shoulders + Triceps"
  };
  return map[slot] || slot;
}

function currentDaySlot() {
  const bodySlot = document.body.dataset.daySlot;
  if (bodySlot) return bodySlot;
  return null;
}

function currentSelectOption(select) {
  if (!select) return null;
  const opt = select.options[select.selectedIndex];
  if (!opt || !opt.value) return null;
  return {
    page: opt.value,
    label: opt.dataset.label || opt.textContent.trim()
  };
}

function syncSelectFromSavedAssignment() {
  const slot = currentDaySlot();
  const select = document.querySelector(".swap-select");
  if (!slot || !select) return;
  const assignments = getAssignments();
  const saved = assignments[slot];
  if (saved) select.value = saved.page;
}

function updateSwapStatusUI() {
  const slot = currentDaySlot();
  const statusEl = document.querySelector(".swap-status");
  const originalSections = document.querySelectorAll(".original-workout");
  const titleEl = document.querySelector("[data-page-title]");
  const assignments = getAssignments();
  const currentPage = getCurrentFileName();

  if (!slot || !statusEl) return;
  const saved = assignments[slot];
  const baseTitle = titleEl ? titleEl.dataset.pageTitle : "";

  if (saved && saved.page && saved.page !== currentPage) {
    document.body.classList.add("has-swap-assignment");
    statusEl.innerHTML = `
      <div class="swap-banner">
        <div class="swap-banner-label">Current assignment for ${slotLabel(slot)}</div>
        <h3>${saved.label}</h3>
        <p>You reassigned this day. The original workout is hidden so the screen matches your saved choice.</p>
        <div class="swap-banner-actions">
          <a class="primary-link" href="${saved.page}">Open ${saved.label}</a>
          <button type="button" class="secondary-btn" onclick="clearDaySwap('${slot}')">Clear swap</button>
        </div>
      </div>
    `;
    originalSections.forEach(el => el.style.display = "none");
    if (titleEl && baseTitle) titleEl.textContent = `${baseTitle} → ${saved.label}`;
  } else {
    document.body.classList.remove("has-swap-assignment");
    statusEl.innerHTML = saved
      ? `<div class="swap-inline-note">Saved choice: <strong>${saved.label}</strong></div>`
      : `<div class="swap-inline-note">No saved swap for this day yet.</div>`;
    originalSections.forEach(el => el.style.display = "");
    if (titleEl && baseTitle) titleEl.textContent = baseTitle;
  }
}

function saveCurrentDaySwap() {
  const slot = currentDaySlot();
  const select = document.querySelector(".swap-select");
  if (!slot || !select) return;
  const selected = currentSelectOption(select);
  if (!selected) {
    clearDaySwap(slot);
    return;
  }
  const assignments = getAssignments();
  assignments[slot] = selected;
  saveAssignments(assignments);
  updateSwapStatusUI();
  updateHomeAssignments();
}

function openCurrentDaySwap() {
  const select = document.querySelector(".swap-select");
  const selected = currentSelectOption(select);
  if (!selected) return;
  window.location.href = selected.page;
}

function clearDaySwap(slotOverride) {
  const slot = slotOverride || currentDaySlot();
  if (!slot) return;
  const assignments = getAssignments();
  delete assignments[slot];
  saveAssignments(assignments);
  const select = document.querySelector(".swap-select");
  if (select) select.value = "";
  updateSwapStatusUI();
  updateHomeAssignments();
}

function updateHomeAssignments() {
  const cards = document.querySelectorAll("[data-slot-card]");
  if (!cards.length) return;
  const assignments = getAssignments();
  cards.forEach(card => {
    const slot = card.dataset.slotCard;
    const assigned = assignments[slot];
    const labelEl = card.querySelector("[data-slot-label]");
    const noteEl = card.querySelector("[data-slot-note]");
    const openLink = card.querySelector("[data-slot-open]");
    if (!labelEl || !noteEl || !openLink) return;
    const defaultLabel = labelEl.dataset.defaultLabel || labelEl.textContent;
    const defaultNote = noteEl.dataset.defaultNote || noteEl.textContent;
    if (assigned && assigned.page) {
      labelEl.textContent = `${slotLabel(slot)}: ${assigned.label}`;
      noteEl.textContent = "Saved swap active";
      openLink.href = assigned.page;
      card.classList.add("card-swapped");
    } else {
      labelEl.textContent = defaultLabel;
      noteEl.textContent = defaultNote;
      openLink.href = openLink.dataset.defaultHref || openLink.getAttribute("href");
      card.classList.remove("card-swapped");
    }
  });
}

function moveWorkout(selectEl) {
  // Kept for backward compatibility if any onchange remains
  if (!selectEl || !selectEl.value) return;
  window.location.href = selectEl.value;
}

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
  const isSick = sick === 'yes';

  if (isSick || energy <= 4) {
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

function initialiseStorage() {
  document.querySelectorAll('[data-key]').forEach(input => {
    loadFormValue(input);
    input.addEventListener('change', () => {
      saveFormValue(input);
      updateSummary();
    });
  });

  const saveBtn = document.querySelector(".swap-save-btn");
  const openBtn = document.querySelector(".swap-open-btn");
  const clearBtn = document.querySelector(".swap-clear-btn");
  if (saveBtn) saveBtn.addEventListener("click", saveCurrentDaySwap);
  if (openBtn) openBtn.addEventListener("click", openCurrentDaySwap);
  if (clearBtn) clearBtn.addEventListener("click", () => clearDaySwap());

  syncSelectFromSavedAssignment();
  updateSwapStatusUI();
  updateHomeAssignments();
  updateSummary();
}

document.addEventListener('DOMContentLoaded', initialiseStorage);
