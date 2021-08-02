$.basicInfoPage = {
    ShowCommonFunction: function (ActionType, FormSelectorJQ) {
        var buttonCancelJQ = $(".buttonCancel", FormSelectorJQ);
        var buttonEditJQ = $(".buttonEdit", FormSelectorJQ);
        var buttonSaveJQ = $(".buttonSave", FormSelectorJQ);

        var ViewControlJQ = $(".ViewControl", FormSelectorJQ);
        var EditControlJQ = $(".EditControl", FormSelectorJQ);

        switch (ActionType) {
            case "Add":
            case "Edit":
                buttonCancelJQ.show();
                buttonEditJQ.hide();
                buttonSaveJQ.show();

                ViewControlJQ.hide();
                EditControlJQ.show();
                break;
            default:
                buttonCancelJQ.hide();
                buttonEditJQ.show();
                buttonSaveJQ.hide();

                ViewControlJQ.show();
                EditControlJQ.hide();
                break;
        };
    }
, monitorSiteList: [{ cantonCode: "320581107001", cantonName: "观智村", monitorSiteName: "董浜镇污水处理设施-01", monitorSiteCode: "3205810101", model: "华控HK-4-I电流变送器", address: "靖江市通港工业园华联路58号", startDate: "2014-01-01", operationPerson: "曾欲健", posX: "120.9328", posY: "31.7242", useCount: 80, handleAbility: "能处理100家一下的污水" }
, { cantonCode: "321282", cantonName: "红沙村", monitorSiteName: "董浜镇污水处理设施-02", monitorSiteCode: "3205810202", model: "华控HK-4-I电流变送器", address: "靖江市虞山镇（王市）通江路120号", startDate: "2014-01-01", operationPerson: "张浩", posX: "119.9328", posY: "31.7242", useCount: 80, handleAbility: "能处理100家一下的污水" }
, { cantonCode: "321282", cantonName: "红沙村", monitorSiteName: "董浜镇污水处理设施-03", monitorSiteCode: "3205810301", model: "华控HK-4-I电流变送器", address: "靖江市碧溪镇东张中心大道50号", startDate: "2014-01-01", operationPerson: "孙洋东", posX: "117.9328", posY: "31.7242", useCount: 130, handleAbility: "能处理150家一下的污水" }
, { cantonCode: "321282", cantonName: "永安村", monitorSiteName: "董浜镇污水处理设施-04", monitorSiteCode: "3205810202", model: "华控HK-4-I电流变送器", address: "靖江市虞山镇通江路168", startDate: "2014-01-01", operationPerson: "王鹤锦", posX: "116.9328", posY: "36.7242", useCount: 40, handleAbility: "能处理50家一下的污水" }
, { cantonCode: "321282", cantonName: "里睦村", monitorSiteName: "董浜镇污水处理设施-05", monitorSiteCode: "3205810103", model: "北环科", address: "靖江市虞山镇通港开发区泰光路118号", startDate: "2014-01-01", operationPerson: "刘可可", posX: "119.9328", posY: "39.7242", useCount: 80, handleAbility: "能处理100家一下的污水" }
, { cantonCode: "321282", cantonName: "陆市村", monitorSiteName: "董浜镇污水处理设施-06", monitorSiteCode: "3205810302", model: "北环科", address: "江苏省靖江市碧溪新区碧溪东路50号", startDate: "2014-01-01", operationPerson: "王文迪", posX: "118.9328", posY: "38.7242", useCount: 80, handleAbility: "能处理100家一下的污水" }
]
, monitorSiteHisList: [{ cantonCode: "321282", cantonName: "杨塘村", monitorSiteName: "董浜镇污水处理设施-07", monitorSiteCode: "3205810101", address: "靖江市通港工业园华联路58号", startDate: "2014-01-01", operationPerson: "曾欲健", posX: "120.9328", posY: "31.7242", useCount: 80, handleAbility: "能处理100家一下的污水", recordPeople: "中车集团用户", recordDate: "2015-1-1" }
, { cantonCode: "321282", cantonName: "黄石村", monitorSiteName: "董浜镇污水处理设施-08", monitorSiteCode: "3205810101", address: "靖江市通港工业园华联路58号", startDate: "2014-02-01", operationPerson: "曾欲健", posX: "120.9328", posY: "31.7242", useCount: 80, handleAbility: "能处理100家一下的污水", recordPeople: "中车集团用户", recordDate: "2015-2-2" }
, { cantonCode: "321282", cantonName: "东盾村", monitorSiteName: "董浜镇污水处理设施-09", monitorSiteCode: "3205810101", address: "靖江市通港工业园华联路58号", startDate: "2014-04-01", operationPerson: "曾欲健", posX: "120.9328", posY: "31.7242", useCount: 80, handleAbility: "能处理100家一下的污水", recordPeople: "中车集团用户", recordDate: "2015-8-3" }
]

};