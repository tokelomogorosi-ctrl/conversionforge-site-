/* Forge Lane walk — 23 Sep 2026. Scroll moves the camera down the lane. No libraries.
   Skipped entirely (flat gallery stays) when the visitor prefers reduced motion or 3D is unsupported. */
(function () {
  var root = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!(window.CSS && CSS.supports && CSS.supports('transform-style', 'preserve-3d'))) return;
  var lane = document.getElementById('lane');
  var shops = lane ? lane.querySelectorAll('.shop') : [];
  if (!shops.length) return;
  var end = lane.querySelector('.lane-end');
  var N = shops.length, GAP = 1100, START = 1500;
  root.classList.add('lane-3d');
  lane.style.setProperty('--n', N);

  var ticking = false;
  function frame() {
    ticking = false;
    var r = lane.getBoundingClientRect();
    var span = lane.offsetHeight - window.innerHeight;
    var p = Math.min(1, Math.max(0, -r.top / (span || 1)));
    var narrow = window.innerWidth < 768;
    var cam = p * ((N - 1) * GAP + START + 300);          // how far down the lane we have walked
    lane.style.setProperty('--p', p.toFixed(4));
    lane.style.setProperty('--cam', cam.toFixed(1) + 'px');
    for (var i = 0; i < N; i++) {
      var ahead = i * GAP + START - cam;                   // distance from camera to this shop
      var far = narrow ? 1250 : 3200, fade = narrow ? 300 : 800;  // phones: one shop at a time
      var gone = narrow ? 80 : -150, pass = narrow ? 420 : 250;     // phones clear the passing shop sooner
      var o = ahead < gone ? 0                               // walked past it
            : ahead < pass ? (ahead - gone) / (pass - gone)  // passing by
            : ahead > far ? 0                                // too far to see
            : ahead > far - fade ? (far - ahead) / fade     // emerging from the mist
            : 1;
      o *= Math.min(1, p / 0.06);                            // shops wait until the intro has faded
      shops[i].style.setProperty('--o', o.toFixed(3));
      shops[i].style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      shops[i].inert = o < 0.05;
    }
    if (end) end.classList.toggle('on', p > 0.93);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();
})();
