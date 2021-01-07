/**
 * 登出
 */
var logout = function () {
    window.base.post({
        url: "/logout",
        callback: function (result) {
            window.location.href = "/dispatch";
        }
    });
};

/**
 * 初始化菜单
 */
function initMenu() {
    base.post({
        url: "/permission/menu", callback: function (resp) {
            base.post({
                url: "/auth", callback: function (auth) {
                    _renderMenu(resp.data, auth.data);
                    $('li[name=menuLi]').on('click', _clickMenuEvent);
                }
            });
        }
    });
}

function _clickMenuEvent(event) {
    var data = {};
    data.id = $(event.currentTarget).attr('menu-id');
    data.title = $(event.currentTarget).attr('menu-name');
    data.url = $(event.currentTarget).attr('menu-url');
    data.code = $(event.currentTarget).attr('shiro-permission');
    _openTab(data);
}

function _openTab(data) {
    var a_id = "a_" + data.id;
    if ($("#" + a_id).length == 0) {
        if ($('#myTabs>.nav-item').length > 6) {
            $('#myTabs>.nav-item').eq(1).find('.tab_close').click();
        }
        $('#myTabs').append(_getTabsHtml(data));
        $('#myTabContent').append(_getTabContentHtml(data));
    }
    $("#" + a_id).find(".span_title").click();
}

function _initContentTabs() {
    $('#myTabs').on('click', '.span_title', function (event) {
        $('#myTabs .nav-link').removeClass('active');
        $('#myTabContent>.tab-panel').addClass('tab-none');
        $(event.currentTarget).parents('a').addClass('active');
        $('#' + $(event.currentTarget).attr('rel-tab')).removeClass('tab-none');
    });
    $('#myTabs').on('click', '.tab_close', function (event) {
        var active = $(event.currentTarget).parent().hasClass("active");
        var tabIndex = $('#myTabs>.nav-item').index($(event.currentTarget).parents('li')) - 1;
        $(event.currentTarget).parents('li').remove();
        var tabId = $(event.currentTarget).parent().attr("id").replace('a', 'tab');
        $('#' + tabId).remove();
        //前一个tab自动打开
        if (active) {
            $('#myTabs>.nav-item:eq(' + tabIndex + ')>a>.span_title').trigger('click');
        }
    });
}

/**
 * 关闭tab页
 * @param shiroPermission
 */
var _close_tab = function (shiroPermission) {
    var dataId = $("#myTabContent>[shiro-permission='" + shiroPermission + "']").attr("data-id");
    $("#li_" + dataId + " .tab_close").click();
}
/**
 * 打开tab页
 * @param shiroPermission
 */
var _open_tab = function (shiroPermission) {
    $("#menus ul li[shiro-permission='" + shiroPermission + "']").click();
}
/**
 * 跳转tab页
 * @param shiroPermission
 * @param initAfterFun 跳转后绑定的initAfter方法（暂时无效）
 */
var _jump_tab = function (shiroPermission, initAfterFun) {
    _close_tab(shiroPermission);
    _open_tab(shiroPermission);
    // if (typeof (initAfterFun) == "function") {
    //     $("#myTabContent>[shiro-permission='" + shiroPermission + "']").on("initAfter", initAfterFun);
    // }
}
var _getTabsHtml = function ($data) {
    var html = '<li id="li_' + $data.id + '" class="nav-item">\n' +
        '<a id="a_' + $data.id + '" data-id="' + $data.id + '" class="nav-link active"\n' +
        'href="javascript:void(0);"\n' +
        'role="tab_' + $data.id + '">\n' +
        '<span rel-tab="tab_' + $data.id + '" class="span_title">' + $data.title + '</span>\n' +
        '<span class="ml-2 pe-7s-close tab_close" aria-hidden="true"></span>\n' +
        '</a>\n' +
        '</li>';
    return html;
}
var _getTabContentHtml = function ($data) {
    var html = '<div class="tab-panel" data-id="' + $data.id + '" id="tab_' + $data.id + '" role="tab_' + $data.id + '"\n' +
        'shiro-permission="' + $data.code + '">\n' +
        '<iframe class="tab-iframe" src="' + $data.url + '"></iframe>\n' +
        '</div>';
    return html;
}

function _renderMenu(data, auth) {
    $('#menus').metisMenu('dispose');
    //重构menu数据结构
    var menus = [], cMenus = [];
    data.forEach(function (menu) {
        if (menu.parentId == null) {
            menus.push(menu);
        } else {
            cMenus.push(menu);
        }
        //权限控制
        if (auth.permissions.indexOf(menu.code) > -1) {
            menu.display = true;
        }
    });
    cMenus.forEach(function (cMenu) {
        //权限控制
        if (auth.permissions.indexOf(cMenu.code) > -1) {
            menus.forEach(function (value) {
                if (value.id == cMenu.parentId) {
                    // menu.display = true;
                    value.children = value.children || [];
                    value.children.push(cMenu);
                }
            })
        }
    });
    $('#menus').html(_getMenuHtml(menus));
    // $('#menu').html(template('tpl-menu', menus));
    $('#menus').metisMenu();
}

var _getMenuHtml = function (menus) {
    var html = "";
    for (var i = 0; i < menus.length; i++) {
        var menu = menus[i];
        if (menu.display) {
            html += '<li shiro-permission="' + menu.code + '">';
            html += '<i class="' + menu.icon + '" style="float: left;width: 32px;height: 32px;text-align:center;line-height:32px;"></i>';
            html += '<a href="#"> ' + menu.name + '<i class="metismenu-state-icon pe-7s-angle-down caret-left"></i></a>';
            if (undefined != menu.children && null != menu.children && menu.children.length > 0) {
                for (var j = 0; j < menu.children.length; j++) {
                    var c_menu = menu.children[j];
                    html += '<ul menu-id="' + menu.id + '" class="mm-collapse">';
                    html += '<li name="menuLi" shiro-permission="' + c_menu.code + '" menu-id="' + c_menu.id + '" menu-url="' + c_menu.url + '" menu-name="' + c_menu.name + '"><a href="#"><i class="' + c_menu.icon + '"></i>' + c_menu.name + '</a></li>';
                    html += '</ul>';
                }
            }
            html += '</li>';
        }
    }
    return html;
}

$(function () {
    initMenu();
    _initContentTabs();
});