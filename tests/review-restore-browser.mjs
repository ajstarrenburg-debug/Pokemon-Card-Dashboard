// All input is generated fictionally. Image requests are replaced with a blank test card.
import assert from 'node:assert/strict';
import {chromium,firefox,webkit} from 'playwright';
import {readFileSync} from 'node:fs';
const key='pokemon_centering_gold_v16';
const url=process.env.RESTORE_TEST_URL || 'http://127.0.0.1:4173/review.html';
const rect=(l,r,t,b)=>({TL:{x:l,y:t},TR:{x:r,y:t},BR:{x:r,y:b},BL:{x:l,y:b}});
const label={card_id:'A-B01-P5',mode:'inner_edge',outer:rect(20,600,30,850),inner:rect(40,580,50,830),
  confirmed:true,note:'FICTIONAL <img src=x onerror="window.injected=true">',tilt:0.7,tilt_ai:0.2,
  pivot:{x:301,y:420},pan:{x:7,y:-4},edits:{outer:true,inner:true,tilt:true},asset_revision:15,seed_revision:13,mode_revision:15};
const exportText=JSON.stringify({version:'centering-gold-v16',schema:'border-keypoints-v1',labels:[label]});
const upload=async(page,text=exportText)=>page.locator('#restoreFile').setInputFiles({name:'fictional-gold.json',mimeType:'application/json',buffer:Buffer.from(text)});
const stored=async page=>page.evaluate(key=>localStorage.getItem(key),key);
const status=page=>page.locator('#restoreStatus');
for (const [name,engine] of Object.entries({chromium,firefox,webkit})) {
  if (process.env.RESTORE_TEST_ENGINES && !process.env.RESTORE_TEST_ENGINES.split(',').includes(name)) continue;
  const browser=await engine.launch();
  try {
    const context=await browser.newContext({acceptDownloads:true});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/cards/**',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="630" height="880"><rect width="630" height="880" fill="#222"/></svg>'}));
    await page.goto(url);
    await page.locator('#title').waitFor();
    await upload(page);
    await page.locator('#restorePreview:not([hidden])').waitFor();
    assert.equal(await stored(page),null,'preview must not persist');
    assert.match(await page.locator('#restoreSummary').textContent(),/1 herstellen/);
    await page.locator('#restoreRows summary').click();
    assert.match(await page.locator('#restoreRows pre').textContent(),/cards\/v15\/A-B01-P5.jpg/);
    assert.equal(await page.evaluate(()=>window.injected),undefined);
    await page.locator('#cancelRestore').click();
    assert.equal(await stored(page),null,'cancel must not persist');
    await upload(page);
    await page.locator('#applyRestore:not([disabled])').click();
    assert.match(await status(page).textContent(),/1 beoordelingen lokaal hersteld/);
    const after=JSON.parse(await stored(page));
    for (const field of ['note','outer','inner','tilt','pivot','pan','edits','confirmed','asset_revision','seed_revision']) assert.deepEqual(after[label.card_id][field],label[field]);
    await page.locator('#prev').click(); // A-B13-P6
    for (let i=0;i<7;i++) await page.locator('#prev').click(); // A-B01-P5
    assert.match(await page.locator('#img').getAttribute('src'),/cards\/v15\//);
    const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#export').click()]);
    const roundtrip=readFileSync(await download.path(),'utf8');
    const exported=JSON.parse(roundtrip).labels.find(item=>item.card_id===label.card_id);
    for (const field of ['outer','inner','tilt','pivot','pan','note','confirmed','asset_revision','seed_revision']) assert.deepEqual(exported[field],label[field]);
    // Actual app-generated export is accepted in a fresh browser, without a hand-crafted fixture.
    await page.evaluate(()=>localStorage.clear());
    await page.reload();
    await upload(page,roundtrip);
    await page.locator('#applyRestore:not([disabled])').click();
    assert.deepEqual(JSON.parse(await stored(page))[label.card_id].outer,label.outer);
    await upload(page,roundtrip);
    await page.locator('#restorePreview:not([hidden])').waitFor();
    assert.equal(await page.locator('#applyRestore').isDisabled(),true);
    assert.match(await page.locator('#restoreRows').textContent(),/overslaan/);
    const conflictState=await stored(page);
    await upload(page,'{"labels":[');
    await page.waitForFunction(()=>document.querySelector('#restoreStatus').textContent.includes('Niet geïmporteerd'));
    assert.equal(await stored(page),conflictState);
    assert.equal(await page.locator('#applyRestore').isDisabled(),true);
    // Unsaved current-card notes/geometry are conflicts too; they are never overwritten.
    await page.evaluate(()=>localStorage.clear());
    await page.reload();
    await page.locator('#note').fill('FICTIONAL unsaved draft');
    await upload(page,JSON.stringify({version:'centering-gold-v16',labels:[{...label,card_id:'A-B03-P5'}]}));
    await page.locator('#restorePreview:not([hidden])').waitFor();
    assert.equal(await page.locator('#applyRestore').isDisabled(),true);
    assert.equal(await stored(page),null);
    await upload(page);
    await page.locator('#restorePreview:not([hidden])').waitFor();
    await page.locator('#note').fill('FICTIONAL changed since preview');
    await page.locator('#applyRestore').click();
    assert.match(await status(page).textContent(),/gewijzigd/);
    assert.equal(await stored(page),null);
    // Changes to storage before preview and after preview both fail closed.
    await page.reload();
    await page.evaluate(key=>localStorage.setItem(key,'{}'),key);
    await upload(page);
    await page.waitForFunction(()=>document.querySelector('#restoreStatus').textContent.includes('Niet geïmporteerd'));
    assert.match(await status(page).textContent(),/ander tabblad/);
    await page.reload();
    await upload(page);
    await page.locator('#restorePreview:not([hidden])').waitFor();
    await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({fictional:{note:'other tab'}})),key);
    await page.locator('#applyRestore').click();
    assert.match(await status(page).textContent(),/gewijzigd/);
    assert.equal(await stored(page),'{"fictional":{"note":"other tab"}}');
    // Explicit Reset AI adopts the current crop and requires confirmation again.
    await page.evaluate(()=>localStorage.clear());
    await page.reload();
    await upload(page);
    await page.locator('#applyRestore:not([disabled])').click();
    for (let i=0;i<8;i++) await page.locator('#next').click();
    assert.match(await page.locator('#img').getAttribute('src'),/cards\/v15\//);
    await page.locator('#reset').click();
    assert.equal((await page.locator('#img').getAttribute('src')).includes('/v15/'),false);
    await page.locator('#next').click();
    const resetState=JSON.parse(await stored(page))[label.card_id];
    assert.equal(resetState.confirmed,false);
    assert.equal(resetState.asset_revision,16);
    assert.equal(resetState.note,label.note);
    // Quota failure leaves both persisted data and the live draft untouched.
    await page.evaluate(()=>localStorage.clear());
    await page.reload();
    await upload(page);
    await page.locator('#restorePreview:not([hidden])').waitFor();
    await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('FICTIONAL quota','QuotaExceededError');};});
    await page.locator('#applyRestore').click();
    assert.match(await status(page).textContent(),/Niet geïmporteerd/);
    assert.equal(await stored(page),null);
    assert.deepEqual(errors,[]);
    console.log(`RESTORE_BROWSER_OK ${name}: preview/cancel, roundtrip, conflicts, drafts, stale storage, quota, text escaping`);
    await context.close();
  } finally { await browser.close(); }
}
