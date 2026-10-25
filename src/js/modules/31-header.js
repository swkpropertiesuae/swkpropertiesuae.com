// Top navigation bar: a white bar that gains a shadow once the page scrolls.
// Below 1024px the links, call/WhatsApp actions and chat live in a header menu.
(function () {
  'use strict';
  var SWK = window.SWK;

  SWK.reg('header', function () {
    var bar = SWK.$('[data-site-header]');
    if (!bar) return;
    var update = SWK.raf(function () { bar.classList.toggle('is-scrolled', window.scrollY > 12); });
    window.addEventListener('scroll', update, { passive: true });
    update();
  });

  SWK.reg('mobile-menu', function () {
    var btn = SWK.$('[data-menu-toggle]');
    var menu = SWK.$('[data-mobile-menu]');
    var scrim = SWK.$('[data-menu-scrim]');
    if (!btn || !menu) return;
    var wide = window.matchMedia('(min-width: 1024px)');

    function set(open, returnFocus) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      if (scrim) scrim.hidden = !open;
      document.documentElement.classList.toggle('menu-open', open);
      if (!open && returnFocus) btn.focus();
    }

    btn.addEventListener('click', function () { set(menu.hidden); });
    if (scrim) scrim.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !menu.hidden) { ev.preventDefault(); set(false, true); }
    });
    // In-page links and the external actions all dismiss the menu.
    menu.addEventListener('click', function (ev) { if (ev.target.closest('a')) set(false); });
    var onResize = function () { if (wide.matches && !menu.hidden) set(false); };
    if (wide.addEventListener) wide.addEventListener('change', onResize); else wide.addListener(onResize);

    // The floating chat button is retired on small screens; the menu opens the same panel.
    var chat = SWK.$('[data-menu-chat]');
    if (chat) chat.addEventListener('click', function () {
      set(false);
      var toggle = SWK.$('[data-chat-toggle]');
      if (toggle) toggle.click();
    });
  });
})();
