/**
 * Created by jammy on 2017/4/10.
 */
$(function(){
    /*获取详情*/
    var iLeng=window.location.search.split('?')[1];
//    console.log(iLeng);
    var JAridata={
        'pathL':'/article/getArticleDetail',
        'articleId':iLeng,
        'relatedCount':5
    }
    var Infodata;
    $.ajax({
        url:servUrl,
        data:JAridata,
        async: false,
        beforeSend: function(){
            $('.Jnews').html('<img class="loading" src="../images/loading.gif" />')
        },
        type : 'get',
        dataType : "json",
        success:function(res){
            if(res.state==0){
                Infodata=res;
                var data=res.data.article;
                if(data.addTime){
                    data.addTime=new Date(data.addTime).format('yyyy.MM.dd');
                }
            //    console.log(res);
                var topHtml= new EJS({url:"../compileEjs/BKdetail.ejs"}).render({data:data});
                $('.Jnews').html(topHtml);

                /*获取面包屑*/
                var breadData=Infodata.data.channels;
                if (breadData.length > 0) {
                    $('.JpositionNav').html(breadData[0].namePath+'>'+Infodata.data.article.title);
                }
                /*获取相关文章*/
                var related=Infodata.data.related;
                if (related&&related.length > 0) {
                    if(related.length<5){
                        $('.JTestTitle h2 a').css('display','none')
                    }else{
                        related.length=4;
                    }
                    var j = "";
                    for (var i = 0; i < related.length; i++) {
                        j += '<li><a id="'+related[i].id+'" href="NewsInfo.html?'+related[i].id+'">'+related[i].title+'</a></li>';
                    }
                    $('.JothersAir').html(j);
                }else{
                    $('.JothersList').css('display','none')
                }
            }
        },
        error:function(res){
        //    console.log(res)
        }
    });
});

