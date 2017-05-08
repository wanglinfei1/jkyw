
$(function () {
    var home = window.location.href;
    var menuJson = {
        menus:[
            {"title":"患者管理","iconClass":"ico_h","url":"#","menus":[
                {"title":"我的患者","iconClass":"glyphicon glyphicon-time","url":"../html/Doc_WpatientManage.html?jmenu=Doc_WpatientManage"}
            ]},
            {"title":"个人中心","iconClass":"ico_users","url":"#","menus":[
                {"title":"个人信息","iconClass":"glyphicon glyphicon-cog","url":"../../html/Doc_YpersonalCenter.html?title=1&jmenu=Doc_YpersonalCenter"},
                {"title":"设置密码","iconClass":"glyphicon glyphicon-cog","url":"../../html/Doc_YchangePaw.html?jmenu=Doc_YchangePaw"}
            ]}
        ]
    };
/*初始化菜单*/
    initMenu("fadeInLeft","metisMenu",menuJson);
    function initMenu(effect,target,menuJson){
        var $ul = $('<ul class="nav nav-one-level" id="side-menu"></ul>');
        $("#"+target).append($ul);
        createMenu(effect,target,menuJson,$("#side-menu"));
    }
   $('#side-menu li').not('.nav-second-level li').click(function(){
       $(this).siblings().find('.nav-second-level').slideUp();
       $(this).find('.nav-second-level').slideToggle();
       $(this).addClass('active').siblings().removeClass('active');
   })
    $('.nav-second-level li').click(function(event){
        var event = event || window.event;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    })
    $('#page-wrapper').css('height',$(window).height()-144);
    function createMenu(effect,target,menuJson,obj){
        var _menus = menuJson.menus;
        var menu_length = _menus.length; //一级菜单个数
        for(var i=0;i<menu_length;i++){
            var _menu = _menus[i];
            var _title = _menu.title;
            var _icon = "fa "+_menu.iconClass;
            var _url = _menu.url;
            var iMent=getTitleParam('jmenu',_url);
            $span = $();
            $ul = $('<ul class="animated nav nav-second-level '+effect+' " ></ul>');
            $li = $();
            if(_menu.menus != undefined && _menu.menus.length > 0){
                $a=$('<a href="javascript:;"><i class="'+_icon+'"></i><span class="nav-label">'+_title+'</span><span class="fa fa-angle-down"></span></a>'); //有二级的一级
                $li = $('<li ></li>').append($a).append($ul);
            }else{
                if(_menu.ifSelf){
                    $a=$('<a class="J_menuItem '+iMent+'"  href="'+_url+'" iUrl="'+_url+'"><i class="'+_icon+'"></i> <span class="nav-label">'+_title+'</span></a>');//没有二级的一级
                    $li = $('<li ></li>').append($a);  //如果shi二级
                }else{
                    $a=$('<a class="J_menuItem '+iMent+'" href="'+_url+'" iUrl="'+_url+'">'+_title+'</a>') //二级
                    $li = $('<li ></li>').append($a);  //如果shi二级
                }
            }
            if(_menu.menus != undefined && _menu.menus.length > 0) //如果shi一级
                $li = $('<li ></li>').append($a).append($ul);
            else
                $li = $('<li ></li>').append($a);  //如果shi二级
            obj.append($li);
            if(_menu.menus != undefined && _menu.menus.length > 0){
                for(var k=0;k<_menu.menus.length;k++){
                    createMenu(effect,target,_menu,$ul);
                }
            }
            //默认第一个选中
            var ijTitle=getRequestParam('jmenu');
            if(ijTitle){
                $('.'+ijTitle+'').parents('li').addClass('active');
            }
        }
    }
    docInfor();
    /*判断医生是否登陆*/
    function docInfor() {
        if (dcIiToken&&dcIiToken!='undefined'&&dcIiToken!='null') {
            $.ajax({
                url: servUrl,
                data: {
                    'pathL': '/doctor/info',
                    'token': dcIiToken,
                    'terminal':'pc'
                },
                type: 'get',
                dataType: "json",
                success: function (res) {
                //    console.log(res);
                    if(res.state==0){
                        $('.top-right dfn').html(res.data.name+'医生');
                    }else if (res.state == 1003) {
                        var DocrefreshToken = getCookieValue("DocfreshToken");
                        resToken(DocrefreshToken)
                    }
                },
                error: function (res) {
                //    console.log(res)
                }
            });
        }else{
            window.location = "../html/Y_Login.html?userType=doc";
        }
        $('.top-right a').on('click',function(){
            delCookie('DocToken');
            delCookie('DocfreshToken');
            delCookie('Doc_id');
            window.location = "../html/Y_Login.html?userType=doc";
        });
    }
});