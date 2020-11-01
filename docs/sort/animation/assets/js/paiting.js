var painting = {}
painting.context = null

painting.setContext = function (ctx) {
    context = ctx
}

painting.drawLine = function (xFrom, yFrom, xTo, yTo, color) {
    context.beginPath();
    context.moveTo(xFrom, yFrom);
    context.lineTo(xTo, yTo);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
}
/**
 * 绘制等边三角形
 * x,y是最上面的定点的位置
 */
painting.drawTriangle = function(x,y,height, color) {
    ctx.beginPath();
    var height = height*Math.sin(Math.PI/3);
    ctx.moveTo(x,y); 
    ctx.lineTo(x - (Math.sqrt(3)/3)*height, y + height);
    ctx.lineTo(x + (Math.sqrt(3)/3)*height, y + height);
    ctx.lineTo(x,y);
    ctx.fillStyle= color;
    ctx.fill();
    ctx.closePath();
}

painting.drawText = function(x, y, value, color) {
     context.font = "serif";
     context.fillStyle = color;
     context.fillText(x,y,value);
}

painting.drawBar = function(x, y, value, color, width) {
    ctx.beginPath();
    ctx.fillStyle = color
    ctx.lineCap = 'round';
    var bar_hight = value * config.heightBasePiexel()
    ctx.fillRect(x, y, width, bar_hight);

    ctx.closePath();
}

painting.drawArrow = function(fromX, fromY, toX, toY, color) {
    var headlen = 10;
    var theta = 45;
    var arrowX, arrowY;

    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
    var angle1 = (angle + theta) * Math.PI / 180;
    var angle2 = (angle - theta) * Math.PI / 180;
    var topX = headlen * Math.cos(angle1);
    var topY = headlen * Math.sin(angle1);
    var botX = headlen * Math.cos(angle2);
    var botY = headlen * Math.sin(angle2);
    ctx.beginPath();

    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);

    arrowX = toX + topX;
    arrowY = toY + topY;

    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);

    arrowX = toX + botX;
    arrowY = toY + botY;

    ctx.lineTo(arrowX, arrowY);
    
    ctx.strokeStyle = color;
    ctx.stroke();
}

painting.startDraw = function() {
    this.clearCanvas();
}

painting.endDraw = function() {
    
}

painting.clearCanvas = function (){
    context.clearRect(0, 0, cvs.width, cvs.height);
}