/**
 * Created by wanglinfei on 2017/3/16.
 */
define(["jquery","common","fastclick","jweixin","extend","weui","jqWeui","touchSwiper"],function($,Common,FastClick,wx){
    function MoreRecords(){
        this.ejs = "views/BP_record";
        this.cssPath = ["styles/reset.css","styles/BP_record.css","styles/weui.min.css","styles/jquery-weui.css","styles/style.css"];
        this.pageNum=1;
        this.pageSize=20;
        this.lastYear=[];
        this.tab=false;
        this.loading = false;
    }

    MoreRecords.prototype={
        init:function(business){
            var _t = this;
            $(function() {
                FastClick.attach(document.body);
            });
            var isPerfectInfor= $('#app-main').attr('data_isPerfectInfor');
            if(isPerfectInfor!='isTrue'){
                _t.isPerfectInfor(business);
            }
            Common.panel.add(_t.ejs,{},"moreRecords").open(true);
            $("#moreRecords").swipe({
                swipeRight: function() {
                    console.log('prev');
                    _t.goBeforPage(business);
                },
                preventDefaultEvents:true
            });
            this.queryBloodPressureList(business,_t.pageNum);
            this.share();
        },
        /*微信分享SDK*/
        share:function(){
            /*分享到朋友圈*/
            wx.ready(function() {
                wx.hideAllNonBaseMenuItem();
                wx.showMenuItems({
                    menuList: [
                        "menuItem:addContact",//查看公众号（未添加）:
                        "menuItem:profile",//查看公众号（已添加）
                        "menuItem:share:appMessage",//发送给朋友:
                        "menuItem:share:timeline" //分享到朋友圈
                    ] // 要显示的菜单项，所有menu项见附录3
                });
                wx.onMenuShareTimeline({
                    title: '血压记录，方便您的血压管理！智医为您倾情奉献我们的服务！', // 分享标题
                    link: Common.param.domainName+'app_1_record.html', // 分享链接
                    imgUrl: Common.param.domainName+'img/share.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        $.toast("分享成功",1000);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        $.toast("取消分享",1000);
                    }
                });
                /*分享给朋友*/
                wx.onMenuShareAppMessage({
                    title: '血压记录，方便您的血压管理！智医为您倾情奉献我们的服务！', // 分享标题
                    desc: '关注智医，健康管理有惊喜！', // 分享描述
                    link: Common.param.domainName+'app_1_record.html', // 分享链接
                    imgUrl: Common.param.domainName+'img/share.png', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        $.toast("分享成功",1000);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        $.toast("取消分享",1000);
                    }
                });
            });
        },
        /*是否完善信息*/
        isPerfectInfor : function(business) {
            var _t=this;
            Common.req("wxportal.isCompleteInfo","get", {
                openid : Common.param.openid
               /* openid : 'ocPs50jpuKP63eFx1GFl7pjB8dlo'*/
            }, function(data) {
                /*console.log(data)*/
                if(data.state==0){

                }
            },function(data){
                /*console.log(data)*/
                _t.goBeforPage(business);
            });
        },
        queryBloodPressureList:function (business,pageNum) {
            var _t=this;
            Common.req("wxportal.queryBloodPressureList","get", {
                openid : Common.param.openid,
                /*openid : 'ocPs50jpuKP63eFx1GFl7pjB8dlo',*/
                pageNum: pageNum,
                pageSize:_t.pageSize
            }, function(data) {
                /*console.log(data);*/
                if(data.data.result.length>0){
                    _t.ProcessDate(data.data,business,pageNum);
                    $('.weui-loadmore1').css('display','none');

                }else{
                    $('.weui-loadmore1').css('display','block');
                    $('.weui-loadmore1 .weui-loadmore__tips').html('暂无数据');
                }

            },function(data){
                /*console.log(data)*/
                $('.weui-loadmore1').css('display','block');
                $('.weui-loadmore1 .weui-loadmore__tips').html('加载异常');
            });
        },
        ProcessDate:function(resData1,business,pageNum){
            var pages=resData1.pages;
            var resData=resData1.result;
            var total=resData1.total;
            /*console.log(resData1);*/
            var _t=this;
            var year=new Date().getFullYear();
            var dataJson={};
            var dataArr=[];
            var j=0;
            var dataLength=resData.length;
            if(dataLength<_t.pageSize){
                $('.weui-loadmore3').css('display','block');
            }else{
                $('.weui-loadmore3').css('display','none');
            }
            for(var i=0; i<dataLength;i++){
                var resDate=new Date(resData[i].measureTime);
                /*console.log(resDate);*/
                if(resDate.getFullYear()==year-j){
                    if(!dataJson[year-j]){
                        dataJson[year-j]=[];
                    }
                    var resDateM=resDate.getMonth()+1;
                    var oDate=resDate.getDate();
                    var oHou=resDate.getHours();
                    var oMin=resDate.getMinutes();
                    var oM=resDateM<10?'0'+resDateM:resDateM;
                    var oD=oDate<10?'0'+oDate:oDate;
                    var oH=oHou<10?'0'+oHou:oHou;
                    var oMi=oMin<10?'0'+oMin:oMin;
                    resData[i].measureTime=oM+'-'+oD+' '+oH+':'+oMi;
                    dataJson[year-j].push(resData[i]);
                    if(i==(dataLength-1)){
                        /*localStorage.setItem("lastDate",(year-j));*/
                        _t.lastYear.push(year-j);
                        /*console.log(_t.lastYear)*/
                    }

                }else{
                    j++;
                    i--;
                }
            }
            for(var key in dataJson){
                dataArr.push(key);
            }
            dataArr.sort(function(n,m){
                return m-n;
            })
            /*console.log(dataArr);
            console.log(dataJson);*/
            if(pageNum==1){
                var html = new EJS({url:"views/page_record"}).render({dataArr:dataArr,dataJson:JSON.stringify(dataJson),nowYear:year,lastYear:''});
                $("#moreRecords .data_record").html(html);
            }else{
                var html='';
                html = new EJS({url:"views/page_record"}).render({dataArr:dataArr,dataJson:JSON.stringify(dataJson),lastYear:_t.lastYear[pageNum-2],nowYear:year});
                $(html).appendTo('#moreRecords .data_record');
                _t.loading=false;
            }

            $('.weui-loadmore2').css('display','none');

            /*console.log(pages);
            console.log(pageNum);*/
            $(document.body).off('infinite').infinite(10).on("infinite", function() {
                var listLength=$('#moreRecords .recordData').length;
                pageNum++;
                if(pageNum>pages){
                    $('.weui-loadmore3').css('display','block');
                    return;
                }
                if(listLength>=total){
                    return;
                }
                if(_t.loading) return;
                _t.loading = true;
                $('.weui-loadmore2').css('display','block');
                _t.queryBloodPressureList(business,pageNum);
            });
        },
        goBeforPage:function(business){
           /* history.pushState({},"",'app_1_record.html');
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

    return MoreRecords;
});