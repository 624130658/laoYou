/**
 * datatables相关js包
 * 前置js:jquery, bootstrap, datatables
 * @author YL
 */
$(function () {
    /**
     * 多个表格对象
     */
    var tables = {};
    /**
     * 多个表格设置项对象
     */
    var settings = {};
    /**
     * 多个表格数据
     */
    // var datas = {};
    sessionStorage.setItem('_datas', JSON.stringify({}));

    var _service = window.base;
    /**
     * 初始化参数
     * @param setting 自定义设置
     *
     * table_selector 表格选择器
     * language 提示信息
     * ordering 是否启用全局排序
     * ajax_url ajax请求路径 默认null 若为null则不走ajax 启用data
     * ajax_type ajax请求类型 默认post
     * ajax_data_type ajax请求数据类型 默认json
     * ajax_success_fun ajax请求成功回调函数（暂无，下次再写）
     * ajax_data ajax请求参数 默认包含分页以及排序
     * columns 表头
     * columns_select 表头是否增加单选或者多选 checkbox radio none(以后将要弃用,将要改用prefix_columns、suffix_columns)
     * prefix_columns 在表头前增加其他功能性表头 数组 (['checkbox','radio','tree']) 按照顺序 目前暂时只有三种
     * suffix_columns 在表头后增加其他功能性表头 数组 (['checkbox','radio','tree']) 按照顺序 目前暂时只有三种
     * tree_setting 树结构相关配置json格式 {size:10,page:0,children_size_field:"childrenSize",tree_node_fun:function}
     *              size:一页的大小(默认10),page:起始页码(默认0),children_size_field:子节点数量列名(默认childrenSize)
     *              tree_node_fun:判断树节点是否存在的方法 参数为data, type, row, meta, setting 返回值为 true:有展开节点 false:无展开节点 默认根据子节点数量是否大于0判断有无展开节点
     * id_field id列名 默认id
     * parent_id_field 父id列名 默认parentId
     * table_index 初始化表格编号 默认为表格选择器
     * data 静态数据 默认[]空数组
     * draw_callback 重绘表格的回调函数
     * order 默认排序 如：[["id","desc"],["name","asc"]] 二层数组 最里层数组的第一个值为column的data值，第二个值是排序方式
     */
    var init_setting = function (setting) {
        var result = {};
        var table_selector = setting["table_selector"];
        if (judge_string(table_selector)) {
            console.log("[table.js] [init_setting] table_selector error");
        } else {
            result["table_selector"] = table_selector;
        }
        var language = setting["language"];
        if (judge_string(language)) {
            result["language"] = default_language;
        } else {
            result["language"] = language;
        }
        var ordering = setting["ordering"];
        if (judge_string(ordering)) {
            result["ordering"] = true;
        } else {
            result["ordering"] = ordering;
        }
        var ajax_url = setting["ajax_url"];
        if (judge_string(ajax_url)) {
            result["ajax_url"] = null;
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
        /**
         * todo columns_select 将要废弃 建议用prefix_columns、suffix_columns
         * *********start*********
         */
        var columns_select = setting["columns_select"];
        if (undefined == columns_select || null == columns_select) {
            result["columns_select"] = "none";
        } else {
            result["columns_select"] = columns_select;
        }
        var prefix_columns = setting["prefix_columns"];
        if (undefined == prefix_columns || null == prefix_columns) {
            result["prefix_columns"] = [];
        } else {
            result["prefix_columns"] = prefix_columns;
        }
        var suffix_columns = setting["suffix_columns"];
        if (undefined == suffix_columns || null == suffix_columns) {
            result["suffix_columns"] = [];
        } else {
            result["suffix_columns"] = suffix_columns;
        }
        /**
         * todo columns_select 将要废弃 建议用prefix_columns、suffix_columns
         * *********end*********
         */
        var columns = setting["columns"];
        if (undefined == columns || null == columns) {
            console.log("[table.js] [init_setting] columns error");
        } else {
            /**
             * todo columns_select 将要废弃 建议用prefix_columns、suffix_columns
             * *********start*********
             */
            if (result["columns_select"] == "none") {
            } else if (result["columns_select"] == "checkbox") {
                columns.unshift(default_checkbox);
            } else if (result["columns_select"] == "radio") {
                columns.unshift(default_radio);
            }
            var add_prefix_columns = get_columns_by_strs(result["prefix_columns"]);
            columns = add_prefix_columns.concat(columns);
            var add_suffix_columns = get_columns_by_strs(result["suffix_columns"]).reverse();
            columns = columns.concat(add_suffix_columns);
            /**
             * todo columns_select 将要废弃 建议用prefix_columns、suffix_columns
             * *********end*********
             */
            result["columns"] = columns;
        }
        result["tree_setting"] = init_tree_setting(setting["tree_setting"]);
        var id_field = setting["id_field"];
        if (judge_string(id_field)) {
            result["id_field"] = "id";
        } else {
            result["id_field"] = id_field;
        }
        var parent_id_field = setting["parent_id_field"];
        if (judge_string(parent_id_field)) {
            result["parent_id_field"] = "parentId";
        } else {
            result["parent_id_field"] = parent_id_field;
        }
        var table_index = setting["table_index"];
        if (judge_string(table_index)) {
            result["table_index"] = table_selector;
        } else {
            result["table_index"] = table_index;
        }
        var data = setting["data"];
        if (judge_string(data)) {
            result["data"] = [];
        } else {
            result["data"] = data;
        }
        var draw_callback = setting["draw_callback"];
        if (typeof draw_callback !== "function") {
            result["draw_callback"] = function () {
            };
        } else {
            result["draw_callback"] = draw_callback;
        }
        var order = setting["order"];
        if (undefined == order || null == order) {
            result["order"] = [];
        } else {
            result["order"] = order;
        }
        return result;
    }
    /**
     * 根据setting获得初始化表格编号
     * @param setting 设置项
     */
    var get_table_index = function (setting) {
        var table_selector = setting["table_selector"];
        if (judge_string(table_selector)) {
            console.log("[table.js] [init_setting] table_selector error");
        } else {
            table_selector = table_selector;
        }
        var table_index = setting["table_index"];
        if (judge_string(table_index)) {
            table_index = table_selector;
        } else {
            table_index = table_index;
        }
        return table_index;
    }
    /**
     * 初始化树结构参数
     * @param setting 自定义设置
     * size:一页的大小 默认10
     * page:起始页码 默认0
     * children_size_field:子节点数量列名 默认childrenSize
     * tree_node_fun:判断树节点是否存在的方法 参数为data, type, row, meta, setting 返回值为 true:有展开节点 false:无展开节点 默认根据子节点数量是否大于0判断有无展开节点
     */
    var init_tree_setting = function (setting) {
        if (undefined == setting || null == setting) {
            setting = {};
        }
        var result = {};
        var size = setting["size"];
        if (judge_string(size)) {
            result["size"] = 10;
        } else {
            result["size"] = size;
        }
        var page = setting["page"];
        if (judge_string(page)) {
            result["page"] = 0;
        } else {
            result["page"] = page;
        }
        var children_size_field = setting["children_size_field"];
        if (judge_string(children_size_field)) {
            result["children_size_field"] = "childrenSize";
        } else {
            result["children_size_field"] = children_size_field;
        }
        var tree_node_fun = setting["tree_node_fun"];
        if (typeof tree_node_fun !== "function") {
            result["tree_node_fun"] = function (data, type, row, meta, setting) {
                var children_size_field = setting["tree_setting"]["children_size_field"];
                var children_size = row[children_size_field];
                return children_size > 0;
            };
        } else {
            result["tree_node_fun"] = tree_node_fun;
        }
        return result;
    }
    /**
     * 表格重新加载
     * @param table_index 初始化表格编号 默认为表格选择器
     */
    var table_ajax_reload = function (table_index) {
        tables[table_index].ajax.reload();
    }
    /**
     * 表格重新加载
     * @param table_api table_api对象
     */
    var table_ajax_reload_by_api = function (table_api) {
        table_api.ajax.reload();
    }

    /**
     * 判断字符串是否为空、为空字符串
     * @param str 字符串
     */
    var judge_string = function (str) {
        return undefined == str || null == str || "" == str;
    }
    /**
     * 初始化表格
     * @param setting 自定义设置
     */
    var init_table = function (setting) {
        reset_table(get_table_index(setting));
        setting = init_setting(setting);
        $(setting["table_selector"]).attr('table-index', setting["table_index"]);
        settings[setting["table_index"]] = setting;
        var table_thead_html = get_table_thead_html(setting["columns"]);
        $(setting["table_selector"]).html(table_thead_html);
        init_checkbox(setting["table_selector"]);
        var data_table_setting = {
            language: setting["language"],  //提示信息
            autoWidth: false,  //禁用自动调整列宽
            stripeClasses: ["odd", "even"],  //为奇偶行加上样式，兼容不支持CSS伪类的场合
            processing: true,  //隐藏加载提示,自行处理
            searching: false,  //禁用原生搜索
            orderMulti: false,  //启用多列排序
            ordering: setting["ordering"],
            // iDisplayLength: 5,
            order: init_table_order(setting),  //取消默认排序查询,否则复选框一列会出现小箭头
            renderer: "bootstrap",  //渲染样式：Bootstrap和jquery-ui
            pagingType: "simple_numbers",  //分页样式：simple,simple_numbers,full,full_numbers
            // columnDefs: [{
            //     "targets": 'nosort',  //列的样式名
            //     "orderable": false    //包含上样式名‘nosort’的禁止排序
            // }],
            //列表表头字段
            columns: setting["columns"],
            fnDrawCallback: setting["draw_callback"]
        };
        var ajax_url = setting["ajax_url"];
        if (undefined != ajax_url && null != ajax_url) {
            var ajax = function (data, callback, settings) {
                //封装请求参数
                var ajax_data = {};
                ajax_data.size = data.length;
                ajax_data.page = data.start / data.length;
                if (undefined == data.order || null == data.order || undefined == data.order[0] || null == data.order[0]) {
                    ajax_data.sort = "id,desc";//默认按照主键排序
                } else {
                    ajax_data.sort = setting["columns"][data.order[0]["column"]]["data"] + "," + data.order[0]["dir"];
                }
                if (undefined == setting["ajax_data"] || null == setting["ajax_data"]) {
                } else {
                    Object.assign(ajax_data, setting["ajax_data"]());
                }

                //ajax请求数据
                _service.load({
                    type: setting["ajax_type"],
                    url: setting["ajax_url"],
                    cache: false,  //禁用缓存
                    async: false,
                    data: ajax_data,  //传入组装的参数
                    dataType: setting["ajax_data_type"],
                    callback: function (result) {
                        $(setting["table_selector"]).find("thead [type=checkbox][name=all_checked]").prop('checked', false);
                        var data = result.data;
                        var returnData = {};
                        returnData.recordsTotal = data.totalElements;
                        returnData.recordsFiltered = data.totalElements;
                        returnData.data = data.content;
                        set_data(setting["table_index"], data.content);
                        callback(returnData);
                    }
                });
            }
            data_table_setting.ajax = ajax;
            data_table_setting.serverSide = true;  //启用服务器端分页
        } else {
            data_table_setting.data = setting["data"];
            data_table_setting.serverSide = false;
            // datas[setting["table_index"]] = setting["data"];
            set_data(setting["table_index"], setting["data"]);
        }
        //初始化表格
        var table = $(setting["table_selector"]).dataTable(data_table_setting).api();//此处需调用api()方法,否则返回的是JQuery对象而不是DataTables的API对象
        tables[setting["table_index"]] = table;
        init_tree(setting["table_index"]);
    }
    /**
     * 初始化表格排序
     * @param setting 自定义设置
     */
    var init_table_order = function (setting) {
        var columns = setting["columns"];
        var orders = setting["order"];
        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            for (var j = 0; j < columns.length; j++) {
                var column = columns[j];
                if (order[0] == column.data) {
                    order[0] = j;
                }
            }
        }
        return orders;
    }
    /**
     * 重置table相关信息
     * @param table_index 初始化表格编号 默认为表格选择器(不填时为表格选择器)
     */
    var reset_table = function (table_index) {
        if (undefined != tables[table_index] && null != tables[table_index]) {
            tables[table_index].destroy();
        }
        delete tables[table_index];
        delete settings[table_index];
        var datas = JSON.parse(sessionStorage.getItem('_datas'));
        delete datas[table_index];
        sessionStorage.setItem('_datas', JSON.stringify(datas));
    }

    /**
     * 获得被选中的数据
     * @param table_selector 表格选择器
     * @param table_index 初始化表格编号 默认为表格选择器(不填时为表格选择器)
     * @param field 所需获得列数据(不填时为全部)
     */
    var get_select_data = function (table_selector, table_index, field) {
        var result = [];
        var has_field = false;
        if (undefined == table_index || null == table_index || "" == table_index) {
            table_index = table_selector;
        }
        if (undefined != field && null != field && "" != field) {
            has_field = true;
        }
        // var data = tables[table_index].data();
        // var data = datas[table_index];
        var data = get_data(table_index);
        var rows = $(table_selector).find("tbody tr");
        for (var i = 0; i < rows.length; i++) {
            var checked = $(rows[i]).find("[name=row_checked]").prop('checked');
            if (checked) {
                if (has_field) {
                    result.push(data[i][field]);
                } else {
                    result.push(data[i]);
                }
            }
        }
        return result;
    }
    /**
     * 设置数据
     * @param table_index 初始化表格编号 默认为表格选择器(不填时为表格选择器)
     * @param data 要设置的值
     */
    var set_data = function (table_index, data) {
        var datas = JSON.parse(sessionStorage.getItem('_datas'));
        datas[table_index] = data;
        sessionStorage.setItem('_datas', JSON.stringify(datas));
    }

    /**
     * 获得数据
     * @param table_selector 表格选择器
     * @param table_index 初始化表格编号 默认为表格选择器(不填时为表格选择器)
     * @param field 所需获得列数据(不填时为全部)
     */
    var get_data = function (table_selector, table_index, field) {
        var result = [];
        var has_field = false;
        if (undefined == table_index || null == table_index || "" == table_index) {
            table_index = table_selector;
        }
        if (undefined != field && null != field && "" != field) {
            has_field = true;
        }
        // var data = tables[table_index].data();
        var datas = JSON.parse(sessionStorage.getItem('_datas'));
        var data = datas[table_index];

        if (!data) {
            return result;
        }

        for (var i = 0; i < data.length; i++) {
            if (has_field) {
                result.push(data[i][field]);
            } else {
                result.push(data[i]);
            }
        }
        return result;
    }
    /**
     * 获得表格api对象
     * @param table_index 初始化表格编号 默认为表格选择器
     */
    var get_table_api = function (table_index) {
        return tables[table_index];
    }
    /**
     * 获得setting对象
     * @param table_index 初始化表格编号 默认为表格选择器
     */
    var get_setting = function (table_index) {
        return settings[table_index];
    }
    /**
     * 初始化树组件
     * @param table_index 初始化表格编号 默认为表格选择器
     */
    var init_tree = function (table_index) {
        var setting = get_setting(table_index);
        var table_selector = setting["table_selector"];
        var $table = $(table_selector);
        $table.on("click", "[name=row_tree]", function () {
            var $this = $(this);
            var $td = $this.parent("td");
            var tree_type = $this.attr("tree-type");
            var tree_id = $this.attr("tree-id");
            var tree_parent_id = $this.attr("tree-parent-id");
            if (tree_type == "open") {
                $td.html(get_default_tree_close_html(table_selector, tree_id, tree_parent_id));
                set_tree_close_html(table_index, tree_id);
                //todo 暂时把checkbox重置掉 以后再着手修改
                reset_checkbox(table_selector);
            } else if (tree_type == "close") {
                $td.html(get_default_tree_open_html(table_selector, tree_id, tree_parent_id));
                page_skip_fun(table_index, tree_id, setting["tree_setting"]["page"]);
            }
        });
        $table.on("click", "tr[name=page_tr] [name=prev]", function () {
            var $this = $(this);
            var $tr = $this.parents("tr");
            var disabled = $this.hasClass("disabled");
            if (disabled) {
                return;
            }
            var tree_parent_id = $tr.attr("tree-parent-id");
            var page = Number($tr.attr("page-no")) - 2;
            page_skip_fun(table_selector, tree_parent_id, page);
        })
        $table.on("click", "tr[name=page_tr] [name=next]", function () {
            var $this = $(this);
            var $tr = $this.parents("tr");
            var disabled = $this.hasClass("disabled");
            if (disabled) {
                return;
            }
            var tree_parent_id = $tr.attr("tree-parent-id");
            var page = Number($tr.attr("page-no"));
            page_skip_fun(table_selector, tree_parent_id, page);
        })
        $table.on("click", "tr[name=page_tr] [name=page_no]", function () {
            var $this = $(this);
            var $tr = $this.parents("tr");
            var active = $this.hasClass("active");
            if (active) {
                return;
            }
            var tree_parent_id = $tr.attr("tree-parent-id");
            var page = Number($this.attr("page-index"));
            page_skip_fun(table_selector, tree_parent_id, page);
        })
    }
    /**
     * 跳页方法
     * @param table_index 初始化表格编号 默认为表格选择器
     * @param tree_parent_id 父id
     * @param page 页码
     */
    var page_skip_fun = function (table_index, tree_parent_id, page) {
        set_tree_close_html(table_index, tree_parent_id);
        var table_selector = get_setting(table_index)["table_selector"];
        var $table = $(table_selector);
        var table_api = get_table_api(table_index);
        var setting = get_setting(table_index);
        var order = table_api.order();
        var $tr = $table.find("[tree-id=" + tree_parent_id + "]").parents("tr");
        var ajax_data = {};
        ajax_data[setting["parent_id_field"]] = tree_parent_id;
        ajax_data.size = setting["tree_setting"]["size"];
        ajax_data.page = page;
        if (undefined == order || null == order || undefined == order[0] || null == order[0]) {
            ajax_data.sort = "";
        } else {
            ajax_data.sort = setting["columns"][order[0][0]]["data"] + "," + order[0][1];
        }
        if (undefined == setting["ajax_data"] || null == setting["ajax_data"]) {
        } else {
            Object.assign(ajax_data, setting["ajax_data"]());
        }
        _service.load({
            type: setting["ajax_type"],
            url: setting["ajax_url"],
            cache: false,  //禁用缓存
            async: false,
            data: ajax_data,  //传入组装的参数
            dataType: setting["ajax_data_type"],
            callback: function (result) {
                $(setting["table_selector"]).find("thead [type=checkbox][name=all_checked]").prop('checked', false);
                var data = result.data;
                var param = {};
                param.total = data.totalElements;
                param.data = data.content;
                param.page = page;
                set_tree_open_html($tr, table_index, param, tree_parent_id);
            }
        });

        //todo 暂时把checkbox重置掉 以后再着手修改
        reset_checkbox(table_selector);
    }
    /**
     * 设置树结构关闭的html
     * @param table_index 表格编号 默认为表格选择器
     * @param tree_id id
     */
    var set_tree_close_html = function (table_index, tree_id) {
        var data = get_data(table_index);
        var table_selector = get_setting(table_index)["table_selector"];
        var $start_remove_tr = $(table_selector).find("tbody tr [name=row_tree][tree-parent-id=" + tree_id + "]").parents("tr:eq(0)");
        var $end_remove_tr = $(table_selector + " tbody tr[tree-parent-id=" + tree_id + "]");
        if ($end_remove_tr.length == 0) {
            $end_remove_tr = $(table_selector + " tbody tr [name=row_tree][tree-parent-id=" + tree_id + "]").parents("tr:eq(-1)");
        }
        var start_remove_tr_index = $start_remove_tr.index();
        var end_remove_tr_index = $end_remove_tr.index();
        if (start_remove_tr_index < 0 || end_remove_tr_index < 0) {
        } else {
            data.splice(start_remove_tr_index, end_remove_tr_index - start_remove_tr_index + 1);
            // datas[table_index] = data;
            set_data(table_index, data);
        }
        if (start_remove_tr_index == end_remove_tr_index) {
            $start_remove_tr.remove();
        } else {
            var $all_remove_trs = $start_remove_tr.nextUntil($end_remove_tr[0], "tr");
            $all_remove_trs.remove();
            $start_remove_tr.remove();
            $end_remove_tr.remove();
        }
    }
    /**
     * 设置树结构打开的html
     * @param $tr tr的jq对象 html是拼在这个对象的后面的
     * @param table_index 表格编号 默认为表格选择器
     * @param param 数据 {total:总条数,data:本页的数据,page:要跳转的页码(从0开始数)}
     * @param parent_tree_id 父id
     * TODO 跳页html未写 以后再写
     */
    var set_tree_open_html = function ($tr, table_index, param, parent_tree_id) {
        var table_data = get_data(table_index);
        var splice_index = $tr.index() + 1;
        var html = "";
        var data = param.data;
        var total = param.total;
        var page = param.page;
        var setting = get_setting(table_index);
        var size = setting["tree_setting"]["size"];
        var columns = setting["columns"];
        var meta_setting = get_table_api(table_index).settings()[0];
        for (var i = 0; i < data.length; i++) {
            var temp = data[i];
            table_data.splice(splice_index, 0, temp);
            html += "<tr>";
            for (var j = 0; j < columns.length; j++) {
                var meta = {};
                meta.settings = meta_setting;
                meta.col = j;
                var column = columns[j];
                var render = column.render;
                html += "<td>";
                if (typeof render !== "function") {
                    var temp_data = temp[column.data];
                    if (undefined == temp_data || null == temp_data) {
                        temp_data = "";
                    }
                    html += temp_data;
                } else {
                    html += render(temp[column.data], column.type, temp, meta);
                }
                html += "</td>";
            }
            html += "</tr>";
            splice_index++;
        }
        if (total > size) {
            table_data.splice(splice_index, 0, {});
            var start_num = page * size + 1;
            var end_num = start_num + data.length - 1;
            var page_size = Math.ceil(total / size);
            var page_no_html = "";
            var previous_disabled = "";
            var next_disabled = "";
            if (page + 1 == 1) {
                previous_disabled = " disabled";
            }
            if (page + 1 == page_size) {
                next_disabled = " disabled";
            }
            if (total == 0) {
                start_num = 0;
                next_disabled = " disabled";
            }
            var start_page_no = page - 4;
            var end_page_no = page + 5;
            var prefix_page_no_html = "";
            var suffix_page_no_html = "";
            if (start_page_no <= 1) {
                end_page_no = end_page_no - start_page_no + 1;
                start_page_no = 1;
                if (end_page_no >= page_size) {
                    end_page_no = page_size;
                }
            } else {
                prefix_page_no_html += "<li class='paginate_button page-item disabled' name='prefix_page_no'><a href='javascript:void(0);' class='page-link'>...</a></li>";
            }
            if (end_page_no >= page_size) {
                start_page_no = start_page_no - (end_page_no - page_size);
                end_page_no = page_size;
                if (start_page_no <= 1) {
                    start_page_no = 1;
                }
            } else {
                suffix_page_no_html += "<li class='paginate_button page-item disabled' name='suffix_page_no'><a href='javascript:void(0);' class='page-link'>...</a></li>";
            }
            for (var i = start_page_no; i <= end_page_no; i++) {
                var active = "";
                if (i == page + 1) {
                    active = " active";
                }
                page_no_html += "<li class='paginate_button page-item" + active + "' name='page_no' page-index='" + (i - 1) + "'><a href='javascript:void(0);' class='page-link'>" + i + "</a></li>";
            }
            var page_html = "<div class='row'>" +
                "<div class='col-sm-12 col-md-5'>" +
                "<div class='dataTables_info'>" +
                "当前显示第 <span name='start_num'>" + start_num + "</span> 至 <span name='end_num'>" + end_num + "</span> 项，共 <span name='total'>" + total + "</span> 项。" +
                "</div></div><div class='col-sm-12 col-md-7'>" +
                "<div class='dataTables_paginate paging_simple_numbers'><ul class='pagination'>" +
                "<li class='paginate_button page-item previous" + previous_disabled + "' name='prev'>" +
                "<a href='javascript:void(0);' class='page-link'>上页</a></li>" +
                prefix_page_no_html + page_no_html + suffix_page_no_html +
                "<li class='paginate_button page-item next" + next_disabled + "' name='next'>" +
                "<a href='javascript:void(0);' class='page-link'>下页</a></li>" +
                "</ul></div></div></div>";
            html += "<tr name='page_tr' style='text-align: left;' tree-parent-id='" + parent_tree_id + "' page-no='" + (page + 1) + "'><td colspan='" + columns.length + "'>" + page_html + "</td></tr>";
        }
        // datas[table_index] = table_data;
        set_data(table_index, table_data);
        $tr.after(html);
    }

    /**
     * 初始化多选框
     * @param table_selector 表格选择器
     */
    var init_checkbox = function (table_selector) {
        $(table_selector).on("change", "thead [type=checkbox][name=all_checked]", function () {
            var $this = $(this);
            var checked = $this.prop('checked');
            $(table_selector).find("tbody [type=checkbox][name=row_checked]").prop('checked', checked);
        });
        $(table_selector).on("change", "tbody [type=checkbox][name=row_checked]", function () {
            var rows = $(table_selector).find("tbody [type=checkbox][name=row_checked]");
            for (var i = 0; i < rows.length; i++) {
                var row = $(rows[i]);
                if (!row.prop('checked')) {
                    $(table_selector).find("thead [type=checkbox][name=all_checked]").prop('checked', false);
                    break;
                }
                if (i + 1 == rows.length) {
                    $(table_selector).find("thead [type=checkbox][name=all_checked]").prop('checked', true);
                }
            }
        });
    }
    /**
     * 重置check为未选中状态
     * @param table_selector 表格选择器
     */
    var reset_checkbox = function (table_selector) {
        $(table_selector).find("thead [type=checkbox][name=all_checked]").prop('checked', false);
        $(table_selector).find("tbody [type=checkbox][name=row_checked]").prop('checked', false);
    }
    /**
     * 添加一行
     * @param table_index 表格下标
     * @param data 数据
     */
    var row_add = function (table_index, data) {
        get_table_api(table_index).row.add(data).draw();
        var new_data = get_data(table_index);
        new_data.push(data);
        // datas[table_index] = new_data;
        set_data(table_index, new_data);
        reset_checkbox(get_setting(table_index)["table_selector"]);
    }
    /**
     * 删除行
     * @param table_index 表格下标
     * @param delete_indexs 要删除的下标集合
     */
    var row_delete = function (table_index, delete_indexs) {
        delete_indexs = delete_indexs.sort(descending_order_fun);
        var setting = get_setting(table_index);
        var rows = $(setting["table_selector"]).find("tbody tr");
        var new_data = get_data(table_index);
        for (var i = 0; i < delete_indexs.length; i++) {
            var delete_index = delete_indexs[i];
            get_table_api(table_index).row(rows.eq(delete_index)).remove();
            new_data.splice(delete_index, 1);
        }
        // datas[table_index] = new_data;
        set_data(table_index, new_data);
        get_table_api(table_index).draw();
        reset_checkbox(get_setting(table_index)["table_selector"]);
    }

    /**
     * 获得表头html
     * @param columns
     */
    var get_table_thead_html = function (columns) {
        var html = "<thead><tr>";
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var type = column["type"];
            var title = column["title"];
            var temp_html;
            if ("checkbox" == type) {
                temp_html = "<th><input type=\"checkbox\" name=\"all_checked\"/></th>";
            } else if ("radio" == type) {
                temp_html = "<th></th>";
            } else if ("tree" == type) {
                temp_html = "<th></th>";
            } else {
                temp_html = "<th>" + title + "</th>";
            }
            html += temp_html;
        }
        html += "</tr></thead>";
        return html;
    }
    //默认树结构 树结构的render中的row: 当前行的索引是失效的
    var default_tree = {
        "type": "tree",
        "data": "tree",
        "orderable": false,
        "render": function (data, type, row, meta) {
            var table_index = $(meta.settings.nTable).attr("table-index");
            var setting = get_setting(table_index);
            var id_field = setting["id_field"];
            var parent_id_field = setting["parent_id_field"];
            var tree_node_fun = setting["tree_setting"]["tree_node_fun"];
            // var children_size_field = setting["tree_setting"]["children_size_field"];
            // var children_size = row[children_size_field];
            if (tree_node_fun(data, type, row, meta, setting)) {
                return get_default_tree_close_html(setting["table_selector"], row[id_field], row[parent_id_field]);
            } else {
                return get_default_tree_blank_html(setting["table_selector"], row[id_field], row[parent_id_field]);
            }
        }
    }
    /**
     * 默认树结构的关闭html
     */
    var get_default_tree_close_html = function (table_selector, id, parent_id) {
        var blank_html = "";
        var tree_index = 0;
        if (undefined == parent_id || null == parent_id || "" == parent_id) {
            parent_id = "";
        } else {
            tree_index = Number($(table_selector).find("[name=row_tree][tree-id=" + parent_id + "]").attr("tree-index")) + 1;
            for (var i = 0; i < tree_index; i++) {
                blank_html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
        }
        return blank_html + "<span name=\"row_tree\" tree-index='" + tree_index + "' tree-id='" + id + "' tree-parent-id='" + parent_id + "' tree-type='close'><i class=\"fa fa-plus-square\"></i></span>";
    }
    /**
     * 默认树结构的展开html
     */
    var get_default_tree_open_html = function (table_selector, id, parent_id) {
        var blank_html = "";
        var tree_index = 0;
        if (undefined == parent_id || null == parent_id || "" == parent_id) {
            parent_id = "";
        } else {
            tree_index = Number($(table_selector).find("[name=row_tree][tree-id=" + parent_id + "]").attr("tree-index")) + 1;
            for (var i = 0; i < tree_index; i++) {
                blank_html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
        }
        return blank_html + "<span name=\"row_tree\" tree-index='" + tree_index + "' tree-id='" + id + "' tree-parent-id='" + parent_id + "' tree-type='open'><i class=\"fa fa-minus-square\"></i></span>";
    }
    /**
     * 默认树结构的空白html
     */
    var get_default_tree_blank_html = function (table_selector, id, parent_id) {
        var blank_html = "";
        var tree_index = 0;
        if (undefined == parent_id || null == parent_id || "" == parent_id) {
            parent_id = "";
        } else {
            tree_index = Number($(table_selector).find("[name=row_tree][tree-id=" + parent_id + "]").attr("tree-index")) + 1;
            for (var i = 0; i < tree_index; i++) {
                blank_html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
        }
        return blank_html + "<span name=\"row_tree\" tree-index='" + tree_index + "' tree-id='" + id + "' tree-parent-id='" + parent_id + "' tree-type='blank'></span>";
    }

    //默认多选框
    var default_checkbox = {
        "type": "checkbox",
        "data": "checkbox",
        "orderable": false,
        "render": function (data, type, row, meta) {
            return "<input type=\"checkbox\" name=\"row_checked\"/>";
        }
    }
    //默认单选框
    var default_radio = {
        "type": "radio",
        "data": "radio",
        "orderable": false,
        "render": function (data, type, row, meta) {
            return "<input type=\"checkbox\" name=\"row_checked\"/>";
        }
    }
    //默认提示信息
    var default_language = {
        "sProcessing": "处理中...",
        "sLengthMenu": "每页 _MENU_ 项",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
        "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页",
            "sJump": "跳转"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    };
    //默认ajax成功的回调方法
    var default_ajax_success_fun = function (result) {
        if (result.success) {
            var data = result.data;
            var returnData = {};
            returnData.recordsTotal = data.totalElements;
            returnData.recordsFiltered = data.totalElements;
            returnData.data = data.content;
            callback(returnData);
        } else {
            alert(result.message);
        }
    }


    /**
     * 根据字符串数组获得column数组
     * @param strs
     */
    var get_columns_by_strs = function (strs) {
        var result = [];
        for (var i = 0; i < strs.length; i++) {
            var str = strs[i];
            if (str == "tree") {
                result.push(default_tree);
            } else if (str == "checkbox") {
                result.push(default_checkbox);
            } else if (str == "radio") {
                result.push(default_radio);
            }
        }
        return result;
    }
    /**
     * sort降序函数
     */
    var descending_order_fun = function (a, b) {
        return b - a;
    }
    window.table = {
        table_ajax_reload: table_ajax_reload,
        table_ajax_reload_by_api: table_ajax_reload_by_api,
        init_table: init_table,
        get_select_data: get_select_data,
        get_data: get_data,
        get_table_api: get_table_api,
        get_setting: get_setting,
        reset_checkbox: reset_checkbox,
        row_add: row_add,
        row_delete: row_delete
    };
});

