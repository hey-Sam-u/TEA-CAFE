/* menu.js — injects menu items and handles "Add to Order" logic (stores to localStorage) */

const items = [
  {
    id: "m1",
    name: "Masala Chai",
    price: 45,
    desc: "Classic spiced chai",
    img: "../chai-11.png",
    category: "chai",
  },
  {
    id: "m2",
    name: "Ginger Chai",
    price: 50,
    desc: "Zingy ginger warmth",
    img: "../ginger-01.png",
    category: "chai",
  },
  {
    id: "m3",
    name: "Cold Brew",
    price: 120,
    desc: "Slow-steeped cold brew",
    img: "../chai-02.png",
    category: "coffee",
  },
  {
    id: "m4",
    name: "Cappuccino",
    price: 140,
    desc: "Velvety foam & shot",
    img: "../cappu.png",
    category: "coffee",
  },
  {
    id: "m5",
    name: "Latte",
    price: 150,
    desc: "Silky steamed milk",
    img: "../latte.png",
    category: "coffee",
  },
  {
    id: "m6",
    name: "Butter Bun",
    price: 55,
    desc: "Buttery soft bun",
    img: "../bread.png",
    category: "bread",
  },
  {
    id: "m7",
    name: "Almond Croissant",
    price: 80,
    desc: "Nutty flakey delight",
    img: "../almond.png",
    category: "bread",
  },
  {
    id: "m8",
    name: "Veg Sandwich",
    price: 90,
    desc: "Fresh veggies & sauce",
    img: "../sandwich.png",
    category: "snack",
  },
  {
    id: "m9",
    name: "Samosa",
    price: 35,
    desc: "Crisp & spicy",
    img: "../samosa.png",
    category: "snack",
  },
  {
    id: "m10",
    name: "Biscotti",
    price: 40,
    desc: "Perfect with coffee",
    img: "../assets/images/snack-01.jpg",
    category: "snack",
  },
  {
    id: "m11",
    name: "Mineral Water",
    price: 20,
    desc: "500ml bottle",
    img: "../assets/images/water-01.jpg",
    category: "water",
  },
  {
    id: "m12",
    name: "Signature Steam",
    price: 999,
    desc: "Premium mystery cup (chef special)",
    img: "../assets/images/chai-01.jpg",
    category: "special",
  },
];

// render menu
const grid = document.getElementById("menuGrid");
function renderMenu() {
  grid.innerHTML = "";
  items.forEach((it, idx) => {
    const card = document.createElement("article");
    card.className = "menu-item";
    card.innerHTML = `
        <img src="${it.img}" alt="${it.name}" loading="lazy"/>
        <div class="menu-meta">
          <h4>${it.name}</h4>
          <p class="muted">${it.desc}</p>
        </div>
        <div class="menu-actions">
          <div class="price">₹ ${it.price}</div>
          <button class="add-btn" data-id="${it.id}"><i class="fa-solid fa-plus"></i> Add</button>
        </div>
      `;
    grid.appendChild(card);
    // slight stagger animation
    card.style.animationDelay = idx * 60 + "ms";
  });
}
renderMenu();

// add to order storage
function getOrder() {
  try {
    return JSON.parse(localStorage.getItem("ttc_order") || "[]");
  } catch (e) {
    return [];
  }
}
function saveOrder(o) {
  localStorage.setItem("ttc_order", JSON.stringify(o));
}
function updateQuickCount() {
  document.getElementById("quickCount").textContent = getOrder().reduce(
    (s, i) => s + i.qty,
    0
  );
}
updateQuickCount();

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const id = btn.dataset.id;
  const item = items.find((x) => x.id === id);
  if (!item) return;

  // add: if exists increment, else add new with qty 1
  const order = getOrder();
  const found = order.find((x) => x.id === id);
  if (found) found.qty++;
  else order.push({ id: item.id, name: item.name, price: item.price, qty: 1 });

  saveOrder(order);
  updateQuickCount();
  // custom popup feedback
  const popup = document.getElementById("customPopup");
  const body = document.getElementById("popupBody");
  body.innerHTML = `<h3>Added to Order</h3><p>${item.name} • ₹${item.price}</p>`;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 900);
});

// quick order button -> go to order page
document
  .getElementById("quickOrder")
  .addEventListener("click", () => (location.href = "order.html"));
