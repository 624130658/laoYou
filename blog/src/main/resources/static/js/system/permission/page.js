$(function () {
    $.extend($.validator.defaults, {ignore: ".ignore"});
    table.init_table({
        "table_selector": "#myTab",
        "ajax_url": "/permission/page",
        "columns": [
            {
                "data": "name",
                "title": "名称"
            },
            {
                "data": "icon",
                "title": "图标"
            },
            {
                "data": "code",
                "title": "编码"
            },
            {
                "data": "type",
                "title": "类型",
                "render": function (data, type, row, meta) {
                    if (undefined != data && null != data) {
                        return data.desc;
                    }
                    return data;
                }
            },
            {
                "data": "url",
                "title": "路径"
            },
            {
                "data": "priority",
                "title": "排序"
            },
            {
                "data": "config",
                "title": "操作",
                "orderable": false,
                "render": function (data, type, row, meta) {
                    var row_str = JSON.stringify(row);
                    var html = "<a href='javascript:_detail(" + row_str + ");' class='btn btn-info btn-xs' title='详情'><i class='fa fa-search'></i> </a> ";
                    html += "<a href='javascript:_update(" + row_str + ");' class='btn btn-primary btn-xs' title='编辑'><i class='fa fa-edit'></i> </a> ";
                    html += "<a href='javascript:_add(" + row_str + ");' class='btn btn-success btn-xs' title='新增'><i class='fa fa-plus'></i> </a> ";
                    html += "<a href='javascript:_delete(" + row_str + ");' class='btn btn-danger btn-xs' title='删除'><i class='fa fa-trash'></i> </a> ";
                    return html;
                }
            }
        ],
        "prefix_columns": ["tree"],
        "ajax_data": function () {
            return $("#filterForm").serializeObject();
        },
        "id_field": "id",
        "parent_id_field": "parentId",
        "tree_setting": {
            "tree_node_fun": function (data, type, row, meta, setting) {
                return true;
            }
        }
    });
});

/**
 * 重置
 */
var reset = function () {
    $("#filterForm").find("select").val("");
    $("#filterForm").find("input").val("");
};

var update = function () {
    if (!_validate().form()) {
        return;
    }
    var document = window.top.document;
    base.post({
        url: "/permission/update",
        data: $(document).find('#myModal form').serializeObject(),
        async: false,
        callback: function (result) {
            table.table_ajax_reload('#myTab');
            var document = window.top.document;
            $(document).find("#myModal .modal-close").click();
        }
    });
};

var add = function () {
    if (!_validate().form()) {
        return;
    }
    var document = window.top.document;
    base.post({
        url: "/permission/add",
        data: $(document).find('#myModal form').serializeObject(),
        async: false,
        callback: function (result) {
            table.table_ajax_reload('#myTab');
            var document = window.top.document;
            $(document).find("#myModal .modal-close").click();
        }
    });
};

/**
 * 验证
 */
var _validate = function () {
    var document = window.top.document;
    return $(document).find('#myModal form').validate({
        rules: {
            name: "required",
            code: "required",
            type: "required"
        },
        messages: {
            name: "名称不能为空",
            code: "编码不能为空",
            type: "类型不能为空"
        },
        errorPlacement: function (error, element) {
            error.css("color", "red");
            element.parents(".modal-body-div").append(error);
        }
    });
};

var _detail = function (row) {
    modal.show_modal({
        modal_selector: "#myModal",
        url: "detail",
        type: "detail",
        title: "权限详情",
        disabled: true,
        data: row,
        ajax_setting: {
            type: "get",
            data: {
                "id": row.id
            }
        },
        prefix_bind_data_fun: function () {
            // var document = window.top.document;
            // $(document).find("#myModal [name=updateBtn]").click(update);
        }
    });
};

var _update = function (row) {
    modal.show_modal({
        modal_selector: "#myModal",
        url: "detail",
        type: "update",
        title: "权限修改",
        bind_data: false,
        disabled: false,
        data: row,
        ajax_setting: {
            type: "get",
            data: {
                "id": row.id
            }
        },
        prefix_bind_data_fun: function () {
            var document = window.top.document;
            $(document).find("#myModal [name=updateBtn]").click(update);
        }
    });
};

var _add = function (row) {
    var id;
    if (undefined != row && null != row && undefined != row.id && null != row.id) {
        id = row.id;
    }
    modal.show_modal({
        modal_selector: "#myModal",
        url: "detail",
        type: "add",
        title: "权限新增",
        disabled: false,
        ajax_setting: {
            type: "get",
            data: {
                "parentId": id
            }
        },
        prefix_bind_data_fun: function () {
            var document = window.top.document;
            $(document).find("#myModal [name=addBtn]").click(add);
        }
    });
};

var _delete = function (row) {
    var organization_id = row.id;
    modal.show_del_modal({
        modal_selector: "#myModal",
        ajax_url: "/permission/delete",
        ajax_success_fun: function (result) {
            table.table_ajax_reload('#myTab');
        },
        ajax_data: function () {
            return {
                "ids": [organization_id]
            }
        },
        prefix_modal_fun: function (ajax_data) {
            if (ajax_data["ids"].length > 0) {
                return true;
            } else {
                return false;
            }
        }
    });
};
