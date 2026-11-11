// ================= EDIT THIS PART =================
const SHOP = {
  name: "Aiden",
  welcome: "Karibu Everyday goods at fair prices. Pick what you need and send your order on WhatsApp.",
  whatsapp: "254716290030"   // country code + number, no + or spaces
};

// One line per product. Change, delete or add lines freely.
// price: null shows "Ask for price". Replace null with a number, e.g. price: 150
const PRODUCTS = [
  // Flour
  { cat: "Flour", name: "Raha Premium", unit: "2 kg", price: 200, icon: "🌾", image: "images/raha premium.jpg" },
  { cat: "Flour", name: "Ajab Ngano", unit: "1 kg", price: 100, icon: "🌾", image: "images/ajab.jpg" },
  { cat: "Flour", name: "Ajab Ngano", unit: "2 kg", price: 190, icon: "🌾", image: "images/ajab.jpg" },
  { cat: "Flour", name: "Pembe Ugali", unit: "2 kg", price: 85, icon: "🌽", image: "images/pembe-ugali-2kg.jpg" },

  // Drinks
  { cat: "Drinks", name: "Predator", unit: "400ml", price: 70, icon: "🥤", image: "images/predator.jpg" },
  { cat: "Drinks", name: "Embe", unit: "300ml", price: 50, icon: "🥭", image: "images/embe.jpg" },
  { cat: "Drinks", name: "Fanta", unit: "350ml", price: 50, icon: "🥤", image: "images/fanta.jpg" },
  { cat: "Drinks", name: "Coke", unit: "350ml", price: 50, icon: "🥤", image: "images/coke.jpg" },
  { cat: "Drinks", name: "Coke", unit: "1L", price: 100, icon: "🥤", image: "images/coke.jpg" },
  { cat: "Drinks", name: "fanta", unit: "1L", price: 100, icon: "🥤", image: "images/fanta.jpg" },
  { cat: "Drinks", name: "Ice", unit: "", price: 10, icon: "🧊", image: "images/ice.jpg" },
  { cat: "Drinks", name: "Glacier Water", unit: "1.5 litres", price: 50, icon: "💧", image: "images/glacier-1-5l.jpg" },
  { cat: "Drinks", name: "Glacier Water", unit: "5 litres", price: 120, icon: "💧", image: "images/glacier-5l.jpg" },
  { cat: "Drinks", name: "Upclean Water", unit: "500 ml", price: 20, icon: "💧", image: "images/upclean-500ml.jpg" },

  // Snacks and bread
  { cat: "Snacks & bread", name: "Ringoz", unit: "", price: 10, icon: "🍪", image: "images/ringoz.jpg" },
  { cat: "Snacks & bread", name: "Bites", unit: "", price: 10, icon: "🍪", image: "images/bites.jpg" },
  { cat: "Snacks & bread", name: "Princess", unit: "", price: 10, icon: "🍪", image: "images/princess.jpg" },
  { cat: "Snacks & bread", name: "Supaloaf", unit: "bread", price: 65, icon: "🍞", image: "images/supaloaf.jpg" },
  { cat: "Snacks & bread", name: "BB", unit: "bread", price: 65, icon: "🍞", image: "images/bb bread.jpg" },

  // Groceries
  { cat: "Groceries", name: "Salt", unit: "500 g", price: 25, icon: "🧂", image: "images/salt-500g.jpg" },
  { cat: "Groceries", name: "Ketepa Tea Leaves", unit: "50 g", price: 25, icon: "🍵", image: "images/ketepa-50g.jpg" },
  { cat: "Groceries", name: "Ketepa Tea Leaves", unit: "15 g", price: 10, icon: "🍵", image: "images/ketepa-15g.jpg" },

  // Baby and home
  { cat: "Baby & home", name: "Softcare Diapers", unit: "", price: 20, icon: "👶", image: "images/softcare-diapers.jpg" },
  { cat: "Baby & home", name: "Kisskid Diapers", unit: "", price: 15, icon: "👶", image: "images/kisskid-diapers.jpg" },
  { cat: "Baby & home", name: "Tulip Tissue", unit: "", price: 20, icon: "🧻", image: "images/tulip-tissue.jpg" },
  { cat: "Baby & home", name: "Pekee Tissue", unit: "", price: 30, icon: "🧻", image: "images/pekee-tissue.jpg" },

  // Detergents
  { cat: "Detergents", name: "Omo", unit: "", price: 10, icon: "🧺", image: "images/omo.jpg" },
  { cat: "Detergents", name: "Sunlight", unit: "", price: 10, icon: "🧺", image: "images/sunlight.jpg" },
  { cat: "Detergents", name: "Toss", unit: "", price: 10, icon: "🧺", image: "images/toss.jpg" },
  { cat: "Detergents", name: "Ariel", unit: "", price: 10, icon: "🧺", image: "images/ariel.jpg" },

  // Soap
  { cat: "Soap", name: "Classic Soap", unit: "", price: 40, icon: "🧼", image: "images/classic-soap-40.jpg" },
  { cat: "Soap", name: "Classic Soap", unit: "", price: 30, icon: "🧼", image: "images/classic-soap-30.jpg" }
];
// ================= END OF EDIT PART =================


// ---- Helpers ----
const $ = id => document.getElementById(id);
const money = n => "KSh " + n.toLocaleString("en-KE");

// Image file for a product: use p.image if you set it, otherwise
// images/<product-name>.jpg  (e.g. "Maize flour" -> images/maize-flour.jpg)
const imageFor = p =>
  p.image || "images/" + p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".jpg";

const waLink = text =>
  "https://wa.me/" + SHOP.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");

// ---- State ----
const cart = {};          // product index -> quantity
let activeCat = "All";
let query = "";

// ---- Fill in shop name, welcome message, top WhatsApp button ----
document.title = SHOP.name;
$("shopName").textContent = SHOP.name;
$("welcome").textContent = SHOP.welcome;
$("waTop").href = waLink("Hello " + SHOP.name + ", I have a question.");

// ---- Category buttons ----
const cats = ["All", ...new Set(PRODUCTS.map(p => p.cat))];
$("chips").innerHTML = cats
  .map(c => `<button class="chip" aria-pressed="${c === "All"}" data-cat="${c}">${c}</button>`)
  .join("");

$("chips").addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  activeCat = b.dataset.cat;
  document.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b));
  render();
});

// ---- Search ----
$("search").addEventListener("input", e => {
  query = e.target.value.trim().toLowerCase();
  render();
});

// ---- One product card ----
function card(p, i) {
  const q = cart[i] || 0;
  const action = q
    ? `<div class="qty">
         <button data-act="dec" data-i="${i}" aria-label="Remove one ${p.name}">−</button>
         <b>${q}</b>
         <button data-act="inc" data-i="${i}" aria-label="Add one ${p.name}">+</button>
       </div>`
    : `<button class="add" data-act="inc" data-i="${i}">Add to order</button>`;
  return `<div class="card">
            <div class="photo">
              <span class="emoji" aria-hidden="true">${p.icon}</span>
              <img src="${imageFor(p)}" alt="${p.name}" loading="lazy" onerror="this.remove()">
            </div>
            <div class="name">${p.name}</div>
            <div class="unit">${p.unit || "&nbsp;"}</div>
            <div class="price${p.price == null ? " ask" : ""}">${p.price == null ? "Ask for price" : money(p.price)}</div>
            ${action}
          </div>`;
}

// ---- Draw the product list, grouped by category ----
function render() {
  const shown = PRODUCTS
    .map((p, i) => ({ p, i }))
    .filter(({ p }) =>
      (activeCat === "All" || p.cat === activeCat) &&
      (!query || (p.name + " " + p.cat).toLowerCase().includes(query)));

  const byCat = {};
  shown.forEach(x => (byCat[x.p.cat] = byCat[x.p.cat] || []).push(x));

  const html = Object.keys(byCat)
    .map(c => `<section><h2>${c}</h2><div class="grid">${byCat[c].map(x => card(x.p, x.i)).join("")}</div></section>`)
    .join("");

  $("catalog").innerHTML = html || `<p class="empty">No products found. Try another word or category.</p>`;
  updateOrder();
}

// ---- Add / remove items ----
$("catalog").addEventListener("click", e => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const i = +b.dataset.i;
  cart[i] = Math.max(0, (cart[i] || 0) + (b.dataset.act === "inc" ? 1 : -1));
  if (!cart[i]) delete cart[i];
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
});

// ---- Bottom order bar + WhatsApp message ----
function updateOrder() {
  const ids = Object.keys(cart);
  $("order").hidden = !ids.length;
  if (!ids.length) return;

  let total = 0, count = 0, unpriced = false;
  const lines = ids.map(i => {
    const p = PRODUCTS[i], q = cart[i];
    const name = p.unit ? `${p.name} (${p.unit})` : p.name;
    count += q;
    if (p.price == null) { unpriced = true; return `• ${q} × ${name} – price to confirm`; }
    total += p.price * q;
    return `• ${q} × ${name} – ${money(p.price * q)}`;
  });

  $("orderTotal").textContent = total ? money(total) + (unpriced ? " + more" : "") : "Your order";
  $("orderCount").textContent = count + (count === 1 ? " item" : " items");
  $("waOrder").href = waLink(
    `Hello ${SHOP.name}, I’d like to order:\n${lines.join("\n")}${total ? `\nTotal so far: ${money(total)}` : ""}`
  );
}

render();