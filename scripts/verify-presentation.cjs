// Requires Playwright and Google Chrome. COO_BASE_URL may point at the live deck.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.COO_BASE_URL || 'http://127.0.0.1:8765/coo-technology-update-2026-10-14/';
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const [width,height] of [[1920,1200],[1366,768],[1024,768],[768,1024],[390,844],[320,568]]) {
      await page.setViewportSize({width,height});
      assert.equal((await page.goto(base)).status(),200);
      await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
      assert.equal(await page.locator('.slide').count(),9);
      for (let n=1;n<=9;n++) {
        await page.evaluate(n => {location.hash=String(n)},n);
        await page.waitForFunction(n => document.querySelector('#counter').textContent === `${n} / 9`,n);
        assert.equal(await page.locator(`#slide-${n}`).getAttribute('aria-hidden'),'false');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth),false);
        assert.equal(await page.locator(`#slide-${n}`).evaluate(s => s.scrollHeight>s.clientHeight+2 || s.scrollWidth>s.clientWidth+2),false);
      }
      console.log(`PASS: nine slides, assets, progress and bounds at ${width}×${height}`);
    }
    await page.setViewportSize({width:1366,height:768});await page.goto(base);
    for (const [key,expected] of [['ArrowRight','2 / 9'],['PageDown','3 / 9'],['End','9 / 9'],['Home','1 / 9'],['Space','2 / 9'],['PageUp','1 / 9']]) {
      await page.keyboard.press(key);assert.equal(await page.locator('#counter').innerText(),expected);
    }
    await page.locator('#next').click();assert.equal(await page.locator('#counter').innerText(),'2 / 9');
    await page.locator('#previous').click();assert.equal(await page.locator('#counter').innerText(),'1 / 9');
    await page.locator('#fullscreen').click();assert.equal(await page.evaluate(()=>!!document.fullscreenElement),true);
    await page.evaluate(()=>document.exitFullscreen());
    const promise=page.waitForEvent('download');await page.locator('.download').click();const download=await promise;
    assert.equal(await download.failure(),null);
    await download.saveAs('/tmp/coo-verified-download.pptx');
    await page.goto(base+'#4');await page.locator('#slide-4 .image-link').click();
    assert.deepEqual(errors,[]);
    console.log('PASS: keyboard, buttons, fullscreen, screenshot link, PowerPoint download, no runtime errors');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
