/* Conversion Forge chat widget — one self-contained script. Embed with:
     <script src="https://conversionforge.co.uk/cf-chat-widget.js" defer></script>
   Talks to the Cloudflare Worker. No dependencies. Brand: teal #4DD9D5 / charcoal #1a1a1a. */
(function () {
  'use strict';
  var ENDPOINT = 'https://cf-chatbot.tmogorosi-mgmt.workers.dev/chat';
  var EVENT = 'https://cf-chatbot.tmogorosi-mgmt.workers.dev/event';
  // ACE: one anonymous id per page load, so the bot can learn which conversations convert.
  var SESSION = 's' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  function aceEvent(type) { try { fetch(EVENT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session: SESSION, type: type }), keepalive: true }); } catch (e) {} }
  var AUDIT = 'https://conversionforge.co.uk/free-audit';
  var WHATSAPP = 'https://wa.me/447881664892?text=Hi%20Conversion%20Forge%2C%20I%27d%20like%20to%20talk%20about%20a%20project.';
  var GREETING = "Hi, I'm the Conversion Forge assistant. What's your business, and what do you want more of online?";
  var CHIPS = [
    { label: 'Get my free website audit', send: 'I would like a free website audit.' },
    { label: 'I want a bigger / bespoke project', send: 'I want something bigger than a starter site. What can you build?' },
    { label: 'Talk to a human', href: WHATSAPP },
  ];

  var TEAL = '#4DD9D5', INK = '#1a1a1a';
  var css = '\
  .cfw-btn{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:60px;height:60px;border-radius:50%;\
    background:' + INK + ';color:' + TEAL + ';border:none;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.28);\
    display:flex;align-items:center;justify-content:center;transition:transform .15s}\
  .cfw-btn:hover{transform:scale(1.06)}\
  .cfw-panel{position:fixed;right:20px;bottom:92px;z-index:2147483000;width:370px;max-width:calc(100vw - 32px);\
    height:560px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;overflow:hidden;display:none;\
    flex-direction:column;box-shadow:0 16px 48px rgba(0,0,0,.32);font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}\
  .cfw-open .cfw-panel{display:flex}\
  .cfw-head{background:' + INK + ';color:#fff;padding:16px 18px;display:flex;align-items:center;gap:10px}\
  .cfw-head svg{flex:0 0 auto}\
  .cfw-head b{font-size:15px;display:block;line-height:1.2}\
  .cfw-head span{font-size:12px;color:' + TEAL + '}\
  .cfw-x{margin-left:auto;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;opacity:.8;line-height:1}\
  .cfw-body{flex:1;overflow-y:auto;padding:16px;background:#f6f7f8}\
  .cfw-msg{max-width:84%;padding:10px 13px;border-radius:14px;margin:0 0 10px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}\
  .cfw-bot{background:#fff;color:' + INK + ';border:1px solid #e6e8ea;border-bottom-left-radius:4px}\
  .cfw-me{background:' + TEAL + ';color:' + INK + ';margin-left:auto;border-bottom-right-radius:4px}\
  .cfw-chips{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 12px}\
  .cfw-chip{border:1px solid ' + TEAL + ';color:#0b6b68;background:#fff;border-radius:999px;padding:7px 12px;font-size:13px;cursor:pointer}\
  .cfw-chip:hover{background:#eafbfb}\
  .cfw-foot{border-top:1px solid #e6e8ea;padding:10px;display:flex;gap:8px;background:#fff;align-items:flex-end}\
  .cfw-in{flex:1;border:1px solid #d6d9dc;border-radius:10px;padding:10px 12px;font-size:14px;resize:none;max-height:90px;font-family:inherit;outline:none}\
  .cfw-in:focus{border-color:' + TEAL + '}\
  .cfw-send{background:' + INK + ';color:' + TEAL + ';border:none;border-radius:10px;padding:0 14px;height:40px;cursor:pointer;font-size:14px;font-weight:600}\
  .cfw-note{font-size:11px;color:#8a9097;text-align:center;padding:0 12px 9px;background:#fff}\
  .cfw-note a{color:#6b7178}\
  .cfw-typing{font-size:13px;color:#8a9097;margin-bottom:10px}\
  .cfw-badge{position:absolute;top:-3px;right:-3px;min-width:20px;height:20px;border-radius:10px;background:#ff4d4f;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 5px;box-shadow:0 1px 5px rgba(0,0,0,.35)}\
  .cfw-teaser{position:fixed;right:20px;bottom:92px;z-index:2147483000;max-width:min(264px,calc(100vw - 40px));background:#fff;color:#1a1a1a;border-radius:14px;border-bottom-right-radius:5px;padding:12px 26px 12px 14px;box-shadow:0 12px 34px rgba(0,0,0,.22);font-size:14px;line-height:1.45;display:none;cursor:pointer}\
  .cfw-teaser.cfw-show{display:block;animation:cfwpop .5s cubic-bezier(.16,1,.3,1)}\
  .cfw-teaser b{display:block;font-size:11.5px;letter-spacing:.02em;color:#0b6b68;margin-bottom:3px}\
  .cfw-tx{position:absolute;top:5px;right:9px;color:#a3a8ad;font-size:17px;line-height:1;cursor:pointer}\
  @keyframes cfwpop{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}\
  @keyframes cfwbounce{0%,100%{transform:translateY(0)}28%{transform:translateY(-5px)}55%{transform:translateY(0)}80%{transform:translateY(-2px)}}\
  .cfw-btn.cfw-bounce{animation:cfwbounce 1.3s ease 1}\
  ';

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // turn bare urls + our links into clickable, safely
  function linkify(s) {
    return esc(s).replace(/(https?:\/\/[^\s]+)/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener" style="color:#0b6b68">' + u + '</a>'; })
      .replace(/conversionforge\.co\.uk\/free-audit/g, '<a href="' + AUDIT + '" target="_blank" rel="noopener" style="color:#0b6b68">conversionforge.co.uk/free-audit</a>');
  }

  var history = [];

  function boot() {
    var style = el('style'); style.textContent = css; document.head.appendChild(style);
    var root = el('div', 'cfw'); document.body.appendChild(root);

    var logo = '<svg width="22" height="22" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="' + TEAL + '"/><path d="M8 22L13 10L16 17L19 13L24 22H8Z" fill="' + INK + '"/></svg>';
    var btn = el('button', 'cfw-btn'); btn.setAttribute('aria-label', 'Chat with Conversion Forge');
    // The actual Conversion Forge logo mark (teal mountain), framed for presence.
    btn.innerHTML = '<svg width="32" height="22" viewBox="6 9 20 14" fill="currentColor" aria-hidden="true"><path d="M8 22L13 10L16 17L19 13L24 22H8Z"/></svg>';
    var badge = el('div', 'cfw-badge', '1'); btn.appendChild(badge);
    root.appendChild(btn);

    var panel = el('div', 'cfw-panel');
    panel.innerHTML =
      '<div class="cfw-head">' + logo + '<div><b>Conversion Forge</b><span>Usually replies instantly</span></div><button class="cfw-x" aria-label="Close">&times;</button></div>' +
      '<div class="cfw-body"></div>' +
      '<div class="cfw-note">An assistant, not a person. For anything specific we will confirm. See our <a href="https://conversionforge.co.uk/privacy.html" target="_blank" rel="noopener">privacy notice</a>.</div>' +
      '<div class="cfw-foot"><textarea class="cfw-in" rows="1" placeholder="Type your message..."></textarea><button class="cfw-send">Send</button></div>';
    root.appendChild(panel);

    var body = panel.querySelector('.cfw-body');
    var input = panel.querySelector('.cfw-in');
    var sendBtn = panel.querySelector('.cfw-send');

    function scroll() { body.scrollTop = body.scrollHeight; }
    // ACE: a click on an audit / WhatsApp link inside a reply is a conversion signal.
    body.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (a && a.href) { if (a.href.indexOf('free-audit') > -1) aceEvent('link_audit'); else if (a.href.indexOf('wa.me') > -1) aceEvent('link_whatsapp'); }
    });
    function addBot(text) { var m = el('div', 'cfw-msg cfw-bot'); m.innerHTML = linkify(text); body.appendChild(m); scroll(); }
    function addMe(text) { var m = el('div', 'cfw-msg cfw-me', esc(text)); body.appendChild(m); scroll(); }

    function addChips() {
      var wrap = el('div', 'cfw-chips');
      CHIPS.forEach(function (c) {
        var chip = el('button', 'cfw-chip', c.label);
        chip.onclick = function () {
          if (c.href) { aceEvent('chip_human'); window.open(c.href, '_blank', 'noopener'); return; }
          wrap.remove(); send(c.send);
        };
        wrap.appendChild(chip);
      });
      body.appendChild(wrap); scroll();
    }

    var busy = false;
    function send(text) {
      text = (text || input.value).trim(); if (!text || busy) return;
      input.value = ''; input.style.height = 'auto'; addMe(text);
      history.push({ role: 'user', content: text });
      busy = true; sendBtn.disabled = true;
      var typing = el('div', 'cfw-typing', 'Conversion Forge is typing...'); body.appendChild(typing); scroll();
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history, session: SESSION }) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          typing.remove();
          var reply = (d && d.reply) || "Sorry, something went wrong. You can book a free audit at " + AUDIT + " or message us on WhatsApp.";
          addBot(reply); history.push({ role: 'assistant', content: reply });
        })
        .catch(function () { typing.remove(); addBot("I could not reach our system just now. Please book a free audit at " + AUDIT + " or message us on WhatsApp."); })
        .finally(function () { busy = false; sendBtn.disabled = false; input.focus(); });
    }

    function open() { root.classList.add('cfw-open'); hideTeaser(); clearBadge(); if (!body.dataset.init) { body.dataset.init = '1'; addBot(GREETING); addChips(); } input.focus(); }
    function close() { root.classList.remove('cfw-open'); }
    btn.onclick = function () { root.classList.contains('cfw-open') ? close() : open(); };

    // ---- proactive teaser (Grok-guided): context-aware copy, once per session, dismissable, one soft bounce ----
    var path = location.pathname;
    var teaserText = /free-audit/.test(path) ? "Curious what's hiding you on Google? Ask me." :
                     /methodolog/.test(path) ? "Questions on how we work? Ask me." :
                     /cases/.test(path) ? "Want results like these? Ask me." :
                     "Not sure where to start? Ask me.";
    var teaser = el('div', 'cfw-teaser');
    teaser.innerHTML = '<span class="cfw-tx">&times;</span><b>Conversion Forge assistant</b>' + esc(teaserText);
    root.appendChild(teaser);
    function clearBadge() { if (badge) badge.style.display = 'none'; }
    function hideTeaser() { teaser.classList.remove('cfw-show'); }
    teaser.onclick = function (e) { if (e.target && e.target.className === 'cfw-tx') { hideTeaser(); clearBadge(); e.stopPropagation(); return; } hideTeaser(); open(); };
    try {
      if (!sessionStorage.getItem('cfw_teased')) {
        setTimeout(function () {
          if (!root.classList.contains('cfw-open')) { teaser.classList.add('cfw-show'); btn.classList.add('cfw-bounce'); }
          try { sessionStorage.setItem('cfw_teased', '1'); } catch (e) {}
        }, 7000);
      } else { clearBadge(); }
    } catch (e) {}
    panel.querySelector('.cfw-x').onclick = close;
    sendBtn.onclick = function () { send(); };
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    input.addEventListener('input', function () { input.style.height = 'auto'; input.style.height = Math.min(90, input.scrollHeight) + 'px'; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
