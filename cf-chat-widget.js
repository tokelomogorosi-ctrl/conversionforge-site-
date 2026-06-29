/* Conversion Forge chat widget — one self-contained script. Embed with:
     <script src="https://conversionforge.co.uk/cf-chat-widget.js" defer></script>
   Talks to the Cloudflare Worker. No dependencies. Brand: teal #4DD9D5 / charcoal #1a1a1a. */
(function () {
  'use strict';
  var ENDPOINT = 'https://cf-chatbot.tmogorosi-mgmt.workers.dev/chat';
  var AUDIT = 'https://conversionforge.co.uk/free-audit';
  var WHATSAPP = 'https://wa.me/447881664892?text=Hi%20Conversion%20Forge%2C%20I%27d%20like%20to%20talk%20about%20a%20project.';
  var GREETING = "Hi, I'm the Conversion Forge assistant. I can tell you how we get businesses found online, and point you to a free website audit. What are you working on?";
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
    btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 5.8 2 10.5c0 2.6 1.4 4.9 3.6 6.4-.1 1-.6 2.4-1.3 3.4-.2.3 0 .7.4.6 1.9-.4 3.4-1.1 4.4-1.7.9.2 1.9.3 2.9.3 5.5 0 10-3.8 10-8.5S17.5 2 12 2z"/></svg>';
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
    function addBot(text) { var m = el('div', 'cfw-msg cfw-bot'); m.innerHTML = linkify(text); body.appendChild(m); scroll(); }
    function addMe(text) { var m = el('div', 'cfw-msg cfw-me', esc(text)); body.appendChild(m); scroll(); }

    function addChips() {
      var wrap = el('div', 'cfw-chips');
      CHIPS.forEach(function (c) {
        var chip = el('button', 'cfw-chip', c.label);
        chip.onclick = function () {
          if (c.href) { window.open(c.href, '_blank', 'noopener'); return; }
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
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          typing.remove();
          var reply = (d && d.reply) || "Sorry, something went wrong. You can book a free audit at " + AUDIT + " or message us on WhatsApp.";
          addBot(reply); history.push({ role: 'assistant', content: reply });
        })
        .catch(function () { typing.remove(); addBot("I could not reach our system just now. Please book a free audit at " + AUDIT + " or message us on WhatsApp."); })
        .finally(function () { busy = false; sendBtn.disabled = false; input.focus(); });
    }

    function open() { root.classList.add('cfw-open'); if (!body.dataset.init) { body.dataset.init = '1'; addBot(GREETING); addChips(); } input.focus(); }
    function close() { root.classList.remove('cfw-open'); }
    btn.onclick = function () { root.classList.contains('cfw-open') ? close() : open(); };
    panel.querySelector('.cfw-x').onclick = close;
    sendBtn.onclick = function () { send(); };
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    input.addEventListener('input', function () { input.style.height = 'auto'; input.style.height = Math.min(90, input.scrollHeight) + 'px'; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
