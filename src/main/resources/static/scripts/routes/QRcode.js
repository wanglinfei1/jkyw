/**
 * Created by wanglinfei on 2017/3/20.
 */
define(["jquery","common","errorConfig","fastclick","jweixin","weui","jqWeui"],function($,Common,Error,FastClick,wx){
    function QRcode(){
        this.ejs = "views/QRcode";
        this.cssPath = ["styles/reset.css","styles/style.css","styles/articleDetails.css","styles/weui.min.css","styles/jquery-weui.css"];
    }

    QRcode.prototype= {
        init: function (business) {
            var _t = this;
            Common.panel.add(_t.ejs, {}, "QRcode").open(true);
            $(function() {
                FastClick.attach(document.body);
            });
            this.scanQRCode();
            $('#QRcode .cont .close-wrapper').off('click').on('click',function(){
                _t.goBeforPage(business);
            });
        },
        scanQRCode:function(){
            wx.ready(function() {
                wx.hideAllNonBaseMenuItem();
            });
        },
        goBeforPage:function(business){
            /*history.pushState({},"",'app_1_record.html');
             history.replaceState({},"",'app_1_record.html');*/
            if(business=="record"){
                Common.router.go(business);
            }else{
                Common.router.trigger("record", {
                    module : "record",
                    method : "init",
                    params : [ "index" ]
                });
            }
        }
    }
    return QRcode;
});
