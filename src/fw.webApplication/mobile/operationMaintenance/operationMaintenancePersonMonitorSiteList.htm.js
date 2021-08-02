
var statusDictionary = {};

var longitude = null;
var latitude = null;

//页面初始化
$.page.pageInit = function () {
    $.page.idJQ.searchOrder = $(".searchOrder");

    $.page.idJQ.selectStatus.parent().hide();
    $.page.idJQ.searchOrder.hide();
};

/* 页面加载 */
$.page.pageLoad = function () {
    var hHeaderTitle = "";
    switch ($.page.params.taskStatus) {
        case "2":
            hHeaderTitle = "待运维点";
            $.page.idJQ.selectStatus.parent().hide();
            $.page.idJQ.searchOrder.show();
            break;
        default:
            hHeaderTitle = "我的运维点";
            $.page.idJQ.selectStatus.parent().show();
            $.page.idJQ.searchOrder.hide();
            //$.page.idJQ.aStatus.show();
            break;
    };
    $.page.idJQ.hHeaderTitle.html(hHeaderTitle);

    $.page.idJQ.divHeader.toolbar();
    $.page.idJQ.ulListView.listview();

    $.page.idJQ.aCantonSelect.bind("click", function () {
        if ($.page.idJQ.aCantonSelect.data("defaultHtml") == undefined) {
            $.page.idJQ.aCantonSelect.data("defaultHtml", $.page.idJQ.aCantonSelect.html());
        };
        var selectCantonList = $(this).data("selectCantonList");
        $.page.cantonSelect({
            selectCantonList: selectCantonList
            , backCallback: function () {
                $.mobile.changePage("#divPage", "slideup");
            }
            , clearCallback: function () {
                $.page.idJQ.aCantonSelect.removeData("selectCantonList");
                $.page.idJQ.aCantonSelect.html($.page.idJQ.aCantonSelect.data("defaultHtml"));
                onSearch();
            }
            , selectCallback: function (selectCantonList) {
                $.page.idJQ.aCantonSelect.data("selectCantonList", selectCantonList);
                if (fw.fwObject.FWObjectHelper.hasValue(selectCantonList)) {
                    $.page.idJQ.aCantonSelect.html(selectCantonList[selectCantonList.length - 1].name);
                } else {
                    $.page.idJQ.aCantonSelect.html($.page.idJQ.aCantonSelect.data("defaultHtml"));
                };
                onSearch();
            }
        });
    });

    $.page.idJQ.selectStatus.bind("change", function () {
        onSearch();
    });

    $("input[type='radio']", $.page.idJQ.radioSearchType).bind("click", function () {
        onSearch();
    });

    onSearch();
};

function onSearch() {
    //alert("ss");
    fw.fwShell.FWShellHelper.BaiDuLocationHelper.getCurrentPosition({
        success: function (result) {
            //alert("获取经纬度成功！");
            //alert(fw.fwJson.FWJsonHelper.serializeObject(result));
            longitude = result.coords.longitude;
            latitude = result.coords.latitude;
            datagrid1_Load(0);
        }
        , error: function () {
            //alert("获取经纬度失败！");
            //            $("input[type='radio']", $.page.idJQ.radioSearchType).val("time").checkboxradio("refresh");
            datagrid1_Load(0);
        }
        , opinion: {
            timeout: 2 * 1000
        }
    });
};

//datagrID数据加载
function datagrid1_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrID的页数
        pageIndex = datagrid1JQ.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrID的分页大小
        pageSize = 10;
    };
    var searchType = $("input[type='radio']:checked", $.page.idJQ.radioSearchType).val();
    //alert(searchType);
    //排序字段
    var sortFieldList = null;
    switch (searchType) {
        case "distance":
            sortFieldList = [{
                fieldName: "distance"
                , sortType: fw.fwData.FWSortType.Asc
            }];
            break;
        default:
            switch ($.page.params.taskStatus) {
                case "2":
                    sortFieldList = [{
                        fieldName: "prescribeRepairTime"
                        , sortType: fw.fwData.FWSortType.Asc
                    }];
                    break;
                default:
                    sortFieldList = null;
                    break;
            };
            break;
    };

    var conditionData = {
        taskStatus: $.page.params.taskStatus
        , longitude: longitude
        , latitude: latitude
    };

    var selectCantonList = $.page.idJQ.aCantonSelect.data("selectCantonList");
    if (fw.fwObject.FWObjectHelper.hasValue(selectCantonList)) {
        conditionData.cantonCode = selectCantonList[selectCantonList.length - 1].code;
    };

    //    var status = $.page.idJQ.aStatus.data("status");
    //    if (fw.fwObject.FWObjectHelper.hasValue(status)) {
    //        conditionData.statusCode = status.statusCode;
    //    };
    conditionData.statusCode = $.page.idJQ.selectStatus.val();

//    conditionData.longitude = 120;
//    conditionData.latitude = 30;

    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: $.page.params.taskStatus == "2" ? "operationMaintenance" : "autoMonitor"
        , methodName: $.page.params.taskStatus == "2" ? "queryPageMaintenanceTask" : "queryAutoMonitorStatics"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , queryParams: conditionData
        }
        , beforeSend: function () {
            $.mobile.loading('show');
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {

                switch ($.page.params.taskStatus) {
                    case "2":
                        if (resultData.data.pageIndex == 1) {
                            $.page.idJQ.ulListView.empty();
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.entityList)) {
                            var entityList = resultData.data.entityList;
                            var entity = null;
                            for (var i = 0; i < entityList.length; i++) {
                                entity = entityList[i];
                                var data = {
                                    ticket: $.page.ticket
                                    , referrerURL: window.location.href
                                    , monitorSiteCode: entity.monitorSiteCode
                                };
                                var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/basicInfo/monitorSite.htm", $.page.webSiteRootUrl), data);
                                var html = '';
                                html += '<li>';
                                html += '    <a href="' + url + '" data-ajax="false">'
                                html += '        <h3>' + entity.monitorSiteName + '</h3>';
                                if (fw.fwObject.FWObjectHelper.hasValue(entity.prescribeRepairTime)) {
                                    html += '<p>规定时间：' + fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.prescribeRepairTime), "MM-dd HH:mm:ss") + '</p>';
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(entity.distance)) {
                                    html += '<p class="ui-li-aside" style="top:3.5em;">' + fw.fwNumber.FWNumberHelper.toDistance(entity.distance) + '</p>';
                                };
                                html += '    </a>';
                                html += '</li>';
                                $(html).appendTo($.page.idJQ.ulListView);
                            };
                            if (resultData.data.pageSize * resultData.data.pageIndex < resultData.data.recordCount) {
                                $('<a class="ui-btn loadMore">加载更多</a>').appendTo($.page.idJQ.ulListView).bind("click", function () {
                                    $(this).remove();
                                    datagrid1_Load(resultData.data.pageIndex + 1, resultData.data.pageSize);
                                });
                            };
                            $.page.idJQ.ulListView.listview("refresh");
                        };
                        break;
                    default:
                        //if (!$.page.idJQ.ulStatusList.data("isLoaded") && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                        if (!$.page.idJQ.selectStatus.data("isLoaded") && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                            //$(">li:gt(0)", $.page.idJQ.ulStatusList).remove();
                            $.page.idJQ.selectStatus.empty();
                            var entityList = resultData.data;
                            var entity = null;
                            for (var i = 0; i < entityList.length; i++) {
                                entity = entityList[i];
                                statusDictionary[entity.statusCode] = (i == 0 ? "状态" : entity.statusName);
                                $('<option value="' + entity.statusCode + '">' + statusDictionary[entity.statusCode] + '</option>').appendTo($.page.idJQ.selectStatus);
                                //                                $('<li><a href="#">' + entity.statusName + '</a></li>').data("entity", entity).appendTo($.page.idJQ.ulStatusList).bind("click", function () {
                                //                                    entity = $(this).data("entity");
                                //                                    $.page.idJQ.aStatus.data("status", entity);
                                //                                    //$.mobile.changePage("#", "slideup");
                                //                                    onSearch();
                                //                                });
                            };
                            //$.page.idJQ.ulStatusList.data("isLoaded", true).listview("refresh");
                            $.page.idJQ.selectStatus.data("isLoaded", true).selectmenu("refresh", true);
                        };
                        resultData.data.pageIndex = pageIndex > 0 ? pageIndex : 1;
                        resultData.data.pageSize = pageSize;
                        resultData.data.recordCount = resultData.data[0].recordCount;
                        resultData.data.entityList = fw.fwObject.FWObjectHelper.hasValue(resultData.data[0].monitorSiteLatestDataList != null && resultData.data[0].monitorSiteLatestDataList.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data[0].monitorSiteLatestDataList) : resultData.data[0].monitorSiteLatestDataList;
                        if (resultData.data.pageIndex == 1) {
                            $.page.idJQ.ulListView.empty();
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.entityList)) {
                            var entityList = resultData.data.entityList;
                            var entity = null;
                            for (var i = 0; i < entityList.length; i++) {
                                entity = entityList[i];
                                var data = {
                                    ticket: $.page.ticket
                                    , referrerURL: window.location.href
                                    , monitorSiteCode: entity.monitorSiteCode
                                };
                                var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/basicInfo/monitorSite.htm", $.page.webSiteRootUrl), data);
                                var html = '';
                                html += '<li>';
                                html += '    <a href="' + url + '" data-ajax="false">';
                                html += '        <h3>' + entity.monitorSiteName + '</h3>';
                                html += '<p>状态：' + statusDictionary[entity.statusCode] + '</p>';
                                if (fw.fwObject.FWObjectHelper.hasValue(entity.distance)) {
                                    html += '<p class="ui-li-aside" style="top:3.5em;">' + fw.fwNumber.FWNumberHelper.toDistance(entity.distance) + '</p>';
                                };
                                html += '    </a>';
                                html += '</li>';
                                $(html).appendTo($.page.idJQ.ulListView);
                            };
                            if (resultData.data.pageSize * resultData.data.pageIndex < resultData.data.recordCount) {
                                $('<a class="ui-btn loadMore">加载更多</a>').appendTo($.page.idJQ.ulListView).bind("click", function () {
                                    $(this).remove();
                                    datagrid1_Load(resultData.data.pageIndex + 1, resultData.data.pageSize);
                                });
                            };
                            $.page.idJQ.ulListView.listview("refresh");
                        };
                        break;
                };

            };
        }
        , complete: function () {
            $.mobile.loading('hide');
        }
    }));
};
