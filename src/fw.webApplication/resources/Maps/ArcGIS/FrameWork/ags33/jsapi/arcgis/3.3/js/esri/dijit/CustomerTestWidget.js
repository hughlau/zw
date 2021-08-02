define(["dijit", "dojo", "dojox", "dojo/require!dijit/_Widget,dijit/_Templated,dijit/_Container,esri/InfoWindowBase,esri/utils"],
function (_2)
{
    _2.require("dijit._Container");
    _2.declare("esri.dijit.CustomerTestWidget",{
});

function (_1, _2, _3) {
    _2.provide("esri.dijit.InfoWindow");
    _2.require("dijit._Widget");
    _2.require("dijit._Templated");
    _2.require("dijit._Container");
    _2.require("esri.InfoWindowBase");
    _2.require("esri.utils");
    _2.declare("esri.dijit.InfoWindow", [_1._Widget, _1._Templated, _1._Container, esri.InfoWindowBase],
       { isContainer: true,
           templateString: "<div id=\"${id}.infowindow\" class=\"infowindow\" dojoAttachPoint=\"_infowindow\"\r\n  ><div style=\"position:relative;\"\r\n    ><div class=\"window\" dojoAttachPoint=\"_window\"\r\n      ><div class=\"top\"\r\n        ><div class=\"left\" dojoAttachPoint=\"_topleft\"><div class=\"sprite\"></div></div\r\n    \t\t><div class=\"right\" dojoAttachPoint=\"_topright\"\r\n    \t\t\t><div class=\"sprite\"></div\r\n    \t\t\t><div class=\"user\" dojoAttachPoint=\"_user\"\r\n    \t\t\t  ><div class=\"titlebar\" dojoAttachPoint=\"_titlebar\"\r\n    \t\t\t    ><a class=\"hide\" dojoAttachPoint=\"_hide\" dojoAttachEvent=\"onclick:hide\"><div class=\"sprite\"></div></a\r\n              ><div class=\"title\" dojoAttachPoint=\"_title\">${title}</div\r\n    \t\t\t  ></div\r\n            ><div class=\"border\" dojoAttachPoint=\"_border\"></div\r\n    \t\t\t  ><div class=\"layout content\" dojoAttachPoint=\"_content, containerNode\"\r\n    \t\t\t  ></div\r\n    \t\t\t></div\r\n    \t\t></div\r\n        ><div class=\"bottom\"\r\n          ><div class=\"left\" dojoAttachPoint=\"_bottomleft\"><div class=\"sprite\"></div></div\r\n\t\t      ><div class=\"right\" dojoAttachPoint=\"_bottomright\"><div class=\"sprite\"></div></div\r\n        ></div\r\n      ></div\r\n    ></div\r\n    ><div class=\"pointer\" dojoAttachPoint=\"_pointer\"><div dojoAttachPoint=\"_sprite\" class=\"sprite\"></div></div\r\n  ></div\r\n></div>"
        , anchor: "upperright"
        , fixedAnchor: null
        , coords: null
        , isShowing: true
        , isContentShowing: true
        , isTitleBarShowing: true
        , width: 250
        , height: 150
        , title: "Info Window"
        , startup: function () {
            if (this._started) {
                return;
            }
            this.inherited(arguments);
            this._ANCHORS = [esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT, esri.dijit.InfoWindow.ANCHOR_LOWERRIGHT, esri.dijit.InfoWindow.ANCHOR_LOWERLEFT, esri.dijit.InfoWindow.ANCHOR_UPPERLEFT];
            if (_2.isIE < 7) {
                var _4 = _2.getComputedStyle(this._sprite).backgroundImage.replace(/url\(\"/i, "").replace(/\"\)/, ""), _5 = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', sizingMethod='crop', src='" + _4 + "')"; var s = _2.create("div", null, _2.body()); _2.style(s, { width: "1px", height: "1px", display: "none", backgroundImage: "none", filter: _5 });
                var t = setTimeout(function () {
                    _2.destroy(s); clearTimeout(t);
                    t = s = null;
                }, 100);
                _2.query(".sprite", this.domNode).forEach(function (n) {
                    n.style.backgroundImage = "none"; n.style.filter = _5;
                });
            }
            this.resize(this.width, this.height);
            this.hide();
        }, destroy: function () {
            if (this._destroyed) {
                return;
            }
            this.__unregisterMapListeners();
            this.destroyDijits(this._title);
            this.destroyDijits(this._content);
            this._title.innerHTML = this._content.innerHTML = "";
            this.inherited(arguments);
        }, resize: function (_6, _7) {
            if (!_6 || !_7) {
                return;
            }
            var _8 = _2.style;
            _8(this._topleft, {
                height: _7 + "px",
                marginLeft: _6 + "px"
            });
            _8(this._topright, {
                width: _6 + "px",
                height: _7 + "px"
            });
            _8(this._user, "width", (_6 - 8) + "px");
            _8(this._hide, "marginLeft", (_6 - 22) + "px");
            _8(this._title, "width", (_6 - 25) + "px");
            _8(this._content, "height", (_7 - 37) + "px");
            _8(this._bottomleft, {
                marginLeft: _6 + "px",
                marginTop: _7 + "px"
            });
            _8(this._bottomright, {
                width: (_6 - 5) + "px",
                marginTop: _7 + "px"
            });
            this.width = _6;
            this.height = _7;
            if (this.coords) {
                this._adjustPosition(this.coords, this.anchor);
            }
            this.onResize(_6, _7);
        },
           _adjustPosition: function (_9, _a) {
               var _b = _2.style;
               _b(
            this._infowindow, {
                left: Math.round(_9.x) + "px",
                top: Math.round(_9.y) + "px"
            });
               if (_a === esri.dijit.InfoWindow.ANCHOR_UPPERLEFT) {
                   _b(this._window, {
                       left: null,
                       right: (this.width + 18) + "px",
                       top: null, bottom: (this.height + 50) + "px"
                   });
               }
               else {
                   if (_a === esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT) {
                       _b(this._window, {
                           left: "6px", right: null,
                           top: null,
                           bottom: (this.height + 50) + "px"
                       });
                   }
                   else {
                       if (_a === esri.dijit.InfoWindow.ANCHOR_LOWERRIGHT) {
                           _b(this._window, { left: "6px", right: null, top: "43px", bottom: null });
                       } else {
                           if (_a === esri.dijit.InfoWindow.ANCHOR_LOWERLEFT) {
                               _b(this._window, {
                                   left: null, right: (this.width + 18) + "px", top: "43px", bottom: null
                               });
                           }
                       }
                   }
               }
           },
           show: function (_c, _d) {
               if (!_c) { return; }
               if (_c.spatialReference) {
                   this.mapCoords = _c;
                   _c = this.coords = this.map.toScreen(_c, true);
               }
               else { this.mapCoords = null; this.coords = _c; }
               var _e = this.map._getFrameWidth();
               if (_e !== -1) {
                   _c.x = _c.x % _e; if (_c.x < 0) { _c.x += _e; }
                   if (this.map.width > _e) {
                       var _f = (this.map.width - _e) / 2; while (_c.x < _f) { _c.x += _e; }
                   }
               }
               if (!_d || _2.indexOf(this._ANCHORS, _d) === -1) {
                   _d = this.map.getInfoWindowAnchor(_c);
               }
               _2.removeClass(this._pointer, this.anchor);
               _d = (this.anchor = this.fixedAnchor || _d);
               this._adjustPosition(_c, _d);
               _2.addClass(this._pointer, _d);
               esri.show(this.domNode);
               this.isShowing = true;
               if (!arguments[2]) { this.onShow(); }
           },
           hide: function (evt) {
               esri.hide(this.domNode);
               this.isShowing = false;
               if (!arguments[1]) { this.onHide(); }
           },
           showTitleBar: function () {
               esri.show(this._titlebar);
               esri.show(this._border);
               this.isTitleBarShowing = true;
           },
           hideTitleBar: function () {
               esri.hide(this._titlebar);
               esri.hide(this._border);
               this.isTitleBarShowing = false;
           },
           showContent: function () {
               esri.show(this._content);
               esri.show(this._border); this.isContentShowing = true;
           },
           hideContent: function () {
               esri.hide(this._content);
               esri.hide(this._border);
               this.isContentShowing = false;
           },
           move: function (_10, _11) {
               if (_11) {
                   _10 = this.coords.offset(_10.x, _10.y);
               }
               else {
                   this.coords = _10; if (this.mapCoords) {
                       this.mapCoords = this.map.toMap(_10);
                   }
               }
               _2.style(this._infowindow, {
                   left: Math.round(_10.x) + "px",
                   top: Math.round(_10.y) + "px"
               });
           },
           setFixedAnchor: function (_12) {
               if (_12 && _2.indexOf(this._ANCHORS, _12) === -1) {
                   return;
               } this.fixedAnchor = _12;
               if (this.isShowing) {
                   this.show(this.mapCoords || this.coords, _12);
               }
               this.onAnchorChange(_12);
           },
           setTitle: function (_13) {
               this.destroyDijits(this._title);
               this.__setValue("_title", _13); return this;
           },
           setContent: function (_14) {
               this.destroyDijits(this._content);
               this.__setValue("_content", _14); return this;
           },
           onShow: function () {
               this.__registerMapListeners();
               this.startupDijits(this._title);
               this.startupDijits(this._content);
           },
           onHide: function () {
               this.__unregisterMapListeners();
           },
           onResize: function () { },
           onAnchorChange: function () { }
       });
    _2.mixin(esri.dijit.InfoWindow, {
        ANCHOR_UPPERRIGHT: "upperright",
        ANCHOR_LOWERRIGHT: "lowerright",
        ANCHOR_LOWERLEFT: "lowerleft",
        ANCHOR_UPPERLEFT: "upperleft"
    });
});