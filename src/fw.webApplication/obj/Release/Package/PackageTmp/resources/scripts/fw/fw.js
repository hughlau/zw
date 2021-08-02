(function (window, undefined) {
    var _fw = window.fw;
    fw = {
        m: {
            sysManage: {
                data: {
                    FWDictionaryTypeCode: {
                        FWHorizontalAlignment: "FWHorizontalAlignment",
                        FWIs: "FWIs",
                        FWMenuType: "FWMenuType",
                        FWObjType: "FWObjType",
                        FWOpenType: "FWOpenType",
                        FWResultStatus: "FWResultStatus",
                        FWTaskType: "FWTaskType",
                        FWTimingType: "FWTimingType",
                        FWVerticalAlignment: "FWVerticalAlignment",
                        FWResultAppInstallInfoLogCallStatus: "FWResultAppInstallInfoLogCallStatus",
                        FWResultAppInstallInfoLogStatus: "FWResultAppInstallInfoLogStatus",
                        FWResultAppLoginLogStatus: "FWResultAppLoginLogStatus"
                    }
                    , FWHorizontalAlignmentCode: {
                        Left: "0",
                        Center: "1",
                        Right: "2",
                        BothSides: "3"
                    }
                    , FWVerticalAlignmentCode: {
                        Top: "0",
                        Middle: "1",
                        Bottom: "2",
                        BothSides: "3"
                    }
                    , FWIsCode: {
                        False: "0",
                        True: "1"
                    }
                    , FWIsDisCode: {
                        False: "0",
                        True: "1"
                    }
                    , FWMenuTypeCode: {
                        WebMainMenu: "webMainMenu",
                        WebSysManage: "webSysManage",
                        MobileMainMenu: "mobileMainMenu"
                    }
                    , FWObjTypeCode: {
                        Table: "T",
                        View: "V",
                        Model: "M",
                        Object: "O"
                    }
                    , FWOpenTypeCode: {
                        Tab: "10",
                        UIOpen: "11",
                        WindowOpen: "19"
                    }
                    , FWTaskTypeCode: {
                        Dll: "10",
                        Url: "11",
                        Sql: "12"
                    }
                    , FWTimingTypeCode: {
                        Year: "10",
                        Month: "11",
                        Day: "12",
                        Hour: "13",
                        Interval: "20",
                        Timing: "30",
                        Week: "40"
                    }
                    , FWResultStatusCode: {
                        Error: -3,
                        NoRight: -2,
                        LoginOut: -1,
                        Failure: 0,
                        Success: 1,
                        Frequently: 2
                    }
                    , FWResultAppInstallInfoLogCallStatusCode: {
                        Success: "0",
                        Fail: "1"
                    }
                    , FWResultAppInstallInfoLogStatusCode: {
                        Unchecked: "-1",
                        Fail: "0",
                        Success: "1",
                        Unuse: "2"
                    }
                    , FWResultAppLoginLogStatusCode: {
                        TicketFailure: "-1",
                        UserNameFailure: "-2",
                        Error: "-3",
                        UnRegister: "19",
                        NotLoggedIn: "0",
                        Logined: "1"
                    }
                    , FWMessageSendTypeCode: {
                        SMS: "10",
                        Push: "11",
                        EMail: "12"
                    }
                    , FWMessageStatusCode: {
                        Failure: "0",
                        Success: "1"
                    }
                }
            }
            , userLogin: {
                data: {
                    FWUserTypeCode: {
                        Sys: "10",
                        Nor: "11"
                    }
                }
            }
        }
        , fwArrayHelper: {
            FWArrayHelper: {
                add: function (value, item) {
                    return value.push(item);
                },
                addRange: function (value, itemArray) {
                    for (var i = 0; i < itemArray.length; i++) {
                        fw.fwArrayHelper.FWArrayHelper.add(value, itemArray[i]);
                    };
                    return value;
                },
                orderByAsc: function (func) {
                    var m = {};
                    for (var i = 0; i < this.length; i++) {
                        for (var k = 0; k < this.length; k++) {
                            if (func(this[i]) < func(this[k])) {
                                m = this[k];
                                this[k] = this[i];
                                this[i] = m;
                            };
                        };
                    };
                    return this;
                },
                orderByDesc: function (func) {
                    var m = {};
                    for (var i = 0; i < this.length; i++) {
                        for (var k = 0; k < this.length; k++) {
                            if (func(this[i]) > func(this[k])) {
                                m = this[k];
                                this[k] = this[i];
                                this[i] = m;
                            };
                        };
                    };
                    return this;
                },
                contains: function (obj) {
                    var i = this.length;
                    while (i--) {
                        if (this[i] === obj) {
                            return true;
                        };
                    };
                    return false;
                },
                indexOf: function (Object) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == Object) {
                            return i;
                        };
                    };
                    return -1;
                },
                distinct: function () {
                    var a = [],
					b = [];
                    for (var prop in this) {
                        var d = this[prop];
                        if (d === a[prop]) {
                            continue; //防止循环到prototype
                        };
                        if (b[d] != 1) {
                            a.push(d);
                            b[d] = 1;
                        };
                    };
                    return a;
                },
                clone: function () {
                    var newArray = [];
                    for (var property in this) {
                        newArray[property] = $.isArray(this[property]) ? this[property].Clone() : this[property];
                    };
                    return newArray;
                },
                remove: function (obj) {
                    var index = this.indexOf(obj);
                    if (index > -1) {
                        this.splice(index, 1);
                    };
                }
            }
        },
        fwBoolean: {
            FWBooleanHelper: {
                toBoolean: function (_Boolean) {
                    return _Boolean;
                },
                toNumber: function (_Boolean) {
                    return _Boolean ? 1 : 0;
                }
            }
        },
        fwButton: {
            fwButtonHelper: {
                addWait: function (idM) {
                    if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
                        var defaultIconCls = idM.defaultIconCls;
                        if (!fw.fwObject.FWObjectHelper.hasValue(defaultIconCls)) {
                            defaultIconCls = idM.getIconCls();
                            idM.defaultIconCls = defaultIconCls;
                        };
                        idM.set({
                            enabled: false,
                            iconCls: "icon-wait"
                        });
                    };
                },
                removeWait: function (idM) {
                    if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
                        var defaultIconCls = idM.defaultIconCls;
                        if (fw.fwObject.FWObjectHelper.hasValue(defaultIconCls)) {
                            idM.set({
                                enabled: true,
                                iconCls: defaultIconCls
                            });
                        } else {
                            idM.set({
                                enabled: true,
                                iconCls: ""
                            });
                        };
                    };
                }
            }
        },
        fwConfig: {
            FWConfigHelper: {
                dataPublicKey: undefined
                , dynamicDirectory: undefined
            }
        },
        fwCookie: {
            FWCookieHelper: function (cookieName, cookieValue, properties) {
                /// <summary>
                //      1: jQueryExtension.Cookie('cookieName', 'cookieValue') - 设置Cookie
                //      2: jQueryExtension.Cookie('cookieName', 'cookieValue', { expires: 7 }) - 设置带时间的Cookie
                //      3: jQueryExtension.Cookie('cookieName') - 获得Cookie
                //      4: jQueryExtension.Cookie('cookieName', '', { expires: -1 }) - 删除Cookie
                //      5: jQueryExtension.Cookie('cookieName', null) - 删除Cookie
                /// </summary>
                /// <param name="cookieName" type="String">
                ///      1: cookieName: null - Cookie名称。
                /// </param>
                /// <param name="cookieValue" type="String">
                ///      1: cookieValue: null - Cookie值。
                /// </param>
                /// <param name="properties" type="Options">
                ///     一组用于默认配置的键/值对。
                ///      1: expires: '' - 有效期（天数）。
                ///      2: path: '/' - 路径。
                ///      3: domain: '' - 域名。
                ///      4: secure: '' - 安全性。
                /// </param>
                ///	<returns type="String" />
                cookieName = fw.fwUrl.FWUrlHelper.encode(fw.fwSafe.FWSafeHelper.encrypt(cookieName));
                cookieValue = fw.fwUrl.FWUrlHelper.encode(fw.fwSafe.FWSafeHelper.encrypt(cookieValue));
                if (typeof cookieValue != 'undefined') {
                    var settings = {
                        expires: '',
                        path: '/',
                        domain: '',
                        secure: ''
                    };
                    $.extend(settings, properties);

                    if (cookieValue == null) {
                        cookieValue = '';
                        settings.expires = -1;
                    };

                    var expires = '';
                    if (settings.expires && (typeof settings.expires == 'number' || settings.expires.toUTCString)) {
                        var datetime;
                        if (typeof settings.expires == 'number') {
                            datetime = new Date();
                            datetime.setTime(datetime.getTime() + (settings.expires * 24 * 60 * 60 * 1000));
                        } else {
                            datetime = settings.expires;
                        };
                        expires = '; expires=' + datetime.toUTCString();
                    };
                    var path = settings.path ? '; path=' + (settings.path) : '';
                    var domain = settings.domain ? '; domain=' + (settings.domain) : '';
                    var secure = settings.secure ? '; secure' + (settings.secure) : '';
                    document.cookie = [cookieName, '=', cookieValue, expires, path, domain, secure].join('');
                } else {
                    var tempCookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            if (cookie.substring(0, cookieName.length + 1) == (cookieName + '=')) {
                                tempCookieValue = cookie.substring(cookieName.length + 1);
                                break;
                            };
                        };
                    };
                    if (tempCookieValue != null && tempCookieValue.indexOf("&") == -1) {
                        tempCookieValue = fw.fwSafe.FWSafeHelper.decrypt(fw.fwUrl.FWUrlHelper.decode(tempCookieValue));
                    };
                    return tempCookieValue;
                };
            }
        }
        , fwData: {
            FWResultStatus: {
                /// <summary>
                /// 出错
                /// </summary>
                Error: -3

                /// <summary>
                /// 没有权限
                /// </summary>
			,
                NoRight: -2

                /// <summary>
                /// 登入超时（未登入）
                /// </summary>
			,
                LoginOut: -1

                /// <summary>
                /// 失败
                /// </summary>
			,
                Failure: 0

                /// <summary>
                /// 成功
                /// </summary>
			,
                Success: 1
                /// <summary>
                /// 频繁操作
                /// </summary>
			,
                Frequently: 2
            },
            FWFileUploadStatus: {
                /// <summary>
                /// 分析中
                /// </summary>
                Analysing: 0

                /// <summary>
                /// 上传
                /// </summary>
			,
                Uploading: 1

                /// <summary>
                /// 暂停
                /// </summary>
			,
                Pause: 2

                /// <summary>
                /// 完成
                /// </summary>
			,
                Finished: 3
            },
            FWDataType: {
                String: "String",
                Int16: "tinyint",
                Int32: "int",
                Int64: "bigint",
                Single: "Single",
                Double: "Double",
                Decimal: "decimal",
                Boolean: "bit",
                DateTime: "datetime"
            },
            FWFileExtensionType: {
                Image: 1,
                Word: 2
            },
            FWSelectType: {
                /// <summary>
                /// 出错
                /// </summary>
                Single: 1

                /// <summary>
                /// 没有权限
                /// </summary>
			,
                Multi: "n"

                /// <summary>
                /// 所有
                /// </summary>
			,
                All: "all"
            },
            FWSortType: {
                /// <summary>
                /// 默认
                /// </summary>
                inherit: -1

                /// <summary>
                /// 正序
                /// </summary>
			,
                Asc: 0
                /// <summary>
                /// 正序
                /// </summary>
			,
                asc: 0

                /// <summary>
                /// 倒序
                /// </summary>
			,
                Desc: 1
                /// <summary>
                /// 倒序
                /// </summary>
			,
                desc: 1
            },
            FWMenuType: {
                SysManage: "sysManage",
                MainMenu: "mainMenu"
                //, CloudPlatformManage: "cloudPlatform"//平台标记
            },
            FWTaskType: {
                Dll: 10,
                Url: 11,
                Sql: 12
            },
            FWTimingType: {
                Year: 10,
                Month: 11,
                Day: 12,
                Hour: 13,
                Interval: 20,
                Timing: 30,
                Week: 40
            },
            FWOpenType: {
                Tab: 10,
                UIOpen: 11,
                WindowOpen: 19
            },
            FWDBAction: {
                Update: 2,
                Delete: 3
            },
            FWObjType: {
                Table: "T",
                View: "V",
                Model: "M",
                Object: "O"
            }
        },
        fwDataTable: {
            FWDataTableHelper: {
                toEntityList: function (fwdtbl) {
                    var entityList;
                    if (fw.fwObject.FWObjectHelper.hasValue(fwdtbl)) {
                        entityList = [];
                        var entity;
                        for (var i = 0; i < fwdtbl.rows.length; i++) {
                            entity = {};
                            for (var j = 0; j < fwdtbl.columns.length; j++) {
                                entity[fwdtbl.columns[j].columnName] = fwdtbl.rows[i][j]
                            };
                            entityList.push(entity);
                        };
                    };
                    return entityList;
                },
                toFWDataTable: function (entityList) {
                    var fwdtbl = null;
                    if (fw.fwObject.FWObjectHelper.hasValue(entityList)) {
                        var getColumns = function (obj) {
                            var columns = [];
                            for (var columnName in obj) {
                                columns.push({
                                    columnName: columnName
                                });
                            };
                            return columns;
                        };
                        var columns;
                        var rows = [];
                        var row;
                        switch (Object.prototype.toString.apply(entityList)) {
                            case "[object Object]":
                                columns = getColumns(entityList);
                                row = [];
                                for (var i = 0; i < columns.length; i++) {
                                    row.push(entityList[columns[i].columnName]);
                                };
                                rows.push(row);
                                break;
                            case "[object Array]":
                                columns = getColumns(entityList[0]);
                                for (var j = 0; j < entityList.length; j++) {
                                    row = [];
                                    for (var i = 0; i < columns.length; i++) {
                                        row.push(entityList[j][columns[i].columnName]);
                                    };
                                    rows.push(row);
                                };
                                break;
                        };
                        fwdtbl = {
                            columns: columns,
                            rows: rows
                        };
                    };
                    return fwdtbl;
                }
            }
        },
        fwDateTime: {
            FWDateTimeHelper: {
                addYears: function (_DateTime, value) {
                    /// <summary>
                    ///     日期加 n年
                    /// </summary>
                    /// <param name="_DateTime" type="DateTime">日期</param>
                    /// <param name="value" type="Int">
                    ///     需要加的年数
                    ///     必须为int型
                    /// </param>
                    ///	<returns type="DateTime" />
                    if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                        _DateTime = new Date((_DateTime.getFullYear() + value), _DateTime.getMonth(), _DateTime.getDate(), _DateTime.getHours(), _DateTime.getMinutes(), _DateTime.getSeconds());
                    };
                    return _DateTime;
                },
                addMonths: function (_DateTime, value) {
                    /// <summary>
                    ///     日期加 n月
                    /// </summary>
                    /// <param name="value" type="Int">
                    ///     需要加的月数
                    /// </param>
                    ///	<returns type="date|string" />
                    if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                        _DateTime = new Date(_DateTime.getFullYear(), (_DateTime.getMonth()) + value, _DateTime.getDate(), _DateTime.getHours(), _DateTime.getMinutes(), _DateTime.getSeconds());
                    };
                    return _DateTime;
                },
                addWeeks: function (_DateTime, value) {
                    /// <summary>
                    ///     日期加 n月
                    /// </summary>
                    /// <param name="AddWeekNumber" type="Int">
                    ///     需要加的月数
                    /// </param>
                    ///	<returns type="date|string" />
                    if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                        _DateTime = new Date(Date.parse(_DateTime) + (86400000 * 7 * value));
                    };
                    return _DateTime;
                },
                addDays: function (_DateTime, value) {
                    /// <summary>
                    ///     日期加 n日
                    /// </summary>
                    /// <param name="AddDayNumber" type="Int">
                    ///     需要加的日数
                    /// </param>
                    ///	<returns type="date|string" />
                    if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                        _DateTime = new Date(Date.parse(_DateTime) + (86400000 * value));
                    };
                    return _DateTime;
                },
                addHours: function (_DateTime, value) {
                    /// <summary>
                    ///     日期加 n小时
                    /// </summary>
                    /// <param name="AddHourNumber" type="Int">
                    ///     需要加的小时数
                    /// </param>
                    ///	<returns type="date|string" />
                    if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                        _DateTime = new Date(Date.parse(_DateTime) + (3600000 * value));
                    };
                    return _DateTime;
                },
                addMinutes: function (_DateTime, value) {
                    /// <summary>
                    ///     日期加 n分钟
                    /// </summary>
                    /// <param name="AddMinuteNumber" type="Int">
                    ///     需要加的分钟数
                    /// </param>
                    ///	<returns type="date|string" />
                    if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                        _DateTime = new Date(Date.parse(_DateTime) + (60000 * value));
                    };
                    return _DateTime;
                },
                addSeconds: function (_DateTime, value) {
                    /// <summary>
                    ///     日期加 n秒
                    /// </summary>
                    /// <param name="AddSecondNumber" type="Int">
                    ///     需要加的秒数
                    /// </param>
                    ///	<returns type="date|string" />
                    if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                        _DateTime = new Date(Date.parse(_DateTime) + (1000 * value));
                    };
                    return _DateTime;
                },
                toString: function (_DateTime, format) {
                    var result = null;
                    if (!fw.fwObject.FWObjectHelper.hasValue(format)) {
                        format = "yyyy-MM-dd HH:mm:ss";
                    };
                    if (format == "UTCDateTime") {
                        ///  /Date(1311821221173+0800)/
                        result = "/Date(" + (TL.DateTime.AddHours(_DateTime, -8) - TL.ToDateTime("1970-01-01")) + "+0800)/";
                    } else {
                        var o = {
                            "M+": _DateTime.getMonth() + 1, //月份
                            "d+": _DateTime.getDate(), //日
                            "h+": _DateTime.getHours() % 12 == 0 ? 12 : _DateTime.getHours() % 12, //12小时
                            "H+": _DateTime.getHours(), //24小时
                            "m+": _DateTime.getMinutes(), //分
                            "s+": _DateTime.getSeconds(), //秒
                            "q+": Math.floor((_DateTime.getMonth() + 3) / 3), //季度
                            "S": _DateTime.getMilliseconds() //毫秒
                        };
                        var week = {
                            "0": "/u65e5",
                            "1": "/u4e00",
                            "2": "/u4e8c",
                            "3": "/u4e09",
                            "4": "/u56db",
                            "5": "/u4e94",
                            "6": "/u516d"
                        };
                        if (/(y+)/.test(format)) {
                            format = format.replace(RegExp.$1, (_DateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
                        };
                        if (/(E+)/.test(format)) {
                            format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
                        };
                        for (var k in o) {
                            if (new RegExp("(" + k + ")").test(format)) {
                                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            };
                        };
                        result = format;
                    };
                    return result;
                },
                toInTime: function (startTime, endTime) {
                    var seconds = Math.abs(parseInt((endTime - startTime) / 1000, 10));
                    return fw.fwNumber.FWNumberHelper.toInTime(seconds);
                }
            }
        },
        fwFileUpload: {
            fwFileUploadHelper: {
                imageExtensions: "gif|bmp|jpg|jpeg|png",
                wordExtensions: "txt|doc|docx",
                insertFileInfo: function (uploadInfoJQ, fileInfo, enterClearCallback) {
                    /// <summary>
                    ///     上传文件添加已经上传的文件
                    /// </summary>
                    /// <param name="uploadInfoJQ" type="Object">
                    ///     jquery对象 用户在该标签中显示上传信息
                    /// </param>
                    /// <param name="fileInfo" type="Object">
                    ///     文件信息{name:"文件名",fileUrl:"文件地址"}
                    /// </param>
                    /// <param name="enterClearCallback" type="方法">
                    ///     删除按钮回调的方法
                    /// </param>
                    ///	<returns/>
                    if (uploadInfoJQ.length > 0 && fw.fwObject.FWObjectHelper.hasValue(fileInfo)) {
                        var controlData = uploadInfoJQ.data("controlData");
                        if (!fw.fwObject.FWObjectHelper.hasValue(controlData)) {
                            controlData = {};
                            uploadInfoJQ.data("controlData", controlData);
                            var html = "";
                            html += '<div class="progressbar" style="position: relative; border: 0px solid #a5acb5; background-color: white; width: 100%; overflow: hidden;">';
                            html += '<div class="progressbar-percent" style="position: absolute; background-color: blue; left: 0px; top: 0px; overflow: hidden; z-index: 1;"></div>';
                            html += '<div class="progressbar-label" style="position: absolute; left: 0px; top: 0px; width: 100%; font-size: 13px; color: #a5acb5; z-index: 10; text-align: left; text-indent: 2px; overflow: hidden;">' + fileInfo.progressValue + '%</div>';
                            html += '</div>';
                            html += '<div class="delete" style="position:relative; cursor:pointer; color:Blue; float:right; margin-right:-36px;">删除</div>';
                            $(html).appendTo(uploadInfoJQ.empty());
                            controlData.controlJQs = {
                                isInit: true
                            };
                            var height = uploadInfoJQ.height();
                            controlData.controlJQs.progressbarJQ = $(">.progressbar", uploadInfoJQ).height(height);
                            controlData.controlJQs.progressbarPercentJQ = $(">.progressbar-percent", controlData.controlJQs.progressbarJQ).height(height);
                            controlData.controlJQs.progressbarLabelJQ = $(">.progressbar-label", controlData.controlJQs.progressbarJQ).height(height).css("line-height", height + "px");
                            controlData.controlJQs.deleteJQ = $(">.delete", uploadInfoJQ);
                            controlData.controlJQs.deleteJQ.css("margin-top", (0 - height / 2 - controlData.controlJQs.deleteJQ.height() / 2) + "px");
                            controlData.controlJQs.deleteJQ.bind("click", function () {
                                enterClearCallback([]);
                                setTimeout(function () {
                                    uploadInfoJQ.removeData("controlData").empty();
                                }, 100);
                            });
                        } else {
                            controlData.controlJQs.isInit = false;
                        };

                        if (fw.fwObject.FWObjectHelper.hasValue(fileInfo.fileUrl)) {
                            controlData.controlJQs.progressbarJQ.css({
                                "border-color": "transparent",
                                "background-color": "transparent"
                            });
                            controlData.controlJQs.progressbarPercentJQ.css({
                                "background-color": "transparent"
                            });
                            if (("|" + fw.fwFileUpload.fwFileUploadHelper.imageExtensions + "|").toUpperCase().indexOf("|" + fileInfo.extension.replace('.', '').toUpperCase() + "|") > -1) {
                                controlData.controlJQs.progressbarLabelJQ.html("<img style=\"width:100%; height:" + (controlData.controlJQs.progressbarLabelJQ.height() + 1) + "px; border-width:0px; margin: -1px 0px 0px -2px;\" src=\"" + fileInfo.fileUrl + "\" />");
                            } else {
                                controlData.controlJQs.progressbarLabelJQ.html("<a href=\"" + fileInfo.fileUrl + "\" title=\"" + fileInfo.name + "\" target=\"_blank\">" + fileInfo.name + "</a>");
                            };
                        };
                    };
                }
            }
        },
        guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        fwJson: {
            FWJsonHelper: {
                // 摘要:
                //     Json字符串的格式化方式
                JsonFormatMode: {
                    // 摘要:
                    //     Json字符串（单行）。
                    ToString: 0,
                    // 摘要:
                    //     Json字符串（有换行符的格式化）。
                    ToFormatString: 1,
                    // 摘要:
                    //     HTML字符串。
                    ToHTML: 2,
                    // 摘要:
                    //     XML字符串。
                    ToXML: 3
                }
                // 摘要:
                //     控件模式。
			,
                JsonMode: {
                    // 摘要:
                    //     查看模式。
                    View: 0,
                    // 摘要:
                    //     修改模式。
                    Edit: 1
                },
                _SerializeObject: function (Properties) {
                    /// <summary>
                    ///     把对象序列化为Json字符串
                    ///     1: fw.fwJson.FWJsonHelper._SerializeObject(value)。
                    /// </summary>
                    /// <param type="Object" name="value">对象</param>
                    /// <param type="Boolean" name="IsUseCustomFormat">是否使用自定义格式化</param>
                    ///	<returns type="String">Json字符串</returns>
                    var Settings = {
                        Value: null,
                        IsUseCustomFormat: false,
                        FormatMode: fw.fwJson.FWJsonHelper.JsonFormatMode.ToString,
                        Level: 0
                    };
                    if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
                        Properties = {};
                    };
                    $.extend(Settings, Properties);
                    var value = Settings.Value;
                    var IsUseCustomFormat = fw.fwBoolean.FWBooleanHelper.toBoolean(Settings.IsUseCustomFormat);
                    var FormatMode = Settings.FormatMode;
                    var Level = fw.fwObject.FWObjectHelper.toNumber(Settings.Level);

                    var Space = "";
                    var Space_Plus1 = "";
                    switch (FormatMode) {
                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString:
                            for (var i = 0; i < Level; i++) {
                                Space += "    ";
                            };
                            for (var i = 0; i < Level + 1; i++) {
                                Space_Plus1 += "    ";
                            };
                            break;
                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToHTML:
                            for (var i = 0; i < Level; i++) {
                                Space += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            };
                            for (var i = 0; i < Level + 1; i++) {
                                Space_Plus1 += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            };
                            break;
                    };

                    switch (Object.prototype.toString.apply(value)) {
                        case "[object String]":
                            if (IsUseCustomFormat && value.indexOf("/Date(") > -1) {
                                return "\"" + value.ToDate().ToString("yyyy-MM-dd HH:mm:ss") + "\"";
                            } else if (value.indexOf("/Date(") == 0 && value.lastIndexOf(")/") == (value.length - 2) && value.length == 21) {
                                return "\"" + value.replace(/\//g, "\\/") + "\"";
                            } else {
                                return "\"" + value.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () {
                                    var a = arguments[0];
                                    return (a == "\n") ? "\\n" : (a == "\r") ? "\\r" : (a == "\t") ? "\\t" : ""
                                }) + "\"";
                            };
                        case "[object Number]":
                            return value;
                        case "[object Boolean]":
                            return value;
                        case "[object Date]":
                            return "\"" + fw.fwDateTime.FWDateTimeHelper.toString(value) + "\"";
                        case "[object Object]":
                            if (value == undefined || value == null) {
                                return null;
                            } else {
                                var valueArray = [];
                                for (var i in value) {
                                    switch (FormatMode) {
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToString:
                                            valueArray.push("\"" + i + "\":" + fw.fwJson.FWJsonHelper._SerializeObject({
                                                Value: value[i],
                                                IsUseCustomFormat: IsUseCustomFormat,
                                                FormatMode: FormatMode,
                                                Level: Level + 1
                                            }));
                                            break;
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString:
                                            valueArray.push(Space_Plus1 + "\"" + i + "\": " + fw.fwJson.FWJsonHelper._SerializeObject({
                                                Value: value[i],
                                                IsUseCustomFormat: IsUseCustomFormat,
                                                FormatMode: FormatMode,
                                                Level: Level + 1
                                            }));
                                            break;
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToHTML:
                                            valueArray.push("<br /><span>" + Space_Plus1 + "</span><span class=\"TL_Json_Property\">\"" + i + "\"</span><span class=\"TL_Json_Colon\">: </span><span class=\"TL_Json_Value\">" + fw.fwJson.FWJsonHelper._SerializeObject({
                                                Value: value[i],
                                                IsUseCustomFormat: IsUseCustomFormat,
                                                FormatMode: FormatMode,
                                                Level: Level + 1
                                            }) + "</span>");
                                            break;
                                    };
                                };
                                if (valueArray.length > 0) {
                                    switch (FormatMode) {
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToString:
                                            return '{' + valueArray.join(',') + '}';
                                            break;
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString:
                                            return '{\n' + valueArray.join(',\n') + '\n' + Space + '}';
                                            break;
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToHTML:
                                            return '<span class=\"TL_Json_Braces\">{</span><span class=\"TL_Json_NodeToggle\"></span><span class=\"TL_Json_Nodes\">' + valueArray.join('<span class=\"TL_Json_Comma\">,</span>') + '</span><br /><span>' + Space + '</span><span class=\"TL_Json_Braces\">}</span>';
                                            break;
                                    };
                                } else {
                                    switch (FormatMode) {
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToString:
                                            return '{}';
                                            break;
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString:
                                            return '{}';
                                            break;
                                        case fw.fwJson.FWJsonHelper.JsonFormatMode.ToHTML:
                                            return '<span class=\"TL_Json_Braces\">{</span><span class=\"TL_Json_Braces\">}</span>';
                                            break;
                                    };
                                };
                            };
                        case "[object Array]":
                            var valueArray = [];
                            for (var i = 0; i < value.length; i++) {
                                switch (FormatMode) {
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToString:
                                        valueArray.push(fw.fwJson.FWJsonHelper._SerializeObject({
                                            Value: value[i],
                                            IsUseCustomFormat: IsUseCustomFormat,
                                            FormatMode: FormatMode,
                                            Level: Level + 1
                                        }));
                                        break;
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString:
                                        valueArray.push(Space_Plus1 + fw.fwJson.FWJsonHelper._SerializeObject({
                                            Value: value[i],
                                            IsUseCustomFormat: IsUseCustomFormat,
                                            FormatMode: FormatMode,
                                            Level: Level + 1
                                        }));
                                        break;
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToHTML:
                                        valueArray.push("<br /><span>" + Space_Plus1 + "</span>" + fw.fwJson.FWJsonHelper._SerializeObject({
                                            Value: value[i],
                                            IsUseCustomFormat: IsUseCustomFormat,
                                            FormatMode: FormatMode,
                                            Level: Level + 1
                                        }));
                                        break;
                                };
                            };
                            if (valueArray.length > 0) {
                                switch (FormatMode) {
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToString:
                                        return "[" + valueArray.join(',') + "]";
                                        break;
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString:
                                        return "[\n" + valueArray.join(',\n') + "\n" + Space + "]";
                                        break;
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToHTML:
                                        return "<span class=\"TL_Json_Brackets\">[</span><span class=\"TL_Json_NodeToggle\"></span><span class=\"TL_Json_Nodes\">" + valueArray.join('<span class=\"TL_Json_Comma\">,</span>') + "</span><br /><span>" + Space + "</span><span class=\"TL_Json_Brackets\">]</span>";
                                        break;
                                };
                            } else {
                                switch (FormatMode) {
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToString:
                                        return "[]";
                                        break;
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString:
                                        return "[]";
                                        break;
                                    case fw.fwJson.FWJsonHelper.JsonFormatMode.ToHTML:
                                        return "<span class=\"TL_Json_Brackets\">[</span><span class=\"TL_Json_Brackets\">]</span>";
                                        break;
                                };
                            };
                        case "[object Null]":
                            return null;
                        case "[object Undefined]":
                            return null;
                        case "[object Function]":
                            return null;
                        case "[object DOMWindow]":
                            return null;
                        case "[object global]":
                            return null;
                        default:
                            alert(value.toString() + "_SerializeObject发现未知类型！" + Object.prototype.toString.apply(value));
                            break;
                    };
                },
                __SerializeObject: function (Properties) {
                    /// <summary>
                    ///     把对象序列化为Json字符串
                    ///     1: fw.fwJson.FWJsonHelper._SerializeObject(value)。
                    /// </summary>
                    /// <param type="Object" name="value">对象</param>
                    /// <param type="Boolean" name="IsUseCustomFormat">是否使用自定义格式化</param>
                    ///	<returns type="String">Json字符串</returns>
                    var Settings = {
                        Value: null,
                        IsUseCustomFormat: false,
                        FormatMode: fw.fwJson.FWJsonHelper.JsonFormatMode.ToString
                    };
                    if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
                        Properties = {};
                    };
                    $.extend(Settings, Properties);
                    var value = Settings.Value;
                    var IsUseCustomFormat = TL.ToBoolean(Settings.IsUseCustomFormat);
                    var FormatMode = Settings.FormatMode;

                    switch (Object.prototype.toString.apply(value)) {
                        case "[object String]":
                            if (IsUseCustomFormat && value.indexOf("/Date(") > -1) {
                                return "\"" + value.ToDate().ToString("yyyy-MM-dd HH:mm:ss") + "\"";
                            } else if (value.indexOf("/Date(") == 0 && value.lastIndexOf(")/") == (value.length - 2) && value.length == 21) {
                                return "\"" + value.replace(/\//g, "\\/") + "\"";
                            } else {
                                return "\"" + value.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () {
                                    var a = arguments[0];
                                    return (a == "\n") ? "\\n" : (a == "\r") ? "\\r" : (a == "\t") ? "\\t" : ""
                                }) + "\"";
                            };
                        case "[object Number]":
                            return value;
                        case "[object Boolean]":
                            return value;
                        case "[object Object]":
                            if (value == undefined || value == null) {
                                return null;
                            } else {
                                var valueArray = [];
                                for (var i in value) {
                                    valueArray.push("\"" + i + "\":" + fw.fwJson.FWJsonHelper._SerializeObject({
                                        Value: value[i],
                                        IsUseCustomFormat: IsUseCustomFormat,
                                        FormatMode: FormatMode
                                    }));
                                };
                                return '{' + valueArray.join(',') + '}';
                            };
                        case "[object Array]":
                            var valueArray = [];
                            for (var i = 0; i < value.length; i++) {
                                valueArray.push(fw.fwJson.FWJsonHelper._SerializeObject({
                                    Value: value[i],
                                    IsUseCustomFormat: IsUseCustomFormat,
                                    FormatMode: FormatMode
                                }));
                            };
                            return "[" + valueArray.join(',') + "]";
                        case "[object Null]":
                            return null;
                        case "[object Undefined]":
                            return null;
                        case "[object Function]":
                            return null;
                        case "[object DOMWindow]":
                            return null;
                        case "[object global]":
                            return null;
                        default:
                            alert(value.toString() + "_SerializeObject发现未知类型！" + Object.prototype.toString.apply(value));
                            break;
                    };
                },
                serializeObject: function (value, IsUseCustomFormat, FormatMode) {
                    /// <summary>
                    ///     把对象序列化为Json字符串
                    ///     1: fw.fwJson.FWJsonHelper.SerializeObject(value)。
                    /// </summary>
                    /// <param type="Object" name="value">对象</param>
                    /// <param type="Boolean" name="IsUseCustomFormat">是否使用自定义格式化</param>
                    /// <param type="Number" name="FormatMode">格式化方式</param>
                    ///	<returns type="String">Json字符串</returns>
                    if (!fw.fwObject.FWObjectHelper.hasValue(IsUseCustomFormat)) {
                        IsUseCustomFormat = false;
                    };
                    if (!fw.fwObject.FWObjectHelper.hasValue(FormatMode)) {
                        FormatMode = fw.fwJson.FWJsonHelper.JsonFormatMode.ToString;
                    };
                    return fw.fwJson.FWJsonHelper._SerializeObject({
                        Value: value,
                        IsUseCustomFormat: IsUseCustomFormat,
                        FormatMode: FormatMode
                    });
                },
                deserializeObject: function (value, CatchValue) {
                    /// <summary>
                    ///     Json字符串反序列化为对象
                    ///     1: fw.fwJson.FWJsonHelper.DeserializeObject(value)。
                    /// </summary>
                    /// <param type="String" name="value">对象Json字符串</param>
                    /// <param type="Object" name="CatchValue">反序列化失败时，返回的值</param>
                    ///	<returns type="Object">对象</returns>
                    if (!!fw.fwObject.FWObjectHelper.hasValue(CatchValue) && !fw.fwObject.FWObjectHelper.hasValue(value)) {
                        value = CatchValue;
                    };
                    try {
                        value = eval("(" + value + ")");
                    } catch (ex) { };
                    return value;
                },
                copyObject: function (value) {
                    /// <summary>
                    ///     对象复制
                    ///     1: fw.fwJson.FWJsonHelper.CopyObject(value)。
                    /// </summary>
                    /// <param type="Object" name="value">对象</param>
                    ///	<returns type="Object"></returns>
                    return fw.fwJson.FWJsonHelper.deserializeObject(fw.fwJson.FWJsonHelper.serializeObject(value));
                }
            }
        },
        fwNumber: {
            intMaxValue: 2147483647,
            FWNumberHelper: {
                toNumber: function (_Number) {
                    return _Number;
                },
                toBoolean: function (_Number) {
                    return _Number == 1;
                },
                toDateTime: function (_Number) {
                    /// <summary>
                    ///     1: ("2008-08-08 08:08:08").ToDate() - 字符转化为日期型。
                    /// </summary>
                    ///	<returns type="date" />
                    var DateString = fw.fwString.FWStringHelper.trim(value.toString());

                    if (DateString.indexOf("/Date(") == 0 && DateString.lastIndexOf(")/") == DateString.length - 2) {
                        return eval('new ' + DateString.replace(/\//g, ''));
                    };

                    var Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
                    if (Results && Results.length > 3) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]));
                    };
                    Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
                    if (Results && Results.length > 6) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]));
                    };
                    Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
                    if (Results && Results.length > 7) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]), parseFloat(Results[7]));
                    };

                    Results = DateString.match(/^ *(\d{4})\/(\d{1,2})\/(\d{1,2}) *$/);
                    if (Results && Results.length > 3) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]));
                    };
                    Results = DateString.match(/^ *(\d{4})\/(\d{1,2})\/(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
                    if (Results && Results.length > 6) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]));
                    };
                    Results = DateString.match(/^ *(\d{4})\/(\d{1,2})\/(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
                    if (Results && Results.length > 7) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]), parseFloat(Results[7]));
                    };
                    return "";
                },
                toString: function (_Number, format) {
                    var result = null;
                    if (!fw.fwObject.FWObjectHelper.hasValue(format)) {
                        result = _Number.toString();
                    };
                    if (format == "UTCDateTime") {
                        ///  /Date(1311821221173+0800)/
                        result = "/Date(" + (TL.DateTime.AddHours(_DateTime, -8) - TL.ToDateTime("1970-01-01")) + "+0800)/";
                    } else {
                        /// <summary>
                        ///     1: (333.2345).ToString("###.000")=333.234 - 数字格式化为字符串。
                        ///     2: (0.2365).ToString("#%")=24% - 数字格式化为字符串。
                        /// </summary>
                        /// <param name="format" type="string">
                        ///     用户格式化数字的字符串
                        /// </param>
                        ///	<returns type="string" />
                        var re = /%/;
                        if (re.test(format)) {
                            _Number = _Number * 100;
                        };

                        var patterns = format.split(".");
                        var numbers = (_Number + "").split(".");
                        var lpatterns = patterns[0].split("");
                        var lpatternsbak = patterns[0].split("");

                        var lkeep = "";
                        var rkeep = "";

                        //小数点后大于样式长度进行四舍五入
                        if (numbers[1]) {
                            var rnumbers = numbers[1].split("");
                            var count = 0;
                            if (patterns[1]) {
                                var rpatterns = patterns[1].split("");
                                for (var i = 0; i < rpatterns.length; i++) {
                                    if (rpatterns[i] == "#" || rpatterns[i] == "0") {
                                        count++;
                                    };
                                };
                            };
                            if (rnumbers.length > count) {
                                numbers = (_Number.toFixed(count) + "").split(".");
                            };

                        };
                        var lnumbers = numbers[0].split("");

                        //得到左侧要替换的部分
                        var lplaces = [];
                        for (var i = 0; i < lpatterns.length; i++) {
                            var parternchar = lpatterns[i];
                            if (parternchar == "#" || parternchar == "0") {
                                lplaces.push(i);
                            };
                        };

                        //替换左侧，左侧有数字才要替换，以避免v = .99型的数字而产生错误
                        if (lnumbers[0] && lnumbers[0].length > 0) {
                            var numberIndex = lnumbers.length - 1;
                            var replaced = 0;
                            for (var i = lplaces.length - 1; i >= 0; i--) {
                                replaced++; //被替换的字符数量
                                var place = lplaces[i];
                                lpatterns[place] = lnumbers[numberIndex];
                                if (numberIndex == 0) {
                                    break;
                                };
                                numberIndex--;
                            };

                            //处理以#为第一个格式（#前可能有非0的其他串也在此范围）的格式串，对于以#开头的格式串，将不会截取数字串，要补齐
                            var lstartIdx = lplaces[0];

                            //补漏
                            var nlen = lnumbers.length;
                            var plen = lplaces.length;
                            if (nlen > plen) {
                                lpatternsbak.splice(lstartIdx, 0, "#");
                            };

                            if (lpatternsbak[lstartIdx] == "#") {
                                if (lnumbers.length > replaced) {
                                    var idx = lnumbers.length - replaced;
                                    for (var i = 0; i < idx; i++) {
                                        lkeep += lnumbers[i];
                                    };
                                    lpatterns[lstartIdx] = lkeep + lpatterns[lstartIdx];
                                };
                            };
                        };

                        //替换右侧
                        if (patterns[1] && patterns[1].length > 0) {
                            var rpatterns = patterns[1].split("");
                            if (numbers[1] && numbers[1].length > 0) {
                                var rnumbers = numbers[1].split("");

                                //得到右侧将要替换的部分
                                var rplaces = [];
                                for (var i = 0; i < rpatterns.length; i++) {
                                    var parternchar = rpatterns[i];
                                    if (parternchar == "#" || parternchar == "0") {
                                        rplaces.push(i);
                                    };
                                };

                                var replaced = 0;
                                for (var i = 0; i < rplaces.length; i++) {
                                    replaced++; //被替换的字符数量
                                    var place = rplaces[i];
                                    rpatterns[place] = rnumbers[i];
                                    if (i == rnumbers.length - 1) {
                                        break;
                                    };
                                };

                            };
                        };

                        for (var i = 0; i < lpatterns.length; i++) {
                            if (lpatterns[i] == "#") {
                                lpatterns[i] = "";
                            };
                        };

                        result = lpatterns.join("");
                        if (patterns[1]) {
                            for (var i = 0; i < rpatterns.length; i++) {
                                if (rpatterns[i] == "#") {
                                    rpatterns[i] = "";
                                };
                            };
                            result += "." + rpatterns.join("");
                        };

                        //第一位不能为,号
                        if (result.substring(0, 1) == ",") {
                            result = result.substring(1);
                        };

                        //最后一位也不能为,号
                        if (result.substring(result.length - 1) == ",") {
                            result = result.substring(0, result.length);
                        };

                        if (result == format) {
                            result = "";
                        };
                    };
                    return result;
                },
                toFileSize: function (value) {
                    var fileSize = "";
                    if (value >= 1073741824) {
                        fileSize = fw.fwNumber.FWNumberHelper.toString(value / 1073741824, "#.00") + " GB";
                    } else if (value >= 1048576) {
                        fileSize = fw.fwNumber.FWNumberHelper.toString(value / 1048576, "#.00") + " MB";
                    } else if (value >= 1024) {
                        fileSize = fw.fwNumber.FWNumberHelper.toString(value / 1024, "#.00") + " KB";
                    } else if (value > 0 && value < 1024) {
                        fileSize = "1 KB";
                    };
                    return fileSize;
                },
                toDistance: function (value) {
                    var fileSize = "";
                    if (value >= 1000) {
                        fileSize = fw.fwNumber.FWNumberHelper.toString(value / 1000, "#.00") + " 千米";
                    } else if (value > 0 && value < 1000) {
                        fileSize = fw.fwNumber.FWNumberHelper.toString(value, "#") + " 米";
                    };
                    return fileSize;
                },
                toInTime: function (seconds) {
                    var inTime = "";
                    var years = 0,
					months = 0,
					dates = 0,
					hours = 0,
					minutes = 0;
                    if (seconds >= (12 * 30 * 24 * 60 * 60)) {
                        years = parseInt(seconds / (12 * 30 * 24 * 60 * 60), 10);
                        seconds -= years * (12 * 30 * 24 * 60 * 60);
                        inTime += years + "年";
                    };
                    if (seconds >= (30 * 24 * 60 * 60)) {
                        months = parseInt(seconds / (30 * 24 * 60 * 60), 10);
                        seconds -= months * (30 * 24 * 60 * 60);
                        inTime += months + "月";
                    };
                    if (seconds >= (24 * 60 * 60)) {
                        dates = parseInt(seconds / (24 * 60 * 60), 10);
                        seconds -= dates * (24 * 60 * 60);
                        inTime += dates + "天";
                    };
                    if (seconds >= (60 * 60)) {
                        hours = parseInt(seconds / (60 * 60), 10);
                        seconds -= hours * (60 * 60);
                        inTime += hours + "时";
                    };
                    if (seconds >= (60)) {
                        minutes = parseInt(seconds / (60), 10);
                        seconds -= minutes * (60);
                        inTime += minutes + "分";
                    };
                    if (seconds >= 0) {
                        seconds = parseInt(seconds, 10);
                        inTime += seconds + "秒";
                    };
                    return inTime;
                },
                decimalDigits: function (_Number) {
                    var NumberString = _Number.toString();
                    var DecimalPointIndex = NumberString.indexOf(".");
                    if (DecimalPointIndex > -1) {
                        return NumberString.length - NumberString.indexOf(".") - 1;
                    } else {
                        return 0;
                    };
                }

			,
                add: function (_Number1, _Number2) {
                    var r1,
					r2,
					m;
                    try {
                        r1 = _Number1.toString().split(".")[1].length;
                    } catch (e) {
                        r1 = 0;
                    };
                    try {
                        r2 = _Number2.toString().split(".")[1].length;
                    } catch (e) {
                        r2 = 0;
                    };
                    m = Math.pow(10, Math.max(r1, r2));
                    return (_Number1 * m + _Number2 * m) / m;
                }
                //减
			,
                subtr: function (_Number1, _Number2) {
                    var r1,
					r2,
					m,
					n;
                    try {
                        r1 = _Number1.toString().split(".")[1].length;
                    } catch (e) {
                        r1 = 0;
                    };
                    try {
                        r2 = _Number2.toString().split(".")[1].length;
                    } catch (e) {
                        r2 = 0;
                    };
                    m = Math.pow(10, Math.max(r1, r2));
                    //last modify by deeka
                    //动态控制精度长度
                    n = (r1 >= r2) ? r1 : r2;
                    return ((_Number1 * m - _Number2 * m) / m).toFixed(n);
                }
                //乘
			,
                mul: function (_Number1, _Number2) {
                    var m = 0,
					s1 = _Number1.toString(),
					s2 = _Number2.toString();
                    try {
                        m += s1.split(".")[1].length;
                    } catch (e) { };
                    try {
                        m += s2.split(".")[1].length;
                    } catch (e) { };
                    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
                }
                //除
			,
                div: function (_Number1, _Number2) {
                    var t1 = 0,
					t2 = 0,
					r1,
					r2;
                    try {
                        t1 = _Number1.toString().split(".")[1].length;
                    } catch (e) { };
                    try {
                        t2 = _Number2.toString().split(".")[1].length;
                    } catch (e) { };
                    with (Math) {
                        r1 = Number(_Number1.toString().replace(".", ""));
                        r2 = Number(_Number2.toString().replace(".", ""));
                        return (r1 / r2) * pow(10, t2 - t1);
                    };
                }
            , randomNumber: function (min, max) {
                if (max < min) {
                    var maxNumber = min;
                    min = max;
                    max = maxNumber;
                };
                var range = max - min;
                var rand = Math.random();
                return (min + Math.round(rand * range));
            }
            }
        },
        fwObject: {
            FWObjectHelper: {
                hasValue: function (anyType, isIncludeString) {
                    var Is = false;
                    if (anyType != undefined && anyType != null) {
                        switch (Object.prototype.toString.apply(anyType)) {
                            case "[object String]":
                                anyType = fw.fwString.FWStringHelper.trim(anyType.toLocaleLowerCase());
                                Is = (anyType == "undefined" || anyType == "null" || anyType.length < 1);
                                break;
                            case "[object Number]":
                                break;
                            case "[object Boolean]":
                                break;
                            case "[object Object]":
                                Is = $.isEmptyObject(anyType);
                                break;
                            case "[object Array]":
                                Is = (anyType.length < 1);
                                break;
                        };
                    } else {
                        Is = true;
                    };
                    return !Is;
                },
                isArray: function (anyType) {
                    return $.isArray(anyType);
                },
                isObject: function (anyType) {
                    var is = false;
                    if (anyType != undefined && anyType != null) {
                        is = (Object.prototype.toString.apply(anyType) == "[object Object]");
                    };
                    return is;
                },
                isDateTime: function (anyType) {
                    var is = false;
                    if (anyType != undefined && anyType != null) {
                        is = (Object.prototype.toString.apply(anyType) == "[object Date]");
                    };
                    return is;
                },
                isString: function (anyType) {
                    var is = false;
                    if (anyType != undefined && anyType != null) {
                        is = (Object.prototype.toString.apply(anyType) == "[object String]");
                    };
                    return is;
                },
                toString: function (value, format) {
                    var result = null;
                    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
                        switch (Object.prototype.toString.apply(value)) {
                            case "[object Date]":
                                result = fw.fwDateTime.FWDateTimeHelper.toString(value, format);
                                break;
                            case "[object Number]":
                                result = fw.fwNumber.FWNumberHelper.toString(value, format);
                                break;
                            case "[object Boolean]":
                                result = fw.fwBoolean.FWBooleanHelper.toString(value, format);
                                break;
                            default:
                                result = fw.fwJson.FWJsonHelper.serializeObject(value);
                                break;
                        };
                    } else {
                        result = null;
                    };
                    return result;
                },
                toDateTime: function (value) {
                    var result = null;
                    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
                        switch (Object.prototype.toString.apply(value)) {
                            case "[object String]":
                                result = fw.fwString.FWStringHelper.toDateTime(value);
                                break;
                            case "[object Number]":
                                result = fw.fwNumber.FWNumberHelper.toDateTime(value);
                                break;
                            default:
                                result = value;
                                break;
                        };
                    } else {
                        result = null;
                    };
                    return result;
                },
                toBoolean: function (value) {
                    var result = false;
                    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
                        switch (Object.prototype.toString.apply(value)) {
                            case "[object Boolean]":
                                result = fw.fwBoolean.FWBooleanHelper.toBoolean(value);
                                break;
                            case "[object Number]":
                                result = fw.fwNumber.FWNumberHelper.toBoolean(value);
                                break;
                            case "[object String]":
                                result = fw.fwString.FWStringHelper.toBoolean(value);
                                break;
                            default:
                                result = false;
                                break;
                        };
                    } else {
                        result = false;
                    };
                    return result;
                },
                toNumber: function (value, format) {
                    var result = null;
                    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
                        switch (Object.prototype.toString.apply(value)) {
                            case "[object Boolean]":
                                result = fw.fwBoolean.FWBooleanHelper.toNumber(value, format);
                                break;
                            case "[object Number]":
                                result = fw.fwNumber.FWNumberHelper.toNumber(value, format);
                                break;
                            case "[object String]":
                                result = fw.fwString.FWStringHelper.toNumber(value, format);
                                break;
                        };
                    };
                    return result;
                },
                toArray: function (value, separator) {
                    var result = null;
                    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
                        switch (Object.prototype.toString.apply(value)) {
                            case "[object Boolean]":
                                result = fw.fwBoolean.FWBooleanHelper.toNumber(value, separator);
                                break;
                            case "[object Number]":
                                result = fw.fwNumber.FWNumberHelper.toNumber(value, separator);
                                break;
                            case "[object String]":
                                result = fw.fwString.FWStringHelper.toArray(value, separator);
                                break;
                            case "[object Array]":
                                result = value;
                                break;
                        };
                    };
                    return result;
                },
                emptyToNull: function (value, propertyArray) {
                    if (fw.fwObject.FWObjectHelper.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            fw.fwObject.FWObjectHelper.emptyToNull(value[i], propertyArray);
                        };
                    } else {
                        if (!fw.fwObject.FWObjectHelper.hasValue(propertyArray)) {
                            propertyArray = [];
                            for (var propertyName in value) {
                                propertyArray.push(propertyName);
                            };
                        };
                        var propertyName;
                        for (var i = 0; i < propertyArray.length; i++) {
                            propertyName = propertyArray[i];
                            if (!fw.fwObject.FWObjectHelper.hasValue(value[propertyName])) {
                                value[propertyName] = null;
                            };
                        };
                    };
                    return value;
                }
            }
        },
        fwSafe: {
            FWSafeHelper: {
                ENCRYPT_DIVISOR: 10//加密除数
                , ENCRYPT_MUST_INSERT_INDEX: 1//必须插值索引
                , ENCRYPT_COUNT: 2//加密次数
                , encrypt: function (value, key) {
                    if (key == undefined || key == null) {
                        key = fw.fwConfig.FWConfigHelper.dataPublicKey;
                    };
                    if (fw.fwObject.FWObjectHelper.hasValue(value) && fw.fwObject.FWObjectHelper.hasValue(key)) {
                        switch (Object.prototype.toString.apply(value)) {
                            case "[object Object]":
                                for (var i in value) {
                                    var v = value[i];
                                    if (Object.prototype.toString.apply(v) != "[object String]") {
                                        value[i] = fw.fwJson.FWJsonHelper.serializeObject(value[i]);
                                    };
                                };
                                var valueResult = {};
                                for (var i in value) {
                                    valueResult[fw.fwSafe.FWSafeHelper.encrypt(i, key)] = fw.fwSafe.FWSafeHelper.encrypt(value[i], key);
                                };
                                value = valueResult;
                                break;
                            default:
                                value = value.toString();
                                var encryptCount = 0;
                                do {
                                    value = fw.fwString.FWStringHelper.toBase64String(value);
                                    key = fw.fwString.FWStringHelper.toBase64String(key);
                                    var remainder = key.length % fw.fwSafe.FWSafeHelper.ENCRYPT_DIVISOR;
                                    if (remainder < 1) {
                                        remainder = fw.fwSafe.FWSafeHelper.ENCRYPT_DIVISOR;
                                    };
                                    if (value.length > remainder) {
                                        value = fw.fwString.FWStringHelper.insert(value, remainder, key.substr(remainder - 1, 1));
                                    };
                                    if (value.length > fw.fwSafe.FWSafeHelper.ENCRYPT_MUST_INSERT_INDEX) {
                                        value = fw.fwString.FWStringHelper.insert(value, fw.fwSafe.FWSafeHelper.ENCRYPT_MUST_INSERT_INDEX, key.substr(remainder - 1, 1));
                                    };
                                    encryptCount++;
                                } while (encryptCount < fw.fwSafe.FWSafeHelper.ENCRYPT_COUNT);
                                break;
                        };
                    };
                    return value;
                }
                , decrypt: function (value, key) {
                    if (key == undefined || key == null) {
                        key = fw.fwConfig.FWConfigHelper.dataPublicKey;
                    };
                    if (fw.fwObject.FWObjectHelper.hasValue(value) && fw.fwObject.FWObjectHelper.hasValue(key)) {
                        switch (Object.prototype.toString.apply(value)) {
                            case "[object Object]":
                                var valueResult = {};
                                for (var i in value) {
                                    valueResult[fw.fwSafe.FWSafeHelper.decrypt(i, key)] = fw.fwSafe.FWSafeHelper.decrypt(value[i], key);
                                };
                                value = valueResult;
                                break;
                            default:
                                value = value.toString();
                                var encryptCount = 0;
                                do {
                                    key = fw.fwString.FWStringHelper.toBase64String(key);
                                    encryptCount++;
                                } while (encryptCount < fw.fwSafe.FWSafeHelper.ENCRYPT_COUNT);
                                encryptCount = 0;
                                do {
                                    var remainder = key.length % fw.fwSafe.FWSafeHelper.ENCRYPT_DIVISOR;
                                    if (remainder < 1) {
                                        remainder = fw.fwSafe.FWSafeHelper.ENCRYPT_DIVISOR;
                                    };
                                    if (value.length > fw.fwSafe.FWSafeHelper.ENCRYPT_MUST_INSERT_INDEX) {
                                        value = fw.fwString.FWStringHelper.remove(value, fw.fwSafe.FWSafeHelper.ENCRYPT_MUST_INSERT_INDEX, 1);
                                    };
                                    if (value.length > remainder) {
                                        value = fw.fwString.FWStringHelper.remove(value, remainder, 1);
                                    };
                                    value = fw.fwString.FWStringHelper.formBase64String(value);
                                    key = fw.fwString.FWStringHelper.formBase64String(key);
                                    encryptCount++;
                                } while (encryptCount < fw.fwSafe.FWSafeHelper.ENCRYPT_COUNT);
                                break;
                        };
                    };
                    return value;
                }
            }
            , FWValidateCodeHelper: {
                getValidateCode: function (validateCodeRandomString, minCount, maxCount) {
                    var validateCode = "";
                    var count = fw.fwNumber.FWNumberHelper.randomNumber(minCount, maxCount);
                    for (var i = 0; i < count; i++) {
                        validateCode += validateCodeRandomString.substr(fw.fwNumber.FWNumberHelper.randomNumber(0, validateCodeRandomString.length - 1), 1);
                    };
                    return validateCode;
                }
            }
        },
        fwSelect: {
            fwSelectHelper: {
                bindMonth: function (idM, valuefield, textfield) {
                    if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
                        if (!fw.fwObject.FWObjectHelper.hasValue(valuefield)) {
                            valuefield = "code";
                        };
                        if (!fw.fwObject.FWObjectHelper.hasValue(textfield)) {
                            textfield = "name";
                        };
                        var entityList = [];
                        var entity;
                        for (var i = 1; i <= 12; i++) {
                            var MonthString = i < 10 ? ("0" + i) : i;
                            entity = {};
                            entity[valuefield] = MonthString;
                            entity[textfield] = MonthString + "月";
                            entityList.push(entity);
                        };
                        idM.setData(entityList);
                    };
                },
                bindWeek: function (idM) {
                    if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
                        var thisSetWeekData = [{
                            "id": "01",
                            "text": "星期一"
                        }, {
                            "id": "02",
                            "text": "星期二"
                        }, {
                            "id": "03",
                            "text": "星期三"
                        }, {
                            "id": "04",
                            "text": "星期四"
                        }, {
                            "id": "05",
                            "text": "星期五"
                        }, {
                            "id": "06",
                            "text": "星期六"
                        }, {
                            "id": "07",
                            "text": "星期日"
                        }
						];
                        $.page.idM.selectWeek.setData(thisSetWeekData);
                    };
                },
                bindDay: function (idM) {
                    if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
                        var dataDay = [];
                        for (var i = 1; i <= 27; i++) {
                            var DayString = i < 10 ? ("0" + i) : i;
                            dataDay.push({
                                "id": DayString,
                                "text": DayString + "日"
                            });
                        };
                        $.page.idM.selectDay.setData(dataDay);
                    };
                },
                bindHour: function (idM) {
                    if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
                        var dataHour = [];
                        for (var i = 0; i < 24; i++) {
                            var HourString = i < 10 ? ("0" + i) : i;
                            dataHour.push({
                                "id": HourString,
                                "text": HourString + "时"
                            });
                        };
                        $.page.idM.selectHour.setData(dataHour);
                    };
                },
                bindMinute: function (idM) {
                    if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
                        var dataMinute = [];
                        for (var i = 0; i < 60; i++) {
                            var MinuteString = i < 10 ? ("0" + i) : i;
                            dataMinute.push({
                                "id": MinuteString,
                                "text": MinuteString + "分"
                            });
                        };
                        $.page.idM.selectMinute.setData(dataMinute);
                    };
                },
                bindSecond: function (idM) {
                    if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
                        var dataSecond = [];
                        for (var i = 0; i < 60; i++) {
                            var SecondString = i < 10 ? ("0" + i) : i;
                            dataSecond.push({
                                "id": SecondString,
                                "text": SecondString + "秒"
                            });
                        };
                        $.page.idM.selectSecond.setData(dataSecond);
                    };
                }
            }
        },
        fwString: {
            FWStringHelper: {
                empty: "",
                toString: function (_String) {
                    return _String;
                },
                toBoolean: function (_String) {
                    _String = fw.fwString.FWStringHelper.trim(_String).toLowerCase();
                    return _String == "true" || _String == "1";
                },
                toNumber: function (_String) {
                    if (!isNaN(_String)) {
                        _String = parseFloat(_String);
                    } else {
                        _String = null;
                    };
                    return _String;
                },
                trim: function (value) {
                    return value.toString().replace(/^\s*|\s$/g, '');
                },
                remove: function (value, startIndex, count) {
                    return value.substring(0, startIndex) + value.substring(startIndex + count, value.length);
                },
                insert: function (value, startIndex, insertValue) {
                    return value.substring(0, startIndex) + insertValue + value.substring(startIndex, value.length);
                },
                getBase64Bytes: function (value) {
                    value = fw.fwString.FWStringHelper.toBase64String(value);
                    var array = new Array();
                    for (var i = 0; i < value.length; i++) {
                        array.push(value.charCodeAt(i));
                    };
                    return array;
                },
                replaceAll: function (value, StringReplace, StringReplaceTo) {
                    /// <summary>
                    ///     替换字符串中所有需要替换的字符串
                    ///      1: " 字符串 ".Trim() 结果为 "字符串"
                    /// </summary>
                    /// <param name="StringReplace" type="string">
                    ///     想要替换的字符串
                    /// </param>
                    /// <param name="StringReplaceTo" type="string">
                    ///     用于替换的字符串
                    /// </param>
                    ///	<returns type="string"></returns>
                    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
                        var _RegExp = new RegExp(StringReplace.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
                        value = value.replace(_RegExp, StringReplaceTo);
                    };
                    return value;
                },
                toDateTime: function (value) {
                    /// <summary>
                    ///     1: ("2008-08-08 08:08:08").ToDate() - 字符转化为日期型。
                    /// </summary>
                    ///	<returns type="date" />
                    var DateString = fw.fwString.FWStringHelper.trim(value.toString());

                    if (DateString.indexOf("/Date(") == 0 && DateString.lastIndexOf(")/") == DateString.length - 2) {
                        return eval('new ' + DateString.replace(/\//g, ''));
                    };

                    DateString = fw.fwString.FWStringHelper.replaceAll(DateString, "T", " ");
                    var Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
                    if (Results && Results.length > 3) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]));
                    };
                    Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
                    if (Results && Results.length > 6) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]));
                    };
                    Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
                    if (Results && Results.length > 7) {
                        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]), parseFloat(Results[7]));
                    };
                    return "";
                },
                toArray: function (value, separator) {
                    return value.split(separator);
                },
                serializeWindowName: function (value) {
                    return fw.fwString.FWStringHelper.replaceAll(value, "$", "_");
                    //return encodeURI(value);
                },
                deserializeWindowName: function (value) {
                    return fw.fwUrl.FWUrlHelper.encode(value);
                },
                toHtml: function (value, symbolArray) {
                    var replaceArray = [
						["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ["\"", "&quot;"], ["'", "&apos;"], [" ", "&nbsp;"]
					];
                    var symbolDictionary = {};
                    for (var i = 0; i < replaceArray.length; i++) {
                        symbolDictionary[replaceArray[i][0]] = replaceArray[i][1];
                    };
                    replaceArray = fw.fwObject.FWObjectHelper.toArray(symbolArray, ",");
                    for (var i = 0; i < replaceArray.length; i++) {
                        value = fw.fwString.FWStringHelper.replaceAll(value, replaceArray[i], symbolDictionary[replaceArray[i]]);
                    };
                    return value;
                },
                _base64encode: function (str) {
                    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                    var out;
                    var i;
                    var len;
                    var c1;
                    var c2;
                    var c3;
                    len = str.length;
                    i = 0;
                    out = "";
                    while (i < len) {
                        c1 = str.charCodeAt(i++) & 0xff;
                        if (i == len) {
                            out += base64EncodeChars.charAt(c1 >> 2);
                            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                            out += "==";
                            break;
                        };
                        c2 = str.charCodeAt(i++);
                        if (i == len) {
                            out += base64EncodeChars.charAt(c1 >> 2);
                            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                            out += "=";
                            break;
                        };
                        c3 = str.charCodeAt(i++);
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                        out += base64EncodeChars.charAt(c3 & 0x3F);
                    };
                    return out;
                },
                _base64decode: function (str) {
                    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
                    var c1;
                    var c2;
                    var c3;
                    var c4;
                    var i;
                    var len;
                    var out;
                    len = str.length;
                    i = 0;
                    out = "";
                    while (i < len) {
                        /* c1 */
                        do {
                            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                        } while (i < len && c1 == -1);
                        if (c1 == -1) {
                            break;
                        };
                        /* c2 */
                        do {
                            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                        } while (i < len && c2 == -1);
                        if (c2 == -1) {
                            break;
                        };
                        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                        /* c3 */
                        do {
                            c3 = str.charCodeAt(i++) & 0xff;
                            if (c3 == 61) {
                                return out;
                            };
                            c3 = base64DecodeChars[c3];
                        } while (i < len && c3 == -1);
                        if (c3 == -1) {
                            break;
                        };
                        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                        /* c4 */
                        do {
                            c4 = str.charCodeAt(i++) & 0xff;
                            if (c4 == 61) {
                                return out;
                            };
                            c4 = base64DecodeChars[c4];
                        } while (i < len && c4 == -1);
                        if (c4 == -1) {
                            break;
                        };
                        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
                    };
                    return out;
                },
                _utf16to8: function (str) {
                    var out;
                    var i;
                    var len;
                    var c;
                    out = "";
                    len = str.length;
                    for (i = 0; i < len; i++) {
                        c = str.charCodeAt(i);
                        if ((c >= 0x0001) && (c <= 0x007F)) {
                            out += str.charAt(i);
                        } else {
                            if (c > 0x07FF) {
                                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                            } else {
                                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                            };
                        };
                    };
                    return out;
                },
                _utf8to16: function (str) {
                    var out;
                    var i;
                    var len;
                    var c;
                    var char2;
                    var char3;
                    out = "";
                    len = str.length;
                    i = 0;
                    while (i < len) {
                        c = str.charCodeAt(i++);
                        switch (c >> 4) {
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                                // 0xxxxxxx
                                out += str.charAt(i - 1);
                                break;
                            case 12:
                            case 13:
                                // 110x xxxx 10xx xxxx
                                char2 = str.charCodeAt(i++);
                                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                                break;
                            case 14:
                                // 1110 xxxx10xx xxxx10xx xxxx
                                char2 = str.charCodeAt(i++);
                                char3 = str.charCodeAt(i++);
                                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                                break;
                        };
                    };
                    return out;
                },
                toBase64String: function (str) {
                    if (fw.fwObject.FWObjectHelper.hasValue(str)) {
                        return fw.fwString.FWStringHelper._base64encode(fw.fwString.FWStringHelper._utf16to8(str));
                    }
                    return str;
                },
                formBase64String: function (str) {
                    if (fw.fwObject.FWObjectHelper.hasValue(str)) {
                        return fw.fwString.FWStringHelper._utf8to16(fw.fwString.FWStringHelper._base64decode(str));
                    }
                    return str;
                }
            }
        },
        fwUrl: {
            FWUrlHelper: {
                parser: function (Url) {
                    var UrlInfo = null;
                    if (Url != undefined && Url != null) {
                        var Regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
                        var RegexArray = Regex.exec(Url);
                        if (RegexArray != undefined && RegexArray != null && RegexArray.length) {
                            UrlInfo = {};
                            var FieldChineseNameArray = ["地址", "", "协议", "", "用户名", "密码", "主机", "端口", "路径", "查询字符串", "锚点"];
                            var FieldNameArray = ["Url", "", "ProtocolName", "UsernamePassword", "Username", "Password", "Hostname", "Port", "Pathname", "QueryString", "Fragment"];
                            for (var i = 0; i < RegexArray.length; i++) {
                                UrlInfo[FieldNameArray[i]] = RegexArray[i];
                            };
                            if (UrlInfo.UsernamePassword == undefined || UrlInfo.UsernamePassword == null) {
                                UrlInfo.UsernamePassword = "";
                            };
                            UrlInfo.Protocol = UrlInfo.ProtocolName + ":";
                            UrlInfo.Host = UrlInfo.Hostname + ":" + UrlInfo.Port;
                            UrlInfo.Hash = "#" + UrlInfo.Fragment;
                            UrlInfo.Search = "?" + UrlInfo.QueryString;
                        };
                    };
                    return UrlInfo;
                },
                getDomain: function (value) {
                    if (value.indexOf("file:///") == 0) {
                        return "file:///";
                    } else {
                        var reg = new RegExp("^((http|https)://[^/]+).([/])");
                        return value.match(reg)[0];
                    };
                },
                encode: function (value) {
                    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
                        value = fw.fwString.FWStringHelper.replaceAll(encodeURIComponent(value), "%3D", "%3d");
                    };
                    return value;
                },
                decode: function (value) {
                    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
                        value = decodeURIComponent(value);
                    };
                    return value;
                },
                getParams: function (url, c, decryptKey) {
                    if (!url) {
                        url = location.href;
                    };
                    if (!c) {
                        c = "?";
                    };
                    if (url.indexOf(c) == -1) {
                        url = url.split(c)[0];
                    } else {
                        url = url.split(c)[1];
                    };
                    var params = {};
                    if (url) {
                        if (url.toLowerCase().indexOf("isParamsEncrypt".toLowerCase()) > -1) {
                            isDecrypt = false;
                        };
                        var us = url.split("&");
                        for (var i = 0, l = us.length; i < l; i++) {
                            var ps = us[i].split("=");
                            params[fw.fwSafe.FWSafeHelper.decrypt(fw.fwUrl.FWUrlHelper.decode(ps[0]), decryptKey)] = fw.fwSafe.FWSafeHelper.decrypt(fw.fwUrl.FWUrlHelper.decode(ps[1]), decryptKey);
                        };
                    };
                    return params;
                },
                param: function (data, encryptKey) {
                    var resultData = {};
                    var objValue;
                    for (var i in data) {
                        objValue = data[i];
                        if (!fw.fwObject.FWObjectHelper.hasValue(objValue)) {
                            objValue = fw.fwString.FWStringHelper.empty;
                        } else {
                            if (fw.fwObject.FWObjectHelper.isString(objValue)) {
                            } else {
                                objValue = fw.fwJson.FWJsonHelper.serializeObject(objValue);
                            };
                        };
                        resultData[fw.fwSafe.FWSafeHelper.encrypt(i, encryptKey)] = fw.fwSafe.FWSafeHelper.encrypt(objValue, encryptKey);
                    };
                    return $.param(resultData);
                },
                addParams: function (url, data, c, encryptKey) {
                    if (!url) {
                        url = location.href;
                    };
                    if (!c) {
                        c = "?";
                    };
                    var us = url.split(c);
                    var url = us[0];
                    var paramsString = us[1];
                    var params = {};
                    if (paramsString) {
                        var pss = paramsString.split("&");
                        for (var i = 0, l = pss.length; i < l; i++) {
                            var ps = pss[i].split("=");
                            params[fw.fwSafe.FWSafeHelper.decrypt(fw.fwUrl.FWUrlHelper.decode(ps[0]), encryptKey)] = fw.fwSafe.FWSafeHelper.decrypt(fw.fwUrl.FWUrlHelper.decode(ps[1]), encryptKey);
                        };
                    };
                    for (var i in data) {
                        params[i] = data[i];
                    };
                    return url + c + fw.fwUrl.FWUrlHelper.param(params, encryptKey);
                },
                getAbsoluteUrl: function (url, webSiteRootUrl) {
                    if (url != undefined && url != null) {
                        if (url.toString().toLowerCase().indexOf("http://") > -1 || url.toString().toLowerCase().indexOf("https://") > -1) { }
                        else {
                            url = webSiteRootUrl + url;
                        };
                    };
                    return url;
                }
            }
        },
        callFunction: function (_window, _method, _args) {
            var _function = null;
            if (fw.fwObject.FWObjectHelper.hasValue(_window)) {
                if (fw.fwObject.FWObjectHelper.hasValue(_method)) {
                    _function = _window;
                    if (_method.indexOf(".") > -1) {
                        var mArray = _method.split(".");
                        var m = null;
                        for (var i = 0; i < mArray.length; i++) {
                            m = mArray[i];
                            if (fw.fwObject.FWObjectHelper.hasValue(_function) && fw.fwObject.FWObjectHelper.hasValue(m)) {
                                _function = _function[m];
                            } else {
                                _function = null;
                                break;
                            };
                        };
                    } else {
                        _function = _function[_method];
                    };
                };
            };
            if ($.isFunction(_function)) {
                _function.apply(null, _args);
            } else {
                alert("调用的方法不存在！");
            };
        },
        isWindow: function (_window) {
            return _window == _window.window && _window.parent == _window.window.parent;
        },
        openWindow: function (_window) {
            if (_window == undefined) {
                _window = window;
            };
            if (_window.Owner) {
                return _window.Owner;
            };
            if (_window.parent != _window) {
                return _window.parent;
            };
            if (_window.opener == _window) {
                return _window.opener;
            };
        },
        topWindow: function (_window) {
            var topWindow = _window;
            if (_window.parent != _window) {
                do {
                    topWindow = topWindow.parent
                } while (topWindow.parent != topWindow);
            };
            if (_window.opener == _window) {
                do {
                    topWindow = topWindow.opener
                } while (topWindow.opener != topWindow);
            };
            return topWindow;
        },
        closeWindow: function (action, _window) {
            if (_window == undefined) {
                _window = window;
            };
            if (_window.CloseOwnerWindow) {
                return _window.CloseOwnerWindow(action);
            } else {
                _window.close();
            };
        },
        openIframe: function (_window) {
            if (_window == undefined) {
                _window = window;
            };
            var _openIframe;
            for (var i = 0; i < _window.parent.frames.length; i++) {
                if (_window.parent.frames[i].window == _window) {
                    _openIframe = _window.parent.frames[i];
                    break;
                };
            };
            return _openIframe;
        },
        clientWidth: function () {
            /// <summary>
            ///     1: fw.clientWidth() - 页面可见范围宽度。
            /// </summary>
            /// <returns type="Int"）</returns>
            return parseInt(document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth);
        },
        clientHeight: function () {
            /// <summary>
            ///     1: fw.clientHeight() - 页面可见范围高度。
            /// </summary>
            /// <returns type="Int"）</returns>
            return parseInt(document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight);
        },
        scrollLeft: function (selector, scrollLeft) {
            /// <summary>
            ///     1: fw.scrollLeft(scrollLeft) - 页面 x轴 滚动条高度。
            /// </summary>
            /// <param name="scrollLeft" type="Int">
            ///      1: scrollLeft - 需要设置的 x轴 滚动条高度。
            /// </param>
            /// <returns type="Int"）</returns>
            if (fw.isWindow(selector)) {
                if (selector.document.compatMode == "CSS1Compat") {
                    selector.document.documentElement.scrollLeft = scrollLeft;
                    return selector.document.documentElement.scrollLeft;
                } else {
                    selector.document.body.scrollLeft = scrollLeft;
                    return selector.document.body.scrollLeft;
                };
            } else {
                var selectorJQ = $(selector);
                if (scrollLeft != undefined) {
                    selectorJQ.scrollLeft(scrollLeft);
                };
                return selectorJQ.scrollLeft();
            };
        },
        scrollWidth: function (selector) {
            /// <summary>
            ///     1: fw.scrollWidth(ScrollLeft) - 页面 x轴 滚动条高度。
            /// </summary>
            /// <param name="ScrollLeft" type="Int">
            ///      1: ScrollLeft - 需要设置的 x轴 滚动条高度。
            /// </param>
            /// <returns type="Int"）</returns>
            if (fw.isWindow(selector)) {
                return parseInt(selector.document.compatMode == "CSS1Compat" ? selector.document.documentElement.scrollWidth : selector.document.body.scrollWidth);
            } else {
                return $(selector)[0].scrollWidth;
            };
        },
        scrollTop: function (selector, scrollTop) {
            /// <summary>
            ///     1: fw.scrollTop(scrollTop) - 页面 x轴 滚动条高度。
            /// </summary>
            /// <param name="ScrollLeft" type="Int">
            ///      1: ScrollLeft - 需要设置的 y轴 滚动条高度。
            /// </param>
            /// <returns type="Int"）</returns>
            if (fw.isWindow(selector)) {
                if (selector.document.compatMode == "CSS1Compat") {
                    selector.document.documentElement.scrollTop = scrollTop;
                    return selector.document.documentElement.scrollTop;
                } else {
                    selector.document.body.scrollTop = scrollTop;
                    return selector.document.body.scrollTop;
                };
            } else {
                var selectorJQ = $(selector);
                if (scrollTop != undefined) {
                    selectorJQ.scrollTop(scrollTop);
                };
                return selectorJQ.scrollTop();
            };
        },
        scrollHeight: function (selector) {
            /// <summary>
            ///     1: fw.scrollHeight(ScrollLeft) - 页面 x轴 滚动条高度。
            /// </summary>
            /// <param name="ScrollLeft" type="Int">
            ///      1: ScrollLeft - 需要设置的 x轴 滚动条高度。
            /// </param>
            /// <returns type="Int"）</returns>
            var _scrollHeight;
            if (fw.isWindow(selector)) {
                _scrollHeight = parseInt(selector.document.compatMode == "CSS1Compat" ? selector.document.documentElement.scrollHeight : selector.document.body.scrollHeight);
            } else {
                _scrollHeight = $(selector)[0].scrollHeight;
            };
            return _scrollHeight;
        },
        adaptContentHeight: function (selector) {
            var selectorJQ = $(selector);
            if (selectorJQ.length > 0) {
                var thisJS = selectorJQ[0];
                if (thisJS.tagName == "IFRAME") {
                    var selectorHeight = selectorJQ.height();
                    var contentWindowScrollHeight = fw.scrollHeight(thisJS.contentWindow);
                    if (Math.abs(selectorHeight - contentWindowScrollHeight - 8) > 24) {
                        selectorJQ.height(contentWindowScrollHeight + 8);
                    };
                    //thisJS.contentWindow.fw.openIframe().frameElement.height = fw.scrollHeight(thisJS.contentWindow);
                };
            };
        }
    };

    _fw = window.fw = fw;

})(window);
