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
define("esri/layers/KMLLayer",["dijit","dojo","dojox","dojo/require!esri/utils,esri/layers/layer,esri/layers/MapImageLayer,esri/layers/FeatureLayer,esri/dijit/Popup"],function(_1,_2,_3){_2.provide("esri.layers.KMLLayer");_2.require("esri.utils");_2.require("esri.layers.layer");_2.require("esri.layers.MapImageLayer");_2.require("esri.layers.FeatureLayer");_2.require("esri.dijit.Popup");_2.declare("esri.layers.KMLLayer",[esri.layers.Layer],{serviceUrl:"http://utility.arcgis.com/sharing/kml",constructor:function(_4,_5){if(!_4){console.log("KMLLayer:constructor - please provide url for the KML file");}this._outSR=(_5&&_5.outSR)||new esri.SpatialReference({wkid:4326});this._options=_5;if(esri.config.defaults.kmlService){this.serviceUrl=esri.config.defaults.kmlService;}var _6=(this.linkInfo=_5&&_5.linkInfo);if(_6){this.visible=!!_6.visibility;this._waitingForMap=!!_6.viewFormat;}if(!_6||(_6&&_6.visibility&&!this._waitingForMap)){this._parseKml();}this.refresh=_2.hitch(this,this.refresh);},getFeature:function(_7){if(!_7){return;}var _8=_7.type,id=_7.id,_9,i,_a;switch(_8){case "esriGeometryPoint":case "esriGeometryPolyline":case "esriGeometryPolygon":var _b=this["_"+_8];if(_b){_9=_2.getObject("_mode._featureMap."+id,false,_b);}break;case "GroundOverlay":var _c=this._groundLyr;if(_c){var _d=_c.getImages();_a=_d.length;for(i=0;i<_a;i++){if(_d[i].id===id){_9=_d[i];break;}}}break;case "ScreenOverlay":break;case "NetworkLink":_2.some(this._links,function(_e){if(_e.linkInfo&&_e.linkInfo.id===id){_9=_e;return true;}else{return false;}});break;case "Folder":var _f=this.folders;_a=_f?_f.length:0;for(i=0;i<_a;i++){if(_f[i].id===id){_9=_f[i];break;}}break;default:console.log("KMLLayer:getFeature - unknown feature type");break;}return _9;},getLayers:function(){var _10=[];if(this._groundLyr){_10.push(this._groundLyr);}if(this._fLayers){_10=_10.concat(this._fLayers);}if(this._links){_2.forEach(this._links,function(_11){if(_11.declaredClass){_10.push(_11);}});}return _10;},setFolderVisibility:function(_12,_13){if(!_12){return;}this._fireUpdateStart();_12.visible=_13;if(_13){_13=this._areLocalAncestorsVisible(_12);}this._setState(_12,_13);this._fireUpdateEnd();},onRefresh:function(){},_parseKml:function(map){var _14=this;this._fireUpdateStart();this._io=esri.request({url:this.serviceUrl,content:{url:this._url.path+this._getQueryParameters(map),model:"simple",folders:"",refresh:this.loaded?true:undefined,outSR:_2.toJson(this._outSR.toJson())},callbackParamName:"callback",load:function(_15){_14._io=null;_14._initLayer(_15);},error:function(err){_14._io=null;err=_2.mixin(new Error(),err);err.message="Unable to load KML: "+_14.url+" "+(err.message||"");_14._fireUpdateEnd(err);_14.onError(err);}});},_initLayer:function(_16){if(this.loaded){this._removeInternalLayers();}this.name=_16.name;this.description=_16.description;this.snippet=_16.snippet;this.visibility=_16.visibility;this.featureInfos=_16.featureInfos;var i,len;var _17=(this.folders=_16.folders),_18=[],_19;if(_17){len=_17.length;for(i=0;i<len;i++){_19=(_17[i]=new esri.layers.KMLFolder(_17[i]));if(_19.parentFolderId===-1){_18.push(_19);}}}var _1a=(this._links=_16.networkLinks),_1b;len=_1a?_1a.length:0;for(i=0;i<len;i++){if(_1a[i].viewRefreshMode&&_1a[i].viewRefreshMode.toLowerCase().indexOf("onregion")!==-1){continue;}_1b=_2.mixin({},this._options);_1b.linkInfo=_1a[i];if(_1b.id){_1b.id=_1b.id+"_"+i;}_1a[i]=new esri.layers.KMLLayer(_1a[i].href,_1b);_1a[i]._parentLayer=this;_1a[i]._parentFolderId=this._getLinkParentId(_1a[i].linkInfo.id);}var _1c=_16.groundOverlays;if(_1c&&_1c.length>0){_1b=_2.mixin({},this._options);if(_1b.id){_1b.id=_1b.id+"_"+"mapImage";}var _1d=(this._groundLyr=new esri.layers.MapImageLayer(_1b));len=_1c.length;for(i=0;i<len;i++){_1d.addImage(new esri.layers.KMLGroundOverlay(_1c[i]));}}var _1e=_2.getObject("featureCollection.layers",false,_16);if(_1e&&_1e.length>0){this._fLayers=[];_2.forEach(_1e,function(_1f,i){var _20=_2.getObject("featureSet.features",false,_1f),_21;if(_20&&_20.length>0){_1b=_2.mixin({outFields:["*"],infoTemplate:_1f.popupInfo?new esri.dijit.PopupTemplate(_1f.popupInfo):null,editable:false},this._options);if(_1b.id){_1b.id=_1b.id+"_"+i;}_1f.layerDefinition.capabilities="Query,Data";_21=new esri.layers.FeatureLayer(_1f,_1b);if(_21.geometryType){this["_"+_21.geometryType]=_21;}this._fLayers.push(_21);}},this);if(this._fLayers.length===0){delete this._fLayers;}}len=_18.length;for(i=0;i<len;i++){_19=_18[i];this._setState(_19,_19.visible);}this._fireUpdateEnd();if(this.loaded){this._addInternalLayers();this.onRefresh();}else{this.loaded=true;this.onLoad(this);}},_addInternalLayers:function(){var map=this._map;this._fireUpdateStart();if(this._links){_2.forEach(this._links,function(_22){if(_22.declaredClass){map.addLayer(_22);if(_22._waitingForMap){_22._waitingForMap=null;if(_22.visible){_22._parseKml(map);}else{_22._wMap=map;}}}});}var _23=map.spatialReference,_24=this._outSR,_25;if(!_23.equals(_24)){if(_23.isWebMercator()&&_24.wkid===4326){_25=esri.geometry.geographicToWebMercator;}else{if(_24.isWebMercator()&&_23.wkid===4326){_25=esri.geometry.webMercatorToGeographic;}else{console.log("KMLLayer:_setMap - unsupported workflow. Spatial reference of the map and kml layer do not match, and the conversion cannot be done on the client.");return;}}}if(this._groundLyr){if(_25){_2.forEach(this._groundLyr.getImages(),function(_26){_26.extent=_25(_26.extent);});}map.addLayer(this._groundLyr);}var _27=this._fLayers;if(_27&&_27.length>0){_2.forEach(_27,function(_28){if(_25){var _29=_28.graphics,i,_2a,len=_29?_29.length:0;for(i=0;i<len;i++){_2a=_29[i].geometry;if(_2a){_29[i].setGeometry(_25(_2a));}}}map.addLayer(_28);});}this.onVisibilityChange(this.visible);},_removeInternalLayers:function(){var map=this._map;if(this._links){_2.forEach(this._links,function(_2b){if(_2b.declaredClass&&_2b._io){_2b._io.cancel();}});}if(map){_2.forEach(this.getLayers(),map.removeLayer,map);}},_setState:function(_2c,_2d){var _2e=_2c.featureInfos,_2f,_30,i,len=_2e?_2e.length:0,_31=_2d?"show":"hide";for(i=0;i<len;i++){_2f=_2e[i];_30=this.getFeature(_2f);if(!_30){continue;}if(_2f.type==="Folder"){this._setState(_30,_2d&&_30.visible);}else{if(_2f.type==="NetworkLink"){this._setInternalVisibility(_30,_2d);}else{_30[_31]();}}}},_areLocalAncestorsVisible:function(_32){var _33=_32.parentFolderId,_34=_32.visible;while(_34&&_33!==-1){var _35=this.getFeature({type:"Folder",id:_33});_34=_34&&_35.visible;_33=_35.parentFolderId;}return _34;},_setInternalVisibility:function(_36,_37){var _38=_36._parentLayer,_39=_36._parentFolderId;_37=_37&&_36.visible;while(_37&&_38){_37=_37&&_38.visible;if(_39>-1){_37=_37&&_38._areLocalAncestorsVisible(_38.getFeature({type:"Folder",id:_39}));}_39=_38._parentFolderId;_38=_38._parentLayer;}this._setIntState(_36,_37);},_setIntState:function(_3a,_3b){if(!_3a){return;}_2.forEach(_3a.getLayers(),function(_3c){if(_3c.linkInfo){_3a._setIntState(_3c,_3b&&_3c.visible&&_3a._areLocalAncestorsVisible(_3a.getFeature({type:"Folder",id:_3c._parentFolderId})));}else{_3c.setVisibility(_3b);}});},_getLinkParentId:function(id){var _3d=-1;if(this.folders){_2.some(this.folders,function(_3e){if(_3e.networkLinkIds&&_2.indexOf(_3e.networkLinkIds,id)!==-1){_3d=_3e.id;return true;}return false;});}return _3d;},_checkAutoRefresh:function(){var _3f=this.linkInfo;if(_3f){if(this.visible){if(this.loaded&&this._map){var _40=_3f.refreshMode,_41=_3f.refreshInterval,_42=_3f.viewRefreshMode,_43=_3f.viewRefreshTime;if(_40&&_40.toLowerCase().indexOf("oninterval")!==-1&&_41>0){this._stopAutoRefresh();this._timeoutHandle=setTimeout(this.refresh,_41*1000);}if(_42&&_42.toLowerCase().indexOf("onstop")!==-1&&_43>0){if(!this._extChgHandle){this._extChgHandle=_2.connect(this._map,"onExtentChange",this,this._extentChanged);}}}}else{this._stopAutoRefresh();_2.disconnect(this._extChgHandle);delete this._extChgHandle;}}},_stopAutoRefresh:function(){clearTimeout(this._timeoutHandle);this._timeoutHandle=null;},_getQueryParameters:function(map){map=map||this._map;var _44={},_45=this.linkInfo,_46=map&&map.extent,_47;if(this._url.query){_2.mixin(_44,this._url.query);_47=!!this._url.query.token;}if(esri.id&&!_47){var _48=esri.id.findCredential(this._url.path);if(_48){_44.token=_48.token;}}if(_45){var _49=_45.viewFormat,_4a=_45.httpQuery,_4b=_45.viewBoundScale;if(_46&&_49){var _4c=_46,_4d=_46,sr=_46.spatialReference;if(sr){if(sr.isWebMercator()){_4c=esri.geometry.webMercatorToGeographic(_46);}else{if(sr.wkid===4326){_4d=esri.geometry.geographicToWebMercator(_46);}}}var _4e=_4c.getCenter(),_4f=Math.max(_4d.getWidth(),_4d.getHeight());if(_4b){_4c=_4c.expand(_4b);}_49=_49.replace(/\[bboxWest\]/ig,_4c.xmin).replace(/\[bboxEast\]/ig,_4c.xmax).replace(/\[bboxSouth\]/ig,_4c.ymin).replace(/\[bboxNorth\]/ig,_4c.ymax).replace(/\[lookatLon\]/ig,_4e.x).replace(/\[lookatLat\]/ig,_4e.y).replace(/\[lookatRange\]/ig,_4f).replace(/\[lookatTilt\]/ig,0).replace(/\[lookatHeading\]/ig,0).replace(/\[lookatTerrainLon\]/ig,_4e.x).replace(/\[lookatTerrainLat\]/ig,_4e.y).replace(/\[lookatTerrainAlt\]/ig,0).replace(/\[cameraLon\]/ig,_4e.x).replace(/\[cameraLat\]/ig,_4e.y).replace(/\[cameraAlt\]/ig,_4f).replace(/\[horizFov\]/ig,60).replace(/\[vertFov\]/ig,60).replace(/\[horizPixels\]/ig,map.width).replace(/\[vertPixels\]/ig,map.height).replace(/\[terrainEnabled\]/ig,0);_2.mixin(_44,_2.queryToObject(_49));}if(_4a){_4a=_4a.replace(/\[clientVersion\]/ig,esri.version).replace(/\[kmlVersion\]/ig,2.2).replace(/\[clientName\]/ig,"ArcGIS API for JavaScript").replace(/\[language\]/ig,_2.locale);_2.mixin(_44,_2.queryToObject(_4a));}}var _50=[],_51;for(_51 in _44){if(esri._isDefined(_44[_51])){_50.push(_51+"="+_44[_51]);}}_50=_50.join("&");return _50?("?"+_50):"";},_setMap:function(map,_52){this._map=map;var div=this._div=_2.create("div",null,_52);_2.style(div,"position","absolute");this._addInternalLayers();return div;},_unsetMap:function(map,_53){if(this._io){this._io.cancel();}this._stopAutoRefresh();_2.disconnect(this._extChgHandle);delete this._extChgHandle;this._removeInternalLayers();var div=this._div;if(div){_53.removeChild(div);_2.destroy(div);}this._map=this._wMap=this._div=null;},onVisibilityChange:function(_54){if(!this.loaded){if(this.linkInfo&&_54){if(!this._waitingForMap){this._parseKml(this._wMap);}}return;}this._fireUpdateStart();this._setInternalVisibility(this,_54);this._checkAutoRefresh();this._fireUpdateEnd();},refresh:function(){if(!this.loaded||!this._map||this._io){return;}this._parseKml();},_extentChanged:function(){this._stopAutoRefresh();this._timeoutHandle=setTimeout(this.refresh,this.linkInfo.viewRefreshTime*1000);}});_2.declare("esri.layers.KMLGroundOverlay",[esri.layers.MapImage],{constructor:function(_55){if(esri._isDefined(this.visibility)){this.visible=!!this.visibility;}}});_2.declare("esri.layers.KMLFolder",null,{constructor:function(_56){_2.mixin(this,_56);if(esri._isDefined(this.visibility)){this.visible=!!this.visibility;}}});});