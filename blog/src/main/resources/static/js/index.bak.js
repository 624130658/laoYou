define(['service', 'metismenu', 'art-template', 'ocp', 'validate', 'modal', 'bootstrap-colorpicker', "bootstrap-fileinput", 'bootstrap-fileinput-zh'], function (service, metismenu, template, ocp, validate, modal) {

    var _userInfo, _exports = {};

    /**
     * 初始化菜单
     * @private
     */
    function _initMenu(auth) {
        service.post({
            url: service.interface.menu, callback: function (resp) {
                _renderMenu(resp.data, auth);
                $('li[name=menuLi]').on('click', _clickMenuEvent);
            }
        });
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
            if (auth.permissions.indexOf(menu.permission) > -1) {
                menu.display = true;
            }
        });

        cMenus.forEach(function (cMenu) {
            //权限控制
            if (auth.permissions.indexOf(cMenu.permission) > -1) {
                menus.forEach(function (value) {
                    if (value.id == cMenu.parentId) {
                        // menu.display = true;
                        value.children = value.children || [];
                        value.children.push(cMenu);
                    }
                })
            }
        });

        $('#menu').html(template('tpl-menu', menus));
        $('#menus').metisMenu();
    }

    /**
     * 初始化导航头
     * @private
     */
    function _initHead(auth) {
        service.post({
            url: service.interface.getUserInfo, callback: function (resp) {
                _userInfo = resp.data;
                $("#head_username").html(_userInfo.name);
                $("#head_nav_username").html(_userInfo.name);
                $("#head_position").html(_userInfo.position);
                $("#head_nav_position").html("职位：" + _userInfo.position);
                $("#head_nav_role").html("角色：" + auth.roles.join(','));
                $("#head_nav_employee_no").html("工号：" + _userInfo.employeeNo);
                if (_userInfo.userInfoType.field == "EMPLOYEE") {
                    $("#head_nav_organization_name").html("部门：" + _userInfo.organizationName);
                } else if (_userInfo.userInfoType.field == "LINKER") {
                    $("#head_nav_organization_name").html("公司：" + _userInfo.organizationName);
                }
                $("#head_nav_mobile").html("电话：" + _userInfo.mobile);
                $("#head_nav_email").html("邮箱：" + _userInfo.email);
                if (null != _userInfo && undefined != _userInfo && null != _userInfo.sex && undefined != _userInfo.sex) {
                    var icon = "";
                    if (_userInfo.sex.field == "Male") {
                        icon = "pe-7s-user";
                    } else if (_userInfo.sex.field == "Female") {
                        icon = "pe-7s-user-female";
                    }
                    $("#head_head_attachment").addClass(icon);
                    $("#head_menu_head_attachment").addClass(icon);
                }
                $("#head_head_attachment").attr("src", "data:image/jpeg;base64," + _userInfo.headAttachmentImgUrl);
                $("#head_menu_head_attachment").attr("src", "data:image/jpeg;base64," + _userInfo.headAttachmentImgUrl);
            }
        });
    }

    /**
     * 初始化消息列表  原来是一次加载所有消息列表div改成默认加载十条，点击加载更多再多加载十条
     * @Author XT
     * @private
     */
    function _initMessage(msgLength) {
        service.post({
            url: service.interface.messagesList,
            async: true,
            callback: function (resp) {
                var msgdata = resp.data;
                msgdata.reverse();
                var msgDataLength;
                if (msgLength == undefined) {
                    msgDataLength = 10;
                } else {
                    msgDataLength = msgLength;
                }
                $("#messages_msgCount").html(msgdata.length);
                $("#messages_msgLabCount").show();
                if (msgdata.length == 0) {
                    $("#messages_msgLabCount").hide();
                } else if (msgdata.length > 99) {
                    $("#messages_msgLabCount").html("99+");
                } else {
                    $("#messages_msgLabCount").html(msgdata.length);
                }
                var messagesList = "";
                for (var i = 0; i <= msgDataLength; i++) {
                    if (msgdata[i] != undefined) {
                        messagesList += "<div class='vertical-timeline-item vertical-timeline-element' " +
                            "<div><span class='vertical-timeline-element-icon bounce-in'><i class='badge badge-dot badge-dot-xl badge-info'> </i></span>\n" +
                            "<div class='vertical-timeline-element-content bounce-in'><h4 class='timeline-title'>" + msgdata[i].msgType.name + "<b class='text-danger' style='margin-left: 15%'>" + msgdata[i].created + "</b>" +
                            "<b class='float-right'><a href='javascript:index.skipPage(" + msgdata[i].skipType.code + "," + msgdata[i].dataId + "," + msgdata[i].id + ");'>详情</a></b>" +
                            "</h4><span class='vertical-timeline-element-date'></span></div></div></div>";
                    }
                }
                $("#messages_msgList").html(messagesList);
                var messagesListPrompt = "";
                var messagesLength = $("#messages_msgList>div").length;
                if (msgdata.length == 0) {
                    messagesListPrompt += "<span style='text-align: center;display: flow-root;margin-top: 20px'>暂无未读消息</span>"
                } else if (messagesLength < msgdata.length) {
                    messagesListPrompt += "<a style='text-align: center;display: flow-root;margin-top: 20px' href='javascript:index.initMessage(" + (msgDataLength + 10) + ");'>加载更多...</a>"
                } else {
                    messagesListPrompt += "<span style='text-align: center;display: flow-root;margin-top: 20px'>已加载全部</span>"
                }
                $("#messages_msgList").append(messagesListPrompt);
            }
        });
    }


    /**
     * 初始化消息列表    刘恒原方法
     * @private
     */

    /*function _initMessage() {
        service.post({
            url: service.interface.messagesList,
            async: true,
            callback: function (resp) {
                var msgdata = resp.data;
                $("#messages_msgCount").html(msgdata.length);
                $("#messages_msgLabCount").show();
                if (msgdata.length == 0) {
                    $("#messages_msgLabCount").hide();
                } else if (msgdata.length > 99) {
                    $("#messages_msgLabCount").html("99+");
                } else {
                    $("#messages_msgLabCount").html(msgdata.length);
                }
                var messagesList = "";
                for (var i = msgdata.length - 1; i >= 0; i--) {
                    messagesList += "<div class='vertical-timeline-item vertical-timeline-element' " +
                        "<div><span class='vertical-timeline-element-icon bounce-in'><i class='badge badge-dot badge-dot-xl badge-info'> </i></span>\n" +
                        "<div class='vertical-timeline-element-content bounce-in'><h4 class='timeline-title'>" + msgdata[i].msgType.name + "<b class='text-danger' style='margin-left: 15%'>" + msgdata[i].created + "</b>" +
                        "<b class='float-right'><a href='javascript:index.skipPage(" + msgdata[i].skipType.code + "," + msgdata[i].dataId + "," + msgdata[i].id + ");'>详情</a></b>" +
                        "</h4><span class='vertical-timeline-element-date'></span></div></div></div>";
                }
                $("#messages_msgList").html(messagesList);
            }
        });
    }*/

    function _skipPage(code, dataId, msgId) {
        var ids = new Array();
        ids.push(msgId);
        service.post({
            url: service.interface.changeReadsById,
            async: true,
            data: {ids: ids},
            callback: function (resp) {
                _initMessage();
            }
        });

        if (code == 1) {
            if (code == 112 || code == 113) {
                _jump_tab('supplementCase:view', function () {
                    service.post({
                        url: service.interface.supplementCases,
                        data: {id: dataId},
                        callback: function (resp) {
                            var msgdata = resp.data;
                            if (msgdata.content.length == 0) {
                                modal.show_prompt_modal({
                                    type: "warning",
                                    html: "关联数据不存在!"
                                });
                            } else {
                                supplementCases.showDetailModal(msgdata.content[0]);
                            }
                        }
                    });
                });
            } else {
                _jump_tab('case:view', function () {
                    service.post({
                        url: service.interface.cases,
                        data: {id: dataId},
                        callback: function (resp) {
                            var msgdata = resp.data;
                            if (msgdata.content.length == 0) {
                                modal.show_prompt_modal({
                                    type: "warning",
                                    html: "关联数据不存在!"
                                });
                            } else {
                                cases.showDetailModal(msgdata.content[0]);
                            }
                        }
                    });
                });
            }
        } else if (code == 2) {
            _jump_tab('application:view', function () {
                service.post({
                    url: service.interface.getApplications,
                    data: {id: dataId},
                    callback: function (resp) {
                        var msgdata = resp.data;
                        if (msgdata.content.length == 0) {
                            modal.show_prompt_modal({
                                type: "warning",
                                html: "关联数据不存在!"
                            });
                        } else {
                            if (code == 201 || code == 202 || code == 204 || code == 205 || code == 208 || code == 209) {
                                applications.showDetailModal(msgdata.content[0], "approve");
                            } else {
                                applications.showDetailModal(msgdata.content[0], "detail");
                            }
                        }
                    }
                });
            });
        } else if (code == 3) {
            _jump_tab('contract:view', function () {
                service.post({
                    url: service.interface.contracts,
                    data: {id: dataId},
                    callback: function (resp) {
                        var msgdata = resp.data;
                        if (msgdata.content.length == 0) {
                            modal.show_prompt_modal({
                                type: "warning",
                                html: "关联数据不存在!"
                            });
                        } else {
                            contract.detail(msgdata.content[0]);
                        }
                    }
                });
            });
        } else if (code == 4) {
            _jump_tab('business:view', function () {
                service.post({
                    url: service.interface.businesses,
                    data: {id: dataId},
                    callback: function (resp) {
                        var msgdata = resp.data;
                        if (msgdata.content.length == 0) {
                            modal.show_prompt_modal({
                                type: "warning",
                                html: "关联数据不存在!"
                            });
                        } else {
                            businesses.showDetailModal(msgdata.content[0]);
                        }
                    }
                });
            })
        } else if (code == 5) {
            _jump_tab('schedules:view', function () {

            });
        }
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
     * @param initAfterFun 跳转后绑定的initAfter方法
     */
    var _jump_tab = function (shiroPermission, initAfterFun) {
        _close_tab(shiroPermission);
        _open_tab(shiroPermission);
        if (typeof (initAfterFun) == "function") {
            $("#myTabContent>[shiro-permission='" + shiroPermission + "']").on("initAfter", initAfterFun);
        }
    }

    function _clickMenuEvent(event) {
        var data = {};
        data.id = $(event.currentTarget).attr('menu-id');
        data.title = $(event.currentTarget).attr('menu-name');
        data.url = $(event.currentTarget).attr('menu-url');
        data.permission = $(event.currentTarget).attr('shiro-permission');
        _openTab(data);
    }

    /**
     * 初始化文件上传插件
     * @param headAttachmentImgUrl 预设头像地址
     */
    var init_upload_file = function (headAttachmentImgUrl) {
        var initialPreview = [];
        if (null != headAttachmentImgUrl && undefined != headAttachmentImgUrl && "" != headAttachmentImgUrl) {
            initialPreview = ["<img width='180' src='data:image/jpeg;base64," + headAttachmentImgUrl + "' />"]
        }
        var _this = $("#myModal [field=headAttachmentInput]");
        _this.fileinput({
            language: 'zh',
            uploadUrl: service.interface.server + service.interface.attachmentAdd,
            dropZoneEnabled: false,
            overwriteInitial: true,
            showRemove: false,
            maxFileCount: 1,
            allowedFileExtensions: ["jpg", "png", "gif"],
            browseClass: "btn btn-primary", //按钮样式
            previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
            layoutTemplates: {
                actionUpload: '',//去除上传预览缩略图中的上传图片
                actionZoom: '',   //去除上传预览缩略图中的查看详情预览的缩略图标
                actionDownload: '', //去除上传预览缩略图中的下载图标
            },
            initialPreview: initialPreview
        }).on("fileuploaded", function (event, result, previewId, index) {
            var data = result.response.data;
            $("#myModal").find("[name=headAttachment]").val(data.id);
        })
    }

    //修改信息窗口
    function _showShowUserInfoModal() {
        modal.show_modal({
            modal_selector: "#myModal",
            url: "index_modal.html",
            type: "re-info",
            title: "修改信息",
            data: _userInfo,
            bind_data: true,
            disabled: false,
            prefix_modal_fun: function (data) {
                service.initEnumSelectNoBlank("#myModal [name=sex]", "system", "Sex");
                return true;
            },
            modal_fun: function (data, setting) {
                if (null != data && undefined != data && null != data.sex && undefined != data.sex) {
                    $("#myModal").find("[field=sex]").val(data.sex.field);
                }
                if (null != data && undefined != data && null != data.theme && undefined != data.theme) {
                    $("#myModal").find("[name=color]").css('background-color', data.theme);
                }
                $("#myModal").find("[name=headAttachment]").val(data.headAttachment);
                init_upload_file(data.headAttachmentImgUrl);
                init_select_color();
            }
        });
    }

    //初始化颜色选择器
    var init_select_color = function () {
        $("#myModal").find("[name=color]").colorpicker();
        $("#myModal").find("[name=color]").on('change', function (event) {
            $("#myModal").find("[name=color]").css('background-color', event.color.toString()).val('');
            $("#myModal").find("[name=theme]").val(event.color.toString());
        });
    }

    //修改密码窗口
    function _showPwdModal() {
        modal.show_modal({
            modal_selector: "#myModal",
            url: "index_modal.html",
            type: "re-password",
            title: "修改密码",
            bind_data: false,
            disabled: false
        });
    }

    //修改密码
    function _editPassword() {

        if (!validate.ModalValidate("#myModal .re-info-hidden")) {
            return;
        }

        var re_password = $("#myModal").find("[name=re_password]").val();
        var re_password_again = $("#myModal").find("[name=re_password_again]").val();
        if (re_password == re_password_again) {
            service.post({
                url: service.interface.rePassword,
                data: {
                    password: $("#myModal").find("[name=password]").val(),
                    rePassword: re_password
                },
                callback: function () {
                    _logout();
                }
            });
        } else {
            modal.show_prompt_modal({
                type: "error",
                html: "两次输入密码不一致"
            });
        }
    }

    //修改用户信息
    function _editUserInfo() {
        if (!validate.ModalValidate("#myModal .re-password-hidden")) {
            return;
        }

        service.get({
            url: service.interface.reUserInfo,
            data: {
                name: $("#myModal").find("[field=name]").val(),
                mobile: $("#myModal").find("[field=mobile]").val(),
                email: $("#myModal").find("[field=email]").val(),
                sex: $("#myModal").find("[field=sex]").val(),
                theme: $("#myModal").find("[field=theme]").val(),
                headAttachment: $("#myModal").find("[field=headAttachment]").val()
            },
            callback: function (resp) {
                $("#myModal .modal-close").click();
                window.location.reload();
            }
        });
    }

    //退出登录
    function _logout() {
            $.ajax({
                url: "logout",
                type: 'post',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                processData: true,
                dataType: "json",
                async: true,
                success: function (resp) {
                    if (resp.success) {
                        window.location.href = "/dispatch";
                    } else {
                        alert(resp.message);
                    }
                },
                error: function (resp) {
                    alert(resp);
                }
            });
        location.href = service.interface.server + service.interface.logout;
        // service.post({
        //     url: service.interface.logout,
        //     dataType: 'html',
        //     success: function (result) {
        //         location.href = service.interface.uiServer;
        //     }
        // });
    }

    function _openTab(data) {
        var a_id = "a_" + data.id;
        if ($("#" + a_id).length == 0) {
            if ($('#myTabs>.nav-item').length > 6) {
                $('#myTabs>.nav-item').eq(1).find('.tab_close').click();
            }
            $('#myTabs').append(template('tpl-tabs', data));
            $('#myTabContent').append(template('tpl-tabContent', data));
            $('#tab_' + data.id).load('/ocp/pages' + data.url + '?v=' + Math.random());
        }
        $("#" + a_id).find(".span_title").click();
    }

    function init_menu_show() {
        $("#head .close-sidebar-btn,.mobile-toggle-nav").click(function () {
            var padding_left = $("#app-main").css("padding-left");
            console.log(padding_left)
            if (padding_left == "0px" || padding_left == 0 || padding_left == "0px") {
                $("#menu-sidebar").addClass("app-sidebar-open").removeClass("app-sidebar-close");
                $("#app-main").css("padding-left", "280px");
            } else {
                $("#menu-sidebar").addClass("app-sidebar-close").removeClass("app-sidebar-open");
                $("#app-main").css("padding-left", "0px");
            }
            // if ($("#menu-sidebar").hasClass("app-sidebar")) {
            //     $("#menu-sidebar").addClass("app-sidebar-close").removeClass("app-sidebar");
            // } else {
            //     $("#menu-sidebar").addClass("app-sidebar").removeClass("app-sidebar-close");
            // }
        })
    }

    /**
     * 预览图片
     * @param file_selector 文件input节点选择器
     * @param img_selector 预览图片的img节点选择器
     */
    function preImg(file_selector, img_selector) {
        var url;
        var file = $(file_selector)[0];
        var agent = navigator.userAgent;
        if (agent.indexOf("MSIE") >= 1) {
            url = file.value;
        } else if (agent.indexOf("Firefox") > 0) {
            url = window.URL.createObjectURL(file.files.item(0));
        } else if (agent.indexOf("Chrome") > 0) {
            url = window.URL.createObjectURL(file.files.item(0));
        }
        $(img_selector).attr("src", url);
    }

    function _init() {
        //增加了节点的resize方法 $.resize(function(){})
        (function ($, h, c) {
            var a = $([]),
                e = $.resize = $.extend($.resize, {}),
                i,
                k = "setTimeout",
                j = "resize",
                d = j + "-special-event",
                b = "delay",
                f = "throttleWindow";
            e[b] = 250;
            e[f] = true;
            $.event.special[j] = {
                setup: function () {
                    if (!e[f] && this[k]) {
                        return false;
                    }
                    var l = $(this);
                    a = a.add(l);
                    $.data(this, d, {
                        w: l.width(),
                        h: l.height()
                    });
                    if (a.length === 1) {
                        g();
                    }
                },
                teardown: function () {
                    if (!e[f] && this[k]) {
                        return false;
                    }
                    var l = $(this);
                    a = a.not(l);
                    l.removeData(d);
                    if (!a.length) {
                        clearTimeout(i);
                    }
                },
                add: function (l) {
                    if (!e[f] && this[k]) {
                        return false;
                    }
                    var n;

                    function m(s, o, p) {
                        var q = $(this),
                            r = $.data(this, d);
                        r.w = o !== c ? o : q.width();
                        r.h = p !== c ? p : q.height();
                        n.apply(this, arguments);
                    }

                    if ($.isFunction(l)) {
                        n = l;
                        return m;
                    } else {
                        n = l.handler;
                        l.handler = m;
                    }
                }
            };

            function g() {
                i = h[k](function () {
                        a.each(function () {
                            var n = $(this),
                                m = n.width(),
                                l = n.height(),
                                o = $.data(this, d);
                            if (m !== o.w || l !== o.h) {
                                n.trigger(j, [o.w = m, o.h = l]);
                            }
                        });
                        g();
                    },
                    e[b]);
            }
        })(jQuery, this);
        validate.ElementOnFocus("#myModal");
        // $(window).on("resize", function () {
        //     $(this).width() < 1250 ? $(".app-container").addClass("closed-sidebar-mobile closed-sidebar") : $(".app-container").removeClass("closed-sidebar-mobile closed-sidebar");
        // });
        $(".close-sidebar-btn").click(function () {
            var e = $(this).attr("data-class");
            $(".app-container").toggleClass(e);
            var i = $(this);
            i.hasClass("is-active") ? i.removeClass("is-active") : i.addClass("is-active")
        });
        $(document).on('authInfoLoaded', function (event, auth) {
            _initMenu(auth);
            _initContentTabs();
            _initHead(auth);
            _initMessage();
            $("#message_modal").click(function (event) {
                event.stopPropagation();
            });
            if (auth.roles.indexOf("资产管理员") >= 0) {
                $('#tab_home').load('/ocp/pages/window/asset_manager_home.html' + '?v=' + Math.random());
                return;
            }
            if (auth.roles.indexOf("部门经理") >= 0) {
                // $('#tab_home').load('/ocp/pages/window/pmHome.html' + '?v=' + Math.random(), function () {
                //     require(['app/window/pmHome'], function (_pmHome) {
                //         _pmHome.set_role("dm");
                //         _pmHome.init();
                //     })
                // });
                $('#tab_home').load('/ocp/pages/window/department_manager.html' + '?v=' + Math.random());
                return;
            }
            if (auth.roles.indexOf("中心主任") >= 0) {
                $('#tab_home').load('/ocp/pages/window/department_manager.html' + '?v=' + Math.random());
                return;
            }
            if (auth.roles.indexOf("项目经理") >= 0) {
                $('#tab_home').load('/ocp/pages/window/pmHome2.html' + '?v=' + Math.random(), function () {
                    require(['app/window/pmHome2'], function (_pmHome) {
                        _pmHome.set_role("pm");
                        _pmHome.init();
                    })
                });
                return;
            }
            if (auth.roles.indexOf("工程师") >= 0) {
                $('#tab_home').load('/ocp/pages/window/pmHome2.html' + '?v=' + Math.random(), function () {
                    require(['app/window/pmHome2'], function (_pmHome) {
                        _pmHome.set_role("engineer");
                        _pmHome.init();
                    })
                });
                return;
                // $('#tab_home').load('/ocp/pages/window/engineerHome2.html' + '?v=' + Math.random());
                // return;
            }
            if (auth.roles.indexOf("销售") >= 0) {
                $('#tab_home').load('/ocp/pages/window/sale_home.html' + '?v=' + Math.random());
                return;
            }
            if (auth.roles.indexOf("销售经理") >= 0) {
                $('#tab_home').load('/ocp/pages/window/sale_home.html' + '?v=' + Math.random());
                return;

            }
            if (auth.roles.indexOf("总经理") >= 0) {
                $('#tab_home').load('/ocp/pages/window/newGeneral_manager.html' + '?v=' + Math.random());
                return;
            }
            if (auth.roles.indexOf("话务员") >= 0) {
                $('#tab_home').load('/ocp/pages/window/toHome.html' + '?v=' + Math.random(), function () {
                    require(['app/window/toHome'], function (_toHome) {
                        _toHome.set_role("to");
                        _toHome.init();
                    })
                });
                return;
            }
        });
        // init_menu_show();
        ocp.init();
    }

    _init();

    _exports.userInfo = function () {
        return _userInfo;
    };
    _exports.showPwdModal = _showPwdModal;
    _exports.showShowUserInfoModal = _showShowUserInfoModal;
    _exports.editPassword = _editPassword;
    _exports.editUserInfo = _editUserInfo;
    _exports.openTab = _openTab;
    _exports.logout = _logout;
    _exports.initMessage = _initMessage;
    _exports.close_tab = _close_tab;
    _exports.jump_tab = _jump_tab;
    _exports.open_tab = _open_tab;
    _exports.skipPage = _skipPage;
    _exports.preImg = preImg;

    return _exports;
});