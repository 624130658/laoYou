$(function () {
    validate_add_method();
    table.init_table({
        "table_selector": "#myTab",
        "ajax_url": "/user/page",
        "columns": [
            {
                "data": "name",
                "title": "名称"
            },
            {
                "data": "account",
                "title": "帐号"
            },
            {
                "data": "phone",
                "title": "手机号码"
            },
            {
                "data": "email",
                "title": "电子邮箱"
            },
            // {
            //     "data": "created",
            //     "title": "创建时间"
            // },
            // {
            //     "data": "creator",
            //     "title": "创建人"
            // },
            {
                "data": "config",
                "title": "操作",
                "orderable": false,
                "render": function (data, type, row, meta) {
                    var row_str = JSON.stringify(row);
                    var html = "<a href='javascript:_detail(" + row_str + ");' class='btn btn-info btn-xs' title='详情'><i class='fa fa-search'></i> </a> ";
                    html += "<a href='javascript:_update(" + row_str + ");' class='btn btn-primary btn-xs' title='编辑'><i class='fa fa-edit'></i> </a> ";
                    html += "<a href='javascript:_delete(" + row_str + ");' class='btn btn-danger btn-xs' title='删除'><i class='fa fa-trash'></i> </a> ";
                    return html;
                }
            }
        ],
        "prefix_columns": ["checkbox"],
        "ajax_data": function () {
            return $("#filterForm").serializeObject();
        }
    });
    table.init_table({
        "table_selector": "#organizationTab",
        "ajax_url": "/organization/page",
        "columns": _organization_columns(),
        "prefix_columns": ["tree"],
        "ajax_data": function () {
            return {
                // "name": $("#role_query_name").val(),
                // "status": $("#role_query_status").val()
            }
        },
        "id_field": "id",
        "parent_id_field": "parentId",
        "tree_setting": {
            "tree_node_fun": function (data, type, row, meta, setting) {
                return true;
            }
        }
    });
    // ztree.init_ztree({
    //     "ztree_selector": "#employee_organization_name_ul",
    //     "ztree_div_selector": "#employee_organization_name_div",
    //     "data": [{name: "test1", pId: null, id: 3, tId: 3}
    //         , {name: "test1-1", pId: 3, id: 17, tId: 17}
    //         , {name: "test1-2", pId: 3, id: 18, tId: 18}
    //         , {name: "test1-3", pId: 3, id: 19, tId: 19}
    //         , {name: "test1-4", pId: 3, id: 20, tId: 20}
    //         , {name: "test1-4-1", pId: 20, id: 21, tId: 21}
    //         , {name: "test1-2-1", pId: 18, id: 22, tId: 22}
    //         , {name: "test1-2-2", pId: 18, id: 23, tId: 23}
    //         , {name: "test1-2-3", pId: 18, id: 24, tId: 24}
    //         , {name: "test1-2-4", pId: 18, id: 25, tId: 25}
    //         , {name: "test1-1-1", pId: 17, id: 26, tId: 26}
    //         , {name: "test1-1-2", pId: 17, id: 27, tId: 27}
    //         , {name: "test1-1-3", pId: 17, id: 28, tId: 28}
    //         , {name: "test1-5-1-1", pId: 30, id: 31, tId: 31}
    //         , {name: "test1-5-1", pId: 29, id: 30, tId: 30}
    //         , {name: "test1-5", pId: 3, id: 29, tId: 29}],
    //     "expand_all": true
    // });
});

/**
 * 重置
 */
var reset = function () {
    $("#filterForm").find("select").val("");
    $("#filterForm").find("input").val("");
};

var _organization_columns = function () {
    return [
        {
            "data": "name",
            "title": "名称",
            "render": function (data, type, row, meta) {
                var row_str = JSON.stringify(row);
                return "<a href='javascript:init_user_tab(" + row_str + ");'>" + data + "</a>";
            }
        },
        {
            "data": "created",
            "title": "创建时间"
        }
    ];
};
/**
 * 初始化用户表（左边组织机构表中数据的点击）
 * @param row
 */
var init_user_tab = function (row) {
    var organization_id = row.id;
    $("#filterForm [name=organizationId]").val(organization_id);
    $("#myTabTitle").html(row.name);
    table.table_ajax_reload('#myTab');
}
/**
 * 左边组织机构上的所有按钮（查询所有部门）
 */
var all_organization = function () {
    $("#filterForm [name=organizationId]").val("");
    $("#myTabTitle").html("所有部门");
    table.table_ajax_reload('#myTab');
}

var _detail = function (row) {
    modal.show_modal({
        modal_selector: "#myModal",
        url: "detail",
        type: "detail",
        title: "用户详情",
        disabled: true,
        data: row,
        ajax_setting: {
            type: "get",
            data: {
                "id": row.id
            }
        }
    });
};
var _update = function (row) {
    modal.show_modal({
        modal_selector: "#myModal",
        url: "detail",
        type: "update",
        title: "用户修改",
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

var _add = function () {
    modal.show_modal({
        modal_selector: "#myModal",
        url: "detail",
        type: "add",
        title: "用户新增",
        disabled: false,
        ajax_setting: {
            type: "get",
            data: {
                "organizationId": $("#filterForm [name=organizationId]").val()
            }
        },
        prefix_bind_data_fun: function () {
            var document = window.top.document;
            $(document).find("#myModal [name=addBtn]").click(add);
        }
    });
};

var _delete = function (row) {
    var ids;
    if (undefined == row || null == row) {
        ids = table.get_select_data("#myTab", null, "id");
    } else {
        ids = [row.id];
    }
    modal.show_del_modal({
        modal_selector: "#myModal",
        ajax_url: "/user/delete",
        ajax_success_fun: function (result) {
            table.table_ajax_reload('#myTab');
        },
        ajax_data: function () {
            return {
                "ids": ids
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

var update = function () {
    if (!_validate().form()) {
        return;
    }
    var document = window.top.document;
    base.post({
        url: "/user/update",
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
        url: "/user/add",
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
            account: "required",
            password: {
                required: true,
                repassword: true
            },
            newPassword: "required"
        },
        messages: {
            name: "名称不能为空",
            code: "编码不能为空",
            account: "帐号不能为空",
            password: {
                required: "密码不能为空",
                repassword: "两次密码输入必须一致"
            },
            newPassword: "密码不能为空"
        },
        errorPlacement: function (error, element) {
            error.css("color", "red");
            element.parents(".modal-body-div").append(error);
        }
    });
};
/**
 * 添加验证规则
 */
var validate_add_method = function () {
    $.validator.addMethod("repassword", function (value, element, param) {
        var document = window.top.document;
        var password = $(document).find("#myModal [name=password]").val();
        var newPassword = $(document).find("#myModal [name=newPassword]").val();
        var return_result = false;
        if (password == newPassword) {
            return_result = true;
        }
        return return_result;
    }, "两次密码输入必须一致");
}
/**
 * 修改密码模态框
 */
var _edit_password = function (row) {
    var ids;
    if (undefined == row || null == row) {
        ids = table.get_select_data("#myTab", null, "id");
    } else {
        ids = [row.id];
    }
    modal.show_modal({
        modal_selector: "#myModal",
        url: "editPassword",
        type: "update",
        title: "修改密码",
        ajax_setting: {
            type: "get",
            data: {
                "id": ids[0]
            }
        },
        prefix_modal_fun: function (ajax_data) {
            if (undefined == ids || null == ids || ids.length != 1) {
                modal.show_prompt_modal({
                    type: "info",
                    html: "只能选择一条数据"
                });
                return false;
            } else {
                return true;
            }
        },
        prefix_bind_data_fun: function () {
            var document = window.top.document;
            $(document).find("#myModal [name=updateBtn]").click(edit_password);
        }
    });
}
/**
 * 修改密码提交
 */
var edit_password = function () {
    if (!_validate().form()) {
        return;
    }
    var document = window.top.document;
    base.post({
        url: "/user/update",
        data: $(document).find('#myModal form').serializeObject(),
        async: false,
        callback: function (result) {
            table.table_ajax_reload('#myTab');
            var document = window.top.document;
            $(document).find("#myModal .modal-close").click();
        }
    });
};