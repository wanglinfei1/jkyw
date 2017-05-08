function Percent(dom,ratio,total) {
    this.ctx = dom.getContext('2d');
    this.ratio=ratio;
    this.total=total;
    this.dom_total = JSON.parse(dom.getAttribute('data-total'));
    this.domN = this.dom_total.num;
    this.unit = this.dom_total.unit;
    this.proressColor = this.dom_total.color;
    this.fontColor = this.dom_total.fontColor;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    this.r = this.width / 2;
    this.ctx.translate(this.r, this.r);
    this.begin = -1;
    this.num = 0;
    this.flag = (this.domN - 50) * 0.02;
    var that=this;
    this.timer = setInterval(function () {
        that.drawRad();
    }, 30);
}
Percent.prototype.drawBackground = function () {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.r - 10, 0, 2 * Math.PI, false);
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = "#F5F5F5";
    this.ctx.stroke();
}
Percent.prototype.drawRad = function () {
    this.ctx.clearRect(-this.r, -this.r, this.width, this.height);
    this.drawBackground();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.r - 10, -1 * Math.PI, (this.begin + 0.02) * Math.PI, false);
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = this.proressColor;
    this.ctx.stroke();
    this.ctx.font = "36px normal PingFangSC-Regula";
    this.ctx.fillStyle = this.proressColor;
    this.ctx.textAlign = "center";

    if (Math.round(this.num * (this.ratio / 100)) <= this.total) {
        this.ctx.fillText(Math.round(this.num * (this.ratio / 100)), 0, -2);
    } else {
        this.ctx.fillText(this.total, 0, -2);
    }
    this.ctx.font = '20px normal PingFangSC-Regular';
    this.ctx.fillStyle = this.fontColor;
    this.ctx.fillText(this.unit, 0, 24);
    this.drawCircular();
    if (this.begin >= this.flag) {
        this.begin = this.flag;
        clearInterval(this.timer);
        return false;
    }
    this.ctx.closePath();
    this.num++;
    this.begin += 0.02;
}
Percent.prototype.drawCircular = function () {
    //顶端小圆
    var x = -(this.r - 10) * Math.cos(2 * Math.PI / 100 * this.num + 0.02);
    var y = -(this.r - 10) * Math.sin(2 * Math.PI / 100 * this.num + 0.02);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, 7, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = this.proressColor;
    this.ctx.shadowColor = this.proressColor;
    this.ctx.shadowBlur = 7;
    this.ctx.fill();
    this.ctx.restore();
}