/**
 *
 * jQuery.AjaxQueuer
 *
 * @FileName: jquery.ajaxqueuer.js
 * @Auther: Pandao 
 * @version: 0.1.0 
 * @License: MIT
 * Copyright@2014 all right reserved.
 */

;(function(ajaxQueuer) {

	// CommonJS/Node.js
	if(typeof require === 'function' && typeof exports === "object" && typeof module === "object") {
		ajaxQueuer(require, exports, module);
	}	
	// AMD/CMD/Sea.js
	else if(typeof define === "function") {

		if(define.amd) { // for Require.js

			define(["jquery"], ajaxQueuer);

		} else { // for Sea.js
			define(ajaxQueuer);
		}
	} 
	else 
	{ 
		ajaxQueuer(function(){}, window['ajaxQueuer']={}, {}); 
	}

}(function(require, exports, module) {  

	(function ($) {
		
		var ajaxQueuer = function() { 

			if(arguments.length == 1 && typeof (arguments[0].length) == "undefined") {

				return new ajaxQueuer.queue([], arguments[0]);

			} else {

				return new ajaxQueuer.queue(arguments[0], arguments[1]);
				
			}
		};

		ajaxQueuer.queue = function(queue, options) {

			queue   = queue   || [];
			options = options || {};

			var _this = this;

			if (typeof (queue) == "object") {
				this.queue = queue; 
				this.count = queue.length;
				this.nowIndex = 0;
			}

			var defaults = {
				type    : "GET",
				async   : false,           // default false
				timeout : 3000,            // global setting
				namePrefix : 'ajaxQueuer'
			}; 

			this.settings = $.extend(defaults, options);

			this.qid      = this.settings.namePrefix + (new Date).getTime(); 

			this.add = function(queue) { 
				queue = queue || {};

				if(typeof (queue.length) != "undefined" && queue.length > 1)
				{ 
					for (var i = 0, len = queue.length; i < len; i++) 
					{
						_this.count += 1; 
						_this.queue.push(queue[i]); 
					}
				} 
				else 
				{
					_this.count += 1; 
					_this.queue.push(queue); 					
				}

				return _this;
			};

			this.async = function() {

				_this.settings.async = true;

				ajaxQueuer.prioritySort(_this);

				var queue = _this.queue[_this.nowIndex]; 

				ajaxQueuer.request(_this, queue); 

				return _this;
			};

			this.synch = function() {

				_this.settings.async = false;

				var queue = _this.queue[_this.nowIndex];

				ajaxQueuer.request(_this, queue); 

				return _this;
			};

			this.run = function() {
				var queue = _this.queue[_this.nowIndex];

				ajaxQueuer.request(_this, queue); 

				return _this;
			};  

			this.last = function() {  

				_this.nowIndex = _this.queue.length-1;

				ajaxQueuer.request(_this, _this.queue[_this.nowIndex], true);  

				return _this;
			};

			this.getQueues = function() {
				return _this.queue;
			};

			this.stop = function() {
				_this.nowIndex = _this.queue.length;

				return _this;
			};

			this.flush = function() {
				_this.queue = [];

				return _this;
			};

			return this;
		}; 

		ajaxQueuer.prioritySort = function(_this) { 

			for (var i in _this.queue) {
				var queue = _this.queue[i];

				if(typeof (queue.priority) == "undefined") {
					queue.priority = 0;
				}
				//console.log("i : ", _this.queue[i]);
			}

			_this.queue.sort(function(a, b) {
				//console.log(a.priority, b.priority);

				return (a.priority > b.priority) ? -1 : 1;
			});
		};

		ajaxQueuer.request = function(_this, queue, isLast) {

			if (_this.nowIndex >= _this.count) return ; 

			isLast = isLast || false;

			var defaults = { 
				before      : new Function,
				beforeSend  : new Function,
				cache       : true,
				contentType : "application/x-www-form-urlencoded; charset=UTF-8",
				crossDomain : false,
				complete    : new Function, 
				data        : {},
				dataType    : "text html",
				error       : new Function,
				headers     : {},
				index       : _this.nowIndex,
				jsonp       : "callback",
				name        : _this.qid + "[" + _this.nowIndex + "]",
				processData : true,
				startTime   : (new Date).getTime(),
				statusCode  : {},
				success     : new Function,
				status      : ""
			};

			_this.queue[_this.nowIndex] = queue = $.extend(defaults, queue);

			queue.before(queue);

			var async = (typeof (queue.async) == "undefined")   ? _this.settings.async   : queue.async;

			$.ajax({  
				url         : queue.url,
				data        : queue.data,
				type        : (typeof (queue.type) == "undefined")    ? _this.settings.type    : queue.type,
				async       : async,
				cache       : (queue.dataType == "jsonp" || queue.dataType == "script") ? false : queue.cache,
				contentType : queue.contentType,
				crossDomain : queue.crossDomain,
				dataType    : queue.dataType,
				headers     : queue.headers,
				jsonp       : queue.jsonp,
				statusCode  : queue.statusCode,
				processData : queue.processData,
				timeout     : (typeof (queue.timeout) == "undefined") ? _this.settings.timeout : queue.timeout, 

				beforeSend  : function(xhr) {
					queue.beforeSend(xhr, queue, this);
				},

				error       : function (xhr, status) {
					queue.errorTime = (new Date).getTime(); 
					queue.error(xhr, status, queue, this);
				},

				success     : function(data, status, xhr) {  
 
					queue.result = data;
					queue.successTime = (new Date).getTime();
					queue.success(data, status, xhr, queue, this); 
				},
				
				complete    : function(xhr, status) {

					queue.status = status;
					queue.completeTime = (new Date).getTime();
					queue.complete(xhr, status, queue, this);  

					if(!this.async && queue.status == "success" && !isLast) 
					{
						queue.done      = true;
						_this.nowIndex += 1; 

						ajaxQueuer.request(_this, _this.queue[_this.nowIndex]);
					}
				}
			}); 

			if(async) 
			{
				_this.nowIndex += 1;

				ajaxQueuer.request(_this, _this.queue[_this.nowIndex]);
			}
		};

		$.ajaxQueuer = ajaxQueuer; 

	})(jQuery); 

}));