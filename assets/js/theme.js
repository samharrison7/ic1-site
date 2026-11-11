/*
 * Theme picker: a labelled Dark / Light / Auto dropdown in the navbar, in
 * place of Quarto's icon-only toggle (hidden in styles.css).
 *
 * Dark is the site default (set by listing `dark` first under `theme` in
 * _quarto.yml), so nothing is stored until a visitor picks a theme. Their
 * choice is kept in localStorage ("ic1-color-scheme"), and Quarto's own key
 * ("quarto-color-scheme") is kept in step with it so Quarto's colour-scheme
 * code applies the right stylesheets.
 *
 * Load this in the head without `defer`: it must run before Quarto's script
 * at the top of <body> reads "quarto-color-scheme".
 */
(function () {
  "use strict";

  var KEY = "ic1-color-scheme"; // "dark", "light" or "auto"
  var QUARTO_KEY = "quarto-color-scheme"; // "alternate" (dark) or "default" (light)
  var DEFAULT = "dark";
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function getPref() {
    try {
      var value = window.localStorage.getItem(KEY);
      return /^(dark|light|auto)$/.test(value) ? value : null;
    } catch (e) {
      return null;
    }
  }

  function wantsDark(pref) {
    return pref === "dark" || (pref === "auto" && media.matches);
  }

  // Tell Quarto which scheme to use. With no choice, remove Quarto's key so
  // the site default (dark) applies, even if an older toggle stored one.
  function syncQuarto(pref) {
    try {
      if (pref === null) {
        window.localStorage.removeItem(QUARTO_KEY);
      } else {
        window.localStorage.setItem(QUARTO_KEY, wantsDark(pref) ? "alternate" : "default");
      }
    } catch (e) {}
  }

  function isDark() {
    return document.body.classList.contains("quarto-dark");
  }

  // Switch the page now, using Quarto's toggle, if it doesn't match.
  function apply(pref) {
    if (isDark() !== wantsDark(pref) && window.quartoToggleColorScheme) {
      window.quartoToggleColorScheme();
    }
    syncQuarto(pref);
  }

  // Placed in the navbar's collapsible area: at the right of the bar on wide
  // screens, and inside the menu on small screens.
  function buildPicker() {
    var collapse = document.querySelector("#navbarCollapse");
    if (!collapse) return;

    var wrapper = document.createElement("div");
    wrapper.className = "theme-picker";
    wrapper.innerHTML =
      // No visible label; aria-label names it for screen readers.
      '<select id="theme-select" aria-label="Theme">' +
        '<option value="dark">Dark</option>' +
        '<option value="light">Light</option>' +
        '<option value="auto">Auto</option>' +
      "</select>";

    var select = wrapper.querySelector("select");
    select.value = getPref() || DEFAULT;
    select.addEventListener("change", function () {
      try {
        window.localStorage.setItem(KEY, select.value);
      } catch (e) {}
      apply(select.value);
    });

    collapse.appendChild(wrapper);
  }

  // Runs before Quarto's colour-scheme script.
  syncQuarto(getPref());

  // In Auto, follow the device setting if it changes while the page is open.
  media.addEventListener("change", function () {
    if (getPref() === "auto") apply("auto");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildPicker);
  } else {
    buildPicker();
  }
})();
