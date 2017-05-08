
window.onload=function(){
    var imgHeight=$('.imgBox li img').height()+'px';
    $('.imgBox').css('height',imgHeight);
    slideImg(); //轮播
    $('.dz i').click(function(){    //赞点击
        $('.dz i').toggleClass('className');
    })

    //roll();
    $(".mainW a").attr("target","_blank");

    function roll(){
        var g_bMoveLeft=true;
        var g_oTimer=null;
        var g_oTimerOut=null;
        var g_bPause=true;
        var g_iPauseTime=500;
        var g_iSpeed=20;
        var oDiv=document.getElementById('doctor');
        var oUl=oDiv.getElementsByTagName('ul')[0];
        var aLi=oUl.getElementsByTagName('li');
        var i=0;
        var str=oUl.innerHTML+oUl.innerHTML;
        oUl.innerHTML=str;
        oUl.style.width=aLi[0].offsetWidth*aLi.length+'px';
        var l=0;
        startMove();
        function startMove(){
            g_oTimer=setInterval(function(){
                Domove('doctor','ul','li')
            }, 3000);

        }

        function Domove(oDiv,obj,sn){
            var oDiv=document.getElementById(oDiv);
            var oUl=oDiv.getElementsByTagName(obj)[0];
            var aLi=oUl.getElementsByTagName(sn);

            l-=g_iSpeed;
            if(l<=-oUl.offsetWidth/2)
            {
                l+=oUl.offsetWidth/2;
            }
            oUl.style.left=l+'px';
        }
    }
//图片滚动效果
    $.fn.extend({
        slider:function(value){
            var defaults={
                prevBtn:'',
                nextBtn:'',
                speed:500,
                timeOut:2000
            }
            var iTimer=null;
            value=$.extend(defaults,value);
            var len=$(this).children().length,
                w=$(this).find('li:first').outerWidth(),
                $this=$(this);
            $this.width(len*w);

            iTimer=setInterval(function(){
                if(!$this.is(':animated')){
                    nextImg()}
            },5000);
            $('.docList').hover(function(){
                clearInterval(iTimer);
            },function(){
                iTimer=setInterval(function(){
                    if(!$this.is(':animated')){
                        nextImg()}
                },5000);
            });
            function nextImg(){
                $this.stop().animate({'marginLeft':-w},value.speed,function(){
                    $this.find('li:first').appendTo($this);
                    $this.css({'marginLeft':8})
                })
            }
        }
    })

    //  $('.docList').slider();
    function slideImg(){   //轮播事件
        var oList=document.getElementById("list");
        if(oList){
            var oBtns=document.getElementById("btns");
            var aBtns=oBtns.getElementsByTagName("a");
            var aLi=oList.getElementsByTagName("li");
            var iZindex=1;
            var i=0;
            var timer=null;
            var iNow=iNum=0;
            for(i=0;i<aBtns.length;i++)
            {
                aBtns[i].index=i;
                aBtns[i].onclick=function()
                {
                    iZindex++;
                    var This=this.index;
                    tab(This);
                };
            }
            oList.onmouseover=oBtns.onmouseover=function(){
                clearInterval(timer);
            }
            oList.onmouseout=oBtns.onmouseout=function(){
                timer=setInterval(autoplay,4000);
            }
            timer=setInterval(autoplay,4000);
        }

        function tab(This)
        {
            aLi[This].style.zIndex=iZindex;
            aLi[iNow].style.opacity=0;
            aLi[iNow].style.filter='alpha(opacity=0)';
            aLi[This].style.opacity=1;
            aLi[This].style.filter='alpha(opacity=100)';
            aBtns[iNow].className='';
            aBtns[This].className='on';
            iNow=This;
        };
        function autoplay()
        {
            iNum++;
            iNum %= aLi.length;
            tab(iNum);
        }
    }
};

