/**
 * Created by jammy on 2017/4/21.
 */
$(function () {
    // debugger;
    /*  var iWidth=$('.jdrugList a').width()+80;
     $('.jdrugList,.jdrugList li,.jdrugList li a').css('width',iWidth);*/
    init();
    $('#jdrug li').hover(function () {
        $('#jdrug .jdrugList').css('display','none');
        $(this).find('.jdrugList').css('display','block');
    },function () {
        $('#jdrug .jdrugList').css('display','none');
    });
    $('#jdrug .jdrugList li').hover(function(){
        $(this).parent().css('display','block');
    },function(){
        $(this).parent().css('display','none');
    });
    /*获取热点文章*/
    function init() {
        var i=getRequestParam('index');
        highinitW(i)
        $.ajax({
            url: servUrl,
            data: {
                pathL: '/article/queryHotListByPage',
                pageNum: 1,
                pageSize: 4
            },
            dataType: 'json',
            type: 'get',
            success: function (data) {
                //    console.log(data.data);
                var hotA = new EJS({url: '../compileEjs/hot_Articles'}).render({data: data.data.result});
                $('.Y_slowDisRt .JTestTitle h2 span').html('热点文章')
                $('.JothersAir').html(hotA);
            },
            error: function (err) {
                //    console.log(err);
            }
        })
    }
})
/*点击nav跳转*/
function highW(e) {
    var index = $(e).index();
$('#module>div').css('display','none');
$('#module>div:eq('+index+')').css('display','block');
}
function highinitW(i) {
    if(i==undefined)i=0;
    $('#module>div').css('display','none');
    $('#module>div:eq('+i+')').css('display','block');
}