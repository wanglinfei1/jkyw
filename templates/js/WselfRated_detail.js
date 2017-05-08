/**
 * Created by 卫宁宁 on 2017/4/7.
 */
var Wtotal = {};
var Score = 0;
var dataSet = {};
init();
event();
statistic();
getPeopleCount();
function event() {
    /*请求多少人答题*/
    /*上一题*/
    $('.WrateDtail_wrap button').off('click').on('click', function () {
        nextQ(this, 'prev')
    });
    /*提交*/
    $('#submit').off('click').on('click', function () {
        getScore();

        postData();
    //    console.log(Score);
    });
    /*再测*/
    $('#retest').off('click').on('click', retest);
}
/*答题*/
function changeNum(quest, sum, ev) {
    var option_index = $(ev).parent().index() + 1;
    $(ev).parent().parent('ul').find('span').removeClass('on');
    $(ev).find('span').addClass('on');
    Wtotal[quest] = sum;
    dataSet[quest] = option_index;
    statistic(ev);
//    console.log(Wtotal, dataSet);
    setTimeout(function () {
        nextQ(ev)
    }, 300);
};
/*下一题*/
function nextQ(ev, flag) {
    var totalQ = $('.section').length;
    var i = Number($(ev).parents('.section').attr('data-quest'));
    if (flag != undefined) {
        i--;
    } else {
        if ($('.section').eq(i - 1).attr('data-quest') == totalQ) {
            $('#last').addClass('last_button');
            $('#submit').css('display', 'block');
            return
        }
        i++;
    }
    $(ev).parents('.section').css('display', 'none');
    for (var j = 0; j < totalQ; j++) {
        if ($('.section').eq(j).attr('data-quest') == String(i)) {
            $('.section').eq(j).css('display', 'block');
        }
    }
}
/*总得分*/
function getScore() {
    for (var key in Wtotal) {
        Score += Wtotal[key]
    }
    $('.section').css('display', 'none');
    $('#score').html(Score);
    $('#statistic').css('display', 'none');
    $('#result').css('display', 'block');
}
/*再测，清零*/
function retest() {
    Score = 0;
    $('#doneNum').html(0);
    $('#leftNum').html($('#totalNum').attr('data-total'));
    $('.section').find('span').removeClass('on');
    $('#statistic').css('display', 'block');
    $('#result').css('display', 'none');
    $('.sec1').css('display', 'block');
    $('#submit').css('display', 'none');
    $('#last').removeClass('last_button');
}
/*统计*/
function statistic(ev) {
    var TOTAL = $('#totalNum').attr('data-total');
    var doneNum = 0;
    $('.section').each(function () {
        var a = $(this).find('span').hasClass('on');
        if (a) {
            doneNum++;
        }
    });
    var leftNum = Number(TOTAL) - doneNum;
    $('#doneNum').html(doneNum);
    $('#leftNum').html(leftNum);

}
/*发送数据*/
function postData() {
    var tokenW=iToken?'':iToken;
    $.ajax({
        url: servUrl,
        data: {
            pathL: '/selfTesting/add',
            score: Score,
            memberId: 0,
            answerJson: JSON.stringify(dataSet),
            type: $('#cardiac_func').html(),
            token:tokenW
        },
        type: 'post',
        success: function (data) {
        //    console.log(data);
        },
        error: function (err) {
        //    console.log(err);
        }
    })
}
/*请求数据*/
function getPeopleCount() {
    $.ajax({
        url: servUrl,
        data: {
            pathL: '/selfTesting/getPeopleCount',
            type: $('#cardiac_func').html()
        },
        type: 'post',
        dataType:'json',
        success: function (data) {
        //    console.log(data.data);
            $('#peopleCount').html(data.data);
        },
        error: function (err) {
        //    console.log(err);
        }
    })
}
/*获取热点文章*/
function init() {
    $.ajax({
        url: servUrl,
        data: {
            pathL: '/article/queryHotListByPage',
            pageNum:1,
            pageSize:4
        },
        dataType:'json',
        type: 'get',
        success: function (data) {
        //    console.log(data.data);
            var hotA= new EJS({url:'../compileEjs/hot_Articles'}).render({data:data.data.result});
            $('.JTestTitle span').html('热点文章');
            $('.JothersAir').html(hotA);

        },
        error: function (err) {
        //    console.log(err);
        }
    })
}



