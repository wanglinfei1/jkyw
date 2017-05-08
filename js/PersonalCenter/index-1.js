/**
 * Created by wanglinfei on 2017/2/7.
 */
if(!JSON.parse(localStorage.getItem("loginData"))){
    window.location="../webPage/login.html";
}
var getList=null;
var Won;
var current=1;
var total;
/*创建结构*/
var creatHtml=function (current,total) {
    var content = "";
    content += "<a><</a>";
    if (total > 7) {
        if (current < 4) {
            for (var i = 1; i < 7; i++) {
                if (current == i) {
                    content += "<a class='active'>" + i + "</a>";
                } else {
                    content += "<a>" + i + "</a>";
                }
            }
            content += "<i>...</i>";
            content += "<a>" + total + "</a>";
        } else {
            if (current < total - 3) {
                content += "<a name='1' type='button' class='page num'>1</a>";
                content += "<i>...</i>";
                for (var i = current - 2; i < current + 3; i++) {
                    if (current == i) {
                        content += "<a class='active'>" + i + "</a>";
                    } else {
                        content += "<a>" + i + "</a>";
                    }
                }
                content += "<i>...</i>";
                content += "<a>" + total + "</a>";
            } else {
                content += "<a>1</a>";
                content += "<i>...</i>";
                for (var i = total - 5; i < total + 1; i++) {
                    if (current == i) {
                        content += "<a class='active'>" + i + "</a>";
                    } else {
                        content += "<a>" + i + "</a>";
                    }
                }
            }
        }
    } else {
        for (var i = 1; i < total + 1; i++) {
            if (current == i) {
                content += "<a class='active'>" + i + "</a>";
            } else {
                content += "<a>" + i + "</a>";
            }
        }
    }
    content += "<a>></a>";
    content += "<div>"
    content += "共 " + total + " 页";
    content += "  &nbsp;&nbsp; 到第 ";
    content += "<input id='send' max='3' maxlength='3' value='" + current + "' type='text' />";
    content += " 页 ";
    content += "<span>Go</span>";
    content += "</div>"
    $('.page4').html(content);
    $(function(){
        //我的在线咨询切换
        $('.visits .title span').on('click',function(){
            var visitsArr=['图文咨询','电话咨询'];
            $('.visits .title span').removeClass('active');
            $(this).addClass('active');
            var n=$(this).index();
            $('.visits .div2 div.hide').css('display','none');
            $('.visits .div2 div.hide').eq(n).css('display','block');
            $('.visits h3 i').html(visitsArr[n]);
        });
    });
    $(function () {
        var loginData = JSON.parse(localStorage.getItem("loginData"));
        var time1;
        var time2;

        /*初始化日历*/
        $(".accurate .acc").datepicker({
            inline: true,
            showOtherMonths: true
        }).datepicker('widget').wrap('<div class="ll-skin-lugo"/>');
        $('.acc').off('change').on('change', function () {
            var timerVal = $(this).val();
            if(timerVal==''){return};
            var timerArr = $(this).val().split('/');
            var timerStr = timerArr[2] + '-' + timerArr[0] + '-' + timerArr[1];
            $(this).val(timerStr);
        });
    });

    $('.apploiction .ulList .span5').on('click',function(){
        window.location = "index-3.html";
    });
    $('.visits .call-visits-list .ulList .span6').on('click',function(){
        window.location = "index-2.html";
    });
    $('.visits .ulList').on('click','.openText',function(){
       var iHt=$(this).parent().html();
        $(this).parent().html('<p>'+$(this).siblings('.Alltext').text()+'</p><b class="openClose cursor">收缩</b>');
        $('.visits .ulList').off('click','.openClose').on('click','.openClose',function(){
            var iAll=$(this).siblings().html();
            var val= $(this).siblings().html().substring(0,23);
           var  Ihtml=val+'...<p class="Alltext" style="display:none">'+iAll+'</p><b class="openText cursor">展开</b>';
            $(this).parent().html(Ihtml);
        })
    })

};