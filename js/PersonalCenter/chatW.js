/**
 * Created by 卫宁宁 on 2017/1/17.
 */
var data = {};
var isLinkSuccess = false;
var nim = null;
var result = null;
var timer1 = null;
/*提交的状态*/
var submitFlag = true;
/*回复状态*/
var flag = true;
window.onfocus = function () {
    window.clearInterval(timer1);
    document.title = '健科互联网医疗服务平台';

};
/*标题滚动*/
function scroll() {
    var titleInfo = document.title;
    var firstInfo = titleInfo.charAt(0);
    var lastInfo = titleInfo.substring(1, titleInfo.length);
    document.title = lastInfo + firstInfo;
}

function GetQueryString(name) {
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*但会参数值*/
    if (r != null)return decodeURI(r[2]);
    return null;
}
var id = GetQueryString("id");
var userType = GetQueryString("type");
if (userType == 0) {
    var loginData = JSON.parse(localStorage.getItem("loginData"));
    var token = loginData.accessToken;
} else if (userType == 1) {
    var loginData = JSON.parse(localStorage.getItem("docLoginData"));
    var token = loginData.accessToken;
}


function formatTime(time) {
    var date = new Date(time);
    var txt = date.getFullYear() + '-' + (Number(date.getMonth()) + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return txt;
}


function getHistory() {
    nim.getHistoryMsgs({
        scene: 'p2p',
        to: result.data.imto,
        done: function (error, obj) {
            console.log('获取p2p历史消息' + (!error ? '成功' : '失败'));
            console.log(error);
            console.log(obj);
            if (!error) {
                console.log(obj.msgs);
            }
        }
    });
}
function sendText(content) {
    var msg = nim.sendText({
        scene: 'p2p',
        to: result.data.imto,
        text: content,
        done: sendMsgDone
    });
    console.log('正在发送p2p text消息, id=' + msg.idClient);
    function sendMsgDone(error, msg) {
        console.log(error);
        console.log(msg);
        console.log('发送' + msg.scene + ' ' + msg.type + '消息'
            + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
        if (!error) {
            $('#messageText').val('')
        }
    }
}
function sendImg(fileInput) {
    nim.previewFile({
        type: 'image',
        fileInput: fileInput,
        uploadprogress: function (obj) {
            console.log('文件总大小: ' + obj.total + 'bytes');
            console.log('已经上传的大小: ' + obj.loaded + 'bytes');
            console.log('上传进度: ' + obj.percentage);
            console.log('上传进度文本: ' + obj.percentageText);
            if (obj.percentage == 100) {
                window.setTimeout(function () {
                    $('#chatEditor h4').html('图片上传成功！').css('color', 'green');
                }, 1000)
                window.setTimeout(function () {
                    $('#chatEditor h4').animate({opacity: 0})
                }, 3000)

            }

        },
        done: function (error, file) {
            console.log(file);
            console.log('上传image' + (!error ? '成功' : '失败'));
            // show file to the user
            if (!error) {
                var msg = nim.sendFile({
                    scene: 'p2p',
                    to: result.data.imto,
                    file: file,
                    done: function () {
                    }
                });

                if (flag && submitFlag) {
                    $.ajax({
                        type: 'post',
                        url: '/my/counselingrecord/update',
                        data: {
                            id: id,
                            ApplyStatus: 1,
                            CallTime: formatTime(new Date().getTime())
                        },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('token', loginData.accessToken);
                        },
                        dataType: "json"
                    }).done(function (data) {
                        if (data.state == 0) {
                            submitFlag = false;
                        }
                    })
                }




                console.log('正在发送p2p image消息, id=' + msg.idClient);

            }
            if(error){
               window.location="https://nos.netease.com/nim";

            }
        }
    });
    /* nim.sendFile({
     scene: 'p2p',
     to: result.data.imto,
     type: 'image',
     fileInput: fileInput,
     beginupload: function(upload) {
     // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
     // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
     console.info(upload);
     },
     uploadprogress: function(obj) {
     console.log('文件总大小: ' + obj.total + 'bytes');
     console.log('已经上传的大小: ' + obj.loaded + 'bytes');
     console.log('上传进度: ' + obj.percentage);
     console.log('上传进度文本: ' + obj.percentageText);
     },
     uploaddone: function(error, file) {
     console.log(error);
     console.log(file);
     console.log('上传' + (!error?'成功':'失败'));
     },
     beforesend: function(msg) {
     console.log('正在发送p2p image消息, id=' + msg.idClient);
     },
     done: function(){

     }
     }); */
}

window.setTimeout(function () {
    $("#wrapChat").scrollTop($('#chatContent').outerHeight() - 300);
}, 1000);

function newChatCont(cont) {
    if ($(cont).html().indexOf('undefined') != -1) {
        var index = $(cont).html().indexOf('undefined');
        var q = $(cont).html().substr(index - 1, 11);
        $(cont).html($(cont).html().replace(q, ''))
    }
}

$(function () {

    /*会话结构*/
    function getHtml(msg,flow,time,txt,text) {
        if (msg.type == "text") {
            text += '<ul id="message" class=' + (flow == "out" ? "ulR" : "ulL") + '  style=' + (flow == "out" ? "float:right" : "float:left") + '>' +
                '<li id="time">' + time + '</li>' +
                '<li id="msg"><span>' + txt + '</span></li>' +
                '<img id="pic" src=' + (flow == "out" ? avatarMe : avatarYou) + '>' +
                '</ul>';
        } else if (msg.type == "file") {
            var file = msg.file;
            if (file.ext == "jpg" || 'png') {
                text += '<ul id="message" class=' + (flow == "out" ? "ulR" : "ulL") + '  style=' + (flow == "out" ? "float:right" : "float:left") + '>' +
                    '<li id="time">' + time + '</li>' +
                    '<li id="msg"><img src="' + file.url + '"></li>' +
                    '<img id="pic" src=' + (flow == "out" ? avatarMe : avatarYou) + '>' +
                    '</ul>';
            }
        }
        return text;
    }


    var avatarMe = '';
    var avatarYou = '';
    /*初始化flag状态*/
    $.post("/my/counselingrecord/queryCounseling?token=" + token, {
        id: id
    }, function (rs) {
        result = rs;
        console.log(rs);
        if (result.data.counselingRecord.applyStatus == 0) {
            flag = true;
        } else {
            flag = false;
        }
        if (userType == 0) {
            $('#chatTitle h3').html(result.data.counselingRecord.doctorName + ' 医生');
        } else {
            $('#chatTitle h3').html(result.data.counselingRecord.patientName);
        }
        nim = NIM.getInstance({
            db: NIM.support.db,
            appKey: '82a15b8b10402aa08f4aef95c817353c',
            account: rs.data.imaccid,
            token: rs.data.imtoken,
            syncSessionUnread: true,
            onconnect: function () {
                console.log('连接成功');
                isLinkSuccess = true;
            },
            onwillreconnect: function (obj) {
                // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
                console.log('即将重连');
                console.log(obj.retryCount);
                console.log(obj.duration);
                window.location="https://lbs.netease.im/lbs/webconf.jsp?k=82a15b8b10402aa08f4aef95c817353c&id=test_patient_56&sv=31&pv=1";
            },
            ondisconnect: function (error) {
                // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
                console.log('丢失连接');
                console.log(error);
                if (error) {
                    switch (error.code) {
                        // 账号或者密码错误, 请跳转到登录页面并提示错误
                        case 302:
                            break;
                        // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                        case 417:
                            break;
                        // 被踢, 请提示错误后跳转到登录页面
                        case 'kicked':
                            break;
                        default:
                            break;
                    }
                }
            },
            onerror: function (error) {
                console.log(error);
            },
            onsessions: function (sessions) {
                console.log('收到会话列表', sessions);
                data.sessions = nim.mergeSessions(data.sessions, sessions);

                /*获取头像*/
                nim.getUsers({
                    accounts: [rs.data.imaccid, rs.data.imto],
                    sync: true,
                    done: getUserDone
                });
                function getUserDone(error, users) {
                    console.log(error);
                    console.log(users);

                    if (users[0].account.indexOf('doc') != -1) {
                        if (users[0].avatar) {
                            avatarMe = users[0].avatar
                        } else {
                            avatarMe = '../../img/docImg.jpg';
                        }
                        avatarYou = '../../img/oneself.png'
                    } else {
                        avatarMe = '../../img/oneself.png';
                        avatarYou = users[1].avatar ? users[1].avatar : '../../img/docImg.jpg';
                    }
                    console.log('获取用户名片' + (!error ? '成功' : '失败'));

                    if (!error) {
                    }
                }

                nim.getHistoryMsgs({
                    scene: 'p2p',
                    to: rs.data.imto,
                    done: getHistoryMsgsDone
                });
                function getHistoryMsgsDone(error, obj) {
                    console.log(avatarMe, avatarYou)
                    console.log('获取p2p历史消息' + (!error ? '成功' : '失败'));
                    var text = '';
                    for (var index in obj.msgs.reverse()) {
                        var msg = obj.msgs[index];
                        var txt = msg.text;
                        var flow = msg.flow;
                        var time = msg.time;
                        time = formatTime(time);
                        text=getHtml(msg,flow,time,txt,text);
                    }
                    $("#chatContent").html(text);
                    window.setTimeout(function () {
                        $("#wrapChat").scrollTop($('#chatContent').outerHeight() - 300);
                    }, 1000)
                }
            },
            onupdatesession: function (session) {
                console.log('会话更新了', session);
                var msg = session.lastMsg;
                if (msg.status == "sending") {
                    console.log("消息正在发送>>>>>>>");
                    return;
                }
                var txt = msg.text;
                var flow = msg.flow;
                var time = msg.time;
                time = formatTime(time);

                if (msg.flow == "in") {
                    document.title = '有新消息……';
                    timer1=setInterval("scroll()", 500)
                }

                if (msg.flow == "in" && msg.from != rs.data.imto) {
                    return;
                }
                var text = '';
                text=getHtml(msg,flow,time,txt,text);
                $("#chatContent").append(text);
                window.setTimeout(function () {
                    $("#wrapChat").scrollTop($('#chatContent').height() + 300);
                }, 200)
                window.setTimeout(function () {
                    $("#wrapChat").scrollTop($('#chatContent').height() + 300);
                }, 200)
                data.sessions = nim.mergeSessions(data.sessions, session);

            }
        });
    });

    $("#sendBtn").click(function () {
        window.clearInterval(timer1);
        var content = $("#messageText").val();
        if (flag && submitFlag) {
            $.ajax({
                type: 'post',
                url: '/my/counselingrecord/update',
                data: {
                    id: id,
                    ApplyStatus: 1,
                    CallTime: formatTime(new Date().getTime())
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('token', loginData.accessToken);
                },
                dataType: "json"
            }).done(function (data) {
                if (data.state == 0) {
                    submitFlag = false;
                }
            })
        }
        if (content) {
            sendText(content);
        }
    });

    $("#uploadFile").change(function () {
        if ($('#uploadFile').val()) {
            $('#chatEditor h4').html('图片正在上传中……')
            $('#chatEditor h4').css({'display': 'block', 'opacity': '1', 'color': '#4277e1'});
            sendImg("uploadFile");
        }
    });

    $("#getHistoryBtn").click(function () {
        getHistory();
    });

});