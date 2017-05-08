/**
 * Created by 卫宁宁 on 2017/1/13.
 */
//日历控件
$("#calendar input").datepicker({
    inline: true,
    minDate: new Date(),
    showOtherMonths: true
})
    .datepicker('widget').wrap('<div class="ll-skin-lugo"/>');
$('.acc').on('change', function () {
    var timerVal = $(this).val();
    var timerArr = $(this).val().split('/');
    var timerStr = timerArr[2] + '-' + timerArr[0] + '-' + timerArr[1];
    $(this).val(timerStr);
});

    var time1;
    var time2;
    function validityTime() {
        $('#time1').removeClass('redBox');
        $('#time2').removeClass('redBox');
        time1 = $('#time1').val();
        time2 = $('#time2').val();
        if ($('#time1').val() == '' || $('#time2').val() == '') {
            if (time1 == '') {
                $('#time1').addClass('redBox');
            }
            if (time2 == '') {
                $('#time2').addClass('redBox');
            }
            return false
        };
        var time11 = time1;
        time11.replace(/-/g, '');
        var time22 = time2;
        time22.replace(/-/g, '');
        $('#red').css('display', 'none');
        if (time22 < time11) {
            $('#red').css('display', 'block');
            return false
        }

return true
    }