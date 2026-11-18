// Run the app's actual state-loading code, with browser storage isolated.
// A private Gold export can be supplied locally; it is never committed to CI.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../review.js',import.meta.url),'utf8');
const stateCode=source.slice(0,source.indexOf('function snapshot()'));
assert(stateCode.includes('function stateFor('));
assert(stateCode.includes('function imagePathFor('));

function load(states) {
  const data=JSON.stringify(states);
  const context=vm.createContext({localStorage:{getItem(key) {
    return key === 'pokemon_centering_gold_v15' ? data : null;
  }}});
  vm.runInContext(stateCode,context);
  return JSON.parse(vm.runInContext('JSON.stringify(ITEMS.map(item => ({state:stateFor(item), path:imagePathFor(item,stateFor(item))})))',context));
}

const defaults=load({});
const old=Object.fromEntries(defaults.map(({state},index)=>[state.card_id,{
  ...state,seed_revision:13,asset_revision:undefined,confirmed:index<8,
  tilt:-0.7,pan:{x:11,y:-9},pivot:{x:310,y:430},note:'preserve this note',
  edits:{inner:true,outer:true,tilt:true},
  outer:{TL:{x:21,y:32},TR:{x:599,y:31},BR:{x:598,y:850},BL:{x:22,y:851}},
  inner:{TL:{x:45,y:50},TR:{x:577,y:49},BR:{x:576,y:830},BL:{x:44,y:831}}
}]));
const input=process.argv[2]
  ? Object.fromEntries(JSON.parse(readFileSync(process.argv[2],'utf8')).labels.map(label=>[label.card_id,label]))
  : old;
const migrated=load(input);
let preserved=0,reset=0;
for (const {state,path} of migrated) {
  const before=input[state.card_id];
  if (!before) continue;
  for (const field of ['outer','inner','tilt','tilt_ai','pivot','pan','note','edits','confirmed','seed_revision']) {
    if (before[field] !== undefined) assert.deepEqual(state[field],before[field],`${state.card_id}: ${field} changed`);
  }
  preserved++;
  if (defaults.find(row=>row.state.card_id===state.card_id).state.seed_revision===16) {
    assert.equal(path,`cards/v15/${state.card_id}.jpg`);
  }
}
assert(preserved>0,'expected preserved manual cases');
const untouched=Object.fromEntries(defaults.map(({state})=>[state.card_id,{
  ...state,seed_revision:13,asset_revision:15,confirmed:false,edits:{outer:false,inner:false,tilt:false}
}]));
for(const {state,path} of load(untouched)){
  if(defaults.find(row=>row.state.card_id===state.card_id).state.seed_revision!==16)continue;
  assert.equal(state.asset_revision,16);assert.equal(path,`cards/${state.card_id}.jpg`);reset++;
}
assert.equal(reset,8);
// A user may have confirmed a ninth card since their last uploaded backup.
old['A-B01-P5'].confirmed=true;
const later=load(old).find(row=>row.state.card_id==='A-B01-P5');
assert.equal(later.path,'cards/v15/A-B01-P5.jpg');
assert.deepEqual(later.state.outer,old['A-B01-P5'].outer);
assert.equal(later.state.tilt,old['A-B01-P5'].tilt);
assert.equal(later.state.confirmed,true);
assert.deepEqual(load(Object.fromEntries(migrated.map(row=>[row.state.card_id,row.state]))),migrated,'migration must be idempotent');
console.log(`STATE_MIGRATION_OK ${preserved} confirmed/manual preserved, ${reset} open recrops reset, later confirmations keep original pixels`);
