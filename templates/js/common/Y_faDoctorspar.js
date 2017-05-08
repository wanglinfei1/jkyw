$(function(){
   var iId=window.location.search.split('?')[1];
  // console.log(iId);
   var docData={
      'pathL':'/doctor/queryOne/'+iId+''
   };
   DoctorsDetail(docData,"../compileEjs/faDoctordetail.ejs",'.Y_faDoctorsparCon');
   function DoctorsDetail(data,url,box,index){
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
               var topHtml= new EJS({url:url}).render({data:res.data});
               $(box).html(topHtml);
               $('.JDocName').text(res.data.name);
               $('.Y_faDoctorsparBot:last').css('background','none');
            }
         },
         error:function(res){
        //    console.log(res)
         }
      });
   }
});
