/* pages.js — motion for the service, area and case-study pages (13 Sep 2026).
   Content is never hidden without a way back: reveals are class-based, gated on html.js, and a 2.5 s failsafe shows everything. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = [].slice.call(document.querySelectorAll('.cfp .reveal, .cfp-routes, [data-count]'));
  function show(el) {
    el.classList.add('is-visible');
    if (el.hasAttribute('data-count') && !el.dataset.done) count(el);
  }
  function count(el) {
    el.dataset.done = '1';
    var final = el.textContent.trim(), m = final.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
    if (!m || reduce) return;
    var target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].indexOf(',') > -1, t0 = null;
    if (target < 10 && dec === 0) return;
    function fmt(v) { var s = v.toFixed(dec); if (comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return m[1] + s + m[3]; }
    function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1400), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(target * e); if (p < 1) requestAnimationFrame(step); else el.textContent = final; }
    requestAnimationFrame(step);
  }
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(show); }
  else {
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } }); }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < window.innerHeight) show(el); }); }, 2500);
  }
  // hero videos: small file on phones, pause when off screen, never on reduced motion or Save-Data
  var saveData = navigator.connection && navigator.connection.saveData;
  [].slice.call(document.querySelectorAll('video[data-lg]')).forEach(function (v) {
    if (reduce || saveData) { v.removeAttribute('autoplay'); return; }
    v.src = window.innerWidth < 900 ? v.dataset.sm : v.dataset.lg;
    v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {});
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { var q = v.play(); if (q && q.catch) q.catch(function () {}); } else v.pause(); }); }).observe(v);
  });
})();
