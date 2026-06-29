/* Conversion Forge mobile nav. The desktop nav hides all links under 768px and there was no
   menu, so Methodology (and the rest) were unreachable on phones. This adds a hamburger that
   opens the full set as a dropdown. Self-contained: inject one <script defer> per page. */
(function () {
  'use strict';
  function init() {
    var nav = document.querySelector('nav');
    var inner = nav && nav.querySelector('.nav-inner');
    var links = inner && inner.querySelector('.nav-links');
    if (!nav || !inner || !links || inner.querySelector('.cf-burger')) return;

    var css = '\
    .cf-burger{display:none;background:none;border:0;cursor:pointer;padding:8px;margin-left:auto;flex-direction:column;gap:5px}\
    .cf-burger span{display:block;width:24px;height:2px;background:#1a1a1a;border-radius:2px;transition:transform .2s,opacity .2s}\
    .cf-burger.cf-on span:nth-child(1){transform:translateY(7px) rotate(45deg)}\
    .cf-burger.cf-on span:nth-child(2){opacity:0}\
    .cf-burger.cf-on span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}\
    @media(max-width:768px){\
      .cf-burger{display:flex}\
      nav .nav-links{display:none !important}\
      nav.cf-nav-open .nav-links{display:flex !important;flex-direction:column;align-items:stretch;gap:0;\
        position:absolute;top:100%;left:0;right:0;background:#fff;box-shadow:0 12px 48px rgba(0,0,0,.12);\
        border-top:1px solid #e8e8e8;padding:6px 0;z-index:1000}\
      nav.cf-nav-open .nav-links a{display:block !important;padding:15px 24px;font-size:1rem;color:#2d2d2d;border-bottom:1px solid #f3f3f3}\
      nav.cf-nav-open .nav-links a:last-child{border-bottom:0}\
      nav.cf-nav-open .nav-links a.btn-nav{margin:10px 24px;text-align:center;border-radius:8px;border-bottom:0}\
    }';
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

    // nav needs a positioning context for the absolute dropdown
    if (getComputedStyle(inner).position === 'static') inner.style.position = 'relative';

    var burger = document.createElement('button');
    burger.className = 'cf-burger';
    burger.setAttribute('aria-label', 'Menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    inner.appendChild(burger);

    function setOpen(open) {
      nav.classList.toggle('cf-nav-open', open);
      burger.classList.toggle('cf-on', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    burger.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!nav.classList.contains('cf-nav-open')); });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
    document.addEventListener('click', function (e) { if (nav.classList.contains('cf-nav-open') && !nav.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
