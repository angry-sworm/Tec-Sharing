function StageBase() {

}

StageBase.Application = PIXI.Application,
StageBase.Container = PIXI.Container,
StageBase.loader = PIXI.loader,
StageBase.resources = PIXI.loader.resources,
StageBase.Graphics = PIXI.Graphics,
StageBase.TextureCache = PIXI.utils.TextureCache,
StageBase.Sprite = PIXI.Sprite,
StageBase.Text = PIXI.Text,
StageBase.TextStyle = PIXI.TextStyle;

function Example() {
    StageBase.call(this)
}

Example.prototype = Object.create(StageBase.prototype)
Example.prototype.constructor = Example

Example.prototype.init = function() {
    this.app = new StageBase.Application({ 
        width: 512, 
        height: 512,                       
        antialiasing: true, 
        transparent: false, 
        resolution: 1,
        backgroundColor: '0xff00ff'
      }
    );

    document.body.appendChild(this.app.view);

    this.algScene = new StageBase.Container();
    this.app.stage.addChild(this.algScene);
    this.layout();

    this.app.ticker.add(delta => this.tick(delta));
}

Example.prototype.layout = function() {

    let line = new StageBase.Graphics();
    line.lineStyle(4, 0xFFFF00, 1);
    line.moveTo(0, 0);
    line.lineTo(80, 50);
    line.x = 32;
    line.y = 32;
    this.algScene.addChild(line);

    var rectangle = new StageBase.Graphics();
    rectangle.name  = 'rec';
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, 64);
    rectangle.endFill();
    rectangle.x = 170;
    rectangle.y = 170;
    rectangle.pivot.x = 32;
    rectangle.pivot.y = 32;
    this.algScene.addChild(rectangle);

    let circle = new StageBase.Graphics();
    circle.name = "circle";
    circle.beginFill(0x9966FF);
    circle.drawCircle(0, 0, 32);
    circle.endFill();
    circle.x = 64;
    circle.y = 130;
    this.algScene.addChild(circle);

    var tip_style = new PIXI.TextStyle({  
        fontFamily: 'Arial',  //字体  
        fontSize: 20,         //字体大小  
        });  

    var tips = new PIXI.Text('tips', tip_style);
    tips.x = -10;  
    tips.y = -10;
    tips.name = 'tip'
    circle.addChild(tips);

    var style = new PIXI.TextStyle({  
        fontFamily: 'Arial',  //字体  
        fontSize: 36,         //字体大小  
        fontStyle: 'italic',  //字体类型（斜体）  
        fontWeight: 'bold',   //加粗  
        fill: ['#ffffff', '#00ff99'], //由上到下的过渡颜色  
        stroke: '#4a1850',    //文字边框颜色  
        strokeThickness: 5,   //文字边框粗细  
        dropShadow: true,     //阴影  
        dropShadowColor: '#000000', //阴影颜色  
        dropShadowBlur: 4,          //阴影模糊程度  
        dropShadowAngle: Math.PI / 6, //阴影角度  
        dropShadowDistance: 6,  //阴影距离  
        wordWrap: true,        //自动换行  
        wordWrapWidth: 440  
        });  

    var richText = new PIXI.Text('Hello, PIXI', style);  
    richText.x = 30;  
    richText.y = 180;
    richText.name = 'text'
    this.algScene.addChild(richText);
}

Example.prototype.tick = function() {
    let circle = this.algScene.getChildByName('circle');
    if (circle.y > 550 ) {
        circle.y = 0;
    }
    circle.y++;

    let t = this.algScene.getChildByName('text');
    if (t.x > 550 ) {
        t.x = 0;
    }
    t.x ++;

    let r = this.algScene.getChildByName('rec');
    if (r.rotation > Math.PI * 2 ) {
        r.rotation = 0;
    }
    r.rotation += 0.1;
}
