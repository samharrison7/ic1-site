/*
 * Cookie consent for Google Analytics.
 *
 * Analytics is loaded only after the visitor accepts. The choice is stored in
 * a strictly necessary cookie for six months, and a "Cookie preferences"
 * button in the footer reopens the banner so visitors can change their mind.
 *
 * Configure on the script tag in _quarto.yml:
 *   data-ga-id       GA4 measurement ID (G-...), or
 *   data-gtm-id      Google Tag Manager container ID (GTM-...)
 *   data-policy-url  link to the cookie policy
 * IDs containing "XXXX" are treated as placeholders: the banner works, but
 * nothing is sent to Google.
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var GA_ID = script.getAttribute("data-ga-id") || "";
  var GTM_ID = script.getAttribute("data-gtm-id") || "";
  var POLICY_URL = script.getAttribute("data-policy-url") || "";

  var CHOICE_COOKIE = "ic1_analytics_consent";
  var CHOICE_MAX_AGE = 60 * 60 * 24 * 182; // about six months, in seconds

  var banner = null;
  var opener = null; // footer button that reopened the banner, to return focus to
  var loaded = false;

  function isPlaceholder(id) {
    return !id || id.indexOf("XXXX") !== -1;
  }

  // ---------- Stored choice ----------

  function getChoice() {
    var match = document.cookie.match(new RegExp("(?:^|; )" + CHOICE_COOKIE + "=(granted|denied)"));
    return match ? match[1] : null;
  }

  function setChoice(value) {
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = CHOICE_COOKIE + "=" + value + "; Max-Age=" + CHOICE_MAX_AGE + "; Path=/; SameSite=Lax" + secure;
  }

  // ---------- Analytics ----------

  function loadAnalytics() {
    if (loaded) {
      // Already loaded on this page, then withdrawn and accepted again.
      if (GA_ID) window["ga-disable-" + GA_ID] = false;
      return;
    }
    loaded = true;

    if (GA_ID && !isPlaceholder(GA_ID)) {
      window["ga-disable-" + GA_ID] = false;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      // Keep cookies on this host only, not shared with the rest of ceh.ac.uk.
      window.gtag("config", GA_ID, { cookie_domain: "none" });
      addScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID));
    } else if (GTM_ID && !isPlaceholder(GTM_ID)) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      addScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(GTM_ID));
    } else if (window.console) {
      console.info("Analytics consent granted, but no real GA or GTM ID is set, so nothing was loaded.");
    }
  }

  function addScript(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  // Stop tracking and remove Google Analytics cookies after consent is withdrawn.
  function removeAnalytics() {
    if (GA_ID) window["ga-disable-" + GA_ID] = true;
    document.cookie.split("; ").forEach(function (pair) {
      var name = pair.split("=")[0];
      if (/^_ga($|_)|^_gid$|^_gat/.test(name)) {
        document.cookie = name + "=; Max-Age=0; Path=/";
      }
    });
  }

  // ---------- Banner ----------

  function buildBanner() {
    var el = document.createElement("section");
    el.className = "consent-banner";
    el.setAttribute("aria-label", "Cookie consent");
    el.setAttribute("tabindex", "-1");
    el.hidden = true;

    var policy = POLICY_URL
      ? ' <a href="' + POLICY_URL + '" target="_blank" rel="noopener">Read our cookie policy</a>.'
      : "";

    el.innerHTML =
      '<div class="consent-inner">' +
        '<div class="consent-text">' +
          '<p class="consent-title">Analytics cookies</p>' +
          "<p>We would like to use Google Analytics cookies to understand how people use this site. " +
          "They are only set if you accept." + policy + "</p>" +
        "</div>" +
        '<div class="consent-actions">' +
          '<button type="button" class="consent-btn" data-choice="granted">Accept analytics cookies</button>' +
          '<button type="button" class="consent-btn" data-choice="denied">Reject analytics cookies</button>' +
        "</div>" +
      "</div>";

    el.addEventListener("click", function (event) {
      var button = event.target.closest("[data-choice]");
      if (!button) return;
      var choice = button.getAttribute("data-choice");
      var previous = getChoice();
      setChoice(choice);
      if (choice === "granted") {
        loadAnalytics();
      } else if (previous === "granted" || loaded) {
        removeAnalytics();
      }
      hideBanner();
    });

    document.body.appendChild(el);
    return el;
  }

  function showBanner(moveFocus) {
    if (!banner) banner = buildBanner();
    banner.hidden = false;
    // Leave room so the banner never covers the end of the page.
    document.body.style.paddingBottom = banner.offsetHeight + "px";
    if (moveFocus) banner.focus();
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    document.body.style.paddingBottom = "";
    if (opener) {
      opener.focus();
      opener = null;
    }
  }

  // ---------- Start ----------

  function init() {
    var choice = getChoice();
    if (choice === "granted") {
      loadAnalytics();
    } else if (choice === null) {
      showBanner(false);
    }

    document.addEventListener("click", function (event) {
      var button = event.target.closest(".cookie-preferences");
      if (button) {
        event.preventDefault();
        opener = button;
        showBanner(true);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
