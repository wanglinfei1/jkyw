window.onload=function(){
  var Jheight=function(){
    var iH=document.documentElement.clientHeight;
    var oNav = document.getElementById('nav');
    var oApp = document.getElementById('app');
    var oMain = document.getElementById('main');
    console.log(iH);
    oNav.style.height = oMain.style.height=oApp.style.height=iH + 'px';
  }

  Jheight();
}

