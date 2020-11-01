var config = {}

config.ctx = {}
config.ctx.width = 1024;
config.ctx.height = 480;

// 数值的高度像素基础值
config.heightBasePiexel = function() {
    return 10;
}
// 边间隔
config.sidePadding = 10;

//barWidth
config.barWidth = 10;
config.barAttentionWidth = 5;
//柱间隔
config.gap = function() {
    return 10;
}

config.textHeight = 10

config.arrowHight = 30;
config.arrowColor = 'green';

config.triangleHeight = 10;

config.style = {}
config.style.color = function() {
    return {
        "search-default" : "#6495ED",//"blue", 
        "search-left-border": "#BDB76B",
        "search-right-border": "#808000",
        "search-pivot": "#FF1493",
        "search-attention": "orange",
        "search-refline": "green",
        "search-mark-arrow": "green",
        "search-triangel": "red",
        "search-text": "black"
    }
}



