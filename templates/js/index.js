/**
 * Created by jammy on 2017/4/5.
 */
$(function(){
    slideImg(); //轮播
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
                    //iZindex++;
                    var This=this.index;
                    tab(This);
                };
            }
            oList.onmouseover=oBtns.onmouseover=function(){
                clearInterval(timer);
            }
            oList.onmouseout=oBtns.onmouseout=function(){
                timer=setInterval(autoplay,3000);
            }
            timer=setInterval(autoplay,3000);
        }

        function tab(This)
        {
            aLi[This].style.zIndex=3;
            aLi[iNow].style.zIndex=1;
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
           // iZindex++;
            tab(iNum);
        }
    }
    /*咨询列表tab切换*/
    $('.JinfoContList').eq(0).show();
    $('.JboxDoc dl:last').addClass('JDllast');
    /*获取首页资讯标签*/
    $.ajax({
        url:servUrl,
        cache:false,
        async:false,
        contentType: 'text/plain',
        data:{
            'pathL':'/articleTag/usedList',
            'num':6
        },
        type : 'get',
        dataType : "json",
        success:function(res){
            if(res.state==0){
                var data=res.data;
            //    console.log(data);
                if (data.length > 0) {
                    var j = "";
                    for (var i = 0; i < data.length; i++) {
                        j += '<li isId="'+data[i].id+'"><a href="javascript:void(0);">'+data[i].name+'</a><i></i></li>';
                    }
                    $('#jIndexXin').html('<li class="active"><a href="javascript:void(0);">热门</a><i></i></li>' + j);
                }
            }
        },
        error:function(res){
        //    console.log(res)
        }
    });
    /*获取热门标签下面的文章*/
    var Jhotdata={
        'pathL':'/article/queryHotListByPage',
        'pageNum':1,
        'pageSize':6
    };
    hotNews(Jhotdata,"../compileEjs/hotNews.ejs",'#JinfoCont .JinfoContList',0);
    /*获取医生列表*/
    var Jdocdata={
        'pathL':'/doctor/queryAll',
        'pageNum':1,
        'pageSize':3
    };
    hotNews(Jdocdata,"../compileEjs/indexDoctors.ejs",'.JboxDoc');

    /*点击标签切换列表*/
    $('.JinfoTab').on('click','li',function(){
        $(this).addClass('active').siblings().removeClass('active');
        $('.JinfoCont .JinfoContList').eq($(this).index()).show().siblings().hide();
        if($(this).index()!==0){ //如果不是热门，则执行其他标签的列表展示
            var Aridata={
                'pathL':'/article/queryArticleListByTag',
                'pageNum':1,
                'pageSize':6,
                'tagId':$(this).attr('isid')
            };
            hotNews(Aridata,"../compileEjs/hotNews.ejs",'#JinfoCont .JinfoContList',$(this).index());
           /* if($('#JinfoCont .JinfoContList').eq($(this).index()).find('a').length==0){ //如果是第一次获取
                /!*根据当前获取当前标签下面的文章*!/

            }else{    //不是第一次获取直接显示隐藏
                $('.JinfoCont .JinfoContList').eq($(this).index()).show().siblings().hide();
            }*/
        }else{
            hotNews(Jhotdata,"../compileEjs/hotNews.ejs",'#JinfoCont .JinfoContList',0);
        }
    })

})
