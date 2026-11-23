// ===== Shared course loading + course card (used by Home and Courses pages) =====
import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

export async function loadPublishedCourses() {
  const snap = await getDocs(query(collection(db, "courses"), where("status", "==", "published")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export const priceText = c => Number(c.price) ? "GHS " + Number(c.price).toFixed(2) : "Free";

export function courseCard(c) {
  const bits = [c.level, c.mode, c.duration].filter(Boolean).map(esc).join(" · ");
  return `
  <a class="ccard" href="contact.html" title="${esc(c.title)}">
    <div class="thumb" style="${c.cover ? `background-image:url('${c.cover}')` : ""}">${c.cover ? "" : '<img src="logo-mark.png" alt="">'}</div>
    <h3>${esc(c.title)}</h3>
    ${c.instructor ? `<div class="by">${esc(c.instructor)}</div>` : ""}
    ${bits ? `<div class="meta">${bits}</div>` : ""}
    <div class="price">${priceText(c)}</div>
    <span class="tag">${esc(c.category)}</span>
  </a>`;
}
