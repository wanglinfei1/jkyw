/**
 * Created by wanglinfei on 2017/4/6.
 */
$(".acc").datepicker({
    defaultDate: new Date(),
    changeMonth: true,
    maxDate: new Date(),
    changeYear: true
}).datepicker('widget').wrap('<div class="ll-skin-lugo"/>');
$('.acc').off('change').on('change', function () {
    var timerVal = $(this).val();
    if(timerVal==''){return};
    timerVal=timerVal.split('/');
    var timerStr = timerVal[2] + '-' + timerVal[0] + '-' + timerVal[1];
    $(this).val(timerStr);
});