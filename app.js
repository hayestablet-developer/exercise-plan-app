
const STORAGE_PREFIX = "monikita-app:";
const ASSIGN_KEY = STORAGE_PREFIX + "assignments";
const WORKOUTS = {"monday": {"label": "Lower Body A + Sprint", "subtitle": "Dead hang + glute and hamstring focus", "card_title": "Monday: Lower A + Sprint", "card_note": "Glutes & Hamstrings", "exercises": [{"name": "Dead Hang", "slug": "dead-hang", "meta": "30 seconds \u2022 pull-up goal", "fields": [["time", "Time (sec)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dead+hang+exercise", "images": "https://www.google.com/search?tbm=isch&q=dead+hang+exercise"}, {"name": "Romanian Deadlift", "slug": "romanian-deadlift", "meta": "3 sets \u2022 6\u201310 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=romanian+deadlift+proper+form", "images": "https://www.google.com/search?tbm=isch&q=romanian+deadlift+form"}, {"name": "Hip Thrust", "slug": "hip-thrust", "meta": "3 sets \u2022 8\u201312 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=hip+thrust+exercise+form", "images": "https://www.google.com/search?tbm=isch&q=hip+thrust+exercise+form"}, {"name": "Step-Ups", "slug": "step-ups", "meta": "3 sets/side \u2022 8\u201312 reps", "fields": [["reps", "Reps (per leg)", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=step+ups+glute+focus", "images": "https://www.google.com/search?tbm=isch&q=step+up+glute+focus"}, {"name": "Cable Kickbacks", "slug": "cable-kickbacks", "meta": "3 sets/side \u2022 12\u201318 reps", "fields": [["reps", "Reps (per leg)", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=cable+kickback+glute", "images": "https://www.google.com/search?tbm=isch&q=cable+kickback+glute"}, {"name": "Abductor Machine", "slug": "abductor-machine", "meta": "3 sets \u2022 15\u201325 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=abductor+machine", "images": "https://www.google.com/search?tbm=isch&q=abductor+machine"}, {"name": "Sprints", "slug": "sprints", "meta": "30 sec on / 90 sec off \u00d7 5", "fields": [["reps", "Intervals completed", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=treadmill+sprint+interval+workout", "images": "https://www.google.com/search?tbm=isch&q=treadmill+sprint+workout"}]}, "tuesday": {"label": "Upper Push + Pull-Up Work", "subtitle": "Chest, shoulders, and triceps plus pull-up progress", "card_title": "Tuesday: Upper Push", "card_note": "Chest, Shoulders & Triceps + Pull\u2011Up Work", "exercises": [{"name": "Dead Hang", "slug": "dead-hang", "meta": "30 seconds \u2022 pull-up goal", "fields": [["time", "Time (sec)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dead+hang+exercise", "images": "https://www.google.com/search?tbm=isch&q=dead+hang"}, {"name": "Band-Assisted Pull-Up", "slug": "band-assisted-pull-up", "meta": "3 sets \u2022 5\u20138 reps", "fields": [["reps", "Reps", "number"], ["weight", "Band colour/level", "text"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=band+assisted+pull+up", "images": "https://www.google.com/search?tbm=isch&q=band+assisted+pull+up"}, {"name": "Scapular Pull-Up", "slug": "scapular-pull-up", "meta": "2\u20133 sets \u2022 6\u201310 reps", "fields": [["reps", "Reps", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=scapular+pull+up", "images": "https://www.google.com/search?tbm=isch&q=scapular+pull+up"}, {"name": "Incline Dumbbell Press", "slug": "incline-dumbbell-press", "meta": "3 sets \u2022 8\u201312 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=incline+dumbbell+press", "images": "https://www.google.com/search?tbm=isch&q=incline+dumbbell+press"}, {"name": "Dumbbell Shoulder Press", "slug": "dumbbell-shoulder-press", "meta": "3 sets \u2022 8\u201310 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dumbbell+shoulder+press", "images": "https://www.google.com/search?tbm=isch&q=dumbbell+shoulder+press"}, {"name": "Lateral Raise", "slug": "lateral-raise", "meta": "3 sets \u2022 12\u201318 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=lateral+raise+exercise", "images": "https://www.google.com/search?tbm=isch&q=lateral+raise+exercise"}, {"name": "Triceps Pushdown", "slug": "triceps-pushdown", "meta": "3 sets \u2022 10\u201315 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=triceps+pushdown", "images": "https://www.google.com/search?tbm=isch&q=triceps+pushdown"}]}, "wednesday": {"label": "Recovery & Mobility", "subtitle": "Reset day", "card_title": "Wednesday: Recovery & Mobility", "card_note": "Active Recovery & Pilates", "exercises": [{"name": "Dead Hang", "slug": "dead-hang", "meta": "30 seconds", "fields": [["time", "Time (sec)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dead+hang+exercise", "images": "https://www.google.com/search?tbm=isch&q=dead+hang"}, {"name": "Walk", "slug": "walk", "meta": "20\u201330 minutes", "fields": [["time", "Duration (min)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=brisk+walking+benefits", "images": "https://www.google.com/search?tbm=isch&q=walking+exercise"}, {"name": "Pilates Mobility Flow", "slug": "pilates-mobility-flow", "meta": "15\u201325 minutes", "fields": [["time", "Duration (min)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=pilates+mobility+routine", "images": "https://www.google.com/search?tbm=isch&q=pilates+mobility"}, {"name": "Breathwork / Meditation", "slug": "breathwork", "meta": "5\u201310 minutes", "fields": [["time", "Duration (min)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=guided+breathwork", "images": "https://www.google.com/search?tbm=isch&q=breathwork"}]}, "thursday": {"label": "Lower Body B + Sprint", "subtitle": "Quad and glute focus", "card_title": "Thursday: Lower B + Sprint", "card_note": "Quads & Glutes", "exercises": [{"name": "Dead Hang", "slug": "dead-hang", "meta": "30 seconds", "fields": [["time", "Time (sec)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dead+hang+exercise", "images": "https://www.google.com/search?tbm=isch&q=dead+hang"}, {"name": "Goblet Squat", "slug": "goblet-squat", "meta": "3 sets \u2022 8\u201312 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=goblet+squat+form", "images": "https://www.google.com/search?tbm=isch&q=goblet+squat+form"}, {"name": "Reverse Lunge or Split Squat", "slug": "reverse-lunge", "meta": "3 sets/side \u2022 8\u201310 reps", "fields": [["reps", "Reps (per leg)", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=reverse+lunge+split+squat", "images": "https://www.google.com/search?tbm=isch&q=reverse+lunge+split+squat"}, {"name": "Glute Bridges", "slug": "glute-bridges", "meta": "3 sets \u2022 12\u201320 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=glute+bridge", "images": "https://www.google.com/search?tbm=isch&q=glute+bridge"}, {"name": "Bodyweight Glute Bridge Burnout", "slug": "bodyweight-glute-bridge", "meta": "2 sets \u2022 near failure", "fields": [["reps", "Reps", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=bodyweight+glute+bridge", "images": "https://www.google.com/search?tbm=isch&q=bodyweight+glute+bridge"}, {"name": "Sprints", "slug": "sprints", "meta": "30 sec on / 90 sec off \u00d7 5", "fields": [["reps", "Intervals completed", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=treadmill+sprint+interval+workout", "images": "https://www.google.com/search?tbm=isch&q=treadmill+sprint+workout"}]}, "friday": {"label": "Upper Pull + Shoulders & Triceps", "subtitle": "Back, biceps, shoulders, and triceps accessory work", "card_title": "Friday: Upper Pull + Shoulders/Triceps", "card_note": "Back, Biceps & Shoulders", "exercises": [{"name": "Dead Hang", "slug": "dead-hang", "meta": "30 seconds", "fields": [["time", "Time (sec)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dead+hang+exercise", "images": "https://www.google.com/search?tbm=isch&q=dead+hang"}, {"name": "Assisted Pull-Up Machine", "slug": "assisted-pull-up-machine", "meta": "3 sets \u2022 5\u20138 reps", "fields": [["reps", "Reps", "number"], ["weight", "Assistance (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=assisted+pull+up+machine", "images": "https://www.google.com/search?tbm=isch&q=assisted+pull+up+machine"}, {"name": "Scapular Pull-Up", "slug": "scapular-pull-up", "meta": "2\u20133 sets \u2022 6\u201310 reps", "fields": [["reps", "Reps", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=scapular+pull+up", "images": "https://www.google.com/search?tbm=isch&q=scapular+pull+up"}, {"name": "Seated Cable Row", "slug": "seated-cable-row", "meta": "3 sets \u2022 8\u201312 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=seated+cable+row", "images": "https://www.google.com/search?tbm=isch&q=seated+cable+row"}, {"name": "Single Arm Dumbbell Row", "slug": "single-arm-dumbbell-row", "meta": "3 sets/arm \u2022 10\u201312 reps", "fields": [["reps", "Reps (per arm)", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=single+arm+dumbbell+row", "images": "https://www.google.com/search?tbm=isch&q=single+arm+dumbbell+row"}, {"name": "Dumbbell Shoulder Press", "slug": "dumbbell-shoulder-press", "meta": "3 sets \u2022 8\u201310 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dumbbell+shoulder+press", "images": "https://www.google.com/search?tbm=isch&q=dumbbell+shoulder+press"}, {"name": "Lateral Raise", "slug": "lateral-raise", "meta": "3 sets \u2022 12\u201318 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=lateral+raise+exercise", "images": "https://www.google.com/search?tbm=isch&q=lateral+raise"}, {"name": "Hammer Curl", "slug": "hammer-curl", "meta": "3 sets \u2022 10\u201314 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=hammer+curls", "images": "https://www.google.com/search?tbm=isch&q=hammer+curl"}, {"name": "Overhead Triceps Extension", "slug": "overhead-triceps-extension", "meta": "3 sets \u2022 10\u201315 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=overhead+tricep+extension", "images": "https://www.google.com/search?tbm=isch&q=overhead+triceps+extension"}]}, "saturday": {"label": "Sprints & Core", "subtitle": "Conditioning and trunk work", "card_title": "Saturday: Sprints & Core", "card_note": "Conditioning & Core", "exercises": [{"name": "Dead Hang", "slug": "dead-hang", "meta": "30 seconds", "fields": [["time", "Time (sec)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dead+hang+exercise", "images": "https://www.google.com/search?tbm=isch&q=dead+hang+exercise"}, {"name": "Sprints", "slug": "sprints", "meta": "30 sec on / 90 sec off \u00d7 5\u20136", "fields": [["reps", "Intervals completed", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=treadmill+sprint+interval+workout", "images": "https://www.google.com/search?tbm=isch&q=treadmill+sprint+workout"}, {"name": "Plank Variations", "slug": "planks", "meta": "3 rounds", "fields": [["time", "Time (sec)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=plank+variations", "images": "https://www.google.com/search?tbm=isch&q=plank+variations"}, {"name": "Hanging Knee Raise", "slug": "hanging-knee-raise", "meta": "3 sets \u2022 10\u201315 reps", "fields": [["reps", "Reps", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=hanging+knee+raise", "images": "https://www.google.com/search?tbm=isch&q=hanging+knee+raise"}, {"name": "Cable Crunch or Reverse Crunch", "slug": "cable-crunch", "meta": "3 sets \u2022 12\u201320 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=cable+crunch+exercise", "images": "https://www.google.com/search?tbm=isch&q=cable+crunch"}]}, "sunday": {"label": "Rest Day", "subtitle": "Recovery matters", "card_title": "Sunday: Rest", "card_note": "Full rest day", "exercises": [{"name": "Gentle Walk", "slug": "gentle-walk", "meta": "Optional \u2022 10\u201330 minutes", "fields": [["time", "Duration (min)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=benefits+of+walking", "images": "https://www.google.com/search?tbm=isch&q=walking+exercise"}, {"name": "Stretching & Mobility", "slug": "stretching", "meta": "Optional \u2022 10\u201320 minutes", "fields": [["time", "Duration (min)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=full+body+stretch+routine", "images": "https://www.google.com/search?tbm=isch&q=stretching+routine"}]}, "shoulders-triceps": {"label": "Shoulders & Triceps", "subtitle": "Focused upper-body session for a clean swap day", "card_title": "Shoulders & Triceps", "card_note": "Focused upper-body session", "exercises": [{"name": "Dead Hang", "slug": "dead-hang", "meta": "30 seconds", "fields": [["time", "Time (sec)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dead+hang", "images": "https://www.google.com/search?tbm=isch&q=dead+hang"}, {"name": "Dumbbell Shoulder Press", "slug": "dumbbell-shoulder-press", "meta": "3 sets \u2022 8\u201310 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=dumbbell+shoulder+press", "images": "https://www.google.com/search?tbm=isch&q=dumbbell+shoulder+press"}, {"name": "Lateral Raise", "slug": "lateral-raise", "meta": "3 sets \u2022 12\u201318 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=lateral+raise+exercise", "images": "https://www.google.com/search?tbm=isch&q=lateral+raise"}, {"name": "Rear Delt Fly", "slug": "rear-delt-fly", "meta": "3 sets \u2022 12\u201318 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=rear+delt+fly", "images": "https://www.google.com/search?tbm=isch&q=rear+delt+fly"}, {"name": "Triceps Pushdown", "slug": "triceps-pushdown", "meta": "3 sets \u2022 10\u201315 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=triceps+pushdown", "images": "https://www.google.com/search?tbm=isch&q=triceps+pushdown"}, {"name": "Overhead Triceps Extension", "slug": "overhead-triceps-extension", "meta": "3 sets \u2022 10\u201315 reps", "fields": [["reps", "Reps", "number"], ["weight", "Weight (lbs)", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=overhead+tricep+extension", "images": "https://www.google.com/search?tbm=isch&q=overhead+triceps+extension"}, {"name": "Close-Grip Push-Up", "slug": "close-grip-push-up", "meta": "2\u20133 sets \u2022 near failure", "fields": [["reps", "Reps", "number"], ["energy", "Energy (1\u201310)", "number"], ["effort", "Effort (1\u201310)", "number"]], "video": "https://www.youtube.com/results?search_query=close+grip+push+up", "images": "https://www.google.com/search?tbm=isch&q=close+grip+push+up"}]}};

function getAssignments() {
  try {
    return JSON.parse(localStorage.getItem(ASSIGN_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function saveAssignments(assignments) {
  localStorage.setItem(ASSIGN_KEY, JSON.stringify(assignments));
}

function getActiveWorkoutForDay(daySlot) {
  const assignments = getAssignments();
  return assignments[daySlot] || daySlot;
}

function storageKey(daySlot, workoutSlot, exerciseSlug, field) {
  return `${STORAGE_PREFIX}${daySlot}__${workoutSlot}__${exerciseSlug}__${field}`;
}

function toShortsSearchUrl(videoUrl) {
  try {
    const u = new URL(videoUrl);
    const q = u.searchParams.get("search_query") || "";
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=EgIYAQ%253D%253D`;
  } catch (e) {
    return videoUrl;
  }
}

function buildExerciseHtml(ex) {
  const fields = ex.fields.map(function(fieldDef) {
    const field = fieldDef[0];
    const label = fieldDef[1];
    const type = fieldDef[2];
    let extraAttr = "";
    if (field === "energy") extraAttr = ' data-type="energy"';
    if (field === "effort") extraAttr = ' data-type="effort"';
    return `<label>${label}: <input type="${type}" data-field="${field}" data-exercise="${ex.slug}"${extraAttr}></label>`;
  }).join("");

  return `
    <div class="exercise">
      <h4>${ex.name}</h4>
      <div class="exercise-meta">${ex.meta}</div>
      <div class="fields">
        <label><input type="checkbox" data-field="complete" data-exercise="${ex.slug}"> Completed</label>
        ${fields}
      </div>
      <a href="${ex.video}" target="_blank" rel="noopener">🎥 Video</a>
      <a href="${toShortsSearchUrl(ex.video)}" target="_blank" rel="noopener">📱 Shorts</a>
      <a href="${ex.images}" target="_blank" rel="noopener">🖼️ Images</a>
    </div>
  `;
}

function restoreExerciseValues(daySlot, workoutSlot) {
  const container = document.getElementById("workout-container");
  if (!container) return;

  container.querySelectorAll("input").forEach(function(input) {
    const exerciseSlug = input.getAttribute("data-exercise");
    const field = input.getAttribute("data-field");
    const key = storageKey(daySlot, workoutSlot, exerciseSlug, field);
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      if (input.type === "checkbox") input.checked = stored === "true";
      else input.value = stored;
    }
    input.addEventListener("change", function() {
      localStorage.setItem(key, input.type === "checkbox" ? String(input.checked) : input.value);
      updateSummary(daySlot);
    });
  });
}

function renderWorkout(daySlot) {
  const activeSlot = getActiveWorkoutForDay(daySlot);
  const workout = WORKOUTS[activeSlot];
  const subtitle = document.getElementById("workout-subtitle");
  const activeLabel = document.getElementById("active-workout-label");
  const container = document.getElementById("workout-container");
  if (!workout || !container) return;

  if (subtitle) subtitle.textContent = workout.subtitle;
  if (activeLabel) activeLabel.textContent = `Currently showing: ${workout.label}`;
  container.innerHTML = workout.exercises.map(buildExerciseHtml).join("");

  const select = document.getElementById("swap-select");
  if (select) select.value = activeSlot;

  restoreExerciseValues(daySlot, activeSlot);
  updateSummary(daySlot);
}

function updateSummary(daySlot) {
  const activeSlot = getActiveWorkoutForDay(daySlot);
  const workout = WORKOUTS[activeSlot];
  const summaryEl = document.getElementById("daily-summary");
  if (!summaryEl || !workout) return;

  let completed = 0;
  let energySum = 0;
  let energyCount = 0;
  let effortSum = 0;
  let effortCount = 0;

  workout.exercises.forEach(function(ex) {
    if (localStorage.getItem(storageKey(daySlot, activeSlot, ex.slug, "complete")) === "true") completed += 1;
    ["energy", "effort"].forEach(function(field) {
      const raw = localStorage.getItem(storageKey(daySlot, activeSlot, ex.slug, field));
      const val = parseFloat(raw);
      if (!isNaN(val)) {
        if (field === "energy") {
          energySum += val;
          energyCount += 1;
        } else {
          effortSum += val;
          effortCount += 1;
        }
      }
    });
  });

  const energyAvg = energyCount ? (energySum / energyCount).toFixed(1) : "N/A";
  const effortAvg = effortCount ? (effortSum / effortCount).toFixed(1) : "N/A";
  summaryEl.innerHTML = `
    <div class="summary-box"><strong>Completed</strong><div>${completed} / ${workout.exercises.length}</div></div>
    <div class="summary-box"><strong>Avg effort</strong><div>${effortAvg}</div></div>
    <div class="summary-box"><strong>Avg energy</strong><div>${energyAvg}</div></div>
  `;
}

function saveDayChoice(daySlot) {
  const select = document.getElementById("swap-select");
  if (!select) return;
  const chosen = select.value || daySlot;
  const assignments = getAssignments();
  if (chosen === daySlot) delete assignments[daySlot];
  else assignments[daySlot] = chosen;
  saveAssignments(assignments);
  renderWorkout(daySlot);
  updateHomeCards();
}

function clearSavedChoice(daySlot) {
  const assignments = getAssignments();
  delete assignments[daySlot];
  saveAssignments(assignments);
  renderWorkout(daySlot);
  updateHomeCards();
}

function openSelectedWorkout() {
  const select = document.getElementById("swap-select");
  if (!select || !select.value) return;
  window.location.href = select.value + ".html";
}

function populateSwapSelect(daySlot) {
  const select = document.getElementById("swap-select");
  if (!select) return;
  const order = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday","shoulders-triceps"];
  select.innerHTML = order.map(function(slot) {
    return `<option value="${slot}">${WORKOUTS[slot].label}</option>`;
  }).join("");
  select.value = getActiveWorkoutForDay(daySlot);
}

function updateHomeCards() {
  const cards = document.querySelectorAll("[data-slot-card]");
  if (!cards.length) return;
  const assignments = getAssignments();
  cards.forEach(function(card) {
    const daySlot = card.getAttribute("data-slot-card");
    const activeSlot = assignments[daySlot] || daySlot;
    const active = WORKOUTS[activeSlot];
    const titleEl = card.querySelector("[data-slot-label]");
    const noteEl = card.querySelector("[data-slot-note]");
    const linkEl = card.querySelector("[data-slot-open]");
    if (!titleEl || !noteEl || !linkEl || !active) return;

    titleEl.textContent = daySlot.charAt(0).toUpperCase() + daySlot.slice(1) + ": " + active.label;
    noteEl.textContent = active.subtitle;
    linkEl.href = daySlot + ".html";

    if (activeSlot !== daySlot) card.classList.add("card-swapped");
    else card.classList.remove("card-swapped");
  });
}

function initialiseDayPage() {
  const daySlot = document.body.getAttribute("data-day-slot");
  if (!daySlot) return;
  populateSwapSelect(daySlot);
  renderWorkout(daySlot);

  const saveBtn = document.getElementById("save-choice-btn");
  const openBtn = document.getElementById("open-selection-btn");
  const clearBtn = document.getElementById("clear-choice-btn");
  if (saveBtn) saveBtn.addEventListener("click", function() { saveDayChoice(daySlot); });
  if (openBtn) openBtn.addEventListener("click", openSelectedWorkout);
  if (clearBtn) clearBtn.addEventListener("click", function() { clearSavedChoice(daySlot); });
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
    recommendation = "Recovery & Mobility";
    page = "wednesday.html";
    note = "Low energy or feeling sick: recovery wins today.";
  } else if (last.includes("Lower") || last.includes("Glute")) {
    recommendation = fresh === "upper" ? "Upper Push + Pull-Up Work" : "Upper Pull + Shoulders & Triceps";
    page = fresh === "upper" ? "tuesday.html" : "friday.html";
    note = "You recently hit lower body, so use your fresher upper body.";
  } else if (last.includes("Upper") || last.includes("Shoulder")) {
    recommendation = fresh === "lower" ? "Lower Body A + Sprint" : "Lower Body B + Sprint";
    page = fresh === "lower" ? "monday.html" : "thursday.html";
    note = "Shift to lower body to keep the week balanced.";
  } else {
    recommendation = "Featured Workout";
    page = "featured.html";
    note = "Plug in a featured workout if your week went sideways.";
  }

  resultContainer.innerHTML = `<p><strong>Recommended workout:</strong> ${recommendation}</p><p>${note}</p><p><a href="${page}">Open workout</a></p>`;
  resultContainer.style.display = "block";
}

function initialiseStorage() {
  updateHomeCards();
  initialiseDayPage();
}

document.addEventListener("DOMContentLoaded", initialiseStorage);
