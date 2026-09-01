(function(){
  var el=document.getElementById('img');
  if(!el) return;

  var src='sprite/cards.jpg?v=4';
  var probe=new Image();

  probe.onload=function(){
    el.style.backgroundImage='url("'+src+'")';
    el.dataset.imageStatus='loaded';
  };

  probe.onerror=function(){
    el.dataset.imageStatus='error';
    el.style.display='grid';
    el.style.placeItems='center';
    el.style.padding='24px';
    el.style.color='#ffb84d';
    el.style.fontWeight='700';
    el.style.textAlign='center';
    el.textContent='Kaartbeeld kon niet laden. Herlaad de pagina.';
  };

  probe.src=src;
})();
