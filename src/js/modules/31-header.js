// Header: scroll state, a sliding highlight under the nav, and the mobile sheet.
(function () {
  'use strict';
  var SWK = window.SWK;

  SWK.reg('header', function () {
    var bar = SWK.$('[data-site-header]');
    if (!bar) return;
    var update = SWK.raf(function () { bar.classList.toggle('is-scrolled', window.scrollY > 12); });
    window.addEventListener('scroll', update, { passive: true });
    update();

    // sliding highlight: follows hover/focus, rests on the current page
    var nav = SWK.$('[data-hdr-nav]', bar), pill = nav && SWK.$('.hdr__pill', nav);
    if (!nav || !pill) return;
    var links = SWK.$$('.hdr__link', nav);
    function to(link) {
      if (!link) { pill.style.opacity = '0'; return; }
      var n = nav.getBoundingClientRect(), r = link.getBoundingClientRect();
      pill.style.opacity = '1';
      pill.style.width = r.width + 'px'; pill.style.height = r.height + 'px';
      pill.style.transform = 'translate(' + (r.left - n.left) + 'px,' + (r.top - n.top) + 'px)';
    }
    function rest() { to(SWK.$('.hdr__link[aria-current="page"]', nav)); }
    links.forEach(function (l) {
      l.addEventListener('pointerenter', function () { pill.classList.add('is-live'); to(l); });
      l.addEventListener('focus', function () { pill.classList.add('is-live'); to(l); });
    });
    nav.addEventListener('pointerleave', rest);
    nav.addEventListener('focusout', function (ev) { if (!nav.contains(ev.relatedTarget)) rest(); });
    window.addEventListener('resize', rest);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { pill.classList.remove('is-live'); rest(); setTimeout(function () { pill.classList.add('is-live'); }, 60); });
    rest();
  });

  SWK.reg('mobile-menu', function () {
    var btns = SWK.$$('[data-menu-toggle]');
    var menu = SWK.$('[data-mobile-menu]');
    var scrim = SWK.$('[data-menu-scrim]');
    if (!btns.length || !menu) return;
    var wide = window.matchMedia('(min-width: 1024px)');
    var first = btns[0];

    function set(open, returnFocus) {
      btns.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
      first.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      if (scrim) scrim.hidden = !open;
      requestAnimationFrame(function () { menu.classList.toggle('is-open', open); if (scrim) scrim.classList.toggle('is-open', open); });
      document.documentElement.classList.toggle('menu-open', open);
      if (!open && returnFocus) first.focus();
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { set(menu.hidden); }); });
    if (scrim) scrim.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !menu.hidden) { ev.preventDefault(); set(false, true); }
    });
    menu.addEventListener('click', function (ev) { if (ev.target.closest('a')) set(false); });
    var onResize = function () { if (wide.matches && !menu.hidden) set(false); };
    if (wide.addEventListener) wide.addEventListener('change', onResize); else wide.addListener(onResize);
    var chat = SWK.$('[data-menu-chat]');
    if (chat) chat.addEventListener('click', function () {
      set(false);
      var toggle = SWK.$('[data-chat-toggle]');
      if (toggle) toggle.click();
    });
  });
})();
