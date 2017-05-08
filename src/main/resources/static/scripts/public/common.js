define([ "jquery", "routes", "errorConfig", "weui","jqWeui" ], function($, Routes, Error) {
	var Common = {
		panel : {
			add:function(EJS_url,data,moduleName){/*console.log('add',11)*/
				this.moduleName = moduleName;
				if(typeof data == "string"){
					this.moduleName = data;
					data = {};
				}else{
					if(!data) data = {};
				}
				
				if ($("#"+this.moduleName).length > 0) {
					return this;
				}
				/*console.log('add',13)*/
				var page = new EJS({
					url : Common.param.appPath + "/" + EJS_url
				}).render(data);


				if(this.moduleName && typeof this.moduleName=="string"){
					page = "<div id='"+this.moduleName+"' style=\"display: none;\">"+page+"</div>";
				}
				$("#app-main").append(page);
				return this;
			},
			open:function(isHideSiblings){
				$("#"+this.moduleName).show();
				if(isHideSiblings===true){
					$("#"+this.moduleName).siblings().hide()
				}
				this.moduleName = undefined;
			}
		},
		param : (function() {
			var search = window.location.search;
			var domainName = window.location.href.replace(new RegExp(/\app_.+/g),"");
			var paraArray = search.substring(1, search.length).split("&");
			var p = {};
			$.each(paraArray, function(i, o) {
				if(o && o!=null && o!=""){
					var o = o.split("=");
					p[o[0]] = o[1];
				}
			});
			return $.extend(p, {
				module: $("#config-module").text(),
				domainName:domainName,
				openid : $("#config-openid").text(),
				/*openid : 'ocPs50jpuKP63eFx1GFl7pjB8dlo',*/
				appPath : $("#config-appPath").text(),
				needSignature:$("#config-needSignature").text()
			});
		})(),
		/**
		 * 加载指定css文件
		 * 
		 * @memberof Common
		 * @function
		 * @name loadStyleFiles
		 * @param (String)
		 *            cssFilePath - css文件路径
		 * @param (Function)
		 *            callback - 加载成功后执行的方法
		 * @returns (String) undefined
		 */
		loadStyleFiles : function(cssFilePath, callback) {/*console.log('css',11)*/
			if (cssFilePath && $.isArray(cssFilePath)) {
					/*$('#app-main').css({'opacity':'0'});*/
					$("link[loadflag]").remove();
					var Num=$(cssFilePath).length;
					$(cssFilePath).each(function(i, o) {
					var styleName='load'+o.substr(7).replace(new RegExp(/\.css+/g),"");
					if(o=="styles/jquery-weui.css"){
						var loadjqWeui=$("link[loadjqWeui]").attr('loadjqWeui');
						if(loadjqWeui!='jqweiUi'){
							$("link").eq(0).after("<link  rel=\"stylesheet\" type=\"text/css\" href=\"" + Common.param.appPath + "/" + o + "\"loadjqWeui=\"jqweiUi\"/>");
						}
					}else if(o=="styles/weui.min.css"){
						var loadWeui=$("link[loadWeui]").attr('loadWeui');
						if(loadWeui!='weiUi'){
							$("link").eq(0).after("<link  rel=\"stylesheet\" type=\"text/css\" href=\"" + Common.param.appPath + "/" + o + "\"loadWeui=\"weiUi\"/>");
						}
					}/*else{
						if(!$("link").attr(styleName)){
							$("link").eq(0).after("<link  rel=\"stylesheet\" type=\"text/css\" href=\"" + Common.param.appPath + "/" + o + "\" "+styleName+"=\"true\"/>");
						}

					}*/else{
						$("link").eq(0).after("<link  rel=\"stylesheet\" type=\"text/css\" href=\"" + Common.param.appPath + "/" + o + "\" loadflag=\"true\"/>");
					}
					if(i==Num-1){
						/*console.log('css',12)*/
						/*console.log(Num +'-----'+ i);*/
						if (callback && $.isFunction(callback)) {
							callback();
						}
					}
				});
			}

		},
		router : {
			go : function(business,method,params) {
				var router = this.history.get(business);
				if (router) {
					if(method && typeof method == "string"){
						router.method = method;
					}
					if(params && params instanceof Array){
						router.params = params;
					}
					this.trigger(business, router, true);
				} else {
					console.info("没有找到业务名称为“" + business + "”历史路由...");
				}

			},
			history_cache:{
				index: 0,
				cache: new Array()
			},
			history : null,
			/*
			 * 跳转路由， router数据包格式：{module:module,method:method,params:params}
			 */
			trigger : function(business, router, ishistory) {
				var _t = this;
				var businessName = typeof business == "string" ? business : null;
				if (!businessName && typeof business == "object") {
					businessName = business.module;
					router = business;
				}
				if (ishistory) {
					// 加载模块内定义的css样式
					Common.loadStyleFiles(router.router.cssPath, function() {
						if (router.method) {
							router.router[router.method].apply(router.router, router.params);
						} else {
							router.router["init"].apply(router.router, router.params);
						}
					});
				} else {
					if (!this.history) {
						this.history = new Common.Map();
					}
					require([ "routes" ], function(routes) {
						require([ routes.routerPath[router.module], routes.routerPath["error"] ], function(Module, Error) {
							var newRouter;
							if (Module) {// 如果模块定义存在
								if(typeof Module == "function"){
									newRouter = new Module();
								}else{
									newRouter = Module;
								}
								
							} else {// 如果模块定义不存在，转到错误提示页面
								newRouter = new Error(-1,"未找到相应模块");
							}
							// 加载模块内定义的css样式
							Common.loadStyleFiles(newRouter.cssPath, function() {/*console.log(11)*/
								router.router = newRouter;
								if (router.method) {
									newRouter[router.method].apply(newRouter, router.params);
								} else {
									try{
										newRouter["init"].apply(newRouter, router.params);
									}catch(error){
										console.info(router.module+ ":" +error);
									}/*console.log(12)*/
								}
								$("#app-main").css({'opacity':'0'}).animate({opacity:0},300).animate({opacity:1},50);
								_t.history.put(businessName, router);
							});
						});
					});
				}
			},
			clear : function() {
				this.history.clear();
			}
		},
		/**
		 * MAP对象，实现MAP功能
		 * 
		 * 接口： size() 获取MAP元素个数 isEmpty() 判断MAP是否为空 clear() 删除MAP所有元素 put(key,
		 * value) 向MAP中增加元素（key, value) remove(key)
		 * 删除指定KEY的元素，成功返回True，失败返回False get(key) 获取指定KEY的元素值VALUE，失败返回NULL
		 * element(index)
		 * 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
		 * containsKey(key) 判断MAP中是否含有指定KEY的元素 containsValue(value)
		 * 判断MAP中是否含有指定VALUE的元素 values() 获取MAP中所有VALUE的数组（ARRAY） keys()
		 * 获取MAP中所有KEY的数组（ARRAY）
		 * 
		 * 例子： var map = new Map();
		 * 
		 * map.put("key", "value"); var val = map.get("key") ……
		 * 
		 */
		Map : function() {
			this.elements = new Array();
			// 获取MAP元素个数
			this.size = function() {
				return this.elements.length;
			}

			// 判断MAP是否为空
			this.isEmpty = function() {
				return (this.elements.length < 1);
			}

			// 删除MAP所有元素
			this.clear = function() {
				this.elements = new Array();
			}

			// 向MAP中增加元素（key, value)
			this.put = function(_key, _value) {
				if (this.containsKey(_key)) {
					this.remove(_key);
				}
				this.elements.push({
					key : _key,
					value : _value
				});
			}

			// 删除指定KEY的元素，成功返回True，失败返回False
			this.remove = function(_key) {
				var bln = false;
				try {
					for (i = 0; i < this.elements.length; i++) {
						if (this.elements[i].key == _key) {
							this.elements.splice(i, 1);
							return true;
						}
					}
				} catch (e) {
					bln = false;
				}
				return bln;
			}

			// 获取指定KEY的元素值VALUE，失败返回NULL
			this.get = function(_key) {
				try {
					for (i = 0; i < this.elements.length; i++) {
						if (this.elements[i].key == _key) {
							return this.elements[i].value;
						}
					}
				} catch (e) {
					return null;
				}
			}

			// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
			this.element = function(_index) {
				if (_index < 0 || _index >= this.elements.length) {
					return null;
				}
				return this.elements[_index];
			}

			// 判断MAP中是否含有指定KEY的元素
			this.containsKey = function(_key) {
				var bln = false;
				try {
					for (i = 0; i < this.elements.length; i++) {
						if (this.elements[i].key == _key) {
							bln = true;
						}
					}
				} catch (e) {
					bln = false;
				}
				return bln;
			}

			// 判断MAP中是否含有指定VALUE的元素
			this.containsValue = function(_value) {
				var bln = false;
				try {
					for (i = 0; i < this.elements.length; i++) {
						if (this.elements[i].value == _value) {
							bln = true;
						}
					}
				} catch (e) {
					bln = false;
				}
				return bln;
			}

			// 获取MAP中所有VALUE的数组（ARRAY）
			this.values = function() {
				var arr = new Array();
				for (i = 0; i < this.elements.length; i++) {
					arr.push(this.elements[i].value);
				}
				return arr;
			}

			// 获取MAP中所有KEY的数组（ARRAY）
			this.keys = function() {
				var arr = new Array();
				for (i = 0; i < this.elements.length; i++) {
					arr.push(this.elements[i].key);
				}
				return arr;
			}
		},
		// 封装请求方法
		req : function(methodFromRoutesKey,type, params, callback, errorCallback, async) {
			var url = Routes.method;
			var keys = methodFromRoutesKey.split(".");
			$(keys).each(function() {
				url = url[this];
			});

			if ("weixin" == keys[0] || "wxportal" == keys[0]) {
				params = params||{}
			}

			var urlReg = new RegExp("(http|https).+", "g");// 匹配普通属性
			if (!url.match(urlReg)) {
				url = Common.param.appPath + url;
			}
			var type = type||"post";
			$.ajax({
				url : url,
				type : type,
				data : params,
				cache : false,
				dataType : "json",
				timeout : 30000,
				beforeSend : function() {
					if(!async){
						$.showLoading('加载中');
					}
					var loadingCount = $("body").data("loading");
					if (loadingCount !== undefined) {
						$("body").data("loading", ++loadingCount);
					} else {
						$("body").data("loading", 1);
					}
					/*console.log("beforeSend........................");*/
				},
				complete : function(x, status) {

					if (status === "timeout") {
						Error.show("timeout");
					}
					var loadingCount = $("body").data("loading");
					$("body").data("loading", --loadingCount);
					if (loadingCount <= 0) {
						$('.weui_loading_toast').remove();
						$.hideLoading();
					}
					/*console.log("complete........................");*/
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					Error.show(textStatus,"global");
					loggerError(url,textStatus);
				},
				success : function(result, textStatus, jqXHR) {
					if ("weixin" == methodFromRoutesKey.split(".")[0]) {
						callback(result);
					} else if (result.state != 0) {
						loggerError(url,result);
						if (typeof errorCallback == "function") {
							errorCallback(result);
						} else {
							if (Error.codeConfig[methodFromRoutesKey] && result.state in Error.codeConfig[methodFromRoutesKey]) {
								Error.show(result.state, methodFromRoutesKey);
							} else if (result.state in Error.codeConfig.global) {
								Error.show(result.state,"global");
							} else {
								Error.show(result.msg);
							}
						}
					} else if (typeof callback == "function") {
						callback(result);
					}
				}
			});
			/**
			 * 记录日志
			 */
			function loggerError(url,error){
				var msg = JSON.stringify(error);
				$.post(Common.param.appPath+"/jsLogger.json",{url:url,logMsg:msg},function(data){
					if(data.status==0) console.info("记录日志成功");
				});
			}
		},
		slide:{
			beforPage:function(obj,callback,slidenum){
				Common.slide.slideFn(obj,callback,'r',slidenum);
			},
			afterPage:function(obj,callback){
				Common.slide.slideFn(obj,callback,'l');
			},
			upPage:function(obj,callback){
				Common.slide.slideFn(obj,callback,'u');
			},
			downPage:function(obj,callback){
				Common.slide.slideFn(obj,callback,'d');
			},
			slideFn:function(obj,callback,direction){
				var x=0;
				var y=0;
				var dl='';
				obj.addEventListener('touchstart',slideTouch,false);
				function slideTouch(ev){
					var ev=ev||event;
					if (ev.stopPropagation) {
						ev.stopPropagation();
					} else {
						ev.cancelBubble = true;
					}
					var downX=ev.targetTouches[0].pageX;
					var downY=ev.targetTouches[0].pageY;
					var disX=downX-x;
					var disY=downY-y;
					function fnMove(ev){
						if(dl){
							if(dl=='rl'){
								x=ev.targetTouches[0].pageX-disX;
							}else if(dl == 'top'){
								y=ev.targetTouches[0].pageY-disY;
							}
						}else{
							if(Math.abs(ev.targetTouches[0].pageX-downX)>20){
								dl='rl';
							}else if(Math.abs(ev.targetTouches[0].pageY-downY)>20){
								dl='ud';
							}
						}
					}
					function fnEnd(ev){
						dl='';
						if(Math.abs(ev.changedTouches[0].pageX-downX)>60){
							if(ev.changedTouches[0].pageX>downX){
								if(direction=='r'){
									callback();
									obj.removeEventListener('touchstart',slideTouch,false);
								}
							}else{
								if(direction=='l'){
									callback();
									obj.removeEventListener('touchstart',slideTouch,false);
								}
							}
						}
						if(Math.abs(ev.changedTouches[0].pageY-downY)>60){
							if(ev.changedTouches[0].pageY>downY){
								if(direction=='u'){
									callback();
									obj.removeEventListener('touchstart',slideTouch,false);
								}
							}else{
								if(direction=='d'){
									callback();
									obj.removeEventListener('touchstart',slideTouch,false);
								}
							}
						}
						document.removeEventListener('touchmove',fnMove,false);
						document.removeEventListener('touchend',fnEnd,false);
					}
					document.addEventListener('touchmove',fnMove,false);
					document.addEventListener('touchend',fnEnd,false);
				}

			}

		}


	};
	return Common;
});
