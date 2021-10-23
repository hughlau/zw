$.pageCustomer = {
    publicTicket: null
    , serviceSiteRootUrl: null
    , isParamsEncrypt: false
    , wry2WebSiteRootUrl: "http://192.168.253.31:10031/10088"
    , omWebSiteRootUrl: "http://192.168.253.31:10031/10087"
    , dateDay: "yyyy-MM-dd"
    , dateDayHour: "yyyy-MM-dd"
    , dateDayTime: "yyyy-MM-dd HH:mm:ss"
     /*判断是否有值*/
    , hasValue: function (value) {
        return fw.fwObject.FWObjectHelper.hasValue(value);
    }
    //时间文本格式化
    , DTToString: function (value, format) {
        return fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(value), format);
    }
    , enumOperate: { view: 'view', add: 'add', edit: 'edit', del: "delete", addChild: "addChild" }
    , enumDataSource: { dataInput: 4, dataImport: 3 }
    , enumDataShowType: { GridBind: 1, ChartBind: 2 }
    , hasValue: function (value) {
        return fw.fwObject.FWObjectHelper.hasValue(value);
    }
    , GetParams: function (url, c) {
        if (!url) url = location.href;
        if (!c) c = "?";
        url = url.split(c)[1];
        var params = {};
        if (url) {
            var us = url.split("&");
            for (var i = 0, l = us.length; i < l; i++) {
                var ps = us[i].split("=");
                params[ps[0]] = decodeURIComponent(ps[1]);
            }
        }
        return params;
    }
    , toFixed: function (value, length, mark) {
        /*保留指定位数的小数*/
        var defaults = { mark: $.pageCustomer.mark, fixedLength: $.pageCustomer.fixedLength };
        var options = $.extend(defaults, { fixedLength: length, mark: mark });
        if (fw.fwObject.FWObjectHelper.hasValue(value)) {
            return Number(value).toFixed(options.fixedLength);
        } else {
            return options.mark;
        }


    }
    , labelModel: function (selectorJQ) {
        var fields = selectorJQ.getFields();
        for (var i = 0, l = fields.length; i < l; i++) {
            var c = fields[i];
            if (c.setReadOnly) c.setReadOnly(true);     //只读
            if (c.setIsValid) c.setIsValid(true);       //去除错误提示
            if (c.addCls) c.addCls("asLabel");          //增加asLabel外观
        };
    }
    , inputModel: function (selectorJQ) {
        var fields = selectorJQ.getFields();
        for (var i = 0, l = fields.length; i < l; i++) {
            var c = fields[i];
            if (c.setReadOnly) c.setReadOnly(false);
            if (c.removeCls) c.removeCls("asLabel");
        }
        mini.repaint(document.body);
    }
     
    , ClearControl: function (Class, RangeSelector) {
        var RangeSelectorJQ;
        if (RangeSelector == undefined) {
            RangeSelectorJQ = $("*");
        } else {
            RangeSelectorJQ = $(RangeSelector);
        };
        $("*[jsondata^='{Class:\'" + Class + "\'']", RangeSelectorJQ).each(function () {
            switch (this.tagName) {
                case "SELECT":
                    $(this).replaceWith($('option:selected', this).html());
                    break;
            };
        });
    }
    //#region JsonData
    , GetJsonData: function (Class, RangeSelector) {
        /*获取对象，class==对象名称  RangeSelector==选择器范围*/
        var RangeSelectorJQ;
        if (RangeSelector == undefined) {
            RangeSelectorJQ = $("*");
        } else {
            RangeSelectorJQ = $(RangeSelector);
        };
        var JsonData = new Object();
        $("*[jsondata^='" + Class + "']", RangeSelectorJQ).each(function () {
            var JQ = $(this);
            var JsonDataSettings;
            eval("JsonDataSettings=" + JQ.attr('jsondata'));
            var ValueString;
            if ('/TD/DIV/SPAN/LABLE/'.indexOf(this.tagName) > -1) {
                ValueString = JQ.html();
            } else if (this.tagName.toLowerCase() == "input" && JQ.is(":checkbox")) {
                ValueString = JQ.is(":checked");
            } else if (this.tagName.toLowerCase() == "textarea") {
                ValueString = JQ.val().replace(/\n|\r/g, " ").replace(/\s/g, " ");
            } else {
                ValueString = JQ.val();
            };

            ValueString = ValueString != null ? ValueString : '';
            if (JsonDataSettings.Type != undefined) {
                switch (JsonDataSettings.Type) {
                    case "DateTime":
                        /*转格式*/
                        ValueString = ValueString.ToDate().ToString("UTCDateTime");
                        break;
                    case "Boolean":
                        ValueString = (ValueString ? 1 : 0);
                        break;
                };
            }

            if (JsonDataSettings.TypeFunction != undefined && $.isFunction(JsonDataSettings.TypeFunction)) {
                ValueString = JsonDataSettings.TypeFunction(ValueString);
            };

            if (JsonDataSettings.IsEmptyToNull != undefined && (JsonDataSettings.IsEmptyToNull || JsonDataSettings.IsEmptyToNull.toLowerCase() == "true" || JsonDataSettings.IsEmptyToNull == "1")) {
                if (!$.pageCustomer.hasValue(ValueString)) {
                    ValueString = undefined;
                };
            };
            if (JsonDataSettings.Property.indexOf('.') == -1) {
                // 取得简单对象
                JsonData[JsonDataSettings.Property] = ValueString;
            } else {
                // 取得复杂对象
                var createtProperty = function (obj, prop) {
                    var iFirstPropIdx = prop.indexOf('.');
                    var sPropName = iFirstPropIdx > -1 ? prop.substring(0, iFirstPropIdx) : prop;
                    obj[sPropName] = obj[sPropName] || {};
                    // 继续向深取得对象
                    if (iFirstPropIdx > -1) createtProperty(obj[sPropName], prop.substr(iFirstPropIdx + 1));
                };
                createtProperty(JsonData, JsonDataSettings.Property);

                eval('JsonData.' + JsonDataSettings.Property + '=ValueString');
            }
        });
        return JsonData;
    }
    , SetJsonData: function (Class, JsonData, RangeSelector, IsEnumSwitch, ParentProperty) {
        /*对象给表单赋值，calss=对象名 JsonData=数据源 RangeSelector选择器 IsEnumSwitch  ParentProperty=赋值属性*/
        var RangeSelectorJQ;
        // 复杂对象迭代开关，默认不迭代复杂对象
        IsEnumSwitch = IsEnumSwitch || false;
        if (RangeSelector == undefined) {
            RangeSelectorJQ = $("*");
        } else {
            RangeSelectorJQ = $(RangeSelector);
        };
        if (!ParentProperty) {// 非迭代情况下清除数据
            $.pageCustomer.ClearJsonData(Class, RangeSelectorJQ);
            ParentProperty = '';
        } else {// 迭代中，加工父属性
            ParentProperty += '.';
        }

        for (var Object in JsonData) {
            // 如果为复杂对象，迭代嵌套
            if (IsEnumSwitch && JsonData[Object] != null && typeof (JsonData[Object]) == "object") {
                this.SetJsonData(Class, JsonData[Object], RangeSelector, IsEnumSwitch, Object);
                continue;
            }
            // 简单对象，进行赋值
            $("*[jsondata^='{Class:\'" + Class + "\',Property:\'" + ParentProperty + Object + "\'']", RangeSelectorJQ).each(function () {
                var JQ = $(this);
                var JsonDataSettings;
                eval("JsonDataSettings=" + JQ.attr('jsondata'));
                var ValueString = JsonData[Object] != null ? JsonData[Object] : '';
                if (JsonDataSettings.Type != undefined) {
                    switch (JsonDataSettings.Type) {
                        case "DateTime":
                            JsonDataSettings.FormatString = JsonDataSettings.FormatString != undefined ? JsonDataSettings.FormatString : "yyyy-MM-dd HH:mm:ss";
                            //ValueString = ValueString.ToDate().ToString(JsonDataSettings.FormatString);
                            ValueString = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(ValueString), JsonDataSettings.FormatString);
                            break;
                        case "Boolean":
                            ValueString = (ValueString == "1" || ValueString.toLowerCase == "true") ? "是" : "否";
                            break;
                    };
                } else if (JsonDataSettings.Convert != undefined && $.isFunction(JsonDataSettings.Convert)) {
                    ValueString = JsonDataSettings.Convert(ValueString);
                };
                if ('/TD/DIV/SPAN/LABLE/'.indexOf(this.tagName) > -1) {
                    switch (JsonDataSettings.Type) {
                        case "Url":
                            ValueString = "<a href=\"" + ValueString + "\" target=\"_blank\">" + ValueString + "</a>";
                            break;
                    };
                    JQ.html(ValueString);
                }
                //                else if (this.tagName == "IMG") {
                //                    /*改造下，把我们加密放在后面*/
                //                    JQ.attr("src", $.Page.webSiteRootUrl + ValueString);
                //                } 
                else if (this.tagName.toLowerCase() == "input" && JQ.is(":checkbox")) {
                    if (ValueString == "是" || ValueString.toString() == "1") {
                        JQ.attr("checked", "checked");
                    } else {
                        JQ.removeAttr("checked");
                    };
                } else {
                    JQ.val($.trim(ValueString));
                };
            });
        };
    }
    , ClearJsonData: function (Class, RangeSelector) {
        var RangeSelectorJQ;
        if (RangeSelector == undefined) {
            RangeSelectorJQ = $("*");
        } else {
            RangeSelectorJQ = $(RangeSelector);
        };
        $("*[jsondata^='" + Class + "']", RangeSelectorJQ).each(function () {
            if ('/TD/DIV/SPAN/LABLE/'.indexOf(this.tagName) > -1) {
                $(this).html('&nbsp;');
            } else {
                $(this).val('');
            };
            /*清除验证的错误提示*/
            $(this).removeClass('FormValidateWrong');
        });
    }
    //#endregion
    , miniOpen1: function (data, pageParam, callBack) {
        data = $.extend({ ticket: $.page.ticket }, data);
        if (fw.fwObject.FWObjectHelper.hasValue(pageParam.url)) {
            pageParam.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParam.url, $.page.webSiteRootUrl), data);
            var openSettings = {
                url: pageParam.url,
                title: fw.fwObject.FWObjectHelper.hasValue(pageParam.title) ? pageParam.title : "新窗口",
                showMaxButton: fw.fwObject.FWObjectHelper.hasValue(pageParam.showMaxButton) ? pageParam.showMaxButton : false,
                showMinButton: fw.fwObject.FWObjectHelper.hasValue(pageParam.showMinButton) ? pageParam.showMinButton : false,
                allowResize: fw.fwObject.FWObjectHelper.hasValue(pageParam.allowResize) ? pageParam.allowResize : true,
                width: fw.fwObject.FWObjectHelper.hasValue(pageParam.width) ? pageParam.width : window.screen.availWidth - 100,
                height: (fw.fwObject.FWObjectHelper.hasValue(pageParam.height) ? pageParam.height : window.screen.availHeight - 150),
                onload: function () {
                },
                ondestroy: function (e) {
                    if ($.isFunction(callBack)) {
                        var iframe = this.getIFrameEl();
                        if (fw.fwObject.FWObjectHelper.hasValue(iframe.contentWindow.callbackData)) {
                            callBack(iframe.contentWindow.callbackData);
                        } else {
                            callBack(e);
                        };
                    };
                }
            };
            //打开窗口
            mini.open(openSettings);
        }

    }
    //增加参数 isEncrypt 报表的参数不需要加密 
    , openPage: function (data, pageParam, callBack) {
        if (fw.fwObject.FWObjectHelper.hasValue(pageParam.url)) {
            if (fw.fwObject.FWObjectHelper.hasValue(data)) {
                pageParam.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParam.url, $.page.webSiteRootUrl), data);
            } else {
                pageParam.url = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParam.url, $.page.webSiteRootUrl);
            }
            //打开窗口
            var openSettings = {
                url: pageParam.url,
                title: fw.fwObject.FWObjectHelper.hasValue(pageParam.title) ? pageParam.title : "新窗口",
                showMaxButton: fw.fwObject.FWObjectHelper.hasValue(pageParam.showMaxButton) ? pageParam.showMaxButton : false,
                showMinButton: fw.fwObject.FWObjectHelper.hasValue(pageParam.showMinButton) ? pageParam.showMinButton : false,
                allowResize: fw.fwObject.FWObjectHelper.hasValue(pageParam.allowResize) ? pageParam.allowResize : true,
                width: fw.fwObject.FWObjectHelper.hasValue(pageParam.width) ? pageParam.width : window.screen.availWidth - 100,
                height: (fw.fwObject.FWObjectHelper.hasValue(pageParam.height) ? pageParam.height : window.screen.availHeight - 150),
                onload: function () {
                },
                ondestroy: function (e) {
                    if ($.isFunction(callBack)) {
                        var iframe = this.getIFrameEl();
                        if (fw.fwObject.FWObjectHelper.hasValue(iframe.contentWindow.callbackData)) {
                            callBack(iframe.contentWindow.callbackData);
                        } else {
                            callBack(e);
                        };
                    };
                }
            };
            //打开窗口
            mini.open(openSettings);
        } else {
            $.page.showTips({ content: "参数pageParam.url不能为空！", state: "danger" });
        };

    }
    , showTips: function (property) {
        var settings = {
            content: "",
            state: "",  //""  success info warning danger
            x: "center",  //left center right 
            y: "top",  //top center bottom 
            timeout: 3000
        };
        $.extend(settings, property || {});
        mini.showTips({
            content: settings.content,
            state: settings.state,
            x: settings.x,
            y: settings.y,
            timeout: settings.timeout
        });
    }
    , isNullOrEmpty: function (data) {
        return !fw.fwObject.FWObjectHelper.hasValue(data);
    } 
    //#region  页面功能方法 1.datagrid  
    //获取选中项对象
    ,getSelectedEntity:function(e) {
        if (!fw.fwObject.FWObjectHelper.hasValue(e))
        {
            return undefined;
        };
        //获取选中项对象
        var entity = e.getSelected();
        //判断对象没有值
        if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
            mini.alert("请选择一项！");
            entity = undefined;
        };
        return entity;
    } 
    //获取选中项对象集合
    ,getSelectedEntityList:function(e) {
        if (!fw.fwObject.FWObjectHelper.hasValue(e))
        {
            return undefined;
        };
        //获取选中项对象集合
        var entityList = e.getSelecteds();
        //判断对象集合没有值
        if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
            mini.alert("请选择需要操作项！");
            entityList = undefined;
        };
        return entityList;
    }
    //获得选中项编码
    ,getSelectedCode:function(e,field) {
        if (!fw.fwObject.FWObjectHelper.hasValue(e)||!fw.fwObject.FWObjectHelper.hasValue(field))
        {
            return undefined;
        };
        var code = undefined;
        //获取选中项对象
        var entity = $.page.getSelectedEntity(e);
        //判断对象有值
        if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
            code = entity[field];
        };
        return code;
    }
    //获得选中项编码集合
    ,getSelectedCodeList:function(e,field) {
        if (!fw.fwObject.FWObjectHelper.hasValue(e)||!fw.fwObject.FWObjectHelper.hasValue(field))
        {
            return undefined;
        };
        var codeList = undefined;
        //获取选中项对象集合
        var entityList = $.page.getSelectedEntityList(e);
        //判断对象集合有值
        if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
            mCodeList = [];
            for (var i = 0; i < entityList.length; i++) {
                mCodeList.push(entityList[i][field]);
            };
        };
        return codeList;
    } 
    //#endregion
    //#region 选择选中项(提供给父页面调用)
    , select:function(e) {
        //判断选择类型以及选择回调方法有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
                //判断是单选
            if ($.page.params.selectType == fw.fwData.FWSelectType.Single) {
                //获取选中项对象
                var entity = $.page.getSelectedEntity(e);
                //判断选中项对象有值
                if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
                    //调用回调方法
                    fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entity]);
                    //关闭窗口
                    fw.closeWindow();
                };
            } else if ($.page.params.selectType == fw.fwData.FWSelectType.Multi) {
                //获取选中项对象集合
                var entityList = getSelectedEntityList(e);
                //判断选中项对象集合有值
                if (fw.fwObject.FWObjectHelper.hasValue(entityList)) {
                    //调用回调方法
                    fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entityList]);
                    //关闭窗口
                    fw.closeWindow();
                };
            };
        };
    }
    , selectClear: function () {
        //判断选择类型以及选择回调方法有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectClearCallback)) {
            //调用选择清除回调方法
            fw.callFunction(fw.openWindow(), $.page.params.selectClearCallback, []);
            //关闭窗口
            fw.closeWindow();
        };
    },
    //#endregion
    /*miniui弹窗*/
    openMiniUIPage: function (pageParam, data, callBack) {
        data = $.extend({ ticket: $.page.ticket }, data);
        if (fw.fwObject.FWObjectHelper.hasValue(pageParam.url)) {
            pageParam.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParam.url, $.page.webSiteRootUrl), data);
            var openSettings = {
                url: pageParam.url,
                title: fw.fwObject.FWObjectHelper.hasValue(pageParam.title) ? pageParam.title : "新窗口",
                showMaxButton: fw.fwObject.FWObjectHelper.hasValue(pageParam.showMaxButton) ? pageParam.showMaxButton : false,
                showMinButton: fw.fwObject.FWObjectHelper.hasValue(pageParam.showMinButton) ? pageParam.showMinButton : false,
                allowResize: fw.fwObject.FWObjectHelper.hasValue(pageParam.allowResize) ? pageParam.allowResize : false,
                width: fw.fwObject.FWObjectHelper.hasValue(pageParam.width) ? pageParam.width : window.screen.availWidth - 100,
                height: (fw.fwObject.FWObjectHelper.hasValue(pageParam.height) ? pageParam.height : window.screen.availHeight - 150),
                onload: function () {

                },
                ondestroy: function (e) {
                    if ($.isFunction(callBack)) {
                        var iframe = this.getIFrameEl();
                        if (fw.fwObject.FWObjectHelper.hasValue(iframe.contentWindow.callbackData)) {
                            callBack(iframe.contentWindow.callbackData);
                        } else {
                            callBack(e);
                        };
                    };
                }
            };

            return mini.open(openSettings);
        }

    }
    /*将miniui表单设置为只读*/
    ,miniFormReadOnly: function (formid) {
        if (formid == null || formid == "") return;
        var form = new mini.Form("#" + formid);
        var fields = form.getFields();
        for (var i = 0, l = fields.length; i < l; i++) {
            var c = fields[i];
            if (c.setEmptyText) c.setEmptyText("");
            if (c.setReadOnly) c.setReadOnly(true);     //只读
            if (c.setIsValid) c.setIsValid(true);      //去除错误提示
            if (c.addCls) c.addCls("asLabel");          //增加asLabel外观
        }
    }
    /*将miniui表单设置为编辑*/
    ,miniFormEdit: function (formid) {
        if (formid == null || formid == "") return;
        var form = new mini.Form("#" + formid);
        var fields = form.getFields();
        for (var i = 0, l = fields.length; i < l; i++) {
            var c = fields[i];
            if (c.setReadOnly) c.setReadOnly(false);
            if (c.removeCls) c.removeCls("asLabel");
        }
        mini.repaint(document.body);
    }

};

$.pageCustomer.publicTicket = "93a35f93-18f4-4e57-88a0-f9011b18c4ca"; //"b5b9c034-baec-4e63-8b99-e9fba54e4006";
//$.pageCustomer.serviceSiteRootUrl = "http://localhost:30011/";
//$.pageCustomer.serviceSiteRootUrl = "http://192.168.252.31:8000/fwSSO/";
$.extend($.page, $.pageCustomer);

//#region sysBasicManage 字典信息
fw.m.sysBasicManage = {
    data: {
        FWDictionaryTypeCode: {
            FWEthnic: "FWEthnic",
            FWGender: "FWGender",
            FWDateType: "FWDateType",
            FWOrganization: "FWOrganization",
            FWCanton: "FWCanton"
        }
        , FWEthnicCode: {
            Han: "01",
            Zhuang: "02",
            Manchu: "03",
            Hui: "04"
        }
        , FWGenderCode: {
            //男
            Male: "01",
            //女
            Female: "02"
        }
        , FWDateTypeCode: {
            //阳历
            Solar: "01",
            //阴历
            Lunar: "02"
        }
        //组织机构
        , FWOrganizationCode: {

        }
        //厂区
        , FWCantonCode: {

        }
        //用户类型
        , FWUserTypeCode: {
            //管理员用户
            Admin: "10",
            //普通用户
            Plain: "11",
            //域用户
            Domain: "mlsctec.com"
        }
    }
};
//#endregion