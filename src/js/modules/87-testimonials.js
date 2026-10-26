// Testimonials: two opposing marquee rows. The server renders one copy of each row (scrollable without JS);
// here each row is cloned until it can loop seamlessly. Hover, focus, the Pause button and reduced motion all stop it.
(function () {
  'use strict';
  var S = window.SWK;
  S.reg('testimonials', function () {
    var root = S.$('[data-voices]');
    if (!root) return;
    var rows = S.$$('[data-voices-row]', root), pauseBtn = S.$('[data-voices-pause]', root);
    if (!rows.length) return;

    rows.forEach(function (row) {
      var track = S.$('.voices__track', row), originals = Array.prototype.slice.call(track.children);
      var w = track.scrollWidth, need = Math.max(2, Math.ceil((row.clientWidth * 2) / Math.max(w, 1)) + 1);
      // Whole-set copies, an even number in total, so translating by -50% lands exactly on the start.
      if (need % 2) need++;
      for (var c = 1; c < need; c++) originals.forEach(function (card) {
        var copy = card.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); track.appendChild(copy);
      });
      track.style.setProperty('--voices-dur', Math.max(40, Math.round((w * need) / 2 / 34)) + 's');
    });

    var userPaused = false;
    function apply() { root.classList.toggle('is-paused', userPaused); }
    if (pauseBtn) pauseBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.textContent = userPaused ? 'Play' : 'Pause';
      apply();
    });
    if (!S.reduced) root.classList.add('is-marquee');
    else if (pauseBtn) pauseBtn.hidden = true;
  });
})();
