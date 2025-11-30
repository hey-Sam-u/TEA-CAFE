/* script.js — global interactions: mobile drawer, typewriter, theme toggle, popup handling */
document.addEventListener("DOMContentLoaded", () => {
  // year footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // mobile nav
  const navOpen = document.getElementById("navOpen");
  const navClose = document.getElementById("navClose");
  const mobileDrawer = document.getElementById("mobileDrawer");
  navOpen.addEventListener("click", () => mobileDrawer.classList.add("open"), {
    passive: true,
  });
  navClose.addEventListener(
    "click",
    () => mobileDrawer.classList.remove("open"),
    { passive: true }
  );

  // CTA inside drawer
  document.getElementById("ctaMenu").addEventListener("click", () => {
    window.location.href = "pages/menu.html";
  });

  // typewriter effect
  const tw = document.querySelector(".typewriter");
  if (tw) {
    const txt = tw.dataset.text || "";
    let i = 0;
    const tick = () => {
      tw.textContent = txt.slice(0, i);
      i++;
      if (i <= txt.length) setTimeout(tick, 60);
      else {
        setTimeout(() => {
          i = 0;
          tw.textContent = "";
          setTimeout(tick, 400);
        }, 2000);
      }
    };
    tick();
  }

  // dark/light toggle
  const darkToggle = document.getElementById("darkToggle");
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const icon = darkToggle.querySelector("i");
    if (document.body.classList.contains("light"))
      icon.className = "fa-solid fa-moon";
    else icon.className = "fa-solid fa-sun";
  });

  // global custom popup helper
  const customPopup = document.getElementById("customPopup");
  const popupBody = document.getElementById("popupBody");
  document
    .querySelectorAll(".popup-close")
    .forEach((btn) => btn.addEventListener("click", closePopup));
  function openPopup(html) {
    popupBody.innerHTML = html;
    customPopup.classList.add("show");
    customPopup.setAttribute("aria-hidden", "false");
  }
  function closePopup() {
    customPopup.classList.remove("show");
    customPopup.setAttribute("aria-hidden", "true");
    popupBody.innerHTML = "";
  }
  window.openCustomPopup = openPopup;
  window.closeCustomPopup = closePopup;
});
