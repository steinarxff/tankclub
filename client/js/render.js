/*

    Work in progress

 */

var render = function(){
    return {
        renderer: false,
        manager: false,
        border: false,
        stage: false,
        dot: false,
        objects: [],

        init: function(){
            this.renderer = PIXI.autoDetectRenderer(
                r("screen.height"), r("screen.height"),
                {
                    antialias: true,
                    transparent: false,
                    resolution: 1
                }
            );

            this.manager = new PIXI.interaction.InteractionManager(this.renderer);

            this.renderer.view.style.display = "block";
            this.renderer.view.style.margin = "0 auto";

            document.body.appendChild(this.renderer.view);

            this.drawStage();
            
            this.animate = this._animate.bind(this);

            this.animate();
        },

        drawStage: function(){
            var me = this;

            me.stage = new PIXI.Container();
            me.stage.interactive = true;
            
            me.border = new PIXI.Graphics();
            me.border.beginFill(0xffffff);
            me.border.lineStyle(2, 0x000000, 1);
            me.border.drawRect(0,0,r("screen.height"),r("screen.height"));
            me.border.endFill();
            me.addObject(me.border);


        },

        addPlayer: function(){
            var me = this, texture = PIXI.Texture.fromImage('resources/tank-green.gif');

            me.tank = new PIXI.Sprite(texture);

            me.tank.scale.x = me.tank.scale.y = r("screen.height") / r("player.scaleValue");
            me.tank.anchor.x = me.tank.anchor.y = 0.5;

            me.tank.position.y = r("screen.height") / 2;
            me.tank.position.x = r("screen.height") / 2;

            me.stage.addChild(me.tank)

            me.objects.push(me.tank);
            return me.tank;
        },


        _animate: function(){
            if(this.objects.length > 0){
                this.objects[0].handler.nudge.call(this.objects[0].handler);
            }
            this.renderer.render(this.stage);
            requestAnimationFrame(this.animate);           
        },

        removeObject: function(obj){
            this.stage.removeChild(obj);
        },

        addObject: function(obj){
            this.stage.addChild(obj);
        }
    }
}();