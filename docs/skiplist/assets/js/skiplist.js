const GAP = 50;
const RADIUS = 30;
const MARGIN = 20;
const MAX_LEVEL = 10;
const FONT_SIZE = 20;
const LEVEL_RAND_RATIO = 0.5;
const DEFAULT_NODE_KEY_VALUE = -1;
const DEFAULT_NODE_LEVEL_VALUE = -1;

function SLNode(key, level) {
    this.key = (key == undefined) ? DEFAULT_NODE_LEVEL_VALUE : key;
    this.level = (level == undefined) ? -1 : level;
    this.head = false;
    this.tail = false;
    this.nexts = new Array(MAX_LEVEL);

    this.layerObjs = new Array(MAX_LEVEL);
    this.links = new Array(MAX_LEVEL);
    for(var i = 0; i < MAX_LEVEL; i++) {
        this.links[i] = {};
    }
}

function SkipList() {
    StageBase.call(this)
}

SkipList.prototype = Object.create(StageBase.prototype)
SkipList.prototype.constructor = SkipList
SkipList.debugging = false;

SkipList.prototype.init = function() {
    this.app = new PIXI.Application({ 
        width: 1024, 
        height: 768,                       
        antialiasing: true, 
        transparent: false, 
        resolution: 1,
        backgroundColor: '0xaaaaaa',
      }
    );
    document.body.appendChild(this.app.view);

    this.animationScene = new StageBase.Container();

    const viewport = new vp.Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000,
    
        interaction: this.app.renderer.plugins.interaction 
    });
 
    viewport.drag().pinch().wheel().decelerate(); 
    this.algScene = viewport;

    this.app.stage.addChild(this.algScene);
    this.app.stage.addChild(this.animationScene);

    this.objMgr = new ObjectManager();
    this.buildBase();

    this.app.ticker.add(delta => this.tick(delta));
}

SkipList.prototype.tick = function() {

}

SkipList.prototype.addElement = function(value) {
    this.insert(value);
    this.layout();
}

SkipList.prototype.process = function() {
    this.insert(31);
    this.insert(32);
    this.insert(330);
    this.insert(331);
    this.insert(332);
    this.insert(333);
    this.insert(334);
    this.insert(1000);
    
}

SkipList.prototype.locate = function(node) {
    for (var i = 0; i < MAX_LEVEL; i++) {
        var name = node.layerObjs[i];
        if (name != undefined) {
            let obj = this.objMgr.getObject(name);
            [obj.x, obj.y] = this.getPostion(node, i);
        }
    }
}

SkipList.prototype.getPostion = function(node, lv) {
    if ( node.head ) {
        return [
            MARGIN + RADIUS / 2,
            MARGIN + ( MAX_LEVEL - 1 - lv ) * (RADIUS + GAP)
        ];
    } else if (node.tail) {
        return [
            MARGIN + RADIUS / 2 + (this.count + 1) * (GAP + RADIUS),
            MARGIN + ( MAX_LEVEL - 1  - lv ) * (RADIUS + GAP)
        ];
    } else {
        // 位置统一使用layer0的索引进行定位
        let index = this.indexOf(node.key, 0);
        return [
            MARGIN + RADIUS / 2 + (index + 1 ) * (GAP + RADIUS),
            MARGIN + ( MAX_LEVEL - 1 - lv ) * (RADIUS + GAP)
        ];
    }
}

SkipList.prototype.buildBase = function() {
    this.max_level = 0;
    this.count = 0;

    // 构建起点
    let sln = new SLNode(DEFAULT_NODE_KEY_VALUE, MAX_LEVEL - 1);
    sln.head = true;
    this.head = sln;
    this.denoteMultiNode(MAX_LEVEL - 1, sln);
    
    // 构建终点
    sln = new SLNode(DEFAULT_NODE_KEY_VALUE, MAX_LEVEL - 1);
    sln.tail = true;
    this.denoteMultiNode(MAX_LEVEL - 1, sln);

    //连接
    for(var i = 0; i <=  MAX_LEVEL - 1; i++) {
        this.head.nexts[i] = sln;
    }
}

SkipList.prototype.keyExists = function(object, path) {
    var obj = object | this;

    var list = path.split('.');
    for(var i = 0; key = list[i]; i++) {
        if(!obj[key]) {
        return false;
        }
        obj = obj[key];
    }

    return true;
}

SkipList.prototype.denoteNode = function(level, node) {
    let c;
    if (node.tail) {
        c = this.buildCircle("T");
    } else if (node.head) {
        c = this.buildCircle("H");
    } else {
        c = this.buildCircle(node.key);
    }
    
    [c.x,c.y] = this.getPostion(node,level);
    node.layerObjs[level] = c.name;
    c.data = node;

    this.objMgr.addObject(c);
}

SkipList.prototype.undenoteNode = function(level, node) {
    this.disconnectNode(level, node);

    let obj = this.objMgr.getObject(node.layerObjs[level]);
    obj.parent.removeChild(obj);
    this.objMgr.removeObject(obj);
}

SkipList.prototype.disconnectNode = function(level, node) {
    let obj = this.objMgr.getObject(node.layerObjs[level]);

    let links = obj.links.slice();
    let length = links.length;
    for (var i = 0; i <= length - 1; i++) {
        links[i].emit("disconnect");
    }
}

SkipList.prototype.denoteMultiNode = function(totalLev, node) {
    for (var i = 0; i <= totalLev; i++) {
        this.denoteNode(i, node);
    }
}

/**
 * 插入数据
 * 
 * @param {int} key 
 */
SkipList.prototype.insert = function(key) {
    var p = this.head;
    var path = new Array(MAX_LEVEL);
    for (var i = this.max_level; i >= 0; i --) {
        while ( !p.nexts[i].tail && p.nexts[i].key < key) {
            p = p.nexts[i];
        }
        path[i] = p
    }

    var level = this.rand_level();
    var newer = new SLNode(key, level);
    this.denoteMultiNode(level, newer);

    if(path[0].nexts[0] != undefined && path[0].nexts[0].key == key) {
        return;
    } 

    for(var i = 0; i <= level; i ++) {
        let start = null;
        if (path[i] != undefined) {
           start = path[i];
        } else {
            //大于当前最大层的部分
            start = this.head; 
        }
        
        this.disconnectNode(i, start);
        newer.nexts[i] = start.nexts[i]
        start.nexts[i] = newer
    }

    if (level > this.max_level) {
        this.max_level = level
    }
    this.count++;

}

/**
 * 删除数据
 * 
 * @param {int} key 
 */
SkipList.prototype.delete = function(key) {
    var p = this.head;
    var path = new Array(MAX_LEVEL);
    for (var i = this.max_level; i >= 0; i --) {
        while ( !p.nexts[i].tail && p.nexts[i].key < key) {
            p = p.nexts[i];
        }
        path[i] = p
    }

    p = p.nexts[0]
    if (p.key == key) {
        for (var i = 0; i <= p.level; i++) {
            this.undenoteNode(i, p);
            path[i].nexts[i] = p.nexts[i];
        }

        for (var i = this.max_level; i >= 0; i--) {
            if (!this.head.nexts[i].tail) {
                this.max_level = i;
                break;
            } else {
                this.objMgr.getObject(this.head.layerObjs[i]).hide();
                this.objMgr.getObject(this.head.nexts[i].layerObjs[i]).hide();
            }
        }

        this.count--;
        if (this.count < 0) {
            this.count = 0;
        }
    }
}

/**
 * 查找数据
 * 
 * @param {int} key 
 */
SkipList.prototype.search = function(key) {
    var p = this.head;
    var path = [];
    for (var i = this.max_level; i >= 0; i --) {
        path.push([i,p]);
        while ( !p.nexts[i].tail && p.nexts[i].key < key) {
            p = p.nexts[i];
            path.push([i,p]);
        }
    }

    if (p.nexts[0].key == key) {
        for (var i = 0; i < path.length - 1; i++) {
            let current = path[i];
            let next = path[i+1];
            let sgnode = this.objMgr.getObject(current[1].layerObjs[current[0]]);
            let dgnode = this.objMgr.getObject(next[1].layerObjs[next[0]]);
            sgnode.selected();
            dgnode.selected();

            sgnode.emit("connectNode", dgnode);
        }
        let current = [0, p];
        let next = [0, p.nexts[0]];

        let sgnode = this.objMgr.getObject(current[1].layerObjs[current[0]]);
        let dgnode = this.objMgr.getObject(next[1].layerObjs[next[0]]);

        sgnode.selected();
        dgnode.selected();

        sgnode.emit("connectNode", dgnode);;

    } else {
        for (var i = 0; i < path.length - 1; i++) {
            let current = path[i];
            let next = path[i+1];
            let sgnode = this.objMgr.getObject(current[1].layerObjs[current[0]]);
            let dgnode = this.objMgr.getObject(next[1].layerObjs[next[0]]);
            sgnode.selected();
            dgnode.selected();

            sgnode.emit("connectNode", dgnode);
        }
        let current = [0, p];
        let next = [0, p.nexts[0]];

        let sgnode = this.objMgr.getObject(current[1].layerObjs[current[0]]);
        let dgnode = this.objMgr.getObject(next[1].layerObjs[next[0]]);

        sgnode.selected();

        sgnode.emit("connectNode", dgnode);;
    }
}

/**
 * 遍历数据
 */
SkipList.prototype.traverse = function() {
    var p = this.head.nexts[0]
    while ( !p.tail ) {
        console.log(p.key);
        p = p.nexts[0];
    }
}

/**
 * 寻找某个值在某个层的位置索引[0,N-1]，不包含HEAD和TAIL
 * 
 * @param {int} value 
 * @param {int} level 
 */
SkipList.prototype.indexOf = function(value, level) {
    var p = this.head.nexts[level];
    var index = 0;
    while ( p != undefined && p.key != value ) {
        p = p.nexts[level];
        index ++;
    }
    
    if (p == undefined || p.key != value ) {
        return -1;
    }

    return index
}

/**
 * 随机一个层
 */
SkipList.prototype.rand_level = function() {
    let level = 0;
    while (Math.random() < LEVEL_RAND_RATIO && level < MAX_LEVEL - 1) {
        level ++;
    }
    return level;
}

/**
 * 布局
 */
SkipList.prototype.layout = function() {
    for (var i = this.max_level; i >= 0; i --) {
        var p = this.head;

        this.locate(p);
        this.objMgr.getObject(p.layerObjs[i]).normal().show();
        //console.log("H", this.objMgr.getObject(p.layerObjs[i]).x, this.objMgr.getObject(p.layerObjs[i]).y, p.layerObjs[i], p.key, i);

        while (true) {
            if ( !p.nexts[i].tail ) {
                this.locate(p.nexts[i]);
                this.objMgr.getObject(p.nexts[i].layerObjs[i]).normal().show();
                this.objMgr.getObject(p.layerObjs[i]).emit("connectNode", this.objMgr.getObject(p.nexts[i].layerObjs[i]));

                //console.log('D', this.objMgr.getObject(p.nexts[i].layerObjs[i]).x, this.objMgr.getObject(p.nexts[i].layerObjs[i]).y, p.nexts[i].layerObjs[i], p.key, i);

                p = p.nexts[i];
                this.locate(p);
            } else {
                this.locate(p.nexts[i]);
                this.objMgr.getObject(p.nexts[i].layerObjs[i]).normal().show();
                this.objMgr.getObject(p.layerObjs[i]).emit("connectNode", this.objMgr.getObject(p.nexts[i].layerObjs[i]));

                //console.log("T", this.objMgr.getObject(p.nexts[i].layerObjs[i]).x, this.objMgr.getObject(p.nexts[i].layerObjs[i]).y, p.nexts[i].layerObjs[i], p.key, i);
                break;   
            }
        }
    }

    var cp = this.head;
    while ( cp != undefined ) {
        let level = cp.level;
        if (cp.head || cp.tail) {
            level = this.max_level;
        }

        if (level > 0) {
            for (var i = level; i > 0; i--) {
                this.objMgr.getObject(cp.layerObjs[i]).emit("connectNode", this.objMgr.getObject(cp.layerObjs[i - 1 ]));
            }
        }
        cp = cp.nexts[0];
    }
}

/**
 * 构建可视化节点
 * 
 * @param {int} value 
 */
SkipList.prototype.buildCircle = function(value) {
    let circle = new GNode(this.algScene, Udid.getId(), RADIUS);
    circle.beginFill(0xffffff);
    circle.lineStyle(1, 0x000000, 1);
    circle.drawCircle(0, 0, circle.radius);
    circle.endFill();

    var tip_style = new PIXI.TextStyle({  
        fontFamily: 'Arial',  //字体  
        fontSize: FONT_SIZE,  //字体大小  
        });  

    var vText = new PIXI.Text(value, tip_style);
    vText.x = 0 - vText.width/2;  
    vText.y = 0 - vText.height/2; 
    circle.addChild(vText);
    
    return circle;
} 

SkipList.prototype.selectCircle = function(circle) {
    circle.lineStyle(1, 0xFF00FF, 1);
}

SkipList.prototype.resetCircle = function(circle) {
    circle.lineStyle(1, 0xFF00FF, 1);
}

SkipList.prototype.selectLink = function(link, width) {

}

SkipList.prototype.resetLink = function(link) {

}

SkipList.prototype.pathAnimate = function(paths) {

}
