function fw_fwConfig_FWConfigHelper_dataPublicKey() {
    return decodeURIComponent("%e6%8a%80%e6%9c%af%e6%94%af%e6%8c%81%ef%bc%9a%e6%b1%9f%e8%8b%8f%e6%a2%a6%e5%85%b0%e7%a5%9e%e5%bd%a9%e7%a7%91%e6%8a%80%e5%8f%91%e5%b1%95%e6%9c%89%e9%99%90%e5%85%ac%e5%8f%b8");
};
function fw_fwString_FWStringHelper_trim(value) {
    return value.toString().replace(/^\s*|\s$/g, '');
};
function fw_fwString_FWStringHelper_remove(value, startIndex, count) {
    return value.substring(0, startIndex) + value.substring(startIndex + count, value.length);
};
function fw_fwString_FWStringHelper_insert(value, startIndex, insertValue) {
    return value.substring(0, startIndex) + insertValue + value.substring(startIndex, value.length);
};
function fw_fwString_FWStringHelper_getBase64Bytes(value) {
    value = fw_fwString_FWStringHelper_toBase64String(value);
    var array = new Array();
    for (var i = 0; i < value.length; i++) {
        array.push(value.charCodeAt(i));
    };
    return array;
};
function fw_fwString_FWStringHelper_replaceAll(value, StringReplace, StringReplaceTo) {
    /// <summary>
    ///     替换字符串中所有需要替换的字符串
    ///      1: " 字符串 ".Trim() 结果为 "字符串"
    /// </summary>
    /// <param name="StringReplace" type="string">
    ///     想要替换的字符串
    /// </param>
    /// <param name="StringReplaceTo" type="string">
    ///     用于替换的字符串
    /// </param>
    ///	<returns type="string"></returns>
    if (fw_fwObject_FWObjectHelper_hasValue(value)) {
        var _RegExp = new RegExp(StringReplace.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
        value = value.replace(_RegExp, StringReplaceTo);
    };
    return value;
};
function fw_fwString_FWStringHelper__base64encode(str) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out;
    var i;
    var len;
    var c1;
    var c2;
    var c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        };
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        };
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    };
    return out;
};
function fw_fwString_FWStringHelper__base64decode(str) {
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    var c1;
    var c2;
    var c3;
    var c4;
    var i;
    var len;
    var out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) {
            break;
        };
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) {
            break;
        };
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) {
                return out;
            };
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) {
            break;
        };
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) {
                return out;
            };
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) {
            break;
        };
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    };
    return out;
};
function fw_fwString_FWStringHelper__utf16to8(str) {
    var out;
    var i;
    var len;
    var c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else {
            if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            };
        };
    };
    return out;
};
function fw_fwString_FWStringHelper__utf8to16(str) {
    var out;
    var i;
    var len;
    var c;
    var char2;
    var char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx10xx xxxx10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        };
    };
    return out;
};
function fw_fwString_FWStringHelper_toBase64String(str) {
    if (fw_fwObject_FWObjectHelper_hasValue(str)) {
        return fw_fwString_FWStringHelper__base64encode(fw_fwString_FWStringHelper__utf16to8(str));
    }
    return str;
};
function fw_fwString_FWStringHelper_formBase64String(str) {
    if (fw_fwObject_FWObjectHelper_hasValue(str)) {
        return fw_fwString_FWStringHelper__utf8to16(fw_fwString_FWStringHelper__base64decode(str));
    }
    return str;
};
function fw_fwObject_FWObjectHelper_hasValue(anyType, isIncludeString) {
    var Is = false;
    if (anyType != undefined && anyType != null) {
        switch (Object.prototype.toString.apply(anyType)) {
            case "[object String]":
                anyType = fw_fwString_FWStringHelper_trim(anyType.toLowerCase());
                Is = (anyType == "undefined" || anyType == "null" || anyType.length < 1);
                break;
            case "[object Number]":
                break;
            case "[object Boolean]":
                break;
            case "[object Object]":
                Is = $.isEmptyObject(anyType);
                break;
            case "[object Array]":
                Is = (anyType.length < 1);
                break;
        };
    } else {
        Is = true;
    };
    return !Is;
};
function fw_fwSafe_FWSafeHelper_ENCRYPT_DIVISOR() {
    return 10;
}
function fw_fwSafe_FWSafeHelper_ENCRYPT_MUST_INSERT_INDEX() {
    return 1;
}
function fw_fwSafe_FWSafeHelper_ENCRYPT_COUNT() {
    return 2;
}
function fw_fwSafe_FWSafeHelper_encrypt(value, key) {
    if (!fw_fwObject_FWObjectHelper_hasValue(key)) {
        key = fw_fwConfig_FWConfigHelper_dataPublicKey();
    };
    if (fw_fwObject_FWObjectHelper_hasValue(value) && fw_fwObject_FWObjectHelper_hasValue(key)) {
        var encryptCount = 0;
        do {
            value = fw_fwString_FWStringHelper_toBase64String(value);
            key = fw_fwString_FWStringHelper_toBase64String(key);
            var remainder = key.length % fw_fwSafe_FWSafeHelper_ENCRYPT_DIVISOR();
            if (remainder < 1) {
                remainder = fw_fwSafe_FWSafeHelper_ENCRYPT_DIVISOR();
            };
            if (value.length > remainder) {
                value = fw_fwString_FWStringHelper_insert(value, remainder, key.substr(remainder - 1, 1));
            };
            if (value.length > fw_fwSafe_FWSafeHelper_ENCRYPT_MUST_INSERT_INDEX()) {
                value = fw_fwString_FWStringHelper_insert(value, fw_fwSafe_FWSafeHelper_ENCRYPT_MUST_INSERT_INDEX(), key.substr(remainder - 1, 1));
            };
            encryptCount++;
        } while (encryptCount < fw_fwSafe_FWSafeHelper_ENCRYPT_COUNT());
    };
    return value;
};
function fw_fwSafe_FWSafeHelper_decrypt(value, key) {
    if (!fw_fwObject_FWObjectHelper_hasValue(key)) {
        key = fw_fwConfig_FWConfigHelper_dataPublicKey();
    };
    if (fw_fwObject_FWObjectHelper_hasValue(value) && fw_fwObject_FWObjectHelper_hasValue(key)) {
        var encryptCount = 0;
        do {
            key = fw_fwString_FWStringHelper_toBase64String(key);
            encryptCount++;
        } while (encryptCount < fw_fwSafe_FWSafeHelper_ENCRYPT_COUNT());
        encryptCount = 0;
        do {
            var remainder = key.length % fw_fwSafe_FWSafeHelper_ENCRYPT_DIVISOR();
            if (remainder < 1) {
                remainder = fw_fwSafe_FWSafeHelper_ENCRYPT_DIVISOR();
            };
            if (value.length > fw_fwSafe_FWSafeHelper_ENCRYPT_MUST_INSERT_INDEX()) {
                value = fw_fwString_FWStringHelper_remove(value, fw_fwSafe_FWSafeHelper_ENCRYPT_MUST_INSERT_INDEX(), 1);
            };
            if (value.length > remainder) {
                value = fw_fwString_FWStringHelper_remove(value, remainder, 1);
            };
            value = fw_fwString_FWStringHelper_formBase64String(value);
            key = fw_fwString_FWStringHelper_formBase64String(key);
            encryptCount++;
        } while (encryptCount < fw_fwSafe_FWSafeHelper_ENCRYPT_COUNT());
    };
    return value;
};
function fw_fwSafe_FWSafeHelper_createXHRObject() {
    var http;
    try {
        var activeX = ["MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
        http = new XMLHttpRequest;
    } catch (e) {
        for (var i = 0; i < activeX.length; ++i) {
            try {
                http = new ActiveXObject(activeX[i]);
                break;
            } catch (e) {
            };
        };
    };
    return http;
};
function fw_fwSafe_FWSafeHelper_synchronize(url, param) {
    var result;
    try {
        var _createXHRObject = fw_fwSafe_FWSafeHelper_createXHRObject();
        _createXHRObject.open("GET", url, false); //ajax同步 
        _createXHRObject.send(param);
        result = _createXHRObject.responseText;
    } catch (e) {
    };
    return result;
};
function fw_fwSafe_FWSafeHelper_getDataPublicKey() {
    var key;
    try {
        if (!window.dataPublicKey) {
            window.dataPublicKey = eval("(" + fw_fwSafe_FWSafeHelper_synchronize("http://218.94.78.90:8001/appSettings") + ")");
            //window.dataPublicKey = eval("(" + fw_fwSafe_FWSafeHelper_synchronize("http://192.168.252.31:8000/fwSSO/appSettings") + ")");
            window.dataPublicKey = window.dataPublicKey.dataPublicKey;
        };
        key = window.dataPublicKey;
    } catch (e) {
    };
    return key;
};
function encrypt(value) {
    return fw_fwSafe_FWSafeHelper_encrypt(value, fw_fwSafe_FWSafeHelper_getDataPublicKey());
};
function decrypt(value) {
    return fw_fwSafe_FWSafeHelper_decrypt(value, fw_fwSafe_FWSafeHelper_getDataPublicKey());
};