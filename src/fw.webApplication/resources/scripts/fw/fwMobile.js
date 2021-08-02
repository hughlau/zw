(function (window, undefined) {
    fw.fwShell = {
        FWShellHelper: {
            __callSettings: {
                success: function () {
                },
                error: function () {
                },
                complete: function (properties) {
                }
            },
            callSetup: function (properties) {
                $.extend(fw.fwShell.FWShellHelper.__callSettings, properties);
            },
            call: function (properties) {
                var settings = {};
                $.extend(settings, properties);
                var method = settings.method;
                delete settings.method;
                fw.callFunction(undefined, method, [settings]);
            },
            CacheHelper: {
                defaultCachePoolName: "fw.fwShell.FWShellHelper.CacheHelper.Cache",
                set: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            cachePoolName: undefined,
                            key: undefined,
                            value: undefined
                        }
                    };
                    $.extend(settings, properties);
                    if (settings.params.cachePoolName == null) {
                        settings.params.cachePoolName = fw.fwShell.FWShellHelper.CacheHelper.defaultCachePoolName;
                    }
                    ;
                    // 调用
                    try {
                        navigator.apppreferences.store(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        }, settings.params.cachePoolName, settings.params.key,
						settings.params.value);
                    } catch (ex) {
                        fw.fwCookie.FWCookieHelper(settings.params.cachePoolName
							+ "." + settings.params.key, settings.params.value,
							{
							    expires: 1
							});
                        var cacheValue = fw.fwCookie
						.FWCookieHelper(settings.params.cachePoolName
							+ "." + settings.params.key);
                        if (cacheValue != null
							&& cacheValue == settings.params.value) {
                            settings.success();
                            settings.complete("success");
                        } else {
                            settings.error(ex);
                            settings.complete(ex, "error");
                        }
                        ;
                    }
                },
                get: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            cachePoolName: undefined,
                            key: undefined
                        }
                    };
                    $.extend(settings, properties);
                    if (settings.params.cachePoolName == null) {
                        settings.params.cachePoolName = fw.fwShell.FWShellHelper.CacheHelper.defaultCachePoolName;
                    }
                    ;

                    // 调用
                    try {
                        navigator.apppreferences.fetch(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        }, settings.params.cachePoolName, settings.params.key);
                    } catch (ex) {
                        var cacheValue = fw.fwCookie
						.FWCookieHelper(settings.params.cachePoolName
							+ "." + settings.params.key);
                        if (cacheValue != null) {
                            settings.success(cacheValue);
                            settings.complete(cacheValue, "success");
                        } else {
                            settings.error(ex);
                            settings.complete(ex, "error");
                        }
                        ;
                    }
                }

            },
            DeviceHelper: {
                getDeviceInfo: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        device.getInfo(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                }

            },
            ScannerHelper: {
                scan: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        cordova.plugins.barcodeScanner.scan(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                }
            }

			,
            CameraHelper: {
                getPicture: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            quality: undefined,
                            destinationtype: undefined,
                            sourceType: undefined,
                            allowEdit: undefined,
                            encodingType: undefined,
                            targetWidth: undefined,
                            targetHeight: undefined,
                            popoverOptions: undefined,
                            saveToPhotoAlbum: undefined
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        navigator.camera.getPicture(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        }, {
                            quality: settings.params.quality,
                            destinationType: settings.params.destinationtype,
                            sourceType: settings.params.sourceType,
                            allowEdit: settings.params.allowEdit,
                            encodingType: settings.params.encodingType,
                            targetWidth: settings.params.targetWidth,
                            targetHeight: settings.params.targetHeight,
                            popoverOptions: settings.params.popoverOptions,
                            saveToPhotoAlbum: settings.params.saveToPhotoAlbum
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                cleanup: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }
                    };
                    $.extend(settings, properties);
                    try {
                        navigator.camera.cleanup(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                }
            },
            NotifictionHelper: {
                alert: function (properties) {
                    var settings = {
                        completecallback: function () {
                        },
                        params: {
                            title: undefined,
                            message: undefined,
                            buttonlable: undefined
                        }
                    };
                    $.extend(settings, properties);
                    try {
                        navigator.notification.alert(settings.params.message,
							settings.completecallback, settings.params.title,
							settings.params.buttonlabel);
                    } catch (ex) {
                        // settings.completecallback();
                    }
                }

				,
                confirm: function (properties) {
                    var settings = {
                        resultCallback: function () {
                        },
                        params: {
                            title: undefined,
                            message: undefined,
                            buttonlable: undefined
                        }
                    };
                    $.extend(settings, properties);
                    try {
                        navigator.notification.confirm(settings.params.message,
							settings.resultCallback, settings.params.title,
							settings.params.buttonlabel);
                    } catch (ex) {

                    }
                },
                prompt: function (properties) {
                    var settings = {
                        resultCallback: function () {
                        },
                        params: {
                            title: undefined,
                            message: undefined,
                            buttonlable: undefined,
                            defaultText: undefined
                        }
                    };
                    $.extend(settings, properties);
                    try {
                        navigator.notification.prompt(settings.params.message,
							settings.resultCallback, settings.params.title,
							settings.params.buttonlabel,
							settings.params.defaultText);
                    } catch (ex) {

                    }
                }

            },
            GeoLocationHelper: {
                getCurrentPosition: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            enableHighAccuracy: undefined,
                            timeout: undefined,
                            maximumAge: undefined
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        navigator.geolocation.getCurrentPosition(
							function (data) {
							    settings.success(data);
							    settings.complete(data, "success");
							}, function (data) {
							    settings.error(data);
							    settings.complete(data, "error");
							}, settings.params);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "success");
                    }
                },
                getwatchPosition: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            frequency: undefined,
                            enableHighAccuracy: undefined,
                            timeout: undefined,
                            maximumAge: undefined
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        navigator.geolocation.watchPosition(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        }, settings.params);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                }

				,
                clearWatch: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            watchID: undefined
                        }

                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        navigator.geolocation.clearWatch(settings.params.watchID);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex);
                    }
                }
            },
            BaiDuLocationHelper: {
                getCurrentPosition: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }

                    };
                    $.extend(settings, properties);
                    // 调用
                    try {
                        LocationPlugin.getLocation(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                }
            },
            ShenCaiFileUploadHelper: {
                onSelectedFile: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            quality: undefined, 									//返回照片质量
                            destinationType: undefined,                               //返回的数据形式
                            sourceType: undefined,                                    //数据来源
                            allowEdit: undefined,                                     //是否允许编辑
                            encodingType: undefined,                                   //照片编码类型
                            targetWidth: undefined, 								//照片宽度
                            targetHeight: undefined,                                   //照片高度
                            popoverOptions: undefined,                                 //iOS 系统中ipad设备独有设置
                            saveToPhotoAlbum: undefined                                //是否存入相册

                        }

                    };
                    $.extend(settings, properties);
                    // 调用
                    try {
                        window.plugins.ShenCaiFileUpload.onSelectedFile(
							function (data) {
							    settings.success(data);
							    settings.complete(data, "success");
							}, function (data) {
							    settings.error(data);
							    settings.complete(data, "error");
							}, settings.params);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                getFileMd5: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            uploadID: undefined
                        }

                    };
                    $.extend(settings, properties);
                    // 调用
                    try {
                        window.plugins.ShenCaiFileUpload.getFileMd5(
							function (data) {
							    settings.success(data);
							    settings.complete(data, "success");
							}, function (data) {
							    settings.error(data);
							    settings.complete(data, "error");
							}, settings.params);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                getFileByteArray: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            uploadID: undefined
                            , byteIndexFrom: undefined
                            , byteIndexTo: undefined
                        }
                    };
                    $.extend(settings, properties);
                    // 调用
                    try {
                        window.plugins.ShenCaiFileUpload.getFileByteArray(
							function (data) {
							    settings.success(data);
							    settings.complete(data, "success");
							}, function (data) {
							    settings.error(data);
							    settings.complete(data, "error");
							}, settings.params);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                }
            },
            PushNotificationHelper: {
                init: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.init(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                getRegistrationID: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }

                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.getRegistrationID(function (
							data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                setAlias: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            alias: undefined

                        }

                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.setAlias(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        }, settings.params.alias);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                setTags: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            tags: undefined

                        }


                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.setTags(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        }, settings.params.tags);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                setTagsWithAlias: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            tags: undefined,
                            alias: undefined
                        }


                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.setTagsWithAlias(function (
							data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        }, settings.params.tags, settings.params.alias);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                clearAllNotification: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.clearAllNotification(
							function (data) {
							    settings.success(data);
							    settings.complete(data, "success");
							}, function (data) {
							    settings.error(data);
							    settings.complete(data, "error");
							});
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                setLatestNotificationNum: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            num: undefined
                        }

                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.setLatestNotificationNum(
							function (data) {
							    settings.success(data);
							    settings.complete(data, "success");
							}, function (data) {
							    settings.error(data);
							    settings.complete(data, "error");
							}, settings.params.num);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                setApplicationIconBadgeNumber: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        },
                        params: {
                            badge: undefined
                        }

                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin
						.setApplicationIconBadgeNumber(function (data) {
						    settings.success(data);
						    settings.complete(data, "success");
						}, function (data) {
						    settings.error(data);
						    settings.complete(data, "error");
						}, settings.params.badge);
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                stopPush: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.stopPush(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                resumePush: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.resumePush(function (data) {
                            settings.success(data);
                            settings.complete(data, "success");
                        }, function (data) {
                            settings.error(data);
                            settings.complete(data, "error");
                        });
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                setAutoNotificationOpen: function (properties) {
                    var settings = {
                        success: function () {
                        },
                        error: function () {
                        },
                        complete: function () {
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.setAutoNotificationOpen(
							function (data) {
							    settings.success(data);
							    settings.complete(data, "success");
							}, function (data) {
							    settings.error(data);
							    settings.complete(data, "error");
							});
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                },
                setAutoNotificationClose: function (properties) {
                    var settings = {
                        success: function (properties) {
                        },
                        error: function (properties) {
                        },
                        complete: function (properties) {
                        }
                    };
                    $.extend(settings, properties);

                    // 调用
                    try {
                        window.plugins.jPushPlugin.setAutoNotificationClose(
							function (data) {
							    settings.success(data);
							    settings.complete(data, "success");
							}, function (data) {
							    settings.error(data);
							    settings.complete(data, "error");
							});
                    } catch (ex) {
                        settings.error(ex);
                        settings.complete(ex, "error");
                    }
                }

            },
            AppLicationHelper: {
                exitApp: function () {
                    try {
                        navigator.app.exitApp();
                    } catch (ex) {
                        settings.error();
                    }
                },
                clearCache: function () {
                    try {
                        navigator.app.clearCache();
                    } catch (ex) {
                        settings.error();
                    }
                },
                cancelLoadUrl: function () {
                    try {
                        navigator.app.cancelLoadUrl();
                    } catch (ex) {
                        settings.error();
                    }
                },
                clearHistory: function () {
                    try {
                        navigator.app.clearHistory();
                    } catch (ex) {
                        settings.error();
                    }
                },
                backHistory: function () {
                    try {
                        navigator.app.backHistory();
                    } catch (ex) {
                        settings.error();
                    }
                },
                loadUrl: function (properties) {
                    var settings = {
                        url: undefined,
                        props: undefined

                    };
                    $.extend(settings, properties);
                    try {
                        navigator.app.loadUrl(settings.url, settings.props);
                    } catch (ex) {
                        settings.error();
                    }
                }
            }
        }
    };

    fw.fwControl = {
        FWControlHelper: {
            clear: function (selector) {
                var selectorJQ;
                if (selector == undefined) {
                    selectorJQ = $("*");
                } else {
                    selectorJQ = $(selector);
                }
                ;
                $("[name]", selectorJQ).val();
            },
            setData: function (selector, data) {
                var selectorJQ;
                if (selector == undefined) {
                    selectorJQ = $("*");
                } else {
                    selectorJQ = $(selector);
                }
                ;
                fw.fwControl.FWControlHelper.clear(selector);

                for (var name in data) {
                    var value = data[name];
                    try {
                        $("[name^='" + name + "']", selectorJQ)
								.each(
										function () {
										    var thisJQ = $(this);
										    var dataRole = thisJQ
													.attr("data-role");
										    if ('/P/TD/DIV/SPAN/LABLE/'
													.indexOf(this.tagName) > -1) {
										        var type = $(this).attr("type");
										        switch (type) {
										            case "date":
										                thisJQ.html(fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(value), "yyyy-MM-dd"));
										                break;
										            default:
										                thisJQ.html(value);
										                break;
										        };
										    } else if ('/IMG/'
													.indexOf(this.tagName) > -1) {
										        thisJQ.attr("src", value);
										    } else if ('/SELECT/'
													.indexOf(this.tagName) > -1) {
										        thisJQ.val(value);
										        switch (dataRole) {
										            case "slider":
										                thisJQ.slider("refresh");
										                break;
										            case "flipswitch":
										                thisJQ.flipswitch("refresh");
										                break;
										            default:
										                thisJQ.selectmenu(
															"refresh", true);
										                break;
										        }
										        ;
										    } else {
										        thisJQ.val(value);
										        var type = $(this).attr("type");
										        switch (type) {
										            case "number":
										                thisJQ.slider("refresh");
										                break;
										        }
										        ;
										    }
										    ;
										});
                    } catch (ex) {

                    }
                    ;
                }
                ;
            },
            getData: function (selector) {
                var selectorJQ;
                if (selector == undefined) {
                    selectorJQ = $("*");
                } else {
                    selectorJQ = $(selector);
                }
                ;
                fw.fwControl.FWControlHelper.clear(selector);

                var data = {};
                $("[name]", selectorJQ).each(function () {
                    var thisJQ = $(this);
                    if ('/P/TD/DIV/SPAN/LABLE/'
													.indexOf(this.tagName) > -1) {
                        data[$(this).attr("name")] = $(this).html();
                    } else {
                        data[$(this).attr("name")] = $(this).val();
                    }
                    ;
                });
                return data;
            }
        }
    };
})(window);
