// Fictional geometry/notes only. No collection scans or private export fixtures.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {MAX_RESTORE_BYTES,parseGoldExport,planGoldRestore,commitGoldRestore} from '../review-restore.js';
const source=readFileSync(new URL('../review.js',import.meta.url),'utf8');
const helpers=source.slice(0,source.indexOf('function snapshot()'));
const key='pokemon_centering_gold_v16';
const clone=value=>JSON.parse(JSON.stringify(value));
const context=vm.createContext({localStorage:{getItem:()=>null}});
vm.runInContext(helpers,context);
const items=JSON.parse(vm.runInContext('JSON.stringify(ITEMS)',context));
const rect=(l,r,t,b)=>({TL:{x:l,y:t},TR:{x:r,y:t},BR:{x:r,y:b},BL:{x:l,y:b}});
const label={card_id:items[8].card_id,mode:'inner_edge',confirmed:true,note:'FICTIONAL test note <script>example</script>',
  outer:rect(20,600,30,850),inner:rect(40,580,50,830),ai_outer:rect(21,599,31,849),ai_inner:rect(41,579,51,829),
  tilt:0.7,tilt_ai:0.2,tilt_deg:0.7,ai_tilt_deg:0.2,pivot:{x:301,y:420},pan:{x:7,y:-4},pan_x:7,pan_y:-4,
  edits:{outer:true,inner:true,tilt:true},asset_revision:15,seed_revision:13,mode_revision:15};
const payload=labels=>({version:'centering-gold-v16',schema:'border-keypoints-v1',measurement_rule:'centerline_on_visual_transition',sample_positions:[0.25,0.5,0.75],labels});
const parse=value=>parseGoldExport(JSON.stringify(value),items);
const parsed=parse(payload([label]));
const restored=parsed.labels[0];
const laprasOld={...label,card_id:'A-B03-P4',asset_revision:undefined,seed_revision:undefined,mode_revision:undefined};
assert.throws(()=>parse({...payload([laprasOld]),version:'centering-gold-v13'}),/Lapras/);
assert.equal(parse({...payload([laprasOld]),version:'centering-gold-v14'}).labels[0].asset_revision,15);
assert.throws(()=>parse(payload([{...label,card_id:'A-B03-P4'}])),/Lapras/);
const modern=parse(payload([{...label,asset_revision:16,seed_revision:16}])).labels[0];
assert.equal(modern.asset_revision,16);
assert.equal(parse({...payload([{...label,asset_revision:undefined,seed_revision:undefined,mode_revision:undefined,mode:'reference_or_edge'}]),version:'centering-gold-v08'}).labels[0].mode,'reference_required');
for (const field of ['outer','inner','ai_outer','ai_inner','tilt','tilt_ai','pivot','pan','note','confirmed','edits','asset_revision','seed_revision']) assert.deepEqual(restored[field],label[field]);
function migrated(input) {
  context.input=clone(input);
  vm.runInContext('saved=input',context);
  return JSON.parse(vm.runInContext('JSON.stringify({state:stateFor(ITEMS[8]),path:imagePathFor(ITEMS[8],stateFor(ITEMS[8]))})',context));
}
for (const confirmed of [true,false]) {
  const imported=parse(payload([{...label,confirmed}])).labels[0];
  const migration=migrated({[label.card_id]:imported});
  assert.equal(migration.path,`cards/v15/${label.card_id}.jpg`);
  for (const field of ['outer','inner','pivot','pan','tilt','note','edits','seed_revision','asset_revision','confirmed']) assert.deepEqual(migration.state[field],imported[field]);
  assert.deepEqual(migrated({[label.card_id]:migration.state}),migration,'restored migration is idempotent');
}
for (let version=8;version<=15;version++) {
  const legacy={...label,inner:{L:40,R:580,T:50,B:830},outer:{L:20,R:600,T:30,B:850}};
  for (const field of ['asset_revision','seed_revision','mode_revision','pan','edits','pivot']) delete legacy[field];
  const result=parse({...payload([legacy]),version:`centering-gold-v${String(version).padStart(2,'0')}`}).labels[0];
  assert.deepEqual(result.inner,label.inner);
  assert.deepEqual(result.pan,label.pan);
  assert.equal(result.asset_revision,15);
  assert.equal(migrated({[label.card_id]:result}).path,`cards/v15/${label.card_id}.jpg`);
}
// Conflicts preserve the entire local record, including arbitrary existing fields.
for (const confirmed of [false,true]) {
  const current={[label.card_id]:{...label,confirmed,note:'FICTIONAL newer local note',asset_revision:16,private_extra:'keep'}};
  const before=clone(current);
  const plan=planGoldRestore(parsed,current);
  assert.equal(plan.added,0);
  assert.equal(plan.rows[0].conflict,true);
  assert.deepEqual(plan.next,current);
  assert.deepEqual(current,before);
}
const other={...restored,card_id:items[0].card_id};
const existing={[other.card_id]:other};
const merged=planGoldRestore(parsed,existing);
assert.equal(merged.added,1);
assert.deepEqual(merged.next[other.card_id],other);
const memory=new Map([[key,JSON.stringify(existing)]]);
const storage={getItem:name=>memory.get(name) ?? null,setItem:(name,value)=>memory.set(name,value)};
commitGoldRestore(storage,key,{[key]:memory.get(key)},merged);
assert.deepEqual(JSON.parse(memory.get(key)),merged.next);
const stored=memory.get(key);
assert.throws(()=>commitGoldRestore(storage,key,{[key]:'stale'},merged),/gewijzigd/);
assert.equal(memory.get(key),stored);
assert.throws(()=>commitGoldRestore({...storage,setItem:()=>{throw Error('quota');}},key,{[key]:stored},merged),/quota/);
assert.equal(memory.get(key),stored);
assert.throws(()=>commitGoldRestore(storage,key,{[key]:stored},planGoldRestore(parsed,merged.next)),/niets/);
const invalid=[null,[],{}, {...payload([label]),version:'centering-gold-v17'}, {...payload([label]),schema:'unknown'},
  {...payload([label]),measurement_rule:'other'}, {...payload([label]),sample_positions:[0.5]},payload([]),payload([label,label]),
  payload([{...label,card_id:'UNKNOWN-FICTIONAL'}]),payload([{...label,confirmed:'false'}]),payload([{...label,mode:'html'}]),
  payload([{...label,note:17}]),payload([{...label,note:'x'.repeat(20001)}]),payload([{...label,outer:null}]),
  payload([{...label,inner:rect(40,40,50,50)}]),payload([{...label,outer:{...label.outer,TL:{x:-1,y:30}}}]),
  payload([{...label,outer:{...label.outer,TR:label.outer.BL,BL:label.outer.TR}}]),
  payload([{...label,tilt:5}]),payload([{...label,tilt:'0.7'}]),payload([{...label,tilt_deg:0}]),
  payload([{...label,pan:{x:81,y:0}}]),payload([{...label,pan_x:0}]),payload([{...label,pivot:{x:0,y:null}}]),
  payload([{...label,edits:{outer:'true'}}]),payload([{...label,asset_revision:17}]),payload([{...label,asset_revision:14}]),
  payload([{...label,seed_revision:1.5}]),payload([{...label,asset_revision:16,card_id:items[0].card_id}]),
  payload([{...label,asset_revision:undefined}]),payload([{...label,seed_revision:undefined}])];
for (const value of invalid) assert.throws(()=>parse(value),`should reject ${JSON.stringify(value)?.slice(0,100)}`);
for (const text of ['{','null','',JSON.stringify(payload([label])).replace('"note":','"__proto__":{},"note":'),
  ' '.repeat(MAX_RESTORE_BYTES+1),JSON.stringify(Array.from({length:32}).reduce(value=>({nested:value}),{}))]) {
  assert.throws(()=>parseGoldExport(text,items));
}
assert.equal(parseGoldExport('\uFEFF'+JSON.stringify(payload([label])),items).labels.length,1);
// Derived student targets and injected paths cannot alter image selection or restored geometry.
const ignored=parse(payload([{...label,student_target:{image_path:'https://invalid.example/private'},image_path:'../../private.jpg'}])).labels[0];
assert.equal(ignored.student_target,undefined);
assert.equal(ignored.image_path,undefined);
console.log('RESTORE_OK: v08–v16, geometry/revision preservation, conflicts, atomic storage, invalid input');
