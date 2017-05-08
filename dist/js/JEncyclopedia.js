/**
 * Created by jammy on 2017/4/6.
 */
$(function(){
    /*获取百科栏目Nav*/
    $.ajax({
        url:servUrl,
        data:{
            'pathL':'/articleChannel/getArticleChannelsByPid',
            'pid':1
        },
        type : 'post',
        async: false,
        dataType : "json",
        success:function(res){
            if(res.state==0){
                var data=res.data;
            //    console.log(data);
                if (data.length > 0) {
                    var j = "";
                    for (var i = 0; i < data.length; i++) {
                        j += ' <li iTitle="Encyclopedia_'+data[i].cutName+'" isId="'+data[i].id+'"><a href="Encyclopedia_'+data[i].cutName+'.html">'+data[i].name+'<i></i></a> </li>';
                    }
                    $('.JinfoTab ul').html(j);
                }
            }
        },
        error:function(res){
        //    console.log(res)
        }
    });
    /*设置选中的Nav导航*/
    var iTitle=window.location.href.split('/')[window.location.href.split('/').length-1].split('.')[0];
    $('.JinfoTab li[iTitle="'+iTitle+'"]').addClass('active').siblings().removeClass('active');
    /*获取向前栏目下面的文章*/
    var popId=$('.JinfoTab li.active').attr('isid');
    var JAridata={
        'pathL':'/article/queryListByChannel',
        'pageNum':1,
        'pageSize':8,
        'channelId':popId
    }
    hotNews(JAridata,"../compileEjs/indexNews.ejs",'.JinfoContList');
    $('.JEncy .Jinfos:odd').addClass('JfloatR');
    var total=$('.JinfoContList').attr('total');
    $('.pagination').paging({
        pageNo: 1, //当前页
        totalPage:Math.ceil(total/8), //总共多少页
        callback: function () {
            var JAridata={
                'pathL':'/article/queryListByChannel',
                'pageNum':$(this)[0].pageNo,
                'pageSize':8,
                'channelId':popId
            }
            hotNews(JAridata,"../compileEjs/indexNews.ejs",'.JinfoContList');
            $('.JEncy .Jinfos:odd').addClass('JfloatR');
        }
    });

})