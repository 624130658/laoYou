$(function () {
    table.init_table({
        "table_selector": "#myTab",
        "ajax_url": "/role/page",
        "columns": [
            {
                "data": "name",
                "title": "名称",
                "render": function (data, type, row, meta) {
                    var row_str = JSON.stringify(row);
                    return "<a href='javascript:init_permission_tab(" + row_str + ");'>" + data + "</a>";
                }
            },
            {
                "data": "code",
                "title": "编码"
            },
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
    permission_checkbox_change_fun();
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

var tab_selector = "body";
/**
 * 初始化资源列表
 * @param role_id 角色id
 * @date 2019年7月31日 10:36:12
 * @author YL
 */
var init_permission_tab = function (row) {
    base.post({
        url: '/permission/rolePermissions',
        data: {
            "roleId": row.id
        },
        callback: function (result) {
            var data = result.data;
            var $tbody = $(tab_selector + " [name=permission_tbody]");
            var html = "";
            for (var item in data) {
                html = append_permission_html(html, data[item]);
            }
            $tbody.html(html);
            $(tab_selector + " [name=permission_header_title]").html(row.name);
            $(tab_selector + " [name=permission_role_id]").val(row.id);
            init_permission_checkbox();
        }
    });
};
/**
 * 追加资源html
 * @param html html
 * @param permission 资源
 */
var append_permission_html = function (html, permission) {
    var temp = permission;
    var name = temp.name;
    var id = temp.id;
    var parentId = temp.parentId;
    var parentIdHtml = "";
    if (undefined != parentId && null != parentId) {
        parentIdHtml = " permission-parent-id='" + parentId + "' ";
    }
    var parentIds = temp.parentIds;
    var own = temp.own;
    var checked = "";
    var type = temp.type.field;
    if (own) {
        checked = "checked";
    }
    var spaceNum = 0;
    if (undefined != parentIds && null != parentIds && "" != parentIds) {
        spaceNum = parentIds.split(",").length;
    }
    var childNode = temp.childNode;
    html += "<tr permission-id='" + id + "' " + parentIdHtml + "><td permission-id='" + id + "' " + parentIdHtml + " style=\"text-align: center;\"><input permission-id='" + id + "' " + parentIdHtml + " type=\"checkbox\" name=\"row_checked\"></td><td permission-type='" + type + "'" +
        "permission-id='" + id + "' " + parentIdHtml + ">";
    for (var i = spaceNum; i > 0; i--) {
        html += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    html += "<span><label><input permission-type='" + type + "' permission-id='" + id + "' " + parentIdHtml + " type=\"checkbox\" name=\"td_checked\" " + checked + ">&nbsp;";
    html += name + "</label></span></td>";
    var nodeHtml = "";
    if (undefined != childNode && null != childNode) {
        var eachNum = 0;
        for (var nodeKey in childNode) {
            eachNum++;
            var eachBoolean = eachNum % 4 == 0;
            if (eachBoolean && eachNum != 4) {
                nodeHtml = "<tr><td></td><td></td>" + nodeHtml;
            }
            var node = childNode[nodeKey];
            var node_name = node.name;
            var node_id = node.id;
            var node_parentId = node.parentId;
            var node_own = node.own;
            var node_checked = "";
            if (node_own) {
                node_checked = "checked";
            }
            var node_type = node.type.field;
            nodeHtml += "<td style=\"text-align: center;\" permission-type='" + node_type + "' permission-id='" + node_id + "' permission-parent-id='" + node_parentId + "'><span><label> <input permission-type='" + node_type + "' permission-id='" + node_id + "' permission-parent-id='" + node_parentId + "' type=\"checkbox\" name=\"td_checked\" " + node_checked + ">&nbsp;" + node_name;
            nodeHtml += "</label></span></td>";
            if (eachBoolean) {
                nodeHtml += "</tr>";
                html += nodeHtml;
                nodeHtml = "";
            }
        }
        if (!eachBoolean && eachNum > 4) {
            nodeHtml = "<tr><td></td><td></td>" + nodeHtml;
        }
    }
    html += nodeHtml;
    var suffix = html.substr(html.length - 5);
    if (suffix != "</tr>") {
        html += "</tr>";
    }
    var childMenu = temp.childMenu;
    for (var item in childMenu) {
        html = append_permission_html(html, childMenu[item]);
    }
    return html;
}
/**
 * 资源列表保存按钮
 */
var permission_save_fun = function () {
    var role_id = $(tab_selector + " [name=permission_role_id]").val();
    if (undefined == role_id || null == role_id || "" == role_id) {
        modal.show_prompt_modal({
            type: "info",
            html: "必须先点击角色才能配置资源"
        });
    } else {
        var save_data = get_permission_save_data();
        base.post({
            url: '/role/empowered',
            data: {
                "roleId": role_id,
                permissionIds: save_data
            },
            async: false,
            successMsg: "保存成功,需重新登录才能生效",
            callback: function (result) {
            }
        });
    }
}
/**
 * 获得资源列表保存的数据
 */
var get_permission_save_data = function () {
    var result = [];
    var $table = $(tab_selector + " [name=permission_tab]");
    var $checkTdChecked = $table.find("input[name=td_checked]:checked");
    for (var i = 0; i < $checkTdChecked.length; i++) {
        var permission_id = $checkTdChecked.eq(i).attr("permission-id");
        if (undefined != permission_id && null != permission_id && "" != permission_id) {
            result.push(permission_id);
        }
    }
    return result;
}
/**
 * 资源列表清空按钮
 */
var permission_clear_fun = function () {
    var $table = $(tab_selector + " [name=permission_tab]");
    $table.find("input[type=checkbox]").prop('checked', false);
}
/**
 * 初始化资源列表的checkbox
 */
var init_permission_checkbox = function () {
    var $table = $(tab_selector + " [name=permission_tab]");
    var $tbody = $(tab_selector + " [name=permission_tbody]");
    var $trs = $tbody.find("tr[permission-id]");
    for (var i = 0; i < $trs.length; i++) {
        var $tr = $trs.eq(i);
        var permission_id = $tr.attr("permission-id");
        var childNodeNum = $tbody.find("input[permission-parent-id=" + permission_id + "][permission-type=NODE]").length;
        var checkChildNodeNum = $tbody.find("input[permission-parent-id=" + permission_id + "][permission-type=NODE]:checked").length;
        var menuCheck = $tbody.find("input[permission-id=" + permission_id + "][permission-type][permission-type!=NODE]").prop('checked');
        if (menuCheck && childNodeNum == checkChildNodeNum) {
            $tbody.find("input[permission-id=" + permission_id + "][name=row_checked]").prop('checked', true);
        } else {
            $tbody.find("input[permission-id=" + permission_id + "][name=row_checked]").prop('checked', false);
        }
    }
    var rowCheckedNum = $tbody.find("input[name=row_checked]").length;
    var checkRowCheckedNum = $tbody.find("input[name=row_checked]:checked").length;
    if (rowCheckedNum == checkRowCheckedNum) {
        $table.find("input[name=all_checked]").prop('checked', true);
    } else {
        $table.find("input[name=all_checked]").prop('checked', false);
    }
};
/**
 * 给资源列表的checkbox绑定change事件
 */
var permission_checkbox_change_fun = function () {
    var $table = $(tab_selector + " [name=permission_tab]");
    $table.on("change", "input[name=td_checked][permission-type=NODE]", function (e) {
        var $target = $(e.target);
        var permission_id = $target.attr("permission-id");
        var permission_parent_id = $target.attr("permission-parent-id");
        var checked = $target.prop('checked');
        if (checked) {
            var childNodeNum = $table.find("input[permission-parent-id=" + permission_parent_id + "][permission-type=NODE]").length;
            var checkChildNodeNum = $table.find("input[permission-parent-id=" + permission_parent_id + "][permission-type=NODE]:checked").length;
            var menuCheck = $table.find("input[permission-id=" + permission_parent_id + "][permission-type][permission-type!=NODE]").prop('checked');
            if (menuCheck && childNodeNum == checkChildNodeNum) {
                $table.find("input[permission-id=" + permission_parent_id + "][name=row_checked]").prop('checked', true);
                var rowCheckedNum = $table.find("input[name=row_checked]").length;
                var checkRowCheckedNum = $table.find("input[name=row_checked]:checked").length;
                if (rowCheckedNum == checkRowCheckedNum) {
                    $table.find("input[name=all_checked]").prop('checked', true);
                }
            }
        } else {
            $table.find("input[name=row_checked][permission-id=" + permission_parent_id + "]").prop('checked', false);
            $table.find("input[name=all_checked]").prop('checked', false);
        }
    });
    $table.on("change", "input[name=td_checked][permission-type][permission-type!=NODE]", function (e) {
        var $target = $(e.target);
        var permission_id = $target.attr("permission-id");
        var checked = $target.prop('checked');
        if (checked) {
            var childNodeNum = $table.find("input[permission-parent-id=" + permission_id + "][permission-type=NODE]").length;
            var checkChildNodeNum = $table.find("input[permission-parent-id=" + permission_id + "][permission-type=NODE]:checked").length;
            if (childNodeNum == checkChildNodeNum) {
                $table.find("input[permission-id=" + permission_id + "][name=row_checked]").prop('checked', true);
                var rowCheckedNum = $table.find("input[name=row_checked]").length;
                var checkRowCheckedNum = $table.find("input[name=row_checked]:checked").length;
                if (rowCheckedNum == checkRowCheckedNum) {
                    $table.find("input[name=all_checked]").prop('checked', true);
                }
            }
        } else {
            $table.find("input[name=row_checked][permission-id=" + permission_id + "]").prop('checked', false);
            $table.find("input[name=all_checked]").prop('checked', false);
        }
    });
    $table.on("change", "input[name=row_checked]", function (e) {
        var $target = $(e.target);
        var permission_id = $target.attr("permission-id");
        var checked = $target.prop('checked');
        if (checked) {
            $table.find("input[name=td_checked][permission-parent-id=" + permission_id + "][permission-type=NODE]").prop('checked', true);
            $table.find("input[name=td_checked][permission-id=" + permission_id + "][permission-type][permission-type!=NODE]").prop('checked', true);
            var rowCheckedNum = $table.find("input[name=row_checked]").length;
            var checkRowCheckedNum = $table.find("input[name=row_checked]:checked").length;
            if (rowCheckedNum == checkRowCheckedNum) {
                $table.find("input[name=all_checked]").prop('checked', true);
            } else {
                $table.find("input[name=all_checked]").prop('checked', false);
            }
        } else {
            $table.find("input[name=td_checked][permission-parent-id=" + permission_id + "][permission-type=NODE]").prop('checked', false);
            $table.find("input[name=td_checked][permission-id=" + permission_id + "][permission-type][permission-type!=NODE]").prop('checked', false);
            $table.find("input[name=all_checked]").prop('checked', false);
        }
    });
    $table.on("change", "input[name=all_checked]", function (e) {
        var $target = $(e.target);
        var checked = $target.prop('checked');
        if (checked) {
            $table.find("input[name=row_checked]").prop('checked', true);
            $table.find("input[name=td_checked]").prop('checked', true);
        } else {
            $table.find("input[name=row_checked]").prop('checked', false);
            $table.find("input[name=td_checked]").prop('checked', false);
        }
    });
};

var _detail = function (row) {
    modal.show_modal({
        modal_selector: "#myModal",
        url: "detail",
        type: "detail",
        title: "角色详情",
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
        title: "角色修改",
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
        title: "角色新增",
        disabled: false,
        ajax_setting: {
            type: "get"
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
        ajax_url: "/role/delete",
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
        url: "/role/update",
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
        url: "/role/add",
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
            code: "required"
        },
        messages: {
            name: "名称不能为空",
            code: "编码不能为空"
        },
        errorPlacement: function (error, element) {
            error.css("color", "red");
            element.parents(".modal-body-div").append(error);
        }
    });
};