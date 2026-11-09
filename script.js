(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  /* ----- Mobile navigation ----- */
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  links.forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setMenu(false); toggle.focus(); }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 820) setMenu(false);
  });

  /* ----- Active nav indicator (scroll-spy) ----- */
  // Nav order is Home, Projects, About, Contact; page order is Home, About, Projects, Contact.
  var ids = ["home", "about", "projects", "contact"];
  var sections = ids.map(function (id) { return document.getElementById(id); });

  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("data-section") === id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  function onScroll() {
    var probe = window.scrollY + 120;
    var current = "home";
    sections.forEach(function (s, i) {
      if (s && s.offsetTop <= probe) current = ids[i];
    });
    // Sections between About and Projects belong to the previous nav item
    // (skills -> about); education/interests sit between Projects and Contact.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = "contact";
    setActive(current);
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ----- Back to top (moves focus for keyboard users) ----- */
  var top = document.getElementById("backToTop");
  if (top) {
    top.addEventListener("click", function (e) {
      e.preventDefault();
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      var skip = document.querySelector(".brand");
      if (skip) skip.focus({ preventScroll: true });
    });
  }
})();