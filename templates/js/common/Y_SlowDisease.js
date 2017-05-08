$(function(){
    init();
    $('.JinfoTab li').click(function(){
        $(this).addClass("active").siblings().removeClass();
        $(".Y_SlowDisLtC > div").hide().eq($('.JinfoTab li').index(this)).show();
    });
})
/*获取热点文章*/
function init() {
    $.ajax({
        url: servUrl,
        data: {
            pathL: '/article/queryHotListByPage',
            pageNum:1,
            pageSize:4
        },
        dataType:'json',
        type: 'get',
        success: function (data) {
        //    console.log(data.data);
            var hotA= new EJS({url:'../compileEjs/hot_Articles'}).render({data:data.data.result});
            $('.Y_slowDisRt .JTestTitle h2 span').html('热点文章')
            $('.JothersAir').html(hotA);

        },
        error: function (err) {
        //    console.log(err);
        }
    })
}