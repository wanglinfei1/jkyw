/**
 * Created by wanglinfei on 2017/4/11.
 */
$(function(){
    /*获取向前栏目下面的文章*/
    var searchval=decodeURI(getRequestParam('searchval'));
    $('.Jsearch .seaechVal').val(searchval);
    var searchPageSize=8;
    var JAridata={
        'pathL':'/article/seachAll',
        'pageNum':1,
        'pageSize':searchPageSize,
        'searchText':searchval
    };
    /*搜索*/
    function search(data,url,box){
        $.ajax({
            url:servUrl,
            data:data,
            async: false,
            beforeSend: function(){
                $(box).html('<img src="../images/loading.gif" />')
            },
            type : 'get',
            dataType : "json",
            success:function(res){
                if(res.state==0){
                //    console.log(res);
                    var data=res.data.result;
                    $('.Lsearch p b').html(res.data.total);
                    if(data.length>0){
                        for(i in data){
                            if(data[i].updateTime){
                                data[i].updateTime=new Date(data[i].updateTime).format('yyyy.MM.dd');
                            }
                        }
                        var topHtml= new EJS({url:url}).render({data:res.data.result});
                        $(box).html(topHtml);
                        $('.JEncy .Jinfos:odd').addClass('JfloatR');
                        $(box).attr('total',res.data.total)
                    }else{
                        $(box).html('<p>暂无数据</p>');
                        $('.pagination').css('display','none');
                    }
                }
            },
            error:function(res){
            //    console.log(res)
            }
        });
    }
    search(JAridata,"../compileEjs/indexNews.ejs",'.LsearchList');
    var total=$('.JinfoContList').attr('total');
    $('.pagination').paging({
        pageNo: 1, //当前页
        totalPage:Math.ceil(total/searchPageSize), //总共多少页
        callback: function () {
            var JAridata={
                'pathL':'/article/seachAll',
                'pageNum':$(this)[0].pageNo,
                'pageSize':searchPageSize,
                'searchText':searchval
            };
            search(JAridata,"../compileEjs/indexNews.ejs",'.LsearchList');
        }
    });
});
