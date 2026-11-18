// Isolated DOM/storage harness for actual production functions. Fictional labels only.
import vm from 'node:vm';
const copy=value=>JSON.parse(JSON.stringify(value));
export function app(source,initial={}) {
  const timers=new Map();let nextTimer=0;
  const nodes=new Map(),storage=new Map(Object.entries(initial)),writes=[],downloads=[],windowEvents={};
  const ctx={paths:[],matrix:[1,0,0,1,0,0],stack:[],path:[],strokeStyle:'',lineWidth:1,
    clearRect(){this.paths=[];},fillRect(){},fillText(){},drawImage(){},setLineDash(){},arc(){},fill(){},
    save(){this.stack.push({matrix:[...this.matrix],strokeStyle:this.strokeStyle,lineWidth:this.lineWidth});},
    restore(){Object.assign(this,this.stack.pop());},
    translate(x,y){const m=this.matrix;m[4]+=m[0]*x+m[2]*y;m[5]+=m[1]*x+m[3]*y;},
    scale(x,y){this.matrix[0]*=x;this.matrix[1]*=x;this.matrix[2]*=y;this.matrix[3]*=y;},
    rotate(r){const m=[...this.matrix],c=Math.cos(r),s=Math.sin(r);this.matrix[0]=m[0]*c+m[2]*s;this.matrix[1]=m[1]*c+m[3]*s;this.matrix[2]=-m[0]*s+m[2]*c;this.matrix[3]=-m[1]*s+m[3]*c;},
    beginPath(){this.path=[];},moveTo(x,y){const m=this.matrix;this.path.push([m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]]);},
    lineTo(x,y){this.moveTo(x,y);},stroke(){this.paths.push({color:this.strokeStyle,width:this.lineWidth,points:copy(this.path)});}
  };
  function el(id) {
    if(!nodes.has(id))nodes.set(id,{id,value:'',textContent:'',innerHTML:'',dataset:{},style:{},attributes:{},listeners:{},children:[],disabled:false,hidden:false,
      width:id==='loupe'?700:630,height:id==='loupe'?350:880,complete:false,naturalWidth:0,
      classList:{values:new Set(),add(k){this.values.add(k);},remove(k){this.values.delete(k);},toggle(k,on){if(on)this.values.add(k);else this.values.delete(k);},contains(k){return this.values.has(k);}},
      setAttribute(k,v){this.attributes[k]=String(v);},getAttribute(k){return this.attributes[k];},
      addEventListener(k,fn){this.listeners[k]=fn;},getContext(){return ctx;},
      replaceChildren(){this.children=[];},appendChild(child){this.children.push(child);},
      getBoundingClientRect(){return{left:0,top:0,width:630,height:880};},
      focus(){this.focused=true;},setPointerCapture(){},click(){if(this.onclick)this.onclick({});}
    });return nodes.get(id);
  }
  const handles=[];
  for(const [layer,prefix] of [['outer','o'],['inner','i']]) {
    for(const side of ['L','R','T','B']) {const node=el(prefix+'s'+side);node.dataset={layer,side};node.classList.add('sideHandle');handles.push(node);}
    for(const corner of ['TL','TR','BR','BL']) {const node=el(prefix+corner);node.dataset={layer,corner};node.classList.add('cornerHandle');handles.push(node);}
  }
  const document={getElementById:el,querySelectorAll(){return handles;},querySelector(selector){if(selector==='header')return{offsetHeight:60};if(selector==='main')return{scrollHeight:2000};return null;},
    createElementNS(ns,name){return el('svg-'+name+'-'+Math.random());},createElement(name){return{click(){},...{tagName:name}};},
    documentElement:{style:{setProperty(){}}}};
  const window={addEventListener(name,fn){windowEvents[name]=fn;},scrollTo(){}};window.parent=window;
  const context=vm.createContext({document,window,parent:{postMessage(){}},Image:class{},requestAnimationFrame(){},
    localStorage:{getItem(k){return storage.get(k)||null;},setItem(k,v){storage.set(k,v);writes.push({key:k,value:v});}},
    Blob,URL:{createObjectURL(blob){downloads.push(blob);return'audit:download';},revokeObjectURL(){}},setTimeout(fn){const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout(id){timers.delete(id);}});
  vm.runInContext(source,context);
  return {el,nodes,storage,writes,downloads,ctx,windowEvents,context,runTimers(){for(const [id,fn] of [...timers]){timers.delete(id);fn();}},loadImage(){el('img').complete=true;el('img').naturalWidth=630;el('img').naturalHeight=880;el('img').onload();},run(code,args={}){Object.assign(context,args);return vm.runInContext(code,context);}};
}
