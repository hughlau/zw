$.publicMethod = {
    /*保留指定位数小数*/
    toFixed: function (value, length) {
        return Number(value).toFixed(length);
    },
    /*判断是否有值*/
    hasValue: function (value) {
        return fw.fwObject.FWObjectHelper.hasValue(value);
    },
    /*判断是否为null*/
    isNull: function (value, unit, marker) {
        if (!$.dynamicAccountsPage.hasValue(unit)) {
            unit = "";
        }
        var type = typeof (value); /*判断值类型*/
        switch (type) {
            case 'string':
                return value + unit;
            case 'number':
                return $.dynamicAccountsPage.toFixed(value) + unit;
            default:
                return (marker == null ? "" : marker);
        }
    },
    //增加参数 isEncrypt 报表的参数不需要加密 
    openPage: function (data, pageParam, callBack) {
        if (fw.fwObject.FWObjectHelper.hasValue(pageParam.url)) {
            if (fw.fwObject.FWObjectHelper.hasValue(data)) {
                pageParam.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParam.url, $.page.webSiteRootUrl), data);
            } else {
                pageParam.url = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParam.url, $.page.webSiteRootUrl);
            }
            //打开窗口
            mini.open({
                url: pageParam.url,
                title: pageParam.title, //标题
                showMaxButton: pageParam.showMaxButton, //最大化
                showMinButton: pageParam.showMinButton, //最小化
                allowResize: pageParam.allowResize, //是否允许调整尺寸
                width: pageParam.width, //宽度
                height: pageParam.height, //长度
                onload: function () {
                    //                 var iframe = this.getIFrameEl();
                    //                 iframe.contentWindow;
                    //                 if (fw.fwObject.FWObjectHelper.hasValue(pageParam.cantonCodeArray)) {
                    //                     
                    //                 }
                },
                ondestroy: function () {
                    if ($.isFunction(callBack)) {
                        var iframe = this.getIFrameEl();
                        callBack(iframe.contentWindow.callbackData);
                    }
                }
            });
        }

    },
    openMenuPage: function (node, isEncrypt) {
        var url = "";
        if (fw.fwObject.FWObjectHelper.hasValue(node.mUrl)) {
            //参数
            var data = {
                ticket: $.page.ticket
                , parentMenuCode: node.mMenuCode
            };
            if (fw.fwObject.FWObjectHelper.hasValue(isEncrypt) && isEncrypt == false) {
                url = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(node.mUrl, $.page.webSiteRootUrl);
            }
            else {
                url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(node.mUrl, $.page.webSiteRootUrl), data);
            }
            switch (node.mOpenTypeCode) {
                case fw.fwData.FWOpenType.Tab.toString():
                    //                    $.page.idM.mainTabs.addTab(tab);
                    break;
                case fw.fwData.FWOpenType.UIOpen.toString():
                    var width = 800;
                    var height = 500;

                    if (fw.fwObject.FWObjectHelper.hasValue(node.mLayoutWidth)) {

                        width = (node.mLayoutWidth >= 1020) ? 1020 : node.mLayoutWidth;
                    }

                    if (fw.fwObject.FWObjectHelper.hasValue(node.mLayoutHeight)) {

                        height = (node.mLayoutHeight >= 600) ? 600 : node.mLayoutHeight;
                    }
                    //打开窗口
                    mini.open({
                        url: url
                        , name: node.mTitle
                        , title: node.mTitle
                        , showMaxButton: true   //最大化
                        , showMinButton: true   //最小化
                       , width: width
                        , height: height
                        , onload: function () {
                            //var iframe = this.getIFrameEl();
                            //iframe.contentWindow;
                        }
                        , ondestroy: function (action) {
                            //判断非（关闭和取消）窗口
                            if (action != "close" && action != "cancel") {
                                //回调函数
                            };
                        }
                    });
                    break;
                case fw.fwData.FWOpenType.WindowOpen.toString():
                    window.open(url, fw.fwString.FWStringHelper.serializeWindowName(node.mMenuName));
                    break;
                default:
                    //固废--首页iframe 打开
                    $("#iframeMap").attr({ "src": url, "title": node.mTitle });
                    break;
            };
        };
        if (!fw.fwObject.FWObjectHelper.hasValue(node.mOnFocusInScriptCode)) {
            $("#iframeMap").attr({ "src": url, "title": node.mTitle });
        } else {

        };
    },
    /*时间 转换 指定格式*/
    toString: function (value, format) {
        return fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(value), format);
    },
    /*获取GUID*/
    guid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }); //by www.jbxue.com 
    },
    /*渲染miniui*/
    gridRenderer: function (value) {
        var type = typeof (value); /*判断值类型*/
        switch (type) {
            case 'string':
                return value;
            case 'number':
                return Number(value).toFixed(2);
            default:
                return "--";
        }
    },
    /*关闭页面方法*/
    onCancel: function (action) {
        if (window.CloseOwnerWindow) {
            return window.CloseOwnerWindow(action);
        } else {
            window.close();
        };
    },
    /*页面按钮统一事件*/
    btnClickEvent: function () {
        //空间介绍  
        $("#qZone").bind("click", function () {
            var data = { pageUrl: "web/html/qZone.htm", titleMsg: "空间介绍" };
            var urlLink = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/html/htmlMain.htm", $.page.webSiteRootUrl), data);
            window.open(urlLink);
        });
        //注册条款  
        $("#registerProvision").bind("click", function () {
            var data = { pageUrl: "web/html/registerProvision.htm", titleMsg: "注册条款" };
            var urlLink = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/html/htmlMain.htm", $.page.webSiteRootUrl), data);
            window.open(urlLink);
        });
        //帮助中心  
        $("#helpCenter").bind("click", function () {
            var data = { pageUrl: "web/html/helpCenter.htm", titleMsg: "帮助中心" };
            var urlLink = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/html/htmlMain.htm", $.page.webSiteRootUrl), data);
            window.open(urlLink);
        });
        //用户管理规范  
        $("#userArticle").bind("click", function () {
            var data = { pageUrl: "web/html/userArticle.htm", titleMsg: "用户管理规范" };
            var urlLink = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/html/htmlMain.htm", $.page.webSiteRootUrl), data);
            window.open(urlLink);
        });
        //企业管理员
        $("#btnAdminLogin").bind("click", function () {
            var data = { pageUrl: "web/logining.htm", titleMsg: "企业管理员" };
            var urlLink = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/logining.htm", $.page.webSiteRootUrl), data);
            window.open(urlLink);
        });
        //登录
        $("#enterpriseLogin").bind("click", function () {
            window.open("../login.htm");
        });
        //企业数字证书详情
        $("#credentials").bind("click", function () {
            var data = { pageUrl: "web/html/credentials.htm", titleMsg: "企业数字证书详情" };
            var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/html/htmlMain.htm", $.page.webSiteRootUrl), data);
            window.open(url);
        });

        //新用户注册 
        $("#register").bind("click", function () {
            var data = { titleMsg: "新用户注册" };
            var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/basicInfo/registerMain.htm", $.page.webSiteRootUrl), data);
            window.open(url);
        });
        //忘记密码 
        $("#findPassword").bind("click", function () {
            var data = { titleMsg: "忘记密码" };
            var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/register/initPassword.htm", $.page.webSiteRootUrl), data);
            window.open(url);
        });
    },
    /*打开许可证详情页面 纯展示页面*/
    licenseView: function (licenseCode) {
        var data = { ticket: $.page.ticket, licenceCode: licenseCode };
        var pageParam = { url: "web/licenseInfo/licenseView.htm", showMaxButton: true, showMinButton: true, width: "1000", height: "541", allowResize: false, title: "许可证查看" };
        $.publicMethod.openPage(data, pageParam);
    }
    , cantonJson: function () {
        return [{ "Code": "320100", "Name": "南京市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320200", "Name": "无锡市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320300", "Name": "徐州市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320400", "Name": "常州市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320500", "Name": "苏州市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320600", "Name": "南通市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320700", "Name": "连云港市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320800", "Name": "淮安市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320900", "Name": "盐城市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "321000", "Name": "扬州市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "321100", "Name": "镇江市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "321200", "Name": "泰州市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "321300", "Name": "宿迁市", "ParentCode": "320000", "CTlevel": "1" }, { "Code": "320101", "Name": "南京市本级", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320102", "Name": "玄武区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320103", "Name": "白下区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320104", "Name": "秦淮区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320105", "Name": "建邺区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320106", "Name": "鼓楼区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320107", "Name": "下关区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320108", "Name": "大厂区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320111", "Name": "浦口区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320113", "Name": "栖霞区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320114", "Name": "雨花台区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320115", "Name": "江宁区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320116", "Name": "六合区", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320124", "Name": "溧水县", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320125", "Name": "高淳县", "ParentCode": "320100", "CTlevel": "2" }, { "Code": "320201", "Name": "无锡市市本级", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320202", "Name": "崇安区", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320203", "Name": "南长区", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320204", "Name": "北塘区", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320205", "Name": "锡山区", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320206", "Name": "惠山区", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320208", "Name": "新区", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320211", "Name": "滨湖区", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320281", "Name": "江阴市", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320282", "Name": "宜兴市", "ParentCode": "320200", "CTlevel": "2" }, { "Code": "320301", "Name": "徐州市市本级", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320302", "Name": "鼓楼区", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320303", "Name": "云龙区", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320305", "Name": "贾汪区", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320306", "Name": "金山桥经济开发区", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320311", "Name": "泉山区", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320321", "Name": "丰　县", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320322", "Name": "沛　县", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320323", "Name": "铜山区", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320324", "Name": "睢宁县", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320381", "Name": "新沂市", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320382", "Name": "邳州市", "ParentCode": "320300", "CTlevel": "2" }, { "Code": "320401", "Name": "常州市市本级", "ParentCode": "320400", "CTlevel": "2" }, { "Code": "320402", "Name": "天宁区", "ParentCode": "320400", "CTlevel": "2" }, { "Code": "320404", "Name": "钟楼区", "ParentCode": "320400", "CTlevel": "2" }, { "Code": "320405", "Name": "戚墅堰区", "ParentCode": "320400", "CTlevel": "2" }, { "Code": "320411", "Name": "新北区", "ParentCode": "320400", "CTlevel": "2" }, { "Code": "320412", "Name": "武进区", "ParentCode": "320400", "CTlevel": "2" }, { "Code": "320481", "Name": "溧阳市", "ParentCode": "320400", "CTlevel": "2" }, { "Code": "320482", "Name": "金坛市", "ParentCode": "320400", "CTlevel": "2" }, { "Code": "320501", "Name": "苏州市市本级", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320502", "Name": "沧浪区", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320503", "Name": "平江区", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320504", "Name": "金阊区", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320505", "Name": "虎丘区", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320506", "Name": "吴中区", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320507", "Name": "相城区", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320508", "Name": "高新区", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320509", "Name": "工业园区", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "321282", "Name": "靖江市", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320582", "Name": "张家港市", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320583", "Name": "昆山市", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320584", "Name": "吴江市", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320585", "Name": "太仓市", "ParentCode": "320500", "CTlevel": "2" }, { "Code": "320601", "Name": "南通市市本级", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320602", "Name": "崇川区", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320605", "Name": "南通市开发区", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320611", "Name": "港闸区", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320621", "Name": "海安县", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320623", "Name": "如东县", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320681", "Name": "启东市", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320682", "Name": "如皋市", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320683", "Name": "通州市", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320684", "Name": "海门市", "ParentCode": "320600", "CTlevel": "2" }, { "Code": "320701", "Name": "连云港市市本级", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320703", "Name": "连云区", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320705", "Name": "新浦区", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320706", "Name": "海州区", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320717", "Name": "连云港市开发区", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320721", "Name": "赣榆县", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320722", "Name": "东海县", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320723", "Name": "灌云县", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320724", "Name": "灌南县", "ParentCode": "320700", "CTlevel": "2" }, { "Code": "320801", "Name": "淮安市市本级", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320802", "Name": "清河区", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320803", "Name": "楚州区", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320804", "Name": "淮阴区", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320811", "Name": "清浦区", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320826", "Name": "涟水县", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320829", "Name": "洪泽县", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320830", "Name": "盱眙县", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320831", "Name": "金湖县", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320861", "Name": "经济技术开发区", "ParentCode": "320800", "CTlevel": "2" }, { "Code": "320901", "Name": "盐城市市本级", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320902", "Name": "亭湖区", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320903", "Name": "盐都区", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320905", "Name": "盐城市开发区", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320921", "Name": "响水县", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320922", "Name": "滨海县", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320923", "Name": "阜宁县", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320924", "Name": "射阳县", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320925", "Name": "建湖县", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320981", "Name": "东台市", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "320982", "Name": "大丰市", "ParentCode": "320900", "CTlevel": "2" }, { "Code": "321001", "Name": "扬州市市本级", "ParentCode": "321000", "CTlevel": "2" }, { "Code": "321002", "Name": "广陵区", "ParentCode": "321000", "CTlevel": "2" }, { "Code": "321003", "Name": "邗江区", "ParentCode": "321000", "CTlevel": "2" }, { "Code": "321011", "Name": "郊(维扬)区", "ParentCode": "321000", "CTlevel": "2" }, { "Code": "321023", "Name": "宝应县", "ParentCode": "321000", "CTlevel": "2" }, { "Code": "321081", "Name": "仪征市", "ParentCode": "321000", "CTlevel": "2" }, { "Code": "321084", "Name": "高邮市", "ParentCode": "321000", "CTlevel": "2" }, { "Code": "321088", "Name": "江都市", "ParentCode": "321000", "CTlevel": "2" }, { "Code": "321101", "Name": "镇江市市本级", "ParentCode": "321100", "CTlevel": "2" }, { "Code": "321102", "Name": "京口区", "ParentCode": "321100", "CTlevel": "2" }, { "Code": "321109", "Name": "镇江新区", "ParentCode": "321100", "CTlevel": "2" }, { "Code": "321111", "Name": "润州区", "ParentCode": "321100", "CTlevel": "2" }, { "Code": "321112", "Name": "丹徒区", "ParentCode": "321100", "CTlevel": "2" }, { "Code": "321181", "Name": "丹阳市", "ParentCode": "321100", "CTlevel": "2" }, { "Code": "321182", "Name": "扬中市", "ParentCode": "321100", "CTlevel": "2" }, { "Code": "321183", "Name": "句容市", "ParentCode": "321100", "CTlevel": "2" }, { "Code": "321201", "Name": "泰州市市本级", "ParentCode": "321200", "CTlevel": "2" }, { "Code": "321202", "Name": "海陵区", "ParentCode": "321200", "CTlevel": "2" }, { "Code": "321203", "Name": "高港区", "ParentCode": "321200", "CTlevel": "2" }, { "Code": "321281", "Name": "兴化市", "ParentCode": "321200", "CTlevel": "2" }, { "Code": "321282", "Name": "靖江市", "ParentCode": "321200", "CTlevel": "2" }, { "Code": "321283", "Name": "泰兴市", "ParentCode": "321200", "CTlevel": "2" }, { "Code": "321284", "Name": "姜堰市", "ParentCode": "321200", "CTlevel": "2" }, { "Code": "321301", "Name": "宿迁市市本级", "ParentCode": "321300", "CTlevel": "2" }, { "Code": "321302", "Name": "宿城区", "ParentCode": "321300", "CTlevel": "2" }, { "Code": "321311", "Name": "宿豫区", "ParentCode": "321300", "CTlevel": "2" }, { "Code": "321322", "Name": "沭阳县", "ParentCode": "321300", "CTlevel": "2" }, { "Code": "321323", "Name": "泗阳县", "ParentCode": "321300", "CTlevel": "2" }, { "Code": "321324", "Name": "泗洪县", "ParentCode": "321300", "CTlevel": "2" }, { "Code": "3202017", "Name": "无锡开发区", "ParentCode": "320208", "CTlevel": "3" }, { "Code": "32058406", "Name": "盛泽镇", "ParentCode": "320584", "CTlevel": "3"}];
    }
};

$.jsHelper = {
    objectHelper: fw.fwObject.FWObjectHelper
    , dateTimeHelper: fw.fwDateTime.FWDateTimeHelper
    , stringHelper: fw.fwString.FWStringHelper
};