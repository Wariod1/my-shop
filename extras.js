// ================= EDIT THIS PART =================
// Fill in what applies to your shop. Anything left as "" is simply not shown.
const INFO = {
  area: "",          // e.g. "Next to Moyale Market, Main Street"
  hours: "",         // e.g. "Mon–Sat: 7:00 am – 9:00 pm\nSun: 8:00 am – 6:00 pm"
  mapsUrl: "",       // paste the share link from Google Maps (shows a "Get directions" button)
  phone: "",         // e.g. "254716290030" (shows a "Call us" button)
  note: "",          // e.g. "M-Pesa deposits and withdrawals available"
  delivery: true,    // true = customers can choose delivery, false = pickup only
  deliveryNote: ""   // e.g. "Free delivery within town for orders above KSh 500"
};
// ================= END OF EDIT PART =================

// This file uses SHOP, PRODUCTS, cart, money and waLink from script.js,
// so index.html must load script.js first and this file second.
(function () {
  const el = id => document.getElementById(id);
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get: k => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // ---------- Shop info section ----------
  const box = el("info");
  const parts = [];
  if (INFO.area) parts.push(`<p><b>Find us</b><br>${esc(INFO.area)}</p>`);
  if (INFO.hours) parts.push(`<p><b>Opening hours</b><br>${esc(INFO.hours).replace(/\n/g, "<br>")}</p>`);
  if (INFO.note) parts.push(`<p>${esc(INFO.note)}</p>`);
  if (INFO.deliveryNote) parts.push(`<p>${esc(INFO.deliveryNote)}</p>`);
  const links = [];
  if (INFO.mapsUrl) links.push(`<a class="btn alt" href="${esc(INFO.mapsUrl)}" target="_blank" rel="noopener">Get directions</a>`);
  if (INFO.phone) links.push(`<a class="btn alt" href="tel:+${esc(INFO.phone)}">Call us</a>`);
  if (links.length) parts.push(`<div class="info-links">${links.join("")}</div>`);
  if (parts.length) { box.querySelector(".wrap").innerHTML = `<h2>Visit the shop</h2>${parts.join("")}`; box.hidden = false; }

  // ---------- Order review box ----------
  const dlg = el("dlg"), nameIn = el("custName"), locIn = el("custLoc"), err = el("dlgErr"), send = el("dlgSend");
  nameIn.value = store.get("shopName");
  locIn.value = store.get("shopLoc");

  const mode = () => (INFO.delivery && dlg.querySelector('input[name="mode"]:checked').value === "Delivery") ? "Delivery" : "Pickup";

  function summary() {
    let total = 0, unpriced = false;
    const items = Object.keys(cart).map(i => {
      const p = PRODUCTS[i], q = cart[i];
      const label = p.unit ? `${p.name} (${p.unit})` : p.name;
      if (p.price == null) { unpriced = true; return { q, label, cost: null }; }
      total += p.price * q;
      return { q, label, cost: p.price * q };
    });
    const totalText = total ? money(total) + (unpriced ? " + items to confirm" : "") : "to be confirmed";
    return { items, totalText };
  }

  function message() {
    const { items, totalText } = summary();
    const lines = items.map(x => `• ${x.q} × ${x.label} – ${x.cost == null ? "price to confirm" : money(x.cost)}`);
    return `Hello ${SHOP.name}, I’d like to order:\n${lines.join("\n")}\nTotal: ${totalText}` +
      `\nName: ${nameIn.value.trim()}` +
      (mode() === "Delivery" ? `\nDelivery to: ${locIn.value.trim()}` : `\nPickup at the shop`);
  }

  function refresh() {
    el("locBox").hidden = mode() !== "Delivery";
    err.hidden = true;
    send.href = waLink(message());
  }

  function open() {
    const { items, totalText } = summary();
    el("dlgItems").innerHTML = items.map(x =>
      `<li><span>${x.q} × ${esc(x.label)}</span><span>${x.cost == null ? "price to confirm" : money(x.cost)}</span></li>`).join("");
    el("dlgTotal").textContent = "Total: " + totalText;
    el("modeBox").hidden = !INFO.delivery;
    refresh();
    dlg.showModal();
  }

  el("waOrder").addEventListener("click", e => { e.preventDefault(); open(); });
  el("dlgClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("input", () => { store.set("shopName", nameIn.value); store.set("shopLoc", locIn.value); refresh(); });
  dlg.addEventListener("change", refresh);

  send.addEventListener("click", e => {
    let problem = "";
    if (!nameIn.value.trim()) problem = "Please enter your name.";
    else if (mode() === "Delivery" && !locIn.value.trim()) problem = "Please enter your delivery location.";
    if (problem) {
      e.preventDefault();
      err.textContent = problem;
      err.hidden = false;
      (nameIn.value.trim() ? locIn : nameIn).focus();
      return;
    }
    send.href = waLink(message());
  });
})();