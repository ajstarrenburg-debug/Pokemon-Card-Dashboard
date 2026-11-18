const ITEMS = [
  {card_id:'A-B03-P5',name:'Gengar',layout:'standard_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_MED',inner_status:'MULTIVIEW_HIGH',L:34.5,R:564,T:14,B:867,OL:22,OR:590,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B12-P5',name:'Pikachu',layout:'standard_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_MED',inner_status:'MULTIVIEW_HIGH',L:34,R:586,T:17,B:852,OL:20,OR:590,OT:30,OB:850,semantic_warning:false},
  {card_id:'A-B13-P1',name:'Blastoise',layout:'standard_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_HIGH',L:29,R:589,T:18,B:850,OL:20,OR:600,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B14-P6',name:'Gengar',layout:'standard_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_HIGH',L:29,R:589,T:15,B:858,OL:20,OR:590,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B03-P4',name:"Misty's Lapras",layout:'illustration_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:46,R:585,T:50,B:829,OL:58,OR:572,OT:104,OB:827,semantic_warning:false,seed_revision:14},
  {card_id:'A-B07-P4',name:'Conkeldurr V',layout:'full_art_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:31,R:596,T:17,B:851,OL:25,OR:600,OT:30,OB:850,semantic_warning:false},
  {card_id:'A-B10-P6',name:'Mega Excadrill ex',layout:'full_art_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:35,R:592,T:17,B:850,OL:15,OR:590,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B16-P5',name:'Mega Greninja ex',layout:'full_art_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:31,R:596,T:17,B:850,OL:20,OR:595,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B01-P5',name:"N's Reshiram",layout:'illustration_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_MED',inner_status:'MULTIVIEW_MED',L:23.384,R:606.616,T:22,B:858,OL:95,OR:553,OT:143,OB:783,tilt_ai:-1.6,semantic_warning:false,seed_revision:16},
  {card_id:'A-B05-P4',name:'Clefairy',layout:'illustration_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:23.625,R:603.75,T:27.257,B:848.85,OL:94,OR:574,OT:136,OB:814,semantic_warning:false,seed_revision:16},
  {card_id:'A-B15-P1',name:'Fomantis',layout:'illustration_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:25.042,R:603.64,T:22.032,B:842.415,OL:98,OR:576,OT:111,OB:790,semantic_warning:false,seed_revision:16},
  {card_id:'A-B15-P2',name:'Spewpa',layout:'illustration_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:26.526,R:602.147,T:26.506,B:850.843,OL:100,OR:575,OT:140,OB:804,semantic_warning:false,seed_revision:16},
  {card_id:'A-B04-P6',name:"Misty's Vitality",layout:'trainer_item_energy',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:24.514,R:603.035,T:28.588,B:852.655,OL:62,OR:576,OT:122,OB:830,semantic_warning:false,seed_revision:16},
  {card_id:'A-B09-P4',name:'Lure Module',layout:'trainer_item_energy',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:18.9,R:609.84,T:21.681,B:857.043,OL:76,OR:576,OT:113,OB:803,semantic_warning:false,seed_revision:16},
  {card_id:'A-B10-P5',name:"Black Belt's Training",layout:'trainer_bordered',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_STABLE_FALSE',L:24.68,R:601.423,T:30.713,B:851.958,OL:95,OR:580,OT:116,OB:775,semantic_warning:true,seed_revision:16},
  {card_id:'A-B13-P6',name:'Wondrous Patch',layout:'trainer_item_energy',inner_geometry:'visible_border',mode:'inner_edge',mode_revision:15,outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:24.938,R:602.438,T:29.113,B:850.887,OL:59,OR:539,OT:125,OB:790,semantic_warning:false,seed_revision:16}
];

const WIDTH = 630;
const HEIGHT = 880;
const CARD_MM = {width:63, height:88};
const SAMPLE_T = [0.25, 0.5, 0.75];
const KEY = 'pokemon_centering_gold_v16';
const LEGACY_KEYS = ['pokemon_centering_gold_v15','pokemon_centering_gold_v14','pokemon_centering_gold_v13','pokemon_centering_gold_v12','pokemon_centering_gold_v11','pokemon_centering_gold_v10','pokemon_centering_gold_v09','pokemon_centering_gold_v08'];
const SVG_NS = 'http://www.w3.org/2000/svg';
const REVIEW_REVISION = 'review-v16.1';
// These are image-bound visual proposals, never user-confirmed Gold.
// Straight edge intersections, not the rounded corner tips or holder contour.
const REVIEWED_PROPOSALS = {
  'A-B03-P5': {revision:1,
    outer:{TL:{x:59,y:52},TR:{x:619,y:62},BR:{x:605,y:839},BL:{x:45,y:831}},
    inner:{TL:{x:84,y:76},TR:{x:597,y:84},BR:{x:582,y:818},BL:{x:69,y:809}}},
  'A-B12-P5':{revision:1,outer:{TL:{x:24,y:39},TR:{x:570,y:54},BR:{x:542,y:813},BL:{x:1,y:797}},inner:{TL:{x:48,y:62},TR:{x:547,y:76},BR:{x:520,y:789},BL:{x:25,y:775}}},
  'A-B13-P1':{revision:1,outer:{TL:{x:6,y:66},TR:{x:567,y:54},BR:{x:586,y:840},BL:{x:24,y:854}},inner:{TL:{x:28,y:88},TR:{x:543,y:77},BR:{x:561,y:817},BL:{x:46,y:830}}},
  'A-B14-P6':{revision:1,outer:{TL:{x:65,y:30},TR:{x:629,y:47},BR:{x:610,y:832},BL:{x:45,y:813}},inner:{TL:{x:87,y:52},TR:{x:607,y:68},BR:{x:587,y:807},BL:{x:68,y:790}}},
  'A-B03-P4':{revision:1,outer:{TL:{x:94,y:149},TR:{x:537,y:148},BR:{x:537,y:765},BL:{x:93,y:768}},inner:{TL:{x:112,y:169},TR:{x:520,y:168},BR:{x:520,y:748},BL:{x:111,y:751}}},
  'A-B07-P4':{revision:1,outer:{TL:{x:6,y:57},TR:{x:566,y:52},BR:{x:573,y:836},BL:{x:8,y:842}},inner:{TL:{x:30,y:79},TR:{x:543,y:75},BR:{x:549,y:813},BL:{x:32,y:819}}},
  'A-B10-P6':{revision:1,outer:{TL:{x:25,y:21},TR:{x:587,y:34},BR:{x:570,y:818},BL:{x:8,y:804}},inner:{TL:{x:47,y:42},TR:{x:566,y:56},BR:{x:549,y:796},BL:{x:31,y:783}}},
  'A-B16-P5':{revision:1,outer:{TL:{x:22,y:62},TR:{x:565,y:67},BR:{x:553,y:827},BL:{x:9,y:823}},inner:{TL:{x:44,y:84},TR:{x:544,y:88},BR:{x:533,y:805},BL:{x:31,y:802}}},
  'A-B01-P5':{revision:1,outer:{TL:{x:105,y:139},TR:{x:562,y:151},BR:{x:545,y:790},BL:{x:86,y:776}},inner:{TL:{x:123,y:160},TR:{x:542,y:172},BR:{x:526,y:771},BL:{x:105,y:757}}},
  'A-B05-P4':{revision:1,outer:{TL:{x:95,y:136},TR:{x:573,y:134},BR:{x:575,y:803},BL:{x:95,y:802}},inner:{TL:{x:115,y:157},TR:{x:554,y:154},BR:{x:554,y:784},BL:{x:115,y:784}}},
  'A-B15-P1':{revision:1,outer:{TL:{x:98,y:113},TR:{x:576,y:114},BR:{x:576,y:781},BL:{x:99,y:783}},inner:{TL:{x:118,y:133},TR:{x:557,y:134},BR:{x:556,y:762},BL:{x:117,y:763}}},
  'A-B15-P2':{revision:1,outer:{TL:{x:106,y:136},TR:{x:578,y:142},BR:{x:568,y:805},BL:{x:96,y:797}},inner:{TL:{x:126,y:157},TR:{x:558,y:162},BR:{x:549,y:784},BL:{x:117,y:777}}},
  'A-B04-P6':{revision:1,outer:{TL:{x:62,y:122},TR:{x:571,y:119},BR:{x:562,y:830},BL:{x:55,y:824}},inner:{TL:{x:82,y:143},TR:{x:551,y:139},BR:{x:543,y:809},BL:{x:76,y:804}}},
  'A-B09-P4':{revision:1,outer:{TL:{x:85,y:115},TR:{x:575,y:120},BR:{x:564,y:803},BL:{x:75,y:797}},inner:{TL:{x:105,y:136},TR:{x:554,y:140},BR:{x:544,y:783},BL:{x:96,y:777}}},
  'A-B10-P5':{revision:1,outer:{TL:{x:117,y:115},TR:{x:584,y:126},BR:{x:562,y:776},BL:{x:94,y:765}},inner:{TL:{x:136,y:137},TR:{x:565,y:146},BR:{x:544,y:755},BL:{x:114,y:745}}},
  'A-B13-P6':{revision:1,outer:{TL:{x:58,y:125},TR:{x:537,y:126},BR:{x:526,y:795},BL:{x:47,y:789}},inner:{TL:{x:78,y:144},TR:{x:518,y:146},BR:{x:507,y:775},BL:{x:68,y:769}}}
};
const $ = function(id) { return document.getElementById(id); };
let idx = 0;
let history = [];
let drag = null;
let activeLayer = 'tilt';
let pickingPivot = false;
let showMeasurements = true;
let loupeTarget = null;
let cur = null;
let saved = {};
let storageLoadError = null;
let originalStorage = null;
let imageReady = false;
let saveTimer = null;
let sliderGesture = null;
let hasUnsavedChanges = false;

try {
  let raw = localStorage.getItem(KEY);
  for (const key of LEGACY_KEYS) {
    if (!raw) raw = localStorage.getItem(key);
  }
  originalStorage=raw;
  const parsed=JSON.parse(raw || '{}');
  if (!parsed || typeof parsed!=='object' || Array.isArray(parsed)
    || Object.values(parsed).some(value=>!value || typeof value!=='object' || Array.isArray(value))) {
    throw new Error('De opgeslagen beoordelingen hebben een onverwachte structuur.');
  }
  saved=parsed;
} catch (error) {
  storageLoadError='Opgeslagen werk kon niet veilig worden geopend. Download eerst het herstelbestand; bestaande opslag wordt niet overschreven.';
  saved = {};
}

function notifyHeight() {
  requestAnimationFrame(function() {
    try {
      const headerHeight=document.querySelector('header').offsetHeight;
      const contentHeight=document.querySelector('main').scrollHeight;
      parent.postMessage({type:'review-height', height:Math.ceil(headerHeight+contentHeight+18)}, '*');
    } catch (_) {}
  });
}

function point(x, y) {
  return {x:Number(x), y:Number(y)};
}

function quadFromBox(box) {
  return {
    TL:point(box.L,box.T),
    TR:point(box.R,box.T),
    BR:point(box.R,box.B),
    BL:point(box.L,box.B)
  };
}

function cloneQuad(quad) {
  const copy = {};
  for (const key of ['TL','TR','BR','BL']) {
    copy[key] = point(quad[key].x,quad[key].y);
  }
  return copy;
}

function normalizeQuad(value, fallback) {
  if (value && value.TL && value.TR && value.BR && value.BL) {
    return cloneQuad(value);
  }
  if (value && ['L','R','T','B'].every(function(key) { return Number.isFinite(Number(value[key])); })) {
    return quadFromBox(value);
  }
  return cloneQuad(fallback);
}

function outerSeed(item) {
  if(REVIEWED_PROPOSALS[item.card_id])return cloneQuad(REVIEWED_PROPOSALS[item.card_id].outer);
  return quadFromBox({L:+item.OL,R:+item.OR,T:+item.OT,B:+item.OB});
}

function innerSeed(item) {
  if(REVIEWED_PROPOSALS[item.card_id])return cloneQuad(REVIEWED_PROPOSALS[item.card_id].inner);
  const outer = {L:+item.OL,R:+item.OR,T:+item.OT,B:+item.OB};
  const width = outer.R - outer.L;
  const height = outer.B - outer.T;
  return quadFromBox({
    L:outer.L + (+item.L/WIDTH)*width,
    R:outer.L + (+item.R/WIDTH)*width,
    T:outer.T + (+item.T/HEIGHT)*height,
    B:outer.T + (+item.B/HEIGHT)*height
  });
}

function aiTilt(item) {
  if(REVIEWED_PROPOSALS[item.card_id])return 0;
  return Number(item.tilt_ai || 0);
}

function pivotSeed() {
  return {x:315,y:440};
}

function panSeed() {
  return {x:0,y:0};
}

function editSeed() {
  return {outer:false,inner:false,tilt:false};
}

function untouchedProposal(item,state) {
  const legacyOuter=quadFromBox({L:item.OL,R:item.OR,T:item.OT,B:item.OB});
  const width=item.OR-item.OL,height=item.OB-item.OT;
  const legacyInner=quadFromBox({L:item.OL+item.L/WIDTH*width,R:item.OL+item.R/WIDTH*width,
    T:item.OT+item.T/HEIGHT*height,B:item.OT+item.B/HEIGHT*height});
  const same=(a,b)=>a&&b&&['TL','TR','BR','BL'].every(k=>a[k]&&b[k]&&Math.abs(a[k].x-b[k].x)<1e-6&&Math.abs(a[k].y-b[k].y)<1e-6);
  return same(state.outer,state.ai_outer||legacyOuter)&&same(state.inner,state.ai_inner||legacyInner)
    && !Object.values(state.edits||{}).some(Boolean) && Number(state.tilt||0)===Number(state.tilt_ai||0)
    && !Number(state.pan?.x||state.pan_x||0)&&!Number(state.pan?.y||state.pan_y||0);
}

function stateFor(item) {
  const existing = saved[item.card_id];
  const outerAI = outerSeed(item);
  const innerAI = innerSeed(item);
  if (existing) {
    const refreshProposal=!existing.confirmed && untouchedProposal(item,existing)
      && REVIEWED_PROPOSALS[item.card_id]
      && Number(existing.proposal_revision||0)<REVIEWED_PROPOSALS[item.card_id].revision;
    const resetForNewAsset = !Boolean(existing.confirmed)
      && Number(item.seed_revision || 0) > Number(existing.seed_revision || 0)
      && untouchedProposal(item,existing);
    const updateUnconfirmedMode = !Boolean(existing.confirmed)
      && Number(item.mode_revision || 14) > Number(existing.mode_revision || 14);
    const legacyInner = existing.inner || existing.box;
    const retainsOldImage = !resetForNewAsset && item.seed_revision === 16
      && Number(existing.asset_revision || (Number(existing.seed_revision) >= 16 ? 16 : 15)) < 16;
    return {
      ...existing,
      card_id:item.card_id,
      outer:resetForNewAsset || refreshProposal ? cloneQuad(outerAI) : normalizeQuad(existing.outer,outerAI),
      inner:resetForNewAsset || refreshProposal ? cloneQuad(innerAI) : normalizeQuad(legacyInner,innerAI),
      ai_outer:resetForNewAsset ? cloneQuad(outerAI) : normalizeQuad(existing.ai_outer,retainsOldImage ? existing.outer || outerAI : outerAI),
      ai_inner:resetForNewAsset ? cloneQuad(innerAI) : normalizeQuad(existing.ai_inner,retainsOldImage ? legacyInner || innerAI : innerAI),
      tilt:resetForNewAsset || refreshProposal ? aiTilt(item) : (Number.isFinite(Number(existing.tilt)) ? Number(existing.tilt) : aiTilt(item)),
      tilt_ai:resetForNewAsset || refreshProposal ? aiTilt(item) : (Number.isFinite(Number(existing.tilt_ai)) ? Number(existing.tilt_ai) : (retainsOldImage ? Number(existing.tilt || 0) : aiTilt(item))),
      pivot:resetForNewAsset || refreshProposal ? pivotSeed() : (existing.pivot ? point(existing.pivot.x,existing.pivot.y) : pivotSeed()),
      pan:resetForNewAsset || refreshProposal ? panSeed() : (existing.pan ? point(existing.pan.x,existing.pan.y) : point(existing.pan_x || 0,existing.pan_y || 0)),
      edits:resetForNewAsset ? editSeed() : {...editSeed(),...(existing.edits || {})},
      mode:resetForNewAsset || updateUnconfirmedMode ? item.mode : (existing.mode || item.mode),
      mode_revision:item.mode_revision || existing.mode_revision || 14,
      confirmed:resetForNewAsset ? false : Boolean(existing.confirmed),
      asset_revision:resetForNewAsset ? 16 : (existing.asset_revision || (Number(existing.seed_revision) >= 16 ? 16 : 15)),
      seed_revision:resetForNewAsset ? item.seed_revision : (existing.seed_revision || item.seed_revision || 13),
      proposal_revision:REVIEWED_PROPOSALS[item.card_id]?.revision || existing.proposal_revision || 0
    };
  }
  return {
    card_id:item.card_id,
    mode:item.mode,
    outer:cloneQuad(outerAI),
    inner:cloneQuad(innerAI),
    ai_outer:cloneQuad(outerAI),
    ai_inner:cloneQuad(innerAI),
    tilt_ai:aiTilt(item),
    tilt:aiTilt(item),
    pivot:pivotSeed(),
    pan:panSeed(),
    edits:editSeed(),
    note:'',
    confirmed:false,
    asset_revision:item.seed_revision === 16 ? 16 : 15,
    mode_revision:item.mode_revision || 15,
    seed_revision:item.seed_revision || 15,
    proposal_revision:REVIEWED_PROPOSALS[item.card_id]?.revision || 0
  };
}

function imagePathFor(item,state) {
  const legacy = item.seed_revision === 16 && state.asset_revision < 16;
  return 'cards/' + (legacy ? 'v15/' : '') + item.card_id + '.jpg';
}

function snapshot() {
  return {
    outer:cloneQuad(cur.outer),
    inner:cloneQuad(cur.inner),
    tilt:cur.tilt,
    pivot:{...cur.pivot},
    pan:{...cur.pan},
    mode:cur.mode,
    edits:{...cur.edits},
    confirmed:Boolean(cur.confirmed),
    confirmation:cur.confirmation ? JSON.parse(JSON.stringify(cur.confirmation)) : null,
    confirmation_history:JSON.parse(JSON.stringify(cur.confirmation_history || []))
  };
}

function remember() {
  history.push(snapshot());
  if (history.length > 40) history.shift();
}

function fingerprint(state) {
  return JSON.stringify({card_id:state.card_id,asset_revision:state.asset_revision,mode:state.mode,
    outer:state.outer,inner:state.inner,tilt:state.tilt,pivot:state.pivot,pan:state.pan});
}

function isConfirmed(state) {
  return Boolean(state.confirmed) && (!state.confirmation || state.confirmation.fingerprint===fingerprint(state));
}

function markChanged() {
  hasUnsavedChanges=true;
  if(cur.confirmed) {
    const archived=JSON.parse(JSON.stringify(cur));
    delete archived.confirmation_history;
    cur.confirmation_history=[...(cur.confirmation_history||[]),archived];
  }
  cur.confirmed=false;
  cur.confirmation=null;
  cur.student_target=null;
  updateReviewStatus();
}

function updateReviewStatus(message) {
  if(!$('reviewStatus'))return;
  $('reviewStatus').textContent=message || (isConfirmed(cur)
    ? (cur.confirmation ? 'Gecontroleerd · opgeslagen' : 'Eerder bevestigd · oorspronkelijke punten behouden')
    : 'Voorstel · controleer de buitenrand en printgrens');
  $('reviewStatus').className='reviewStatus '+(isConfirmed(cur)?'confirmed':'draft');
  $('prog').textContent=[...Object.values(saved).filter(state=>state.card_id!==cur.card_id),cur].filter(isConfirmed).length+' / '+ITEMS.length+' bevestigd';
}

function storageMessage(message) {
  const element=$('storageWarning');
  if(element){element.textContent=message;element.hidden=!message;}
  notifyHeight();
}

function scheduleSave() {
  hasUnsavedChanges=true;
  if(saveTimer!==null)clearTimeout(saveTimer);
  updateReviewStatus('Concept gewijzigd · opslaan…');
  saveTimer=setTimeout(function(){saveTimer=null;persist(false);},250);
}

function angleText(value) {
  const number = Math.abs(value) < 0.005 ? 0 : value;
  return (number > 0 ? '+' : '') + number.toFixed(2).replace('.',',') + '°';
}

function formatMm(value) {
  return value.toFixed(2).replace('.',',');
}

function formatPct(value) {
  return value.toFixed(1).replace('.',',');
}

function lerp(a,b,t) {
  return a + (b-a)*t;
}

function lerpPoint(a,b,t) {
  return point(lerp(a.x,b.x,t),lerp(a.y,b.y,t));
}

function midpoint(a,b) {
  return lerpPoint(a,b,0.5);
}

function mean(values) {
  return values.reduce(function(sum,value) { return sum+value; },0)/Math.max(1,values.length);
}

function lineXAtY(a,b,y) {
  return Math.abs(b.y-a.y) < 0.001 ? mean([a.x,b.x]) : a.x + ((y-a.y)/(b.y-a.y))*(b.x-a.x);
}

function lineYAtX(a,b,x) {
  return Math.abs(b.x-a.x) < 0.001 ? mean([a.y,b.y]) : a.y + ((x-a.x)/(b.x-a.x))*(b.y-a.y);
}

function endpoints(quad,side) {
  if (side === 'L') return [quad.TL,quad.BL];
  if (side === 'R') return [quad.TR,quad.BR];
  if (side === 'T') return [quad.TL,quad.TR];
  return [quad.BL,quad.BR];
}

function sidePoint(quad,side,t) {
  const edge = endpoints(quad,side);
  return lerpPoint(edge[0],edge[1],t);
}

function updateTilt() {
  const pivot = cur.pivot || pivotSeed();
  const pan = cur.pan || panSeed();
  const angle = Math.max(-4,Math.min(4,Number(cur.tilt) || 0));
  pan.x = Math.max(-80,Math.min(80,Number(pan.x) || 0));
  pan.y = Math.max(-80,Math.min(80,Number(pan.y) || 0));
  cur.tilt = angle;
  cur.pan = pan;
  $('imagePan').style.transform = 'translate(' + (pan.x/WIDTH*100) + '%,' + (pan.y/HEIGHT*100) + '%)';
  $('img').style.transformOrigin = (pivot.x/WIDTH*100) + '% ' + (pivot.y/HEIGHT*100) + '%';
  $('img').style.transform = 'rotate(' + angle + 'deg)';
  $('tilt').value = String(angle);
  $('tiltValue').textContent = angleText(angle);
  $('panX').value = String(pan.x);
  $('panY').value = String(pan.y);
  $('panXValue').textContent = (pan.x > 0 ? '+' : '') + pan.x.toFixed(0) + ' px';
  $('panYValue').textContent = (pan.y > 0 ? '+' : '') + pan.y.toFixed(0) + ' px';
  const px = pivot.x + pan.x;
  const py = pivot.y + pan.y;
  $('pivotDot').setAttribute('cx',px);
  $('pivotDot').setAttribute('cy',py);
  $('pivotH').setAttribute('x1',px-20);
  $('pivotH').setAttribute('x2',px+20);
  $('pivotH').setAttribute('y1',py);
  $('pivotH').setAttribute('y2',py);
  $('pivotV').setAttribute('x1',px);
  $('pivotV').setAttribute('x2',px);
  $('pivotV').setAttribute('y1',py-20);
  $('pivotV').setAttribute('y2',py+20);
  $('tiltHint').textContent = pickingPivot
    ? 'Tik nu op de kaart waar het vaste draaipunt moet komen.'
    : 'AI-start: ' + angleText(cur.tilt_ai) + '. X/Y schuift alleen het kaartbeeld; alle meetpunten blijven staan.';
  $('pickPivot').className = pickingPivot ? 'activeTilt' : '';
  $('stage').classList.toggle('pickingPivot',pickingPivot);
  drawLoupe();
}

function polygon(id,quad) {
  const coordinates = ['TL','TR','BR','BL'].map(function(key) {
    return quad[key].x + ',' + quad[key].y;
  }).join(' ');
  $(id).setAttribute('points',coordinates);
}

function setEdges(prefix,quad) {
  for (const side of ['L','R','T','B']) {
    const edgePoints = endpoints(quad,side);
    const edge = $(prefix+side);
    edge.setAttribute('x1',edgePoints[0].x);
    edge.setAttribute('y1',edgePoints[0].y);
    edge.setAttribute('x2',edgePoints[1].x);
    edge.setAttribute('y2',edgePoints[1].y);
  }
}

function setHandles(prefix,quad) {
  for (const key of ['TL','TR','BR','BL']) {
    $(prefix+key).setAttribute('cx',quad[key].x);
    $(prefix+key).setAttribute('cy',quad[key].y);
  }
  for (const side of ['L','R','T','B']) {
    const p = sidePoint(quad,side,0.5);
    $(prefix+'s'+side).setAttribute('cx',p.x);
    $(prefix+'s'+side).setAttribute('cy',p.y);
  }
}

function setLevelGuides(quad) {
  const left = endpoints(quad,'L');
  const right = endpoints(quad,'R');
  const top = endpoints(quad,'T');
  const bottom = endpoints(quad,'B');
  const values = {
    L:[lineXAtY(left[0],left[1],0),0,lineXAtY(left[0],left[1],HEIGHT),HEIGHT],
    R:[lineXAtY(right[0],right[1],0),0,lineXAtY(right[0],right[1],HEIGHT),HEIGHT],
    T:[0,lineYAtX(top[0],top[1],0),WIDTH,lineYAtX(top[0],top[1],WIDTH)],
    B:[0,lineYAtX(bottom[0],bottom[1],0),WIDTH,lineYAtX(bottom[0],bottom[1],WIDTH)]
  };
  for (const side of Object.keys(values)) {
    const line = $('guide'+side);
    line.setAttribute('x1',values[side][0]);
    line.setAttribute('y1',values[side][1]);
    line.setAttribute('x2',values[side][2]);
    line.setAttribute('y2',values[side][3]);
  }
}

// Measurements use the physical card plane, never an independently warped print.
const MEASUREMENT_METHOD = 'outer-card-plane-v2';
const MEASUREMENT_SPACE = 'rectified_common_cross_sections';
const QUAD_KEYS = ['TL','TR','BR','BL'];

function geometryError(message) {
  const error = new Error(message);
  error.code = 'INVALID_MEASUREMENT_GEOMETRY';
  return error;
}

function validateMeasurementQuad(quad,label) {
  if (!quad || !QUAD_KEYS.every(function(key) {
    return quad[key] && Number.isFinite(quad[key].x) && Number.isFinite(quad[key].y);
  })) throw geometryError(label+': plaats vier geldige hoeken.');
  const points = QUAD_KEYS.map(function(key) { return quad[key]; });
  const span = Math.max(...points.map(p=>p.x))-Math.min(...points.map(p=>p.x));
  const height = Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y));
  const tolerance = Math.max(span,height,1)**2*1e-10;
  for (let index=0; index<4; index++) {
    const a=points[index], b=points[(index+1)%4], c=points[(index+2)%4];
    const cross=(b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x);
    if (!Number.isFinite(cross) || cross<=tolerance) {
      throw geometryError(label+': de lijnen kruisen elkaar of het frame is ingeklapt.');
    }
  }
}

function invertCardMatrix(m) {
  const [a,b,c,d,e,f,g,h,i]=m;
  const cofactors=[e*i-f*h,c*h-b*i,b*f-c*e,f*g-d*i,a*i-c*g,c*d-a*f,d*h-e*g,b*g-a*h,a*e-b*d];
  const determinant=a*cofactors[0]+b*cofactors[3]+c*cofactors[6];
  if (!Number.isFinite(determinant) || Math.abs(determinant)<1e-12) {
    throw geometryError('Buitenrand: de hoeken zijn niet betrouwbaar recht te trekken.');
  }
  return cofactors.map(value=>value/determinant);
}

function applyCardMatrix(matrix,p) {
  const denominator=matrix[6]*p.x+matrix[7]*p.y+matrix[8];
  if (!Number.isFinite(denominator) || Math.abs(denominator)<1e-10) {
    throw geometryError('Het kaartvlak is te sterk vervormd om te meten.');
  }
  const result=point((matrix[0]*p.x+matrix[1]*p.y+matrix[2])/denominator,
    (matrix[3]*p.x+matrix[4]*p.y+matrix[5])/denominator);
  if (!Number.isFinite(result.x) || !Number.isFinite(result.y)) throw geometryError('Ongeldig kaartvlak.');
  return result;
}

function cardPlaneFor(outer) {
  validateMeasurementQuad(outer,'Buitenrand');
  // Normalize image coordinates to avoid large translations degrading the inverse.
  const origin=outer.TL;
  const size=Math.max(...QUAD_KEYS.map(key=>Math.hypot(outer[key].x-origin.x,outer[key].y-origin.y)));
  const q=QUAD_KEYS.map(key=>point((outer[key].x-origin.x)/size,(outer[key].y-origin.y)/size));
  const [p0,p1,p2,p3]=q;
  const dx1=p1.x-p2.x, dx2=p3.x-p2.x, dx3=p0.x-p1.x+p2.x-p3.x;
  const dy1=p1.y-p2.y, dy2=p3.y-p2.y, dy3=p0.y-p1.y+p2.y-p3.y;
  let g=0,h=0;
  if (Math.abs(dx3)+Math.abs(dy3)>1e-12) {
    const denominator=dx1*dy2-dx2*dy1;
    if (Math.abs(denominator)<1e-12) throw geometryError('Buitenrand: onbetrouwbaar perspectief.');
    g=(dx3*dy2-dx2*dy3)/denominator;
    h=(dx1*dy3-dx3*dy1)/denominator;
  }
  const forward=[p1.x-p0.x+g*p1.x,p3.x-p0.x+h*p3.x,p0.x,
    p1.y-p0.y+g*p1.y,p3.y-p0.y+h*p3.y,p0.y,g,h,1];
  const inverse=invertCardMatrix(forward);
  return {
    toCard:function(p) {
      const value=applyCardMatrix(inverse,point((p.x-origin.x)/size,(p.y-origin.y)/size));
      return point(value.x*CARD_MM.width,value.y*CARD_MM.height);
    },
    toImage:function(p) {
      const value=applyCardMatrix(forward,point(p.x/CARD_MM.width,p.y/CARD_MM.height));
      return point(value.x*size+origin.x,value.y*size+origin.y);
    }
  };
}

function buildMeasurements(state) {
  const activeState=state || cur;
  const bySide={L:[],R:[],T:[],B:[]};
  try {
    const plane=cardPlaneFor(activeState.outer);
    validateMeasurementQuad(activeState.inner,'Binnenrand');
    const inner={};
    for (const key of QUAD_KEYS) {
      const p=plane.toCard(activeState.inner[key]);
      const epsilon=1e-7;
      if (p.x < -epsilon || p.x>CARD_MM.width+epsilon || p.y < -epsilon || p.y>CARD_MM.height+epsilon) {
        throw geometryError('De binnenrand ligt buiten de fysieke kaart.');
      }
      // Only remove floating-point residue at a shared edge, not invalid margins.
      inner[key]=point(Math.max(0,Math.min(CARD_MM.width,p.x)),Math.max(0,Math.min(CARD_MM.height,p.y)));
    }
    const domains={
      vertical:[Math.max(inner.TL.y,inner.TR.y),Math.min(inner.BL.y,inner.BR.y)],
      horizontal:[Math.max(inner.TL.x,inner.BL.x),Math.min(inner.TR.x,inner.BR.x)]
    };
    if(Object.values(domains).some(([a,b])=>b-a<1e-7))throw geometryError('De printgrenzen hebben geen gezamenlijke meetdoorsnede.');
    for (const side of ['L','R','T','B']) {
      SAMPLE_T.forEach(function(t,index) {
        const edge=endpoints(inner,side);
        const vertical=side==='L'||side==='R';
        const axis=lerp(...(vertical?domains.vertical:domains.horizontal),t);
        const p=vertical ? point(lineXAtY(edge[0],edge[1],axis),axis)
          : point(axis,lineYAtX(edge[0],edge[1],axis));
        const outside=side==='L' ? point(0,p.y) : side==='R' ? point(CARD_MM.width,p.y)
          : side==='T' ? point(p.x,0) : point(p.x,CARD_MM.height);
        const mm=side==='L' ? p.x : side==='R' ? CARD_MM.width-p.x : side==='T' ? p.y : CARD_MM.height-p.y;
        const sourceInner=plane.toImage(p), sourceOuter=plane.toImage(outside);
        bySide[side].push({id:side+(index+1),side:side,index:index+1,t:t,
          outer:sourceOuter,inner:sourceInner,pixels:Math.hypot(sourceInner.x-sourceOuter.x,sourceInner.y-sourceOuter.y),mm:mm});
      });
    }
    if (!ratioSummary(bySide.L,bySide.R).valid || !ratioSummary(bySide.T,bySide.B).valid) {
      throw geometryError('Er is geen meetbare rand. Controleer de lijnen of kies Reference/template.');
    }
    return {valid:true,method:MEASUREMENT_METHOD,domains:domains,bySide:bySide};
  } catch (error) {
    if (error.code!=='INVALID_MEASUREMENT_GEOMETRY') throw error;
    return {valid:false,method:MEASUREMENT_METHOD,error:error.message,bySide:{L:[],R:[],T:[],B:[]}};
  }
}

function ratioSummary(firstSide,secondSide) {
  const invalid={valid:false,samples:[],worst:null,spread:null};
  if (!Array.isArray(firstSide) || !Array.isArray(secondSide) || !firstSide.length || firstSide.length!==secondSide.length) return invalid;
  if (!firstSide.every(function(value,index) {
    const other=secondSide[index];
    return value && other && Number.isFinite(value.mm) && Number.isFinite(other.mm)
      && value.mm>=0 && other.mm>=0 && Number.isFinite(value.mm+other.mm) && value.mm+other.mm>1e-9;
  })) return invalid;
  const samples=firstSide.map(function(value,index) {
    const first=value.mm/(value.mm+secondSide[index].mm)*100;
    return {first:first,second:100-first,index:index,deviation:Math.abs(first-50)};
  });
  const worst=samples.reduce(function(selected,value) {
    return value.deviation>selected.deviation ? value : selected;
  },samples[0]);
  const low=Math.min(...samples.map(value=>value.first));
  const high=Math.max(...samples.map(value=>value.first));
  return {valid:true,samples:samples,worst:worst,spread:(high-low)/2};
}

function showMeasurementError(message) {
  const warning=$('measurementWarning');
  warning.textContent=message+' Pas de lijnen aan of kies een andere meetmodus.';
  warning.hidden=false;
  notifyHeight();
}

function clearMeasurements() {
  $('measureGroup').replaceChildren();
}

function appendSvg(name,attributes,textValue) {
  const element = document.createElementNS(SVG_NS,name);
  for (const key of Object.keys(attributes)) {
    element.setAttribute(key,attributes[key]);
  }
  if (textValue !== undefined) element.textContent = textValue;
  $('measureGroup').appendChild(element);
  return element;
}

function drawMeasurements(measurements) {
  clearMeasurements();
  if (!showMeasurements || cur.mode !== 'inner_edge' || activeLayer === 'tilt' || measurements.valid===false) return;
  for (const side of ['L','R','T','B']) {
    for (const item of measurements.bySide[side]) {
      appendSvg('line',{class:'measureSegment',x1:item.outer.x,y1:item.outer.y,x2:item.inner.x,y2:item.inner.y});
      appendSvg('circle',{class:'measureOuterPoint',cx:item.outer.x,cy:item.outer.y,r:4});
      appendSvg('circle',{class:'measureInnerPoint',cx:item.inner.x,cy:item.inner.y,r:4});
      const mid = midpoint(item.outer,item.inner);
      const attributes = {class:'measureLabel'};
      if (side === 'L') {
        attributes.x=mid.x+5; attributes.y=mid.y-6;
      } else if (side === 'R') {
        attributes.x=mid.x-5; attributes.y=mid.y-6; attributes['text-anchor']='end';
      } else if (side === 'T') {
        attributes.x=mid.x+6; attributes.y=mid.y+4;
      } else {
        attributes.x=mid.x+6; attributes.y=mid.y-5;
      }
      appendSvg('text',attributes,item.id+' '+formatMm(item.mm));
    }
  }
}

function updateMeasurementTable(measurements) {
  const canMeasure = cur.mode === 'inner_edge' && measurements.valid!==false;
  for (const side of ['L','R','T','B']) {
    for (let index=1; index<=3; index++) {
      $('m'+side+index).textContent = canMeasure ? formatMm(measurements.bySide[side][index-1].mm) : '—';
    }
  }
  $('measureSource').textContent = isConfirmed(cur) ? 'Gecontroleerd' : (cur.edits.outer || cur.edits.inner ? 'Handmatig voorstel' : 'Startvoorstel');
  $('studentBadge').innerHTML = canMeasure
    ? '<b>Drie doorsneden:</b> links/rechts op dezelfde hoogte; boven/onder op dezelfde horizontale positie. P1 → P3 loopt van boven naar onder of van links naar rechts. Trainingskeypoints vormen een aparte reeks en blijven ongewijzigd.'
    : cur.mode==='inner_edge' ? '<b>Geen geldige meting.</b> Controleer eerst de meetlijnen.'
    : cur.mode==='not_measurable' ? 'Geen centeringmeting of positief trainingsvoorbeeld. Noteer waarom deze kaart niet meetbaar is.'
    : 'Alleen de fysieke buitenrand kan worden geannoteerd. Een passende referentie is nog nodig voor een centeringmeting.';
}

function updateGeom() {
  polygon('outerHalo',cur.outer);
  polygon('outerRect',cur.outer);
  polygon('innerHalo',cur.inner);
  polygon('innerRect',cur.inner);
  setEdges('oh',cur.outer);
  setEdges('ih',cur.inner);
  setHandles('o',cur.outer);
  setHandles('i',cur.inner);
  setLevelGuides(cur.outer);
  const canInner = cur.mode === 'inner_edge';
  const measurements = canInner ? buildMeasurements(cur) : {bySide:{L:[],R:[],T:[],B:[]}};
  let outerError=null;
  try { cardPlaneFor(cur.outer); } catch (error) { if(error.code!=='INVALID_MEASUREMENT_GEOMETRY')throw error; outerError=error.message; }
  const invalid=outerError || (canInner && !measurements.valid ? measurements.error : null);
  $('measurementWarning').hidden=!invalid;
  if(invalid)showMeasurementError(invalid);
  $('save').disabled=Boolean(invalid) || !imageReady || cur.mode==='not_measurable' || Boolean(storageLoadError);
  $('export').disabled=Boolean(invalid);
  if (canInner && !invalid) {
    const lr = ratioSummary(measurements.bySide.L,measurements.bySide.R);
    const tb = ratioSummary(measurements.bySide.T,measurements.bySide.B);
    $('lr').textContent = formatPct(lr.worst.first)+' / '+formatPct(lr.worst.second);
    $('tb').textContent = formatPct(tb.worst.first)+' / '+formatPct(tb.worst.second);
    $('lrSpread').textContent = sampleRange(lr);
    $('tbSpread').textContent = sampleRange(tb);
  } else if (invalid) {
    $('lr').textContent='—';
    $('tb').textContent='—';
    $('lrSpread').textContent='controleer meetlijnen';
    $('tbSpread').textContent='geen geldige meting';
  } else {
    $('lr').textContent = cur.mode==='not_measurable' ? 'niet meetbaar' : 'referentie nodig';
    $('tb').textContent = '—';
    $('lrSpread').textContent = 'geen centeringmeting';
    $('tbSpread').textContent = cur.mode==='not_measurable' ? 'geen positief trainingslabel' : 'referentiemeting nog niet beschikbaar';
  }
  updateMeasurementTable(measurements);
  applyLayerView(measurements);
  drawLoupe();
  updateReviewStatus();
}

function sampleRange(summary) {
  const values=summary.samples.map(sample=>sample.first);
  return 'Slechtste van 3: P'+(summary.worst.index+1)+' · bereik '+formatPct(Math.min(...values))+'–'+formatPct(Math.max(...values));
}

function applyLayerView(measurements) {
  const outerGroup = $('outerGroup');
  const innerGroup = $('innerGroup');
  const canInner = cur.mode === 'inner_edge';
  if (!canInner && activeLayer === 'inner') activeLayer = 'outer';
  if (!canInner && loupeTarget && loupeTarget.layer === 'inner') {
    loupeTarget={layer:'outer',key:'L',point:sidePoint(cur.outer,'L',.5)};
    $('loupeLabel').textContent='Cyaan · L';
  }
  $('showTilt').className = activeLayer === 'tilt' ? 'activeTilt' : '';
  $('showOuter').className = activeLayer === 'outer' ? 'activeOuter' : '';
  $('showInner').className = activeLayer === 'inner' ? 'activeInner' : '';
  $('showBoth').className = activeLayer === 'both' ? 'activeBoth' : '';
  outerGroup.classList.toggle('locked',activeLayer!=='outer'&&activeLayer!=='both');
  innerGroup.classList.toggle('locked',activeLayer!=='inner'&&activeLayer!=='both');
  for(const [id,layer] of [['showTilt','tilt'],['showOuter','outer'],['showInner','inner'],['showBoth','both']]){
    $(id).setAttribute('aria-pressed',String(activeLayer===layer));
  }
  $('showInner').disabled = !canInner;
  $('showInner').title = canInner ? 'Binnenrand aanpassen' : 'Geen klassieke binnenrand; gebruik Reference/template';
  $('levelGuide').style.display = activeLayer === 'tilt' ? '' : 'none';
  $('pivotGroup').style.opacity = activeLayer === 'tilt' ? '.92' : '.22';
  outerGroup.classList.toggle('tiltLocked',activeLayer === 'tilt');
  outerGroup.classList.toggle('selected',activeLayer === 'outer' || activeLayer === 'both');
  innerGroup.classList.toggle('selected',activeLayer === 'inner' || activeLayer === 'both');
  outerGroup.style.pointerEvents = activeLayer === 'tilt' || activeLayer === 'inner' ? 'none' : 'auto';
  innerGroup.style.display = canInner ? '' : 'none';
  if (activeLayer === 'tilt') {
    outerGroup.style.opacity='1';
    innerGroup.style.opacity='0';
    innerGroup.style.pointerEvents='none';
    $('layerHint').className='layerHint tilt';
    $('layerHint').textContent='RECHTZETTEN: draai het kaartbeeld tot de fysieke rand parallel loopt aan de lange cyaan referentielijnen.';
  } else if (activeLayer === 'outer') {
    outerGroup.style.opacity='1';
    innerGroup.style.opacity=canInner?'.34':'0';
    innerGroup.style.pointerEvents='none';
    $('layerHint').className='layerHint outer';
    $('layerHint').textContent='BUITENRAND: zet de dunne cyaankern exact op de overgang achtergrond → kaart.';
  } else if (activeLayer === 'inner') {
    outerGroup.style.opacity='.35';
    innerGroup.style.opacity='1';
    innerGroup.style.pointerEvents='auto';
    $('layerHint').className='layerHint inner';
    $('layerHint').textContent='BINNENRAND: zet de dunne magentakern exact op de overgang border → binnenste printvlak.';
  } else {
    outerGroup.style.opacity='1';
    innerGroup.style.opacity=canInner?'1':'0';
    innerGroup.style.pointerEvents=canInner?'auto':'none';
    $('layerHint').className='layerHint';
    $('layerHint').textContent=canInner
      ? 'BEIDE: controleer de 12 witte meetsegmenten en de P1/P2/P3-waarden.'
      : 'Alleen de fysieke buitenrand is meetbaar; gebruik Reference/template.';
  }
  $('toggleMeasures').disabled = !canInner;
  $('toggleMeasures').setAttribute('aria-pressed',String(showMeasurements && canInner));
  $('toggleMeasures').textContent = 'Meetpunten: '+(showMeasurements && canInner ? 'aan' : 'uit');
  const data = measurements || (canInner ? buildMeasurements(cur) : {bySide:{L:[],R:[],T:[],B:[]}});
  drawMeasurements(data);
  updatePrecisionControls();
}

function drawLoupe() {
  const canvas = $('loupe');
  const context = canvas.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);
  context.fillStyle='#05070a';
  context.fillRect(0,0,canvas.width,canvas.height);
  if (!loupeTarget || !$('img').complete || !$('img').naturalWidth) {
    context.fillStyle='#8fa3bc';
    context.font='28px system-ui';
    context.textAlign='center';
    context.fillText('Sleep een rand voor detail',canvas.width/2,canvas.height/2+9);
    canvas.dataset.ready='0';
    return;
  }
  const target = loupeTarget.point;
  const pan = cur.pan || panSeed();
  const pivot = cur.pivot || pivotSeed();
  const radians = (Number(cur.tilt)||0)*Math.PI/180;
  const cropWidth = 100;
  const zoom = canvas.width/cropWidth;
  context.imageSmoothingEnabled=false;
  context.save();
  context.translate(canvas.width/2,canvas.height/2);
  context.scale(zoom,zoom);
  context.translate(-target.x,-target.y);
  context.translate(pan.x,pan.y);
  context.translate(pivot.x,pivot.y);
  context.rotate(radians);
  context.translate(-pivot.x,-pivot.y);
  context.drawImage($('img'),0,0,WIDTH,HEIGHT);
  context.restore();
  const layers=cur.mode==='inner_edge'?['outer','inner']:['outer'];
  for (const layer of layers) for(const side of ['L','R','T','B']) {
    const edge=endpoints(cur[layer],side);
    const a={x:(edge[0].x-target.x)*zoom,y:(edge[0].y-target.y)*zoom};
    const b={x:(edge[1].x-target.x)*zoom,y:(edge[1].y-target.y)*zoom};
    context.save();
    context.translate(canvas.width/2,canvas.height/2);
    context.strokeStyle=layer==='outer'?'#34e3ff':'#ff4be3';
    context.globalAlpha=.72;
    context.lineWidth=7;
    context.setLineDash([18,14]);
    context.beginPath();
    context.moveTo(a.x,a.y);
    context.lineTo(b.x,b.y);
    context.stroke();
    context.globalAlpha=1;
    context.strokeStyle='#fff';
    context.lineWidth=1;
    context.setLineDash([]);
    context.beginPath();
    context.moveTo(a.x,a.y);
    context.lineTo(b.x,b.y);
    context.stroke();
    context.restore();
  }
  context.fillStyle='#fff';
  context.beginPath();
  context.arc(canvas.width/2,canvas.height/2,3,0,Math.PI*2);
  context.fill();
  canvas.dataset.ready='1';
}

function setLoupe(layer,key,p) {
  loupeTarget={layer:layer,key:key,point:p};
  $('loupeLabel').textContent=(layer==='outer'?'Cyaan':'Magenta')+' · '+key;
  drawLoupe();
  updatePrecisionControls();
}

function focusSide(layer,side) {
  setLoupe(layer,side,sidePoint(cur[layer],side,.5));
  updatePrecisionControls();
}

function updatePrecisionControls() {
  const names={L:'Links',R:'Rechts',T:'Boven',B:'Onder'};
  for(const side of ['L','R','T','B']){
    const button=$('select'+side);
    if(button)button.setAttribute('aria-pressed',String(loupeTarget?.key===side));
  }
  if($('selectionLabel'))$('selectionLabel').textContent=loupeTarget
    ? (loupeTarget.layer==='outer'?'Buitenrand':'Printgrens')+' · '+(names[loupeTarget.key]||'hoek '+loupeTarget.key)
    : 'Kies een rand om nauwkeurig bij te stellen';
  for(const id of ['nudgeOut','nudgeIn'])if($(id))$(id).disabled=!loupeTarget || loupeTarget.key.length!==1 || activeLayer==='tilt';
}

function nudgeSelected(direction) {
  if(!loupeTarget || loupeTarget.key.length!==1)return;
  remember();markChanged();
  const {layer,key}=loupeTarget,quad=cur[layer],edge=endpoints(quad,key);
  const dx=edge[1].x-edge[0].x,dy=edge[1].y-edge[0].y,length=Math.hypot(dx,dy);
  if(length<1e-7)return;
  const sign=key==='L'||key==='B'?1:-1;
  const amount=Number($('nudgeStep').value||1)*direction;
  for(const p of edge){p.x+=sign*dy/length*amount;p.y-=sign*dx/length*amount;}
  clampQuad(quad);cur.edits[layer]=true;
  focusSide(layer,key);finishEdit();
}

function loadCardImage(item) {
  imageReady=false;
  const img=$('img');
  const status=$('imageStatus');
  const src=imagePathFor(item,cur)+'?v=16';
  img.dataset.cardId=item.card_id;
  img.alt=item.card_id+' · '+item.name;
  status.hidden=false;
  status.textContent='Kaart laden…';
  img.style.visibility='hidden';
  img.onload=function() {
    if(img.dataset.cardId!==item.card_id)return;
    img.style.visibility='visible';
    status.hidden=true;
    imageReady=true;
    updateGeom();
    drawLoupe();
    notifyHeight();
    const next=ITEMS[(idx+1)%ITEMS.length];
    const preload=new Image();
    preload.src=imagePathFor(next,stateFor(next))+'?v=16';
  };
  img.onerror=function() {
    if(img.dataset.cardId!==item.card_id)return;
    img.style.visibility='hidden';
    status.hidden=false;
    status.textContent='Kaartbeeld kon niet laden. Vernieuw de pagina.';
    imageReady=false;
    updateGeom();
  };
  img.src=src;
  if(img.complete&&img.naturalWidth>0)img.onload();
}

function updateWarning(item) {
  if (cur.mode==='not_measurable') {
    $('warning').innerHTML='<div class="warn"><b>Niet betrouwbaar meetbaar.</b> Sla deze kaart over en bewaar de reden in de notitie.</div>';
  } else if (cur.mode==='reference_required') {
    $('warning').innerHTML='<div class="warn"><b>Reference/template gekozen.</b> De magenta laag en punten zijn uitgeschakeld. Gebruik dit alleen als er geen consistente printovergang te plaatsen is.</div>';
  } else if (item.seed_revision === 16 && cur.asset_revision < 16) {
    $('warning').innerHTML='<div class="warn"><b>Oorspronkelijke afbeelding behouden.</b> Je handmatige of bevestigde meting blijft gekoppeld aan de oorspronkelijke foto. Nieuwe startvoorstellen voor een andere uitsnede vervangen dit werk niet.</div>';
  } else if (isConfirmed(cur)) {
    $('warning').innerHTML='<div class="ok"><b>Bevestigde meting.</b> Deze geometrie is door jou gecontroleerd en opgeslagen. Een rand- of beeldcorrectie maakt er weer een concept van.</div>';
  } else if (item.semantic_warning) {
    $('warning').innerHTML='<div class="warn"><b>AI-voorstel onbetrouwbaar.</b> De detector volgt hier mogelijk een interne grafische lijn. Plaats de magenta kern daarom handmatig op de overgang border → binnenste printvlak.</div>';
  } else if (REVIEWED_PROPOSALS[item.card_id] && !isConfirmed(cur)) {
    $('warning').innerHTML='<div class="warn">Startlijnen op deze afbeelding nagekeken. Controleer zelf de fysieke kaart en de printgrens; dit is nog geen bevestigde meting.</div>';

  } else if (item.seed_revision === 16 && !cur.confirmed) {
    $('warning').innerHTML='<div class="warn">Ruimere uitsnede beschikbaar. De lijnen zijn startvoorstellen: controleer de fysieke kaartrand en de printovergang voordat je bevestigt.</div>';
  } else {
    $('warning').innerHTML='<div class="warn">Startvoorstel, nog te controleren. Plaats de dunne kernlijnen op de fysieke kaart en de juiste printgrens.</div>';
  }
}

function render() {
  const item=ITEMS[idx];
  cur=stateFor(item);
  pickingPivot=false;
  loupeTarget=null;
  loadCardImage(item);
  $('title').textContent=item.card_id+' · '+item.name;
  $('meta').textContent=item.layout.replaceAll('_',' ')+' · '+(idx+1)+' / '+ITEMS.length;
  $('mode').value=cur.mode;
  $('note').value=cur.note||'';
  $('outerStatus').textContent='Te controleren';
  $('innerStatus').textContent=item.semantic_warning?'Handmatige controle nodig':'Te controleren';
  updateWarning(item);
  updateReviewStatus();
  storageMessage(storageLoadError || '');
  history=[];
  activeLayer='outer';
  updateTilt();
  updateGeom();
  focusSide('outer','L');
  notifyHeight();
  try {
    parent.postMessage({type:'review-card-change',cardId:item.card_id},'*');
  } catch (_) {}
}

function persist(confirmed) {
  if(saveTimer!==null){clearTimeout(saveTimer);saveTimer=null;}
  if(storageLoadError){storageMessage(storageLoadError);return false;}
  if(confirmed && (!imageReady || cur.mode==='not_measurable')){
    storageMessage(!imageReady?'Bevestigen kan pas als het juiste kaartbeeld geladen is.':'Niet meetbaar wordt als concept met reden bewaard, niet als gecontroleerde meting.');return false;
  }
  const candidate=JSON.parse(JSON.stringify(cur));
  candidate.note=$('note').value;
  candidate.mode=$('mode').value;
  if(candidate.confirmed&&!isConfirmed(candidate)){candidate.confirmed=false;candidate.confirmation=null;}
  if(confirmed){candidate.confirmed=true;candidate.confirmation={at:new Date().toISOString(),revision:REVIEW_REVISION,fingerprint:fingerprint(candidate)};}
  let target;
  try { target=buildStudentTarget(candidate,ITEMS[idx]); }
  catch (error) {
    if(error.code!=='INVALID_MEASUREMENT_GEOMETRY')throw error;
    if(confirmed){showMeasurementError(error.message);return false;}
    candidate.confirmed=false;candidate.confirmation=null;
    candidate.measurement_error=error.message;target=null;
  }
  if(target){target.source=candidate.mode==='not_measurable'?'excluded':isConfirmed(candidate)?'gold_user':'ai_seed';delete candidate.measurement_error;}
  candidate.student_target=target;
  const nextSaved={...saved,[candidate.card_id]:candidate};
  try{localStorage.setItem(KEY,JSON.stringify(nextSaved));}
  catch(error){storageMessage('Opslaan mislukt. Je concept blijft in beeld. Probeer opnieuw of download een herstelbestand.');updateReviewStatus('Niet opgeslagen · download zo nodig een herstelbestand');return false;}
  saved=nextSaved;cur=JSON.parse(JSON.stringify(candidate));
  hasUnsavedChanges=false;
  storageMessage('');updateReviewStatus(isConfirmed(cur)?undefined:'Concept opgeslagen · nog controleren');
  return true;
}

function pos(event) {
  const rect=$('svg').getBoundingClientRect();
  return point((event.clientX-rect.left)/rect.width*WIDTH,(event.clientY-rect.top)/rect.height*HEIGHT);
}

function clamp(value,min,max) {
  return Math.max(min,Math.min(max,value));
}

function clampQuad(quad) {
  for(const key of ['TL','TR','BR','BL']) {
    quad[key].x=clamp(quad[key].x,0,WIDTH);
    quad[key].y=clamp(quad[key].y,0,HEIGHT);
  }
  quad.TL.x=Math.min(quad.TL.x,quad.TR.x-8);
  quad.BL.x=Math.min(quad.BL.x,quad.BR.x-8);
  quad.TR.x=Math.max(quad.TR.x,quad.TL.x+8);
  quad.BR.x=Math.max(quad.BR.x,quad.BL.x+8);
  quad.TL.y=Math.min(quad.TL.y,quad.BL.y-8);
  quad.TR.y=Math.min(quad.TR.y,quad.BR.y-8);
  quad.BL.y=Math.max(quad.BL.y,quad.TL.y+8);
  quad.BR.y=Math.max(quad.BR.y,quad.TR.y+8);
  for(const key of ['TL','TR','BR','BL']) {
    quad[key].x=clamp(quad[key].x,0,WIDTH);
    quad[key].y=clamp(quad[key].y,0,HEIGHT);
  }
}

function normalizedKeypoints(quad) {
  const result=[];
  for(const side of ['L','R','T','B']) {
    SAMPLE_T.forEach(function(t,index) {
      const p=sidePoint(quad,side,t);
      if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>WIDTH||p.y<0||p.y>HEIGHT){
        throw geometryError('Een trainingspunt ligt buiten het zichtbare kaartbeeld. Controleer de hoeken.');
      }
      result.push({
        id:side+(index+1),
        side:side,
        index:index+1,
        x:Number((p.x/WIDTH).toFixed(6)),
        y:Number((p.y/HEIGHT).toFixed(6))
      });
    });
  }
  return result;
}

function buildStudentTarget(state,item) {
  if(!item)throw geometryError('Onbekende kaart. Bewaar eerst een herstelbestand.');
  if(state.mode==='not_measurable')return {schema:'border-keypoints-v1',rule:'centerline_on_visual_transition',
    mode:state.mode,source:'excluded',outer_keypoints:null,inner_keypoints:null,reason:state.note||''};
  cardPlaneFor(state.outer);
  for(const quad of state.mode==='inner_edge'?[state.outer,state.inner]:[state.outer]){
    for(const key of QUAD_KEYS){const p=quad?.[key];
      if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>WIDTH||p.y<0||p.y>HEIGHT){
        throw geometryError('Een kaarthoek ligt buiten het zichtbare kaartbeeld. Controleer de uitsnede en de lijnen.');
      }
    }
  }
  const target={
    schema:'border-keypoints-v1',
    image_size:{width:WIDTH,height:HEIGHT},
    image_path:imagePathFor(item,state),
    asset_revision:state.asset_revision,
    identity_verified:!(item.card_id === 'A-B01-P5' && state.asset_revision < 16),
    coordinate_space:'review_canvas',
    image_transform:{
      rotation_deg:Number(state.tilt||0),
      pivot_px:{...(state.pivot || pivotSeed())},
      translation_px:{...(state.pan || panSeed())}
    },
    rule:'centerline_on_visual_transition',
    measurement_method:MEASUREMENT_METHOD,
    measurement_sample_space:MEASUREMENT_SPACE,
    keypoint_sample_space:'review_canvas',
    layout:item.layout,
    inner_geometry:item.inner_geometry,
    mode:state.mode,
    tilt_deg:Number(state.tilt||0),
    outer_keypoints:normalizedKeypoints(state.outer),
    inner_keypoints:state.mode==='inner_edge'?normalizedKeypoints(state.inner):null,
    source:isConfirmed(state)?'gold_user':'ai_seed',
    edits:{...state.edits}
  };
  if(state.mode==='inner_edge') {
    const measurements=buildMeasurements(state);
    if(!measurements.valid)throw geometryError(measurements.error);
    const lr=ratioSummary(measurements.bySide.L,measurements.bySide.R);
    const tb=ratioSummary(measurements.bySide.T,measurements.bySide.B);
    target.measurement_domains=measurements.domains;
    target.measurement_points={outer:[],inner:[]};
    for(const side of ['L','R','T','B'])for(const sample of measurements.bySide[side]){
      for(const kind of ['outer','inner'])target.measurement_points[kind].push({id:sample.id,
        x:sample[kind].x/WIDTH,y:sample[kind].y/HEIGHT});
    }
    target.measurements_mm={};
    for (const side of ['L','R','T','B']) {
      target.measurements_mm[side]=measurements.bySide[side].map(function(value) {
        return Number(value.mm.toFixed(4));
      });
    }
    target.centering={
      lr:{first:Number(lr.worst.first.toFixed(4)),second:Number(lr.worst.second.toFixed(4)),worst_point:lr.worst.index+1,spread:Number(lr.spread.toFixed(4))},
      tb:{first:Number(tb.worst.first.toFixed(4)),second:Number(tb.worst.second.toFixed(4)),worst_point:tb.worst.index+1,spread:Number(tb.spread.toFixed(4))}
    };
  }
  return target;
}

$('svg').addEventListener('pointerdown',function(event) {
  if(pickingPivot) {
    event.preventDefault();
    remember();markChanged();
    const p=pos(event);
    const pan=cur.pan||panSeed();
    cur.pivot={x:clamp(p.x-pan.x,0,WIDTH),y:clamp(p.y-pan.y,0,HEIGHT)};
    cur.edits.tilt=true;
    pickingPivot=false;
    finishEdit(true);
    return;
  }
  const target=event.target;
  const layer=target.dataset.layer;
  const key=target.dataset.side||target.dataset.corner;
  if(!layer||!key)return;
  if(layer==='inner'&&cur.mode!=='inner_edge')return;
  if(activeLayer!==layer) {
    activeLayer=layer;
    applyLayerView();
  }
  event.preventDefault();
  target.setPointerCapture(event.pointerId);
  remember();
  const start=pos(event);
  drag={layer:layer,key:key,start:start,before:cloneQuad(cur[layer])};
  setLoupe(layer,key,start);
});

$('svg').addEventListener('pointermove',function(event) {
  const target=event.target;
  if(!drag) {
    const layer=target.dataset ? target.dataset.layer : null;
    const key=target.dataset ? target.dataset.side||target.dataset.corner : null;
    if(layer&&key&&!(layer==='inner'&&cur.mode!=='inner_edge'))setLoupe(layer,key,pos(event));
    return;
  }
  event.preventDefault();
  const p=pos(event);
  if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<1e-8)return;
  markChanged();drag.changed=true;cur.edits[drag.layer]=true;
  const quad=cur[drag.layer];
  const before=drag.before;
  if(['TL','TR','BR','BL'].includes(drag.key)) {
    quad[drag.key]=point(p.x,p.y);
  } else {
    const deltaX=p.x-drag.start.x;
    const deltaY=p.y-drag.start.y;
    let pair;
    if(drag.key==='L')pair=['TL','BL'];
    else if(drag.key==='R')pair=['TR','BR'];
    else if(drag.key==='T')pair=['TL','TR'];
    else pair=['BL','BR'];
    quad[pair[0]]=point(before[pair[0]].x,before[pair[0]].y);
    quad[pair[1]]=point(before[pair[1]].x,before[pair[1]].y);
    if(drag.key==='L'||drag.key==='R') {
      quad[pair[0]].x+=deltaX;
      quad[pair[1]].x+=deltaX;
    } else {
      quad[pair[0]].y+=deltaY;
      quad[pair[1]].y+=deltaY;
    }
  }
  clampQuad(quad);
  setLoupe(drag.layer,drag.key,p);
  finishEdit();
});

$('svg').addEventListener('pointerup',function() {
  if(drag?.changed)persist(false);
  drag=null;
});

$('svg').addEventListener('pointercancel',function() {
  if(drag?.changed)persist(false);
  drag=null;
});

document.querySelectorAll('[data-layer]').forEach(function(target) {
  const group=$(target.dataset.layer+'Group');
  if(target.classList.contains('cornerHandle')||target.classList.contains('sideHandle')){
    const key=target.dataset.side||target.dataset.corner;
    const name={L:'links',R:'rechts',T:'boven',B:'onder',TL:'linksboven',TR:'rechtsboven',BR:'rechtsonder',BL:'linksonder'}[key];
    target.setAttribute('tabindex','0');target.setAttribute('role','button');
    target.setAttribute('aria-label',(target.dataset.layer==='outer'?'Buitenrand ':'Printgrens ')+name+' · pijltjestoetsen verplaatsen');
    target.addEventListener('keydown',function(event){
      const movement={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
      if(!movement || (target.dataset.layer==='inner'&&cur.mode!=='inner_edge'))return;
      if(key.length===1&&((key==='L'||key==='R')?movement[0]===0:movement[1]===0))return;
      event.preventDefault();remember();markChanged();
      const step=event.shiftKey?4:1,layer=target.dataset.layer,quad=cur[layer];
      const points=key.length===1?endpoints(quad,key):[quad[key]];
      for(const p of points){p.x+=movement[0]*step;p.y+=movement[1]*step;}
      clampQuad(quad);cur.edits[layer]=true;activeLayer=layer;
      setLoupe(layer,key,key.length===1?sidePoint(quad,key,.5):quad[key]);finishEdit();
    });
  }
  target.addEventListener('pointerenter',function() {
    group.classList.add('hovered');
  });
  target.addEventListener('pointerleave',function() {
    group.classList.remove('hovered');
  });
});

function finishEdit(transform=false) {
  if(transform)updateTilt();
  updateWarning(ITEMS[idx]);updateGeom();scheduleSave();
}

for(const id of ['tilt','panX','panY']) {
  $(id).addEventListener('pointerdown',function(){remember();sliderGesture=id;});
  $(id).addEventListener('pointerup',function(){sliderGesture=null;});
  $(id).addEventListener('pointercancel',function(){sliderGesture=null;});
  $(id).addEventListener('input',function(){
    if(sliderGesture!==id)remember();
    markChanged();activeLayer='tilt';
    if(id==='tilt'){cur.tilt=Number($(id).value);cur.edits.tilt=true;}
    else cur.pan[id==='panX'?'x':'y']=Number($(id).value);
    finishEdit(true);
  });
}

for(const [id,delta] of [['tiltMinus',-.1],['tiltPlus',.1]])$(id).onclick=function(){
  remember();markChanged();activeLayer='tilt';
  cur.tilt=clamp(cur.tilt+delta,-4,4);cur.edits.tilt=true;finishEdit(true);
};
$('tiltAI').onclick=function(){
  remember();markChanged();activeLayer='tilt';cur.tilt=cur.tilt_ai;
  cur.pivot=pivotSeed();cur.edits.tilt=false;pickingPivot=false;finishEdit(true);
};
$('pickPivot').onclick=function(){activeLayer='tilt';pickingPivot=!pickingPivot;updateTilt();applyLayerView();};
$('panReset').onclick=function(){remember();markChanged();activeLayer='tilt';cur.pan=panSeed();finishEdit(true);};

$('showTilt').onclick=function() {
  $('alignmentDetails').open=true;
  activeLayer='tilt';
  loupeTarget=null;
  applyLayerView();
  drawLoupe();
};

$('showOuter').onclick=function() {
  activeLayer='outer';
  focusSide('outer','L');
  applyLayerView();
};

$('showInner').onclick=function() {
  if(cur.mode==='inner_edge') {
    activeLayer='inner';
    focusSide('inner','L');
    applyLayerView();
  }
};

$('showBoth').onclick=function() {
  activeLayer='both';
  if(cur.mode==='inner_edge')focusSide('inner','L');
  applyLayerView();
};

$('toggleMeasures').onclick=function() {
  showMeasurements=!showMeasurements;
  updateGeom();
};

$('mode').onchange=function() {
  remember();markChanged();
  cur.mode=$('mode').value;
  if(cur.mode!=='inner_edge'&&(activeLayer==='inner'||activeLayer==='both'))activeLayer='outer';
  finishEdit();
  notifyHeight();
};

$('reset').onclick=function() {
  remember();markChanged();
  const item=ITEMS[idx];
  const oldImage=item.seed_revision===16&&cur.asset_revision<16;
  const outer=oldImage?cloneQuad(cur.ai_outer||cur.outer):outerSeed(item);
  const inner=oldImage?cloneQuad(cur.ai_inner||cur.inner):innerSeed(item);
  const tilt=oldImage?cur.tilt_ai:aiTilt(item);
  cur.outer=outer;cur.inner=inner;
  cur.ai_outer=cloneQuad(outer);cur.ai_inner=cloneQuad(inner);
  cur.mode=item.mode;
  cur.tilt=tilt;
  cur.tilt_ai=tilt;
  cur.pivot=pivotSeed();
  cur.pan=panSeed();
  cur.edits=editSeed();
  pickingPivot=false;
  activeLayer='tilt';
  loupeTarget=null;
  $('mode').value=cur.mode;
  finishEdit(true);
};

$('undo').onclick=function() {
  const previous=history.pop();
  if(previous) {
    cur.outer=previous.outer;
    cur.inner=previous.inner;
    cur.tilt=previous.tilt;
    cur.pivot=previous.pivot;
    cur.pan=previous.pan;
    cur.mode=previous.mode;
    cur.edits=previous.edits;
    cur.confirmed=previous.confirmed;cur.confirmation=previous.confirmation;
    cur.confirmation_history=previous.confirmation_history;
    $('mode').value=cur.mode;
    pickingPivot=false;
    finishEdit(true);
  }
};

$('save').onclick=function() {
  if(!persist(true))return;
  idx=Math.min(ITEMS.length-1,idx+1);
  render();
};

$('skip').onclick=function() {
  if(cur.mode==='not_measurable'&&!$('note').value.trim()){storageMessage('Noteer kort waarom deze kaart niet meetbaar is.');$('note').focus();return;}
  if(!persist(false))return;
  idx=Math.min(ITEMS.length-1,idx+1);
  render();
};

$('prev').onclick=function() {
  if(!persist(false))return;
  idx=(idx-1+ITEMS.length)%ITEMS.length;
  render();
};

$('next').onclick=function() {
  if(!persist(false))return;
  idx=(idx+1)%ITEMS.length;
  render();
};

$('export').onclick=function() {
  if(!persist(false))return;
  let labels;
  try { labels=Object.values(saved).map(function(label) {
    const item=ITEMS.find(function(candidate) { return candidate.card_id===label.card_id; });
    if(!item)throw geometryError('Kaart '+label.card_id+' is onbekend. Download een herstelbestand om alle gegevens te behouden.');
    const normalized=stateFor(item);
    return {
      ...normalized,
      tilt_deg:Number(normalized.tilt||0),
      ai_tilt_deg:Number(normalized.tilt_ai||0),
      pan_x:Number(normalized.pan ? normalized.pan.x : 0),
      pan_y:Number(normalized.pan ? normalized.pan.y : 0),
      student_target:buildStudentTarget(normalized,item)
    };
  }); } catch(error) {
    showMeasurementError('Export gestopt. '+error.message);
    return;
  }
  const payload={
    version:'centering-gold-v16',
    app_revision:REVIEW_REVISION,
    includes_drafts:true,
    schema:'border-keypoints-v1',
    created:new Date().toISOString(),
    measurement_rule:'centerline_on_visual_transition',
    measurement_method:MEASUREMENT_METHOD,
    measurement_sample_space:MEASUREMENT_SPACE,
    sample_positions:SAMPLE_T,
    labels:labels
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const anchor=document.createElement('a');
  anchor.href=URL.createObjectURL(blob);
  anchor.download='Pokemon_Centering_Gold_v16_labels.json';
  anchor.click();
  setTimeout(function() { URL.revokeObjectURL(anchor.href); },1000);
};

window.addEventListener('message',function(event) {
  if(window.parent!==window&&event.source!==window.parent)return;
  if(event.data?.type==='review-viewport'){
    if(Number.isFinite(event.data.top)&&Number.isFinite(event.data.height)){
      document.documentElement.style.setProperty('--review-sticky-top',Math.max(8,event.data.top)+'px');
      document.documentElement.style.setProperty('--review-viewport-height',Math.max(300,event.data.height)+'px');
    }
    return;
  }
  if(event.data?.type!=='review-select-card')return;
  const nextIndex=ITEMS.findIndex(function(item) { return item.card_id===event.data.cardId; });
  if(nextIndex<0||nextIndex===idx)return;
  if(!persist(false))return;
  idx=nextIndex;
  render();
  window.scrollTo({top:0,behavior:'auto'});
});


$('note').addEventListener('input',scheduleSave);
$('nudgeOut').onclick=function(){nudgeSelected(-1);};
$('nudgeIn').onclick=function(){nudgeSelected(1);};
for(const side of ['L','R','T','B'])$('select'+side).onclick=function(){
  const layer=activeLayer==='inner'||(activeLayer==='both'&&loupeTarget?.layer==='inner')?'inner':'outer';
  if(activeLayer==='tilt')activeLayer='outer';
  focusSide(layer,side);applyLayerView();
};
$('retrySave').onclick=function(){persist(false);};
$('backup').onclick=function(){
  const backup={version:'centering-raw-backup-v1',backup_only:true,created:new Date().toISOString(),
    original_storage:originalStorage,saved:saved,current:cur,note:$('note').value};
  downloadJson(backup,'Pokemon_Centering_herstelbestand.json');
};
function downloadJson(payload,filename){
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
window.addEventListener('pagehide',function(){if(hasUnsavedChanges)persist(false);});
window.addEventListener('beforeunload',function(){if(hasUnsavedChanges)persist(false);});
window.addEventListener('resize',notifyHeight);
for (const details of document.querySelectorAll('details')) details.addEventListener('toggle',notifyHeight);
if (typeof ResizeObserver !== 'undefined') {
  const layoutObserver=new ResizeObserver(notifyHeight);
  layoutObserver.observe(document.querySelector('main'));
  layoutObserver.observe(document.querySelector('header'));
}

render();
