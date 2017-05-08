
  window.onload=function(){
    //scroll('qj_sy-con2rt','qj_periodical');
	function scroll(oDiv3,oDiv4){
	 var oDiv3 = document.getElementById(oDiv3);
	 var oDiv4 = document.getElementById(oDiv4);
	 var disY = 0;
	 var bBtn = true;
	 var T = 0;
	 if(oDiv4.addEventListener){
	    oDiv4.addEventListener('DOMMouseScroll',toChange,false);
	  }
	  oDiv4.onmousewheel = toChange;

	  function toChange(ev){
	    var ev = ev || window.event;
	    if(ev.detail){
	      bBtn =  ev.detail>0  ? true : false;
	    }
	    else{
	      bBtn =  ev.wheelDelta<0 ? true : false;
	    }
	    if(bBtn){  //下
	      T =T - 30;
	      if(T< -(oDiv4.offsetHeight - oDiv3.offsetHeight)){
	       T = -(oDiv4.offsetHeight - oDiv3.offsetHeight);
	       }
	    }
	    else{  //上
	      T =T + 30;
	      if(T>0){
	       T = 0;
	       }
	    }
	    oDiv4.style.top = T + 'px';
	    if(ev.preventDefault){
	      ev.preventDefault();
	    }
	    else{
	      return false;
	    }
      }
	}
  }
