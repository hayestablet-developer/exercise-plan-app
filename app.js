
function toggleOptionalSet(groupKey, forceShow) {
  const optionalFields = document.querySelectorAll('[data-optional-group="' + groupKey + '"]');
  if (!optionalFields.length) return;
  const storageKey = groupKey + '__show4';
  const shouldShow = typeof forceShow === 'boolean' ? forceShow : localStorage.getItem(storageKey) === 'true';
  optionalFields.forEach(function(field){ field.style.display = shouldShow ? 'flex' : 'none'; });
  const btn = document.querySelector('.add-set-btn[data-target="' + groupKey + '"]');
  if (btn) btn.textContent = shouldShow ? 'Hide set 4' : '+ Add set 4';
}

function initInputStorage(scope) {
  const root = scope || document;
  const inputs = root.querySelectorAll('[data-key]');
  inputs.forEach(function(input){
    const key = input.dataset.key;
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      if (input.type === 'checkbox') input.checked = storedValue === 'true';
      else input.value = storedValue;
    }
    if (!input.dataset.boundStorage) {
      input.addEventListener('change', function(){
        if (input.type === 'checkbox') localStorage.setItem(key, String(input.checked));
        else localStorage.setItem(key, input.value);
        updateSummary();
        updateLibraryProgress();
      });
      input.dataset.boundStorage = '1';
    }
  });

  const addSetButtons = root.querySelectorAll('.add-set-btn');
  addSetButtons.forEach(function(btn){
    const groupKey = btn.dataset.target;
    toggleOptionalSet(groupKey, localStorage.getItem(groupKey + '__show4') === 'true');
    if (!btn.dataset.boundSet) {
      btn.addEventListener('click', function(){
        const storageKey = groupKey + '__show4';
        const isShowing = localStorage.getItem(storageKey) === 'true';
        localStorage.setItem(storageKey, String(!isShowing));
        toggleOptionalSet(groupKey, !isShowing);
      });
      btn.dataset.boundSet = '1';
    }
  });
}

function updateSummary() {
  const summaryEl = document.getElementById('daily-summary');
  const content = document.getElementById('workout-content') || document;
  if (!summaryEl) return;

  const checkboxInputs = content.querySelectorAll('input[type="checkbox"][data-key]');
  let completed = 0;
  checkboxInputs.forEach(function(cb){ if (cb.checked) completed++; });

  let energySum = 0, energyCount = 0, effortSum = 0, effortCount = 0;
  const energyInputs = content.querySelectorAll('input[data-type="energy"]');
  energyInputs.forEach(function(input){
    const val = parseFloat(input.value);
    if (!isNaN(val)) { energySum += val; energyCount++; }
  });
  const effortInputs = content.querySelectorAll('input[data-type="effort"]');
  effortInputs.forEach(function(input){
    const val = parseFloat(input.value);
    if (!isNaN(val)) { effortSum += val; effortCount++; }
  });

  const energyAvg = energyCount > 0 ? (energySum / energyCount).toFixed(1) : 'N/A';
  const effortAvg = effortCount > 0 ? (effortSum / effortCount).toFixed(1) : 'N/A';
  summaryEl.innerHTML = '<div class="summary-box"><strong>Completed</strong><div>' + completed + ' / ' + checkboxInputs.length +
    '</div></div><div class="summary-box"><strong>Avg energy</strong><div>' + energyAvg +
    '</div></div><div class="summary-box"><strong>Avg effort</strong><div>' + effortAvg + '</div></div>';
}

const DAY_CONFIG = {
  'monday': { label: 'Lower Body A + Sprint', subtitle: 'Focus on glutes and hamstrings with heavy hip hinge movements and finish with sprints.'},
  'tuesday': { label: 'Upper Push', subtitle: 'Train chest, shoulders, triceps, and pull-up progress work.'},
  'wednesday': { label: 'Recovery & Mobility', subtitle: 'Reset day with gentle movement, mobility, and recovery.'},
  'thursday': { label: 'Lower Body B + Sprint', subtitle: 'Hit quads and glutes and finish with your sprint work.'},
  'friday': { label: 'Upper Pull + Shoulders/Triceps', subtitle: 'Back, biceps, shoulders, and triceps accessory work.'},
  'saturday': { label: 'Sprints & Core', subtitle: 'Conditioning and core focus.'},
  'sunday': { label: 'Rest', subtitle: 'Full rest day with optional gentle recovery work.'},
  'shoulders-triceps': { label: 'Shoulders & Triceps', subtitle: 'Focused upper-body session for delts and triceps.'}
};

function getAssignments() {
  try { return JSON.parse(localStorage.getItem('dayAssignments') || '{}'); }
  catch (e) { return {}; }
}

function saveAssignments(map) {
  localStorage.setItem('dayAssignments', JSON.stringify(map));
}

function updateHomeCards() {
  const cards = document.querySelectorAll('[data-slot-card]');
  if (!cards.length) return;
  const assignments = getAssignments();
  cards.forEach(function(card){
    const slot = card.dataset.slotCard;
    const assigned = assignments[slot] || slot;
    const cfg = DAY_CONFIG[assigned] || DAY_CONFIG[slot];
    const title = card.querySelector('[data-slot-label]');
    const note = card.querySelector('[data-slot-note]');
    if (title) title.textContent = slot.charAt(0).toUpperCase() + slot.slice(1) + ': ' + cfg.label;
    if (note) note.textContent = cfg.subtitle;
    if (assigned !== slot) card.classList.add('card-swapped');
    else card.classList.remove('card-swapped');
  });
}

function renderAssignedWorkout(daySlot, assignedSlot) {
  const target = document.getElementById('workout-content');
  if (!target) return;
  const cfg = DAY_CONFIG[assignedSlot] || DAY_CONFIG[daySlot];
  const subtitle = document.getElementById('workout-subtitle');
  const pill = document.getElementById('active-workout-label');
  if (subtitle) subtitle.textContent = cfg.subtitle;
  if (pill) pill.textContent = 'Currently showing: ' + cfg.label;

  fetch(assignedSlot + '.html')
    .then(function(resp){ return resp.text(); })
    .then(function(html){
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const source = doc.getElementById('workout-content');
      if (!source) return;
      target.innerHTML = source.innerHTML;
      initInputStorage(target);
      updateSummary();
    })
    .catch(function(){ /* keep current content if fetch fails */ });
}

function populateSwapSelect(daySlot) {
  const select = document.getElementById('swap-select');
  if (!select) return;
  const options = [
    ['monday','Monday / Lower Body A + Sprint'],
    ['tuesday','Tuesday / Upper Push'],
    ['wednesday','Wednesday / Recovery & Mobility'],
    ['thursday','Thursday / Lower Body B + Sprint'],
    ['friday','Friday / Upper Pull + Shoulders/Triceps'],
    ['saturday','Saturday / Sprints & Core'],
    ['sunday','Sunday / Rest'],
    ['shoulders-triceps','Shoulders & Triceps']
  ];
  select.innerHTML = '<option value="">--Select--</option>' + options.map(function(opt){
    return '<option value="' + opt[0] + '">' + opt[1] + '</option>';
  }).join('');
  const assigned = getAssignments()[daySlot] || '';
  if (assigned) select.value = assigned;
}

function initDayPage() {
  const daySlot = document.body.dataset.daySlot;
  if (!daySlot) return;
  populateSwapSelect(daySlot);
  const assignments = getAssignments();
  const current = assignments[daySlot];
  if (current) renderAssignedWorkout(daySlot, current);
  else updateSummary();

  const openBtn = document.getElementById('open-selection-btn');
  const saveBtn = document.getElementById('save-choice-btn');
  const clearBtn = document.getElementById('clear-choice-btn');
  const select = document.getElementById('swap-select');

  if (openBtn && select) {
    openBtn.addEventListener('click', function(){
      if (select.value) window.location.href = select.value + '.html';
    });
  }
  if (saveBtn && select) {
    saveBtn.addEventListener('click', function(){
      if (!select.value) return;
      const map = getAssignments();
      map[daySlot] = select.value;
      saveAssignments(map);
      updateHomeCards();
      renderAssignedWorkout(daySlot, select.value);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function(){
      const map = getAssignments();
      delete map[daySlot];
      saveAssignments(map);
      populateSwapSelect(daySlot);
      window.location.href = daySlot + '.html';
    });
  }
}

function updateLibraryProgress() {
  const checks = Array.from(document.querySelectorAll('.library-check'));
  if (!checks.length) return;
  const overall = document.getElementById('library-overall-progress');
  const done = checks.filter(function(cb){ return cb.checked; }).length;
  if (overall) overall.textContent = done + ' / ' + checks.length + ' exercises checked off';

  const groups = {};
  checks.forEach(function(cb){
    const g = cb.dataset.group || 'other';
    groups[g] = groups[g] || { total: 0, done: 0 };
    groups[g].total += 1;
    if (cb.checked) groups[g].done += 1;
  });
  Object.keys(groups).forEach(function(groupId){
    const node = document.getElementById('progress-' + groupId);
    if (node) node.textContent = groups[groupId].done + ' / ' + groups[groupId].total + ' complete';
  });
}

function setupLibraryFilters() {
  const search = document.getElementById('library-search');
  const chips = Array.from(document.querySelectorAll('.filter-chip'));
  const items = Array.from(document.querySelectorAll('.library-exercise'));
  if (!search && !chips.length) return;
  let activeGroup = 'all';

  function apply() {
    const q = (search ? search.value : '').trim().toLowerCase();
    items.forEach(function(item){
      const text = item.textContent.toLowerCase();
      const group = item.closest('.library-group').dataset.groupSection;
      const show = (activeGroup === 'all' || activeGroup === group) && (!q || text.indexOf(q) !== -1);
      item.style.display = show ? '' : 'none';
    });
    document.querySelectorAll('.library-group').forEach(function(section){
      const visible = Array.from(section.querySelectorAll('.library-exercise')).some(function(ex){ return ex.style.display !== 'none'; });
      section.style.display = visible ? '' : 'none';
    });
  }

  if (search) search.addEventListener('input', apply);
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      chips.forEach(function(c){ c.classList.remove('active'); });
      chip.classList.add('active');
      activeGroup = chip.dataset.filter;
      apply();
    });
  });
}

function recommendWorkout() {
  const resultContainer = document.getElementById('advisor-result');
  if (!resultContainer) return;
  const last = document.getElementById('advisor-last').value;
  const energy = parseInt(document.getElementById('advisor-energy').value, 10);
  const sick = document.getElementById('advisor-sick').value;
  const fresh = document.getElementById('advisor-fresh').value;

  let recommendation = '', page = '', note = '';
  if (sick === 'yes' || energy <= 4) {
    recommendation = 'Recovery and Mobility';
    page = 'wednesday.html';
    note = 'Because you are sick or low energy, the best move is recovery, mobility, and a light walk.';
  } else if (last.includes('Lower') || last.includes('Glute')) {
    recommendation = fresh === 'upper' ? 'Upper Push' : 'Upper Pull + Shoulders/Triceps';
    page = fresh === 'upper' ? 'tuesday.html' : 'friday.html';
    note = 'You recently hit lower body, so upper body is the smarter next move.';
  } else if (last.includes('Upper') || last.includes('Shoulder')) {
    recommendation = fresh === 'lower' ? 'Lower Body A + Sprint' : 'Lower Body B + Sprint';
    page = fresh === 'lower' ? 'monday.html' : 'thursday.html';
    note = 'Your upper body worked recently, so lower body is the better fit.';
  } else {
    recommendation = 'Featured Workout';
    page = 'featured.html';
    note = 'Plug in a featured workout if the week got messy.';
  }
  resultContainer.innerHTML = '<p><strong>Recommended workout:</strong> ' + recommendation + '</p><p>' + note + '</p><p><a href="' + page + '">Open workout</a></p>';
  resultContainer.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function(){
  initInputStorage(document);
  initDayPage();
  updateHomeCards();
  updateSummary();
  updateLibraryProgress();
  setupLibraryFilters();
});
