jQuery.ajaxQueuer
=================

jquery plugin for ajax queue，jQuery Ajax队列扩展。

####参数说明

	$.ajaxQueuer([ajax队列], {配置});

配置项(具有优先级)：

	type		String		请求方式，默认为GET
	async		Boolean		是否为异步，默认为false，即同步
	timeout		Number(ms)	设置请求超时时间（毫秒），此设置将覆盖全局设置
	namePrefix	String		队列名称前缀，默认为'ajaxQueuer'

ajax队列是一个数组，由$.ajax方法的配置选项组成($.ajaxQueuer删除和增添一部分)：

	async											Boolean		在$.ajaxQueuer中默认为false，为同步队列，每个请求都需要上一个请求成功才能开始；
	before(queue)									Function	在$.ajax()执行之前的处理，例如： loading；
	beforeSend(xhr, queue, ajaxOptions)				Function	发送请求前可修改 XMLHttpRequest 对象的函数，如添加自定义 HTTP 头；
	cache											Boolean		默认为true，dataType为script和jsonp时默认为false；
	complete(xhr, ts, queue, ajaxOptions)			Function	请求完成后回调函数，请求成功或失败之后均调用；
	contentType										String		发送信息至服务器时内容编码类型，默认为"application/x-www-form-urlencoded"；
	crossDomain										Boolean		默认为同域请求，false；跨域请求为true，例如JSONP请求；
	data											Key/Value	发送到服务器的数据，默认为{}
	dataType										String		服务器返回的数据类型，默认为"text html"
	error(xhr, status, queue, ajaxOptions)			Function	请求失败时调用此函数
	headers											Key/Value	设置HTTP头的键值对，默认为{}
	jsonp											String		在一个jsonp请求中重写回调函数的名字，默认为"callback"；
	index											Integer		队列序号
	name											String		队列名称ID
	priority										Integer		优先级数字，在异步方式下，数值越大优先执行和发送，但不一定是最先完成；
	processData										Boolean		通过data选项传递进来的数据，如果是一个对象，都会处理转化成一个查询字符串，默认为true
	status											String		请求完成的状态，例如"error"、"success"、"timeout"；
	statusCode										Key/Value	一组数值的HTTP代码和函数对象，当响应时调用了相应的代码，默认为{}；
	success(data, status, xhr, queue, ajaxOptions)	Function	请求成功后的回调函数
	timeout											Number		设置请求超时时间（毫秒），此设置将覆盖全局设置；
	type											String		请求方式，默认为GET
	url												String		发送请求的目标地址

成员方法和属性：

	# 当前执行的队列序号
	nowIndex

	# 获取配置选项
	settings

	# 队列ID
	qid

	# 队列数组
	queue

	# 队列总数
	count

	# 追加队列
	add([ajax队列数组])
	add({ajax队列})

	# 开始执行队列, 依据配置同步或异步
	run()

	# 开始执行队列, 同步方式
	synch()

	# 开始执行队列, 异步方式
	async()

	# 清除整个队列
	flush()

	# 获取整个队列对象
	getQueues()

	# 只执行队列中的最后一个
	last()

####使用方法
		
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="../src/jquery.ajaxqueuer.js"></script>
	<script type="text/javascript">
		var ajaxQueuer = $.ajaxQueuer([
			{ 
				url : "ajax.get.php?no=1", 
				error : function(xhr, status) {
					console.error(this.name, "请求错误：", xhr, status);
				},
				success : function(data, status, xhr, queue, ajaxOptions) {
					console.log(this.name, "GET", data, ajaxOptions);
				},
				complete : function(xhr, status) {
					// this指向队列选项
					console.log(this.name, "请求完成：", xhr, status);	
				}
			},
			{
				url : "ajax.get.php", 
				data : "temp="+Math.random(),
				success : function(data, status, xhr, queue, ajaxOptions) {
					console.log(this.name, "GET", data, ajaxOptions);
				}
			},
			{
				url : "ajax.get.php?timeout", 
				data : "temp="+Math.random(), 
				priority : 3,
				statusCode : {
					0: function() {
						$("#debuger")[0].innerHTML += '<span style="color:red;">请求超时：status=>0, '+this.url+'</span><br/>';
					},
					404: function() { 
						$("#debuger")[0].innerHTML += '<span style="color:red;">请求失败：status=>404, '+this.url+'</span><br/>';
					}
				},
				before : function() {
					console.log('priority', this.priority);
				},
				error : function(xhr, status) {
					console.error(this.name, "GET", "请求失败", xhr, status);
				},
				success : function(data, status, xhr, queue, ajaxOptions) {
					console.log(this.name, "GET", data, ajaxOptions);
				}
			}
		], {
			type 	: "GET",
			async	: true,
			timeout	: 3000
		});

		ajaxQueuer.add([
			{
				url : "ajax.jsonp.php",
				data : {temp : Math.random()},
				dataType : "json",
				priority : 2,
				success : function(data, status, xhr, queue, ajaxOptions) {
					$("#debuger")[0].innerHTML += "<p>getJSON => ajax.jsonp.php =>" + JSON.stringify(data) + "</p>";
				}
			},
			{
				url : "ajax.jsonp.php",
				data : {temp : Math.random()},
				dataType : "json",
				priority : 2,
				success : function(data, status, xhr, queue, ajaxOptions) {
					$("#debuger")[0].innerHTML += "<p>getJSON => ajax.jsonp.php =>" + JSON.stringify(data) + "</p>";
				}
			}
		]).add({
			url : "ajax.post.php",
			type : "POST",
			priority : 1,
			before : function() {
				console.log('priority', this.priority);
			},
			data : {temp : Math.random()}, 
			success : function(data, status, xhr, queue, ajaxOptions) { 
				console.log('getJSON => ajax.post.php =>', this.url, "\n", data);
				$("#debuger")[0].innerHTML += "<p>getJSON => ajax.post.php =>" + data + "</p>";
			}
		}).run(); 	
	</script>

同时也支持在Require.js和Sea.js中使用：
	
	# 在Sea.js中使用
	<script type="text/javascript" src="js/sea.js"></script>
	<script type="text/javascript">
		seajs.config({
			base : "./js",
	　　　　alias : {
	　　　　　　"jquery": "jquery.min"
	　　　　}
	　　});

		seajs.use("./js/main");
	</script>

	# main.js
	define(function(require, exports, module) {	
		var $ = require('jquery');
		require('../../src/jquery.ajaxqueuer'); 
		require('../js/jquery.ajaxqueuer.demo');  
	});

	# 在Require.js中使用
	<script type="text/javascript" src="js/require.min.js"></script>
	<script type="text/javascript">
		require.config({
	　　　　paths: {
	　　　　　　"jquery": "js/jquery.min"
	　　　　}
	　　});

	　　require(['../src/jquery.ajaxqueuer', './js/jquery.ajaxqueuer.demo'], function () {   
		});
	</script>

####License

The MIT License (MIT)

Copyright (c) 2014 Pandao