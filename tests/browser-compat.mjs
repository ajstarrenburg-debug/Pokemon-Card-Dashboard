import { chromium, firefox, webkit } from 'playwright';
import { readFile } from 'node:fs/promises';

const engines={chromium,firefox,webkit};
const cardIds=[
  'A-B03-P5','A-B12-P5','A-B13-P1','A-B14-P6',
  'A-B03-P4','A-B07-P4','A-B10-P6','A-B16-P5',
  'A-B01-P5','A-B05-P4','A-B15-P1','A-B15-P2',
  'A-B04-P6','A-B09-P4','A-B10-P5','A-B13-P6'
];
const results={};

function assert(condition,message) {
  if (!condition) throw new Error(message);
}

for (const entry of Object.entries(engines)) {
  const name=entry[0];
  const engine=entry[1];
  let browser;
  const result=results[name]={pass:false,errors:[]};
  try {
    browser=await engine.launch({headless:true});
    const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
    const page=await context.newPage();
    page.on('console',function(message) {
      if(message.type()==='error')result.errors.push(message.text());
    });
    page.on('pageerror',function(error) {
      result.errors.push(String(error));
    });
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
    const frame=page.frames().find(function(candidate) {
      return candidate.url().includes('/review.html');
    });
    assert(frame,'review iframe missing');
    await frame.waitForFunction(function() {
      const image=document.querySelector('#img');
      return image && image.complete && image.naturalWidth===630 && image.naturalHeight===880;
    });
    await page.waitForTimeout(250);
    result.iframeHeight=await page.locator('#reviewFrame').evaluate(function(element) {
      return element.getBoundingClientRect().height;
    });

    result.allImages=await frame.evaluate(async function(ids) {
      const checks=await Promise.all(ids.map(function(cardId) {
        return new Promise(function(resolve) {
          const image=new Image();
          image.onload=async function() {
            try {
              await image.decode();
              resolve(image.naturalWidth===630&&image.naturalHeight===880);
            } catch (_) {
              resolve(false);
            }
          };
          image.onerror=function() { resolve(false); };
          image.src='cards/'+cardId+'.jpg?matrix=13';
        });
      }));
      return checks.every(Boolean);
    },cardIds);

    result.initial=await frame.evaluate(function() {
      const card=document.querySelector('.cardwrap').getBoundingClientRect();
      const side=document.querySelector('.side').getBoundingClientRect();
      return {
        title:document.querySelector('#title').textContent,
        natural:[document.querySelector('#img').naturalWidth,document.querySelector('#img').naturalHeight],
        instruction:document.querySelector('#instruction').textContent,
        outerCoreWidth:getComputedStyle(document.querySelector('#outerRect')).strokeWidth,
        innerCoreWidth:getComputedStyle(document.querySelector('#innerRect')).strokeWidth,
        outerHaloDash:getComputedStyle(document.querySelector('#outerHalo')).strokeDasharray,
        innerHaloDash:getComputedStyle(document.querySelector('#innerHalo')).strokeDasharray,
        sideHandles:document.querySelectorAll('.sideHandle').length,
        tiltActive:document.querySelector('#showTilt').classList.contains('activeTilt'),
        controlsBesideCard:side.left>=card.right&&Math.abs(side.top-card.top)<24
      };
    });

    result.buttonLayout=await frame.evaluate(function() {
      const groups=['.layers','.tiltButtons'].map(function(selector) {
        const buttons=Array.from(document.querySelectorAll(selector+' button'));
        return {
          rows:new Set(buttons.map(function(button) { return Math.round(button.getBoundingClientRect().top); })).size,
          noOverflow:buttons.every(function(button) {
            return button.scrollWidth<=button.clientWidth+1&&button.scrollHeight<=button.clientHeight+1;
          })
        };
      });
      return {layers:groups[0],tilt:groups[1]};
    });

    await frame.locator('#showBoth').click();
    result.measurements=await frame.evaluate(function() {
      return {
        segments:document.querySelectorAll('#measureGroup .measureSegment').length,
        outerPoints:document.querySelectorAll('#measureGroup .measureOuterPoint').length,
        innerPoints:document.querySelectorAll('#measureGroup .measureInnerPoint').length,
        labels:document.querySelectorAll('#measureGroup .measureLabel').length,
        numericCells:Array.from(document.querySelectorAll('.measureTable tbody td:not(:first-child)')).filter(function(cell) {
          return /^\d+,\d{2}$/.test(cell.textContent);
        }).length,
        lr:document.querySelector('#lr').textContent,
        tb:document.querySelector('#tb').textContent
      };
    });

    const outerBeforePan=await frame.locator('#outerRect').getAttribute('points');
    await frame.locator('#panX').evaluate(function(element) {
      element.value='24';
      element.dispatchEvent(new Event('input',{bubbles:true}));
    });
    await frame.locator('#panY').evaluate(function(element) {
      element.value='-18';
      element.dispatchEvent(new Event('input',{bubbles:true}));
    });
    result.pan=await frame.evaluate(function(before) {
      return {
        transform:document.querySelector('#imagePan').style.transform,
        xValue:document.querySelector('#panXValue').textContent,
        yValue:document.querySelector('#panYValue').textContent,
        guidesStayedFixed:document.querySelector('#outerRect').getAttribute('points')===before
      };
    },outerBeforePan);
    await frame.locator('#panReset').click();

    await frame.locator('#tilt').evaluate(function(element) {
      element.value='1.25';
      element.dispatchEvent(new Event('input',{bubbles:true}));
    });
    result.tilt=await frame.evaluate(function() {
      return {
        transform:document.querySelector('#img').style.transform,
        value:document.querySelector('#tiltValue').textContent,
        guidesVisible:getComputedStyle(document.querySelector('#levelGuide')).display!=='none'
      };
    });
    await frame.locator('#tiltAI').click();

    await frame.locator('#showOuter').click();
    const innerBefore=await frame.locator('#innerRect').getAttribute('points');
    const innerHit=frame.locator('#ihL');
    const innerBox=await innerHit.boundingBox();
    assert(innerBox,'inner drag target missing');
    await page.mouse.move(innerBox.x+innerBox.width/2,innerBox.y+innerBox.height/2);
    await page.mouse.down();
    await page.mouse.move(innerBox.x+innerBox.width/2+12,innerBox.y+innerBox.height/2,{steps:4});
    await page.mouse.up();
    result.directInnerDrag=await frame.evaluate(function(before) {
      return {
        moved:document.querySelector('#innerRect').getAttribute('points')!==before,
        selected:document.querySelector('#showInner').classList.contains('activeInner'),
        source:document.querySelector('#measureSource').textContent,
        loupeReady:document.querySelector('#loupe').dataset.ready
      };
    },innerBefore);

    const cornerBefore=await frame.locator('#innerRect').getAttribute('points');
    const corner=frame.locator('#iTL');
    const cornerBox=await corner.boundingBox();
    assert(cornerBox,'inner corner missing');
    await page.mouse.move(cornerBox.x+cornerBox.width/2,cornerBox.y+cornerBox.height/2);
    await page.mouse.down();
    await page.mouse.move(cornerBox.x+cornerBox.width/2+7,cornerBox.y+cornerBox.height/2-8,{steps:4});
    await page.mouse.up();
    result.quadMoved=(await frame.locator('#innerRect').getAttribute('points'))!==cornerBefore;

    await frame.locator('#toggleMeasures').click();
    result.measureToggle=await frame.evaluate(function() {
      return {
        pressed:document.querySelector('#toggleMeasures').getAttribute('aria-pressed'),
        children:document.querySelector('#measureGroup').childElementCount
      };
    });
    await frame.locator('#toggleMeasures').click();

    const downloadPromise=page.waitForEvent('download');
    await frame.locator('#export').click();
    const download=await downloadPromise;
    const downloadPath=await download.path();
    const exportPayload=JSON.parse(await readFile(downloadPath,'utf8'));
    const exported=exportPayload.labels.find(function(label) { return label.card_id==='A-B03-P5'; });
    result.export={
      filename:download.suggestedFilename(),
      version:exportPayload.version,
      schema:exportPayload.schema,
      rule:exportPayload.measurement_rule,
      outerPoints:exported.student_target.outer_keypoints.length,
      innerPoints:exported.student_target.inner_keypoints.length
    };

    await frame.locator('#mode').selectOption('reference_required');
    result.reference=await frame.evaluate(function() {
      return {
        innerHidden:getComputedStyle(document.querySelector('#innerGroup')).display==='none',
        innerButtonDisabled:document.querySelector('#showInner').disabled,
        measureButtonDisabled:document.querySelector('#toggleMeasures').disabled,
        measureChildren:document.querySelector('#measureGroup').childElementCount
      };
    });

    result.scroll=await page.evaluate(function() {
      const before=window.scrollY;
      window.scrollTo(0,document.documentElement.scrollHeight);
      return {before:before,after:window.scrollY,max:document.documentElement.scrollHeight-window.innerHeight};
    });

    assert(result.allImages,'one or more review images failed');
    assert(result.initial.title.includes('A-B03-P5'),'wrong first card');
    assert(result.initial.natural[0]===630&&result.initial.natural[1]===880,'wrong image dimensions');
    assert(result.initial.instruction.includes('1px-kernlijn'),'measurement instruction missing');
    assert(result.initial.outerCoreWidth==='1px'&&result.initial.innerCoreWidth==='1px','true centerline is not 1px');
    assert(result.initial.outerHaloDash!=='none'&&result.initial.innerHaloDash!=='none','dashed halos missing');
    assert(result.initial.sideHandles===8,'visible side handles missing');
    assert(result.initial.tiltActive,'tilt should be first step');
    assert(result.initial.controlsBesideCard,'controls should stay beside card on desktop');
    assert(result.buttonLayout.layers.rows===2&&result.buttonLayout.tilt.rows===2&&result.buttonLayout.layers.noOverflow&&result.buttonLayout.tilt.noOverflow,'button text overlaps or four-button row did not wrap');
    assert(result.iframeHeight>=700&&result.iframeHeight<=2600,'review iframe height is unstable');
    assert(result.measurements.segments===12&&result.measurements.outerPoints===12&&result.measurements.innerPoints===12&&result.measurements.labels===12,'measurement overlay is incomplete');
    assert(result.measurements.numericCells===12,'millimeter table is incomplete');
    assert(result.pan.transform.includes('translate(')&&result.pan.xValue.includes('+24')&&result.pan.yValue.includes('-18')&&result.pan.guidesStayedFixed,'image pan failed');
    assert(result.tilt.transform==='rotate(1.25deg)'&&result.tilt.value.includes('1,25')&&result.tilt.guidesVisible,'tilt workflow failed');
    assert(result.directInnerDrag.moved&&result.directInnerDrag.selected&&result.directInnerDrag.source==='Gold-correctie'&&result.directInnerDrag.loupeReady==='1','direct magenta drag or loupe failed');
    assert(result.quadMoved,'independent corner movement failed');
    assert(result.measureToggle.pressed==='false'&&result.measureToggle.children===0,'measurement toggle failed');
    assert(result.export.filename.includes('v13')&&result.export.version==='centering-gold-v13'&&result.export.schema==='border-keypoints-v1'&&result.export.rule==='centerline_on_visual_transition','v0.13 export metadata failed');
    assert(result.export.outerPoints===12&&result.export.innerPoints===12,'student keypoints missing from export');
    assert(result.reference.innerHidden&&result.reference.innerButtonDisabled&&result.reference.measureButtonDisabled&&result.reference.measureChildren===0,'reference route failed');
    assert(result.scroll.max>0&&result.scroll.after>0,'dashboard does not scroll');
    assert(result.errors.length===0,'browser errors: '+result.errors.join('; '));
    result.pass=true;
    await page.screenshot({path:'browser-'+name+'.png',fullPage:true});
  } catch (error) {
    result.fatal=String(error);
  } finally {
    if(browser)await browser.close();
  }
  console.log('RESULT '+name.toUpperCase()+' '+JSON.stringify(result));
}

if (!Object.values(results).every(function(result) { return result.pass; })) process.exit(1);
