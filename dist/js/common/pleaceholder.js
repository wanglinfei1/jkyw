var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //修复
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.attr('placeholder','');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), paddingleft = self.css('padding-left');
            var holder = $('<span class="PholderSpan"></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top+8, paddingLeft:paddingleft,width:'100%'}).appendTo(self.parent());
            if(self.val()){
                $(".PholderSpan").hide();
            }
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
jQuery(function(){
    JPlaceHolder.init();
});