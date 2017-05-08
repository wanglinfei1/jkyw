/**
 * Created by wanglinfei on 2017/4/6.
 */

function queryList(){
    Ajax({
        'pathL':'/doctor/allDoctor',
        'pageNum':"1",
        'pageSize':"4",
        "typeL":'post',
        "serverName":'http://59.110.40.99:8280'
    },function(res){
    //    console.log(res);
    },function(res){
    //    console.log(res);
    });
}
/*;
queryList();*/
$('.pagination').paging({
    pageNo: 10,
    totalPage: 100,
    callback: function (data) {
    //    console.log($(this)[0].pageNo)
    }
});
function submitW() {
    var aFile=$('#uploadForm input').get(0).files[0];
//    console.log(aFile)
    var data = new FormData();
    data.append("file", aFile);
    var xhr = getXMLHttpRequest();
    xhr.open("post", servpath+'/uploadImg?small=true');
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = eval('(' + xhr.responseText + ')');
            console.log(data);
        }
    };
}
function getXMLHttpRequest() {
    var xmlHttpRequest;
    if (window.XMLHttpRequest) {
        xmlHttpRequest = new XMLHttpRequest();
        if (xmlHttpRequest.overrideMimeType) {
            xmlHttpRequest.overrideMimeType("text/xml");
        }
    } else if (window.ActiveXObject) {
        var activexName = [ "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
        for ( var i = 0; i < activexName.length; i++) {
            try {
                xmlHttpRequest = new ActiveXObject(activexName[i]);
                if(xmlHttpRequest){
                    break;
                }
            } catch (e) {
            }
        }
    }
    return xmlHttpRequest;
}
$('img').attr('src',servpath+'/imgVerifyCode/'+new Date());
