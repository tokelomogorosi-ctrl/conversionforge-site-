/* waves.js — switches on the meters, step lines, hour bars and pop-in cards when they come into view (25 Nov 2026).
   pages.js already handles .reveal and the count-up numbers; this adds the rest. Nothing is hidden without a way back:
   a 2.5 s failsafe switches everything on, and reduced motion switches everything on at once. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = [].slice.call(document.querySelectorAll('.wv-meter, .wv-steps, .wv-prices, .wv-pop'));
  function on(el) { el.classList.add(el.classList.contains('wv-pop') ? 'is-visible' : 'is-on'); }
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(on); return; }
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { on(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
  setTimeout(function () { els.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) on(el); }); }, 2500);
  // the hero stack leans a little towards the pointer on desktop
  var stack = document.querySelector('.wv-stack');
  if (stack && window.matchMedia('(hover: hover) and (min-width: 961px)').matches) {
    stack.addEventListener('pointermove', function (ev) {
      var r = stack.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      stack.style.transform = 'perspective(900px) rotateY(' + (x * 6).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg)';
    });
    stack.addEventListener('pointerleave', function () { stack.style.transform = ''; });
    stack.style.transition = 'transform .4s ease-out';
  }
})();
