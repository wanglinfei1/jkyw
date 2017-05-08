/**
 * Created by 卫宁宁 on 2017/2/9.
 */
/*wnn初始化日历*/
$(".acc").datepicker({
    changeMonth: true,
    maxDate: new Date(),
    changeYear: true
}).datepicker('widget').wrap('<div class="ll-skin-lugo"/>');
$('.acc').off('change').on('change', function () {
    var timerVal = $(this).val();

    /*var age=$('.ui-datepicker-year').val();
    var date=new Date;
    var year=date.getFullYear();
    age=year-age;*/
       if(timerVal==''){return};
     timerVal=timerVal.split('/');
     var timerStr = timerVal[2] + '-' + timerVal[0] + '-' + timerVal[1];
     $(this).attr('timerStr',timerStr);
     var age=timerVal[2];
     var date=new Date;
     var year=date.getFullYear();
     age=year-age;
    $(this).val(age);
});
