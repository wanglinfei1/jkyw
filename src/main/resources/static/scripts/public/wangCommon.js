/**
 * Created by wanglinfei on 2017/3/31.
 */
define(["common"], function(Common) {
    window.addEventListener("popstate", function (e) {
        var url = window.location.href;
        var iNum=url.indexOf('app_');
        var moduleNmae=url.substr(iNum+6).replace(new RegExp(/\?.+/g),"").replace(new RegExp(/\.html+/g),"");
        console.log(moduleNmae);
        Common.router.trigger(moduleNmae, {
            module : moduleNmae,
            method : "init",
            params : [ "index" ]
        });
    })
});
