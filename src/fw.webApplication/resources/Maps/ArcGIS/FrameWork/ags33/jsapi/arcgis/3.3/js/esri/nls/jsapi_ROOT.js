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
define("esri/nls/jsapi_ROOT",{"dijit/form/nls/validate":{"rangeMessage":"This value is out of range.","invalidMessage":"The value entered is not valid.","missingMessage":"This value is required."},"esri/nls/jsapi":{"arcgis":{"utils":{"geometryServiceError":"Provide a geometry service to open Web Map.","baseLayerError":"Unable to load the base map layer"}},"toolbars":{"draw":{"addShape":"Click to add a shape, or press down to start and let go to finish","finish":"Double-click to finish","invalidType":"Unsupported geometry type","resume":"Click to continue drawing","addPoint":"Click to add a point","freehand":"Press down to start and let go to finish","complete":"Double-click to complete","start":"Click to start drawing","addMultipoint":"Click to start adding points","convertAntiClockwisePolygon":"Polygons drawn in anti-clockwise direction will be reversed to be clockwise."},"edit":{"invalidType":"Unable to activate the tool. Check if the tool is valid for the given geometry type.","deleteLabel":"Delete"}},"widgets":{"attributeInspector":{"NLS_title":"Edit Attributes","NLS_validationFlt":"Value must be a float.","NLS_noFeaturesSelected":"No features selected","NLS_validationInt":"Value must be an integer.","NLS_next":"Next","NLS_errorInvalid":"Invalid","NLS_previous":"Previous","NLS_first":"First","NLS_deleteFeature":"Delete","NLS_of":"of","NLS_last":"Last"},"legend":{"NLS_creatingLegend":"Creating legend","NLS_noLegend":"No legend"},"timeSlider":{"NLS_previous":"Previous","NLS_play":"Play/Pause","NLS_next":"Next","NLS_invalidTimeExtent":"TimeExtent not specified, or in incorrect format.","NLS_first":"First"},"templatePicker":{"loading":"Loading..","creationDisabled":"Feature creation is disabled for all layers."},"editor":{"tools":{"NLS_pointLbl":"Point","NLS_reshapeLbl":"Reshape","NLS_arrowLeftLbl":"Left Arrow","NLS_triangleLbl":"Triangle","NLS_autoCompleteLbl":"Auto Complete","NLS_arrowDownLbl":"Down Arrow","NLS_selectionRemoveLbl":"Subtract from selection","NLS_unionLbl":"Union","NLS_freehandPolylineLbl":"Freehand Polyline","NLS_rectangleLbl":"Rectangle","NLS_ellipseLbl":"Ellipse","NLS_attributesLbl":"Attributes","NLS_arrowUpLbl":"Up Arrow","NLS_arrowRightLbl":"Right Arrow","NLS_undoLbl":"Undo","NLS_arrowLbl":"Arrow","NLS_cutLbl":"Cut","NLS_polylineLbl":"Polyline","NLS_selectionClearLbl":"Clear selection","NLS_polygonLbl":"Polygon","NLS_selectionUnionLbl":"Union","NLS_freehandPolygonLbl":"Freehand Polygon","NLS_deleteLbl":"Delete","NLS_extentLbl":"Extent","NLS_selectionNewLbl":"New selection","NLS_circleLbl":"Circle","NLS_redoLbl":"Redo","NLS_selectionAddLbl":"Add to selection"}},"attachmentEditor":{"NLS_error":"There was an error.","NLS_attachments":"Attachments:","NLS_none":"None","NLS_add":"Add","NLS_fileNotSupported":"This file type is not supported."},"overviewMap":{"NLS_invalidSR":"spatial reference of the given layer is not compatible with the main map","NLS_invalidType":"unsupported layer type. Valid types are 'TiledMapServiceLayer' and 'DynamicMapServiceLayer'","NLS_noMap":"'map' not found in input parameters","NLS_hide":"Hide Map Overview","NLS_drag":"Drag To Change The Map Extent","NLS_maximize":"Maximize","NLS_noLayer":"main map does not have a base layer","NLS_restore":"Restore","NLS_show":"Show Map Overview"},"measurement":{"NLS_length_kilometers":"Kilometers","NLS_area_sq_miles":"Sq Miles","NLS_length_yards":"Yards","NLS_distance":"Distance","NLS_area_acres":"Acres","NLS_resultLabel":"Measurement Result","NLS_length_miles":"Miles","NLS_area_hectares":"Hectares","NLS_deg_min_sec":"DMS","NLS_area":"Area","NLS_area_sq_meters":"Sq Meters","NLS_latitude":"Latitude","NLS_area_sq_kilometers":"Sq Kilometers","NLS_area_sq_feet":"Sq Feet","NLS_longitude":"Longitude","NLS_location":"Location","NLS_decimal_degrees":"Degrees","NLS_length_feet":"Feet","NLS_area_sq_yards":"Sq Yards","NLS_length_meters":"Meters","NLS_map_coordinate":"Map Coordinate"},"bookmarks":{"NLS_add_bookmark":"Add Bookmark","NLS_new_bookmark":"Untitled","NLS_bookmark_edit":"Edit","NLS_bookmark_remove":"Remove"},"popup":{"NLS_attach":"Attachments","NLS_nextFeature":"Next feature","NLS_moreInfo":"More info","NLS_searching":"Searching","NLS_maximize":"Maximize","NLS_noAttach":"No attachments found","NLS_noInfo":"No information available","NLS_pagingInfo":"(${index} of ${total})","NLS_restore":"Restore","NLS_prevFeature":"Previous feature","NLS_nextMedia":"Next media","NLS_close":"Close","NLS_zoomTo":"Zoom to","NLS_prevMedia":"Previous media"},"Geocoder":{"main":{"geocoderMenuButtonTitle":"Change Geocoder","untitledGeocoder":"Untitled geocoder","clearButtonTitle":"Clear Search","searchButtonTitle":"Search","geocoderMenuCloseTitle":"Close Menu","geocoderMenuHeader":"Select geocoder"},"esriGeocoderName":"Esri World Geocoder"},"print":{"NLS_printing":"Printing","NLS_printout":"Printout","NLS_print":"Print"}},"geometry":{"deprecateToMapPoint":"esri.geometry.toMapPoint deprecated. Use esri.geometry.toMapGeometry.","deprecateToScreenPoint":"esri.geometry.toScreenPoint deprecated. Use esri.geometry.toScreenGeometry."},"identity":{"noAuthService":"Unable to access the authentication service.","lblCancel":"Cancel","lblUser":"User Name:","title":"Sign in","forbidden":"The username and password are valid, but you don't have access to this resource.","errorMsg":"Invalid username/password. Please try again.","lblItem":"item","lblOk":"OK","info":"Please sign in to access the item on ${server} ${resource}","lblSigning":"Signing in...","invalidUser":"The username or password you entered is incorrect.","lblPwd":"Password:"},"io":{"proxyNotSet":"esri.config.defaults.io.proxyUrl is not set."},"virtualearth":{"vetiledlayer":{"bingMapsKeyNotSpecified":"BingMapsKey must be provided."},"vegeocode":{"bingMapsKeyNotSpecified":"BingMapsKey must be provided.","requestQueued":"Server token not retrieved. Queing request to be executed after server token retrieved."}},"layers":{"FeatureLayer":{"createUserHours":"Created by ${userId} ${hours} hours ago","editUserMinutes":"Edited by ${userId} ${minutes} minutes ago","editHour":"Edited an hour ago","editMinute":"Edited a minute ago","editUserMinute":"Edited by ${userId} a minute ago","editSeconds":"Edited seconds ago","createUserFull":"Created by ${userId} on ${formattedDate} at ${formattedTime}","editWeekDay":"Edited on ${weekDay} at ${formattedTime}","createUserMinutes":"Created by ${userId} ${minutes} minutes ago","createUserHour":"Created by ${userId} an hour ago","editUserSeconds":"Edited by ${userId} seconds ago","editUserWeekDay":"Edited by ${userId} on ${weekDay} at ${formattedTime}","editUserFull":"Edited by ${userId} on ${formattedDate} at ${formattedTime}","createFull":"Created on ${formattedDate} at ${formattedTime}","editUser":"Edited by ${userId}","noOIDField":"objectIdField is not set [url: ${url}]","editUserHour":"Edited by ${userId} an hour ago","createHour":"Created an hour ago","updateError":"an error occurred while updating the layer","createUserWeekDay":"Created by ${userId} on ${weekDay} at ${formattedTime}","invalidParams":"query contains one or more unsupported parameters","editHours":"Edited ${hours} hours ago","noGeometryField":"unable to find a field of type 'esriFieldTypeGeometry' in the layer 'fields' information. If you are using a map service layer, features will not have geometry [url: ${url}]","createUserMinute":"Created by ${userId} a minute ago","createUser":"Created by ${userId}","createMinute":"Created a minute ago","createMinutes":"Created ${minutes} minutes ago","fieldNotFound":"unable to find '${field}' field in the layer 'fields' information [url: ${url}]","createHours":"Created ${hours} hours ago","editUserHours":"Edited by ${userId} ${hours} hours ago","editMinutes":"Edited ${minutes} minutes ago","createSeconds":"Created seconds ago","createUserSeconds":"Created by ${userId} seconds ago","createWeekDay":"Created on ${weekDay} at ${formattedTime}","editFull":"Edited on ${formattedDate} at ${formattedTime}"},"dynamic":{"imageError":"Unable to load image"},"tiled":{"tileError":"Unable to load tile"},"imageParameters":{"deprecateBBox":"Property 'bbox' deprecated. Use property 'extent'."},"agstiled":{"deprecateRoundrobin":"Constructor option 'roundrobin' deprecated. Use option 'tileServers'."},"graphics":{"drawingError":"Unable to draw graphic "}},"tasks":{"gp":{"gpDataTypeNotHandled":"GP Data type not handled."},"query":{"invalid":"Unable to perform query. Please check your parameters."},"na":{"route":{"routeNameNotSpecified":"'RouteName' not specified for atleast 1 stop in stops FeatureSet."}}},"map":{"deprecateShiftDblClickZoom":"Map.(enable/disable)ShiftDoubleClickZoom deprecated. Shift-Double-Click zoom behavior will not be supported.","deprecateReorderLayerString":"Map.reorderLayer(/*String*/ id, /*Number*/ index) deprecated. Use Map.reorderLayer(/*Layer*/ layer, /*Number*/ index)."}},"dojo/cldr/nls/gregorian":{"months-format-narrow":["1","2","3","4","5","6","7","8","9","10","11","12"],"quarters-standAlone-narrow":["1","2","3","4"],"field-weekday":"Day of the Week","dateFormatItem-yQQQ":"y QQQ","dateFormatItem-yMEd":"E, y-M-d","dateFormatItem-MMMEd":"E MMM d","eraNarrow":["BCE","CE"],"dateTimeFormats-appendItem-Day-Of-Week":"{0} {1}","dateFormat-long":"y MMMM d","months-format-wide":["1","2","3","4","5","6","7","8","9","10","11","12"],"dateTimeFormat-medium":"{1} {0}","dayPeriods-format-wide-pm":"PM","dateFormat-full":"EEEE, y MMMM dd","dateFormatItem-Md":"M-d","dayPeriods-format-abbr-am":"AM","dateTimeFormats-appendItem-Second":"{0} ({2}: {1})","dateFormatItem-yMd":"y-M-d","field-era":"Era","dateFormatItem-yM":"y-M","months-standAlone-wide":["1","2","3","4","5","6","7","8","9","10","11","12"],"timeFormat-short":"HH:mm","quarters-format-wide":["Q1","Q2","Q3","Q4"],"timeFormat-long":"HH:mm:ss z","field-year":"Year","dateFormatItem-yMMM":"y MMM","dateFormatItem-yQ":"y Q","dateTimeFormats-appendItem-Era":"{0} {1}","field-hour":"Hour","months-format-abbr":["1","2","3","4","5","6","7","8","9","10","11","12"],"timeFormat-full":"HH:mm:ss zzzz","dateTimeFormats-appendItem-Week":"{0} ({2}: {1})","field-day-relative+0":"Today","field-day-relative+1":"Tomorrow","dateFormatItem-H":"HH","months-standAlone-abbr":["1","2","3","4","5","6","7","8","9","10","11","12"],"quarters-format-abbr":["Q1","Q2","Q3","Q4"],"quarters-standAlone-wide":["Q1","Q2","Q3","Q4"],"dateFormatItem-M":"L","days-standAlone-wide":["1","2","3","4","5","6","7"],"timeFormat-medium":"HH:mm:ss","dateFormatItem-Hm":"HH:mm","quarters-standAlone-abbr":["Q1","Q2","Q3","Q4"],"eraAbbr":["BCE","CE"],"field-minute":"Minute","field-dayperiod":"Dayperiod","days-standAlone-abbr":["1","2","3","4","5","6","7"],"dateFormatItem-d":"d","dateFormatItem-ms":"mm:ss","quarters-format-narrow":["1","2","3","4"],"field-day-relative+-1":"Yesterday","dateFormatItem-h":"h a","dateTimeFormat-long":"{1} {0}","dayPeriods-format-narrow-am":"AM","dateFormatItem-MMMd":"MMM d","dateFormatItem-MEd":"E, M-d","dateTimeFormat-full":"{1} {0}","field-day":"Day","days-format-wide":["1","2","3","4","5","6","7"],"field-zone":"Zone","dateTimeFormats-appendItem-Day":"{0} ({2}: {1})","dateFormatItem-y":"y","months-standAlone-narrow":["1","2","3","4","5","6","7","8","9","10","11","12"],"dateFormatItem-hm":"h:mm a","dateTimeFormats-appendItem-Year":"{0} {1}","dateTimeFormats-appendItem-Hour":"{0} ({2}: {1})","dayPeriods-format-abbr-pm":"PM","days-format-abbr":["1","2","3","4","5","6","7"],"dateFormatItem-yMMMd":"y MMM d","eraNames":["BCE","CE"],"days-format-narrow":["1","2","3","4","5","6","7"],"days-standAlone-narrow":["1","2","3","4","5","6","7"],"dateFormatItem-MMM":"LLL","field-month":"Month","dateTimeFormats-appendItem-Quarter":"{0} ({2}: {1})","dayPeriods-format-wide-am":"AM","dateTimeFormats-appendItem-Month":"{0} ({2}: {1})","dateTimeFormats-appendItem-Minute":"{0} ({2}: {1})","dateFormat-short":"yyyy-MM-dd","field-second":"Second","dateFormatItem-yMMMEd":"E, y MMM d","dateFormatItem-Ed":"d E","dateTimeFormats-appendItem-Timezone":"{0} {1}","field-week":"Week","dateFormat-medium":"y MMM d","dayPeriods-format-narrow-pm":"PM","dateTimeFormat-short":"{1} {0}","dateFormatItem-Hms":"HH:mm:ss","dateFormatItem-hms":"h:mm:ss a"},"dijit/nls/loading":{"loadingState":"Loading...","errorState":"Sorry, an error occurred"},"dojo/cldr/nls/number":{"scientificFormat":"#E0","currencySpacing-afterCurrency-currencyMatch":"[:letter:]","infinity":"∞","list":";","percentSign":"%","minusSign":"-","currencySpacing-beforeCurrency-surroundingMatch":"[:digit:]","decimalFormat-short":"000T","currencySpacing-afterCurrency-insertBetween":" ","nan":"NaN","plusSign":"+","currencySpacing-afterCurrency-surroundingMatch":"[:digit:]","currencyFormat":"¤ #,##0.00","currencySpacing-beforeCurrency-currencyMatch":"[:letter:]","perMille":"‰","group":",","percentFormat":"#,##0%","decimalFormat":"#,##0.###","decimal":".","currencySpacing-beforeCurrency-insertBetween":" ","exponential":"E"},"dijit/nls/common":{"buttonOk":"OK","buttonCancel":"Cancel","buttonSave":"Save","itemClose":"Close"}});