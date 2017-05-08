/**
 * Created by wanglinfei on 2017/3/20.
 */
define(["jquery","common","errorConfig","fastclick","jweixin","weui","jqWeui","touchSwiper"],function($,Common,Error,FastClick,wx){
    function MyName(){
        this.ejs = "views/myName";
        this.cssPath = ["styles/reset.css","styles/name.css","styles/weui.min.css","styles/jquery-weui.css","styles/style.css"];
    }

    MyName.prototype= {
        init: function (business) {
            var _t = this;
            Common.panel.add(_t.ejs, {}, "myName").open(true);
            $(function() {
                FastClick.attach(document.body);
            });
            $('#myName .comp').off('click').on('click',function(){
                var mynameData=$('#myName input').val();
                var nameLength=_t.getByteLen(mynameData);
                if($.trim(mynameData)=="" ){
                    $.toast("姓名不能为空","forbidden");
                    return;
                }else if(nameLength>18){
                    $.toast("姓名超过最大字数","forbidden");
                    return;
                }
                $.toast("保存成功!",1000,function(){
                    $('#app-main').attr("data-name",mynameData);
                    _t.goBeforePage();
                });
            });
            /*滑动返回上一页*/
            $("#myName").swipe({
                swipeRight: function() {
                    _t.goBeforePage();
                },
            });
            this.hideAllNonBaseMenuItem();
        },
        getByteLen:function getByteLen(val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                var a = val.charAt(i);
                if (a.match(/[^\x00-\xff]/ig) != null) {
                    len += 2;
                }
                else {
                    len += 1;
                }
            }
            return len;
        },
        hideAllNonBaseMenuItem:function(){
                wx.ready(function() {
                    wx.hideAllNonBaseMenuItem();
                });
            },
            goBeforePage:function() {
                Common.router.trigger("myselfInfor", {
                    module: "myselfInfor",
                    method: "init",
                    params: ["index"]
                });
            }
        }
    return MyName;
});