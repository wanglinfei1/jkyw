/*
 var center = {
 init: function () {
 this.encrypted("#phoneNum", [3, 7]), this.encrypted("#idNum", [4, 14])
 }, encrypted: function (t, i) {
 var n = $(t).text().trim(), e = [];
 e = n.split("");
 for (var r = i[0], c = i[1]; r < c; r++)e[r] = "*";
 $(t).text(e.join(""))
 }
 }.init();*/
/*患者端判断未登录返回首页*/
isLoginGoIndex(iToken);
var center = {
    init: function () {
        this.encrypted("#phoneNum", [3, 7]), this.encrypted("#idNum", [4, 14])
    }, encrypted: function (el, index) {
        var text = $.trim( $(el).text()),
            arr =[];
        arr =text.split('');
        for (var i =index[0], l=index[1]; i <l; i++){
                  arr[i]='*';
        }
        $(el).text(arr.join(''));
    }
}.init();
$(function(){
    $.ajax({
        url : servUrl,
        data:{
            'pathL':'/member/getUserInfo',
            'token':iToken
        },
        type : 'post',
        cache: false,
        dataType : "json",
        success : function (res) {
        //    console.log(res)
            var data = res.data;
            if(!data.headimg){
                $('.img').prop("src","../images/head-photo.png");

            }else{
                $('.img').prop("src",data.headimg);
            }
            $('#xingming').html(data.name);
            $('.xingming').html(data.name);
            $('.phone').html(data.mobile);
            $('#phoneNum').html(data.mobile);
            if(data.sex == 1){
                $('.sex').html("男");
            }else if(data.sex == 2){
                $('.sex').html("女");
            }
            data.idCard==null || data.idCard==''?data.idCard='':data.idCard=IdCardFormat(data.idCard);
            $('#idNum').html(data.idCard);
            if(data.birthday!=null && data.birthday!=''){
                var days=new Date(data.birthday).format("yyyy-MM-dd");
                $('.bor').html(days);
            }else{
                $('.bor').html('');
            }
            $('.add').html(data.address);
        }
    })
})






