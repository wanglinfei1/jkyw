/**
 * Created by wanglinfei on 2017/3/15.
 */
define(["jquery","common","jweixin","weui"],function($,Common,wx,ui){
    function Jssdk(){
        this.ejs = "views/jssdk";
        this.cssPath = ["styles/main.css"];
    }

    Jssdk.prototype={
        init:function(){
            var _t = this;
            // alert(1);
            console.info("Jssdk test module");
            Common.panel.add(_t.ejs,null,"jssdk").open(true);

            this.bindingEvents();
        },
        bindingEvents:function(){
            $("#jssdk #alert").click(function () {
                ui.alert("weui alert");
            });

            $("#jssdk #alert-with-callback").click(function(){
                ui.alert('带回调的alert', function(){ console.log('callback info') });
            });

            $("#jssdk #alert-with-titleAndCallback").click(function(){
                ui.alert('自定义标题的alert', function(){ console.log('callback info') },{ title: '自定义标题' });
            });


            $("#jssdk #toast").click(function(){
                ui.toast('操作成功', 3000);
            });

        }
    }

    return Jssdk;
});