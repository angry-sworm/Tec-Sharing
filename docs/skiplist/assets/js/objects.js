GObject = function(scene, name) {
    StageBase.Graphics.call(this);

    this.scene = scene;
    this.name = name;
}

GObject.prototype = Object.create(StageBase.Graphics.prototype);
GObject.prototype.constructor = GObject;

GObject.prototype.show = function() {
    this.scene.addChild(this);
}

GObject.prototype.hide = function() {
    this.scene.removeChild(this);
}

GObject.prototype.randStringColor = function() {
    let color =  '#'+ this.randColor().toString(16);
    return color;
}


GObject.prototype.randColor = function() {
    return Math.floor(Math.random()*0xffffff)
}

GNode = function(scene, name, radius) {
    GObject.call(this, scene, name);
    this.radius = radius
    this.links = new Array();
    this.highlight = false;
    this.on("connectNode", this.connect);
}
GNode.prototype = Object.create(GObject.prototype);
GNode.prototype.constructor = GNode;

GNode.prototype.connect = function(node) {
    let length = this.links.length;
    for (var i = 0; i < length; i++) {
        if (this.links[i].dst == node) {
            this.links[i].emit("disconnect");
            break;
        }
    }

    let from = {}, to = {};
    let r = Math.atan2(node.y - this.y, node.x - this.x);

    from.y = this.y + this.radius * Math.sin(r);
    from.x  = this.x + this.radius * Math.cos(r);

    to.y = node.y - node.radius * Math.sin(r);
    to.x = node.x - node.radius * Math.cos(r);

    let line = new GLink(this.scene, Udid.getId(), this, node);
    if (this.highlight && node.highlight) {
        line.lineStyle(4, 0x368AE3, 0.5);
    } else {
        line.lineStyle(2, 0x000000, 1);
    }
    
    line.moveTo(from.x, from.y);
    line.lineTo(to.x, to.y);

    this.links.push(line);
    node.links.push(line);

    this.scene.addChild(line);

    if (SkipList.debugging) {
        var so = this.data.head ?  "H" : (this.data.tail ? "T" : this.data.key);
        let doo = node.data.head ?  "H" : (node.data.tail ? "T" : node.data.key);
    
        var tip_style = new PIXI.TextStyle({  
            fontFamily: 'Arial',  //字体  
            fontSize: 10,  //字体大小  
            });  
    
        var vText = new PIXI.Text(so + '-' + doo, tip_style);
        vText.x = from.x;  
        vText.y = from.y 
        line.addChild(
            vText
        );
    
        console.log("LINK", so, doo, line.name);
    }
 
}

GNode.prototype.hide = function() {
    for (var i = 0; i < this.links.length; i++) {
        this.scene.removeChild(this.links[i]);
    }
    this.links = new Array();

    this.scene.removeChild(this);
}
GNode.prototype.selected = function() {
    this.clear();
    this.beginFill(0xCB2FFA);
    this.lineStyle(1, 0x000000, 1);
    this.drawCircle(0, 0, this.radius);
    this.endFill();
    this.alpha = 0.5;
    this.highlight = true;
    return this;
}
GNode.prototype.normal = function() {
    this.clear();
    this.beginFill(0xffffff);
    this.lineStyle(1, 0x000000, 1);
    this.drawCircle(0, 0, this.radius);
    this.endFill();
    this.alpha = 1;
    this.highlight = false;
    return this;
}


GLink = function(parent, name, src, dst) {
    GObject.call(this, parent, name);
    this.src = src;
    this.dst = dst;
    this.on("disconnect", this.disconnect);
}
GLink.prototype = Object.create(GObject.prototype);
GLink.prototype.constructor = GLink;
GLink.prototype.disconnect = function() {
    let src = this.src;
    let dst = this.dst;
    if (this.parent != undefined) {
        this.parent.removeChild(this);
    }
    src.links.splice(src.links.indexOf(this), 1);
    dst.links.splice(dst.links.indexOf(this), 1);

    if (SkipList.debugging) {
        console.log("UNLINK", src.data.head ?  "H" : (src.data.tail ? "T" : src.data.key), dst.data.head ?  "H" : (dst.data.tail ? "T" : dst.data.key), this.name);
    }
}

ObjectManager = function() {
    this.objects = new Map;
}

ObjectManager.prototype.addObject = function(obj) {
    this.objects[obj.name] = obj;
}

ObjectManager.prototype.removeObject = function(name) {
    this.objects.delete(name);
}

ObjectManager.prototype.getObject = function(name) {
    return this.objects[name];
}
ObjectManager.prototype.tick = function() {
    
}
