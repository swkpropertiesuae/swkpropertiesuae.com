// Floating navigation with a shared highlight for pointer and keyboard navigation.
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

    var nav = SWK.$('.site-nav', bar);
    var track = nav && SWK.$('.site-nav__track', nav);
    if (nav && track) {
      var active = SWK.$('[aria-current="page"]', nav);
      function highlight(link) {
        if (!link || !nav.offsetWidth) return;
        track.style.width = link.offsetWidth + 'px';
        track.style.transform = 'translateX(' + link.offsetLeft + 'px)';
        nav.classList.add('is-tracked');
      }
      SWK.$$('a', nav).forEach(function (link) {
        link.addEventListener('pointerenter', function () { highlight(link); });
        link.addEventListener('focus', function () { highlight(link); });
      });
      function restore() { highlight(nav.contains(document.activeElement) ? document.activeElement : active); }
      nav.addEventListener('pointerleave', restore);
      nav.addEventListener('focusout', function () { requestAnimationFrame(restore); });
      window.addEventListener('resize', SWK.raf(restore));
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(restore);
      restore();
    }
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
      if (ev.key === 'Tab' && !menu.hidden) {
        var stops = [btn].concat(SWK.$$('a, button', menu));
        var first = stops[0];
        var last = stops[stops.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
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
