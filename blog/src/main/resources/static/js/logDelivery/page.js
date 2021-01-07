$(function () {
    initTimeSelect("#start_time", "#end_time");
    bootstrapTableGrid("mytab", '../logDelivery/page', json,
        queryParams);
    // modal.show_prompt_modal({
    //     type: "warning",
    //     html: "请选择接单人"
    // });
    modal.show_del_modal({
        modal_selector: "#myModal",
        ajax_data: function () {
            return {
                "ids": 1
            }
        }
    });
    // modal.show_modal({
    //     modal_selector: "#myModal",
    //     url: "/logdelivery/static/html/modal.html",
    //     type: "dispatch",
    //     title: "派单",
    //     bind_data: false,
    //     disabled: false
    // });
});

var json = [
//     {
//     title: '全选',
//     field: 'select',
//     checkbox: true,
//     width: 25,
//     align: 'center',
//     valign: 'middle'
// },
    {
        title: 'ID',
        field: 'id',
        visible: false
    }, {
        title: 'PL_session_id',
        field: 'PL_session_id'
    }, {
        title: 'PL_version',
        field: 'PL_version'
    }, {
        title: 'PL_maching_code',
        field: 'PL_maching_code'
    }, {
        title: 'PL_dtime',
        field: 'PL_dtime'
    }, {
        title: 'PL_application',
        field: 'PL_application'
    }, {
        title: 'PL_client_ip',
        field: 'PL_client_ip'
    }];

var search = function search() {
    $('#mytab').bootstrapTable('refresh', {
        url: '../logDelivery/page'
    });
}

function queryParams(params) {
    return {
        size: params.limit,
        page: params.offset / params.limit,
        startTime: $("#start_time").val(),
        endTime: $("#end_time").val()
    }
}

// 分页插件
function bootstrapTableGrid(id, url, json, queryParams) {
    $('#' + id).bootstrapTable({
        method: 'post',
        contentType: "application/x-www-form-urlencoded",
        url: url,// 要请求数据的文件路径
        striped: true, // 是否显示行间隔色
        pageNumber: 1, // 初始化加载第一页，默认第一页
        pagination: true,// 是否分页
        queryParams: queryParams,// 请求服务器时所传的参数
        sidePagination: 'server',// 指定服务器端分页
        pageSize: 10,// 单页记录数
        pageList: [5, 10, 20, 30],// 分页步进值
        // uniqueId: uniqueId,
        clickToSelect: true,// 是否启用点击选中行
        toolbar: '#toolbar',// 指定工作栏
        toolbarAlign: 'right',// 工具栏对齐方式
        buttonsAlign: 'right',// 按钮对齐方式
        showColumns: true,
        columns: json,
        locale: 'zh-CN',// 中文支持,
        responseHandler: function (res) {
            // 在ajax获取到数据，渲染表格之前，修改数据源
            var result = {
                "rows": res.content,
                "total": res.totalElements
            };
            return result;
        }
    })
}

function initTimeSelect(beginSelector, endSelector) {
    $(beginSelector).datetimepicker(
        {
            language: 'zh-CN', // 语言选择中文
            autoclose: true,
            startView: 'month',
            minView: 'month',
            // minView: 'hour',// 可以看到小时
            // minuteStep:1, //分钟间隔为1分
            format: 'yyyy-mm-dd',// 年月日时分秒
            clearBtn: false,
            todayBtn: false,
            endDate: new Date(),
            initialDate: getFirstDayOfWeek(new Date())
        }).on('changeDate', function (ev) {
        if (ev.date) {
            $(endSelector).datetimepicker('setStartDate', new Date(ev.date.valueOf()))
        } else {
            $(endSelector).datetimepicker('setStartDate', null);
        }
    })
    $(endSelector).datetimepicker(
        {
            language: "zh-CN",
            autoclose: true,
            minView: 'month',
            // minuteStep:1,
            startView: 'month',
            format: "yyyy-mm-dd",
            clearBtn: false,
            todayBtn: false,
            endDate: new Date(),
            initialDate: new Date()
        }).on('changeDate', function (ev) {
        if (ev.date) {
            $(beginSelector).datetimepicker('setEndDate', new Date(ev.date.valueOf()))
        } else {
            $(beginSelector).datetimepicker('setEndDate', new Date());
        }
    })
    $(beginSelector).val(timeFormat(getFirstDayOfWeek(new Date())));
    $(endSelector).val(timeFormat(new Date()));
}


//获取这周的周一
function getFirstDayOfWeek(date) {
    var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
    date.setDate(date.getDate() - weekday + 1);//往前算（weekday-1）天，年份、月份会自动变化
    return date;
}

//日期格式化，返回值形式为yy-mm-dd
function timeFormat(date) {
    if (!date || typeof(date) === "string") {
        this.error("参数异常，请检查...");
    }
    var y = date.getFullYear(); //年
    var m = date.getMonth() + 1; //月
    if (m < 10) {
        m = '0' + m;
    }
    var d = date.getDate(); //日
    if (d < 10) {
        d = '0' + d;
    }
    return y + "-" + m + "-" + d;
}

/**
 * 时间转换成字符串
 * @param fmt 格式字符串
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}