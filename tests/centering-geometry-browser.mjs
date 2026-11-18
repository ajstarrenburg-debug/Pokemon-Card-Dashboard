import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium,firefox,webkit} from 'playwright';

const source=await readFile(new URL('../review.js',import.meta.url),'utf8');
const fixtures=JSON.parse(await readFile(new URL('./fixtures/centering-geometry.json',import.meta.url),'utf8'));
const perspective=fixtures.find(test=>test.group==='capability_gap').state;
const invalid=fixtures.find(test=>test.group==='validation_gap').state;
const demo=fixtures[0].state;
const polygon=q=>['TL','TR','BR','BL'].map(k=>`${q[k].x},${q[k].y}`).join(' ');
const image=`<svg xmlns="http://www.w3.org/2000/svg" width="630" height="880"><rect width="630" height="880" fill="#273744"/><polygon points="${polygon(perspective.outer)}" fill="#f0cd2d"/><polygon points="${polygon(perspective.inner)}" fill="#4b7db4"/></svg>`;
// The hook is appended only to the intercepted test response, never shipped.
const hook=`\nwindow.geometryTest={
  setState(value){idx=0;cur={...stateFor(ITEMS[0]),...value,card_id:ITEMS[0].card_id};activeLayer='both';$('mode').value=cur.mode;updateTilt();updateGeom();},
  state(){return JSON.parse(JSON.stringify(cur));},
  addInvalidSaved(value){saved[ITEMS[1].card_id]={...stateFor(ITEMS[1]),...value,card_id:ITEMS[1].card_id,confirmed:true};}
};`;

for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
  const browser=await engine.launch({headless:true});
  try{
    for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
      const context=await browser.newContext({viewport,acceptDownloads:true});
      const page=await context.newPage();const errors=[];let downloadCount=0;
      page.on('pageerror',error=>errors.push(String(error)));
      page.on('download',()=>downloadCount++);
      await page.route('**/cards/**',route=>route.fulfill({contentType:'image/svg+xml',body:image}));
      await page.route('**/review.js*',route=>route.fulfill({contentType:'application/javascript',body:source+hook}));
      await page.goto('http://127.0.0.1:4173/review.html');
      await page.waitForFunction(()=>window.geometryTest&&document.getElementById('img').complete);
      await page.evaluate(state=>window.geometryTest.setState(state),perspective);
      assert.equal(await page.locator('#lr').textContent(),'42,9 / 57,1');
      assert.equal(await page.locator('#tb').textContent(),'50,0 / 50,0');
      assert.equal(await page.locator('#save').isEnabled(),true);
      assert.equal(await page.locator('#measureGroup .measureSegment').count(),12);
      const state=await page.evaluate(()=>window.geometryTest.state());
      assert.deepEqual(state.outer,perspective.outer);assert.deepEqual(state.inner,perspective.inner);
      await page.screenshot({path:`browser-${name}-perspective-${viewport.width}.png`,fullPage:true});

      await page.evaluate(state=>window.geometryTest.setState(state),invalid);
      assert.equal(await page.locator('#lr').textContent(),'—');
      assert.equal(await page.locator('#tb').textContent(),'—');
      assert.equal(await page.locator('#save').isDisabled(),true);
      assert.equal(await page.locator('#export').isDisabled(),true);
      assert.equal(await page.locator('#measurementWarning').isVisible(),true);
      await page.evaluate(()=>document.getElementById('save').onclick());
      assert.equal(await page.evaluate(()=>localStorage.getItem('pokemon_centering_gold_v16')),null);
      await page.screenshot({path:`browser-${name}-invalid-${viewport.width}.png`,fullPage:true});

      await page.evaluate(state=>window.geometryTest.setState(state),demo);
      assert.equal(await page.locator('#save').isEnabled(),true);
      assert.equal(await page.locator('#measurementWarning').isHidden(),true);
      const downloadPromise=page.waitForEvent('download');
      await page.locator('#export').click();const download=await downloadPromise;
      const payload=JSON.parse(await readFile(await download.path(),'utf8'));
      assert.equal(payload.measurement_method,'outer-card-plane-v2');
      assert.equal(payload.labels.length,1);
      assert.deepEqual(payload.labels[0].outer,demo.outer);
      assert.equal(payload.labels[0].student_target.centering.tb.first,50);
      assert.equal(payload.labels[0].student_target.outer_keypoints.length,12);

      await page.evaluate(state=>window.geometryTest.addInvalidSaved(state),invalid);
      const before=downloadCount;await page.locator('#export').click();
      assert((await page.locator('#measurementWarning').textContent()).includes('Export gestopt'));
      assert.equal(downloadCount,before);
      assert.deepEqual(errors,[]);
      await context.close();
      console.log(`GEOMETRY_BROWSER_OK ${name} ${viewport.width}px perspective, invalid, repair, export and original geometry`);
    }
  }finally{await browser.close();}
}
