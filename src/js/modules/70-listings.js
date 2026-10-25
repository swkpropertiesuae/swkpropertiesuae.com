// Developers & Projects page: filters (developer, community, collection) and a "show more" pager.
// Every card is in the server-rendered HTML; JS only hides and shows them, so crawlers and
// no-JS visitors still get every project.
(function () {
  'use strict';
  var SWK = window.SWK;
  var PAGE = 12;

  SWK.reg('listings', function () {
    var grid = SWK.$('[data-properties-grid]');
    var bar = SWK.$('[data-filters]');
    if (!grid || !bar) return;
    var cards = SWK.$$('.project-card', grid);
    var countEl = SWK.$('[data-results-count]');
    var emptyEl = SWK.$('[data-empty-state]');
    var more = SWK.$('[data-projects-more]');
    var fields = ['developer', 'community', 'collection'];
    var shown = PAGE;

    var params = new URLSearchParams(location.search);
    fields.forEach(function (name) {
      var sel = bar.elements[name];
      var v = params.get(name);
      if (sel && v && Array.prototype.some.call(sel.options, function (o) { return o.value === v; })) sel.value = v;
    });

    function draw() {
      var f = {};
      fields.forEach(function (name) { f[name] = bar.elements[name] ? bar.elements[name].value : ''; });
      var matched = cards.filter(function (c) {
        return (!f.developer || c.dataset.developer === f.developer) && (!f.community || c.dataset.community === f.community) && (!f.collection || c.dataset.collection === f.collection);
      });
      var filtered = !!(f.developer || f.community || f.collection);
      var limit = filtered ? matched.length : shown;
      cards.forEach(function (c) { c.hidden = true; });
      matched.slice(0, limit).forEach(function (c) { c.hidden = false; });
      if (countEl) countEl.textContent = matched.length + (matched.length === 1 ? ' project' : ' projects');
      if (emptyEl) emptyEl.hidden = matched.length > 0;
      if (more) more.hidden = filtered || shown >= matched.length;
    }

    fields.forEach(function (name) {
      var sel = bar.elements[name];
      if (sel) sel.addEventListener('change', function () { shown = PAGE; draw(); });
    });
    var reset = SWK.$('[data-filters-reset]', bar);
    if (reset) reset.addEventListener('click', function () { bar.reset(); shown = PAGE; draw(); });
    if (more) more.addEventListener('click', function () { shown += PAGE; draw(); });
    draw();
    if (params.get('developer') || params.get('community') || params.get('collection')) {
      var target = document.getElementById('projects');
      if (target && target.scrollIntoView) target.scrollIntoView({ behavior: SWK.reduced ? 'auto' : 'smooth' });
    }
  });
})();
