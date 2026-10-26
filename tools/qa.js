// End-to-end QA. Fails (exit 1) on any console error, page error, failed request,
// broken link, missing SEO tag, accessibility violation or broken interaction.
//   node tools/dev-server.js &  node tools/qa.js
const fs = require('fs');
const L = require('./lib.js');
const AXE = process.env.AXE_PATH || '';
const SHOTS = process.env.SHOTS || '';
let fails = 0, passes = 0;
const ok = (c, msg) => { if (c) passes++; else { fails++; console.log('  FAIL ' + msg); } };
const sect = (t) => console.log('\n# ' + t);
const shot = async (page, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: `${SHOTS}/${name}.png` }); } };

async function newPage(b, opts = {}) {
  const { fresh, ...ctxOpts } = opts;
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...ctxOpts });
  await L.stubExternal(ctx);
  // Most tests run as a returning visitor (cookie choice made, pop-up seen) so overlays don't block clicks.
  if (!fresh) await ctx.addInitScript(() => { try { localStorage.setItem('swk_consent_v1', JSON.stringify({ a: false, m: false, t: 1 })); localStorage.setItem('swk_lead', String(Date.now())); } catch (e) {} });
  const page = await ctx.newPage();
  const msgs = []; L.watch(page, msgs);
  return { ctx, page, msgs };
}

function pagesFromSitemap() {
  const xml = fs.readFileSync(require('path').resolve(__dirname, '..', 'public', 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>https:\/\/www\.swkpropertiesuae\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
}

(async () => {
  const b = await L.launch();

  // ---------------------------------------------------------------- every page
  sect('Every page: errors, SEO, links, images, overflow' + (AXE ? ', axe' : ''));
  let urls = pagesFromSitemap();
  if (process.env.QA_RESEARCH_SAMPLE === '1') {
    const research = JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync(require('path').resolve(__dirname, '..', 'data/research.json.gz'))));
    const sample = new Set();
    for (let y = 2011; y <= 2026; y++) sample.add('/blog/' + research.find(r => r.period === y).slug + '/');
    const all = new Set(research.map(r => '/blog/' + r.slug + '/'));
    urls = urls.filter(u => !all.has(u) || sample.has(u));
    console.log('  Browser sample: every public template, each research year index, and one report per year. Run without QA_RESEARCH_SAMPLE for every URL.');
  }
  const { page, msgs, ctx } = await newPage(b);
  const checkedLinks = new Set();
  for (const u of urls) {
    msgs.length = 0;
    await page.goto(L.BASE + u, { waitUntil: 'load' });
    await page.waitForTimeout(u === '/' ? 3500 : 500);
    const info = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      desc: (document.querySelector('meta[name=description]') || {}).content,
      canon: (document.querySelector('link[rel=canonical]') || {}).href,
      og: (document.querySelector('meta[property="og:image"]') || {}).content,
      js: document.documentElement.classList.contains('js'),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return true; } catch (e) { return false; } }),
      lang: document.documentElement.lang,
      ids: (() => { const seen = {}, dup = []; document.querySelectorAll('[id]').forEach((e) => { if (seen[e.id]) dup.push(e.id); seen[e.id] = 1; }); return dup; })(),
    }));
    const tag = `[${u}]`;
    ok(L.clean(msgs).length === 0, `${tag} console/network: ${JSON.stringify(L.clean(msgs))}`);
    ok(info.h1 === 1, `${tag} h1 count ${info.h1}`);
    ok(info.title && info.title.length > 10 && info.title.length < 70, `${tag} title length "${info.title}"`);
    ok(info.desc && info.desc.length > 50 && info.desc.length < 200, `${tag} description length ${info.desc && info.desc.length}`);
    ok(info.canon === 'https://www.swkpropertiesuae.com' + u, `${tag} canonical ${info.canon}`);
    ok(/^https:\/\/www\.swkpropertiesuae\.com\/assets\/(images|og)\//.test(info.og), `${tag} og:image absolute ${info.og}`);
    ok(info.js && info.lang === 'en', `${tag} js class / lang`);
    ok(!info.overflow, `${tag} horizontal overflow`);
    ok(info.noAlt === 0, `${tag} images without alt: ${info.noAlt}`);
    ok(info.ld.every(Boolean), `${tag} invalid JSON-LD`);
    ok(info.ids.length === 0, `${tag} duplicate ids ${info.ids}`);
    for (const h of info.links) {
      if (/^(mailto:|tel:|https?:)/.test(h)) { ok(!/^#?$/.test(h), `${tag} empty link`); continue; }
      const url = h.startsWith('#') ? u + h : h.replace(/#.*/, '');
      const key = url.split('?')[0];
      if (h.startsWith('#') || checkedLinks.has(key)) continue;
      checkedLinks.add(key);
      const r = await ctx.request.get(L.BASE + key);
      ok(r.status() === 200, `${tag} broken link ${h} -> ${r.status()}`);
    }
    if (AXE) {
      await page.addScriptTag({ path: AXE });
      const res = await page.evaluate(async () => {
        const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] });
        return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0].target.join(' ') }));
      });
      ok(res.length === 0, `${tag} axe: ${JSON.stringify(res)}`);
    }
  }
  console.log(`  ${urls.length} pages checked`);

  // ---------------------------------------------------------------- home deep dive
  sect('Home: hero video, 3D flight, welcome');
  msgs.length = 0;
  await page.goto(L.BASE + '/', { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('.hero.is-playing'), null, { timeout: 20000 }).catch(() => {});
  ok(await page.evaluate(() => !!document.querySelector('.hero.is-playing')), 'hero video is playing');
  await page.waitForTimeout(1500);
  await shot(page, 'home-top');
  const flight = [];
  for (const f of [0, 0.35, 0.65, 1]) {
    await page.evaluate((f) => { const w = document.querySelector('.hero-cine'); scrollTo({ top: w.offsetTop + (w.offsetHeight - innerHeight) * f, behavior: 'instant' }); }, f);
    await page.waitForTimeout(1200);
    flight.push(await page.evaluate(() => ({ q: [...document.querySelectorAll('.flight__quote')].filter((q) => parseFloat(q.style.opacity || 0) > 0.6).length, wo: parseFloat(document.querySelector('.hero').style.getPropertyValue('--wo')) })));
  }
  ok(flight[0].wo > 0.95 && flight[3].wo > 0.95 && flight[1].wo < 0.1, `welcome leaves and returns ${JSON.stringify(flight)}`);
  ok(flight.slice(1, 3).some((x) => x.q === 1), 'a hook line is in focus mid-flight');
  await shot(page, 'home-fly');
  await page.evaluate(() => scrollTo(0, 0));
  ok(L.clean(msgs).length === 0, 'home console clean after flight: ' + JSON.stringify(L.clean(msgs)));

  sect('Home: nav bar');
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(500);
  // Desktop uses the top navigation bar; tablet/phone use the header menu (no floating bottom buttons).
  const navInfo = await page.evaluate(() => { const h = document.querySelector('.site-header'), n = [...document.querySelectorAll('.hdr__link')]; const cur = n.filter((a) => a.getAttribute('aria-current') === 'page').map((a) => a.textContent);
    return { links: n.map((a) => a.textContent), cur, headerH: Math.round(h.getBoundingClientRect().height), menuToggleShown: getComputedStyle(document.querySelector('.hdr__burger')).display !== 'none' }; });
  ok(navInfo.links.length === 7 && navInfo.cur.join() === 'Home' && !navInfo.menuToggleShown, `desktop nav bar ${JSON.stringify(navInfo)}`);
  const heroBox = await page.evaluate(() => { const t = document.querySelector('.hero__title').getBoundingClientRect(), h = document.querySelector('.site-header').getBoundingClientRect(), s = document.querySelector('.hero__search-wrap').getBoundingClientRect(); return { titleBelowHeader: t.top > h.bottom + 40, searchInView: s.bottom <= innerHeight }; });
  ok(heroBox.titleBelowHeader && heroBox.searchInView, `hero text clears the header and search fits ${JSON.stringify(heroBox)}`);
  await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' })); await page.waitForTimeout(500);
  ok(await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-scrolled')), 'header turns into a frosted bar on scroll');
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
  await page.mouse.move(10, 400);
  await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(400);

  // Client testimonials and the site assistant.
  ok(await page.locator('[data-testi], [data-review-carousel]').count() > 0, 'testimonials or commitments block present');
  await page.click('[data-chat-toggle]');
  ok(await page.locator('#swk-chat-panel').isVisible(), 'concierge opens');
  await page.fill('#swk-chat-input', '<script>alert(1)</script> buy a home');
  await page.click('[data-chat-form] button');
  ok(await page.locator('[data-chat-log]').textContent().then(t=>t.includes('shortlist')), 'buying question answered');
  ok(await page.locator('[data-chat-log] script').count() === 0, 'chat input rendered as text');
  ok((await page.getAttribute('[data-chat-handoff]', 'href')).includes('wa.me/971564330448'), 'human handoff uses SWK number');
  await page.locator('#swk-chat-input').press('Escape');
  ok(!(await page.locator('#swk-chat-panel').isVisible()), 'Escape closes concierge');

  // search form -> properties with params
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(600);
  await page.selectOption('#s-community', 'Dubai Land'); await page.selectOption('#s-status', 'Off-Plan');
  await Promise.all([page.waitForURL(/properties\/\?/), page.click('.search-bar button[type=submit]')]);
  const q = new URL(page.url()).searchParams;
  ok(q.get('community') === 'Dubai Land' && q.get('status') === 'Off-Plan', `hero search params ${page.url()}`);
  await page.waitForTimeout(400);
  ok((await page.textContent('[data-results-count]')) === '2 properties found', 'search applied on properties page: ' + await page.textContent('[data-results-count]'));
  ok(await page.evaluate(() => document.querySelector('[data-filters]').elements.status.value) === 'Off-Plan', 'status filter preselected');

  // ---------------------------------------------------------------- listings
  sect('Properties: filters + pagination');
  await page.goto(L.BASE + '/properties/', { waitUntil: 'load' }); await page.waitForTimeout(500);
  const vis = () => page.evaluate(() => ({ n: [...document.querySelectorAll('[data-properties-grid] .property-card')].filter((c) => !c.hidden).length, count: document.querySelector('[data-results-count]').textContent, pages: document.querySelectorAll('[data-pagination] button').length, empty: !document.querySelector('[data-empty-state]').hidden }));
  let v = await vis(); ok(v.n === 9 && v.count === '14 properties found' && v.pages === 2, `listing page 1 ${JSON.stringify(v)}`);
  await page.click('[data-pagination] button:nth-child(2)'); await page.waitForTimeout(700);
  v = await vis(); ok(v.n === 5 && /page=2/.test(page.url()), `listing page 2 ${JSON.stringify(v)} ${page.url()}`);
  await page.selectOption('[data-filter=type]', 'Villa');
  v = await vis(); ok(v.n === 2 && v.count === '2 properties found' && v.pages === 0 && !/page=/.test(page.url()), `type=Villa ${JSON.stringify(v)}`);
  await page.selectOption('[data-filter=budget]', '0-1000000');
  v = await vis(); ok(v.n === 0 && v.empty, `no results shows empty state ${JSON.stringify(v)}`);
  await page.click('[data-filters-reset]'); v = await vis(); ok(v.n === 9 && !v.empty, 'reset restores');
  await page.goto(L.BASE + '/properties/?community=Dubai%20Hills%20Estate&status=Ready', { waitUntil: 'load' }); await page.waitForTimeout(400);
  v = await vis(); ok(v.n === 1, `deep link filters ${JSON.stringify(v)}`);
  await shot(page, 'properties');

  // ---------------------------------------------------------------- detail + lightbox
  sect('Property detail: gallery + lightbox');
  await page.goto(L.BASE + '/properties/islands-2/', { waitUntil: 'load' }); await page.waitForTimeout(500);
  ok((await page.$$('[data-lightbox-index]')).length === 16, 'islands-2 has 16 gallery tiles');
  await page.click('[data-lightbox-index="2"]'); await page.waitForTimeout(500);
  ok(await page.evaluate(() => document.querySelector('.lightbox__counter').textContent) === '3 / 16', 'lightbox shows tile 3');
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  ok(await page.evaluate(() => document.querySelector('.lightbox').contains(document.activeElement)), 'focus trapped in lightbox');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  await shot(page, 'detail');

  // ---------------------------------------------------------------- calculator
  sect('Mortgage: calculator maths, validation, FAQ');
  await page.goto(L.BASE + '/mortgage/', { waitUntil: 'load' }); await page.waitForTimeout(500);
  const out = async (k) => (await page.textContent(`[data-calc-output="${k}"]`)).replace(/\u00a0/g, ' ');
  ok(await out('piAmount') === 'AED 10,422', 'P&I default ' + await out('piAmount'));
  ok(await out('totalInterest') === 'AED 1,251,558', 'interest default ' + await out('totalInterest'));
  ok(await out('totalPayment') === 'AED 3,126,558', 'repaid-to-bank default ' + await out('totalPayment'));
  ok(await out('totalCost') === 'AED 3,751,558', 'total cost incl. down payment ' + await out('totalCost'));
  ok(await out('monthlyPayment') === 'AED 12,427', 'monthly total default ' + await out('monthlyPayment'));
  await page.fill('#c-down', '5'); await page.waitForTimeout(100);
  ok(await out('downAmount') === 'AED 500,000', 'typing 5% does not rewrite the field mid-entry, computes at the 20% minimum: ' + await out('downAmount'));
  ok(await page.inputValue('#c-down') === '5', 'field keeps typed value while typing');
  await page.dispatchEvent('#c-down', 'change'); await page.waitForTimeout(100);
  ok(await page.inputValue('#c-down') === '20', 'down payment raised to 20% on commit');
  ok(/Raised to the 20%/.test(await page.textContent('[data-calc-hint]')), 'minimum deposit warning shown');
  await page.click('[data-calc-term="15"]'); await page.waitForTimeout(100);
  ok(await out('piAmount') === 'AED 15,300', '15-year P&I at 20% down (term click lands even right after blur) ' + await out('piAmount'));
  ok((await page.inputValue('#c-end')).length > 8, 'payoff date ' + await page.inputValue('#c-end'));
  await page.click('[data-down-unit="amount"]'); await page.waitForTimeout(100);
  ok(await page.inputValue('#c-down') === '500000', 'unit toggle converts to AED: ' + await page.inputValue('#c-down'));
  await page.click('[data-calc-disclosure]');
  ok(await page.evaluate(() => !document.querySelector('[data-calc-disclosure-panel]').hidden), 'disclosure opens');
  await page.fill('#c-price', '100000'); await page.dispatchEvent('#c-price', 'change');
  ok(/between AED 200,000/.test(await page.textContent('[data-calc-hint]')), 'price range validation');
  await shot(page, 'mortgage');
  await page.click('#faq-trigger-0'); await page.waitForTimeout(700);
  ok(await page.getAttribute('#faq-trigger-0', 'aria-expanded') === 'true' && (await page.evaluate(() => document.querySelector('#faq-panel-0').getBoundingClientRect().height)) > 20, 'FAQ accordion opens');

  // ---------------------------------------------------------------- contact
  sect('Contact form: validation, honest fallback');
  await page.goto(L.BASE + '/contact/?property=golf-fields', { waitUntil: 'load' }); await page.waitForTimeout(400);
  ok((await page.inputValue('#cf-message')).includes('Golf Fields'), 'property prefill');
  await page.fill('#cf-message', '');
  await page.click('#contact-form button[type=submit]'); await page.waitForTimeout(200);
  const errs = await page.evaluate(() => [...document.querySelectorAll('#contact-form .form-error')].map((e) => e.textContent));
  ok(errs.length >= 3, 'validation errors shown ' + JSON.stringify(errs));
  ok(await page.evaluate(() => document.activeElement.id) === 'cf-name', 'focus goes to first invalid field');
  ok(await page.evaluate(() => document.querySelector('#contact-form .form-status').hidden), 'no success message on invalid submit');
  await page.fill('#cf-name', 'Test User'); await page.fill('#cf-email', 'test@example.com'); await page.fill('#cf-message', 'Hello there');
  await page.check('#contact-form input[name=consent]');
  const nav = page.waitForEvent('framenavigated', { timeout: 1500 }).catch(() => null);
  await page.click('#contact-form button[type=submit]'); await page.waitForTimeout(400);
  const st = await page.textContent('#contact-form .form-status');
  ok(/email app/i.test(st) && !/received/i.test(st), 'without an endpoint it says it opens email (never claims "received"): ' + st);
  await shot(page, 'contact');

  // ---------------------------------------------------------------- mobile
  sect('Mobile 390x844');
  const m = await newPage(b, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await m.page.goto(L.BASE + '/', { waitUntil: 'load' });
  await m.page.waitForFunction(() => document.querySelector('.hero.is-gl'), null, { timeout: 20000 }).catch(() => {});
  await m.page.waitForTimeout(3600);
  await shot(m.page, 'mobile-top');
  const mo = await m.page.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); return e && e.getBoundingClientRect(); };
    const bar = r('.search-bar'), btn = r('.search-bar button');
    return { overflow: document.documentElement.scrollWidth > innerWidth + 1, menuToggle: (() => { const t = r('.hdr__burger'); return !!t && t.width >= 40 && t.height >= 40; })(), bottomButtons: ['.whatsapp-float', '.back-top'].filter((q) => getComputedStyle(document.querySelector(q)).display !== 'none'), searchInView: bar && bar.bottom <= innerHeight && bar.top >= 0, btnInView: btn && btn.bottom <= innerHeight, gl: !!document.querySelector('.hero.is-gl') };
  });
  ok(!mo.overflow, 'no horizontal overflow'); ok(mo.menuToggle && mo.bottomButtons.length === 0, `header menu button with touch target, no floating bottom buttons ${JSON.stringify(mo)}`);
  ok(mo.searchInView && mo.btnInView, `search bar fits first screen ${JSON.stringify(mo)}`);
  ok(L.clean(m.msgs).length === 0, 'mobile console clean ' + JSON.stringify(L.clean(m.msgs)));
  for (const u of ['/properties/', '/mortgage/', '/contact/', '/about/', '/properties/golf-fields/']) {
    await m.page.goto(L.BASE + u, { waitUntil: 'load' }); await m.page.waitForTimeout(300);
    ok(!(await m.page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `mobile overflow on ${u}`);
  }
  await m.ctx.close();

  // ---------------------------------------------------------------- responsive layout sweep
  sect('Responsive sweep: hero form and key blocks stay inside their containers');
  for (const w of [320, 360, 390, 414, 600, 768, 1024, 1280, 1920]) {
    const r = await newPage(b, { viewport: { width: w, height: w < 700 ? 760 : 900 }, isMobile: w < 700, hasTouch: w < 700 });
    await r.page.goto(L.BASE + '/', { waitUntil: 'load' });
    await r.page.waitForTimeout(w <= 414 ? 2500 : 1800);
    const lay = await r.page.evaluate(() => {
      const bar = document.querySelector('.search-bar').getBoundingClientRect();
      const bad = [...document.querySelectorAll('.search-bar .search-field, .search-bar button')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > bar.right + 0.5 || b.left < bar.left - 0.5); }).length;
      const hero = document.querySelector('.hero__content').getBoundingClientRect();
      const title = document.querySelector('.hero__title').getBoundingClientRect();
      const cardsOk = [...document.querySelectorAll('.hero__ctas a')].every((a) => a.getBoundingClientRect().right <= innerWidth);
      return { bad, barRight: Math.round(bar.right), vw: innerWidth, titleRight: Math.round(title.right), cardsOk, ov: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    ok(lay.bad === 0 && lay.barRight <= lay.vw && lay.titleRight <= lay.vw && lay.cardsOk && !lay.ov, `${w}px hero layout ${JSON.stringify(lay)}`);
    ok(L.clean(r.msgs).length === 0, `${w}px console clean ${JSON.stringify(L.clean(r.msgs))}`);
    if (w === 768 || w === 1024) await shot(r.page, 'home-' + w);
    await r.ctx.close();
  }

  // ---------------------------------------------------------------- fallbacks
  sect('Fallbacks: reduced motion, ?nowebgl, no JS');
  const rm = await newPage(b, { reducedMotion: 'reduce' });
  await rm.page.goto(L.BASE + '/', { waitUntil: 'load' }); await rm.page.waitForTimeout(1200);
  const r1 = await rm.page.evaluate(() => ({ gl: !!document.querySelector('.hero.is-gl'), flat: document.querySelector('.hero-cine').classList.contains('is-flat'), h: document.querySelector('.hero-cine').offsetHeight, vh: innerHeight, vis: [...document.querySelectorAll('[data-reveal]')].every((e) => getComputedStyle(e).opacity === '1'), h1: document.querySelector('h1').innerText.length > 5, typed: !document.querySelector('.tw-char') }));
  ok(!r1.gl && r1.flat && r1.h <= r1.vh + 2 && r1.vis && r1.typed, `reduced motion ${JSON.stringify(r1)}`);
  ok(L.clean(rm.msgs).length === 0, 'reduced-motion console clean');
  await rm.ctx.close();
  const nw = await newPage(b);
  await nw.page.goto(L.BASE + '/?nowebgl', { waitUntil: 'load' }); await nw.page.waitForTimeout(1500);
  ok(await nw.page.evaluate(() => !document.querySelector('.hero.is-gl') && document.querySelector('.hero-cine').classList.contains('is-flat')), '?nowebgl keeps the photo hero');
  ok(L.clean(nw.msgs).length === 0, 'nowebgl console clean ' + JSON.stringify(L.clean(nw.msgs)));
  await nw.ctx.close();
  const nj = await newPage(b, { javaScriptEnabled: false });
  await nj.page.goto(L.BASE + '/', { waitUntil: 'load' });
  const j = await nj.page.evaluate(() => ({ h1: document.querySelector('.hero__title').innerText.replace(/\s+/g, ' ').trim(), cards: [...document.querySelectorAll('.property-card--feature')].every((c) => getComputedStyle(c).opacity === '1'), imgs: [...document.querySelectorAll('img')].filter((i) => getComputedStyle(i).opacity === '0').length, tall: document.querySelector('.hero-cine').offsetHeight <= innerHeight + 2 }));
  ok(/Dubai homes/.test(j.h1) && j.cards && j.imgs === 0 && j.tall, `no-JS page is usable ${JSON.stringify(j)}`);
  await nj.ctx.close();


  // ---------------------------------------------------------------- UI systems (fresh visitor)
  sect('Announcement, cookies, dialogs, toasts, popup');
  const fv = await newPage(b, { fresh: true });
  await fv.page.goto(L.BASE + '/properties/', { waitUntil: 'load' });
  ok(await fv.page.evaluate(() => !!document.querySelector('[data-announce]') && getComputedStyle(document.querySelector('[data-announce]')).display !== 'none'), 'announcement bar visible');
  await fv.page.waitForSelector('[data-cookie-banner].is-in', { timeout: 5000 });
  ok(true, 'cookie banner appears');
  ok(await fv.page.evaluate(() => !window.dataLayer && !document.querySelector('script[src*="googletagmanager"]')), 'no analytics before consent');
  await fv.page.click('[data-cookie-customise]');
  await fv.page.waitForSelector('[data-cookie-prefs].is-open');
  ok(await fv.page.evaluate(() => document.activeElement && document.querySelector('[data-cookie-prefs]').contains(document.activeElement)), 'prefs dialog traps focus inside');
  await fv.page.keyboard.press('Escape'); await fv.page.waitForTimeout(400);
  ok(await fv.page.evaluate(() => document.querySelector('[data-cookie-prefs]').hidden), 'ESC closes dialog');
  await fv.page.click('[data-cookie-reject]'); await fv.page.waitForTimeout(500);
  ok(await fv.page.evaluate(() => { const c = JSON.parse(localStorage.getItem('swk_consent_v1')); return c && c.a === false && c.m === false; }), 'essential-only choice stored');
  ok(await fv.page.evaluate(() => !!document.querySelector('.toast--success')), 'toast shown after saving preferences');
  await fv.page.click('[data-cookie-settings]'); await fv.page.waitForSelector('[data-cookie-prefs].is-open');
  await fv.page.keyboard.press('Escape'); await fv.page.waitForTimeout(400);
  await fv.page.click('[data-announce-close]');
  await fv.page.reload({ waitUntil: 'load' });
  ok(await fv.page.evaluate(() => getComputedStyle(document.querySelector('[data-announce]')).display === 'none'), 'dismissed announcement stays dismissed');
  ok(await fv.page.evaluate(() => document.querySelector('[data-cookie-banner]').hidden), 'cookie banner does not return after a choice');
  await fv.page.goto(L.BASE + '/properties/islands-2/', { waitUntil: 'load' });
  await fv.page.click('.pd-cta [data-open-callback]');
  await fv.page.waitForSelector('[data-callback-modal].is-open');
  await fv.page.click('[data-callback-modal] button[type=submit]');
  ok(await fv.page.evaluate(() => document.querySelectorAll('[data-callback-modal] .has-error, [data-callback-modal] .form-error').length > 0), 'callback form validates');
  await fv.page.keyboard.press('Escape'); await fv.page.waitForTimeout(400);
  ok(await fv.page.evaluate(() => document.activeElement && document.activeElement.hasAttribute('data-open-callback')), 'focus returns to opener');
  await fv.page.evaluate(() => { localStorage.removeItem('swk_lead'); });
  await fv.page.goto(L.BASE + '/about/', { waitUntil: 'load' });
  await fv.page.evaluate(() => { document.dispatchEvent(new MouseEvent('mouseout', { clientY: -5, relatedTarget: null, bubbles: true })); });
  ok(true, 'exit-intent handler runs without error');
  await fv.page.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' })); await fv.page.waitForTimeout(700);
  ok(await fv.page.evaluate(() => document.querySelector('[data-back-top]').classList.contains('is-in')), 'back-to-top appears after scrolling');
  ok(L.clean(fv.msgs).length === 0, 'UI flows console clean ' + JSON.stringify(L.clean(fv.msgs)));
  await fv.ctx.close();

  sect('SEO files and head tags');
  for (const f of ['/robots.txt', '/sitemap.xml', '/feed.xml', '/manifest.webmanifest', '/favicon.ico', '/.well-known/security.txt', '/cookies/']) {
    const r = await ctx.request.get(L.BASE + f); ok(r.ok(), `${f} serves 200`);
  }

  await ctx.close(); await b.close();
  console.log(`\n${passes} checks passed, ${fails} failed`);
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
