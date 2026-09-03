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
const legacyMigrationState={
  'A-B03-P5':{
    card_id:'A-B03-P5',confirmed:true,mode:'inner_edge',tilt:1.35,tilt_ai:0,
    pivot:{x:302,y:431},pan:{x:7,y:-5},note:'behouden label',seed_revision:13,
    edits:{outer:true,inner:true,tilt:true},
    outer:{TL:{x:23,y:34},TR:{x:591,y:36},BR:{x:589,y:849},BL:{x:21,y:848}},
    inner:{TL:{x:42,y:51},TR:{x:565,y:50},BR:{x:563,y:833},BL:{x:43,y:835}}
  },
  'A-B07-P4':{
    card_id:'A-B07-P4',confirmed:false,mode:'reference_required',tilt:0.75,tilt_ai:0,
    pivot:{x:315,y:440},pan:{x:-3,y:4},note:'',seed_revision:13,
    edits:{outer:true,inner:false,tilt:true},
    outer:{TL:{x:25,y:30},TR:{x:600,y:31},BR:{x:599,y:850},BL:{x:25,y:849}},
    inner:{TL:{x:54,y:46},TR:{x:569,y:47},BR:{x:568,y:823},BL:{x:54,y:824}}
  }
};

function assert(condition,message) {
  if (!condition) throw new Error(message);
}

async function waitForCard(frame,cardId) {
  await frame.waitForFunction(function(expectedId) {
    const image=document.querySelector('#img');
    return document.querySelector('#title')?.textContent.startsWith(expectedId)
      && image?.dataset.cardId===expectedId
      && image.complete
      && image.naturalWidth===630
      && image.naturalHeight===880;
  },cardId);
}

for (const [name,engine] of Object.entries(engines)) {
  let browser;
  const result=results[name]={pass:false,errors:[]};
  try {
    browser=await engine.launch({headless:true});
    const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
    const page=await context.newPage();
    page.on('console',message=>{if(message.type()==='error')result.errors.push(message.text())});
    page.on('pageerror',error=>result.errors.push(String(error)));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
    const frame=page.frames().find(candidate=>candidate.url().includes('/review.html'));
    assert(frame,'review iframe missing');
    await waitForCard(frame,'A-B03-P5');
    await page.waitForTimeout(250);

    result.navigation=await page.evaluate(function() {
      const disabled=Array.from(document.querySelectorAll('.nav button[disabled]'));
      const activeLinks=Array.from(document.querySelectorAll('.nav a[href]'));
      return {
        disabledCount:disabled.length,
        allDisabledLabeled:disabled.every(button=>button.textContent.includes('Binnenkort')),
        enabledDeadButtons:document.querySelectorAll('.nav button:not([disabled])').length,
        activeLinks:activeLinks.map(link=>link.getAttribute('href')),
        queueButtons:document.querySelectorAll('.queueCard[data-card-id]').length
      };
    });

    result.queueNavigation=[];
    result.innerAvailability=[];
    for (const cardId of cardIds) {
      await page.locator('.queueCard[data-card-id="'+cardId+'"]').click();
      await waitForCard(frame,cardId);
      const state=await page.evaluate(function(expectedId) {
        const active=document.querySelectorAll('.queueCard.active');
        return active.length===1
          && active[0].dataset.cardId===expectedId
          && active[0].getAttribute('aria-current')==='true';
      },cardId);
      result.queueNavigation.push({cardId,state});
      const innerState=await frame.evaluate(function() {
        return {
          mode:document.querySelector('#mode').value,
          buttonEnabled:!document.querySelector('#showInner').disabled,
          layerVisible:getComputedStyle(document.querySelector('#innerGroup')).display!=='none',
          layout:document.querySelector('#meta').textContent,
          warning:document.querySelector('#warning').textContent
        };
      });
      result.innerAvailability.push({cardId,...innerState});
    }

    await page.locator('.queueCard[data-card-id="A-B03-P4"]').click();
    await waitForCard(frame,'A-B03-P4');
    result.lapras=await frame.evaluate(function() {
      const points=document.querySelector('#outerRect').getAttribute('points').split(' ').map(pair=>pair.split(',').map(Number));
      const xs=points.map(pair=>pair[0]);
      const ys=points.map(pair=>pair[1]);
      return {
        title:document.querySelector('#title').textContent,
        mode:document.querySelector('#mode').value,
        layout:document.querySelector('#meta').textContent,
        innerButtonEnabled:!document.querySelector('#showInner').disabled,
        innerVisible:getComputedStyle(document.querySelector('#innerGroup')).display!=='none',
        outerBox:{left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)}
      };
    });
    await page.screenshot({path:'browser-'+name+'-lapras.png',fullPage:true});

    await page.locator('.queueCard[data-card-id="A-B03-P5"]').click();
    await waitForCard(frame,'A-B03-P5');
    result.iframeHeight=await page.locator('#reviewFrame').evaluate(element=>element.getBoundingClientRect().height);

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
          image.src='cards/'+cardId+'.jpg?matrix=15';
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
        outerHaloWidth:getComputedStyle(document.querySelector('#outerHalo')).strokeWidth,
        innerHaloWidth:getComputedStyle(document.querySelector('#innerHalo')).strokeWidth,
        outerHaloDash:getComputedStyle(document.querySelector('#outerHalo')).strokeDasharray,
        innerHaloDash:getComputedStyle(document.querySelector('#innerHalo')).strokeDasharray,
        hitWidth:getComputedStyle(document.querySelector('#ihL')).strokeWidth,
        sideHandles:document.querySelectorAll('.sideHandle').length,
        tiltActive:document.querySelector('#showTilt').classList.contains('activeTilt'),
        controlsBesideCard:side.left>=card.right&&Math.abs(side.top-card.top)<24
      };
    });

    result.buttonLayout=await frame.evaluate(function() {
      const groups=['.layers','.tiltButtons'].map(function(selector) {
        const buttons=Array.from(document.querySelectorAll(selector+' button'));
        return {
          rows:new Set(buttons.map(button=>Math.round(button.getBoundingClientRect().top))).size,
          noOverflow:buttons.every(button=>button.scrollWidth<=button.clientWidth+1&&button.scrollHeight<=button.clientHeight+1)
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
        numericCells:Array.from(document.querySelectorAll('.measureTable tbody td:not(:first-child)')).filter(cell=>/^\d+,\d{2}$/.test(cell.textContent)).length,
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
    const exported=exportPayload.labels.find(label=>label.card_id==='A-B03-P5');
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
        measureChildren:document.querySelector('#measureGroup').childElementCount,
        loupeUsesOuter:document.querySelector('#loupeLabel').textContent.startsWith('Cyaan')
      };
    });

    result.scroll=await page.evaluate(function() {
      const before=window.scrollY;
      window.scrollTo(0,document.documentElement.scrollHeight);
      return {before,after:window.scrollY,max:document.documentElement.scrollHeight-window.innerHeight};
    });

    const mobile=await context.newPage();
    mobile.on('console',message=>{if(message.type()==='error')result.errors.push('mobile: '+message.text())});
    mobile.on('pageerror',error=>result.errors.push('mobile: '+String(error)));
    await mobile.setViewportSize({width:390,height:844});
    await mobile.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
    const mobileFrame=mobile.frames().find(candidate=>candidate.url().includes('/review.html'));
    assert(mobileFrame,'mobile review iframe missing');
    await waitForCard(mobileFrame,'A-B03-P5');
    result.mobile={
      dashboardNoHorizontalOverflow:await mobile.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),
      reviewNoHorizontalOverflow:await mobileFrame.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),
      buttonsNoOverflow:await mobileFrame.evaluate(()=>Array.from(document.querySelectorAll('.layers button,.tiltButtons button')).every(button=>button.scrollWidth<=button.clientWidth+1&&button.scrollHeight<=button.clientHeight+1)),
      imageVisible:await mobileFrame.locator('#img').isVisible()
    };
    await mobile.screenshot({path:'browser-'+name+'-mobile.png',fullPage:true});
    await mobile.close();

    const migrationContext=await browser.newContext({viewport:{width:1440,height:900}});
    await migrationContext.addInitScript(function(value) {
      localStorage.setItem('pokemon_centering_gold_v14',JSON.stringify(value));
    },legacyMigrationState);
    const migrationPage=await migrationContext.newPage();
    await migrationPage.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
    const migrationFrame=migrationPage.frames().find(candidate=>candidate.url().includes('/review.html'));
    assert(migrationFrame,'migration review iframe missing');
    await waitForCard(migrationFrame,'A-B03-P5');
    const readMigrationView=()=>migrationFrame.evaluate(function() {
      const points=function(selector) {
        return document.querySelector(selector).getAttribute('points').split(' ').map(pair=>pair.split(',').map(Number));
      };
      return {
        mode:document.querySelector('#mode').value,
        title:document.querySelector('#title').textContent,
        progress:document.querySelector('#prog').textContent,
        note:document.querySelector('#note').value,
        tilt:Number(document.querySelector('#tilt').value),
        pan:[Number(document.querySelector('#panX').value),Number(document.querySelector('#panY').value)],
        outer:points('#outerRect'),
        inner:points('#innerRect'),
        innerButtonEnabled:!document.querySelector('#showInner').disabled,
        innerVisible:getComputedStyle(document.querySelector('#innerGroup')).display!=='none'
      };
    });
    const confirmedView=await readMigrationView();
    await migrationPage.locator('.queueCard[data-card-id="A-B07-P4"]').click();
    await waitForCard(migrationFrame,'A-B07-P4');
    const conkeldurrView=await readMigrationView();
    await migrationFrame.locator('#next').click();
    const storedMigration=await migrationPage.evaluate(function() {
      const state=JSON.parse(localStorage.getItem('pokemon_centering_gold_v15'));
      return {
        confirmed:{
          confirmed:state['A-B03-P5'].confirmed,
          mode:state['A-B03-P5'].mode,
          tilt:state['A-B03-P5'].tilt,
          outer:state['A-B03-P5'].outer,
          inner:state['A-B03-P5'].inner
        },
        conkeldurr:{
          confirmed:state['A-B07-P4'].confirmed,
          mode:state['A-B07-P4'].mode,
          modeRevision:state['A-B07-P4'].mode_revision,
          tilt:state['A-B07-P4'].tilt,
          outer:state['A-B07-P4'].outer,
          inner:state['A-B07-P4'].inner
        }
      };
    });
    result.migration={confirmedView,conkeldurrView,storedMigration};
    await migrationContext.close();

    assert(result.navigation.disabledCount===10&&result.navigation.allDisabledLabeled&&result.navigation.enabledDeadButtons===0,'unfinished navigation is still presented as functional');
    assert(result.navigation.activeLinks.length===1&&result.navigation.activeLinks[0]==='#inner-review','active Inner Review route is missing');
    assert(result.navigation.queueButtons===16,'review queue is incomplete');
    assert(result.queueNavigation.length===16&&result.queueNavigation.every(item=>item.state),'one or more queue cards failed to navigate/sync');
    assert(result.innerAvailability.length===16&&result.innerAvailability.every(item=>item.mode==='inner_edge'&&item.buttonEnabled&&item.layerVisible),'one or more cards still hide the inner-border tool');
    assert(result.innerAvailability.find(item=>item.cardId==='A-B10-P5').warning.includes('AI-voorstel onbetrouwbaar'),'Black Belt manual-review warning is missing');
    assert(result.lapras.title.includes('A-B03-P4')&&result.lapras.mode==='inner_edge'&&result.lapras.layout.includes('illustration bordered'),'Lapras classification failed');
    assert(result.lapras.innerButtonEnabled&&result.lapras.innerVisible,'Lapras inner-border tool is unavailable');
    assert(result.lapras.outerBox.left>=40&&result.lapras.outerBox.right<=590&&result.lapras.outerBox.top>=80&&result.lapras.outerBox.bottom<=840,'Lapras crop still touches the review canvas');
    assert(result.allImages,'one or more review images failed');
    assert(result.initial.title.includes('A-B03-P5'),'wrong first card');
    assert(result.initial.natural[0]===630&&result.initial.natural[1]===880,'wrong image dimensions');
    assert(result.initial.instruction.includes('1px-kernlijn'),'measurement instruction missing');
    assert(result.initial.outerCoreWidth==='1px'&&result.initial.innerCoreWidth==='1px','true centerline is not 1px');
    assert(parseFloat(result.initial.outerHaloWidth)<=3&&parseFloat(result.initial.innerHaloWidth)<=3,'dashed guides are still too heavy');
    assert(result.initial.outerHaloDash!=='none'&&result.initial.innerHaloDash!=='none','dashed halos missing');
    assert(parseFloat(result.initial.hitWidth)>=30,'line hit target became too small');
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
    assert(result.export.filename.includes('v15')&&result.export.version==='centering-gold-v15'&&result.export.schema==='border-keypoints-v1'&&result.export.rule==='centerline_on_visual_transition','v0.15 export metadata failed');
    assert(result.export.outerPoints===12&&result.export.innerPoints===12,'student keypoints missing from export');
    assert(result.reference.innerHidden&&result.reference.innerButtonDisabled&&result.reference.measureButtonDisabled&&result.reference.measureChildren===0&&result.reference.loupeUsesOuter,'reference route failed');
    assert(result.scroll.max>0&&result.scroll.after>0,'dashboard does not scroll');
    assert(result.mobile.dashboardNoHorizontalOverflow&&result.mobile.reviewNoHorizontalOverflow&&result.mobile.buttonsNoOverflow&&result.mobile.imageVisible,'mobile layout failed');
    assert(result.migration.confirmedView.progress==='1 / 16 bevestigd'&&result.migration.confirmedView.note==='behouden label','legacy confirmed label or progress was not imported');
    assert(result.migration.confirmedView.tilt===1.35&&JSON.stringify(result.migration.confirmedView.pan)==='[7,-5]','confirmed tilt or pan changed during migration');
    assert(JSON.stringify(result.migration.confirmedView.outer)==='[[23,34],[591,36],[589,849],[21,848]]'&&JSON.stringify(result.migration.confirmedView.inner)==='[[42,51],[565,50],[563,833],[43,835]]','confirmed geometry changed during migration');
    assert(result.migration.conkeldurrView.mode==='inner_edge'&&result.migration.conkeldurrView.innerButtonEnabled&&result.migration.conkeldurrView.innerVisible,'Conkeldurr mode was not safely upgraded');
    assert(result.migration.conkeldurrView.tilt===0.75&&JSON.stringify(result.migration.conkeldurrView.pan)==='[-3,4]','unconfirmed Conkeldurr positioning changed during migration');
    assert(JSON.stringify(result.migration.conkeldurrView.outer)==='[[25,30],[600,31],[599,850],[25,849]]'&&JSON.stringify(result.migration.conkeldurrView.inner)==='[[54,46],[569,47],[568,823],[54,824]]','unconfirmed Conkeldurr geometry changed during mode upgrade');
    assert(result.migration.storedMigration.confirmed.confirmed&&result.migration.storedMigration.confirmed.tilt===1.35,'confirmed state was not persisted to v0.15');
    assert(!result.migration.storedMigration.conkeldurr.confirmed&&result.migration.storedMigration.conkeldurr.mode==='inner_edge'&&result.migration.storedMigration.conkeldurr.modeRevision===15&&result.migration.storedMigration.conkeldurr.tilt===0.75,'upgraded Conkeldurr state was not persisted safely');
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

if (!Object.values(results).every(result=>result.pass)) process.exit(1);
