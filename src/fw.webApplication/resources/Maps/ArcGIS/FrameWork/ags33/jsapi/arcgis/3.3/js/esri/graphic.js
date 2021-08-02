/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
define("esri/graphic",["dijit","dojo","dojox","dojo/require!esri/geometry,esri/symbol"],function(_1,_2,_3){_2.provide("esri.graphic");_2.require("esri.geometry");_2.require("esri.symbol");_2.declare("esri.Graphic",null,{constructor:function(_4,_5,_6,_7){if(_4&&!(_4 instanceof esri.geometry.Geometry)){this.geometry=_4.geometry?esri.geometry.fromJson(_4.geometry):null;this.symbol=_4.symbol?esri.symbol.fromJson(_4.symbol):null;this.attributes=_4.attributes||null;this.infoTemplate=_4.infoTemplate?new esri.InfoTemplate(_4.infoTemplate):null;}else{this.geometry=_4;this.symbol=_5;this.attributes=_6;this.infoTemplate=_7;}},_shape:null,_graphicsLayer:null,_visible:true,visible:true,getDojoShape:function(){return this._shape;},getLayer:function(){return this._graphicsLayer;},setGeometry:function(_8){this.geometry=_8;var gl=this._graphicsLayer;if(gl){gl._updateExtent(this);gl._draw(this,true);}return this;},setSymbol:function(_9,_a){var gl=this._graphicsLayer,_b=this._shape;this.symbol=_9;if(_9){this.symbol._stroke=this.symbol._fill=null;}if(gl){if(_a){if(_b){gl._removeShape(this);}}gl._draw(this,true);}return this;},setAttributes:function(_c){this.attributes=_c;return this;},setInfoTemplate:function(_d){this.infoTemplate=_d;return this;},_getEffInfoTemplate:function(){var _e=this.getLayer();return this.infoTemplate||(_e&&_e.infoTemplate);},getTitle:function(){var _f=this._getEffInfoTemplate();var _10=_f&&_f.title;if(_2.isFunction(_10)){_10=_10.call(_f,this);}else{if(_2.isString(_10)){var _11=this._graphicsLayer;var _12=_11&&_11._getDateOpts;_10=esri.substitute(this.attributes,_10,{first:true,dateFormat:_12&&_12.call(_11)});}}return _10;},getContent:function(){var _13=this._getEffInfoTemplate();var _14=_13&&_13.content;if(_2.isFunction(_14)){_14=_14.call(_13,this);}else{if(_2.isString(_14)){var _15=this._graphicsLayer;var _16=_15&&_15._getDateOpts;_14=esri.substitute(this.attributes,_14,{dateFormat:_16&&_16.call(_15)});}}return _14;},show:function(){this.visible=this._visible=true;var _17=this._shape,_18;if(_17){_18=_17.declaredClass.toLowerCase().indexOf("canvas")===-1?_17.getEventSource():null;if(_18){esri.show(_18);}}else{if(this._graphicsLayer){this._graphicsLayer._draw(this,true);}}return this;},hide:function(){this.visible=this._visible=false;var _19=this._shape,_1a,_1b;if(_19){_1a=_19.declaredClass.toLowerCase().indexOf("canvas")===-1?_19.getEventSource():null;if(_1a){esri.hide(_1a);}else{_1b=this._graphicsLayer;if(_1b){_1b._removeShape(this);}}}return this;},toJson:function(){var _1c={};if(this.geometry){_1c.geometry=this.geometry.toJson();}if(this.attributes){_1c.attributes=_2.mixin({},this.attributes);}if(this.symbol){_1c.symbol=this.symbol.toJson();}if(this.infoTemplate){_1c.infoTemplate=this.infoTemplate.toJson();}return _1c;}});_2.declare("esri.InfoTemplate",null,{constructor:function(_1d,_1e){if(_1d&&_2.isObject(_1d)&&!_2.isFunction(_1d)){_2.mixin(this,_1d);}else{this.title=_1d||"${*}";this.content=_1e||"${*}";}},setTitle:function(_1f){this.title=_1f;return this;},setContent:function(_20){this.content=_20;return this;},toJson:function(){return esri._sanitize({title:this.title,content:this.content});}});});