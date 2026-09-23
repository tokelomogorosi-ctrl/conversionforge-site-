/* Conversion Forge — analytics consent (14 Sep 2026).
   Google Analytics loads ONLY after the visitor says yes. Until then no Google Analytics script, request or cookie.
   The choice is remembered in this browser's localStorage under "cf-analytics" (not a cookie) and can be changed
   on /privacy.html. Once allowed, it also counts enquiry actions: audit form sent, email, WhatsApp and phone taps. */
(function () {
  var GA = 'G-WH2KGWG5MH', KEY = 'cf-analytics', loaded = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  function choice() { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } }
  function remember(v) { try { window.localStorage.setItem(KEY, v); } catch (e) {} }
  function load() {
    if (loaded) return; loaded = true;
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
    document.head.appendChild(s);
    gtag('js', new Date()); gtag('config', GA);
    var ev = document.querySelector('meta[name="cf-ga-event"]');
    if (ev && ev.content) gtag('event', ev.content, { page_path: location.pathname });
  }
  function track(name) { if (loaded) gtag('event', name, { page_path: location.pathname }); }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('mailto:') === 0) track('contact_email');
    else if (h.indexOf('tel:') === 0) track('contact_phone');
    else if (/wa\.me|whatsapp/i.test(h)) track('contact_whatsapp');
  }, true);
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('fa-form')) track('audit_form_submit');
  }, true);
  function banner() {
    if (document.getElementById('cf-consent')) return;
    var css = '#cf-consent{position:fixed;left:16px;bottom:16px;z-index:2147483000;max-width:320px;background:#1A1A1A;color:#fff;border-radius:12px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,.3);font:14px/1.45 Inter,system-ui,sans-serif}@media(max-width:480px){#cf-consent{right:88px;max-width:none}}'
      + '#cf-consent p{margin:0 0 10px}#cf-consent a{color:#4DD9D5}#cf-consent .row{display:flex;gap:10px;flex-wrap:wrap}'
      + '#cf-consent button{flex:1 1 110px;min-height:44px;border-radius:10px;font:600 14px Inter,system-ui,sans-serif;cursor:pointer}'
      + '#cf-consent .yes{background:#4DD9D5;color:#1A1A1A;border:2px solid #4DD9D5}#cf-consent .no{background:transparent;color:#fff;border:2px solid #9A9A9A}'
      + '#cf-consent button:focus-visible{outline:3px solid #fff;outline-offset:2px}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'cf-consent'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Analytics choice');
    d.innerHTML = '<p>Can I count your visit? Google Analytics only loads if you say yes. <a href="/privacy.html#cookies">Details</a></p>'
      + '<div class="row"><button type="button" class="yes">Yes, count it</button><button type="button" class="no">No thanks</button></div>';
    d.querySelector('.yes').addEventListener('click', function () { remember('granted'); d.remove(); load(); });
    d.querySelector('.no').addEventListener('click', function () { remember('denied'); d.remove(); });
    document.body.appendChild(d);
  }
  window.cfAnalyticsReset = function () { try { window.localStorage.removeItem(KEY); } catch (e) {} ; window.location.reload(); };
  var c = choice();
  if (c === 'granted') load();
  else if (c !== 'denied') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner(); }
})();
