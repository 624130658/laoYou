
function binSub_bureau_name(id,dept_type,parent_id,falg)
{
  var param = {
		  dept_type:dept_type,
		  falg:falg
  };
  $.post("../../arrears/binSub_bureau_name.do",param,function(data){
	  $("#"+id).html(data);
  });	
}

//获取url参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

//绑定区局数据
function binDistrict(id, falg, district, reslutType) {
	var param = {
		district : district,
		access : falg,
		reslutType : reslutType
	}
	$.post("../../sysmanager/binDistrict.do", param, function(data) {
		$("#" + id).html(data);
	});
}
//获取所有的class样式
function getByClass(o, s)// 获取Class;
{
	var arr = $("."+s)
	/*var aEle = document.getElementsByTagName('*');
	var arr = [];
	for (var i = 0; i < aEle.length; i++) {
		if (aEle[i].className == s) {
			arr.push(aEle[i])
		}
	}*/
	return arr;
}

function saveW() {
	document.getElementById('modal_r').innerHTML = "<button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button><button type='button' id='save' class='btn btn-primary' style='' onclick=''>保存</button>";
}
function saveWs() {
	document.getElementById('modal_rs').innerHTML = "<button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button><button type='button' id='save' class='btn btn-primary' style='' onclick=''>保存</button>";
}

function colseW() {
	document.getElementById('modal_r').innerHTML = "<button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button>";
}

// 动态得到下级div元素
function curobjHTML(curobjs) {
	var curobj = curobjs;
	while (true) {
		if (curobj.tagName == "DIV") {
			break;
		}
		curobj = curobj.nextSibling;
	}
	return curobj
}

function prompt(falg, value) {
	var reslut = "";
	if (falg) {
		reslut = "&nbsp;<i  class='glyphicon glyphicon-ok'></i><span>&nbsp;"
				+ value + "</span>"
	} else {
		reslut = "&nbsp;<i  class='glyphicon glyphicon-remove'></i><span>&nbsp;"
				+ value + "</span>"
	}
	return reslut;
}

function eliminateLI() {
	$("#ocheck>li>div").empty();
}

function notverifyn(notCheck) {
	notCheck.onkeyup = function() {
		var curobj = curobjHTML(this.nextSibling);
		curobj.innerHTML = prompt(true, "*允许为空*");
		curobj.className = '';
		curobj.className = 'ingreen';
	}
}

function ReslutArray(data) {
	if (data != "") {
		var datas = data.replace("[", "").replace("]", "");
		return datas.split(",");
	}
	return "";
}