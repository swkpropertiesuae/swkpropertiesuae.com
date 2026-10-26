// Scroll reveal ("blur fade"): blocks ease in once as they enter the viewport; siblings stagger a little.
(function () {
  'use strict';
  var SWK = window.SWK;

  var AUTO = [
    '.sec-head', '.logo-cloud__label', '.value-item', '.dev-card', '.project-card', '.stat', '.story__media', '.story__copy', '.community-card', '.service-card',
    '.calculator', '.review-carousel', '.blog-card', '.blog-feature', '.cta-band', '.ftr__top > *', '.ftr__cols > *', '.team-card', '.split-block > *', '.faq-item',
    '.contact-tile', '.quick-tile', '.property-card', '.page-hero .container > *', '.prose > *', '.checks li'
  ].join(',');

  SWK.reg('reveal', function () {
    var items = SWK.$$('[data-reveal]');
    SWK.$$(AUTO).forEach(function (el) {
      if (el.closest('.hero, .row-carousel__track') && !el.matches('.dev-card, .project-card')) return;
      if (el.hasAttribute('data-reveal') || el.closest('[data-reveal]')) return;
      var sib = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(AUTO); });
      var i = Math.min(sib.indexOf(el), 6);
      el.setAttribute('data-reveal', ''); el.setAttribute('data-reveal-delay', String(i * 70));
      items.push(el);
    });
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || SWK.reduced) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        if (delay) el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
        setTimeout(function () { el.style.transitionDelay = ''; }, delay + 900);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  });
})();
