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
define("esri/dijit/editing/tools/EditingTools",["dijit","dojo","dojox","dojo/require!esri/dijit/editing/tools/MenuItemBase"],function(_1,_2,_3){_2.require("esri.dijit.editing.tools.MenuItemBase");_2.provide("esri.dijit.editing.tools.EditingTools");_2.declare("esri.dijit.editing.tools.Edit",[esri.dijit.editing.tools.MenuItemBase],{enable:function(_4){this._enabled=_4===this._geomType;this.inherited(arguments);}});esri.dijit.editing.tools.EditingTools={point:{id:"esriPointTool",_enabledIcon:"toolbarIcon pointIcon",_disabledIcon:"toolbarIcon pointIconDisabled",_drawType:esri.toolbars.Draw.POINT,_geomType:"esriGeometryPoint",_label:"NLS_pointLbl"},polyline:{id:"toolDrawFreehandPolyline",_enabledIcon:"toolbarIcon polylineIcon",_disabledIcon:"toolbarIcon polylineIconDisabled",_drawType:esri.toolbars.Draw.POLYLINE,_geomType:"esriGeometryPolyline",_label:"NLS_polylineLbl"},freehandpolyline:{id:"toolDrawPolyline",_enabledIcon:"toolbarIcon freehandPolylineIcon",_disabledIcon:"toolbarIcon freehandPolylineIcon",_drawType:esri.toolbars.Draw.FREEHAND_POLYLINE,_geomType:"esriGeometryPolyline",_label:"NLS_freehandPolylineLbl"},polygon:{id:"toolDrawPolygon",_enabledIcon:"toolbarIcon polygonIcon",_disabledIcon:"toolbarIcon polygonIconDisabled",_drawType:esri.toolbars.Draw.POLYGON,_geomType:"esriGeometryPolygon",_label:"NLS_polygonLbl"},freehandpolygon:{id:"toolDrawFreehandPolygon",_enabledIcon:"toolbarIcon freehandPolygonIcon",_disabledIcon:"toolbarIcon freehandPolygonIconDisabled",_drawType:esri.toolbars.Draw.FREEHAND_POLYGON,_label:"NLS_freehandPolygonLbl",_geomType:"esriGeometryPolygon"},autocomplete:{id:"btnFeatureAutoComplete",_enabledIcon:"toolbarIcon autoCompleteIcon",_disabledIcon:"toolbarIcon autoCompleteIcon",_drawType:esri.toolbars.Draw.POLYGON,_label:"NLS_autoCompleteLbl",_geomType:"esriGeometryPolygon"},rectangle:{id:"toolDrawRect",_enabledIcon:"toolbarIcon rectangleIcon",_disabledIcon:"toolbarIcon rectangleIcon",_drawType:esri.toolbars.Draw.RECTANGLE,_geomType:"esriGeometryPolygon",_label:"NLS_rectangleLbl"},arrow:{id:"toolDrawArrow",_enabledIcon:"toolbarIcon arrowIcon",_disabledIcon:"toolbarIcon arrowIcon",_drawType:esri.toolbars.Draw.ARROW,_geomType:"esriGeometryPolygon",_label:"NLS_arrowLbl"},uparrow:{id:"toolDrawArrowUp",_enabledIcon:"toolbarIcon arrowUpIcon",_disabledIcon:"toolbarIcon arrowUpIcon",_drawType:esri.toolbars.Draw.UP_ARROW,_geomType:"esriGeometryPolygon",_label:"NLS_arrowUpLbl"},downarrow:{id:"toolDrawDownArrow",_enabledIcon:"toolbarIcon arrowDownIcon",_disabledIcon:"toolbarIcon arrowDownIcon",_drawType:esri.toolbars.Draw.DOWN_ARROW,_geomType:"esriGeometryPolygon",_label:"NLS_arrowDownLbl"},leftarrow:{id:"toolDrawLeftArrow",_enabledIcon:"toolbarIcon arrowLeftIcon",_disabledIcon:"toolbarIcon arrowLeftIcon",_drawType:esri.toolbars.Draw.LEFT_ARROW,_geomType:"esriGeometryPolygon",_label:"NLS_arrowLeftLbl"},rightarrow:{id:"toolDrawRightArrow",_enabledIcon:"toolbarIcon arrowIcon",_disabledIcon:"toolbarIcon arrowIcon",_drawType:esri.toolbars.Draw.RIGHT_ARROW,_geomType:"esriGeometryPolygon",_label:"NLS_arrowRightLbl"},circle:{id:"toolDrawCircle",_enabledIcon:"toolbarIcon circleIcon",_disabledIcon:"toolbarIcon circleIcon",_drawType:esri.toolbars.Draw.CIRCLE,_geomType:"esriGeometryPolygon",_label:"NLS_circleLbl"},ellipse:{id:"toolDrawEllipse",_enabledIcon:"toolbarIcon ellipseIcon",_disabledIcon:"toolbarIcon ellipseIcon",_drawType:esri.toolbars.Draw.ELLIPSE,_geomType:"esriGeometryPolygon",_label:"NLS_ellipseLbl"},triangle:{id:"toolDrawTriangle",_enabledIcon:"toolbarIcon triangleIcon",_disabledIcon:"toolbarIcon triangleIcon",_drawType:esri.toolbars.Draw.TRIANGLE,_geomType:"esriGeometryPolygon",_label:"NLS_triangleLbl"},attributes:{id:"btnAttributes",_enabledIcon:"toolbarIcon attributesIcon",_disabledIcon:"toolbarIcon attributesIcon",_enabled:false,_label:"NLS_attributesLbl"},del:{id:"btnDelete2",_enabledIcon:"toolbarIcon deleteFeatureIcon",_disabledIcon:"toolbarIcon deleteFeatureIcon",_enabled:false,_label:"NLS_deleteLbl"},undo:{id:"btnUndo",_enabledIcon:"dijitEditorIcon dijitEditorIconUndo",_disabledIcon:"dijitEditorIcon dijitEditorIconUndo",_enabled:false,_label:"NLS_undoLbl"},redo:{id:"btnRedo",_enabledIcon:"dijitEditorIcon dijitEditorIconRedo",_disabledIcon:"dijitEditorIcon dijitEditorIconRedo",_enabled:false,_label:"NLS_redoLbl"}};});