// Actual production functions, fictional geometry, no source images or labels.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../review.js',import.meta.url),'utf8');
const boundary=source.indexOf("\n$('svg').addEventListener");
assert(boundary>0);
const elements=new Map();
let writes=0;
const context=vm.createContext({
  localStorage:{getItem(){return null;},setItem(){writes++;}},
  requestAnimationFrame(){},
  document:{getElementById(id){if(!elements.has(id))elements.set(id,{});return elements.get(id);}}
});
vm.runInContext(source.slice(0,boundary),context);
const api=vm.runInContext('({buildMeasurements,ratioSummary,buildStudentTarget,cardPlaneFor,persist,formatPct,ITEMS,stateFor})',context);
const fixtures=JSON.parse(readFileSync(new URL('./fixtures/centering-geometry.json',import.meta.url),'utf8'));
const same=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const item={card_id:'SYNTHETIC-GEOMETRY',seed_revision:16,layout:'standard_bordered',inner_geometry:'visible_border'};
for(const test of fixtures){
  const before=JSON.stringify(test.state);
  const measured=api.buildMeasurements(test.state);
  assert.equal(JSON.stringify(test.state),before,'measurement mutated annotation geometry');
  if(test.expected==='reject_invalid'){
    assert.equal(measured.valid,false,test.id);
    assert.deepEqual(Object.values(measured.bySide).map(side=>side.length),[0,0,0,0]);
    assert.throws(()=>api.buildStudentTarget(test.state,item),error=>error.code==='INVALID_MEASUREMENT_GEOMETRY');
  }else{
    assert.equal(measured.valid,true,test.id+': '+measured.error);
    const lr=api.ratioSummary(measured.bySide.L,measured.bySide.R);
    const tb=api.ratioSummary(measured.bySide.T,measured.bySide.B);
    same(lr.worst.first,test.expected.lr);same(tb.worst.first,test.expected.tb);
    same(lr.worst.first+lr.worst.second,100);
    const plane=api.cardPlaneFor(test.state.outer);
    for(const side of Object.values(measured.bySide))for(const sample of side){
      const roundTrip=plane.toImage(plane.toCard(sample.inner));
      same(roundTrip.x,sample.inner.x);same(roundTrip.y,sample.inner.y);
    }
    const target=api.buildStudentTarget(test.state,item);
    assert.equal(target.measurement_method,'outer-card-plane-v2');
    assert.equal(target.outer_keypoints.length,12);
    assert.equal(target.inner_keypoints.length,12);
  }
}

// Empty, non-finite and inconsistent margin samples never become 50/50.
for(const [a,b] of [[[],[]],[[{mm:0}],[{mm:0}]],[[{mm:NaN}],[{mm:2}]],[[{mm:-1}],[{mm:2}]],[[{mm:1}],[]]]){
  const result=api.ratioSummary(a,b);assert.equal(result.valid,false);assert.equal(result.worst,null);
}
same(api.ratioSummary([{mm:0}],[{mm:4}]).worst.first,0);

const demo=fixtures[0].state;
const bad=[
  {...demo,inner:{...demo.inner,TL:{x:NaN,y:40}}},
  {...demo,outer:{...demo.outer,TR:demo.outer.BL,BL:demo.outer.TR}},
  {...demo,inner:{...demo.inner,TR:demo.inner.BL,BL:demo.inner.TR}}
];
for(const state of bad)assert.equal(api.buildMeasurements(state).valid,false);

// General perspective with x and y terms: not just the vertical audit case.
const project=p=>{const d=1+.0002*p.x+.0003*p.y;return{x:(.75*p.x+.06*p.y+30)/d,y:(.02*p.x+.8*p.y+25)/d};};
const projected={...demo};
for(const key of ['outer','inner'])projected[key]=Object.fromEntries(Object.entries(demo[key]).map(([k,p])=>[k,project(p)]));
const general=api.buildMeasurements(projected);assert.equal(general.valid,true);
same(api.ratioSummary(general.bySide.L,general.bySide.R).worst.first,100*30/70);
same(api.ratioSummary(general.bySide.T,general.bySide.B).worst.first,50);

// A tilted inner print must survive the outer-only correction, not be squared up.
const slanted=fixtures.find(test=>test.id==='three_point_worst').state;
const slantedProjected={...slanted};
for(const key of ['outer','inner'])slantedProjected[key]=Object.fromEntries(Object.entries(slanted[key]).map(([k,p])=>[k,project(p)]));
for(const axis of [['L','R'],['T','B']]){
  const base=api.buildMeasurements(slanted),transformed=api.buildMeasurements(slantedProjected);
  const expected=api.ratioSummary(base.bySide[axis[0]],base.bySide[axis[1]]);
  const actual=api.ratioSummary(transformed.bySide[axis[0]],transformed.bySide[axis[1]]);
  actual.samples.forEach((value,index)=>same(value.first,expected.samples[index].first));
}

// Failed confirmation does not touch the live record, confirmation flag or storage.
context.invalidState={...fixtures.find(test=>test.group==='validation_gap').state,card_id:api.ITEMS[0].card_id,confirmed:false,edits:{}};
vm.runInContext('cur=invalidState; idx=0; saved={};',context);
const before=JSON.stringify(context.invalidState);
assert.equal(api.persist(true),false);assert.equal(writes,0);
assert.equal(JSON.stringify(context.invalidState),before);
assert.equal(vm.runInContext('Object.keys(saved).length',context),0);

// Every shipped initial proposal remains numerically measurable.
for(const entry of api.ITEMS){
  const state=api.stateFor(entry);
  if(state.mode==='inner_edge')assert.equal(api.buildMeasurements(state).valid,true,entry.card_id);
}
console.log(`CENTERING_GEOMETRY_OK ${fixtures.length} audited cases, general perspective, tilted print, invalid inputs, export and no-write guard`);
