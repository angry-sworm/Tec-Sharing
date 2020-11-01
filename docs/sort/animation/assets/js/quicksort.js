var quickSort = {}
quickSort.step = -1;

quickSort.draw = function(event){
    console.log('drawing once ')
    var base_x = 0;
    var base_y = 0;
    painting.startDraw();

    var ectx = event.ectx
    if (ectx.pivot != null ) {
        var value = event.d[ectx.pivot]
        var point_from_x = base_x
        var point_from_y = config.ctx.height - value * config.heightBasePiexel() - config.textHeight - config.sidePadding - config.triangleHeight * 2;
    
        var point_to_x = config.ctx.width
        var point_to_y = config.ctx.height - value * config.heightBasePiexel() - config.textHeight - config.sidePadding - config.triangleHeight * 2
        painting.drawLine(point_from_x, point_from_y, point_to_x, point_to_y,  config.style.color()['search-refline']) 
    }

    for(var i in event.d){
        var point_x = base_x + config.sidePadding + (config.barWidth + config.gap()) * i;
        var bar_height = event.d[i] * config.heightBasePiexel();
        var point_y = config.ctx.height - bar_height - config.textHeight - config.sidePadding - config.triangleHeight * 2;

        var color = null
        if(i == ectx.left || i == ectx.right)
            color = i == ectx.left ? config.style.color()['search-left-border'] : config.style.color()['search-right-border'];
        else color = config.style.color()['search-default']

       if ( event.type == UIEvent.event_type.Attention && (i == ectx.leftAttention || i == ectx.rightAttention) ) {
            color = config.style.color()['search-attention'];
       }

        if(i == ectx.pivot) {
            painting.drawArrow(point_x + config.barWidth / 2, point_y - config.arrowHight , point_x + config.barWidth / 2, point_y, config.style.color()['search-mark-arrow'])
        }
        
        if( (i == ectx.leftAttention || i == ectx.rightAttention) &&  event.type == UIEvent.event_type.Attention ) {
            painting.drawBar(point_x, point_y, event.d[i], color, config.barWidth + config.barAttentionWidth)
        }
        else {
            painting.drawBar(point_x, point_y, event.d[i], color, config.barWidth)
        }
        
        painting.drawText(event.d[i], point_x ,  config.ctx.height - config.triangleHeight * 2 - config.sidePadding, config.style.color()['search-text'])

        if (i == ectx.startIndex || i == ectx.endIndex) {
            painting.drawTriangle(point_x + config.barWidth / 2, config.ctx.height - config.sidePadding - config.triangleHeight - config.textHeight , config.triangleHeight, config.style.color()['search-triangel'])
        }

        painting.drawText(i, point_x , config.ctx.height - config.sidePadding, config.style.color()['search-text'])
    }
}

quickSort.onLoad = function() {
    this.draw(
        UIEvent.buildEvent(UIEvent.event_type.Normal, rtd.list.slice(0), {})
    )
}

quickSort.partition = function(startIndex, endIndex) {
    console.log(startIndex + " " + endIndex );

    var qsc = {}

    items = rtd.getList()
    var pivot = items[startIndex];//取第一个元素为基准值
    qsc.pivot = startIndex;
    qsc.startIndex = startIndex
    qsc.endIndex = endIndex

    qsc.left = startIndex;
    qsc.right = endIndex;
    rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.CursorLMove, rtd.list.slice(0), JSON.parse(JSON.stringify(qsc))));

    while (true) {
        //从左往右扫描
        while (items[qsc.left] <= pivot && qsc.left <= qsc.right) {
            qsc.left++;
            rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.CursorLMove, rtd.list.slice(0), JSON.parse(JSON.stringify(qsc))));
        }

        //从右往左扫描
        while (pivot < items[qsc.right] && qsc.left <= qsc.right) {
            qsc.right--;
            rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.CursorRMove, rtd.list.slice(0), JSON.parse(JSON.stringify(qsc))));
        }

        //左右指针相遇
        if (qsc.left >= qsc.right) {
            break;
        }
        
        qsc.leftAttention = qsc.left
        qsc.rightAttention = qsc.right
        rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.Attention, rtd.list.slice(0), JSON.parse(JSON.stringify(qsc))));

        rtd.swap(qsc.left, qsc.right)

        rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.Swap, rtd.list.slice(0), JSON.parse(JSON.stringify(qsc))));
    }

    qsc.leftAttention = startIndex
    qsc.rightAttention = qsc.right
    rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.Attention, rtd.list.slice(0), JSON.parse(JSON.stringify(qsc))));

    rtd.swap(startIndex, qsc.right)

    rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.Swap, rtd.list.slice(0), JSON.parse(JSON.stringify(qsc))));
    
    return qsc.right;
}

quickSort.sort = function(left, right) {
    if ( right <= left) {
        return;
    }

    if (rtd.getList().length > 1) {
        index = this.partition(left, right);
        rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.PickPivot, rtd.list.slice(0), {}));

        this.sort(left, index - 1);
        this.sort(index + 1, right);
    }

    rtd.sortEvent.push(UIEvent.buildEvent(UIEvent.event_type.Normal, rtd.list.slice(0), {}));
}

quickSort.init = function() {
    if (rtd.sortEvent.length == 0) {
        this.sort(0, rtd.getList().length - 1 ); 
    } 
}

quickSort.forward = function() {
    if (this.step < rtd.sortEvent.length - 1) {
        this.draw(rtd.sortEvent[++this.step]);
    }
}

quickSort.backward = function() {
    if (this.step >= 1) {
        console.log("draw step" + this.step)
        this.draw(rtd.sortEvent[--this.step]);
    }
}

// 按钮事件-开始
quickSort.start = function(){
    this.init();

    this.ticker = setInterval(() => {
        this.forward()
    }, 10);           
}

// 按钮事件-暂停
quickSort.pause = function(){
    this.init()
    clearInterval(this.ticker);
}

// 按钮事件-下一步
quickSort.next = function(){
    this.init()
    clearInterval(this.ticker);
    this.forward();
}

// 按钮事件-上一步
quickSort.previous = function() {
    this.init()
    clearInterval(this.ticker);
    this.backward()
}

// 按钮事件-重置
quickSort.reset = function() {
    rtd.reset()
    this.step = -1
    clearInterval(this.ticker);
    this.ticker = -1
    this.draw(
        UIEvent.buildEvent(UIEvent.event_type.Normal, rtd.list.slice(0), {})
    )
}