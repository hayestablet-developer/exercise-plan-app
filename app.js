
const APP_SESSION_KEY='fitnessAuthSession', APP_ACCOUNTS_KEY='fitnessAccounts', LAST_USER_ID_KEY='fitnessLastUserId', NS_PREFIX='fitnessUser:';
const DAY_CONFIG={"monday": {"label": "Lower Body A + Sprint", "subtitle": "Glutes, hamstrings, hinge work, and sprint finishers."}, "tuesday": {"label": "Upper Push", "subtitle": "Chest, shoulders, triceps, plus pull-up progress work."}, "wednesday": {"label": "Recovery & Mobility", "subtitle": "Reset day with gentle movement, mobility, and recovery."}, "thursday": {"label": "Lower Body B + Sprint", "subtitle": "Quads, glutes, and a second sprint session."}, "friday": {"label": "Upper Pull + Shoulders/Triceps", "subtitle": "Back, biceps, shoulders, and triceps accessory work."}, "saturday": {"label": "Sprints & Core", "subtitle": "Conditioning, hanging core, and trunk stability."}, "sunday": {"label": "Rest", "subtitle": "Recovery, optional walking, and mobility only."}};
function normalizeUserId(v){return String(v||'').trim().toLowerCase()}
function getAccounts(){let a={};try{a=JSON.parse(localStorage.getItem(APP_ACCOUNTS_KEY)||'{}')}catch(e){};const m={};Object.keys(a).forEach(k=>{const n=normalizeUserId(k);if(!n)return;const ac=a[k]||{};m[n]={password:ac.password||'',displayUserId:ac.displayUserId||k,createdAt:ac.createdAt||new Date().toISOString()}});if(JSON.stringify(a)!==JSON.stringify(m))localStorage.setItem(APP_ACCOUNTS_KEY,JSON.stringify(m));return m}
function saveAccounts(a){localStorage.setItem(APP_ACCOUNTS_KEY,JSON.stringify(a))}
function getSession(){try{return JSON.parse(sessionStorage.getItem(APP_SESSION_KEY)||'null')}catch(e){return null}}
function setSession(s){sessionStorage.setItem(APP_SESSION_KEY,JSON.stringify(s))}
function clearSession(){sessionStorage.removeItem(APP_SESSION_KEY)}
function isGuestSession(){const s=getSession();return !!s&&s.mode==='guest'}
function rememberLastUserId(v){if(v)localStorage.setItem(LAST_USER_ID_KEY,v)}
function getLastUserId(){return localStorage.getItem(LAST_USER_ID_KEY)||''}
function nsKey(k){const s=getSession();if(!s||s.mode==='guest')return null;const uk=s.userKey||normalizeUserId(s.userId);return NS_PREFIX+uk+':'+k}
function trackedGet(k){const nk=nsKey(k);return nk?localStorage.getItem(nk):null}
function trackedSet(k,v){const nk=nsKey(k);if(nk)localStorage.setItem(nk,v)}
function trackedGetJson(k,f){try{const raw=trackedGet(k);return raw?JSON.parse(raw):f}catch(e){return f}}
function trackedSetJson(k,v){trackedSet(k,JSON.stringify(v))}
function protectedPage(){const f=location.pathname.split('/').pop()||'index.html';return !['login.html','create-account.html'].includes(f)}
function ensureProtectedPage(){if(!protectedPage())return true;if(getSession())return true;const t=encodeURIComponent(location.pathname.split('/').pop()||'index.html');location.href='login.html?next='+t;return false}
function nextUrl(){return new URLSearchParams(location.search).get('next')||'index.html'}
function initAuthPages(){const file=location.pathname.split('/').pop()||'index.html';if(!['login.html','create-account.html'].includes(file))return;const msg=document.getElementById('login-message');const show=(txt,ok)=>{if(!msg)return;msg.textContent=txt||'';msg.className=txt?('login-message '+(ok?'ok':'error')):'login-message'};show('',false);
const loginForm=document.getElementById('login-form'), createForm=document.getElementById('create-account-form'), guestBtn=document.getElementById('guest-login-btn'), loginId=document.getElementById('login-user-id'); if(loginId&&!loginId.value) loginId.value=getLastUserId();
if(createForm) createForm.addEventListener('submit',e=>{e.preventDefault();const raw=(document.getElementById('create-user-id').value||'').trim(), key=normalizeUserId(raw), pw=(document.getElementById('create-password').value||'').trim();if(!key||!pw)return show('Enter a user ID and password.',false);if(pw.length<4)return show('Use a password with at least 4 characters.',false);const accounts=getAccounts();if(accounts[key])return show('That user ID already exists. Try signing in.',false);accounts[key]={password:pw,displayUserId:raw,createdAt:new Date().toISOString()};saveAccounts(accounts);rememberLastUserId(raw);show('Account created. Redirecting to sign in...',true);setTimeout(()=>location.href='login.html?next='+encodeURIComponent(nextUrl()),450)});
if(loginForm) loginForm.addEventListener('submit',e=>{e.preventDefault();const raw=(document.getElementById('login-user-id').value||'').trim(), key=normalizeUserId(raw), pw=(document.getElementById('login-password').value||'').trim();const ac=getAccounts()[key];if(!ac||ac.password!==pw)return show('Wrong user ID or password.',false);const display=ac.displayUserId||raw||key;rememberLastUserId(display);setSession({mode:'user',userId:display,userKey:key,signedInAt:new Date().toISOString()});location.href=nextUrl()});
if(guestBtn) guestBtn.addEventListener('click',()=>{setSession({mode:'guest',userId:'Guest',signedInAt:new Date().toISOString()});location.href=nextUrl()})}
function injectAuthStrip(){if(!protectedPage())return;const header=document.querySelector('header');if(!header||document.getElementById('auth-strip'))return;const s=getSession();const strip=document.createElement('div');strip.id='auth-strip';strip.className='auth-strip';strip.innerHTML=`<div class="auth-copy"><strong>${isGuestSession()?'Guest mode':'Signed in as '+s.userId}</strong><span>${isGuestSession()?'Progress is not being saved in guest mode.':'Workout progress, sets, reps, and energy are saved to this profile.'}</span></div><div class="auth-actions">${isGuestSession()?'<a class="small-btn secondary" href="login.html">Sign in / Create account</a>':'<a class="small-btn secondary" href="account.html">My profile</a>'}<button type="button" id="logout-btn" class="small-btn secondary">Log out</button></div>`;header.insertAdjacentElement('afterend',strip);document.getElementById('logout-btn')?.addEventListener('click',()=>{clearSession();location.href='login.html'})}
function initAccountPage(){if(!location.pathname.endsWith('account.html'))return;const s=getSession();if(!s){location.href='login.html?next=account.html';return}document.getElementById('profile-user-id').textContent=s.userId||'—';document.getElementById('profile-mode').textContent=isGuestSession()?'Guest':'Signed in';const guestNote=document.getElementById('guest-note'), resetForm=document.getElementById('reset-password-form'), msg=document.getElementById('account-message');const show=(txt,ok)=>{msg.textContent=txt||'';msg.className=txt?('login-message '+(ok?'ok':'error')):'login-message'};show('',false);if(isGuestSession()){resetForm.style.display='none';guestNote.style.display='block';return}resetForm.addEventListener('submit',e=>{e.preventDefault();const current=(document.getElementById('current-password').value||'').trim(), next=(document.getElementById('new-password').value||'').trim(), confirm=(document.getElementById('confirm-password').value||'').trim();const accounts=getAccounts(), key=s.userKey||normalizeUserId(s.userId);if(!accounts[key])return show('We could not find your account.',false);if(accounts[key].password!==current)return show('Current password is incorrect.',false);if(next.length<4)return show('Use a new password with at least 4 characters.',false);if(next!==confirm)return show('New password and confirmation do not match.',false);accounts[key].password=next;saveAccounts(accounts);resetForm.reset();show('Password updated.',true)})}
function getAssignments(){return trackedGetJson('dayAssignments',{})}
function saveAssignments(map){trackedSetJson('dayAssignments',map)}
function updateHomeCards(){document.querySelectorAll('[data-slot-card]').forEach(card=>{const slot=card.dataset.slotCard, assigned=getAssignments()[slot]||slot, cfg=DAY_CONFIG[assigned]||DAY_CONFIG[slot];card.querySelector('[data-slot-label]').textContent=slot.charAt(0).toUpperCase()+slot.slice(1)+': '+cfg.label;card.querySelector('[data-slot-note]').textContent=cfg.subtitle})}
function updateSummary(){const summary=document.getElementById('daily-summary');if(!summary)return;const scope=document.getElementById('workout-content')||document, checks=[...scope.querySelectorAll('input[type="checkbox"][data-key]')], done=checks.filter(i=>i.checked).length, energies=[...scope.querySelectorAll('input[data-type="energy"]')].map(i=>parseFloat(i.value)).filter(v=>!Number.isNaN(v)), efforts=[...scope.querySelectorAll('input[data-type="effort"]')].map(i=>parseFloat(i.value)).filter(v=>!Number.isNaN(v)), eavg=energies.length?(energies.reduce((a,b)=>a+b,0)/energies.length).toFixed(1):'N/A', favg=efforts.length?(efforts.reduce((a,b)=>a+b,0)/efforts.length).toFixed(1):'N/A'; summary.innerHTML=`<div class="summary-box"><strong>Completed</strong><div>${done} / ${checks.length}</div></div><div class="summary-box"><strong>Avg energy</strong><div>${eavg}</div></div><div class="summary-box"><strong>Avg effort</strong><div>${favg}</div></div>`}
function syncExerciseLog(input){if(isGuestSession()||!getSession())return;const day=document.body.dataset.daySlot;if(!day)return;const card=input.closest('.exercise');if(!card)return;const exercise=card.querySelector('h4')?.textContent||'Exercise', key=day+'|'+exercise, log=trackedGetJson('exerciseLog',{}), fields={};card.querySelectorAll('input[data-key]').forEach(field=>{if(field.type==='checkbox')return;const label=field.closest('label')?.textContent?.trim()||field.dataset.key;fields[label]=field.value||''});log[key]={updatedAt:new Date().toISOString(),day,exercise,completed:card.querySelector('input[type="checkbox"][data-key]')?.checked||false,fields};trackedSetJson('exerciseLog',log)}
function initInputs(scope=document){scope.querySelectorAll('[data-key]').forEach(input=>{const key=input.dataset.key;if(!isGuestSession()){const stored=trackedGet(key);if(stored!==null){if(input.type==='checkbox') input.checked=stored==='true'; else input.value=stored;}}if(input.dataset.bound)return;input.dataset.bound='1';input.addEventListener('change',()=>{if(!isGuestSession()){if(input.type==='checkbox')trackedSet(key,String(input.checked)); else trackedSet(key,input.value); syncExerciseLog(input)} updateSummary()})});scope.querySelectorAll('.toggle-set4').forEach(btn=>{const target=btn.dataset.target, set4=document.querySelector('[data-optional="'+target+'"]');if(!set4)return;const stored=!isGuestSession()&&trackedGet(target+'__set4')==='true';set4.style.display=stored?'block':'none';btn.textContent=stored?'Hide set 4':'+ Add set 4';if(btn.dataset.bound)return;btn.dataset.bound='1';btn.addEventListener('click',()=>{const current=set4.style.display!=='none', next=!current;set4.style.display=next?'block':'none';btn.textContent=next?'Hide set 4':'+ Add set 4'; if(!isGuestSession()) trackedSet(target+'__set4',String(next))})})}

function renderAssignedWorkout(slot, assigned){
  const target=document.getElementById('workout-content');
  if(!target) return;
  const cfg=DAY_CONFIG[assigned]||DAY_CONFIG[slot];
  const subtitle=document.querySelector('.day-subtitle');
  const note=document.querySelector('.day-top-note');
  if(subtitle) subtitle.textContent=cfg.subtitle;
  if(note) note.textContent='Currently showing: '+cfg.label;
  fetch(assigned + '.html')
    .then(r=>r.text())
    .then(html=>{
      const doc=new DOMParser().parseFromString(html,'text/html');
      const src=doc.getElementById('workout-content');
      if(!src) return;
      target.innerHTML=src.innerHTML;
      initInputs(target);
      updateSummary();
    })
    .catch(()=>{});
}

function initDayPage(){
  const slot=document.body.dataset.daySlot;
  if(!slot) return;
  const select=document.getElementById('swap-select');
  if(select){
    select.innerHTML='<option value="">--Select--</option>'+Object.keys(DAY_CONFIG).map(k=>`<option value="${k}">${k.charAt(0).toUpperCase()+k.slice(1)} / ${DAY_CONFIG[k].label}</option>`).join('');
    const saved=getAssignments()[slot];
    if(saved) {
      select.value=saved;
      if(saved!==slot) renderAssignedWorkout(slot,saved);
    }

    document.getElementById('open-selection-btn')?.addEventListener('click',()=>{
      if(select.value) location.href=select.value+'.html';
    });

    document.getElementById('save-choice-btn')?.addEventListener('click',()=>{
      if(!select.value) return;
      if(isGuestSession()){
        renderAssignedWorkout(slot,select.value);
        return;
      }
      const map=getAssignments();
      map[slot]=select.value;
      saveAssignments(map);
      updateHomeCards();
      renderAssignedWorkout(slot,select.value);
    });

    document.getElementById('clear-choice-btn')?.addEventListener('click',()=>{
      if(isGuestSession()) {
        location.href=slot+'.html';
        return;
      }
      const map=getAssignments();
      delete map[slot];
      saveAssignments(map);
      location.href=slot+'.html';
    });
  }
  updateSummary();
}
function initLibraryPage(){const search=document.getElementById('library-search'); if(!search) return; let filter='all'; const apply=()=>{const q=search.value.trim().toLowerCase(); document.querySelectorAll('.library-group').forEach(group=>{const gid=group.dataset.group; let any=false; group.querySelectorAll('.library-exercise').forEach(item=>{const show=(filter==='all'||filter===gid)&&(!q||item.textContent.toLowerCase().includes(q)); item.style.display=show?'':'none'; if(show) any=true;}); group.style.display=any?'':'none';});}; document.querySelectorAll('.filter-chip').forEach(chip=>chip.addEventListener('click',()=>{document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active')); chip.classList.add('active'); filter=chip.dataset.filter; apply();})); search.addEventListener('input',apply)}
document.addEventListener('DOMContentLoaded',()=>{initAuthPages(); if(!ensureProtectedPage()) return; injectAuthStrip(); initAccountPage(); initInputs(document); initDayPage(); initLibraryPage(); updateHomeCards(); updateSummary();});
