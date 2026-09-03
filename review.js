const ITEMS = [
  {card_id:'A-B03-P5',name:'Gengar',layout:'standard_bordered',mode:'inner_edge',outer_status:'TRANSFER_MED',inner_status:'MULTIVIEW_HIGH',L:34.5,R:564,T:14,B:867,OL:22,OR:590,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B12-P5',name:'Pikachu',layout:'standard_bordered',mode:'inner_edge',outer_status:'TRANSFER_MED',inner_status:'MULTIVIEW_HIGH',L:34,R:586,T:17,B:852,OL:20,OR:590,OT:30,OB:850,semantic_warning:false},
  {card_id:'A-B13-P1',name:'Blastoise',layout:'standard_bordered',mode:'inner_edge',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_HIGH',L:29,R:589,T:18,B:850,OL:20,OR:600,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B14-P6',name:'Gengar',layout:'standard_bordered',mode:'inner_edge',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_HIGH',L:29,R:589,T:15,B:858,OL:20,OR:590,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B03-P4',name:"Misty's Lapras",layout:'illustration_bordered',mode:'inner_edge',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:46,R:585,T:50,B:829,OL:58,OR:572,OT:104,OB:827,semantic_warning:false,seed_revision:14},
  {card_id:'A-B07-P4',name:'Conkeldurr V',layout:'full_art_borderless',mode:'reference_required',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:31,R:596,T:17,B:851,OL:25,OR:600,OT:30,OB:850,semantic_warning:false},
  {card_id:'A-B10-P6',name:'Mega Excadrill ex',layout:'full_art_borderless',mode:'reference_required',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:35,R:592,T:17,B:850,OL:15,OR:590,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B16-P5',name:'Mega Greninja ex',layout:'full_art_borderless',mode:'reference_required',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:31,R:596,T:17,B:850,OL:20,OR:595,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B01-P5',name:"N's Reshiram",layout:'illustration_special',mode:'reference_required',outer_status:'TRANSFER_MED',inner_status:'MULTIVIEW_MED',L:37,R:593,T:17,B:850,OL:25,OR:608,OT:20,OB:865,semantic_warning:false},
  {card_id:'A-B05-P4',name:'Clefairy',layout:'illustration_special',mode:'reference_required',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:34,R:596,T:17,B:850,OL:25,OR:595,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B15-P1',name:'Fomantis',layout:'illustration_special',mode:'reference_required',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:29,R:596,T:17,B:850,OL:30,OR:590,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B15-P2',name:'Spewpa',layout:'illustration_special',mode:'reference_required',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:31,R:596,T:17,B:850,OL:20,OR:605,OT:35,OB:850,semantic_warning:false},
  {card_id:'A-B04-P6',name:"Misty's Vitality",layout:'trainer_item_energy',mode:'inner_edge',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:31,R:596,T:17,B:850,OL:25,OR:610,OT:30,OB:850,semantic_warning:false},
  {card_id:'A-B09-P4',name:'Lure Module',layout:'trainer_item_energy',mode:'inner_edge',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:31,R:596,T:17,B:850,OL:30,OR:590,OT:40,OB:850,semantic_warning:false},
  {card_id:'A-B10-P5',name:"Black Belt's Training",layout:'trainer_item_energy',mode:'reference_required',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_STABLE_FALSE',L:33,R:594,T:17,B:850,OL:30,OR:600,OT:25,OB:850,semantic_warning:true},
  {card_id:'A-B13-P6',name:'Wondrous Patch',layout:'trainer_item_energy',mode:'inner_edge',outer_status:'TRANSFER_HIGH',inner_status:'MULTIVIEW_MED',L:31,R:596,T:17,B:850,OL:25,OR:595,OT:35,OB:850,semantic_warning:false}
];

const WIDTH = 630;
const HEIGHT = 880;
const CARD_MM = {width:63, height:88};
const SAMPLE_T = [0.25, 0.5, 0.75];
const KEY = 'pokemon_centering_gold_v14';
const LEGACY_KEYS = ['pokemon_centering_gold_v13','pokemon_centering_gold_v12','pokemon_centering_gold_v11','pokemon_centering_gold_v10','pokemon_centering_gold_v09','pokemon_centering_gold_v08'];
const SVG_NS = 'http://www.w3.org/2000/svg';
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

try {
  let raw = localStorage.getItem(KEY);
  for (const key of LEGACY_KEYS) {
    if (!raw) raw = localStorage.getItem(key);
  }
  saved = JSON.parse(raw || '{}');
} catch (_) {
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
  return quadFromBox({L:+item.OL,R:+item.OR,T:+item.OT,B:+item.OB});
}

function innerSeed(item) {
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

function stateFor(item) {
  const existing = saved[item.card_id];
  const outerAI = outerSeed(item);
  const innerAI = innerSeed(item);
  if (existing) {
    const resetForNewAsset = Number(item.seed_revision || 0) > Number(existing.seed_revision || 0);
    const legacyInner = existing.inner || existing.box;
    return {
      ...existing,
      card_id:item.card_id,
      outer:resetForNewAsset ? cloneQuad(outerAI) : normalizeQuad(existing.outer,outerAI),
      inner:resetForNewAsset ? cloneQuad(innerAI) : normalizeQuad(legacyInner,innerAI),
      ai_outer:resetForNewAsset ? cloneQuad(outerAI) : normalizeQuad(existing.ai_outer,outerAI),
      ai_inner:resetForNewAsset ? cloneQuad(innerAI) : normalizeQuad(existing.ai_inner,innerAI),
      tilt:Number.isFinite(Number(existing.tilt)) ? Number(existing.tilt) : aiTilt(item),
      tilt_ai:Number.isFinite(Number(existing.tilt_ai)) ? Number(existing.tilt_ai) : aiTilt(item),
      pivot:existing.pivot ? point(existing.pivot.x,existing.pivot.y) : pivotSeed(),
      pan:existing.pan ? point(existing.pan.x,existing.pan.y) : point(existing.pan_x || 0,existing.pan_y || 0),
      edits:resetForNewAsset ? editSeed() : {...editSeed(),...(existing.edits || {})},
      mode:resetForNewAsset ? item.mode : (existing.mode || item.mode),
      confirmed:resetForNewAsset ? false : Boolean(existing.confirmed),
      seed_revision:item.seed_revision || existing.seed_revision || 13
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
    seed_revision:item.seed_revision || 14
  };
}

function snapshot() {
  return {
    outer:cloneQuad(cur.outer),
    inner:cloneQuad(cur.inner),
    tilt:cur.tilt,
    pivot:{...cur.pivot},
    pan:{...cur.pan},
    mode:cur.mode,
    edits:{...cur.edits}
  };
}

function remember() {
  history.push(snapshot());
  if (history.length > 40) history.shift();
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

function physicalScale(outer) {
  const widths = SAMPLE_T.map(function(t) {
    const left = sidePoint(outer,'L',t);
    const rightEdge = endpoints(outer,'R');
    return Math.abs(lineXAtY(rightEdge[0],rightEdge[1],left.y)-left.x);
  });
  const heights = SAMPLE_T.map(function(t) {
    const top = sidePoint(outer,'T',t);
    const bottomEdge = endpoints(outer,'B');
    return Math.abs(lineYAtX(bottomEdge[0],bottomEdge[1],top.x)-top.y);
  });
  return {x:mean(widths)/CARD_MM.width,y:mean(heights)/CARD_MM.height};
}

function buildMeasurements(state) {
  const activeState = state || cur;
  const scale = physicalScale(activeState.outer);
  const bySide = {L:[],R:[],T:[],B:[]};
  for (const side of ['L','R','T','B']) {
    const outerEdge = endpoints(activeState.outer,side);
    SAMPLE_T.forEach(function(t,index) {
      const innerPoint = sidePoint(activeState.inner,side,t);
      let outerPoint;
      let pixels;
      if (side === 'L' || side === 'R') {
        const x = lineXAtY(outerEdge[0],outerEdge[1],innerPoint.y);
        outerPoint = point(x,innerPoint.y);
        pixels = side === 'L' ? innerPoint.x-x : x-innerPoint.x;
      } else {
        const y = lineYAtX(outerEdge[0],outerEdge[1],innerPoint.x);
        outerPoint = point(innerPoint.x,y);
        pixels = side === 'T' ? innerPoint.y-y : y-innerPoint.y;
      }
      const safePixels = Math.max(0,pixels);
      bySide[side].push({
        id:side+(index+1),
        side:side,
        index:index+1,
        t:t,
        outer:outerPoint,
        inner:innerPoint,
        pixels:safePixels,
        mm:safePixels/(side === 'L' || side === 'R' ? scale.x : scale.y)
      });
    });
  }
  return {bySide:bySide,scale:scale};
}

function ratioSummary(firstSide,secondSide) {
  const samples = firstSide.map(function(value,index) {
    const total = value.mm + secondSide[index].mm;
    const first = total > 0 ? value.mm/total*100 : 50;
    return {first:first,second:100-first,index:index,deviation:Math.abs(first-50)};
  });
  const worst = samples.reduce(function(selected,value) {
    return value.deviation > selected.deviation ? value : selected;
  },samples[0]);
  const low = Math.min.apply(null,samples.map(function(value) { return value.first; }));
  const high = Math.max.apply(null,samples.map(function(value) { return value.first; }));
  return {samples:samples,worst:worst,spread:(high-low)/2};
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
  if (!showMeasurements || cur.mode !== 'inner_edge' || activeLayer === 'tilt') return;
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
  const canMeasure = cur.mode === 'inner_edge';
  for (const side of ['L','R','T','B']) {
    for (let index=1; index<=3; index++) {
      $('m'+side+index).textContent = canMeasure ? formatMm(measurements.bySide[side][index-1].mm) : '—';
    }
  }
  $('measureSource').textContent = cur.edits.outer || cur.edits.inner ? 'Gold-correctie' : 'AI-voorstel';
  $('studentBadge').innerHTML = canMeasure
    ? '<b>AI-student:</b> 24 zichtbare keypoints (12 buiten + 12 binnen). De slechtste P1/P2/P3-verhouding bepaalt de getoonde centering.'
    : '<b>AI-student:</b> 12 fysieke buitenrand-keypoints. De binnenrand loopt bij dit kaarttype via reference/template.';
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
  if (canInner) {
    const lr = ratioSummary(measurements.bySide.L,measurements.bySide.R);
    const tb = ratioSummary(measurements.bySide.T,measurements.bySide.B);
    $('lr').textContent = formatPct(lr.worst.first)+' / '+formatPct(lr.worst.second);
    $('tb').textContent = formatPct(tb.worst.first)+' / '+formatPct(tb.worst.second);
    $('lrSpread').textContent = 'slechtste: P'+(lr.worst.index+1)+' · spreiding ±'+formatPct(lr.spread)+'%';
    $('tbSpread').textContent = 'slechtste: P'+(tb.worst.index+1)+' · spreiding ±'+formatPct(tb.spread)+'%';
  } else {
    $('lr').textContent = 'reference';
    $('tb').textContent = 'reference';
    $('lrSpread').textContent = 'geen fictieve rand';
    $('tbSpread').textContent = 'template-route';
  }
  updateMeasurementTable(measurements);
  applyLayerView(measurements);
  drawLoupe();
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
  $('showInner').disabled = !canInner;
  $('showInner').title = canInner ? 'Binnenrand aanpassen' : 'Geen klassieke binnenrand; gebruik Reference/template';
  $('levelGuide').style.display = activeLayer === 'tilt' ? '' : 'none';
  $('pivotGroup').style.opacity = activeLayer === 'tilt' ? '.92' : '.22';
  outerGroup.classList.toggle('tiltLocked',activeLayer === 'tilt');
  outerGroup.classList.toggle('selected',activeLayer === 'outer' || activeLayer === 'both');
  innerGroup.classList.toggle('selected',activeLayer === 'inner' || activeLayer === 'both');
  outerGroup.style.pointerEvents = activeLayer === 'tilt' ? 'none' : 'auto';
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
    innerGroup.style.pointerEvents=canInner?'auto':'none';
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
  const color = loupeTarget.layer === 'outer' ? '#34e3ff' : '#ff4be3';
  const quad = cur[loupeTarget.layer];
  const sides = loupeTarget.key.length === 1
    ? [loupeTarget.key]
    : ({TL:['T','L'],TR:['T','R'],BR:['B','R'],BL:['B','L']}[loupeTarget.key] || []);
  for (const side of sides) {
    const edge=endpoints(quad,side);
    const dx=edge[1].x-edge[0].x;
    const dy=edge[1].y-edge[0].y;
    const length=Math.max(1,Math.hypot(dx,dy));
    const ux=dx/length;
    const uy=dy/length;
    const span=Math.max(canvas.width,canvas.height);
    context.save();
    context.translate(canvas.width/2,canvas.height/2);
    context.strokeStyle=color;
    context.globalAlpha=.72;
    context.lineWidth=7;
    context.setLineDash([18,14]);
    context.beginPath();
    context.moveTo(-ux*span,-uy*span);
    context.lineTo(ux*span,uy*span);
    context.stroke();
    context.globalAlpha=1;
    context.strokeStyle='#fff';
    context.lineWidth=1;
    context.setLineDash([]);
    context.beginPath();
    context.moveTo(-ux*span,-uy*span);
    context.lineTo(ux*span,uy*span);
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
}

function focusSide(layer,side) {
  setLoupe(layer,side,sidePoint(cur[layer],side,.5));
}

function loadCardImage(item) {
  const img=$('img');
  const status=$('imageStatus');
  const src='cards/'+item.card_id+'.jpg?v=14';
  img.dataset.cardId=item.card_id;
  img.alt=item.card_id+' · '+item.name;
  status.hidden=false;
  status.textContent='Kaart laden…';
  img.style.visibility='hidden';
  img.onload=function() {
    if(img.dataset.cardId!==item.card_id)return;
    img.style.visibility='visible';
    status.hidden=true;
    drawLoupe();
    notifyHeight();
    const next=ITEMS[(idx+1)%ITEMS.length];
    const preload=new Image();
    preload.src='cards/'+next.card_id+'.jpg?v=14';
  };
  img.onerror=function() {
    if(img.dataset.cardId!==item.card_id)return;
    img.style.visibility='hidden';
    status.hidden=false;
    status.textContent='Kaartbeeld kon niet laden. Vernieuw de pagina.';
  };
  img.src=src;
  if(img.complete&&img.naturalWidth>0)img.onload();
}

function updateWarning(item) {
  if (item.semantic_warning) {
    $('warning').innerHTML='<div class="warn"><b>Reference nodig.</b> De AI volgt hier een interne grafische lijn. Gebruik geen nep-binnenrand.</div>';
  } else if (cur.mode==='reference_required') {
    $('warning').innerHTML='<div class="warn"><b>Geen klassieke binnenrand.</b> De magenta laag en punten zijn uitgeschakeld; gebruik template/reference-registration.</div>';
  } else if (cur.mode==='not_measurable') {
    $('warning').innerHTML='<div class="warn"><b>Niet betrouwbaar meetbaar.</b> Sla deze kaart over en bewaar de reden in de notitie.</div>';
  } else {
    $('warning').innerHTML='<div class="good">Meetbaar. De AI-punten zijn alleen het startvoorstel; controleer de dunne kernlijnen.</div>';
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
  $('outerStatus').textContent=item.outer_status.replace('TRANSFER_','');
  $('innerStatus').textContent=item.inner_status.replace('MULTIVIEW_','');
  updateWarning(item);
  $('prog').textContent=Object.values(saved).filter(function(value) { return value.confirmed; }).length+' / '+ITEMS.length+' bevestigd';
  history=[];
  activeLayer='tilt';
  updateTilt();
  updateGeom();
  notifyHeight();
  try {
    parent.postMessage({type:'review-card-change',cardId:item.card_id},'*');
  } catch (_) {}
}

function persist(confirmed) {
  cur.note=$('note').value;
  cur.mode=$('mode').value;
  if(confirmed)cur.confirmed=true;
  cur.student_target=buildStudentTarget(cur,ITEMS[idx]);
  saved[cur.card_id]=cur;
  localStorage.setItem(KEY,JSON.stringify(saved));
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
}

function keepInnerInsideOuter() {
  cur.inner.TL.x=Math.max(cur.inner.TL.x,cur.outer.TL.x+2);
  cur.inner.TL.y=Math.max(cur.inner.TL.y,cur.outer.TL.y+2);
  cur.inner.TR.x=Math.min(cur.inner.TR.x,cur.outer.TR.x-2);
  cur.inner.TR.y=Math.max(cur.inner.TR.y,cur.outer.TR.y+2);
  cur.inner.BR.x=Math.min(cur.inner.BR.x,cur.outer.BR.x-2);
  cur.inner.BR.y=Math.min(cur.inner.BR.y,cur.outer.BR.y-2);
  cur.inner.BL.x=Math.max(cur.inner.BL.x,cur.outer.BL.x+2);
  cur.inner.BL.y=Math.min(cur.inner.BL.y,cur.outer.BL.y-2);
  clampQuad(cur.inner);
}

function normalizedKeypoints(quad) {
  const result=[];
  for(const side of ['L','R','T','B']) {
    SAMPLE_T.forEach(function(t,index) {
      const p=sidePoint(quad,side,t);
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
  const target={
    schema:'border-keypoints-v1',
    image_size:{width:WIDTH,height:HEIGHT},
    rule:'centerline_on_visual_transition',
    layout:item.layout,
    mode:state.mode,
    tilt_deg:Number(state.tilt||0),
    outer_keypoints:normalizedKeypoints(state.outer),
    inner_keypoints:state.mode==='inner_edge'?normalizedKeypoints(state.inner):null,
    source:state.confirmed?'gold_user':'ai_seed',
    edits:{...state.edits}
  };
  if(state.mode==='inner_edge') {
    const measurements=buildMeasurements(state);
    const lr=ratioSummary(measurements.bySide.L,measurements.bySide.R);
    const tb=ratioSummary(measurements.bySide.T,measurements.bySide.B);
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
    remember();
    const p=pos(event);
    const pan=cur.pan||panSeed();
    cur.pivot={x:clamp(p.x-pan.x,0,WIDTH),y:clamp(p.y-pan.y,0,HEIGHT)};
    cur.edits.tilt=true;
    pickingPivot=false;
    updateTilt();
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
  cur.edits[layer]=true;
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
  if(drag.layer==='outer')keepInnerInsideOuter();
  setLoupe(drag.layer,drag.key,p);
  updateGeom();
});

$('svg').addEventListener('pointerup',function() {
  drag=null;
});

$('svg').addEventListener('pointercancel',function() {
  drag=null;
});

document.querySelectorAll('[data-layer]').forEach(function(target) {
  const group=$(target.dataset.layer+'Group');
  target.addEventListener('pointerenter',function() {
    group.classList.add('hovered');
  });
  target.addEventListener('pointerleave',function() {
    group.classList.remove('hovered');
  });
});

$('tilt').addEventListener('pointerdown',function() {
  activeLayer='tilt';
  applyLayerView();
  remember();
});

$('tilt').addEventListener('input',function() {
  activeLayer='tilt';
  cur.tilt=Number($('tilt').value);
  cur.edits.tilt=true;
  updateTilt();
  applyLayerView();
});

$('tiltMinus').onclick=function() {
  activeLayer='tilt';
  remember();
  cur.tilt=Math.max(-4,cur.tilt-.1);
  cur.edits.tilt=true;
  updateTilt();
  applyLayerView();
};

$('tiltPlus').onclick=function() {
  activeLayer='tilt';
  remember();
  cur.tilt=Math.min(4,cur.tilt+.1);
  cur.edits.tilt=true;
  updateTilt();
  applyLayerView();
};

$('tiltAI').onclick=function() {
  activeLayer='tilt';
  remember();
  cur.tilt=cur.tilt_ai;
  cur.pivot=pivotSeed();
  cur.edits.tilt=false;
  pickingPivot=false;
  updateTilt();
  applyLayerView();
};

$('pickPivot').onclick=function() {
  activeLayer='tilt';
  pickingPivot=!pickingPivot;
  updateTilt();
  applyLayerView();
};

for(const pair of [['panX','x'],['panY','y']]) {
  $(pair[0]).addEventListener('pointerdown',function() {
    activeLayer='tilt';
    applyLayerView();
    remember();
  });
  $(pair[0]).addEventListener('input',function() {
    activeLayer='tilt';
    cur.pan[pair[1]]=Number($(pair[0]).value);
    updateTilt();
    applyLayerView();
  });
}

$('panReset').onclick=function() {
  activeLayer='tilt';
  remember();
  cur.pan=panSeed();
  updateTilt();
  applyLayerView();
};

$('showTilt').onclick=function() {
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
  remember();
  cur.mode=$('mode').value;
  if(cur.mode!=='inner_edge'&&(activeLayer==='inner'||activeLayer==='both'))activeLayer='outer';
  updateWarning(ITEMS[idx]);
  updateGeom();
  notifyHeight();
};

$('reset').onclick=function() {
  remember();
  const item=ITEMS[idx];
  cur.outer=outerSeed(item);
  cur.inner=innerSeed(item);
  cur.ai_outer=outerSeed(item);
  cur.ai_inner=innerSeed(item);
  cur.mode=item.mode;
  cur.tilt=aiTilt(item);
  cur.tilt_ai=aiTilt(item);
  cur.pivot=pivotSeed();
  cur.pan=panSeed();
  cur.edits=editSeed();
  pickingPivot=false;
  activeLayer='tilt';
  loupeTarget=null;
  $('mode').value=cur.mode;
  updateTilt();
  updateGeom();
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
    $('mode').value=cur.mode;
    pickingPivot=false;
    updateTilt();
    updateGeom();
  }
};

$('save').onclick=function() {
  persist(true);
  idx=Math.min(ITEMS.length-1,idx+1);
  render();
};

$('skip').onclick=function() {
  persist(false);
  idx=Math.min(ITEMS.length-1,idx+1);
  render();
};

$('prev').onclick=function() {
  persist(false);
  idx=(idx-1+ITEMS.length)%ITEMS.length;
  render();
};

$('next').onclick=function() {
  persist(false);
  idx=(idx+1)%ITEMS.length;
  render();
};

$('export').onclick=function() {
  persist(false);
  const labels=Object.values(saved).map(function(label) {
    const item=ITEMS.find(function(candidate) { return candidate.card_id===label.card_id; });
    const normalized=stateFor(item);
    return {
      ...normalized,
      tilt_deg:Number(normalized.tilt||0),
      ai_tilt_deg:Number(normalized.tilt_ai||0),
      pan_x:Number(normalized.pan ? normalized.pan.x : 0),
      pan_y:Number(normalized.pan ? normalized.pan.y : 0),
      student_target:buildStudentTarget(normalized,item)
    };
  });
  const payload={
    version:'centering-gold-v14',
    schema:'border-keypoints-v1',
    created:new Date().toISOString(),
    measurement_rule:'centerline_on_visual_transition',
    sample_positions:SAMPLE_T,
    labels:labels
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const anchor=document.createElement('a');
  anchor.href=URL.createObjectURL(blob);
  anchor.download='Pokemon_Centering_Gold_v14_labels.json';
  anchor.click();
  setTimeout(function() { URL.revokeObjectURL(anchor.href); },1000);
};

window.addEventListener('message',function(event) {
  if(window.parent!==window&&event.source!==window.parent)return;
  if(event.data?.type!=='review-select-card')return;
  const nextIndex=ITEMS.findIndex(function(item) { return item.card_id===event.data.cardId; });
  if(nextIndex<0||nextIndex===idx)return;
  persist(false);
  idx=nextIndex;
  render();
  window.scrollTo({top:0,behavior:'auto'});
});

window.addEventListener('resize',notifyHeight);
render();
