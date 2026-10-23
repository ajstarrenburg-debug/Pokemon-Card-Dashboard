// Local-only Gold restore. No network, image loading or training-data writes.
export const MAX_RESTORE_BYTES = 5 * 1024 * 1024;
const modes = ['inner_edge','reference_required','not_measurable','reference_or_edge'];
const corners = ['TL','TR','BR','BL'];
const own = (value,key) => Object.prototype.hasOwnProperty.call(value,key);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function requireValue(ok,message) {
  if (!ok) throw new Error(message);
}
function number(value,min,max) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}
function validPoint(value,xLimit=630,yLimit=880) {
  return object(value) && number(value.x,0,xLimit) && number(value.y,0,yLimit);
}
function quad(value) {
  requireValue(object(value),'Meetvlak ontbreekt of is ongeldig.');
  let result;
  if (corners.every(key => own(value,key))) {
    requireValue(corners.every(key => validPoint(value[key])),'Ongeldige meetpunten.');
    result = Object.fromEntries(corners.map(key => [key,{x:value[key].x,y:value[key].y}]));
  } else {
    requireValue(number(value.L,0,630) && number(value.R,0,630)
      && number(value.T,0,880) && number(value.B,0,880),'Ongeldig oud meetvlak.');
    result = {TL:{x:value.L,y:value.T},TR:{x:value.R,y:value.T},BR:{x:value.R,y:value.B},BL:{x:value.L,y:value.B}};
  }
  const p = corners.map(key => result[key]);
  requireValue(p.every((a,i) => {
    const b=p[(i+1)%4],c=p[(i+2)%4];
    return (b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x)>0;
  }),'Meetvlak is leeg, gekruist of omgekeerd.');
  return result;
}
function safeTree(value,depth=0) {
  requireValue(depth<=30,'Bestand is te diep genest.');
  if (!object(value) && !Array.isArray(value)) return;
  for (const key of Object.keys(value)) {
    requireValue(!['__proto__','prototype','constructor'].includes(key),'Onveilige JSON-sleutel.');
    safeTree(value[key],depth+1);
  }
}
function revision(value) { return Number.isInteger(value) && value >= 1 && value <= 16; }

export function parseGoldExport(text,items) {
  requireValue(typeof text === 'string' && new TextEncoder().encode(text).length <= MAX_RESTORE_BYTES,'Bestand is te groot (maximaal 5 MB).');
  let payload;
  try { payload=JSON.parse(text.replace(/^\uFEFF/,'')); }
  catch (_) { throw new Error('Geen geldig JSON-bestand.'); }
  safeTree(payload);
  requireValue(object(payload),'Geen Gold-export.');
  const match = /^centering-gold-v(0[89]|1[0-6])$/.exec(payload.version);
  requireValue(match,'Niet-ondersteunde exportversie; gebruik centering-gold-v08 t/m v16.');
  const version=Number(match[1]);
  requireValue(payload.schema === undefined || payload.schema === 'border-keypoints-v1','Onbekend exportschema.');
  requireValue(payload.measurement_rule === undefined || payload.measurement_rule === 'centerline_on_visual_transition','Onbekende meetregel.');
  requireValue(payload.sample_positions === undefined || JSON.stringify(payload.sample_positions)==='[0.25,0.5,0.75]','Onbekende meetposities.');
  requireValue(Array.isArray(payload.labels) && payload.labels.length>0 && payload.labels.length<=1000,'Geen geldige lijst met beoordelingen (1–1000).');
  const known = new Map(items.map(item=>[item.card_id,item]));
  const seen = new Set();
  const labels = payload.labels.map(input => {
    requireValue(object(input) && typeof input.card_id==='string' && known.has(input.card_id),'Onbekende kaart; dit bestand hoort mogelijk bij een andere kaartenset.');
    requireValue(!seen.has(input.card_id),'Dubbele kaart-ID in het bestand.');
    seen.add(input.card_id);
    requireValue(typeof input.confirmed==='boolean' && modes.includes(input.mode),'Ongeldige bevestiging of meetmodus.');
    requireValue(input.note===undefined || (typeof input.note==='string' && input.note.length<=20000),'Ongeldige of te lange notitie.');
    const result={card_id:input.card_id,confirmed:input.confirmed,mode:input.mode==='reference_or_edge' ? 'reference_required' : input.mode,note:input.note || '',
      outer:quad(input.outer),inner:quad(input.inner || input.box)};
    for (const field of ['ai_outer','ai_inner']) if (own(input,field)) result[field]=quad(input[field]);
    for (const [field,alias] of [['tilt','tilt_deg'],['tilt_ai','ai_tilt_deg']]) {
      for (const key of [field,alias]) if (own(input,key)) requireValue(number(input[key],-4,4),'Ongeldige rotatiecorrectie.');
      if (own(input,field) && own(input,alias)) requireValue(input[field]===input[alias],'Tegenstrijdige rotatiecorrecties.');
      result[field]=input[field] ?? input[alias] ?? 0;
    }
    if (own(input,'pivot')) requireValue(validPoint(input.pivot),'Ongeldig draaipunt.');
    result.pivot=input.pivot ? {x:input.pivot.x,y:input.pivot.y} : {x:315,y:440};
    if (own(input,'pan')) requireValue(object(input.pan) && number(input.pan.x,-80,80) && number(input.pan.y,-80,80),'Ongeldige beeldverschuiving.');
    for (const [alias,axis] of [['pan_x','x'],['pan_y','y']]) {
      if (own(input,alias)) {
        requireValue(number(input[alias],-80,80),'Ongeldige beeldverschuiving.');
        if (input.pan) requireValue(input.pan[axis]===input[alias],'Tegenstrijdige beeldverschuivingen.');
      }
    }
    result.pan=input.pan ? {x:input.pan.x,y:input.pan.y} : {x:input.pan_x ?? 0,y:input.pan_y ?? 0};
    if (own(input,'edits')) {
      requireValue(object(input.edits) && Object.keys(input.edits).every(key=>['outer','inner','tilt'].includes(key) && typeof input.edits[key]==='boolean'),'Ongeldige correctievlaggen.');
    }
    result.edits={outer:false,inner:false,tilt:false,...input.edits};
    for (const field of ['seed_revision','mode_revision','asset_revision']) {
      if (own(input,field)) {
        requireValue(revision(input[field]) && input[field]<=version,'Ongeldige afbeeldings- of labelrevisie.');
        result[field]=input[field];
      }
    }
    // Lapras changed pixels in v14; its pre-v14 asset is not shipped in this app.
    requireValue(input.card_id!=='A-B03-P4' || (version>=14 && (input.seed_revision===undefined || input.seed_revision>=14)),
      'Oude Lapras-afbeelding (v08–v13) ontbreekt; herstel afgewezen om meetpunten bij de juiste afbeelding te houden.');
    // Other v08–v15 labels use the retained v15 pixels, never a v16 crop.
    result.asset_revision ??= version<16 ? 15 : (Number(input.seed_revision)>=16 ? 16 : 15);
    requireValue(result.asset_revision===15 || result.asset_revision===16,'Afbeeldingsrevisie niet beschikbaar.');
    if (version===16) requireValue(own(input,'asset_revision') && own(input,'seed_revision'),'Afbeeldingsrevisie ontbreekt in v16-export.');
    const item=known.get(input.card_id);
    requireValue(result.asset_revision!==16 || item.seed_revision===16,'Afbeeldingsrevisie past niet bij deze kaart.');
    result.seed_revision ??= Math.min(version,15);
    result.mode_revision ??= Math.min(version,15);
    // Keep restored drafts on their original pixels, just like confirmed Gold.
    result.restored_from_export=true;
    // student_target and other derived fields are intentionally rebuilt by the app.
    return result;
  });
  return {version:payload.version,labels};
}

export function planGoldRestore(parsed,current) {
  const next=JSON.parse(JSON.stringify(current));
  const rows=parsed.labels.map(label=>{
    const conflict=own(current,label.card_id);
    if (!conflict) next[label.card_id]=JSON.parse(JSON.stringify(label));
    return {label,conflict};
  });
  return {next,rows,added:rows.filter(row=>!row.conflict).length};
}

// setItem is atomic: a quota/security failure cannot partially replace the state.
export function commitGoldRestore(storage,key,expected,plan) {
  for (const [name,value] of Object.entries(expected)) {
    requireValue(storage.getItem(name)===value,'Lokale gegevens zijn gewijzigd. Selecteer het bestand opnieuw voor een actuele voorvertoning.');
  }
  requireValue(plan.added>0,'Alle kaarten bestaan al; niets te herstellen.');
  storage.setItem(key,JSON.stringify(plan.next));
}
