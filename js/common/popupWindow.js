/**
 * Created by wanglinfei on 2017/1/3.
 */
    //弹框
function popupShow(){
    $('.popup').css('display','block');
    var ocWidth=$(window).width()+'px';
    var ocHeight=$(window).height()+'px';
    var popupWidth=-$('.popup-in').outerWidth()/2+'px';
    var popupHeight=-$('.popup-in').outerHeight()/2+'px';
    $('.popup').css({width:ocWidth,height:ocHeight});
    $('.popup-in').css({'marginTop':popupHeight,'marginLeft':popupWidth});
}
$('.popup .close').on('click',function() {
    $('.popup').css('display', 'none');
});

