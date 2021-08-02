$.FileUpLoad = {
    SilverlightService: []
    , ShowProgress: []
    , UpLoadFinished: []
    , DeleteUpLoad: []
    , GetSilverlightServiceIndex: function (Selector) {
        var SilverlightServiceIndex = $(Selector).data("SilverlightServiceIndex")
        return SilverlightServiceIndex;
        //                return -1;
    }
    , PauseUpLoad: function (Selector, UpLoadID) {
        var SilverlightServiceIndex = $.FileUpLoad.GetSilverlightServiceIndex(Selector);
        if (SilverlightServiceIndex > -1) {
            $.FileUpLoad.SilverlightService[SilverlightServiceIndex].PauseUpLoad(UpLoadID);
        };
    }
    , ContinueUpLoad: function (Selector, UpLoadID) {
        var SilverlightServiceIndex = $.FileUpLoad.GetSilverlightServiceIndex(Selector);
        if (SilverlightServiceIndex > -1) {
            $.FileUpLoad.SilverlightService[SilverlightServiceIndex].ContinueUpLoad(UpLoadID);
        };
    }
    , DeleteUpLoad: function (Selector, UpLoadID) {
        var SilverlightServiceIndex = $.FileUpLoad.GetSilverlightServiceIndex(Selector);
        if (SilverlightServiceIndex > -1) {
            $.FileUpLoad.SilverlightService[SilverlightServiceIndex].DeleteUpLoad(UpLoadID);
        };
    }
    , IsUpLoadFinished: function (UpLoadInfoSelector) {
        $(UpLoadInfoSelector).find("table:first tr").each(function () {
            if ($(this).data("Entity") == undefined) {
                return false;
            };
        });
        return true;
    }
    , GetUpLoadFile: function (UpLoadInfoSelector) {
        var FileS = [];
        $(UpLoadInfoSelector).find("table:first tr").each(function () {
            var Entity = $(this).data("Entity");
            if (Entity != undefined) {
                FileS.push(Entity);
            };
        });
        if (FileS.length == 1) {
            return FileS[0];
        } else {
            return FileS;
        };
    }
};
$.fn.extend({
    FileUpLoad: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            SelectFileImageUrl: ""
                    , Source: null
                    , InitParams: {}
                    , FileUpLoadService: ""
                    , EachUpLoadLength: 1024 * 512
                    , Path: "Web/UpLoadFile/"
                    , Extensions: ""
                    , MaxLength: 0
                    , UpLoadFileCount: 1
                    , Multiselect: false
                    , UpLoadFileCount: 1
                    , UpLoadInfoSelector: null
                    , ShowProgress: null
                    , DeleteUpLoad: null
                    , GetUpLoadFileUrl: function (UpLoadFileName) { return ""; }
                    , UpLoadFinished: null
        };
        $.extend(Settings, properties);

        if (Settings.UpLoadFileCount <= 1) {
            Settings.UpLoadFileCount = 1;
            Settings.Multiselect = false;
        };

        var FileUpLoadJQ = this;
        if (FileUpLoadJQ.length > 0 && Settings.Source != null) {
            var UpLoadInfoSelectorJQ = $(Settings.UpLoadInfoSelector);
            if (UpLoadInfoSelectorJQ.length > 0) {
                $("<table class=\"jQueryExtension_UI_FileUpLoad\"></table>").appendTo(UpLoadInfoSelectorJQ);
                UpLoadInfoSelectorJQ = $("table:first", UpLoadInfoSelectorJQ);
            };

            Settings.InitParams.SelectFileImageUrl = Settings.SelectFileImageUrl;
            Settings.InitParams.FileUpLoadService = Settings.FileUpLoadService;
            Settings.InitParams.Path = Settings.Path;
            Settings.InitParams.UpLoadFileCount = Settings.UpLoadFileCount;
            Settings.InitParams.Extensions = Settings.Extensions;
            Settings.InitParams.MaxLength = Settings.MaxLength;
            Settings.InitParams.EachUpLoadLength = Settings.EachUpLoadLength;
            Settings.InitParams.Multiselect = Settings.Multiselect;
            var SilverlightServiceIndex = $.FileUpLoad.SilverlightService.length;
            $.FileUpLoad.SilverlightService[SilverlightServiceIndex] = null;
            Settings.InitParams.SilverlightServiceIndex = SilverlightServiceIndex;

            var DateTime = new Date();
            var Year = DateTime.getFullYear();
            var Month = DateTime.getMonth();
            if (Month < 1) {
                Month = 12;
                Year -= 1;
            };
            Month += 1;
            var Day = DateTime.getDate();
            var Hours = DateTime.getHours();
            var Minutes = DateTime.getMinutes();
            var Seconds = DateTime.getSeconds();
            var Milliseconds = DateTime.getMilliseconds();
            var DateTimeGuid = "" + Year + Month + Day + Hours + Minutes + Seconds + Milliseconds + parseInt($.event.guid++);
            Settings.InitParams.ObjectID = "object" + DateTimeGuid;
            var Html = "";
            Html += "<object id=\"" + Settings.InitParams.ObjectID + "\" data=\"data:application/x-silverlight-2,\" type=\"application/x-silverlight-2\" width=\"100%\" height=\"100%\">";
            Html += "<param name=\"source\" value=\"" + Settings.Source + "\" />";
            Html += "<param name=\"onError\" value=\"onSilverlightError\" />";
            Html += "<param name=\"background\" value=\"white\" />";
            Html += "<param name=\"minRuntimeVersion\" value=\"4.0.50826.0\" />";
            Html += "<param name=\"autoUpgrade\" value=\"true\" />";
            var InitParams = ""; for (var i in Settings.InitParams) { InitParams += (i + "=" + Settings.InitParams[i] + ","); }; if (InitParams.length > 0) { InitParams = InitParams.substring(0, InitParams.length - 1); };
            Html += "<param name=\"InitParams\" value=\"" + InitParams + "\" />";
            Html += "<a href=\"http://go.microsoft.com/fwlink/?LinkID=149156&v=4.0.50826.0\" style=\"text-decoration: none\"><img src=\"http://go.microsoft.com/fwlink/?LinkId=161376\" alt=\"获取 Microsoft Silverlight\" style=\"border-style: none\" /></a>";
            Html += "</object>";
            $(Html).appendTo(FileUpLoadJQ);
            FileUpLoadJQ.data("SilverlightServiceIndex", SilverlightServiceIndex);


            if (UpLoadInfoSelectorJQ.length > 0) {
                $.FileUpLoad.ShowProgress[SilverlightServiceIndex] = function (Entity) {
                    var trFileUpLoadJQ = $('#trFileUpLoad' + Entity.UpLoadID);
                    var divFileUpLoadFileNameJQ = $('#divFileUpLoadFileName' + Entity.UpLoadID);
                    var divFileUpLoadProgressBarJQ = $('#divFileUpLoadProgressBar' + Entity.UpLoadID);
                    var tdFileUpLoadProgressValueJQ = $('#tdFileUpLoadProgressValue' + Entity.UpLoadID);
                    var tdFileUpLoadProgressValueJQ = $('#tdFileUpLoadProgressValue' + Entity.UpLoadID);
                    var tdFileUpLoadLengthJQ = $('#tdFileUpLoadLength' + Entity.UpLoadID);
                    var tdFileUpLoadUpLoadLengthJQ = $('#tdFileUpLoadUpLoadLength' + Entity.UpLoadID);
                    if (trFileUpLoadJQ.length < 1) {
                        var Html = "";
                        Html += "<tr id=\"trFileUpLoad" + Entity.UpLoadID + "\">";
                        Html += "<td><div id=\"divFileUpLoadFileName" + Entity.UpLoadID + "\" class=\"divFileUpLoadFileName\"></div></td>";
                        Html += "<td class=\"tdFileUpLoadProgressBar\"><div id=\"divAnalyzeFile" + Entity.UpLoadID + "\" class=\"divAnalyzeFile\">上传文件分析中，请稍候...</div><div id=\"divFileUpLoadProgressBarBorder" + Entity.UpLoadID + "\" class=\"divFileUpLoadProgressBarBorder\"><div id=\"divFileUpLoadProgressBar" + Entity.UpLoadID + "\" class=\"divFileUpLoadProgressBar\"></div></div></td>";
                        Html += "<td id=\"tdFileUpLoadProgressValue" + Entity.UpLoadID + "\" class=\"tdFileUpLoadProgressValue\"></td>";
                        Html += "<td id=\"tdFileUpLoadLength" + Entity.UpLoadID + "\" class=\"tdFileUpLoadLength\"></td>";
                        Html += "<td id=\"tdFileUpLoadUpLoadLength" + Entity.UpLoadID + "\" class=\"tdFileUpLoadUpLoadLength\"></td>";
                        Html += "<td id=\"tdFileUpLoadUpLoadSpeed" + Entity.UpLoadID + "\" class=\"tdFileUpLoadUpLoadSpeed\"></td>";
                        Html += "<td class=\"tdFileUpLoadPause\"><div id=\"divFileUpLoadPause" + Entity.UpLoadID + "\" class=\"divFileUpLoadPause\" title=\"暂停\"></div></td>";
                        Html += "<td class=\"tdFileUpLoadDelete\"><div id=\"divFileUpLoadDelete" + Entity.UpLoadID + "\" class=\"divFileUpLoadDelete\" title=\"删除\"></div></td>";
                        Html += "</tr>";
                        $(Html).appendTo(UpLoadInfoSelectorJQ);

                        divFileUpLoadFileNameJQ = $('#divFileUpLoadFileName' + Entity.UpLoadID);
                        divFileUpLoadProgressBarJQ = $('#divFileUpLoadProgressBar' + Entity.UpLoadID);
                        tdFileUpLoadProgressValueJQ = $('#tdFileUpLoadProgressValue' + Entity.UpLoadID);
                        tdFileUpLoadLengthJQ = $('#tdFileUpLoadLength' + Entity.UpLoadID);
                        tdFileUpLoadUpLoadLengthJQ = $('#tdFileUpLoadUpLoadLength' + Entity.UpLoadID);
                        tdFileUpLoadUpLoadSpeedJQ = $('#tdFileUpLoadUpLoadSpeed' + Entity.UpLoadID);
                        $('#divFileUpLoadPause' + Entity.UpLoadID).data("IsPause", 0).bind("click", function () { if ($(this).data("IsPause") == 0) { $.FileUpLoad.PauseUpLoad(FileUpLoadJQ, Entity.UpLoadID); $(this).data("IsPause", 1).removeClass("divFileUpLoadPause").addClass("divFileUpLoadContinue").attr("title", "继续"); } else if ($(this).data("IsPause") == 1) { $.FileUpLoad.ContinueUpLoad(FileUpLoadJQ, Entity.UpLoadID); $(this).data("IsPause", 0).removeClass("divFileUpLoadContinue").addClass("divFileUpLoadPause").attr("title", "暂停"); } });
                        $('#divFileUpLoadDelete' + Entity.UpLoadID).bind("click", function () { $.FileUpLoad.DeleteUpLoad(FileUpLoadJQ, Entity.UpLoadID); });
                    };

                    divFileUpLoadFileNameJQ.html(Entity.FileName);
                    divFileUpLoadProgressBarJQ.css("width", Entity.Progress * 100 + "%");
                    var StringS = (Entity.Progress * 100).toString().split('.');
                    if (StringS.length > 1) {
                        tdFileUpLoadProgressValueJQ.html(StringS[0] + "." + StringS[1].substring(0, 2) + "%");
                    } else {
                        tdFileUpLoadProgressValueJQ.html(StringS[0] + "%");
                    };
                    $('#tdFileUpLoadLength' + Entity.UpLoadID).html(Entity.Length);
                    $('#tdFileUpLoadUpLoadLength' + Entity.UpLoadID).html(Entity.UpLoadLength);
                    if (Entity.UpLoadSpeed.length > 0) {
                        $('#tdFileUpLoadUpLoadSpeed' + Entity.UpLoadID).html(Entity.UpLoadSpeed);
                    };

                    if (Entity.IsAnalyzeFile != undefined) {
                        $('#divFileUpLoadProgressBarBorder' + Entity.UpLoadID).hide();
                        tdFileUpLoadProgressValueJQ.hide();
                        $('#divFileUpLoadPause' + Entity.UpLoadID).hide();
                        $('#divFileUpLoadDelete' + Entity.UpLoadID).hide();
                        $('#divAnalyzeFile' + Entity.UpLoadID).show();
                    } else {
                        $('#divFileUpLoadProgressBarBorder' + Entity.UpLoadID).show();
                        tdFileUpLoadProgressValueJQ.show();
                        $('#divFileUpLoadPause' + Entity.UpLoadID).show();
                        $('#divFileUpLoadDelete' + Entity.UpLoadID).show();
                        $('#divAnalyzeFile' + Entity.UpLoadID).hide();
                    };

                    if ($.isFunction(Settings.ShowProgress)) {
                        Settings.ShowProgress(Entity);
                    };
                };
            };

            if (UpLoadInfoSelectorJQ.length > 0) {
                $.FileUpLoad.UpLoadFinished[SilverlightServiceIndex] = function (Entity) {
                    var trFileUpLoadJQ = $('#trFileUpLoad' + Entity.UpLoadID);
                    if (trFileUpLoadJQ.length > 0) {
                        Entity.FilePath = Settings.Path + Entity.UpLoadFileName;
                        trFileUpLoadJQ.data("Entity", Entity);
                        $('#divFileUpLoadProgressBar' + Entity.UpLoadID).css("width", "100%");
                        $('#tdFileUpLoadProgressValue' + Entity.UpLoadID).html("100%");
                        $('#divFileUpLoadPause' + Entity.UpLoadID).remove();
                        $('#tdFileUpLoadUpLoadLength' + Entity.UpLoadID).html("");
                        $('#tdFileUpLoadUpLoadSpeed' + Entity.UpLoadID).html("");
                        var UpLoadFileUrl = Settings.GetUpLoadFileUrl(Entity.UpLoadFileName);
                        if (UpLoadFileUrl != "") {
                            $('#divFileUpLoadFileName' + Entity.UpLoadID).html("<a href=\"" + UpLoadFileUrl + "\" target=\"_blank\">" + Entity.FileName + "</a>")
                        };
                        if ($.isFunction(Settings.UpLoadFinished)) {
                            Settings.UpLoadFinished(Entity);
                        };
                    };
                };
            };

            if (UpLoadInfoSelectorJQ.length > 0) {
                $.FileUpLoad.DeleteUpLoad[SilverlightServiceIndex] = function (UpLoadID) {
                    $('#trFileUpLoad' + UpLoadID).remove();
                    if ($.isFunction(Settings.DeleteUpLoad)) {
                        Settings.DeleteUpLoad(UpLoadID);
                    };
                };
            };

        };
    }
});