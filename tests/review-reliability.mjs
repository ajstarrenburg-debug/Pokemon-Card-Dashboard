import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {app} from './helpers/review-app.mjs';
import {buildDataset} from '../tools/build_student_dataset.mjs';
const source=readFileSync(new URL('../review.js',import.meta.url),'utf8');
const clone=value=>JSON.parse(JSON.stringify(value));
const boot=(initial={})=>{const a=app(source,initial);a.loadImage();return a;};
const exported=a=>clone(a.run('saved[ITEMS[0].card_id]'));
const payload=labels=>({schema:'border-keypoints-v1',measurement_rule:'centerline_on_visual_transition',labels});
let count=0;
function test(name,fn){fn();count++;console.log('RELIABILITY_OK '+name);}
function drag(a,layer,key,dx,dy){
  const start=a.run("sidePoint(cur[testLayer],testKey,.5)",{testLayer:layer,testKey:key});
  a.el('svg').listeners.pointerdown({target:{dataset:{layer,side:key},setPointerCapture(){}},pointerId:1,clientX:start.x,clientY:start.y,preventDefault(){}});
  a.el('svg').listeners.pointermove({clientX:start.x+dx,clientY:start.y+dy,preventDefault(){}});
  a.el('svg').listeners.pointerup();
}
test('loaded-image gate',()=>{
  const a=app(source);assert.equal(a.run('persist(true)'),false);assert.equal(a.writes.length,0);
  a.loadImage();assert.equal(a.run('persist(true)'),true);
  a.el('img').onerror();assert.equal(a.run('persist(true)'),false);
});
test('changed Gold becomes draft with original archived',()=>{
  const a=boot();assert.equal(a.run('persist(true)'),true);const old=exported(a);
  drag(a,'inner','L',2,0);const state=exported(a);
  assert.equal(state.confirmed,false);assert.equal(state.student_target.source,'ai_seed');
  assert.deepEqual(state.confirmation_history[0].inner,old.inner);
  assert.equal(state.confirmation_history[0].confirmed,true);
});
test('reset cannot turn proposals into Gold',()=>{
  const a=boot();a.run('persist(true)');a.el('reset').onclick();a.runTimers();
  assert.equal(exported(a).confirmed,false);assert.equal(exported(a).student_target.source,'ai_seed');
});
test('autosave survives reload and note edits',()=>{
  const a=boot();a.el('panX').value='12';a.el('panX').listeners.input();a.el('note').value='synthetic test';a.el('note').listeners.input();a.runTimers();
  const restored=boot(Object.fromEntries(a.storage));assert.equal(restored.run('cur.pan.x'),12);assert.equal(restored.run('cur.note'),'synthetic test');
});
test('page exit flushes last pending edit',()=>{
  const a=boot();a.el('panY').value='7';a.el('panY').listeners.input();a.windowEvents.pagehide();
  assert.equal(exported(a).pan.y,7);
});
test('storage failure is visible and transactional',()=>{
  const a=boot();a.run("localStorage.setItem=function(){throw new Error('QuotaExceededError')}");
  assert.equal(a.run('persist(true)'),false);assert.equal(a.run('cur.confirmed'),false);assert.equal(a.run('Object.keys(saved).length'),0);
  assert(a.el('storageWarning').textContent.includes('Opslaan mislukt'));
});
test('corrupt and wrong-shaped storage is preserved',()=>{
  for(const raw of ['null','[]','{broken']){
    const a=boot({pokemon_centering_gold_v16:raw});assert.equal(a.run('persist(false)'),false);
    assert.equal(a.storage.get('pokemon_centering_gold_v16'),raw);assert.equal(a.writes.length,0);
    a.el('backup').onclick();assert.equal(a.downloads.length,1);
  }
});
test('outer drag leaves print geometry untouched',()=>{
  const a=boot(),before=clone(a.run('cur.inner'));drag(a,'outer','L',28,0);
  assert.deepEqual(clone(a.run('cur.inner')),before);assert.equal(a.run('cur.edits.inner'),false);
});
test('loupe projects selected line instead of cursor',()=>{
  const a=boot();a.run("cur.outer=quadFromBox({L:22,R:590,T:35,B:850});setLoupe('outer','L',{x:32,y:440});");
  const white=a.ctx.paths.find(path=>path.color==='#fff');assert.equal(white.points[0][0],280);assert.equal(white.points[1][0],280);
});
test('undo restores mode, warning and keyboard edits',()=>{
  const a=boot();a.el('mode').value='reference_required';a.el('mode').onchange();a.el('undo').onclick();
  assert.equal(a.run('cur.mode'),'inner_edge');assert(!a.el('warning').innerHTML.includes('Reference/template gekozen'));
  a.el('tilt').value='1.2';a.el('tilt').listeners.input();a.el('undo').onclick();assert.equal(a.run('cur.tilt'),0);
});
test('unmeasurable is excluded and needs a skip reason',()=>{
  const a=boot();a.el('mode').value='not_measurable';a.el('mode').onchange();
  assert.equal(a.el('lr').textContent,'niet meetbaar');assert.equal(a.el('save').disabled,true);assert.equal(a.run('persist(true)'),false);
  a.el('skip').onclick();assert.equal(a.run('idx'),0);a.el('note').value='glare';a.el('skip').onclick();assert.equal(a.run('idx'),1);
  assert.equal(exported(a).student_target.source,'excluded');assert.equal(exported(a).confirmed,false);
});
test('unknown records stop label export without losing recovery',()=>{
  const a=boot();a.run("saved.UNKNOWN={card_id:'UNKNOWN',confirmed:false}");a.el('export').onclick();
  assert.equal(a.downloads.length,0);assert(a.el('measurementWarning').textContent.includes('UNKNOWN'));
  a.el('backup').onclick();assert.equal(a.downloads.length,1);
});
test('clamping does not create negative image coordinates',()=>{
  const a=boot();const q=a.run('const q=quadFromBox({L:0,R:0,T:0,B:880});clampQuad(q);q');
  for(const p of Object.values(q))assert(p.x>=0&&p.x<=630&&p.y>=0&&p.y<=880);
});
test('opposite widths share physical cross sections',()=>{
  const a=boot();const m=a.run("buildMeasurements({outer:quadFromBox({L:0,R:630,T:0,B:880}),inner:{TL:point(50,40),TR:point(590,60),BR:point(570,840),BL:point(30,820)}})");
  assert.equal(m.valid,true);
  for(let i=0;i<3;i++){assert(Math.abs(m.bySide.L[i].inner.y-m.bySide.R[i].inner.y)<1e-9);assert(Math.abs(m.bySide.T[i].inner.x-m.bySide.B[i].inner.x)<1e-9);}
});
test('measurement endpoints have explicit separate export series',()=>{
  const a=boot();a.run('persist(true)');const target=exported(a).student_target;
  assert.equal(target.measurement_points.outer.length,12);assert.equal(target.measurement_points.inner.length,12);
  assert.equal(target.measurement_sample_space,'rectified_common_cross_sections');assert.equal(target.keypoint_sample_space,'review_canvas');
});
test('reviewed proposal preserves confirmed and manual labels',()=>{
  const a=boot();const seed=clone(a.run('cur'));assert.equal(seed.outer.TL.x,59);assert.equal(seed.proposal_revision,1);
  for(const confirmed of [true,false]){
    const legacy={...seed,confirmed,proposal_revision:0,edits:{},outer:{TL:{x:23,y:34},TR:{x:591,y:36},BR:{x:589,y:849},BL:{x:21,y:848}}};
    const b=boot({pokemon_centering_gold_v16:JSON.stringify({[seed.card_id]:legacy})});
    assert.deepEqual(clone(b.run('cur.outer')),legacy.outer);
  }
});
test('legacy image reset never adopts new image proposal coordinates',()=>{
  const a=boot();const seed=clone(a.run("stateFor(ITEMS.find(item=>item.seed_revision===16))"));
  const legacy={...seed,confirmed:true,asset_revision:15,seed_revision:13,tilt:1.25,outer:{TL:{x:23,y:34},TR:{x:591,y:36},BR:{x:589,y:849},BL:{x:21,y:848}}};
  delete legacy.ai_outer;delete legacy.ai_inner;delete legacy.tilt_ai;
  const b=boot({pokemon_centering_gold_v16:JSON.stringify({[seed.card_id]:legacy})});
  b.run("idx=ITEMS.findIndex(item=>item.card_id==='"+seed.card_id+"');cur=stateFor(ITEMS[idx]);render();");
  b.el('reset').onclick();assert.deepEqual(clone(b.run('cur.outer')),legacy.outer);assert.equal(b.run('cur.tilt'),1.25);
});
test('keyboard edge correction is named and undoable',()=>{
  const a=boot();const handle=a.el('osL'),before=clone(a.run('cur.outer'));
  assert.equal(handle.getAttribute('tabindex'),'0');assert(handle.getAttribute('aria-label').includes('Buitenrand links'));
  handle.listeners.keydown({key:'ArrowRight',shiftKey:false,preventDefault(){}});assert.equal(a.run('cur.outer.TL.x'),before.TL.x+1);
  a.el('undo').onclick();assert.deepEqual(clone(a.run('cur.outer')),before);
});
test('dataset rejects malformed derived values and duplicate IDs',()=>{
  const a=boot();a.run('persist(true)');const valid=exported(a);assert.equal(buildDataset(payload([valid])).example_count,1);
  const bad=clone(valid);bad.student_target.centering.lr={first:999,second:-899};assert.throws(()=>buildDataset(payload([bad])),/ratio/);
  const badMm=clone(valid);badMm.student_target.measurements_mm.L=[null,-1];assert.throws(()=>buildDataset(payload([badMm])),/distances/);
  const duplicate=clone(valid);duplicate.student_target.outer_keypoints[1].id='L1';assert.throws(()=>buildDataset(payload([duplicate])),/duplicate/);
  const excluded=clone(valid);excluded.mode='not_measurable';const result=buildDataset(payload([valid,excluded]));assert.equal(result.example_count,1);assert.equal(result.excluded[0].reason,'not_measurable');
  assert.throws(()=>buildDataset({...payload([valid]),backup_only:true}),/backup/);
});
console.log(`REVIEW_RELIABILITY_OK ${count} independent production-flow checks`);
