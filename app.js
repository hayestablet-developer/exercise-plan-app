// app.js — Monikita’s Fitness App

const SUPABASE_URL = "https://pkskbmxjcyfunkxuxrya.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_7J5gBdQDzv_k2vTVVZ1hxw_iEwwzpmo";

let supabaseClient = null;

function showMessage(message, type = "error") {
  const box =
    document.querySelector("#auth-message") ||
    document.querySelector(".auth-message") ||
    document.querySelector("#message");

  if (box) {
    box.textContent = message;
    box.style.display = "block";
  } else {
    alert(message);
  }
}

function initSupabase() {
  if (!window.supabase || !window.supabase.createClient) {
    showMessage("Supabase failed to load.");
    return null;
  }

  return window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}

async function createAccount(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error) {
      showMessage(error.message);
      return;
    }

    showMessage("Account created successfully!", "success");

    console.log(data);
  } catch (err) {
    console.error(err);

    showMessage(
      "Failed to fetch. Check Supabase URL, key, or script loading."
    );
  }
}

async function signIn(email, password) {
  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      showMessage(error.message);
      return;
    }

    localStorage.setItem(
      "monikita-user-email",
      data.user.email
    );

    showMessage("Signed in successfully!", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);

  } catch (err) {
    console.error(err);

    showMessage(
      "Failed to fetch. Check Supabase connection."
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {

  supabaseClient = initSupabase();

  const createForm =
    document.querySelector("#create-account-form");

  const loginForm =
    document.querySelector("#login-form");

  if (createForm) {
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email =
        document.querySelector("#email").value;

      const password =
        document.querySelector("#password").value;

      await createAccount(email, password);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email =
        document.querySelector("#email").value;

      const password =
        document.querySelector("#password").value;

      await signIn(email, password);
    });
  }
});
