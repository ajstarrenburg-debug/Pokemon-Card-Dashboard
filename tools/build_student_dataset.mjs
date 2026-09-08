import { readFile, writeFile } from 'node:fs/promises';

const EXPECTED_SCHEMA = 'border-keypoints-v1';
const EXPECTED_POINTS = 12;
const RECROPPED_V16 = new Set(['A-B01-P5','A-B05-P4','A-B15-P1','A-B15-P2','A-B04-P6','A-B09-P4','A-B10-P5','A-B13-P6']);

function assert(condition,message) {
  if (!condition) throw new Error(message);
}

function validatePoint(point,index,label) {
  assert(point && Number.isFinite(point.x) && Number.isFinite(point.y),label+' point '+index+' is invalid');
  assert(point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1,label+' point '+index+' is outside normalized image space');
  assert(typeof point.id === 'string' && /^[LRTB][123]$/.test(point.id),label+' point '+index+' has an invalid id');
}

function validateTarget(target,cardId) {
  assert(target && target.schema === EXPECTED_SCHEMA,cardId+' uses the wrong target schema');
  assert(target.rule === 'centerline_on_visual_transition',cardId+' uses the wrong measurement rule');
  assert(Array.isArray(target.outer_keypoints) && target.outer_keypoints.length === EXPECTED_POINTS,cardId+' must have 12 outer keypoints');
  target.outer_keypoints.forEach(function(point,index) { validatePoint(point,index,cardId+' outer'); });
  if (target.mode === 'inner_edge') {
    assert(Array.isArray(target.inner_keypoints) && target.inner_keypoints.length === EXPECTED_POINTS,cardId+' must have 12 inner keypoints');
    target.inner_keypoints.forEach(function(point,index) { validatePoint(point,index,cardId+' inner'); });
    assert(target.measurements_mm && target.centering,cardId+' is missing derived measurement targets');
  } else {
    assert(target.inner_keypoints === null,cardId+' reference target must not contain a fictitious inner border');
  }
}

export function buildDataset(payload) {
  assert(payload && payload.schema === EXPECTED_SCHEMA,'Input is not a supported keypoint export');
  assert(payload.measurement_rule === 'centerline_on_visual_transition','Input uses the wrong measurement rule');
  assert(Array.isArray(payload.labels),'Input labels are missing');
  const examples=[];
  const excluded=[];
  for (const label of payload.labels) {
    if (!label.confirmed) continue;
    const target=label.student_target;
    validateTarget(target,label.card_id);
    const revision=label.asset_revision || (label.seed_revision >= 16 ? 16 : 15);
    if (target.identity_verified === false || (label.card_id === 'A-B01-P5' && revision < 16)) {
      excluded.push({card_id:label.card_id,reason:'legacy_image_identity_mismatch'});
      continue;
    }
    const imagePath='cards/'+(RECROPPED_V16.has(label.card_id) && revision < 16 ? 'v15/' : '')+label.card_id+'.jpg';
    assert(!target.image_path || target.image_path === imagePath,label.card_id+' image revision mismatch');
    const transform=target.image_transform || {
      rotation_deg:Number(label.tilt || 0),
      pivot_px:label.pivot || {x:315,y:440},
      translation_px:label.pan || {x:Number(label.pan_x || 0),y:Number(label.pan_y || 0)}
    };
    assert([transform.rotation_deg,transform.pivot_px?.x,transform.pivot_px?.y,transform.translation_px?.x,transform.translation_px?.y].every(Number.isFinite),label.card_id+' has an invalid image transform');
    examples.push({
      card_id:label.card_id,
      image_path:imagePath,
      asset_revision:revision,
      coordinate_space:'review_canvas',
      image_transform:transform,
      source:'gold_user',
      target:target
    });
  }
  assert(examples.length > 0,'No confirmed Gold labels found');
  return {
    dataset:'pokemon-centering-student-v1',
    schema:EXPECTED_SCHEMA,
    created:new Date().toISOString(),
    example_count:examples.length,
    excluded:excluded,
    examples:examples
  };
}

function fakePoints() {
  const points=[];
  for (const side of ['L','R','T','B']) {
    for (let index=1; index<=3; index++) {
      points.push({id:side+index,side:side,index:index,x:0.1*index,y:0.1*index});
    }
  }
  return points;
}

function selfTest() {
  const points=fakePoints();
  const target={
    schema:EXPECTED_SCHEMA,
    rule:'centerline_on_visual_transition',
    mode:'inner_edge',
    outer_keypoints:points,
    inner_keypoints:points,
    measurements_mm:{L:[1,1,1],R:[1,1,1],T:[1,1,1],B:[1,1,1]},
    centering:{lr:{first:50,second:50},tb:{first:50,second:50}}
  };
  const result=buildDataset({
    schema:EXPECTED_SCHEMA,
    measurement_rule:'centerline_on_visual_transition',
    labels:[{card_id:'SELF-TEST',confirmed:true,student_target:target}]
  });
  assert(result.example_count === 1,'Self-test output count is wrong');
  const positioned=buildDataset({schema:EXPECTED_SCHEMA,measurement_rule:'centerline_on_visual_transition',labels:[{card_id:'A-B03-P5',confirmed:true,tilt:-0.9,pivot:{x:301,y:429},pan:{x:-10,y:10},student_target:target}]});
  assert(positioned.examples[0].image_transform.rotation_deg === -0.9 && positioned.examples[0].image_transform.translation_px.x === -10 && positioned.examples[0].image_transform.pivot_px.y === 429,'Tilt, pan and pivot must travel with the training image');
  process.stdout.write('STUDENT_DATASET_OK border-keypoints-v1 24 keypoints\n');
}

async function main() {
  const args=process.argv.slice(2);
  if (args[0] === '--self-test') {
    selfTest();
    return;
  }
  assert(args[0],'Usage: npm run student:prepare -- <Gold-export.json> [output.json]');
  const inputPath=args[0];
  const outputPath=args[1] || 'training/student-dataset-v1.json';
  const payload=JSON.parse(await readFile(inputPath,'utf8'));
  const dataset=buildDataset(payload);
  await writeFile(outputPath,JSON.stringify(dataset,null,2)+'\n','utf8');
  process.stdout.write('STUDENT_DATASET_READY '+dataset.example_count+' '+outputPath+'\n');
}

main().catch(function(error) {
  process.stderr.write(String(error.message || error)+'\n');
  process.exitCode=1;
});
