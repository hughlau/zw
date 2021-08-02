var fw = {
    fwShell: {
        FWShellHelper: {
            __callSettings: {
                success: function () { }
                    , error: function () { }
            }
            , callSetup: function (properties) {
                $.extend(fw.fwShell.FWShellHelper.__callSettings, properties);
            }
            , call: function (properties) {
                var settings = {};
                $.extend(settings, properties);
                var method = settings.method;
                delete settings.method;
                fw.callFunction(undefined, method, [settings]);
            }
            , CacheHelper: {
                defaultCachePoolName: "fw.fwShell.FWShellHelper.CacheHelper.Cache"
                , set: function (properties) {
                    var settings = {
                        success: function () { }
                        , error: function () { }
                        , data: {
                            cachePoolName: undefined
                            , key: undefined
                            , value: undefined
                        }
                    };
                    settings = {};
                    $.extend(settings, fw.fwShell.FWShellHelper.__callSettings);
                    $.extend(settings, properties);

                    //调用
                    aa(settings.success, settings.error, settings.data.cachePoolName, settings.data.key, settings.data.value);
                }
                , get: function (properties) {
                    var settings = {
                        success: function () { }
                        , error: function () { }
                        , data: {
                            cachePoolName: undefined
                            , key: undefined
                        }
                    };
                    settings = {};
                    $.extend(settings, fw.fwShell.FWShellHelper.__callSettings);
                    $.extend(settings, properties);

                    //调用
                    aa(settings.success, settings.error, settings.data.cachePoolName, settings.data.key);
                }
            }
        }
    }
};