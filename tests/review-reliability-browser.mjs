import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium,firefox,webkit} from 'playwright';
const origin='http://127.0.0.1:4173';
for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
  const browser=await engine.launch({headless:true});
  try{
    for(const width of [1440,390]){
      const context=await browser.newContext({viewport:{width,height:1000},acceptDownloads:true});
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
      await page.goto(origin+'/');
      const frame=page.frameLocator('#reviewFrame');
      await frame.locator('#img').waitFor({state:'visible'});
      await frame.locator('#showOuter').click();
      assert.equal(await frame.locator('#outerRect').getAttribute('points'),'59,52 619,62 605,839 45,831');
      assert.equal(await frame.locator('#innerGroup').evaluate(el=>el.classList.contains('locked')),true);
      assert.equal(await frame.locator('#showOuter').getAttribute('aria-pressed'),'true');
      const original=await frame.locator('#outerRect').getAttribute('points');
      await frame.locator('#save').click();
      await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pokemon_centering_gold_v16'))?.['A-B03-P5']?.confirmed===true);
      await frame.locator('#prev').click();
      assert((await frame.locator('#warning').textContent()).includes('Bevestigde meting.'));
      await frame.locator('#showOuter').click();await frame.locator('#nudgeIn').click();
      await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pokemon_centering_gold_v16'))?.['A-B03-P5']?.confirmed===false);
      assert(!(await frame.locator('#warning').textContent()).includes('Bevestigde meting.'));
      const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('pokemon_centering_gold_v16'))['A-B03-P5']);
      assert.equal(stored.student_target.source,'ai_seed');assert.equal(stored.confirmation_history[0].confirmed,true);
      assert.equal(['TL','TR','BR','BL'].map(k=>`${stored.confirmation_history[0].outer[k].x},${stored.confirmation_history[0].outer[k].y}`).join(' '),original);
      await page.reload();
      await frame.locator('#img').waitFor({state:'visible'});
      assert((await frame.locator('#reviewStatus').textContent()).includes('Voorstel'));
      assert.equal(await frame.locator('#outerRect').getAttribute('points'),['TL','TR','BR','BL'].map(k=>`${stored.outer[k].x},${stored.outer[k].y}`).join(' '));
      await frame.locator('#mode').selectOption('not_measurable');
      assert.equal(await frame.locator('#save').isDisabled(),true);
      assert.equal(await frame.locator('#lr').textContent(),'niet meetbaar');
      await frame.locator('#undo').click();
      assert.equal(await frame.locator('#mode').inputValue(),'inner_edge');
      assert(!(await frame.locator('#warning').textContent()).includes('Niet betrouwbaar meetbaar'));
      await frame.locator('#showBoth').click();
      await page.waitForTimeout(300);
      const height=await page.locator('#reviewFrame').evaluate(el=>({outer:el.clientHeight,inner:el.contentDocument.documentElement.scrollHeight}));
      assert(height.inner<=height.outer+2,`${name} ${width}: iframe clips lower controls (${JSON.stringify(height)})`);
      for(const id of ['alignmentDetails','measurementDetails']){
        await frame.locator('#'+id+' summary').click();
        await page.waitForFunction(()=>{const f=document.querySelector('#reviewFrame');return f.contentDocument.documentElement.scrollHeight<=f.clientHeight+2;});
      }
      for(const id of ['alignmentDetails','measurementDetails'])await frame.locator('#'+id+' summary').click();
      await page.screenshot({path:`browser-${name}-reliable-gengar-${width}.png`,fullPage:true});
      assert.deepEqual(errors,[]);
      await context.close();
      console.log(`RELIABILITY_BROWSER_OK ${name} ${width}px real Gengar, confirmation, archive, autosave, reload, mode, undo and full-height iframe`);
    }
    const context=await browser.newContext({acceptDownloads:true});
    await context.addInitScript(()=>localStorage.setItem('pokemon_centering_gold_v16','null'));
    const page=await context.newPage();await page.goto(origin+'/review.html');
    await page.locator('#storageWarning').waitFor({state:'visible'});
    assert.equal(await page.locator('#save').isDisabled(),true);
    const downloadPromise=page.waitForEvent('download');await page.locator('#backup').click();
    const download=await downloadPromise;const recovered=JSON.parse(await readFile(await download.path(),'utf8'));
    assert.equal(recovered.original_storage,'null');assert.equal(recovered.backup_only,true);
    assert.equal(await page.evaluate(()=>localStorage.getItem('pokemon_centering_gold_v16')),'null');
    await context.close();
    console.log(`RECOVERY_BROWSER_OK ${name} corrupt storage preserved and downloadable`);
  }finally{await browser.close();}
}
