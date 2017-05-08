;(function ($, window, document, undefined) {/*jquery,window,document*/
    var initDate = {
        pageNo: 1,
        totalPage: 1,
        callback: function () {
        }
    };
    /*创建一个paging类*/
    function Paging(element, options) {
        this.element = element;
        this.options = options = $.extend(initDate, options || {});
        this.init();
    }

    Paging.prototype = {
        constructor: Paging,
        init: function () {
            this.creatHtml();
            this.bindEvent();
        },
        /*创建结构*/
        creatHtml: function () {
            var me = this;
            var content = "";
            var current = me.options.pageNo;//当前页数
            var total = (me.options.totalPage);//总页数

            content += "<a><</a>";
            if (total > 7) {
                if (current < 4) {
                    for (var i = 1; i < 7; i++) {
                        if (current == i) {
                            content += "<a class='active'>" + i + "</a>";
                        } else {
                            content += "<a>" + i + "</a>";
                        }
                    }
                    content += "<i>...</i>";
                    content += "<a>" + total + "</a>";
                } else {
                    if (current < total - 3) {
                        content += "<a name='1' type='button' class='page num'>1</a>";
                        content += "<i>...</i>";
                        for (var i = current - 2; i < current + 3; i++) {
                            if (current == i) {
                                content += "<a class='active'>" + i + "</a>";
                            } else {
                                content += "<a>" + i + "</a>";
                            }
                        }
                        content += "<i>...</i>";
                        content += "<a>" + total + "</a>";
                    } else {
                        content += "<a>1</a>";
                        content += "<i>...</i>";
                        for (var i = total - 5; i < total + 1; i++) {
                            if (current == i) {
                                content += "<a class='active'>" + i + "</a>";
                            } else {
                                content += "<a>" + i + "</a>";
                            }
                        }
                    }
                }
            } else {
                for (var i = 1; i < total + 1; i++) {
                    if (current == i) {
                        content += "<a class='active'>" + i + "</a>";
                    } else {
                        content += "<a>" + i + "</a>";
                    }
                }
            }
            content += "<a>></a>";
            content += "<div>"
            content += "共" + total + "页";
            content += "  &nbsp;&nbsp; 到第 ";
            content += "<input class='JtextBar' max='3' maxlength='3' value='" + current + "' type='text' />";
            content += " 页 ";
            content += "<span class='PageGo'>Go</span>";
            content += "</div>"

            me.element.html(content);
        },
        /*绑定事件*/
        bindEvent: function () {
            var me = this;
            me.element.off('click').on('click', 'a', function () {
                var num = $(this).html();
                if (num == "&lt;") {
                    if (me.options.pageNo == 1)return;
                    me.options.pageNo = +me.options.pageNo - 1;/*console.log(me.options.pageNo)*/
                } else if (num == "&gt;") {
                    if (me.options.pageNo == me.options.totalPage)return;
                    me.options.pageNo = +me.options.pageNo + 1;/*console.log(me.options.pageNo)*/
                } else {
                    me.options.pageNo = +num;
                }
                me.creatHtml();
                me.options.callback&&me.options.callback();
            });
            me.element.on('click', 'span', function () {
                var ipt = +me.element.find('input').val();
                if (ipt && ipt <= me.options.totalPage && ipt != me.options.pageNo) {
                    me.options.pageNo = ipt;
                }
                me.creatHtml();
                me.options.callback&&me.options.callback();
            })
        }
    };
    $.fn.paging = function (options) {
        options = $.extend(initDate, options || {});
        return new Paging($(this), options);
    }
})(jQuery, window, document);

