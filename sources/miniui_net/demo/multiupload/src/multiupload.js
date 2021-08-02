if (!window.UserControl) window.UserControl = {};

UserControl.MultiUpload = function () {

    UserControl.MultiUpload.superclass.constructor.call(this);
    var me = this;

    setTimeout(function () {
        //  me.initComponents();
        me.bindEvents();
    }, 300);
}

mini.extend(UserControl.MultiUpload, mini.DataGrid, {

    uiCls: 'uc-multiupload',

    flashUrl: '',
    uploadUrl: '',
    uploader: undefined,
    uploadName: "Fdata",
    limitSize: "10MB",
    limitType: "*",
    uploadLimit: 0,
    queueLimit: 10,
    postParam: {},
    //  continuity: false,  //连续上传
    autoUpload: false,   //选中即上传

    customSettings: { queue: null },

    columnsTexts: {
        nameColumnHeader: "文件名",
        typeColumnHeader: "文件类型",
        sizeColumnHeader: "文件大小",
        completeColumnHeader: "上传进度",
        statusColumnHeader: "上传状态",
        actionColumnHeader: "操作"

    },
    _create: function () {

        UserControl.MultiUpload.superclass._create.call(this);
        var me = this;
        var defaultColumns = [
                    { "type": "indexColumn" },
                    { field: "name", width: 150, header: me.columnsTexts.nameColumnHeader },
                    { field: "type", width: 50, header: me.columnsTexts.typeColumnHeader, align: "center", headerAlign: "center" },
                    { field: "size", width: 60, header: me.columnsTexts.sizeColumnHeader, align: "center", headerAlign: "center" },
                    { field: "complete", width: 80, header: me.columnsTexts.completeColumnHeader, headerAlign: "center" },
                    { field: "status", width: 60, header: me.columnsTexts.statusColumnHeader, align: "center", headerAlign: "center" },
                    { field: "action", width: 30, header: me.columnsTexts.actionColumnHeader, align: "center", headerAlign: "center" }
                  ];

        me.set({
            showPager: false,
            showToolbar: true,
            columns: defaultColumns
        })
        var toolbarEl = me.getToolbarEl();
        toolbarEl.style.height = "30px";

        me._uploadId = me._id + "_button_placeholder";
        var sb = [];
        sb.push('<table><tr><td style="width:80px;height:25px;"><a class="mini-button" iconCls="icon-search" style="width:80px">浏览...</a><span class="mini-upload"><span id="' + me._uploadId + '" class="mini-upload-placeholder" style=""></span></span>');

        sb.push('</td><td><a class="mini-button" iconCls="icon-upload" name="multiupload">批量上传</a>');
        sb.push('</td><td><a class="mini-button" iconCls="icon-remove" name="removeAll">清空上传</a>');
        sb.push('</td></tr></table>');


        toolbarEl.innerHTML = sb.join("");

    },
    //    initComponents: function () {


    //    },
    __OnMouseMove: function () {
        var me = this;
        if (!me.uploader) {

            var limitTypes = me.limitType.split(";");
            var lt = [];
            for (var i = 0, l = limitTypes.length; i < l; i++) {
                var item = limitTypes[i];
                for (var j = 0, k = me.acceptMap.length; j < k; j++) {
                    if (me.acceptMap[j].code == item) {
                        lt.push(me.acceptMap[j].text);
                    }
                }
            }
            var limitType = lt.join(",");

            var limitSize = me.changeByte(me.limitSize);
            if (limitSize == 0) {
                limitSize = 10*1024*1024;
            }


            var upload = WebUploader.create({
                server: me.uploadUrl,
                pick: "#" + me._uploadId,
                auto: me.autoUpload,
                accept: {

                    mimeTypes: limitType
                },
                formData: me.postParam,
                // 文件上传参数表，用来标记文件的所有者（如果是一篇文章的附件，就是文章的ID）
                formData: {
                    owner: 'webuploader.webuploader'
                },
                fileVal: me.uploadName,
                // 单个文件大小限制（单位：byte），这里限制为 100M
                fileSingleSizeLimit: limitSize,
                fileNumLimit: me.queueLimit

            })
            upload.on("fileQueued", function (file) {
                me.__on_file_queued(file, me);
            })
            upload.on("error", function (type) {
                me.__on_Error(type, me);
            })
            upload.on('uploadProgress', function (file, percentage) {
                me.__on_upload_progress(file, percentage, me);
            });
            upload.on('uploadSuccess', function (file, response) {
                me.__on_upload_success(file, response, me);
            });

            upload.on('uploadError', function (file, reason) {
                me.__on_upload_error(file, reason, me);

            });

            // 不管上传成功还是失败，都会触发 uploadComplete 事件
            upload.on('uploadComplete', function (file) {
                me.__on_upload_complete(file, me);
            });

            // 当开始上传流程时触发
            upload.on('startUpload', function () {
                //  mini.get("beginBtn").setEnabled(false);
            });

            // 当所有文件上传结束时触发
            upload.on('uploadFinished', function () {
                //  mini.get("beginBtn").setEnabled(true);
            });
            me.uploader = upload;
            me.uploadButton.on("click", function () {
                var rows = me.getData();
                if (rows.length > 0) {
                    me.continuity = true;
                    me.startUpload();
                }
            });
            me.removeButton.on("click", function () {

                var rows = me.getData();
                for (var i = 0, l = rows.length; i < l; i++) {
                    me.uploader.cancelFile(rows[i].fileId);
                    me.uploader.removeFile(rows[i].fileId);
                }
                me.clearData();
            });
        }
    },
    bindEvents: function () {
        var me = this;
        me._fileEl = document.getElementById(me._uploadId);
        me.uploadEl = me._fileEl;
        var toolbarEl = me.getToolbarEl();
        mini.on(me.uploadEl, "mousemove", me.__OnMouseMove, me);
        me.uploadButton = mini.getbyName("multiupload", toolbarEl);
        me.removeButton = mini.getbyName("removeAll", toolbarEl);




        me.on("drawcell", function (e) {
            var field = e.field;
            var record = e.record;
            var uid = record._uid;
            var value = e.value;
            //            if (field == "size") {
            //                e.cellHtml = bytesToSize(e.value);
            //            }
            if (field == "complete") {
                e.cellHtml = '<div class="progressbar">'
                                + '<div class="progressbar-percent" style="width:' + value + '%;"></div>'
                                + '<div class="progressbar-label">' + value + '%</div>'
                            + '</div>';
            }
            if (field == "status") {
                if (e.value == 0) {
                    e.cellHtml = "准备上传";
                } else if (e.value == 1) {
                    e.cellHtml = "上传成功";
                } else if (e.value == 2) {
                    e.cellHtml = "上传失败";
                }
            }
            if (field == "action") {
                e.cellHtml = '<a class="upicon-remove" name="' + uid + '"><a>';

            }
        })
        $(document.body).on("click", ".upicon-remove", function () {
            var uid = $(this).attr("name");
            var row = me.getRowByUID(uid);
            if (me.uploader.getStats().queueNum !== 0) {
                me.uploader.cancelFile(row.fileId);
                me.uploader.removeFile(row.fileId);
            }
            me.removeRow(row);
        })
    },
    startUpload: function (fileId) {

        var me = this;
        if (me.uploader) {
            //            if (me.postParam) {
            //                me.uploader.setPostParams(this.postParam);
            //            }
            if (fileId) {
                me.uploader.upload(fileId);
            } else {
                me.uploader.upload();
            }
        }
    },
    addPostParam: function (value) {
        mini.copyTo(this.postParam, value);
        if (this.uploader) {
            this.uploader.option("formData", this.postParam);
        }
    },
    setPostParam: function (value) {
        this.addPostParam(value);
    },
    getPostParam: function () {
        return this.postParam;
    },
    __on_file_queued: function (file, me) {

        function bytesToSize(bytes) {
            if (bytes === 0) return '0 B';
            var k = 1024,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
           i = Math.floor(Math.log(bytes) / Math.log(k));

            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        }


        var me = this;
        var row = {};
        row.name = file.name;
        row.type = file.type;
        row.status = 0;
        row.fileId = file.id;
        row.size = bytesToSize(file.size);
        row.complete = 0;
        me.addRow(row);

        if (me.autoUpload) {
            me.startUpload(file.id);
        }
    },
    __on_upload_error: function (file, reason, me) {
        if (reason == "File Cancelled") return;
        if (file) {
            var row = me.findRow(function (row) {
                if (row.fileId == file.id) return true;
            })
            me.updateRow(row, { status: 2 });
        }


        var e = { file: file, code: reason, message: reason };
        me.fire("uploaderror", e);
    },
    __on_upload_success: function (file, response, me) {

        var row = me.findRow(function (row) {
            if (row.fileId == file.id) return true;
        })
        me.updateRow(row, { status: 1, complete: 100 });

        var e = { file: file, serverData: response._raw };
        me.fire("uploadsuccess", e);
    },
    __on_upload_complete: function (file, me) {

        if (me.uploader.getStats().queueNum !== 0) {
            me.startUpload();
        }
        //  }

    },
    __on_Error: function (type, me) {
        mini.alert("文件选择出错!errorCode:" + type)
    },
    __on_upload_progress: function (file, percentage, me) {

        var row = me.findRow(function (row) {
            if (row.fileId == file.id) return true;
        })
        me.updateRow(row, { complete: percentage });

    },
    //    __on_file_queued_error: function (file, errorCode, msg) {

    //        mini.alert("文件选择出错!errorCode:" + errorCode + ";msg:" + msg);
    //    },
    setUploadUrl: function (url) {
        this.uploadUrl = url;
    },
    getUploadUrl: function () {
        return this.uploadUrl;
    },
    setFlashUrl: function (url) {
        this.flashUrl = url;
    },
    getFlashUrl: function () {
        return this.flashUrl;
    },
    setLimitType: function (type) {
        this.limitType = type;

    },
    getLimitType: function () {
        return this.limitType;
    },
    setLimitSize: function (size) {
        this.limitSize = size;
    },
    getLimitTSize: function () {
        return this.limitSize;
    },
    setUploadName: function (name) {
        this.uploadName = name;
    },
    getUploadName: function () {
        return this.uploadName;
    },



    setAutoUpload: function (val) {
        this.autoUpload = val;
    },
    getAutoUpload: function () {
        return this.autoUpload;
    },

    setQueueLimit: function (num) {
        this.queueLimit = num;
    },
    getQueueLimit: function () {
        return this.queueLimit;
    },

    getAttrs: function (el) {
        var attrs = UserControl.MultiUpload.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            ["uploadUrl", "flashUrl", "limitType", "limitSize", "uploadName", "queueLimit", "onuploaderror", "onuploadsuccess"]
        );
        mini._ParseBool(el, attrs,
            ["autoUpload"]
        );
        return attrs;
    },
    acceptMap: [
        { code: "*.3gpp", text: "audio/3gpp" },
        { code: "*.ac3", text: "audio/ac3" },
        { code: "*.asf", text: "allpication/vnd.ms-asf" },
        { code: "*.au", text: "audio/basic" },
        { code: "*.css", text: "text/css" },
        { code: "*.csv", text: "text/csv" },
        { code: "*.doc", text: "application/msword" },
        { code: "*.dot", text: "application/msword" },
        { code: "*.dtd", text: "application/xml-dtd" },
        { code: "*.dwg", text: "image/vnd.dwg" },
        { code: "*.dxf", text: "image/vnd.dxf" },
        { code: "*.gif", text: "image/gif" },
        { code: "*.htm", text: "text/html" },
        { code: "*.html", text: "text/html" },
        { code: "*.jp2", text: "image/jp2" },
        { code: "*.jpe", text: "image/jpeg" },
        { code: "*.jpeg", text: "image/jpeg" },
        { code: "*.jpg", text: "image/jpeg" },
        { code: "*.js", text: "text/javascript" },
        { code: "*.json", text: "application/json" },
        { code: "*.mp2", text: "audio/mpeg" },
        { code: "*.mp3", text: "audio/mpeg" },
        { code: "*.mp4", text: "audio/mp4" },
        { code: "*.mpeg", text: "video/mpeg" },
        { code: "*.mpg", text: "video/mpeg" },
        { code: "*.mpp", text: "application/vnd.ms-project" },
        { code: "*.ogg", text: "audio/ogg" },
        { code: "*.pdf", text: "application/pdf" },
        { code: "*.png", text: "image/png" },
        { code: "*.pot", text: "application/vnd.ms-powerpoint" },
        { code: "*.pps", text: "application/vnd.ms-powerpoint" },
        { code: "*.ppt", text: "application/vnd.ms-powerpoint" },
        { code: "*.rtf", text: "text/rtf" },
        { code: "*.svf", text: "image/vnd.svf" },
        { code: "*.tif", text: "image/tiff" },
        { code: "*.tiff", text: "image/tiff" },
        { code: "*.txt", text: "text/plain" },
        { code: "*.wdb", text: "application/vnd.ms-works" },
         { code: "*.wps", text: "application/vnd.ms-works" },
        { code: "*.xhtml", text: "application/xhtml+xml" },
        { code: "*.xlc", text: "application/vnd.ms-excel" },
        { code: "*.xlm", text: "application/vnd.ms-excel" },
        { code: "*.xls", text: "application/vnd.ms-excel" },
        { code: "*.xlt", text: "application/vnd.ms-excel" },
         { code: "*.xlw", text: "application/vnd.ms-excel" },
        { code: "*.xml", text: "text/xml" },
        { code: "*.zip", text: "application/zip" },
        { code: "*.xlsx", text: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { code: "*.xltx", text: "application/vnd.openxmlformats-officedocument.spreadsheetml.template" },
        { code: "*.potx", text: "application/vnd.openxmlformats-officedocument.presentationml.template" },
         { code: "*.ppsx", text: "application/vnd.openxmlformats-officedocument.presentationml.slideshow" },
          { code: "*.pptx", text: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
           { code: "*.sldx", text: "application/vnd.openxmlformats-officedocument.presentationml.slide" },
            { code: "*.docx", text: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
             { code: "*.dotx", text: "application/vnd.openxmlformats-officedocument.wordprocessingml.template" },
             { code: "*.xlsm", text: "application/vnd.ms-excel.addin.macroEnabled.12" },
             { code: "*.xlsb", text: " application/vnd.ms-excel.sheet.binary.macroEnabled.12" }

    ],
    changeByte: function (value) {
        var number = parseInt(value);
        if (isNaN(number) || number == 0) {
            return 0;
        }
        var l2 = String(number).length;
        var unit = value.substring(l2).toLowerCase();
        var result = number;
        if (unit == "kb") {
            result = result * 1024;
        } else if (unit == "mb") {
            result = result * 1024 * 1024;
        } else if (unit == "gb" || unit == "g") {
            result = result * 1024 * 1024 * 1024;
        }
        return result;
    }


});

mini.regClass(UserControl.MultiUpload, "multiupload");


