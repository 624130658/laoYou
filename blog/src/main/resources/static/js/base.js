$(function () {
    var _interface = {
        server: ""
        // server: 'http://localhost:8080/dispatch'
        // server: 'http://10.233.37.214:8080/dispatch'
    };

    var _getServer = function () {
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPaht = curWwwPath.substring(0, pos);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return localhostPaht + projectName;
    };

    var _settings = {
        server: _getServer(),
        type: 'post',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        processData: true,
        dataType: "json",
        async: true,
        error: function (resp) {
            alert(resp);
        }
    }, _exports = {};

    var _get = function (opt) {
        opt.type = 'get';
        _load(opt)
    }

    var _post = function (opt) {
        opt.type = 'post';
        _load(opt)
    }

    var _del = function (opt) {
        opt.type = 'delete';
        _load(opt)
    }

    var _put = function (opt) {
        opt.type = 'put';
        _load(opt)
    }

    var _load = function (opt) {
        var settings = $.extend({}, _settings, opt);
        if (!settings.url) {
            return;
        }
        // $.support.cors = true;
        $.ajax({
            url: settings.server + settings.url,
            type: settings.type,
            contentType: settings.contentType,
            processData: settings.processData,
            dataType: settings.dataType,
            data: settings.data,
            async: settings.async,
            // headers: { // 默认添加请求头
            //     "Authorization": _getSessionId(),
            //     "X-Requested-With": 'XMLHttpRequest'
            // },
            // crossDomain: true,
            // xhrFields: {withCredentials: true},
            success: function (resp) {
                if (settings.success && typeof settings.success === "function") {
                    settings.success(resp);
                    return;
                }
                if (resp.success) {
                    var msg = settings.successMsg;
                    if (undefined == msg || null == msg) {
                        if (settings.url.indexOf('add') > -1) {
                            msg = '保存成功!'
                        }
                        if (settings.url.indexOf('update') > -1 || settings.url.indexOf('edit') > -1) {
                            msg = '修改成功!'
                        }
                        if (settings.url.indexOf('delete') > -1) {
                            msg = '删除成功!'
                        }
                        if (settings.url.indexOf('import') > -1) {
                            msg = '数据导入成功!'
                        }
                    }
                    if (msg) {
                        modal.show_prompt_modal({
                            type: "success",
                            html: msg
                        });
                    }
                } else if (!resp.success) {
                    modal.show_prompt_modal({
                        type: "error",
                        html: resp.message
                    });
                    return;
                }
                if (settings.callback && typeof settings.callback === "function") {
                    settings.callback(resp);
                }
            }
            , error: settings.error
        });
    }

    function _init() {
        _interface.server = _getServer();
        $.extend($.validator.defaults, {ignore: ".ignore"});
        // var session_id_name = "sid";
        // var session_id = window.document.cookie.match('(^|;) ?' + session_id_name + '=([^;]*)(;|$)');
        // session_id = session_id ? session_id[2] : null;
        // if (null == session_id) {
        //     // window.location.href = _interface.server + "?service=" + _interface.uiServer;
        // }
        // $.ajaxSetup({
        //     crossDomain: true,
        //     xhrFields: {withCredentials: true},
        //     headers: { // 默认添加请求头
        //         "Authorization": session_id,
        //         "X-Requested-With": 'XMLHttpRequest'
        //     }
        // });
        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1,                 //月份
                "d+": this.getDate(),                    //日
                "h+": this.getHours(),                   //小时
                "m+": this.getMinutes(),                 //分
                "s+": this.getSeconds(),                 //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds()             //毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        };
        /**
         * 子iframe的click事件往最上层冒泡
         */
        if (window.top != null && window.top.location != window.location) {
            $("body").click(function () {
                var document = window.top.document;
                $(document).find("body").click();
            });
        }
    }

    /**
     * 初始化字典数据下拉框相关html
     */
    var _initEnumSelect = function (select_selector, module, enumName, selects) {
        var $node = $(select_selector);
        var html = "<option value=''>- 请选择 -</option>";
        var data = _getEnums(module, enumName);
        for (var i = 0; i < data.length; i++) {
            var temp = data[i];
            var field = temp.field + "";
            var name = temp.name;
            var select_html = "";
            if (undefined != selects && null != selects && "" != selects) {
                if (!selects instanceof Array) {
                    selects = [selects];
                }
                if (selects.indexOf(field) > -1) {
                    select_html = "selected";
                }
            }
            html += "<option value='" + field + "' " + select_html + ">" + name + "</option>";
        }
        $node.html(html);
    }

    /**
     * 初始化字典数据下拉框相关html(不带有空选项，即请选择这个选项)
     */
    var _initEnumSelectNoBlank = function (select_selector, module, enumName, selects) {
        var $node = $(select_selector);
        var html = "";
        var data = _getEnums(module, enumName);
        for (var i = 0; i < data.length; i++) {
            var temp = data[i];
            var field = temp.field + "";
            var name = temp.name;
            var select_html = "";
            if (undefined != selects && null != selects && "" != selects) {
                if (!selects instanceof Array) {
                    selects = [selects];
                }
                if (selects.indexOf(field) > -1) {
                    select_html = "selected";
                }
            }
            html += "<option value='" + field + "' " + select_html + ">" + name + "</option>";
        }
        $node.html(html);
    }

    /**
     * 获取枚举数据
     */
    var _getEnums = function (module, enumName) {
        var enums;
        _get({
            url: _interface.queryEnums + "?module=" + module + "&enumName=" + enumName,
            async: false,
            callback: function (result) {
                enums = result.data;
            }
        });
        return enums;
    }
    /**
     * 设置jq的表单object获取方法(当值为""空字符串的时候，不传此值)
     * @param judge_empty 是否判断空字符串 true判断(当值为""空字符串的时候，不传此值) false不判断 默认为true
     */
    $.fn.serializeObject = function (judge_empty) {
        if (undefined == judge_empty || null == judge_empty) {
            judge_empty = true;
        }
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
            if (judge_empty) {
                if (o[this.name] == '') {
                    delete o[this.name];
                }
            }
        });
        return o;
    };

    //私有方法
    _init();

    //共有方法
    _exports.get = _get;
    _exports.post = _post;
    _exports.put = _put;
    _exports.del = _del;
    _exports.load = _load;
    _exports.interface = _interface;
    _exports.initEnumSelect = _initEnumSelect;
    _exports.initEnumSelectNoBlank = _initEnumSelectNoBlank;
    _exports.getEnums = _getEnums;
    _exports.init = _init;
    window.base = _exports;
});