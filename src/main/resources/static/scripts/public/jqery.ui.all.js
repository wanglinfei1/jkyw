
/*************************************************************************
*	base 公用的基础方法
*	@author 李见伟
************************************************************************/
;(function($){
	$.extend($.fn,{
		base:function(options,param){
			if (typeof options == 'string'){
				return $.fn.base.methods[options](this, param);
			}
			options = options || {};
			return this.each(function(){
				var state = $.fn.base.methods["getOptions"](this,'base');
				if (state){
					$.fn.base.methods["setOptions"](this,'base',$.extend(state.options, options));
				} else {
					$.fn.base.methods["setOptions"](this,'base',$.extend({},$.fn.base.defaults,options));
				}
			});
		}
	});
	$.fn.base.methods = {
		getOptions:function(jq,param){
			/*param 控件的名称非空*/
			return $.data(jq,param).options;
		},
		setOptions:function(jq,param,options){
			/*param 保存参数*/
			$.data(jq,param,{options:options});
		},
		close:function(jq,param){
			$(jq).each(function(){
				$(this).hide();
			});
		}
	};
	$.fn.base.defaults = {
		uiname:"base"
	};
})(jQuery);

/***********************************************************************
*	遮罩插件
*	@Mask 李见伟
*	@parameters 
*		width:number; 消息类型
*		corner:true|false default:true;
*		border:{style:"solid",width:1,color:"#CCC"},
*		position:left|top|right|bottom default:null 消息提示出现的位置
************************************************************************/
;(function($){
	function show(options){
		options=$.extend({},$.Mask.defaults,options);
		var target=$(options.target);
		if(!target.length){
			target=$("body");
			options.target="body";
		}
		var mask=target.children("."+options.uiname);
		if(!mask.length){
			mask=$('<div></div>').addClass(options.uiname);
			mask.appendTo(target);
		}
		if(options.bgColor){
			mask.css("background",options.bgColor);
		}
		if(options.opacity){
			mask.css("opacity",options.opacity);
		}
		if(options.target=="body"){
			options.scrollTop=$(window).scrollTop();
			$(window).bind("scroll",function(e){e.preventDefault;$(window).scrollTop(options.scrollTop);});
		}else{
			options.scrollTop=$(target).scrollTop();
			mask.css("top",options.scrollTop+"px");
			$(target).bind("scroll",function(e){e.preventDefault;$(target).scrollTop(options.scrollTop);});
		}
		if(options.loading){
			mask.loading();
		}
		mask.fadeIn(100);
	}
	function close(options){
		options=$.extend({},$.Mask.defaults,options);
		var target=$(options.target);
		if(!target.length){
			target=$("body");
			options.target="body";
		}
		var mask=target.children("."+options.uiname);
		if(options.target=="body"){
			$(window).unbind("scroll").bind("scroll",function(e){});
		}else{
			$(target).unbind("scroll").bind("scroll",function(e){});
		}
		//alert(mask.length);
		mask.remove();
	}
	$.extend({
		Mask:{
			show:function(options){
				return show(options);
			},
			close:function(options){
				return close(options);
			}
		}
	});
	$.Mask.defaults =$.extend({},{
		uiname:"Mask",
		target:"body",
		scrollTop:0,
		bgColor:"black",
		loading:false,
		opacity:0.25
		
	});
})(jQuery);
/*************************************************************************
*	Confirm 提示消息插件
*	@author 李见伟
*	@parameters 
*		width:number; 消息类型
*		corner:true|false default:true;
*		border:{style:"solid",width:1,color:"#CCC"},
*		position:left|top|right|bottom default:null 消息提示出现的位置		
************************************************************************/
;(function($){
	$.extend({
		Confirm:function(options,callback){
			options = $.extend({
				width:"80%",
				height:"",
				modle:true,
				id:"CONFIRM",
				class:"confirm",
				buttons:{" ok ":function(){},"cancel":function(){}},
				corner:5,
				title:"",
				html:"",
				textAlign:"center",
				opacity:1
			},options);
			var me=this;
			function Initialization(){
				if(!options.id){
					return;
				}
				me.cf=$("#"+options.id);
				//$cf=$("#"+options.id);
				if(me.cf.length<1){
					me.cf=$('<div class="confirm"><div class="body"></div></div>');
					me.cf.attr("id",options.id);
					me.cf.appendTo($("body"));
				}
				me.bg=$("div.background",me.cf);
				//$cfbg=$("div.background",me.cf);
				if(me.bg.length<1){
					me.bg=$('<div class="background"></div>');
					me.bg.appendTo(me.cf);
				}
				me.body=$(".body",me.cf);
				//$cfBody=$(".body",me.cf);
				if(me.body.length<1){
					me.body=$('<div class="body"></div>');
					me.body.appendTo(me.cf);
				}
				me.msgCnt=$(".msgCnt",me.body);
				//var $msgContent=$(".msgCnt",me.body);
				if(me.msgCnt.length<1){
					me.msgCnt=$('<div class="msgCnt"></div>');
					me.msgCnt.appendTo(me.body);
				}
				if(options.textAlign){
					me.msgCnt.attr("align",options.textAlign);
				}
				if(options.title){
					me.title=$("h2.title",me.msgCnt);
					if(me.title.length<1){
						me.title=$('<h2 class="title"></h2>');
						me.title.appendTo(me.msgCnt);
					}
					me.title.text(options.title);
				}
				if(options.html){
					me.text=$("div.text",me.msgCnt);
					if(me.text.length<1){
						me.text=$('<div class="text"></div>');
						me.text.appendTo(me.msgCnt);
					}
					me.text.html(options.html);
				}
				me.fBar=$("div.fBar",me.body);
				if(me.fBar.length<1){
					me.fBar=$('<div class="fBar"></div>');
					me.fBar.appendTo(me.body);
				}
				$buttonGroup=$("ul.buttonGroup",me.fBar);
				if($buttonGroup.length<1){
					$buttonGroup=$('<ul class="buttonGroup"></ul>');
					$buttonGroup.appendTo(me.fBar);
				}
				if(options.corner){
					me.bg.addClass("corner-"+options.corner);
					me.body.addClass("corner-"+options.corner);
					me.text.addClass("corner-"+options.corner);
				}
				if(options.width){
					me.cf.css("width",options.width);
				}
				if(options.opacity){
					me.bg.fadeTo(0,0.25);
					me.body.fadeTo(100,options.opacity);
				}else{
					me.bg.fadeTo(0,0.25);
				}
				if(options.buttons){
					$buttonGroup.html("");
					var i=0;
					var btn=[];
					var fun=[];
					for(var key in options.buttons){
						fun[i]=options.buttons[key];
						btn[i]=$('<li><span></span></li>').appendTo($buttonGroup);
						$("span",btn[i]).text(key);
						btn[i].click(function(){
							hide();
							var j=$(this).index();
							if(fun[j]){
								fun[j].call();
							}
						});
						i++;
					}
				}				
				$(window).resize(function(){
					InitializationPosition();
				});
			}
			function InitializationPosition(){
				me.cf=$("#"+options.id);
				var width=me.cf.width();
				var height=me.cf.height();
				var browserWidth=$(window).width();
				var browserHeight=$(window).height();
				if(browserWidth>width){
					me.cf.css("left",browserWidth/2-width/2);
				}
				if(browserHeight>height){
					me.cf.css("top",(browserHeight/2-height/2)*2/3);
				}
			}
			function show(){
				me.cf=$("#"+options.id);
				InitializationPosition();
				if(options.modle){
					$.Mask.show();
				}
				me.cf.stop(true,true).fadeIn(100);
			}
			function hide(){
				me.cf=$("#"+options.id);
				if(options.modle){
					$.Mask.close();
				}
				me.cf.stop(true,true).fadeOut(100,function(){$(this).remove();});
			}
			Initialization();
			show();
			return me;
		}
	});
})(jQuery);

/***********************************************************************
*	loading 插件
*	@author 李见伟
*	@parameters:
*		opacity:0.5 0-1 遮罩透明度
*		autoOpen:true|false default:true
*		onCloseDestroy:true|false default true
*	@public methods:
*		init:default
*		close:隐藏
*		show:显示
************************************************************************/
;(function($){
	function init(opts,param){
		//var body=$(body);
		var panel=$("#"+opts.id);
		var mask,content,img,text;
		if(panel.length<1){
			panel=$('<div class="Loading"><div class="Loading_mask"></div><div class="Loading_xyz"><div class="Loading_cnt"><div class="Loading_bg"><div class="Loading_animate"><img class="Loading_animate_img" src="img/cinema_icon_loading.png"/></div><div class="Loading_text">加载中请稍后...</div></div></div></div></div>');
			panel.attr("id",opts.id);
			panel.appendTo($("body"));
		}
		content=$("div.Loading_cnt",panel);
		mask=$("div.Loading_mask",panel);
		img=$("img.Loading_animate_img",panel);
		text=$(".Loading_text",panel);
		if(opts.loadingimg){
			img.attr("src",opts.loadingimg);
		}
		if(opts.text){
			text.text(opts.text);
		}else{
			text.text("");
		}
		if(opts.width && opts.width>0){
			content.css("width",opts.width).css("left",0-opts.width/2);
		}else{
			var width=content.width();
			content.css("left",0-width/2);
		}
		if(opts.opacity){
			mask.fadeTo(100,opts.opacity);
		}
		if(opts.height && opts.height>0){
			content.css("height",opts.height).css("top",0-opts.height/2);
		}else{
			//var height=content.height();
			content.css("top","-60px");
		}
		$(window).bind("scroll",function(e){e.preventDefault();});
		panel.stop(true,true).fadeIn(300);
	}
	function show(param){
		var opts=getOptions(param);
		init(opts,param);
	}
	function close(param){
		var opts=getOptions(param);
		var panel=$("#"+opts.id);
		panel.fadeOut(100,function(){
			if(opts.onCloseDestroy){
				$(this).remove();
			}
		});
		$(window).unbind("scroll").bind("scroll",function(e){});
	}
	function getOptions(param){
		var data=$.data(document,"Loading");
		if(data){
			return data.options;
		}else{
			return {};
		}
	}
	$.extend({
		Loading:function(options,param){
			//var target=$("body");//使用body保存数据
			if (typeof options == 'string'){
				return $.Loading.methods[options](param);
			}
			var state = $.data(document,"Loading");
			if(state){
				options=$.extend({},state.options,options);
				$.data(document,"Loading",{options:options});
			}else {
				options=$.extend({id:"Loading"},$.Loading.defaults,options);
				$.data(document,"Loading",{options:options});
			}
			init(options,param);
			//show(options,param);
		}
	});
	$.Loading.methods = $.extend({},{
		show:function(param){
			show(param);
		},
		close:function(param){
			close(param);
		}
	});
	$.Loading.defaults =$.extend({},{
		uiname:"Loading",
		opacity:0.3,
		id:"Loading",
		width:120,
		height:0,
		autoOpen:true,
		loadingimg:"/framework/img/cinema_icon_loading.png",
		text:"加载中...",
		onCloseDestroy:true
	});
})(jQuery);

/*************************************************************************
*	提示插件
*	@author 李见伟
*	@parameters 
*		width:number; 消息类型
*		corner:true|false default:true;
*		border:{style:"solid",width:1,color:"#CCC"},
*		position:left|top|right|bottom default:null 消息提示出现的位置
************************************************************************/
;(function($){
	$.extend({
		FloatingHint:function(options){
			var options = $.extend({
				width:"",
				height:"",
				id:"FloatingHint",
				class:"floatingHint",
				closable:true,
				corner:3,
				type:"",
				title:"",
				text:"default text",
				target:"body",
				holdTime:0,
				opacity:1
			},options);
			var $fh,$bg,$fhBody,$close,$title,$textContent,$text,target;
			var timeoutProcess;
			if(options.target){
				target=$(options.target);
			}else{
				target=$(body);
			}
			function Initialization(){
				if(!options.id){
					return;
				}
				if(!options.text){
					return;
				}
				$fh=$("#"+options.id,target);
				if($fh.length<1){
					$fh=$('<div id="'+options.id+'" class="floatingHint"><div class="body"></div></div>');
					$fh.appendTo(target);
				}
				$bg=$("div.background",$fh);
				if($bg.length<1){
					$bg=$('<div class="background"></div>');
					$bg.appendTo($fh);
				}
				$fhBody=$(".body",$fh);
				if($fhBody.length<1){
					$fhBody=$('<div class="body"></div>');
					$fhBody.appendTo($fh);
				}
				if(options.title){
					$title=$("div.title",$fhBody);
					if($title.length<1){
						$title=$('<div class="title"></div>');
						$title.appendTo($fhBody);
					}
					$title.html(options.title);
				}
				if(options.type){
					var $notiseIcon=$("span.notiseIcon",$fhBody);
					if(options.type==="success"){
						if(!$notiseIcon.length){
							$notiseIcon=$('<span class="notiseIcon"></span>').appendTo($fhBody);
						}
						$fh.addClass("success");
					}
					if(options.type==="error"){
						if(!$notiseIcon.length){
							$notiseIcon=$('<span class="notiseIcon"></span>').appendTo($fhBody);
						}
						$fh.addClass("error");
					}
					if(options.type==="information"){
						if(!$notiseIcon.length){
							$notiseIcon=$('<span class="notiseIcon"></span>').appendTo($fhBody);
						}
						$fh.addClass("information");
					}
				}
				if(options.closable){
					$close=$("a.close",$fhBody);
					if($close.length<1){
						$close=$('<a class="close" href="">x</a>');
						$close.appendTo($fhBody);
					}
					if($title&&$title.length){
						$close.appendTo($title);
					}
					$close.click(function(e){
						e.preventDefault();
						hide();
					});
				}
				if(options.text){
					$textContent=$("div.text",$fhBody);
					if($textContent.length<1){
						$textContent=$('<div class="text"></div>');
						$textContent.appendTo($fhBody);
					}
					$textContent.html(options.text);
				}
				if(options.corner){
					$bg.addClass("corner-"+options.corner);
					$fhBody.addClass("corner-"+options.corner);
					$textContent.addClass("corner-"+options.corner);
					if($title&&$title.length){
						$title.addClass("corner-tr-"+options.corner).addClass("corner-tl-"+options.corner);
					}
				}
				if(options.width){
					$fh.css("width",options.width);
				}
				if(options.opacity){
					$bg.fadeTo(0,0.25);
					$fhBody.fadeTo(100,options.opacity);
					//$fhBody.fadeTo(100,1);
				}else{
					$bg.fadeTo(0,0.25);
				}
				$(window).resize(function(){			
					InitializationPosition();
				});
				$fh.hover(
					function(){
						if(options.holdTime){
							clearTimeout(timeoutProcess);
						}
						$fhBody.fadeTo(100,1);
					},
					function(){
						if(options.holdTime){
							timeoutProcess=setTimeout(hide, options.holdTime);
						}
						if(options.opacity){$fhBody.fadeTo(100,options.opacity);}
					}
				);
			}
			function InitializationPosition(){
				var width=$fh.width();
				var height=$fh.height();
				var browserWidth=$(window).width();
				var browserHeight=$(window).height();
				//$fh.css("width",width);
				//alert("width:"+width+"\nheight:"+height+"\nbrowserWidth:"+browserWidth+"\nbrowserHeight:"+browserHeight);
				if(browserWidth>width){
					$fh.css("left",browserWidth/2-width/2);
				}
				if(browserHeight>height){
					$fh.css("top",(browserHeight/2-height/2));
				}
			}
			function show(){
				InitializationPosition();
				$fh.fadeIn(300);
				if(options.holdTime){
					timeoutProcess=setTimeout(hide, options.holdTime);
				}
			}
			function hide(){
				if(options.holdTime){
					clearTimeout(timeoutProcess);
				}
				$fh.stop(true,true).fadeOut(300,function(){$(this).remove();});
			}
			Initialization();
			show();
		}
	});
})(jQuery);