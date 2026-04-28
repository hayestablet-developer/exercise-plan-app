// Supabase cloud-backed auth + workout tracking for Monikita’s Fitness App

const SUPABASE_URL = "https://pkskbmxjcyfunkxuxrya.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_7J5gBdQDzv_k2vTVVZ1hxw_iEwwzpmo";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const AUTH_GUEST_KEY = "monikitaGuestMode";

const DAY_LABELS = {
  "monday": "Monday",
  "tuesday": "Tuesday",
  "wednesday": "Wednesday",
  "thursday": "Thursday",
  "friday": "Friday",
  "saturday": "Saturday",
  "sunday": "Sunday",
  "shoulders-triceps": "Shoulders & Triceps",
  "featured-12-3-30": "12-3-30",
  "featured-long-glute": "Long-Length Glute Sculpt",
  "featured-pilates": "Pilates Core & Mobility"
};

function pageName() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function currentDaySlug() {
  const bodyDay = document.body.dataset.daySlot;
  if (bodyDay) return bodyDay;
  return pageName().replace(".html", "");
}

function isAuthPage() {
  return ["login.html", "create-account.html"].includes(pageName());
}

function isGuestMode() {
  return sessionStorage.getItem(AUTH_GUEST_KEY) === "true";
}

function setGuestMode(on) {
  if (on) sessionStorage.setItem(AUTH_GUEST_KEY, "true");
  else sessionStorage.removeItem(AUTH_GUEST_KEY);
}

async function getUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data && data.user ? data.user : null;
}

function showAuthMessage(text, type="visible") {
  const msg = document.getElementById("auth-message");
  if (!msg) return;
  msg.textContent = text || "";
  msg.className = text ? `auth-message ${type}` : "auth-message";
}

async function requireAuth() {
  if (isAuthPage()) return true;
  if (isGuestMode()) return true;
  const user = await getUser();
  if (!user) {
    window.location.href = "login.html?next=" + encodeURIComponent(pageName());
    return false;
  }
  return true;
}

async function initAuthPages() {
  const loginForm = document.getElementById("login-form");
  const createForm = document.getElementById("create-account-form");
  const guestBtn = document.getElementById("guest-login-btn");

  if (createForm) {
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("create-email").value.trim();
      const password = document.getElementById("create-password").value.trim();
      showAuthMessage("Creating account...", "visible");

      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) {
        showAuthMessage(error.message, "error");
        return;
      }

      setGuestMode(false);

      if (data && data.session) {
        showAuthMessage("Account created. Opening your dashboard...", "success");
        setTimeout(() => window.location.href = "index.html", 500);
      } else {
        showAuthMessage("Account created. If email confirmation is on, check your email. Then sign in.", "success");
        setTimeout(() => window.location.href = "login.html", 1200);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      showAuthMessage("Signing in...", "visible");

      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        showAuthMessage(error.message, "error");
        return;
      }

      setGuestMode(false);
      const next = new URLSearchParams(location.search).get("next") || "index.html";
      window.location.href = next;
    });
  }

  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      setGuestMode(true);
      const next = new URLSearchParams(location.search).get("next") || "index.html";
      window.location.href = next;
    });
  }
}

async function injectAuthStrip() {
  if (isAuthPage()) return;
  const header = document.querySelector("header");
  if (!header || document.getElementById("auth-strip")) return;

  const user = await getUser();
  const guest = isGuestMode();
  const strip = document.createElement("div");
  strip.id = "auth-strip";
  strip.className = "auth-strip";
  strip.innerHTML = `
    <div>
      <strong>${guest ? "Guest mode" : user ? "Signed in: " + user.email : "Not signed in"}</strong>
      <span>${guest ? "Guest data is not saved." : user ? "Workout data saves to Supabase." : "Sign in to save workouts."}</span>
    </div>
    <div class="auth-actions">
      ${user ? '<a href="account.html">Account</a>' : '<a href="login.html">Sign in</a>'}
      ${guest || user ? '<button id="logout-btn" class="secondary" type="button">Log out</button>' : ""}
    </div>
  `;
  header.insertAdjacentElement("afterend", strip);

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      setGuestMode(false);
      await supabaseClient.auth.signOut();
      window.location.href = "login.html";
    });
  }
}

async function initAccountPage() {
  if (pageName() !== "account.html") return;
  const status = document.getElementById("account-status");
  const emailEl = document.getElementById("account-email");
  const user = await getUser();

  if (isGuestMode()) {
    status.textContent = "You are in guest mode. No cloud account is active.";
    status.className = "auth-message visible";
    emailEl.textContent = "Guest";
    return;
  }

  if (!user) {
    window.location.href = "login.html?next=account.html";
    return;
  }

  status.textContent = "Connected to Supabase.";
  status.className = "auth-message success";
  emailEl.textContent = user.email || "—";

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      setGuestMode(false);
      window.location.href = "login.html";
    });
  }
}

function updateSummary() {
  const summaryEl = document.getElementById("daily-summary");
  if (!summaryEl) return;

  const root = document.getElementById("workout-content") || document;
  const checkboxInputs = root.querySelectorAll('input[type="checkbox"][data-key]');
  let completed = 0;
  checkboxInputs.forEach(cb => { if (cb.checked) completed++; });

  let energySum = 0, energyCount = 0;
  let effortSum = 0, effortCount = 0;

  root.querySelectorAll('input[data-type="energy"]').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) { energySum += val; energyCount++; }
  });
  root.querySelectorAll('input[data-type="effort"]').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) { effortSum += val; effortCount++; }
  });

  const energyAvg = energyCount > 0 ? (energySum / energyCount).toFixed(1) : "N/A";
  const effortAvg = effortCount > 0 ? (effortSum / effortCount).toFixed(1) : "N/A";
  summaryEl.innerHTML = `Completed exercises: <span>${completed}</span> | Average energy: <span>${energyAvg}</span> | Average effort: <span>${effortAvg}</span>`;
}

function getExerciseName(card) {
  return (card.querySelector("h4")?.textContent || "Exercise").replace(/\s+/g, " ").trim();
}

function getFieldValue(card, matcher) {
  const input = [...card.querySelectorAll("input[data-key]")].find(matcher);
  return input ? input.value : null;
}

function setFieldValue(card, matcher, value) {
  const input = [...card.querySelectorAll("input[data-key]")].find(matcher);
  if (!input || value === null || value === undefined) return;
  if (input.type === "checkbox") input.checked = !!value;
  else input.value = value;
}

function buildWorkoutRecord(card, userId) {
  const inputs = [...card.querySelectorAll("input[data-key]")];
  const regular = inputs.filter(input => {
    const key = (input.dataset.key || "").toLowerCase();
    return input.type !== "checkbox" &&
      input.dataset.type !== "energy" &&
      input.dataset.type !== "effort" &&
      !key.includes("weight");
  });

  return {
    user_id: userId,
    day: currentDaySlug(),
    workout_name: document.getElementById("active-workout-label")?.textContent || DAY_LABELS[currentDaySlug()] || currentDaySlug(),
    exercise: getExerciseName(card),
    set_1: regular[0]?.value || null,
    set_2: regular[1]?.value || null,
    set_3: regular[2]?.value || null,
    set_4: regular[3]?.value || null,
    weight_used: getFieldValue(card, input => (input.dataset.key || "").toLowerCase().includes("weight")) || null,
    energy: parseInt(getFieldValue(card, input => input.dataset.type === "energy"), 10) || null,
    effort: parseInt(getFieldValue(card, input => input.dataset.type === "effort"), 10) || null,
    completed: !!card.querySelector('input[type="checkbox"][data-key]')?.checked,
    updated_at: new Date().toISOString()
  };
}

async function saveExerciseCard(card) {
  if (isGuestMode()) return;
  const user = await getUser();
  if (!user || !card) return;

  const record = buildWorkoutRecord(card, user.id);

  const { data: existing } = await supabaseClient
    .from("workout_logs")
    .select("id")
    .eq("user_id", user.id)
    .eq("day", record.day)
    .eq("exercise", record.exercise)
    .limit(1)
    .maybeSingle();

  if (existing && existing.id) {
    await supabaseClient.from("workout_logs").update(record).eq("id", existing.id);
  } else {
    await supabaseClient.from("workout_logs").insert(record);
  }
}

async function loadWorkoutLogs() {
  if (isGuestMode()) return;
  const user = await getUser();
  if (!user) return;

  const { data, error } = await supabaseClient
    .from("workout_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("day", currentDaySlug());

  if (error || !data) return;

  data.forEach(row => {
    const card = [...document.querySelectorAll(".exercise")].find(el => getExerciseName(el) === row.exercise);
    if (!card) return;

    setFieldValue(card, input => input.type === "checkbox", row.completed);
    setFieldValue(card, input => (input.dataset.key || "").toLowerCase().includes("weight"), row.weight_used);
    setFieldValue(card, input => input.dataset.type === "energy", row.energy);
    setFieldValue(card, input => input.dataset.type === "effort", row.effort);

    const regular = [...card.querySelectorAll("input[data-key]")].filter(input => {
      const key = (input.dataset.key || "").toLowerCase();
      return input.type !== "checkbox" &&
        input.dataset.type !== "energy" &&
        input.dataset.type !== "effort" &&
        !key.includes("weight");
    });
    [row.set_1, row.set_2, row.set_3, row.set_4].forEach((value, idx) => {
      if (regular[idx] && value !== null && value !== undefined) regular[idx].value = value;
    });
  });

  updateSummary();
}

async function saveDayAssignment(day, assignedDay) {
  if (isGuestMode()) return;
  const user = await getUser();
  if (!user || !day || !assignedDay) return;

  const record = {
    user_id: user.id,
    day,
    assigned_day: assignedDay,
    updated_at: new Date().toISOString()
  };

  const { data: existing } = await supabaseClient
    .from("day_assignments")
    .select("id")
    .eq("user_id", user.id)
    .eq("day", day)
    .limit(1)
    .maybeSingle();

  if (existing && existing.id) {
    await supabaseClient.from("day_assignments").update(record).eq("id", existing.id);
  } else {
    await supabaseClient.from("day_assignments").insert(record);
  }
}

async function getAssignedDay(day) {
  if (isGuestMode()) return null;
  const user = await getUser();
  if (!user) return null;

  const { data } = await supabaseClient
    .from("day_assignments")
    .select("assigned_day")
    .eq("user_id", user.id)
    .eq("day", day)
    .limit(1)
    .maybeSingle();

  return data ? data.assigned_day : null;
}

async function renderAssignedWorkout() {
  const content = document.getElementById("workout-content");
  if (!content) return;

  const day = currentDaySlug();
  const assigned = await getAssignedDay(day);
  if (!assigned || assigned === day) {
    await loadWorkoutLogs();
    return;
  }

  try {
    const response = await fetch(assigned + ".html");
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const source = doc.getElementById("workout-content");
    if (!source) return;

    content.innerHTML = source.innerHTML;

    const label = document.getElementById("active-workout-label");
    if (label) label.textContent = "Currently showing: " + (DAY_LABELS[assigned] || assigned);

    initialiseWorkoutInputs();
    await loadWorkoutLogs();
  } catch (e) {
    await loadWorkoutLogs();
  }
}

function initialiseWorkoutInputs() {
  const inputs = document.querySelectorAll("[data-key]");
  inputs.forEach(input => {
    if (input.dataset.boundSupabase === "true") return;
    input.dataset.boundSupabase = "true";
    input.addEventListener("change", async () => {
      updateSummary();
      const card = input.closest(".exercise");
      await saveExerciseCard(card);
    });
  });
  updateSummary();
}

async function moveWorkout(selectEl) {
  const dest = selectEl.value;
  if (!dest) return;

  const assignedDay = dest.replace(".html", "");
  await saveDayAssignment(currentDaySlug(), assignedDay);
  await renderAssignedWorkout();
}

async function initHomeAssignments() {
  if (pageName() !== "index.html") return;
  // simple status only for now. Home cards remain links to weekdays.
}

function recommendWorkout() {
  const resultContainer = document.getElementById("advisor-result");
  if (!resultContainer) return;

  const last = document.getElementById("advisor-last").value;
  const energy = parseInt(document.getElementById("advisor-energy").value, 10);
  const sick = document.getElementById("advisor-sick").value;
  const fresh = document.getElementById("advisor-fresh").value;

  let recommendation = "";
  let page = "";
  let note = "";

  if (sick === "yes" || energy <= 4) {
    recommendation = "Recovery and Mobility";
    page = "wednesday.html";
    note = "Since you are sick or your energy is low, focus on gentle mobility work and a light walk.";
  } else if (last.includes("Lower") || last.includes("Glute")) {
    if (fresh === "upper") {
      recommendation = "Upper Push";
      page = "tuesday.html";
      note = "Your lower body needs more rest. Hit your upper body today.";
    } else {
      recommendation = "Upper Pull";
      page = "friday.html";
      note = "Avoid repeating lower body work. Focus on pulls and shoulders.";
    }
  } else if (last.includes("Upper") || last.includes("Shoulder")) {
    recommendation = fresh === "lower" ? "Lower Body A" : "Lower Body B";
    page = fresh === "lower" ? "monday.html" : "thursday.html";
    note = "Switch to lower body training to keep muscle balance.";
  } else {
    recommendation = "Featured Workout";
    page = "featured-12-3-30.html";
    note = "Try the 12-3-30 incline walk or explore featured workouts.";
  }

  resultContainer.innerHTML = `<p><strong>Recommended workout:</strong> ${recommendation}</p><p>${note}</p><p><a href="${page}">Open workout</a></p>`;
  resultContainer.style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAuthPages();

  const ok = await requireAuth();
  if (!ok) return;

  await injectAuthStrip();
  await initAccountPage();

  initialiseWorkoutInputs();
  await renderAssignedWorkout();
  await initHomeAssignments();
});
