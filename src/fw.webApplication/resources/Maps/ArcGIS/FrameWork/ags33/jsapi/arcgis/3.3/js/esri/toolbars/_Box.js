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
define("esri/toolbars/_Box",["dijit","dojo","dojox","dojo/require!dojox/gfx/Moveable,dojox/gfx/matrix"],function(_1,_2,_3){_2.provide("esri.toolbars._Box");_2.require("dojox.gfx.Moveable");_2.require("dojox.gfx.matrix");_2.declare("esri.toolbars._Box",null,{constructor:function(_4,_5,_6,_7,_8,_9){this._graphic=_4;this._map=_5;this._toolbar=_6;this._scale=_7;this._rotate=_8;this._defaultEventArgs={};this._scaleEvent="Scale";this._rotateEvent="Rotate";this._uniformScaling=_9;var _a=_6._options;this._markerSymbol=_a.boxHandleSymbol;this._lineSymbol=_a.boxLineSymbol;this._moveStartHandler=_2.hitch(this,this._moveStartHandler);this._firstMoveHandler=_2.hitch(this,this._firstMoveHandler);this._moveStopHandler=_2.hitch(this,this._moveStopHandler);this._moveHandler=_2.hitch(this,this._moveHandler);this._init();},destroy:function(){this._cleanUp();this._graphic=this._map=this._toolbar=this._markerSymbol=this._lineSymbol=null;},refresh:function(){this._draw();},suspend:function(){_2.forEach(this._getAllGraphics(),function(g){g.hide();});},resume:function(){_2.forEach(this._getAllGraphics(),function(g){g.show();});this._draw();},_init:function(){this._draw();},_cleanUp:function(){if(this._connects){_2.forEach(this._connects,_2.disconnect,_2);}var _b=this._toolbar._scratchGL;if(this._anchors){_2.forEach(this._anchors,function(_c){_b.remove(_c.graphic);var _d=_c.moveable;if(_d){_d.destroy();}});}if(this._box){_b.remove(this._box);}this._box=this._anchors=this._connects=null;},_draw:function(){if(!this._graphic.getDojoShape()){this._cleanUp();return;}var _e=this._map,_f=this._toolbar._scratchGL;var _10=this._getBoxCoords();var _11=new esri.geometry.Polyline(_e.spatialReference);var _12=_2.clone(_2.filter(_10,function(pt,_13){return (_13!==8&&_13%2===0);}));if(_12[0]){_12.push([_12[0][0],_12[0][1]]);}_11.addPath(_12);if(this._rotate){_11.addPath([_10[1],_10[8]]);}if(this._box){this._box.setGeometry(_11);}else{this._box=new esri.Graphic(_11,this._lineSymbol);_f.add(this._box);}if(this._anchors){_2.forEach(this._anchors,function(_14,_15){if(!this._scale){_15=8;}var _16=new esri.geometry.Point(_10[_15],_e.spatialReference);_14.graphic.setGeometry(_16);var mov=_14.moveable,_17=_14.graphic.getDojoShape();if(_17){if(!mov){_14.moveable=this._getMoveable(_14.graphic,_15);}else{if(_17!==mov.shape){mov.destroy();_14.moveable=this._getMoveable(_14.graphic,_15);}}}},this);}else{this._anchors=[];this._connects=[];_2.forEach(_10,function(_18,_19){if(!this._scale&&_19<8){return;}_18=new esri.geometry.Point(_18,_e.spatialReference);var _1a=new esri.Graphic(_18,this._markerSymbol);_f.add(_1a);this._anchors.push({graphic:_1a,moveable:this._getMoveable(_1a,_19)});},this);}},_getBoxCoords:function(_1b){var _1c=this._graphic,map=this._map,_1d=this._getTransformedBoundingBox(_1c),_1e=[],pt,_1f,_20;_2.forEach(_1d,function(_21,_22,arr){pt=_21;_1f=arr[_22+1];if(!_1f){_1f=arr[0];}_20={x:(pt.x+_1f.x)/2,y:(pt.y+_1f.y)/2};if(!_1b){pt=map.toMap(pt);_20=map.toMap(_20);}_1e.push([pt.x,pt.y]);_1e.push([_20.x,_20.y]);});if(this._rotate){var _23=_2.clone(_1e[1]);_23=_1b?{x:_23[0],y:_23[1]}:map.toScreen({x:_23[0],y:_23[1],spatialReference:map.spatialReference});_23.y-=this._toolbar._options.rotateHandleOffset;if(!_1b){_23=map.toMap(_23);}_1e.push([_23.x,_23.y]);}return _1e;},_getTransformedBoundingBox:function(_24){var map=this._map,_25=_24.geometry.getExtent(),_26=_24.geometry.spatialReference,_27=new esri.geometry.Point(_25.xmin,_25.ymax,_26),_28=new esri.geometry.Point(_25.xmax,_25.ymin,_26);_27=map.toScreen(_27);_28=map.toScreen(_28);return [{x:_27.x,y:_27.y},{x:_28.x,y:_27.y},{x:_28.x,y:_28.y},{x:_27.x,y:_28.y}];},_getAllGraphics:function(){var _29=[this._box];if(this._anchors){_2.forEach(this._anchors,function(_2a){_29.push(_2a.graphic);});}_29=_2.filter(_29,esri._isDefined);return _29;},_getMoveable:function(_2b,_2c){var _2d=_2b.getDojoShape();if(!_2d){return;}var _2e=new _3.gfx.Moveable(_2d);_2e._index=_2c;this._connects.push(_2.connect(_2e,"onMoveStart",this._moveStartHandler));this._connects.push(_2.connect(_2e,"onFirstMove",this._firstMoveHandler));this._connects.push(_2.connect(_2e,"onMoveStop",this._moveStopHandler));_2e.onMove=this._moveHandler;var _2f=_2d.getEventSource();if(_2f){_2.style(_2f,"cursor",this._toolbar._cursors["box"+_2c]);}return _2e;},_moveStartHandler:function(_30){this._toolbar["on"+(_30.host._index===8?this._rotateEvent:this._scaleEvent)+"Start"](this._graphic);},_firstMoveHandler:function(_31){var _32=_31.host._index,_33=(this._wrapOffset=_31.host.shape._wrapOffsets[0]||0),_34=this._graphic.getLayer()._div.getTransform(),mx=_3.gfx.matrix,_35,_36,_37,_38=_2.map(this._getBoxCoords(true),function(arr){return {x:arr[0]+_33,y:arr[1]};});_37={x:_38[1].x,y:_38[3].y};this._centerCoord=mx.multiplyPoint(mx.invert(_34),_37);if(_32===8){_35=mx.multiplyPoint(mx.invert(_34),_38[1]);this._startLine=[this._centerCoord,_35];this._moveLine=_2.clone(this._startLine);}else{_35=mx.multiplyPoint(mx.invert(_34),_38[_32]);_36=mx.multiplyPoint(mx.invert(_34),_38[(_32+4)%8]);this._firstMoverToCenter=Math.sqrt((_35.x-this._centerCoord.x)*(_35.x-this._centerCoord.x)+(_35.y-this._centerCoord.y)*(_35.y-this._centerCoord.y));this._startBox=_36;this._startBox.width=(_38[4].x-_38[0].x);this._startBox.height=(_38[4].y-_38[0].y);this._moveBox=_2.clone(this._startBox);this._xfactor=_35.x>_36.x?1:-1;this._yfactor=_35.y>_36.y?1:-1;if(_32===1||_32===5){this._xfactor=0;}else{if(_32===3||_32===7){this._yfactor=0;}}}this._toolbar._beginOperation("BOX");this._toolbar["on"+(_32===8?this._rotateEvent:this._scaleEvent)+"FirstMove"](this._graphic);},_moveHandler:function(_39,_3a){var _3b=_39.host._index,_3c=this._defaultEventArgs,_3d,_3e,tx,pt,_3f,_40,_41,_42=0,_43=0,_44,_45,_46;_3c.angle=0;_3c.scaleX=1;_3c.scaleY=1;if(_3b===8){_3d=this._startLine;_3e=this._moveLine;pt=_3e[1];pt.x+=_3a.dx;pt.y+=_3a.dy;_3f=this._getAngle(_3d,_3e);tx=_3.gfx.matrix.rotategAt(_3f,_3d[0]);this._graphic.getDojoShape().setTransform(tx);_3c.transform=tx;_3c.angle=_3f;_3c.around=_3d[0];}else{_3d=this._startBox;_3e=this._moveBox;_3e.width+=(_3a.dx*this._xfactor);_3e.height+=(_3a.dy*this._yfactor);if(this._uniformScaling){_44=_3e.x+this._xfactor*_3e.width;_45=_3e.y+this._yfactor*_3e.height;_46=Math.sqrt((_44-this._centerCoord.x)*(_44-this._centerCoord.x)+(_45-this._centerCoord.y)*(_45-this._centerCoord.y));_40=_41=_46/this._firstMoverToCenter;_42=this._xfactor*_3d.width/2;_43=this._yfactor*_3d.height/2;}else{_40=_3e.width/_3d.width;_41=_3e.height/_3d.height;}if(isNaN(_40)||_40===Infinity||_40===-Infinity){_40=1;}if(isNaN(_41)||_41===Infinity||_41===-Infinity){_41=1;}tx=_3.gfx.matrix.scaleAt(_40,_41,_3d.x+_42,_3d.y+_43);this._graphic.getDojoShape().setTransform(tx);_3c.transform=tx;_3c.scaleX=_40;_3c.scaleY=_41;_3c.around={x:_3d.x+_42,y:_3d.y+_43};}this._toolbar["on"+(_3b===8?this._rotateEvent:this._scaleEvent)](this._graphic,_3c);},_moveStopHandler:function(_47){var _48=this._graphic,_49=this._toolbar,_4a=_49._geo?esri.geometry.geographicToWebMercator(_48.geometry):_48.geometry,_4b=_4a.spatialReference,_4c=_48.getDojoShape(),_4d=_4c.getTransform(),_4e=_48.getLayer()._div.getTransform();_4a=_4a.toJson();this._updateSegments(_4a.paths||_4a.rings,_4d,_4e,_4b);_4c.setTransform(null);_4a=esri.geometry.fromJson(_4a);_48.setGeometry(_49._geo?esri.geometry.webMercatorToGeographic(_4a,true):_4a);this._draw();this._startBox=this._moveBox=this._xfactor=this._yfactor=null;this._startLine=this._moveLine=null;_49._endOperation("BOX");this._defaultEventArgs.transform=_4d;_49["on"+(_47.host._index===8?this._rotateEvent:this._scaleEvent)+"Stop"](this._graphic,this._defaultEventArgs);},_updateSegments:function(_4f,_50,_51,_52){var mx=_3.gfx.matrix,map=this._map,_53=this._wrapOffset||0;_2.forEach(_4f,function(_54){_2.forEach(_54,function(_55){var _56=map.toScreen({x:_55[0],y:_55[1],spatialReference:_52},true);_56.x+=_53;_56=mx.multiplyPoint([_51,_50,mx.invert(_51)],_56);_56.x-=_53;var _57=map.toMap(_56);_55[0]=_57.x;_55[1]=_57.y;});});},_getAngle:function(_58,_59){var _5a=Math.atan2(_58[0].y-_58[1].y,_58[0].x-_58[1].x)*180/Math.PI,_5b=Math.atan2(_59[0].y-_59[1].y,_59[0].x-_59[1].x)*180/Math.PI;return _5b-_5a;}});});