// ===== Shared behaviour for all public pages =====
const menuBtn = document.getElementById("menuBtn"), nav = document.getElementById("navlinks");
if (menuBtn) menuBtn.addEventListener("click", () => nav.classList.toggle("open"));

// Highlight current page
const here = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navlinks a.nl").forEach(a => { if (a.getAttribute("href") === here) a.classList.add("active"); });

// Header search → courses page
const sf = document.getElementById("searchForm");
if (sf) sf.addEventListener("submit", e => {
  e.preventDefault();
  const q = sf.querySelector("input").value.trim();
  location.href = "courses.html" + (q ? "?q=" + encodeURIComponent(q) : "");
});

// Big search box on the home page
const hs = document.getElementById("heroSearch");
if (hs) hs.addEventListener("submit", e => {
  e.preventDefault();
  const q = hs.querySelector("input").value.trim();
  location.href = "courses.html" + (q ? "?q=" + encodeURIComponent(q) : "");
});

// Copy buttons
document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
  const t = document.getElementById("toast");
  try { await navigator.clipboard.writeText(b.dataset.copy); if (t) t.textContent = "Email copied."; }
  catch (e) { if (t) t.textContent = "Copy not allowed here. The address is: " + b.dataset.copy; }
}));

const yr = document.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();

// Logged in → show "My learning" instead of Log in / Sign up
(async () => {
  try {
    const { auth } = await import("./firebase.js");
    const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js");
    onAuthStateChanged(auth, u => {
      const el = document.getElementById("authBtns");
      if (u && el) el.innerHTML = '<a class="btn btn-dark btn-sm" href="dashboard.html">My learning</a>';
    });
  } catch (e) { /* keep default buttons */ }
})();
