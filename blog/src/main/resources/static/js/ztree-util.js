/**
 * ztree工具js包
 * @author YL
 * @date 2020年1月3日 09:52:42
 */
$(function () {
    /**
     * 多个ztree对象
     */
    var ztrees = {};
    /**
     * 多个ztree设置项对象
     */
    var settings = {};
    /**
     * 初始化参数
     * @param setting 自定义设置
     * ztree_selector ztree选择器,ul标签
     * ztree_index 初始化ztree编号 默认为ztree选择器
     * ztree_input_selector ztree要赋值的input选择器 默认为空
     * ztree_div_selector ztree容器选择器 默认为ztree_selector的父节点
     * data 绑定的数据
     * click_fun 点击事件 参数e, treeId, treeNode
     * expand_all 是否展开全部节点 true展开 false不展开 默认false
     * @author YL
     */
    var init_setting = function (setting) {
        var result = {};
        var ztree_selector = setting["ztree_selector"];
        if (judge_string(ztree_selector)) {
            console.log("[ztree-util.js] [init_setting] ztree_selector error");
        } else {
            result["ztree_selector"] = ztree_selector;
        }
        var ztree_index = setting["ztree_index"];
        if (judge_string(ztree_index)) {
            result["ztree_index"] = ztree_selector;
        } else {
            result["ztree_index"] = ztree_index;
        }
        var ztree_input_selector = setting["ztree_input_selector"];
        if (judge_string(ztree_input_selector)) {
            result["ztree_input_selector"] = null;
        } else {
            result["ztree_input_selector"] = ztree_input_selector;
        }
        var ztree_div_selector = setting["ztree_div_selector"];
        if (judge_string(ztree_div_selector)) {
            result["ztree_div_selector"] = result["ztree_selector"] + ":parent";
        } else {
            result["ztree_div_selector"] = ztree_div_selector;
        }
        var data = setting["data"];
        if (judge_string(data)) {
            result["data"] = [];
        } else {
            result["data"] = data;
        }
        var click_fun = setting["click_fun"];
        if (typeof click_fun !== "function") {
            result["click_fun"] = function (e, treeId, treeNode) {
                if (!judge_string(ztree_input_selector)) {
                    $(result["ztree_input_selector"]).val(treeNode.name);
                    $(result["ztree_input_selector"]).attr("ztree-value", treeNode.id);
                    $(result["ztree_div_selector"]).hide();
                }
            };
        } else {
            result["click_fun"] = click_fun;
        }
        var expand_all = setting["expand_all"];
        if (judge_string(expand_all)) {
            result["expand_all"] = false;
        } else {
            result["expand_all"] = expand_all;
        }
        return result;
    }
    /**
     * 初始化ztree
     */
    var init_ztree = function (setting) {
        setting = init_setting(setting);
        settings[setting["ztree_index"]] = setting;
        var ztree = $.fn.zTree.init($(setting["ztree_selector"]), {
            view: {
                showLine: true//设置 zTree 是否显示节点之间的连线。默认值：true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: 'pId'
                }
            },
            callback: {
                onClick: setting["click_fun"]
            }
        }, setting["data"]);
        ztree.expandAll(setting["expand_all"]);
        ztrees[setting["ztree_index"]] = ztree;
        if (!judge_string(setting["ztree_input_selector"])) {
            var $ztree_input = $(setting["ztree_input_selector"]);
            var $ztree_div = $(setting["ztree_div_selector"]);
            $ztree_input.click(function () {
                show_menu($ztree_input, $ztree_div, setting["ztree_index"]);
            });
        }
    }

    /**
     * 显示树形菜单
     * @param $ztree_input ztree要赋值的input的jq对象
     * @param $ztree_div ztree容器的jq对象
     * @param ztree_index 初始化ztree编号
     */
    var show_menu = function ($ztree_input, $ztree_div, ztree_index) {
        var cityObj = $ztree_input;
        var cityOffset = cityObj.offset();
        if ($ztree_div.css("display") == 'none') {
            $ztree_div.css({
                // left: cityOffset.left + "px",
                // top: cityOffset.top + cityObj.outerHeight() + "px",
                left: cityObj[0].offsetLeft + "px",
                top: cityObj[0].offsetTop + cityObj.outerHeight() + "px",
                width: cityObj[0].offsetWidth + "px"
            }).show();
        } else {
            $ztree_div.hide();
        }
        $ztree_div.parents("body").bind("mousedown", function () {
            body_down_fun(event, ztree_index);
        });
    }
    /**
     * ztree隐藏
     * @param event event对象
     * @param ztree_index 初始化ztree编号
     */
    var body_down_fun = function (event, ztree_index) {
        var setting = settings[ztree_index];
        if (!(event.target.name == setting["ztree_input_selector"] || $(event.target).parents(setting["ztree_div_selector"]).length > 0)) {
            hide_menu(ztree_index);
        }
    }
    /**
     * 隐藏树形菜单
     * @param ztree_index 初始化ztree编号
     */
    var hide_menu = function (ztree_index) {
        var setting = settings[ztree_index];
        $(setting["ztree_div_selector"]).hide();
        $(setting["ztree_div_selector"]).unbind("mousedown", function () {
            body_down_fun(event, ztree_index);
        });
    }

    /**
     * 判断字符串是否为空、为空字符串
     * @param str 字符串
     */
    var judge_string = function (str) {
        return undefined == str || null == str || "" == str;
    }
    /**
     * 根据id触发点击事件
     * @param ztree_index ztree的初始化ztree编号
     * @param id id
     */
    var click_by_id = function (ztree_index, id) {
        var ztree = ztrees[ztree_index];
        var node = ztree.getNodeByParam("id", id);
        if (node != null) {
            ztree.selectNode(node, true);//指定选中ID的节点
            settings[ztree_index].click_fun(null, node.tId, node);
        }
    }

    window.ztree = {
        init_ztree: init_ztree,
        click_by_id: click_by_id
    }
});