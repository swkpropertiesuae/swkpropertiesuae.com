// Browser regressions for the actual generated pages, not a duplicate layout model.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base = process.env.BASE || 'http://localhost:8766';
const out = process.env.HERO_QA_OUT || '/tmp/hero-qa-screenshots';
const sizes = [[1920,1080],[1440,900],[1280,720],[1024,768],[768,1024],[390,844],[375,667],[360,740],[844,390]];
const intersects = (a,b) => a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;
(async () => {
  fs.mkdirSync(out, { recursive:true });
  const browser = await chromium.launch({channel:process.env.HERO_BROWSER_CHANNEL || 'chrome',args:['--no-sandbox']});
  const failures=[];
  for(const [width,height] of sizes) {
    const page=await browser.newPage({viewport:{width,height}, reducedMotion:'reduce'});
    try {
      await page.route('**/assets/video/**', route=>route.abort());
      await page.goto(base, {waitUntil:'domcontentloaded'});
      await page.evaluate(async()=>{await document.fonts.ready;const poster=new Image();poster.src=document.querySelector('.hero__video').poster;await poster.decode();});
      await page.locator('.preloader').waitFor({state:'hidden',timeout:10000});
      await page.screenshot({path:`${out}/${width}x${height}.png`});
      const metrics=await page.evaluate(()=>{
        const q=s=>document.querySelector(s);
        const r=s=>{const e=q(s),b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,visible:getComputedStyle(e).display!=='none'};};
        return {header:r('.site-header'), logo:r('.brand-logo'), search:r('.hero__search-wrap'), card:r('.hero__office-signature'), kicker:r('[data-beat="b1"] .hero__kicker'), duplicate:!!q('.site-brand__type'), overflow:document.documentElement.scrollWidth>innerWidth};
      });
      assert(!metrics.duplicate,'Duplicate header wordmark');
      assert(metrics.logo.height>=48,'Logo is too small');
      assert(!metrics.overflow,'Horizontal page overflow');
      assert(!intersects(metrics.header,metrics.kicker),'Header intersects hero text');
      if(metrics.card.visible) assert(!intersects(metrics.search,metrics.card),'Search intersects office card');
      if(width>=1024) {
        const links=await page.locator('.site-nav a').all();
        for(const link of links) {const b=await link.boundingBox();assert(b.x>=metrics.header.x&&b.x+b.width<=metrics.header.x+metrics.header.width,'Navigation outside header');}
        await page.locator('.site-nav a').nth(1).hover();
        assert(await page.locator('.site-nav').evaluate(e=>e.classList.contains('is-tracked')),'Hover highlight missing');
      } else {
        await page.getByRole('button',{name:'Open menu',exact:true}).click();
        assert(await page.locator('#mobile-menu').isVisible(),'Mobile menu did not open');
        await page.keyboard.press('Escape');
        assert(!(await page.locator('#mobile-menu').isVisible()),'Escape did not dismiss menu');
      }
      assert(await page.locator('.hero__video').evaluate(e=>e.paused),'Reduced motion started video');
      console.log(`PASS layout ${width}x${height}`);
    } catch(e) { failures.push(`${width}x${height}: ${e.message}`); }
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  try {
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!document.querySelector('.hero__road-video').paused,null,{timeout:15000});
    assert(await page.locator('.hero__video').evaluate(e=>e.paused),'Scroll film autoplayed');
    await page.waitForTimeout(3000);
    assert(await page.locator('.hero__road-video').evaluate(e=>e.currentTime<1.4),'Idle road escaped its opening segment');
    assert.equal(await page.locator('.hero').getAttribute('data-phase'),'b1','Idle entered aerial/interior captions');
    await page.evaluate(()=>scrollTo({top:400,behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('.hero__road-video').paused,null,{timeout:600});
    await page.waitForFunction(()=>!document.querySelector('.hero__road-video').paused,null,{timeout:5000});
    assert(await page.locator('.hero__video').evaluate(e=>e.paused),'Scroll film resumed while idle');
    await page.evaluate(()=>{const w=document.querySelector('.hero-cine'),h=document.querySelector('.hero');scrollTo({top:w.offsetTop+w.offsetHeight-h.offsetHeight,behavior:'instant'});});
    await page.waitForFunction(()=>document.querySelector('.hero').dataset.phase==='logo',null,{timeout:5000});
    await page.waitForTimeout(1000);
    assert(await page.locator('.hero__road-video').evaluate(e=>e.paused),'Road layer covered the closing logo');
    assert(await page.locator('.hero__logo-sheen').evaluate(e=>getComputedStyle(e).animationName==='swk-logo-sheen'),'Gloss animation missing');
    await page.screenshot({path:`${out}/closing-logo.png`});
    console.log('PASS road-only idle loop, scroll takeover, resume, final-frame logo');
  } catch(e) { failures.push(`playback: ${e.message}; ${JSON.stringify(await page.locator('.hero__video').evaluate(e=>({src:e.currentSrc,ready:e.readyState,paused:e.paused,time:e.currentTime,error:e.error&&e.error.message})))}`); }
  await page.close();
  const uhd=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});
  try {
    await uhd.goto(base,{waitUntil:'domcontentloaded'});
    await uhd.waitForFunction(()=>document.querySelector('.hero__video').videoWidth===3840);
    assert.equal(await uhd.locator('.hero__video').evaluate(e=>e.videoHeight),2160);
    console.log('PASS high-density display selects 3840x2160 delivery');
  } catch(e) { failures.push(`4K selection: ${e.message}; ${JSON.stringify(await uhd.locator('.hero__video').evaluate(e=>({src:e.currentSrc,ready:e.readyState,width:e.videoWidth,error:e.error&&e.error.message})))}`); }
  await uhd.close();
  await browser.close();
  assert.equal(failures.length,0,failures.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1;});
