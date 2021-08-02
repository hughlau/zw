var Page_Delay = 500;
var EnterpriseCode = "";

var MenuData = [
 {
     "ID": 55,
     "mIconUrl": "web/style/maps/images/实时监控.png",
     "IsChecked": 0,
     "mIsDis": 0,
     "mIsHtmlPage": 0,
     "mLayoutBottom": null,
     "mLayoutHeight": 600,
     "mLayoutHorizontalAlignment": 1,
     "mLayoutLeft": null,
     "mLayoutRight": null,
     "mLayoutTop": null,
     "mLayoutVerticalAlignment": 1,
     "mLayoutWidth": 800,
     "mMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771eq77",
     "mMenuName": "实时监控",
     "mMenuTypeCode": "11",
     "Name": null,
     "mOnFocusInScriptCode": function (e) { },
     "mOnFocusOutScriptCode": function (e) {

     },
     "mOpenTypeCode": "10",
     "mPMenuCode": null,
     "mIx": 1,
     "mTitle": "实时监控",
     "mUrl": "",
     "mUrlParamsJson": {
         "参数1": "",
         "参数2": ""
     },
     "mFWMenuList": [{
         "mFWMenuList": [],
         "ID": 59,
         "mIconUrl": null,
         "IsChecked": 0,
         "mIsDis": 0,
         "mIsHtmlPage": 0,
         "mLayoutBottom": null,
         "mLayoutHeight": null,
         "mLayoutHorizontalAlignment": 1,
         "mLayoutLeft": null,
         "mLayoutRight": null,
         "mLayoutTop": null,
         "mLayoutVerticalAlignment": 3,
         "mLayoutWidth": 1024,
         "mMenuCode": "68efe219-da0b-4d32-905d-ba462fbxzdd1",
         "mMenuName": "设施处理",
         "mMenuTypeCode": "11",
         "Name": null,
         "mOnFocusInScriptCode": function () {
             CLSS_Show();
         },
         "mOnFocusOutScriptCode": function (e) {
             CLSS_Hide();
          },
         "mOpenTypeCode": "10",
         "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
         "mIx": 1,
         "mTitle": "设施处理",
         "mUrl": null,
         "mUrlParamsJson": {
             "IsHideLogo": "1",
             "参数2": ""
         }
     }

     , {
         "mFWMenuList": [],
         "ID": 59,
         "mIconUrl": null,
         "IsChecked": 0,
         "mIsDis": 0,
         "mIsHtmlPage": 0,
         "mLayoutBottom": null,
         "mLayoutHeight": null,
         "mLayoutHorizontalAlignment": 1,
         "mLayoutLeft": null,
         "mLayoutRight": null,
         "mLayoutTop": null,
         "mLayoutVerticalAlignment": 3,
         "mLayoutWidth": 1024,
         "mMenuCode": "68efe219-da0b-4d32-905d-ba462fbykyl1",
         "mMenuName": "设施查询",
         "mMenuTypeCode": "11",
         "Name": null,
         "mOnFocusInScriptCode": function () {
             CLSS_Search();
         },
         "mOnFocusOutScriptCode": function (e) {
             CLSS_Search_Hide();
         },
         "mOpenTypeCode": "10",
         "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
         "mIx": 1,
         "mTitle": "设施列表",
         "mUrl": null,
         "mUrlParamsJson": {
             "IsHideLogo": "1",
             "参数2": ""
         }
     }
    ]
 }
   , {
       "ID": 55,
       "mIconUrl": "web/style/maps/images/运维管理.png",
       "IsChecked": 0,
       "mIsDis": 0,
       "mIsHtmlPage": 0,
       "mLayoutBottom": null,
       "mLayoutHeight": 600,
       "mLayoutHorizontalAlignment": 1,
       "mLayoutLeft": null,
       "mLayoutRight": null,
       "mLayoutTop": null,
       "mLayoutVerticalAlignment": 1,
       "mLayoutWidth": 800,
       "mMenuCode": "dsfc37e5-1488-4d2e-af23-49e7a771g177",
       "mMenuName": "运维管理",
       "mMenuTypeCode": "11",
       "Name": null,
       "mOnFocusInScriptCode": function (e) {

       },
       "mOnFocusOutScriptCode": function (e) { },
       "mOpenTypeCode": "10",
       "mPMenuCode": null,
       "mIx": 1,
       "mTitle": "运维管理",
       "mUrl": "",
       "mUrlParamsJson": {
           "参数1": "",
           "参数2": ""
       },
       "mFWMenuList": [{
           "mFWMenuList": [],
           "ID": 59,
           "mIconUrl": null,
           "IsChecked": 0,
           "mIsDis": 0,
           "mIsHtmlPage": 0,
           "mLayoutBottom": null,
           "mLayoutHeight": null,
           "mLayoutHorizontalAlignment": 1,
           "mLayoutLeft": null,
           "mLayoutRight": null,
           "mLayoutTop": null,
           "mLayoutVerticalAlignment": 3,
           "mLayoutWidth": 1024,
           "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone1",
           "mMenuName": "运维合同",
           "mMenuTypeCode": "11",
           "Name": null,
           "mOnFocusInScriptCode": function () {
               mini.open({
                   url: window.webSiteRootUrl + "web/operationMaintenance/OperandMaintenanceProjectList.htm",
                   title: ("运维合同"), width: 1000, height: 500,
                   showMaxButton: true,
                   showModal: false
               });
           },
           "mOnFocusOutScriptCode": function (e) {

           },
           "mOpenTypeCode": "10",
           "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
           "mIx": 1,
           "mTitle": "运维合同",
           "mUrl": null,
           "mUrlParamsJson": {
               "IsHideLogo": "1",
               "参数2": ""
           }
       }, {
           "mFWMenuList": [],
           "ID": 59,
           "mIconUrl": null,
           "IsChecked": 0,
           "mIsDis": 0,
           "mIsHtmlPage": 0,
           "mLayoutBottom": null,
           "mLayoutHeight": null,
           "mLayoutHorizontalAlignment": 1,
           "mLayoutLeft": null,
           "mLayoutRight": null,
           "mLayoutTop": null,
           "mLayoutVerticalAlignment": 3,
           "mLayoutWidth": 1024,
           "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone2",
           "mMenuName": "运维表单",
           "mMenuTypeCode": "11",
           "Name": null,
           "mOnFocusInScriptCode": function () {
               mini.open({
                   url: window.webSiteRootUrl + "web/operationMaintenance/OperationStatistics.htm",
                   title: ("运维表单"), width: 1000, height: 500,
                   showMaxButton: true,
                   showModal: false
               });
           },
           "mOnFocusOutScriptCode": function (e) {

           },
           "mOpenTypeCode": "10",
           "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
           "mIx": 1,
           "mTitle": "运维表单",
           "mUrl": null,
           "mUrlParamsJson": {
               "IsHideLogo": "1",
               "参数2": ""
           }
       }, {
           "mFWMenuList": [],
           "ID": 59,
           "mIconUrl": null,
           "IsChecked": 0,
           "mIsDis": 0,
           "mIsHtmlPage": 0,
           "mLayoutBottom": null,
           "mLayoutHeight": null,
           "mLayoutHorizontalAlignment": 1,
           "mLayoutLeft": null,
           "mLayoutRight": null,
           "mLayoutTop": null,
           "mLayoutVerticalAlignment": 3,
           "mLayoutWidth": 1024,
           "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone3",
           "mMenuName": "运维单位",
           "mMenuTypeCode": "11",
           "Name": null,
           "mOnFocusInScriptCode": function () {
               mini.open({
                   url: window.webSiteRootUrl + "web/operationMaintenance/OperandMaintenanceOrganizationList.htm",
                   title: ("运维单位"), width: 1000, height: 500,
                   showMaxButton: true,
                   showModal: false
               });
           },
           "mOnFocusOutScriptCode": function (e) {

           },
           "mOpenTypeCode": "10",
           "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
           "mIx": 1,
           "mTitle": "运维单位",
           "mUrl": null,
           "mUrlParamsJson": {
               "IsHideLogo": "1",
               "参数2": ""
           }
       }
    ]
   }
    , {
        "ID": 55,
        "mIconUrl": "web/style/maps/images/统计查询.png",
        "IsChecked": 0,
        "mIsDis": 0,
        "mIsHtmlPage": 0,
        "mLayoutBottom": null,
        "mLayoutHeight": 600,
        "mLayoutHorizontalAlignment": 1,
        "mLayoutLeft": null,
        "mLayoutRight": null,
        "mLayoutTop": null,
        "mLayoutVerticalAlignment": 1,
        "mLayoutWidth": 800,
        "mMenuCode": "dsfc37e6-1488-4d2e-af23-49e7a771g177",
        "mMenuName": "统计查询",
        "mMenuTypeCode": "11",
        "Name": null,
        "mOnFocusInScriptCode": function (e) { },
        "mOnFocusOutScriptCode": function (e) { },
        "mOpenTypeCode": "10",
        "mPMenuCode": null,
        "mIx": 1,
        "mTitle": "统计查询",
        "mUrl": "",
        "mUrlParamsJson": {
            "参数1": "",
            "参数2": ""
        },
        "mFWMenuList": [{
            "mFWMenuList": [],
            "ID": 59,
            "mIconUrl": null,
            "IsChecked": 0,
            "mIsDis": 0,
            "mIsHtmlPage": 0,
            "mLayoutBottom": null,
            "mLayoutHeight": null,
            "mLayoutHorizontalAlignment": 1,
            "mLayoutLeft": null,
            "mLayoutRight": null,
            "mLayoutTop": null,
            "mLayoutVerticalAlignment": 3,
            "mLayoutWidth": 1024,
            "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnotj4",
            "mMenuName": "区域运行情况",
            "mMenuTypeCode": "11",
            "Name": null,
            "mOnFocusInScriptCode": function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/report/regionRunInfo.htm",
                    title: ("区域运行情况"), width: 1000, height: 500,
                    showMaxButton: true,
                    showModal: false
                });
            },
            "mOnFocusOutScriptCode": function (e) {

            },
            "mOpenTypeCode": "10",
            "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
            "mIx": 1,
            "mTitle": "区域运行情况",
            "mUrl": null,
            "mUrlParamsJson": {
                "IsHideLogo": "1",
                "参数2": ""
            }
        }, {
            "mFWMenuList": [],
            "ID": 59,
            "mIconUrl": null,
            "IsChecked": 0,
            "mIsDis": 0,
            "mIsHtmlPage": 0,
            "mLayoutBottom": null,
            "mLayoutHeight": null,
            "mLayoutHorizontalAlignment": 1,
            "mLayoutLeft": null,
            "mLayoutRight": null,
            "mLayoutTop": null,
            "mLayoutVerticalAlignment": 3,
            "mLayoutWidth": 1024,
            "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnotj5",
            "mMenuName": "设施正常运行率",
            "mMenuTypeCode": "11",
            "Name": null,
            "mOnFocusInScriptCode": function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/report/monthRunInfo.htm",
                    title: ("设施正常运行率"), width: 1000, height: 500,
                    showMaxButton: true,
                    showModal: false
                });
            },
            "mOnFocusOutScriptCode": function (e) {

            },
            "mOpenTypeCode": "10",
            "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
            "mIx": 1,
            "mTitle": "设施正常运行率",
            "mUrl": null,
            "mUrlParamsJson": {
                "IsHideLogo": "1",
                "参数2": ""
            }
        }, {
            "mFWMenuList": [],
            "ID": 59,
            "mIconUrl": null,
            "IsChecked": 0,
            "mIsDis": 0,
            "mIsHtmlPage": 0,
            "mLayoutBottom": null,
            "mLayoutHeight": null,
            "mLayoutHorizontalAlignment": 1,
            "mLayoutLeft": null,
            "mLayoutRight": null,
            "mLayoutTop": null,
            "mLayoutVerticalAlignment": 3,
            "mLayoutWidth": 1024,
            "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnotj6",
            "mMenuName": "设施达标排放率",
            "mMenuTypeCode": "11",
            "Name": null,
            "mOnFocusInScriptCode": function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/report/monthStandPutInfo.htm",
                    title: ("设施达标排放率"), width: 1000, height: 500,
                    showMaxButton: true,
                    showModal: false
                });
            },
            "mOnFocusOutScriptCode": function (e) {

            },
            "mOpenTypeCode": "10",
            "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
            "mIx": 1,
            "mTitle": "设施达标排放率",
            "mUrl": null,
            "mUrlParamsJson": {
                "IsHideLogo": "1",
                "参数2": ""
            }
        }, {
            "mFWMenuList": [],
            "ID": 59,
            "mIconUrl": null,
            "IsChecked": 0,
            "mIsDis": 0,
            "mIsHtmlPage": 0,
            "mLayoutBottom": null,
            "mLayoutHeight": null,
            "mLayoutHorizontalAlignment": 1,
            "mLayoutLeft": null,
            "mLayoutRight": null,
            "mLayoutTop": null,
            "mLayoutVerticalAlignment": 3,
            "mLayoutWidth": 1024,
            "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnotj7",
            "mMenuName": "超标统计",
            "mMenuTypeCode": "11",
            "Name": null,
            "mOnFocusInScriptCode": function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/report/overflowInfo.htm",
                    title: ("超标统计"), width: 1000, height: 500,
                    showMaxButton: true,
                    showModal: false
                });
            },
            "mOnFocusOutScriptCode": function (e) {

            },
            "mOpenTypeCode": "10",
            "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
            "mIx": 1,
            "mTitle": "超标统计",
            "mUrl": null,
            "mUrlParamsJson": {
                "IsHideLogo": "1",
                "参数2": ""
            }
        }, {
            "mFWMenuList": [],
            "ID": 59,
            "mIconUrl": null,
            "IsChecked": 0,
            "mIsDis": 0,
            "mIsHtmlPage": 0,
            "mLayoutBottom": null,
            "mLayoutHeight": null,
            "mLayoutHorizontalAlignment": 1,
            "mLayoutLeft": null,
            "mLayoutRight": null,
            "mLayoutTop": null,
            "mLayoutVerticalAlignment": 3,
            "mLayoutWidth": 1024,
            "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnotj8",
            "mMenuName": "设施故障统计",
            "mMenuTypeCode": "11",
            "Name": null,
            "mOnFocusInScriptCode": function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/report/malfunctionInfo.htm",
                    title: ("设施故障统计"), width: 1000, height: 500,
                    showMaxButton: true,
                    showModal: false
                });
            },
            "mOnFocusOutScriptCode": function (e) {

            },
            "mOpenTypeCode": "10",
            "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
            "mIx": 1,
            "mTitle": "设施故障统计",
            "mUrl": null,
            "mUrlParamsJson": {
                "IsHideLogo": "1",
                "参数2": ""
            }
        }, {
            "mFWMenuList": [],
            "ID": 59,
            "mIconUrl": null,
            "IsChecked": 0,
            "mIsDis": 0,
            "mIsHtmlPage": 0,
            "mLayoutBottom": null,
            "mLayoutHeight": null,
            "mLayoutHorizontalAlignment": 1,
            "mLayoutLeft": null,
            "mLayoutRight": null,
            "mLayoutTop": null,
            "mLayoutVerticalAlignment": 3,
            "mLayoutWidth": 1024,
            "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnotj9",
            "mMenuName": "月度运行情况",
            "mMenuTypeCode": "11",
            "Name": null,
            "mOnFocusInScriptCode": function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/report/monthRunInfo.htm",
                    title: ("月度运行情况"), width: 1000, height: 500,
                    showMaxButton: true,
                    showModal: false
                });
            },
            "mOnFocusOutScriptCode": function (e) {

            },
            "mOpenTypeCode": "10",
            "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
            "mIx": 1,
            "mTitle": "月度运行情况",
            "mUrl": null,
            "mUrlParamsJson": {
                "IsHideLogo": "1",
                "参数2": ""
            }
        }, {
            "mFWMenuList": [],
            "ID": 59,
            "mIconUrl": null,
            "IsChecked": 0,
            "mIsDis": 0,
            "mIsHtmlPage": 0,
            "mLayoutBottom": null,
            "mLayoutHeight": null,
            "mLayoutHorizontalAlignment": 1,
            "mLayoutLeft": null,
            "mLayoutRight": null,
            "mLayoutTop": null,
            "mLayoutVerticalAlignment": 3,
            "mLayoutWidth": 1024,
            "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgntz12",
            "mMenuName": "故障记录查询",
            "mMenuTypeCode": "11",
            "Name": null,
            "mOnFocusInScriptCode": function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/operationRecord/failureLoggingStatisList.htm",
                    title: ("故障记录查询"), width: 1000, height: 500,
                    showMaxButton: true,
                    showModal: false
                });
            },
            "mOnFocusOutScriptCode": function (e) {

            },
            "mOpenTypeCode": "10",
            "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
            "mIx": 1,
            "mTitle": "故障记录查询",
            "mUrl": null,
            "mUrlParamsJson": {
                "IsHideLogo": "1",
                "参数2": ""
            }
        }, {
            "mFWMenuList": [],
            "ID": 59,
            "mIconUrl": null,
            "IsChecked": 0,
            "mIsDis": 0,
            "mIsHtmlPage": 0,
            "mLayoutBottom": null,
            "mLayoutHeight": null,
            "mLayoutHorizontalAlignment": 1,
            "mLayoutLeft": null,
            "mLayoutRight": null,
            "mLayoutTop": null,
            "mLayoutVerticalAlignment": 3,
            "mLayoutWidth": 1024,
            "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgntz13",
            "mMenuName": "水质超标查询",
            "mMenuTypeCode": "11",
            "Name": null,
            "mOnFocusInScriptCode": function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/operationRecord/producedWaterQuality.htm",
                    title: ("水质超标查询"), width: 1000, height: 500,
                    showMaxButton: true,
                    showModal: false
                });
            },
            "mOnFocusOutScriptCode": function (e) {

            },
            "mOpenTypeCode": "10",
            "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
            "mIx": 1,
            "mTitle": "水质超标查询",
            "mUrl": null,
            "mUrlParamsJson": {
                "IsHideLogo": "1",
                "参数2": ""
            }
        }
    ]
    }
, {
    "ID": 55,
    "mIconUrl": "web/style/maps/images/运维台账.png",
    "IsChecked": 0,
    "mIsDis": 0,
    "mIsHtmlPage": 0,
    "mLayoutBottom": null,
    "mLayoutHeight": 600,
    "mLayoutHorizontalAlignment": 1,
    "mLayoutLeft": null,
    "mLayoutRight": null,
    "mLayoutTop": null,
    "mLayoutVerticalAlignment": 1,
    "mLayoutWidth": 800,
    "mMenuCode": "c39c37e7-1488-4d2e-af23-49e7a771g177",
    "mMenuName": "运维台帐",
    "mMenuTypeCode": "11",
    "Name": null,
    "mOnFocusInScriptCode": function (e) { },
    "mOnFocusOutScriptCode": function (e) { },
    "mOpenTypeCode": "10",
    "mPMenuCode": null,
    "mIx": 1,
    "mTitle": "运维台帐",
    "mUrl": "",
    "mUrlParamsJson": {
        "参数1": "",
        "参数2": ""
    },
    "mFWMenuList": [{
        "mFWMenuList": [],
        "ID": 59,
        "mIconUrl": null,
        "IsChecked": 0,
        "mIsDis": 0,
        "mIsHtmlPage": 0,
        "mLayoutBottom": null,
        "mLayoutHeight": null,
        "mLayoutHorizontalAlignment": 1,
        "mLayoutLeft": null,
        "mLayoutRight": null,
        "mLayoutTop": null,
        "mLayoutVerticalAlignment": 3,
        "mLayoutWidth": 1024,
        "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgntz10",
        "mMenuName": "运维任务查询",
        "mMenuTypeCode": "11",
        "Name": null,
        "mOnFocusInScriptCode": function () {
            mini.open({
                url: window.webSiteRootUrl + "web/operationMaintenance/OperationTaskList.htm",
                title: ("运维任务查询"), width: 1000, height: 500,
                showMaxButton: true,
                showModal: false
            });
        },
        "mOnFocusOutScriptCode": function (e) {

        },
        "mOpenTypeCode": "10",
        "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
        "mIx": 1,
        "mTitle": "运维任务查询",
        "mUrl": null,
        "mUrlParamsJson": {
            "IsHideLogo": "1",
            "参数2": ""
        }
    }, {
        "mFWMenuList": [],
        "ID": 59,
        "mIconUrl": null,
        "IsChecked": 0,
        "mIsDis": 0,
        "mIsHtmlPage": 0,
        "mLayoutBottom": null,
        "mLayoutHeight": null,
        "mLayoutHorizontalAlignment": 1,
        "mLayoutLeft": null,
        "mLayoutRight": null,
        "mLayoutTop": null,
        "mLayoutVerticalAlignment": 3,
        "mLayoutWidth": 1024,
        "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgntz11",
        "mMenuName": "运维记录查询",
        "mMenuTypeCode": "11",
        "Name": null,
        "mOnFocusInScriptCode": function () {
            mini.open({
                url: window.webSiteRootUrl + "web/operationRecord/maintainList.htm",
                title: ("运维记录查询"), width: 1000, height: 500,
                showMaxButton: true,
                showModal: false
            });
        },
        "mOnFocusOutScriptCode": function (e) {

        },
        "mOpenTypeCode": "10",
        "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
        "mIx": 1,
        "mTitle": "运维记录查询",
        "mUrl": null,
        "mUrlParamsJson": {
            "IsHideLogo": "1",
            "参数2": ""
        }
    }, {
        "mFWMenuList": [],
        "ID": 59,
        "mIconUrl": null,
        "IsChecked": 0,
        "mIsDis": 0,
        "mIsHtmlPage": 0,
        "mLayoutBottom": null,
        "mLayoutHeight": null,
        "mLayoutHorizontalAlignment": 1,
        "mLayoutLeft": null,
        "mLayoutRight": null,
        "mLayoutTop": null,
        "mLayoutVerticalAlignment": 3,
        "mLayoutWidth": 1024,
        "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgntz14",
        "mMenuName": "配件及易耗件更换",
        "mMenuTypeCode": "11",
        "Name": null,
        "mOnFocusInScriptCode": function () {
            mini.open({
                url: window.webSiteRootUrl + "web/operationRecord/replacementList.htm",
                title: ("配件及易耗件更换"), width: 1000, height: 500,
                showMaxButton: true,
                showModal: false
            });
        },
        "mOnFocusOutScriptCode": function (e) {

        },
        "mOpenTypeCode": "10",
        "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
        "mIx": 1,
        "mTitle": "配件及易耗件更换",
        "mUrl": null,
        "mUrlParamsJson": {
            "IsHideLogo": "1",
            "参数2": ""
        }
    }, {
        "mFWMenuList": [],
        "ID": 59,
        "mIconUrl": null,
        "IsChecked": 0,
        "mIsDis": 0,
        "mIsHtmlPage": 0,
        "mLayoutBottom": null,
        "mLayoutHeight": null,
        "mLayoutHorizontalAlignment": 1,
        "mLayoutLeft": null,
        "mLayoutRight": null,
        "mLayoutTop": null,
        "mLayoutVerticalAlignment": 3,
        "mLayoutWidth": 1024,
        "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgntz141",
        "mMenuName": "巡检计划",
        "mMenuTypeCode": "11",
        "Name": null,
        "mOnFocusInScriptCode": function () {
            mini.open({
                url: window.webSiteRootUrl + "web/operationMaintenance/MaintenanceFrequency.htm",
                title: ("巡检计划"), width: 1000, height: 500,
                showMaxButton: true,
                showModal: false
            });
        },
        "mOnFocusOutScriptCode": function (e) {

        },
        "mOpenTypeCode": "10",
        "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
        "mIx": 1,
        "mTitle": "巡检计划",
        "mUrl": null,
        "mUrlParamsJson": {
            "IsHideLogo": "1",
            "参数2": ""
        }
    }
    ]
}
, {
    "ID": 55,
    "mIconUrl": "web/style/maps/images/报警信息.png",
    "IsChecked": 0,
    "mIsDis": 0,
    "mIsHtmlPage": 0,
    "mLayoutBottom": null,
    "mLayoutHeight": 600,
    "mLayoutHorizontalAlignment": 1,
    "mLayoutLeft": null,
    "mLayoutRight": null,
    "mLayoutTop": null,
    "mLayoutVerticalAlignment": 1,
    "mLayoutWidth": 800,
    "mMenuCode": "c39c37e8-1488-4d2e-af23-49e7a771g177",
    "mMenuName": "报警信息",
    "mMenuTypeCode": "11",
    "Name": null,
    "mOnFocusInScriptCode": function (e) { },
    "mOnFocusOutScriptCode": function (e) { },
    "mOpenTypeCode": "10",
    "mPMenuCode": null,
    "mIx": 1,
    "mTitle": "报警信息",
    "mUrl": "",
    "mUrlParamsJson": {
        "参数1": "",
        "参数2": ""
    },
    "mFWMenuList": [{
        "mFWMenuList": [],
        "ID": 59,
        "mIconUrl": null,
        "IsChecked": 0,
        "mIsDis": 0,
        "mIsHtmlPage": 0,
        "mLayoutBottom": null,
        "mLayoutHeight": null,
        "mLayoutHorizontalAlignment": 1,
        "mLayoutLeft": null,
        "mLayoutRight": null,
        "mLayoutTop": null,
        "mLayoutVerticalAlignment": 3,
        "mLayoutWidth": 1024,
        "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztbjxx15",
        "mMenuName": "报警类型管理",
        "mMenuTypeCode": "11",
        "Name": null,
        "mOnFocusInScriptCode": function () {
            mini.open({
                url: window.webSiteRootUrl + "web/system/labelList.htm",
                title: ("报警类型管理"), width: 1000, height: 500,
                showMaxButton: true,
                showModal: false
            });
        },
        "mOnFocusOutScriptCode": function (e) {

        },
        "mOpenTypeCode": "10",
        "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
        "mIx": 1,
        "mTitle": "报警类型管理",
        "mUrl": null,
        "mUrlParamsJson": {
            "IsHideLogo": "1",
            "参数2": ""
        }
    },
    {
        "mFWMenuList": [],
        "ID": 59,
        "mIconUrl": null,
        "IsChecked": 0,
        "mIsDis": 0,
        "mIsHtmlPage": 0,
        "mLayoutBottom": null,
        "mLayoutHeight": null,
        "mLayoutHorizontalAlignment": 1,
        "mLayoutLeft": null,
        "mLayoutRight": null,
        "mLayoutTop": null,
        "mLayoutVerticalAlignment": 3,
        "mLayoutWidth": 1024,
        "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztbjxx17",
        "mMenuName": "报警设置",
        "mMenuTypeCode": "11",
        "Name": null,
        "mOnFocusInScriptCode": function () {
            mini.open({
                url: window.webSiteRootUrl + "web/system/alarmSettingList.htm",
                title: ("报警设置"), width: 1000, height: 500,
                showMaxButton: true,
                showModal: false
            });
        },
        "mOnFocusOutScriptCode": function (e) {

        },
        "mOpenTypeCode": "10",
        "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
        "mIx": 1,
        "mTitle": "报警设置",
        "mUrl": null,
        "mUrlParamsJson": {
            "IsHideLogo": "1",
            "参数2": ""
        }
    },
    {
        "mFWMenuList": [],
        "ID": 59,
        "mIconUrl": null,
        "IsChecked": 0,
        "mIsDis": 0,
        "mIsHtmlPage": 0,
        "mLayoutBottom": null,
        "mLayoutHeight": null,
        "mLayoutHorizontalAlignment": 1,
        "mLayoutLeft": null,
        "mLayoutRight": null,
        "mLayoutTop": null,
        "mLayoutVerticalAlignment": 3,
        "mLayoutWidth": 1024,
        "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztbjxx16",
        "mMenuName": "报警记录",
        "mMenuTypeCode": "11",
        "Name": null,
        "mOnFocusInScriptCode": function () {
            mini.open({
                url: window.webSiteRootUrl + "web/system/AlarmList.htm",
                title: ("报警记录"), width: 1000, height: 500,
                showMaxButton: true,
                showModal: false
            });
        },
        "mOnFocusOutScriptCode": function (e) {

        },
        "mOpenTypeCode": "10",
        "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
        "mIx": 1,
        "mTitle": "报警记录",
        "mUrl": null,
        "mUrlParamsJson": {
            "IsHideLogo": "1",
            "参数2": ""
        }
    }
    ]
}
 , {
     "ID": 55,
     "mIconUrl": "web/style/maps/images/基础数据.png",
     "IsChecked": 0,
     "mIsDis": 0,
     "mIsHtmlPage": 0,
     "mLayoutBottom": null,
     "mLayoutHeight": 600,
     "mLayoutHorizontalAlignment": 1,
     "mLayoutLeft": null,
     "mLayoutRight": null,
     "mLayoutTop": null,
     "mLayoutVerticalAlignment": 1,
     "mLayoutWidth": 800,
     "mMenuCode": "jc9c37e9-1488-4d2e-af23-49e7a771g177",
     "mMenuName": "信息管理",
     "mMenuTypeCode": "11",
     "Name": null,
     "mOnFocusInScriptCode": function (e) {

     },
     "mOnFocusOutScriptCode": function (e) { },
     "mOpenTypeCode": "10",
     "mPMenuCode": null,
     "mIx": 1,
     "mTitle": "基础数据",
     "mUrl": "",
     "mUrlParamsJson": {
         "参数1": "",
         "参数2": ""
     },
     "mFWMenuList": [{
         "mFWMenuList": [],
         "ID": 59,
         "mIconUrl": null,
         "IsChecked": 0,
         "mIsDis": 0,
         "mIsHtmlPage": 0,
         "mLayoutBottom": null,
         "mLayoutHeight": null,
         "mLayoutHorizontalAlignment": 1,
         "mLayoutLeft": null,
         "mLayoutRight": null,
         "mLayoutTop": null,
         "mLayoutVerticalAlignment": 3,
         "mLayoutWidth": 1024,
         "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone17",
         "mMenuName": "用户信息管理",
         "mMenuTypeCode": "11",
         "Name": null,
         "mOnFocusInScriptCode": function () {
             mini.open({
                 url: window.webSiteRootUrl + "web/sysManage/fwUserLoginList.htm",
                 title: ("用户信息管理"), width: 1000, height: 500,
                 showMaxButton: true,
                 showModal: false
             });
         },
         "mOnFocusOutScriptCode": function (e) {

         },
         "mOpenTypeCode": "10",
         "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
         "mIx": 1,
         "mTitle": "用户信息管理",
         "mUrl": null,
         "mUrlParamsJson": {
             "IsHideLogo": "1",
             "参数2": ""
         }
     },
     {
         "mFWMenuList": [],
         "ID": 59,
         "mIconUrl": null,
         "IsChecked": 0,
         "mIsDis": 0,
         "mIsHtmlPage": 0,
         "mLayoutBottom": null,
         "mLayoutHeight": null,
         "mLayoutHorizontalAlignment": 1,
         "mLayoutLeft": null,
         "mLayoutRight": null,
         "mLayoutTop": null,
         "mLayoutVerticalAlignment": 3,
         "mLayoutWidth": 1024,
         "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone18",
         "mMenuName": "设施管理",
         "mMenuTypeCode": "11",
         "Name": null,
         "mOnFocusInScriptCode": function () {
             mini.open({
                 url: window.webSiteRootUrl + "web/basicInfo/monitorSiteList.htm",
                 title: ("设施管理"), width: 1000, height: 500,
                 showMaxButton: true,
                 showModal: false
             });
         },
         "mOnFocusOutScriptCode": function (e) {

         },
         "mOpenTypeCode": "10",
         "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
         "mIx": 1,
         "mTitle": "设施管理",
         "mUrl": null,
         "mUrlParamsJson": {
             "IsHideLogo": "1",
             "参数2": ""
         }
     },
     {
         "mFWMenuList": [],
         "ID": 59,
         "mIconUrl": null,
         "IsChecked": 0,
         "mIsDis": 0,
         "mIsHtmlPage": 0,
         "mLayoutBottom": null,
         "mLayoutHeight": null,
         "mLayoutHorizontalAlignment": 1,
         "mLayoutLeft": null,
         "mLayoutRight": null,
         "mLayoutTop": null,
         "mLayoutVerticalAlignment": 3,
         "mLayoutWidth": 1024,
         "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone19",
         "mMenuName": "设施点分组",
         "mMenuTypeCode": "11",
         "Name": null,
         "mOnFocusInScriptCode": function () {
             mini.open({
                 url: window.webSiteRootUrl + "web/basicInfo/monitorSiteGroupList.htm",
                 title: ("设施点分组"), width: 1000, height: 500,
                 showMaxButton: true,
                 showModal: false
             });
         },
         "mOnFocusOutScriptCode": function (e) {

         },
         "mOpenTypeCode": "10",
         "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
         "mIx": 1,
         "mTitle": "设施点分组",
         "mUrl": null,
         "mUrlParamsJson": {
             "IsHideLogo": "1",
             "参数2": ""
         }
     }
     , {
         "mFWMenuList": [],
         "ID": 59,
         "mIconUrl": null,
         "IsChecked": 0,
         "mIsDis": 0,
         "mIsHtmlPage": 0,
         "mLayoutBottom": null,
         "mLayoutHeight": null,
         "mLayoutHorizontalAlignment": 1,
         "mLayoutLeft": null,
         "mLayoutRight": null,
         "mLayoutTop": null,
         "mLayoutVerticalAlignment": 3,
         "mLayoutWidth": 1024,
         "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone",
         "mMenuName": "生产厂商",
         "mMenuTypeCode": "11",
         "Name": null,
         "mOnFocusInScriptCode": function () {
             mini.open({
                 url: window.webSiteRootUrl + "web/basicInfo/manufacturerList.htm",
                 title: ("生产厂商"), width: 1000, height: 500,
                 showMaxButton: true,
                 showModal: false
             });
         },
         "mOnFocusOutScriptCode": function (e) {

         },
         "mOpenTypeCode": "10",
         "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
         "mIx": 1,
         "mTitle": "生产厂商",
         "mUrl": null,
         "mUrlParamsJson": {
             "IsHideLogo": "1",
             "参数2": ""
         }
     }, {
         "mFWMenuList": [],
         "ID": 59,
         "mIconUrl": null,
         "IsChecked": 0,
         "mIsDis": 0,
         "mIsHtmlPage": 0,
         "mLayoutBottom": null,
         "mLayoutHeight": null,
         "mLayoutHorizontalAlignment": 1,
         "mLayoutLeft": null,
         "mLayoutRight": null,
         "mLayoutTop": null,
         "mLayoutVerticalAlignment": 3,
         "mLayoutWidth": 1024,
         "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone20",
         "mMenuName": "设备管理",
         "mMenuTypeCode": "11",
         "Name": null,
         "mOnFocusInScriptCode": function () {
             mini.open({
                 url: window.webSiteRootUrl + "web/basicInfo/equipmentList.htm",
                 title: ("设备管理"), width: 1000, height: 500,
                 showMaxButton: true,
                 showModal: false
             });
         },
         "mOnFocusOutScriptCode": function (e) {

         },
         "mOpenTypeCode": "10",
         "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
         "mIx": 1,
         "mTitle": "设备管理",
         "mUrl": null,
         "mUrlParamsJson": {
             "IsHideLogo": "1",
             "参数2": ""
         }
     }
     , {
         "mFWMenuList": [],
         "ID": 59,
         "mIconUrl": null,
         "IsChecked": 0,
         "mIsDis": 0,
         "mIsHtmlPage": 0,
         "mLayoutBottom": null,
         "mLayoutHeight": null,
         "mLayoutHorizontalAlignment": 1,
         "mLayoutLeft": null,
         "mLayoutRight": null,
         "mLayoutTop": null,
         "mLayoutVerticalAlignment": 3,
         "mLayoutWidth": 1024,
         "mMenuCode": "68efe219-da0b-4d32-905d-ba462ztgnone21",
         "mMenuName": "通知方式",
         "mMenuTypeCode": "11",
         "Name": null,
         "mOnFocusInScriptCode": function () {
             mini.open({
                 url: window.webSiteRootUrl + "web/basicInfo/notiset.htm",
                 title: ("通知方式"), width: 1000, height: 500,
                 showMaxButton: true,
                 showModal: false
             });
         },
         "mOnFocusOutScriptCode": function (e) {

         },
         "mOpenTypeCode": "10",
         "mPMenuCode": "c39c37e5-1488-4d2e-af23-49e7a771e277",
         "mIx": 1,
         "mTitle": "通知方式",
         "mUrl": null,
         "mUrlParamsJson": {
             "IsHideLogo": "1",
             "参数2": ""
         }
     }
    ]
 }
];

