function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var oLiveView = {
    iProtocol: 1,			// protocol 1：http, 2:https
    szIP: GetRequest()["IPAddress"],	// protocol ip
    szPort: "80",			// protocol port
    szUsername: "admin",	// device username
    szPassword: "crrc1234",	// device password
    iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
    iChannelID: 1,			// channel no
    bZeroChannel: false		// zero channel
};

$(function () {
    // 检查插件是否已经安装过
    var iRet = WebVideoCtrl.I_CheckPluginInstall();
    if (-2 == iRet) {
        alert("您的Chrome浏览器版本过高，不支持NPAPI插件！");
        return;
    } else if (-1 == iRet) {
        alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        return;
    }

    var oPlugin = {
        iWidth: 1000,			// plugin width
        iHeight:666		// plugin height
    };

    // 初始化插件参数及插入插件
    WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
        bWndFull: true,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        iWndowType: 1,
        cbSelWnd: function (xmlDoc) {

        }
    });
    WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

    // 检查插件是否最新
    if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
        alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
        return;
    }

    // 登录设备
    WebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
        success: function (xmlDoc) {
            // 开始预览
            WebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                iStreamType: oLiveView.iStreamType,
                iChannelID: oLiveView.iChannelID,
                bZeroChannel: oLiveView.bZeroChannel
            });
        }
    });

    // 关闭浏览器
    $(window).unload(function () {
        WebVideoCtrl.I_Stop();
    });
});

