
const APP_SESSION_KEY = "fitnessAuthSession";
const APP_ACCOUNTS_KEY = "fitnessAccounts";
const APP_NAMESPACE_PREFIX = "fitnessUser:";
const ASSIGNMENTS_KEY = "dayAssignments";
const EXERCISE_LOG_KEY = "exerciseLog";
const LAST_USER_ID_KEY = "fitnessLastUserId";


function normalizeUserId(userId) {
  return String(userId || "").trim().toLowerCase();
}

function rememberLastUserId(userId) {
  if (!userId) return;
  localStorage.setItem(LAST_USER_ID_KEY, userId);
}

function getLastUserId() {
  return localStorage.getItem(LAST_USER_ID_KEY) || "";
}

function migrateAccounts() {
  const raw = localStorage.getItem(APP_ACCOUNTS_KEY);
  if (!raw) return {};
  let accounts;
  try {
    accounts = JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
  const migrated = {};
  Object.keys(accounts).forEach(function(key){
    const account = accounts[key] || {};
    const normalized = normalizeUserId(key);
    if (!normalized) return;
    if (!migrated[normalized]) {
      migrated[normalized] = {
        password: account.password || "",
        createdAt: account.createdAt || new Date().toISOString(),
        updatedAt: account.updatedAt || "",
        displayUserId: account.displayUserId || key
      };
    }
  });
  if (JSON.stringify(accounts) !== JSON.stringify(migrated)) {
    localStorage.setItem(APP_ACCOUNTS_KEY, JSON.stringify(migrated));
  }
  return migrated;
}


const DAY_CONFIG = {
  "monday": { label: "Lower Body A + Sprint", subtitle: "Focus on glutes and hamstrings with heavy hip hinge movements and finish with sprints."},
  "tuesday": { label: "Upper Push", subtitle: "Train chest, shoulders, triceps, and pull-up progress work."},
  "wednesday": { label: "Recovery & Mobility", subtitle: "Reset day with gentle movement, mobility, and recovery."},
  "thursday": { label: "Lower Body B + Sprint", subtitle: "Hit quads and glutes and finish with your sprint work."},
  "friday": { label: "Upper Pull + Shoulders/Triceps", subtitle: "Back, biceps, shoulders, and triceps accessory work."},
  "saturday": { label: "Sprints & Core", subtitle: "Conditioning and core focus."},
  "sunday": { label: "Rest", subtitle: "Full rest day with optional gentle recovery work."},
  "shoulders-triceps": { label: "Shoulders & Triceps", subtitle: "Focused upper-body session for delts and triceps."}
};

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(APP_SESSION_KEY) || "null");
  } catch (e) {
    return null;
  }
}

function setSession(session) {
  sessionStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(APP_SESSION_KEY);
}

function isGuestSession() {
  const session = getSession();
  return !!session && session.mode === "guest";
}

function getUserNamespace() {
  const session = getSession();
  if (!session) return null;
  if (session.mode === "guest") return null;
  const userKey = session.userKey || normalizeUserId(session.userId);
  if (!userKey) return null;
  return APP_NAMESPACE_PREFIX + userKey + ":";
}

function getTrackedKey(key) {
  const ns = getUserNamespace();
  if (!ns) return null;
  return ns + key;
}

function trackedGet(key) {
  const actual = getTrackedKey(key);
  if (!actual) return null;
  return localStorage.getItem(actual);
}

function trackedSet(key, value) {
  const actual = getTrackedKey(key);
  if (!actual) return;
  localStorage.setItem(actual, value);
}

function trackedRemove(key) {
  const actual = getTrackedKey(key);
  if (!actual) return;
  localStorage.removeItem(actual);
}

function trackedGetJson(key, fallback) {
  const raw = trackedGet(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function trackedSetJson(key, value) {
  trackedSet(key, JSON.stringify(value));
}

function getAccounts() {
  return migrateAccounts();
}

function saveAccounts(accounts) {
  localStorage.setItem(APP_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function ensureProtectedPage() {
  const path = window.location.pathname;
  const onAuthPage = path.endsWith("login.html") || path.endsWith("create-account.html");
  const session = getSession();
  if (!onAuthPage && !session) {
    const target = encodeURIComponent(window.location.pathname.split("/").pop() || "index.html");
    window.location.href = "login.html?next=" + target;
    return false;
  }
  return true;
}

function getNextUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("next") || "index.html";
}


function initLoginPage() {
  const isLogin = window.location.pathname.endsWith("login.html");
  const isCreate = window.location.pathname.endsWith("create-account.html");
  if (!isLogin && !isCreate) return;

  const createForm = document.getElementById("create-account-form");
  const loginForm = document.getElementById("login-form");
  const guestBtn = document.getElementById("guest-login-btn");
  const msg = document.getElementById("login-message");
  const loginIdInput = document.getElementById("login-user-id");

  if (loginIdInput && !loginIdInput.value) {
    loginIdInput.value = getLastUserId();
  }

  function showMessage(text, ok) {
    if (!msg) return;
    msg.textContent = text || "";
    msg.className = text ? (ok ? "login-message ok" : "login-message error") : "login-message";
    msg.style.display = text ? "block" : "none";
  }

  showMessage("", false);

  if (createForm) {
    createForm.addEventListener("submit", function(e){
      e.preventDefault();
      const rawUserId = (document.getElementById("create-user-id").value || "").trim();
      const normalizedUserId = normalizeUserId(rawUserId);
      const password = (document.getElementById("create-password").value || "").trim();

      if (!normalizedUserId || !password) {
        showMessage("Enter a user ID and password to create your account.", false);
        return;
      }
      if (password.length < 4) {
        showMessage("Use a password with at least 4 characters.", false);
        return;
      }

      const accounts = getAccounts();
      if (accounts[normalizedUserId]) {
        showMessage("That user ID already exists. Try signing in instead.", false);
        return;
      }

      accounts[normalizedUserId] = {
        password: password,
        createdAt: new Date().toISOString(),
        displayUserId: rawUserId
      };
      saveAccounts(accounts);
      rememberLastUserId(rawUserId);
      createForm.reset();

      showMessage("Account created. Redirecting to sign in...", true);
      setTimeout(function(){
        window.location.href = "login.html?next=" + encodeURIComponent(getNextUrl());
      }, 500);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function(e){
      e.preventDefault();
      const rawUserId = (document.getElementById("login-user-id").value || "").trim();
      const normalizedUserId = normalizeUserId(rawUserId);
      const password = (document.getElementById("login-password").value || "").trim();
      const accounts = getAccounts();
      const account = accounts[normalizedUserId];

      if (!account || account.password !== password) {
        showMessage("Wrong user ID or password.", false);
        return;
      }

      const displayUserId = account.displayUserId || rawUserId || normalizedUserId;
      rememberLastUserId(displayUserId);
      setSession({
        mode: "user",
        userId: displayUserId,
        userKey: normalizedUserId,
        signedInAt: new Date().toISOString()
      });
      window.location.href = getNextUrl();
    });
  }

  if (guestBtn) {
    guestBtn.addEventListener("click", function(){
      setSession({ mode: "guest", userId: "Guest", signedInAt: new Date().toISOString() });
      window.location.href = getNextUrl();
    });
  }
}


function injectAuthStrip() {
  if (window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("create-account.html")) return;
  const main = document.querySelector("main");
  const header = document.querySelector("header");
  if (!main || !header) return;
  if (document.getElementById("auth-strip")) return;

  const session = getSession();
  const strip = document.createElement("div");
  strip.id = "auth-strip";
  strip.className = "auth-strip " + (isGuestSession() ? "guest" : "user");
  strip.innerHTML = `
    <div class="auth-copy">
      <strong>${isGuestSession() ? "Guest mode" : "Signed in as " + session.userId}</strong>
      <span>${isGuestSession() ? "Progress is not being saved in guest mode." : "Workout progress, sets, reps, and energy are saved to this profile."}</span>
    </div>
    <div class="auth-actions">
      ${isGuestSession() ? '<a class="small-auth-btn" href="login.html">Create account / Sign in</a>' : '<a class="small-auth-btn" href="account.html">My profile</a>'}
      <button type="button" id="logout-btn" class="small-auth-btn secondary">Log out</button>
    </div>
  `;
  header.insertAdjacentElement("afterend", strip);

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function(){
      clearSession();
      window.location.href = "login.html";
    });
  }
}

function getAssignments() {
  return trackedGetJson(ASSIGNMENTS_KEY, {});
}

function saveAssignments(map) {
  trackedSetJson(ASSIGNMENTS_KEY, map);
}

function toggleOptionalSet(groupKey, forceShow) {
  const optionalFields = document.querySelectorAll('[data-optional-group="' + groupKey + '"]');
  if (!optionalFields.length) return;
  const storageKey = groupKey + "__show4";
  const stored = trackedGet(storageKey) === "true";
  const shouldShow = typeof forceShow === "boolean" ? forceShow : stored;
  optionalFields.forEach(function(field){ field.style.display = shouldShow ? "flex" : "none"; });
  const btn = document.querySelector('.add-set-btn[data-target="' + groupKey + '"]');
  if (btn) btn.textContent = shouldShow ? "Hide set 4" : "+ Add set 4";
}

function syncExerciseLog(input) {
  if (isGuestSession() || !getUserNamespace()) return;
  const daySlot = document.body.dataset.daySlot;
  if (!daySlot) return;
  const exerciseCard = input.closest(".exercise");
  if (!exerciseCard) return;
  const assigned = getAssignments()[daySlot] || daySlot;
  const exerciseName = (exerciseCard.querySelector("h4") || {}).textContent || "Exercise";
  const sets = {};
  exerciseCard.querySelectorAll('input[data-key]').forEach(function(field){
    const label = field.closest("label");
    const labelText = label ? label.textContent.trim() : field.dataset.key;
    if (field.type === "checkbox") return;
    if (labelText.toLowerCase().indexOf("set") === 0 || field.dataset.type === "energy" || field.dataset.type === "effort") {
      sets[labelText] = field.value || "";
    }
  });
  const completedBox = exerciseCard.querySelector('input[type="checkbox"][data-key]');
  const recordKey = daySlot + "|" + assigned + "|" + exerciseName;
  const log = trackedGetJson(EXERCISE_LOG_KEY, {});
  log[recordKey] = {
    updatedAt: new Date().toISOString(),
    day: daySlot,
    assignedWorkout: assigned,
    exercise: exerciseName,
    completed: completedBox ? completedBox.checked : false,
    fields: sets
  };
  trackedSetJson(EXERCISE_LOG_KEY, log);
}

function initInputStorage(scope) {
  const root = scope || document;
  const inputs = root.querySelectorAll("[data-key]");
  inputs.forEach(function(input){
    const key = input.dataset.key;
    if (!isGuestSession()) {
      const storedValue = trackedGet(key);
      if (storedValue !== null) {
        if (input.type === "checkbox") input.checked = storedValue === "true";
        else input.value = storedValue;
      }
    }
    if (!input.dataset.boundStorage) {
      input.addEventListener("change", function(){
        if (!isGuestSession()) {
          if (input.type === "checkbox") trackedSet(key, String(input.checked));
          else trackedSet(key, input.value);
          syncExerciseLog(input);
        }
        updateSummary();
        updateLibraryProgress();
      });
      input.dataset.boundStorage = "1";
    }
  });

  const addSetButtons = root.querySelectorAll(".add-set-btn");
  addSetButtons.forEach(function(btn){
    const groupKey = btn.dataset.target;
    toggleOptionalSet(groupKey, !isGuestSession() && trackedGet(groupKey + "__show4") === "true");
    if (!btn.dataset.boundSet) {
      btn.addEventListener("click", function(){
        if (isGuestSession()) {
          const currentlyVisible = btn.textContent.indexOf("Hide") !== -1;
          toggleOptionalSet(groupKey, !currentlyVisible);
          return;
        }
        const storageKey = groupKey + "__show4";
        const isShowing = trackedGet(storageKey) === "true";
        trackedSet(storageKey, String(!isShowing));
        toggleOptionalSet(groupKey, !isShowing);
      });
      btn.dataset.boundSet = "1";
    }
  });
}

function updateSummary() {
  const summaryEl = document.getElementById("daily-summary");
  const content = document.getElementById("workout-content") || document;
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

  const energyAvg = energyCount > 0 ? (energySum / energyCount).toFixed(1) : "N/A";
  const effortAvg = effortCount > 0 ? (effortSum / effortCount).toFixed(1) : "N/A";
  summaryEl.innerHTML = '<div class="summary-box"><strong>Completed</strong><div>' + completed + ' / ' + checkboxInputs.length +
    '</div></div><div class="summary-box"><strong>Avg energy</strong><div>' + energyAvg +
    '</div></div><div class="summary-box"><strong>Avg effort</strong><div>' + effortAvg + '</div></div>';
}

function updateHomeCards() {
  const cards = document.querySelectorAll("[data-slot-card]");
  if (!cards.length) return;
  const assignments = getAssignments();
  cards.forEach(function(card){
    const slot = card.dataset.slotCard;
    const assigned = assignments[slot] || slot;
    const cfg = DAY_CONFIG[assigned] || DAY_CONFIG[slot];
    const title = card.querySelector("[data-slot-label]");
    const note = card.querySelector("[data-slot-note]");
    if (title) title.textContent = slot.charAt(0).toUpperCase() + slot.slice(1) + ": " + cfg.label;
    if (note) note.textContent = cfg.subtitle;
    if (assigned !== slot) card.classList.add("card-swapped");
    else card.classList.remove("card-swapped");
  });
}

function renderAssignedWorkout(daySlot, assignedSlot) {
  const target = document.getElementById("workout-content");
  if (!target) return;
  const cfg = DAY_CONFIG[assignedSlot] || DAY_CONFIG[daySlot];
  const subtitle = document.getElementById("workout-subtitle");
  const pill = document.getElementById("active-workout-label");
  if (subtitle) subtitle.textContent = cfg.subtitle;
  if (pill) pill.textContent = "Currently showing: " + cfg.label;

  fetch(assignedSlot + ".html")
    .then(function(resp){ return resp.text(); })
    .then(function(html){
      const doc = new DOMParser().parseFromString(html, "text/html");
      const source = doc.getElementById("workout-content");
      if (!source) return;
      target.innerHTML = source.innerHTML;
      initInputStorage(target);
      updateSummary();
    })
    .catch(function(){});
}

function populateSwapSelect(daySlot) {
  const select = document.getElementById("swap-select");
  if (!select) return;
  const options = [
    ["monday","Monday / Lower Body A + Sprint"],
    ["tuesday","Tuesday / Upper Push"],
    ["wednesday","Wednesday / Recovery & Mobility"],
    ["thursday","Thursday / Lower Body B + Sprint"],
    ["friday","Friday / Upper Pull + Shoulders/Triceps"],
    ["saturday","Saturday / Sprints & Core"],
    ["sunday","Sunday / Rest"],
    ["shoulders-triceps","Shoulders & Triceps"]
  ];
  select.innerHTML = '<option value="">--Select--</option>' + options.map(function(opt){
    return '<option value="' + opt[0] + '">' + opt[1] + '</option>';
  }).join("");
  const assigned = getAssignments()[daySlot] || "";
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

  const openBtn = document.getElementById("open-selection-btn");
  const saveBtn = document.getElementById("save-choice-btn");
  const clearBtn = document.getElementById("clear-choice-btn");
  const select = document.getElementById("swap-select");

  if (openBtn && select) {
    openBtn.addEventListener("click", function(){
      if (select.value) window.location.href = select.value + ".html";
    });
  }
  if (saveBtn && select) {
    saveBtn.addEventListener("click", function(){
      if (!select.value) return;
      if (isGuestSession()) {
        renderAssignedWorkout(daySlot, select.value);
        return;
      }
      const map = getAssignments();
      map[daySlot] = select.value;
      saveAssignments(map);
      updateHomeCards();
      renderAssignedWorkout(daySlot, select.value);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function(){
      if (isGuestSession()) {
        window.location.href = daySlot + ".html";
        return;
      }
      const map = getAssignments();
      delete map[daySlot];
      saveAssignments(map);
      populateSwapSelect(daySlot);
      window.location.href = daySlot + ".html";
    });
  }
}

function updateLibraryProgress() {
  const checks = Array.from(document.querySelectorAll(".library-check"));
  if (!checks.length) return;
  const overall = document.getElementById("library-overall-progress");
  const done = checks.filter(function(cb){ return cb.checked; }).length;
  if (overall) overall.textContent = done + " / " + checks.length + " exercises checked off";

  const groups = {};
  checks.forEach(function(cb){
    const g = cb.dataset.group || "other";
    groups[g] = groups[g] || { total: 0, done: 0 };
    groups[g].total += 1;
    if (cb.checked) groups[g].done += 1;
  });
  Object.keys(groups).forEach(function(groupId){
    const node = document.getElementById("progress-" + groupId);
    if (node) node.textContent = groups[groupId].done + " / " + groups[groupId].total + " complete";
  });
}

function setupLibraryFilters() {
  const search = document.getElementById("library-search");
  const chips = Array.from(document.querySelectorAll(".filter-chip"));
  const items = Array.from(document.querySelectorAll(".library-exercise"));
  if (!search && !chips.length) return;
  let activeGroup = "all";

  function apply() {
    const q = (search ? search.value : "").trim().toLowerCase();
    items.forEach(function(item){
      const text = item.textContent.toLowerCase();
      const group = item.closest(".library-group").dataset.groupSection;
      const show = (activeGroup === "all" || activeGroup === group) && (!q || text.indexOf(q) !== -1);
      item.style.display = show ? "" : "none";
    });
    document.querySelectorAll(".library-group").forEach(function(section){
      const visible = Array.from(section.querySelectorAll(".library-exercise")).some(function(ex){ return ex.style.display !== "none"; });
      section.style.display = visible ? "" : "none";
    });
  }

  if (search) search.addEventListener("input", apply);
  chips.forEach(function(chip){
    chip.addEventListener("click", function(){
      chips.forEach(function(c){ c.classList.remove("active"); });
      chip.classList.add("active");
      activeGroup = chip.dataset.filter;
      apply();
    });
  });
}

function recommendWorkout() {
  const resultContainer = document.getElementById("advisor-result");
  if (!resultContainer) return;
  const last = document.getElementById("advisor-last").value;
  const energy = parseInt(document.getElementById("advisor-energy").value, 10);
  const sick = document.getElementById("advisor-sick").value;
  const fresh = document.getElementById("advisor-fresh").value;

  let recommendation = "", page = "", note = "";
  if (sick === "yes" || energy <= 4) {
    recommendation = "Recovery and Mobility";
    page = "wednesday.html";
    note = "Because you are sick or low energy, the best move is recovery, mobility, and a light walk.";
  } else if (last.includes("Lower") || last.includes("Glute")) {
    recommendation = fresh === "upper" ? "Upper Push" : "Upper Pull + Shoulders/Triceps";
    page = fresh === "upper" ? "tuesday.html" : "friday.html";
    note = "You recently hit lower body, so upper body is the smarter next move.";
  } else if (last.includes("Upper") || last.includes("Shoulder")) {
    recommendation = fresh === "lower" ? "Lower Body A + Sprint" : "Lower Body B + Sprint";
    page = fresh === "lower" ? "monday.html" : "thursday.html";
    note = "Your upper body worked recently, so lower body is the better fit.";
  } else {
    recommendation = "Featured Workout";
    page = "featured.html";
    note = "Plug in a featured workout if the week got messy.";
  }
  resultContainer.innerHTML = '<p><strong>Recommended workout:</strong> ' + recommendation + '</p><p>' + note + '</p><p><a href="' + page + '">Open workout</a></p>';
  resultContainer.style.display = "block";
}


function initAccountPage() {
  if (!window.location.pathname.endsWith("account.html")) return;
  const session = getSession();
  const msg = document.getElementById("account-message");
  const userIdEl = document.getElementById("profile-user-id");
  const modeEl = document.getElementById("profile-mode");
  const form = document.getElementById("reset-password-form");
  const guestNote = document.getElementById("guest-account-note");

  function showMessage(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = ok ? "login-message ok" : "login-message error";
  }

  if (!session) {
    window.location.href = "login.html?next=account.html";
    return;
  }

  if (userIdEl) userIdEl.textContent = session.userId || getLastUserId() || "—";
  if (modeEl) modeEl.textContent = isGuestSession() ? "Guest" : "Signed in";

  if (isGuestSession()) {
    if (form) form.style.display = "none";
    if (guestNote) guestNote.style.display = "block";
    return;
  }

  if (!form) return;
  form.addEventListener("submit", function(e){
    e.preventDefault();
    const currentPassword = (document.getElementById("current-password").value || "").trim();
    const newPassword = (document.getElementById("new-password").value || "").trim();
    const confirmPassword = (document.getElementById("confirm-password").value || "").trim();
    const accounts = getAccounts();
    const userKey = session.userKey || normalizeUserId(session.userId);

    if (!accounts[userKey]) {
      showMessage("We could not find your account.", false);
      return;
    }
    if (accounts[userKey].password !== currentPassword) {
      showMessage("Current password is incorrect.", false);
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      showMessage("Use a new password with at least 4 characters.", false);
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage("New password and confirmation do not match.", false);
      return;
    }

    accounts[userKey].password = newPassword;
    accounts[userKey].updatedAt = new Date().toISOString();
    saveAccounts(accounts);
    form.reset();
    showMessage("Password updated.", true);
  });
}


document.addEventListener("DOMContentLoaded", function(){
  initLoginPage();
  if (!ensureProtectedPage()) return;
  injectAuthStrip();
  initAccountPage();
  initInputStorage(document);
  initDayPage();
  updateHomeCards();
  updateSummary();
  updateLibraryProgress();
  setupLibraryFilters();
});
