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
define("esri/tasks/closestfacility",["dijit","dojo","dojox","dojo/require!esri/tasks/_task,esri/tasks/gp,esri/tasks/na"],function(_1,_2,_3){_2.provide("esri.tasks.closestfacility");_2.require("esri.tasks._task");_2.require("esri.tasks.gp");_2.require("esri.tasks.na");_2.declare("esri.tasks.ClosestFacilityTask",esri.tasks._Task,{constructor:function(_4){this._url.path+="/solveClosestFacility";this._handler=_2.hitch(this,this._handler);},__msigns:[{n:"solve",c:3,a:[{i:0,p:["incidents.features","facilities.features","pointBarriers.features","polylineBarriers.features","polygonBarriers.features"]}],e:2}],_handler:function(_5,io,_6,_7,_8){try{var _9=new esri.tasks.ClosestFacilitySolveResult(_5);this._successHandler([_9],"onSolveComplete",_6,_8);}catch(err){this._errorHandler(err,_7,_8);}},solve:function(_a,_b,_c,_d){var _e=_d.assembly,_f=this._encode(_2.mixin({},this._url.query,{f:"json"},_a.toJson(_e&&_e[0]))),_10=this._handler,_11=this._errorHandler;return esri.request({url:this._url.path,content:_f,callbackParamName:"callback",load:function(r,i){_10(r,i,_b,_c,_d.dfd);},error:function(r){_11(r,_c,_d.dfd);}});},onSolveComplete:function(){}});esri._createWrappers("esri.tasks.ClosestFacilityTask");_2.declare("esri.tasks.ClosestFacilityParameters",null,{accumulateAttributes:null,attributeParameterValues:null,defaultCutoff:null,defaultTargetFacilityCount:null,directionsLanguage:null,directionsLengthUnits:null,directionsOutputType:null,directionsStyleName:null,directionsTimeAttribute:null,doNotLocateOnRestrictedElements:false,facilities:null,impedanceAttribute:null,incidents:null,outputGeometryPrecision:null,outputGeometryPrecisionUnits:null,outputLines:null,outSpatialReference:null,pointBarriers:null,polygonBarriers:null,polylineBarriers:null,restrictionAttributes:null,restrictUTurns:null,returnDirections:false,returnFacilities:false,returnIncidents:false,returnPointBarriers:false,returnPolylgonBarriers:false,returnPolylineBarriers:false,returnRoutes:true,travelDirection:null,useHierarchy:false,timeOfDay:null,timeOfDayUsage:null,toJson:function(_12){var _13={returnDirections:this.returnDirections,returnFacilities:this.returnFacilities,returnIncidents:this.returnIncidents,returnBarriers:this.returnPointBarriers,returnPolygonBarriers:this.returnPolygonBarriers,returnPolylineBarriers:this.returnPolylineBarriers,returnCFRoutes:this.returnRoutes,useHierarchy:this.useHierarchy,attributeParameterValues:this.attributeParameterValues&&_2.toJson(this.attributeParameterValues),defaultCutoff:this.defaultCutoff,defaultTargetFacilityCount:this.defaultTargetFacilityCount,directionsLanguage:this.directionsLanguage,directionsLengthUnits:esri.tasks._NALengthUnit[this.directionsLengthUnits],directionsTimeAttributeName:this.directionsTimeAttribute,impedanceAttributeName:this.impedanceAttribute,outputGeometryPrecision:this.outputGeometryPrecision,outputGeometryPrecisionUnits:this.outputGeometryPrecisionUnits,outputLines:this.outputLines,outSR:this.outSpatialReference?(this.outSpatialReference.wkid||_2.toJson(this.outSpatialReference.toJson())):null,restrictionAttributeNames:this.restrictionAttributes?this.restrictionAttributes.join(","):null,restrictUTurns:this.restrictUTurns,accumulateAttributeNames:this.accumulateAttributes?this.accumulateAttributes.join(","):null,travelDirection:this.travelDirection,timeOfDay:this.timeOfDay&&this.timeOfDay.getTime(),directionsStyleName:this.directionsStyleName};if(this.directionsOutputType){switch(this.directionsOutputType.toLowerCase()){case "complete":_13.directionsOutputType="esriDOTComplete";break;case "complete-no-events":_13.directionsOutputType="esriDOTCompleteNoEvents";break;case "instructions-only":_13.directionsOutputType="esriDOTInstructionsOnly";break;case "standard":_13.directionsOutputType="esriDOTStandard";break;case "summary-only":_13.directionsOutputType="esriDOTSummaryOnly";break;default:_13.directionsOutputType=this.directionsOutputType;}}if(this.timeOfDayUsage){var _14;switch(this.timeOfDayUsage.toLowerCase()){case "start":_14="esriNATimeOfDayUseAsStartTime";break;case "end":_14="esriNATimeOfDayUseAsEndTime";break;default:_14=this.timeOfDayUsage;}_13.timeOfDayUsage=_14;}var _15=this.incidents;if(_15 instanceof esri.tasks.FeatureSet&&_15.features.length>0){_13.incidents=_2.toJson({type:"features",features:esri._encodeGraphics(_15.features,_12&&_12["incidents.features"]),doNotLocateOnRestrictedElements:this.doNotLocateOnRestrictedElements});}else{if(_15 instanceof esri.tasks.DataLayer){_13.incidents=_15;}else{if(_15 instanceof esri.tasks.DataFile){_13.incidents=_2.toJson({type:"features",url:_15.url,doNotLocateOnRestrictedElements:this.doNotLocateOnRestrictedElements});}}}var _16=this.facilities;if(_16 instanceof esri.tasks.FeatureSet&&_16.features.length>0){_13.facilities=_2.toJson({type:"features",features:esri._encodeGraphics(_16.features,_12&&_12["facilities.features"]),doNotLocateOnRestrictedElements:this.doNotLocateOnRestrictedElements});}else{if(_16 instanceof esri.tasks.DataLayer){_13.facilities=_16;}else{if(_16 instanceof esri.tasks.DataFile){_13.facilities=_2.toJson({type:"features",url:_16.url,doNotLocateOnRestrictedElements:this.doNotLocateOnRestrictedElements});}}}var _17=function(_18,_19){if(!_18){return null;}if(_18 instanceof esri.tasks.FeatureSet){if(_18.features.length>0){return _2.toJson({type:"features",features:esri._encodeGraphics(_18.features,_12&&_12[_19])});}else{return null;}}else{if(_18 instanceof esri.tasks.DataLayer){return _18;}else{if(_18 instanceof esri.tasks.DataFile){return _2.toJson({type:"features",url:_18.url});}}}return _2.toJson(_18);};if(this.pointBarriers){_13.barriers=_17(this.pointBarriers,"pointBarriers.features");}if(this.polygonBarriers){_13.polygonBarriers=_17(this.polygonBarriers,"polygonBarriers.features");}if(this.polylineBarriers){_13.polylineBarriers=_17(this.polylineBarriers,"polylineBarriers.features");}return esri.filter(_13,function(_1a){if(_1a!==null){return true;}});}});_2.declare("esri.tasks.ClosestFacilitySolveResult",null,{constructor:function(_1b){if(_1b.directions){this.directions=[];_2.forEach(_1b.directions,function(_1c,idx){var _1d=[],cgs=[];_2.forEach(_1c.features,function(f,i){cgs[i]=f.compressedGeometry;_1d[i]=f.strings;});_1c.strings=_1d;this.directions[idx]=new esri.tasks.DirectionsFeatureSet(_1c,cgs);},this);}if(_1b.routes){this.routes=this._graphicsFromJson(_1b.routes);}if(_1b.facilities){this.facilities=this._graphicsFromJson(_1b.facilities);}if(_1b.incidents){this.incidents=this._graphicsFromJson(_1b.incidents);}if(_1b.barriers){this.pointBarriers=this._graphicsFromJson(_1b.barriers);}if(_1b.polylineBarriers){this.polylineBarriers=this._graphicsFromJson(_1b.polylineBarriers);}if(_1b.polygonBarriers){this.polygonBarriers=this._graphicsFromJson(_1b.polygonBarriers);}if(_1b.messages){this.messages=_2.map(_1b.messages,function(_1e,i){return new esri.tasks.NAMessage(_1e);});}},routes:null,facilities:null,incidents:null,pointBarriers:null,polylineBarriers:null,polygonBarriers:null,directions:null,messages:null,_graphicsFromJson:function(_1f){var sr=new esri.SpatialReference(_1f.spatialReference);var _20=_1f.features;return _2.map(_20,function(_21,i){var _22=new esri.Graphic(_21);_22.geometry.setSpatialReference(sr);return _22;});}});});