define(["jquery","common"],function($,Common){
	function Filmmaker(){
		this.ejs = "views/filmmaker/main";
		this.cssPath = ["framework/styles/filmmaker.css"];
		EJS.cache=false;
	}
	
	Filmmaker.prototype={
		init:function(){
			var _t = this;
			this.startnum = 0;
			this.picServer = "http://10.199.202.23:20010/uploadServer/";
			
			Common.req("filmserver.selectallfilmmakers",{startnum:this.startnum},function(data){
				data.picServer = _t.picServer;
				Common.panel.add(_t.ejs,data,"filmmaker").open(true);
				
				$(".moreimage p").unbind("click").bind("click",function(){
					_t.startnum+=9;
					_t.loadMoreData(_t.startnum);
				});
			});
		},
		loadMoreData:function(startnum){
			var _t = this;
			Common.req("filmserver.selectallfilmmakers",{startnum:startnum},function(data){
				data.picServer = _t.picServer;
				if(data.data.length>0){
					var html = new EJS({url:"framework/views/filmmaker/item"}).render(data);
					$(".moreimage").before(html);
				}else{
					$(".moreimage p").unbind("click").text("没有更多了");
				}
			});
		}
	}
	
	return Filmmaker;
});