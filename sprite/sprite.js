document.write('<script src="sprite/data.js"><\/script>');
(function(){
  function paint(){
    var el=document.getElementById('img');
    if(!el||!window.SPRITE_B64)return;
    var u='url("data:image/jpeg;base64,'+window.SPRITE_B64+'")';
    el.style.backgroundImage=u;
    document.documentElement.style.setProperty('--sprite',u);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',paint,{once:true}); else paint();
  setTimeout(paint,250);
})();
