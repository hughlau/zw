$.ImagePlayer = {
    Stop: function (Properties) {
        if (typeof (Properties) == "undefined") {
            Properties = {};
        };
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(Settings.Selector);
        SelectorJQ.each(function () {
            var ImagePlayerJQ = $(this);
            var ControlData = ImagePlayerJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                clearInterval(ControlData.IntervalID);
            };
        });
    }
    , Start: function (Properties) {
        if (typeof (Properties) == "undefined") {
            Properties = {};
        };
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(Settings.Selector);
        SelectorJQ.each(function () {
            var ImagePlayerJQ = $(this);
            var ControlData = ImagePlayerJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                clearInterval(ControlData.IntervalID);
                ControlData.IntervalID = setInterval(function () {
                    var ImageIndex = ControlData.ControlJQs.ImagePlayerJQ.data("ImageIndex");
                    if (ImageIndex == undefined) {
                        ImageIndex = 0;
                    } else if (ImageIndex >= ControlData.Settings.Total) {
                        ImageIndex = 0;
                    };

                    var BackgroundPosition_Left = 0 - (ImageIndex % ControlData.Settings.PerLineTotal) * (ControlData.Settings.Width + ControlData.Settings.ColumnSpacing);
                    var BackgroundPosition_Top = 0 - parseInt(ImageIndex / ControlData.Settings.PerLineTotal, 10) * (ControlData.Settings.Width + ControlData.Settings.LineSpacing);
                    //$("#divInfo").html($("#divInfo").html() + BackgroundPosition_Left + "," + BackgroundPosition_Top + "<br/>");
                    ControlData.ControlJQs.ImagePlayerJQ.css("background-position", BackgroundPosition_Left + "px " + BackgroundPosition_Top + "px");
                    ControlData.ControlJQs.ImagePlayerJQ.data("ImageIndex", ImageIndex + 1);
                }, ControlData.Settings.PlaySpeed);

            };
        });
    }
};

//图片播放器
$.fn.extend({
    ImagePlayer_Init: function (Settings) {
        if (Settings.ImageUrl != null) {
            this.css("background", "url(" + Settings.ImageUrl + ") no-repeat scroll 0px 0px transparent");
        };
        this.width(Settings.Width).height(Settings.Height);

        this.each(function () {
            var ImagePlayerJQ = $(this);
            var ControlData = ImagePlayerJQ.data("ControlData");
            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData = {
                    Settings: Settings
                };
                ImagePlayerJQ.data("ControlData", ControlData);
                var WindowGuid = fw.guid();
                ControlData.ControlJQs = {
                    IsInit: true
                            , WindowGuid: WindowGuid
                            , ImagePlayerJQ: ImagePlayerJQ
                };

            };
        });
    }
    , ImagePlayer: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            ImageUrl: null                  //图片的地址
            , Total: null                   //动画的图片总数
            , Width: null                   //单张图片宽度
            , Height: null                  //单张图片高度
            , PerLineTotal: null            //每行图片的个数
            , ColumnSpacing: 0              //图片之间水平间距（列距）
            , LineSpacing: 0                //图片之间垂直间距（行距）
            , PlaySpeed: 200                //图片播放速度(毫秒)
            , IsStart: true                 //是否开始动画
        };
        $.extend(Settings, properties);

        var SelectorJQ = this;
        if (SelectorJQ.length > 0 && Settings.Total != null && Settings.Width != null && Settings.Height != null) {
            if (Settings.PerLineTotal == null) {
                Settings.PerLineTotal = Settings.Total;
            };

            SelectorJQ.ImagePlayer_Init(Settings);

            SelectorJQ.each(function () {
                var ImagePlayerJQ = $(this);
                var ControlData = ImagePlayerJQ.data("ControlData");

                if (ControlData.Settings.IsStart) {
                    $.ImagePlayer.Start({
                        Selector: ControlData.ControlJQs.ImagePlayerJQ
                    });
                };
            });
        };
        return this;

    }
});

