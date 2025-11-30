/* order.js — full client-side order system and fake payment flow */

/* Utility storage functions */
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

/* elements */
const orderList = document.getElementById("orderList");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const tableNo = document.getElementById("tableNo");
const clearBtn = document.getElementById("clearOrder");
const payBtn = document.getElementById("payNow");
const paymentModal = document.getElementById("paymentModal");
const confirmedPopup = document.getElementById("confirmedPopup");
const confirmedBody = document.getElementById("confirmedBody");

let order = getOrder();

function renderOrder() {
  orderList.innerHTML = "";
  if (order.length === 0) {
    orderList.innerHTML = `<div class="muted">Your order is empty. Go to <a href="menu.html">Menu</a> to add items.</div>`;
    updateTotals();
    return;
  }

  order.forEach((it) => {
    const row = document.createElement("div");
    row.className = "order-row";
    row.innerHTML = `
      <div class="meta">
        <h4>${it.name}</h4>
        <div class="muted">₹ ${it.price} • ${it.qty} x</div>
      </div>
      <div class="controls">
        <div class="counter">
          <button class="dec" data-id="${it.id}"><i class="fa-solid fa-minus"></i></button>
          <div class="qty">${it.qty}</div>
          <button class="inc" data-id="${it.id}"><i class="fa-solid fa-plus"></i></button>
        </div>
        <button class="remove-btn" data-id="${it.id}" title="remove"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    orderList.appendChild(row);
  });

  // attach events
  orderList
    .querySelectorAll(".inc")
    .forEach((b) =>
      b.addEventListener("click", (e) =>
        changeQty(e.target.closest("button").dataset.id, 1)
      )
    );
  orderList
    .querySelectorAll(".dec")
    .forEach((b) =>
      b.addEventListener("click", (e) =>
        changeQty(e.target.closest("button").dataset.id, -1)
      )
    );
  orderList
    .querySelectorAll(".remove-btn")
    .forEach((b) =>
      b.addEventListener("click", (e) =>
        removeItem(e.target.closest("button").dataset.id)
      )
    );
  updateTotals();
}

function changeQty(id, delta) {
  const it = order.find((x) => x.id === id);
  if (!it) return;
  it.qty = Math.max(0, it.qty + delta);
  if (it.qty === 0) order = order.filter((x) => x.id !== id);
  saveOrder(order);
  renderOrder();
}

function removeItem(id) {
  order = order.filter((x) => x.id !== id);
  saveOrder(order);
  renderOrder();
}

function updateTotals() {
  const subtotal = order.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  subtotalEl.textContent = `₹${subtotal}`;
  taxEl.textContent = `₹${tax}`;
  totalEl.textContent = `₹${total}`;
}

/* clear order */
clearBtn.addEventListener("click", () => {
  order = [];
  saveOrder(order);
  renderOrder();
});

/* fake payment flow with 3-step modal */
payBtn.addEventListener("click", () => {
  if (order.length === 0) {
    // show custom popup
    confirmedBody.innerHTML = `<h3>No items</h3><p>Please add items before paying.</p>`;
    confirmedPopup.classList.add("show");
    setTimeout(() => confirmedPopup.classList.remove("show"), 1200);
    return;
  }
  openPaymentModal();
});

function openPaymentModal() {
  paymentModal.classList.add("show");
  paymentModal.setAttribute("aria-hidden", "false");
  const steps = Array.from(paymentModal.querySelectorAll(".step"));
  let idx = 0;
  const activate = (i) => {
    steps.forEach((s) => s.classList.remove("active"));
    steps[i].classList.add("active");
  };
  activate(0);

  // step timeline: 1s -> step2 -> 1.4s -> step3 -> finish
  setTimeout(() => {
    activate(1);
  }, 1000);
  setTimeout(() => {
    activate(2);
  }, 2400);
  setTimeout(() => {
    finishPayment();
  }, 3500);

  // allow closing modal manually
  paymentModal
    .querySelector(".modal-close")
    .addEventListener("click", closePaymentModal, { once: true });
}

function closePaymentModal() {
  paymentModal.classList.remove("show");
  paymentModal.setAttribute("aria-hidden", "true");
}

function finishPayment() {
  closePaymentModal();
  // show confirmed popup w/ details
  const subtotal = order.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const table = tableNo.value || "Pickup";
  confirmedBody.innerHTML = `<h3>Order Confirmed</h3>
    <p>Thank you! ${table}</p>
    <p class="muted">Total paid: ₹${total} (incl. tax)</p>
    <div style="margin-top:10px"><strong>Items:</strong>
      <ul style="padding-left:18px;margin:8px 0">${order
        .map((i) => `<li>${i.qty} × ${i.name} — ₹${i.price * i.qty}</li>`)
        .join("")}</ul>
    </div>
  `;
  confirmedPopup.classList.add("show");

  // reset order
  order = [];
  saveOrder(order);
  renderOrder();

  // close popup after 2.5s
  setTimeout(() => confirmedPopup.classList.remove("show"), 2500);
}

/* init render */
renderOrder();

/* small accessibility: close custom popups */
document.querySelectorAll(".popup-close").forEach((b) => {
  b.addEventListener("click", (e) => {
    const parent = e.target.closest(".custom-popup");
    if (parent) parent.classList.remove("show");
  });
});
