/**
 * 模态框js包
 * 前置js:jquery, bootstrap
 * @author YL
 */
$(function () {
    /**
     * 初始化参数
     * @param setting 自定义设置
     * modal_selector 模态框选择器
     * url 模态框url 默认detail.html
     * type 模态框类型 detail add update
     * title 模态框标题
     * bind_data 是否绑定数据 boolean 默认false
     * disabled 是否禁用控件 boolean 默认false
     * readonly 是否只读控件 boolean 默认false
     * prefix_trigger ["click","change",......]
     *          绑定数据之前是否触发方法 按照数组里的顺序触发 数组中的字符串为trigger(event_str)函数中的参数字符串 暂不支持其他参数
     * suffix_trigger ["click","change",......]
     *          绑定数据之后是否触发方法 按照数组里的顺序触发 数组中的字符串为trigger(event_str)函数中的参数字符串 暂不支持其他参数
     * data 绑定的数据
     * modal_fun 回调有参数(绑定的数据和setting对象)
     * prefix_modal_fun modal显示之前的函数参数为data,return true 显示模态框 false不显示 默认直接返回true
     * prefix_bind_data_fun 数据绑定之前的函数参数为data和setting对象
     * ajax_setting ajax相关配置json格式{type: 'get',data: {}}
     *              type ajax请求类型，默认get
     *              data ajax请求参数
     * @author YL
     */
    var init_setting = function (setting) {
        var result = {};
        var modal_selector = setting["modal_selector"];
        if (judge_string(modal_selector)) {
            console.log("[modal.js] [init_setting] modal_selector error");
        } else {
            result["modal_selector"] = modal_selector;
        }
        var url = setting["url"];
        if (judge_string(url)) {
            result["url"] = "detail.html";
        } else {
            result["url"] = url;
        }
        var type = setting["type"];
        if (judge_string(type)) {
            console.log("[modal.js] [init_setting] type error");
        } else {
            result["type"] = type;
        }
        var title = setting["title"];
        if (judge_string(title)) {
            result["title"] = default_title;
        } else {
            result["title"] = title;
        }
        var bind_data = setting["bind_data"];
        if (judge_string(bind_data)) {
            result["bind_data"] = false;
        } else {
            result["bind_data"] = bind_data;
        }
        var disabled = setting["disabled"];
        if (judge_string(disabled)) {
            result["disabled"] = false;
        } else {
            result["disabled"] = disabled;
        }
        var readonly = setting["readonly"];
        if (judge_string(readonly)) {
            result["readonly"] = false;
        } else {
            result["readonly"] = readonly;
        }
        var prefix_trigger = setting["prefix_trigger"];
        if (judge_string(prefix_trigger)) {
            result["prefix_trigger"] = [];
        } else {
            result["prefix_trigger"] = prefix_trigger;
        }
        var suffix_trigger = setting["suffix_trigger"];
        if (judge_string(suffix_trigger)) {
            result["suffix_trigger"] = [];
        } else {
            result["suffix_trigger"] = suffix_trigger;
        }
        var data = setting["data"];
        if (judge_string(data)) {
            result["data"] = null;
        } else {
            result["data"] = data;
        }
        var modal_fun = setting["modal_fun"];
        if (typeof modal_fun !== "function") {
            result["modal_fun"] = null;
        } else {
            result["modal_fun"] = modal_fun;
        }
        var prefix_modal_fun = setting["prefix_modal_fun"];
        if (typeof prefix_modal_fun !== "function") {
            result["prefix_modal_fun"] = function () {
                return true;
            };
        } else {
            result["prefix_modal_fun"] = prefix_modal_fun;
        }
        var prefix_bind_data_fun = setting["prefix_bind_data_fun"];
        if (typeof prefix_bind_data_fun !== "function") {
            result["prefix_bind_data_fun"] = function () {
            };
        } else {
            result["prefix_bind_data_fun"] = prefix_bind_data_fun;
        }
        result["ajax_setting"] = init_ajax_setting(setting["ajax_setting"]);
        return result;
    };
    /**
     * 初始化ajax相关配置参数
     * @param setting 自定义设置
     * type:ajax请求类型，默认get
     * data:ajax请求参数
     */
    var init_ajax_setting = function (setting) {
        if (undefined == setting || null == setting) {
            setting = {};
        }
        var result = {};
        var type = setting["type"];
        if (judge_string(type)) {
            result["type"] = "get";
        } else {
            result["type"] = type;
        }
        var data = setting["data"];
        if (undefined == data || null == data) {
            result["data"] = {};
        } else {
            result["data"] = data;
        }
        return result;
    };
    /**
     * 判断字符串是否为空、为空字符串
     * @param str 字符串
     */
    var judge_string = function (str) {
        return undefined == str || null == str || "" == str;
    }

    /**
     * 显示模态框
     * @param setting 自定义设置
     * modal_selector 模态框选择器
     * url 模态框url
     * type 模态框类型 detail add update
     * title 模态框标题
     * bind_data 是否绑定数据 boolean 默认false
     * disabled 是否禁用控件 boolean 默认false
     * readonly 是否只读控件 boolean 默认false
     * data 绑定的数据
     * modal_fun 回调有参数(绑定的数据)
     * prefix_modal_fun modal显示之前的函数 参数为data,return true 显示模态框 false不显示 默认直接返回true
     * prefix_bind_data_fun 数据绑定之前的函数 参数为data
     * @author YL
     */
    function show_modal(setting) {
        var setting = init_setting(setting);
        var $modal = _get_modal(setting['modal_selector']);
        var data = setting['data'];
        var prefix_modal_fun = setting['prefix_modal_fun'];
        if (prefix_modal_fun(data)) {
            var ajax_setting = setting["ajax_setting"];
            var url = setting['url'];
            var ajax_data = ajax_setting['data'];
            if ("get" == ajax_setting["type"] || "GET" == ajax_setting["type"]) {
                url = get_url(url, ajax_data);
                $modal.load(url, function () {
                    init_node(setting);
                    var type = setting['type'];
                    $modal.attr("modal-type", type);
                    $modal.modal('show');
                });
            } else {
                $modal.load(url, ajax_data, function () {
                    init_node(setting);
                    var type = setting['type'];
                    $modal.attr("modal-type", type);
                    $modal.modal('show');
                });
            }
        }
    }

    /**
     * 将url和参数拼接成完整地址
     * @param {string} url url地址
     * @param {Json} data json对象
     * @returns {string}
     */
    function get_url(url, data) {
        var param_str = '';
        for (var k in data) {
            var value = data[k] !== undefined ? data[k] : '';
            param_str += '&' + k + '=' + value;
        }
        param_str = param_str ? param_str.substring(1) : '';
        return url += (url.indexOf('?') < 0 ? '?' : '') + param_str;
    }

    /**
     * 初始化节点隐藏
     */
    var init_node = function (setting) {
        var setting = init_setting(setting);
        var $modal = _get_modal(setting['modal_selector']);
        var data = setting['data'];
        var prefix_modal_fun = setting['prefix_modal_fun'];
        if (prefix_modal_fun(data)) {
            var prefix_bind_data_fun = setting['prefix_bind_data_fun'];
            prefix_bind_data_fun(data, setting);
            $modal.find(".modal-title").html(setting['title']);
            if (setting['disabled']) {
                $modal.find(".modal-body-control").find("input,select,textarea,button").prop("disabled", true);
            }
            if (setting['readonly']) {
                $modal.find(".modal-body-control").find("input,select,textarea,button").prop("readonly", true);
            }
            if (setting['bind_data']) {
                if (undefined != data && null != data) {
                    var $controls = $modal.find("[field]");
                    for (var i = 0; i < $controls.length; i++) {
                        var $control = $controls.eq(i);
                        var prefix_trigger = setting["prefix_trigger"];
                        for (var j = 0; j < prefix_trigger.length; j++) {
                            $control.trigger(prefix_trigger[j]);
                        }
                        var field = $control.attr("field");
                        var temp_value = data;
                        if (undefined == field || null == field || "" == field) {
                            temp_value = "";
                        } else {
                            var keys = $control.attr("field").split(".");
                            for (var j = 0; j < keys.length; j++) {
                                var temp_key = keys[j];
                                if (undefined == temp_value || null == temp_value || "" == temp_value) {
                                    temp_value = "";
                                    break;
                                }
                                temp_value = temp_value[temp_key];
                            }
                        }
                        $control.val(temp_value);
                        var suffix_trigger = setting["suffix_trigger"];
                        for (var j = 0; j < suffix_trigger.length; j++) {
                            $control.trigger(suffix_trigger[j]);
                        }
                    }
                }
            }
            var type = setting['type'];
            var modal_fun = setting['modal_fun'];
            $modal.find("." + type + "-hidden").css("display", "none");
            $modal.find("." + type + "-show").removeClass("modal-hidden");
            $modal.find("." + type + "-disabled").prop("disabled", true);
            $modal.find("." + type + "-disabled").find("select,input,textarea").prop("disabled", true);
            $modal.find("." + type + "-undisabled").prop("disabled", false);
            $modal.find("." + type + "-undisabled").find("select,input,textarea").prop("disabled", false);
            $modal.find("." + type + "-readonly").prop("readonly", true);
            $modal.find("." + type + "-readonly").find("select,input,textarea").prop("readonly", true);
            $modal.find("." + type + "-unreadonly").prop("readonly", false);
            $modal.find("." + type + "-unreadonly").find("select,input,textarea").prop("readonly", false);
            $modal.find("." + type + "-remove").remove();
            $modal.find(".-hidden:not(." + type + "-un-hidden)").css("display", "none");
            $modal.find(".-show:not(." + type + "-un-show)").css("modal-hidden");
            $modal.find(".-disabled:not(." + type + "-un-disabled)").prop("disabled", true);
            $modal.find(".-disabled:not(." + type + "-un-disabled)").find("select,input,textarea").prop("disabled", true);
            $modal.find(".-undisabled:not(." + type + "-un-undisabled)").prop("disabled", false);
            $modal.find(".-undisabled:not(." + type + "-un-undisabled)").find("select,input,textarea").prop("disabled", false);
            $modal.find(".-readonly:not(." + type + "-un-readonly)").prop("readonly", true);
            $modal.find(".-readonly:not(." + type + "-un-readonly)").find("select,input,textarea").prop("readonly", true);
            $modal.find(".-unreadonly:not(." + type + "-un-unreadonly)").prop("readonly", false);
            $modal.find(".-unreadonly:not(." + type + "-un-unreadonly)").find("select,input,textarea").prop("readonly", false);
            $modal.find(".-remove:not(." + type + "-un-remove)").remove();
            if (undefined != modal_fun && null != modal_fun) {
                modal_fun(data, setting);
            }
        }
    }

    /**
     * 默认标题
     */
    var default_title = "模态框";
    /**
     * 默认ajax成功回调
     */
    var default_ajax_success_fun = function (result) {

    }
    /**
     * modal显示之前的函数参数为ajax_data
     * @return true 显示模态框 false不显示
     */
    var default_prefix_modal_fun = function (ajax_data) {
        if (undefined == ajax_data || null == ajax_data) {
            return false;
        } else {
            return true;
        }
    }
    /**
     * 默认删除模态框的url
     */
    var default_del_url = "/dispatch/static/html/modal.html";
    /**
     * 初始化删除参数
     * @param setting 自定义设置
     * modal_selector 模态框选择器
     * url 模态框url 默认default_del_url常量
     * ajax_url ajax请求路径
     * ajax_type ajax请求类型 默认post
     * ajax_data_type ajax请求数据类型 默认json
     * ajax_success_fun ajax请求成功回调函数
     * ajax_data ajax请求参数
     * prefix_modal_fun modal显示之前的函数参数为ajax_data和setting对象,return true 显示模态框 false不显示
     * info_prompt_setting prefix_modal_fun return false的提示框设置 默认{modal_index:'0',type:'info',position:'top-right',html:'请选择你要删除的数据',prefix_modal_fun:null}
     * body_html 模态框主体html 默认 "<p>您确认要删除所选的信息吗？</p>"
     * @author YL
     */
    var init_del_setting = function (setting) {
        var result = {};
        var modal_selector = setting["modal_selector"];
        if (judge_string(modal_selector)) {
            console.log("[modal.js] [init_del_setting] modal_selector error");
        } else {
            result["modal_selector"] = modal_selector;
        }
        var url = setting["url"];
        if (judge_string(url)) {
            result["url"] = default_del_url;
        } else {
            result["url"] = url;
        }
        var ajax_url = setting["ajax_url"];
        if (judge_string(ajax_url)) {
            console.log("[modal.js] [init_del_setting] ajax_url error");
        } else {
            result["ajax_url"] = ajax_url;
        }
        var ajax_type = setting["ajax_type"];
        if (judge_string(ajax_type)) {
            result["ajax_type"] = "POST";
        } else {
            result["ajax_type"] = ajax_type;
        }
        var ajax_data_type = setting["ajax_data_type"];
        if (judge_string(ajax_data_type)) {
            result["ajax_data_type"] = "json";
        } else {
            result["ajax_data_type"] = ajax_data_type;
        }
        var ajax_success_fun = setting["ajax_success_fun"];
        if (typeof ajax_success_fun !== "function") {
            result["ajax_success_fun"] = default_ajax_success_fun;
        } else {
            result["ajax_success_fun"] = ajax_success_fun;
        }
        var ajax_data = setting["ajax_data"];
        if (typeof ajax_data !== "function") {
            result["ajax_data"] = null;
        } else {
            result["ajax_data"] = ajax_data;
        }
        var prefix_modal_fun = setting["prefix_modal_fun"];
        if (typeof prefix_modal_fun !== "function") {
            result["prefix_modal_fun"] = default_prefix_modal_fun;
        } else {
            result["prefix_modal_fun"] = prefix_modal_fun;
        }
        var info_prompt_setting = setting["info_prompt_setting"];
        if (judge_string(info_prompt_setting)) {
            result["info_prompt_setting"] = {
                modal_index: '0', type: 'info', position: 'top-right', html: '请选择你要删除的数据'
            };
        } else {
            result["info_prompt_setting"] = info_prompt_setting;
        }
        var body_html = setting["body_html"];
        if (judge_string(body_html)) {
            result["body_html"] = "<p>您确认要删除所选的信息吗？</p>";
        } else {
            result["body_html"] = body_html;
        }
        return result;
    };
    /**
     * 显示删除模态框
     */
    var show_del_modal = function (setting) {
        var setting = init_del_setting(setting);
        var ajax_data = setting['ajax_data']();
        var $modal = _get_modal(setting['modal_selector']);
        var url = setting['url'];
        var prefix_modal_fun = setting['prefix_modal_fun'];
        if (prefix_modal_fun(ajax_data, setting)) {
            $modal.load(url, '', function () {
                var body_html = setting['body_html'];
                $modal.find(".modal-body").html(body_html);
                $modal.find("#deleteWarning").hide();
                $modal.find(".modal-del-btn").click(function () {
                    model_del_fun(setting);
                });
                $modal.modal('show');
            })
        } else {
            show_prompt_modal(setting["info_prompt_setting"]);
        }
    };
    /**
     * 模态框的删除函数
     */
    var model_del_fun = function (setting) {
        var setting = init_del_setting(setting);
        var ajax_url = setting['ajax_url'];
        var ajax_type = setting['ajax_type'];
        var ajax_data_type = setting['ajax_data_type'];
        var ajax_success_fun = setting['ajax_success_fun'];
        // var service = require('service');
        base.load({
            url: ajax_url,
            dataType: ajax_data_type,
            data: setting['ajax_data'](),
            async: false,
            type: ajax_type,
            callback: function (result) {
                ajax_success_fun(result);
                _get_modal(setting['modal_selector'] + " .modal-close").click();
            }
        });
    };
    /**
     * 初始化警告模态框设置
     * @param modal_selector 模态框选择器
     * @param html 内容html
     * @param url 模态框地址 默认default_del_url常量
     */
    var init_warning_setting = function (setting) {
        var result = {};
        var modal_selector = setting["modal_selector"];
        if (judge_string(modal_selector)) {
            console.log("[modal.js] [init_warning_setting] modal_selector error");
        } else {
            result["modal_selector"] = modal_selector;
        }
        var url = setting["url"];
        if (judge_string(url)) {
            result["url"] = default_del_url;
        } else {
            result["url"] = url;
        }
        var html = setting["html"];
        if (judge_string(html)) {
            result["html"] = "";
        } else {
            result["html"] = html;
        }
        return result;
    };
    /**
     * 警告模态框
     * @param modal_selector 模态框选择器
     * @param html 内容html
     * @param url 模态框地址 默认default_del_url常量
     */
    var show_warning_modal = function (setting) {
        var setting = init_warning_setting(setting);
        var $modal = _get_modal(setting['modal_selector']);
        var url = setting['url'];
        var html = setting['html'];
        $modal.load(url, '', function () {
            $modal.modal('show');
            $modal.find("#isDelete").hide();
            $modal.find(".warning-text").html(html);
            $modal.find("#deleteWarning").show();
            setTimeout(function () {
                $modal.modal("hide")
            }, 1500);
        })
    };
    /**
     * 初始化提示框参数
     * @param modal_index 提示框编号 默认0
     * @param type 提示框类型 默认info（info error success warning）
     * @param position 提示框定位 默认top-right（top-right bottom-right bottom-left top-left top-full-width bottom-full-width top-center bottom-center）
     * @param html 内容html 默认为参数type
     * @param prefix_modal_fun modal显示之前的函数,return true 显示模态框 false不显示 默认返回true
     */
    var init_prompt_setting = function (setting) {
        var result = {};
        var modal_index = setting["modal_index"];
        if (judge_string(modal_index)) {
            result["modal_index"] = "0";
        } else {
            result["modal_index"] = modal_index;
        }
        var type = setting["type"];
        if (judge_string(type)) {
            result["type"] = "info";
        } else {
            result["type"] = type;
        }
        var position = setting["position"];
        if (judge_string(position)) {
            result["position"] = "top-right";
        } else {
            result["position"] = position;
        }
        var html = setting["html"];
        if (judge_string(html)) {
            result["html"] = type;
        } else {
            result["html"] = html;
        }
        var prefix_modal_fun = setting["prefix_modal_fun"];
        if (typeof prefix_modal_fun !== "function") {
            result["prefix_modal_fun"] = function () {
                return true;
            };
        } else {
            result["prefix_modal_fun"] = prefix_modal_fun;
        }
        return result;
    }
    /**
     * 提示框
     */
    var show_prompt_modal = function (setting) {
        setting = init_prompt_setting(setting);
        var modal_index = setting["modal_index"];
        var type = setting["type"];
        var position = setting["position"];
        var html = setting["html"];
        var prefix_modal_fun = setting["prefix_modal_fun"];
        if (prefix_modal_fun()) {
            var toast_html = '<div class="toast toast-' + type + '" aria-live="polite" style="">' +
                '<div class="toast-message">' + html + '</div>' +
                '</div>';
            var $toast = $(toast_html);
            var $body = _get_body();
            var $toast_main = $body.find(".toast-container[modal-index=" + modal_index + "]");
            if (undefined == $toast_main || null == $toast_main || $toast_main.length == 0) {
                var toast_main_html = '<div modal-index="' + modal_index + '" class="toast-container toast-' + position + '"></div>';
                $body.append(toast_main_html);
                $toast_main = $body.find(".toast-container");
            }
            $toast_main.append($toast);
            setTimeout(function () {
                $toast.animate({
                    opacity: 0
                }, "slow", function () {
                    $toast.remove();
                });
            }, 1500);
        }
    }
    /**
     * 是否开启查询到根
     * @type {boolean} true开启 false关闭
     */
    var _enabled_find_root = true;
    /**
     * 获得body节点
     */
    var _get_body = function () {
        if (_enabled_find_root) {
            var document = window.top.document;
            return $(document).find("body");
        } else {
            return $("body");
        }
    }
    /**
     * 根据模态框选择器获得模态框节点
     * @param modal_selector 模态框选择器
     * @return 模态框节点
     */
    var _get_modal = function (modal_selector) {
        if (_enabled_find_root) {
            var document = window.top.document;
            return $(document).find(modal_selector);
        } else {
            return $(modal_selector);
        }
    };
    var init = function () {
        if (_enabled_find_root) {
            $.fn.modal = window.top.$.fn.modal;
        }
    };
    init();
    window.modal = {
        show_del_modal: show_del_modal,
        show_modal: show_modal,
        show_warning_modal: show_warning_modal,
        show_prompt_modal: show_prompt_modal,
        init_node: init_node
    };
});