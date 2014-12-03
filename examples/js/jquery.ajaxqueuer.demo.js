;(function(ajaxQueuerDemo) {

	// CommonJS/Node.js
	if(typeof require === 'function' && typeof exports === "object" && typeof module === "object") {
		ajaxQueuerDemo(require, exports, module);
	}	
	// AMD/CMD/Sea.js
	else if(typeof define === "function") {

		if(define.amd) { // for Require.js

			define(["jquery"], ajaxQueuerDemo);

		} else { // for Sea.js
			define(ajaxQueuerDemo);
		}
	} 
	else 
	{ 
		ajaxQueuerDemo(function(){}, window['ajaxQueuerDemo']={}, {}); 
	}

}(function(require, exports, module) {  

	(function ($) {

		var ajaxQueue = $.ajaxQueuer([
			{ 
				url : "ajax.get.php?no=1", 
				error : function(xhr, status) {
					console.error(this.name, "请求错误：", xhr, status);
				},
				complete : function(xhr, status) {
					console.log(this.name, "请求完成：", xhr, status);	
				},
				success : function(data, status, xhr, queue, ajaxOptions) {
					console.log(this.name, "GET", data, ajaxOptions);
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
		]);

		console.log(ajaxQueue.getQueues());

		ajaxQueue.add({
			url : "ajax.get.phdp?no=1",
			//async : false,
			statusCode : {
				0: function() {
					$("#debuger")[0].innerHTML += '<p style="color:red;">请求超时：status=>0</p>';
				},
				404: function() { 
					$("#debuger")[0].innerHTML += '<p style="color:red;">请求失败：status=>404, '+this.url+'</p>';
				}
			},
			error : function(xhr, error, queue) {
				console.error(queue.name, "请求错误：", xhr, error);		
			},
			success : function(data, status, xhr, queue) {
				console.log(queue.name, "请求成功：", eval("("+data+")"), status, queue);
				$("#debuger")[0].innerHTML += '<p style="color:green;">请求成功：name=>'+queue.url+',  '+(new Date - queue.startTime)+'ms</p>';
			},
			complete : function(xhr, status, queue) {
				$("#debuger")[0].innerHTML += '<p style="color:'+(status == "error" ? 'red' : 'green')+';">'+queue.name + ' => 请求完成：' + status + '</p>';	
			}
		}).add({
			url : "http://192.168.1.2/jquery-ajaxqueuer/examples/ajax.jsonp.php?no=2",
			dataType : "jsonp",
			crossDomain : true,
			jsonp : "callbackName",
			before : function(queue) {
				$("#debuger")[0].innerHTML += queue.url + " 开始加载中....<br/>";
			},
			statusCode : {
				0: function() {
					$("#debuger")[0].innerHTML += '<p style="color:red;">请求超时：status=>0</p>';
				},
				404: function() { 
					$("#debuger")[0].innerHTML += '<p style="color:red;">请求失败：status=>404, '+this.url+'</p>';
				}
			},
			error : function(xhr, error, queue, ajaxOptions) {
				console.error(queue.name, "请求错误：", xhr, error, ajaxOptions);	
			},
			success : function(data, status, xhr, queue, ajaxOptions) {
				console.log(queue.name, "请求成功：", data, status, queue, xhr, ajaxOptions);
				$("#debuger")[0].innerHTML += '<p style="color:green;">请求成功：name=>'+queue.url+',  '+(new Date - queue.startTime)+'ms</p>';
			},
			complete : function(xhr, status, queue, ajaxOptions) {
				console.log(queue.name, "请求完成：", xhr, status, ajaxOptions, queue);	

				console.log("getQueueResult(1) =>", ajaxQueue.getQueues());
			}
		}).add({
			url : "./js/test.js",
			dataType : "script",
			priority : 2,
			before : function() {
				console.log('priority', this.priority);
			},
			success : function(data, status, xhr, queue, ajaxOptions) {
				console.log('getScript', this.url, "\n", test);
			}
		}).add([
			{
				url : "ajax.jsonp.php",
				data : {temp : Math.random()},
				dataType : "json",
				success : function(data, status, xhr, queue, ajaxOptions) {
					$("#debuger")[0].innerHTML += "<p>getJSON => ajax.jsonp.php =>" + JSON.stringify(data) + "</p>";
				}
			},
			{
				url : "ajax.jsonp.php",
				data : {temp : Math.random()},
				dataType : "json",
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
		});
		//ajaxQueue.async();
		//ajaxQueue.run();   
		//ajaxQueue.stop();

		$('[value="同步队列"]').click(function() {
			$("#debuger").html('');
			ajaxQueue.nowIndex = 0;
			ajaxQueue.synch();
		});

		$('[value="异步队列"]').click(function() {
			$("#debuger").html('');
			ajaxQueue.nowIndex = 0;
			ajaxQueue.async();
			//ajaxQueue.run();
		});

		$('[value="强制停止"]').click(function() { 
			ajaxQueue.stop(); 
		});

	})(jQuery); 

}));