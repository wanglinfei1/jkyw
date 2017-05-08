$(function(){
    var docData={
        'pathL':'/doctor/queryAll',
        'pageNum':1,
        'pageSize':12
    }
    Doctors(docData,"../compileEjs/faDoctors.ejs",'.Y_docList');
    var total=$('.Y_docList').attr('total');
    function Doctors(data,url,box,index){
        $.ajax({
            url:servUrl,
            data:data,
            async: false,
            beforeSend: function(){
                $(box).html('<img class="loading" src="../images/loading.gif" />')
            },
            type : 'get',
            dataType : "json",
            success:function(res){
                if(res.state==0){
                    var data=res.data.result;
                //    console.log(res);
                    var topHtml= new EJS({url:url}).render({data:res.data.result});
                    $(box).html(topHtml);
                    $(box).attr('total',res.data.total)
                    $('.Y_docList li').each(function(i){
                        if(i>=1){
                            $('.Y_docList li').eq((i*4)-1).css('marginRight','0');
                        }
                    })
                }
            },
            error:function(res){
            //    console.log(res)
            }
        });
    }
    $('.pagination').paging({
        pageNo: 1, //当前页
        totalPage:Math.ceil(total/12), //总共多少页  90/8
        callback: function () {
            var docData={
                'pathL':'/doctor/queryAll',
                'pageNum':$(this)[0].pageNo,
                'pageSize':12
            }
            Doctors(docData,"../compileEjs/faDoctors.ejs",'.Y_docList');
        }
    });
})