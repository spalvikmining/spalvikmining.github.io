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

// Logged in → account menu (avatar) instead of Log in / Sign up
export const initials = n => (n || "").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "S";
const escH = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
(async () => {
  try {
    const { auth, db } = await import("./firebase.js");
    const { onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js");
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js");
    onAuthStateChanged(auth, async u => {
      const el = document.getElementById("authBtns");
      if (!u || !el) return;
      let p = {};
      try { p = (await getDoc(doc(db, "users", u.uid))).data() || {}; } catch (e) {}
      const name = p.name || u.displayName || u.email;
      el.className = "acct";
      el.innerHTML = `
        <button class="avatar" id="avBtn" aria-label="Account menu">${escH(initials(name))}</button>
        <div class="acct-menu" id="avMenu">
          <div class="acct-head"><div class="avatar">${escH(initials(name))}</div><div><b>${escH(name)}</b><span>${escH(u.email)}</span></div></div>
          <a href="dashboard.html">My learning</a>
          <a href="dashboard.html#announcements">Announcements</a>
          <a href="dashboard.html#account">Account settings</a>
          ${p.role === "admin" ? '<hr><a href="admin.html">Admin panel</a>' : ""}
          ${p.role === "tutor" ? '<hr><a href="teach.html">Tutor</a>' : ""}
          <hr><button id="logoutBtn">Log out</button>
        </div>`;
      const btn = document.getElementById("avBtn"), menu = document.getElementById("avMenu");
      btn.onclick = e => { e.stopPropagation(); menu.classList.toggle("open"); };
      document.addEventListener("click", e => { if (!el.contains(e.target)) menu.classList.remove("open"); });
      document.getElementById("logoutBtn").onclick = async () => { await signOut(auth); location.href = "index.html"; };
      document.dispatchEvent(new CustomEvent("spalvik:user", { detail: { user: u, profile: p } }));
    });
  } catch (e) { /* keep default buttons */ }
})();
