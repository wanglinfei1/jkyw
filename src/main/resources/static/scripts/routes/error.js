define([ "jquery", "ejs", "common"], function($, EJS, Common) {
	function Error(code, msg) {
		this.ejs = "views/error";
		this.defaultCode = code||-1;
		this.defaultMsg = msg||"未知错误";
	}

	Error.prototype = {
		init : function(code, msg) {
			var _t = this;
			Common.panel.add(_t.ejs,{
				code : code||_t.defaultCode,
				msg : msg||_t.defaultMsg
			},"error").open(true);
		}
	}
	return Error;
});