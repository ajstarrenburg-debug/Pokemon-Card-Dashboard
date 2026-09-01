(function(){
  function paint(){
    var el=document.getElementById('img');
    if(!el||!window.SPRITE_B64) return false;
    var u='url("data:image/jpeg;base64,'+window.SPRITE_B64+'")';
    el.style.backgroundImage=u;
    document.documentElement.style.setProperty('--sprite',u);
    return true;
  }
  function loadData(){
    if(window.SPRITE_B64){ paint(); return; }
    var s=document.createElement('script');
    s.src='sprite/data.js?v=2';
    s.async=false;
    s.onload=function(){
      if(!paint()) console.error('Sprite data loaded, but card image could not be painted.');
    };
    s.onerror=function(){ console.error('Could not load sprite/data.js'); };
    document.head.appendChild(s);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',loadData,{once:true});
  }else{
    loadData();
  }
})();
