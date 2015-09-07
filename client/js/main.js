


var dispatch = function(){
    var listeners = [];
    return {
        listen: function (event, fn) {
            if(!event.push){
                event = [event];
            };


            for(var s = 0; s < event.length; s++){
                if (!listeners[event[s]]) {
                    listeners[event[s]] = [];
                }

                listeners[event[s]].push(fn);
            }
        },

        fire: function (event) {
            if (listeners[event]) {
                for (var s = 0; s < listeners[event].length; s++) {
                    if (typeof listeners[event][s] == "function") {
                        listeners[event][s](event);
                    }
                }
            }
        }
    }
}();

var player = function () {
    var direction = 0,
        accelerating = 0,
        turning = 0,
        rotation = 0,
        speed = 0,

        weight = r("player.weight"),
        baseWeight = r("base.weight"),
        weightRatio = weight / baseWeight,

        engine = r("player.engine"),
        baseEngine = r("base.engine"),
        engineRatio = engine / baseEngine,

        maxSpeed = r("player.maxSpeed"),
        baseMaxSpeed = r("base.maxSpeed"),
        maxSpeedRatio = maxSpeed / baseMaxSpeed,

        turningSpeed = r("player.turningSpeed"),
        baseTurningSpeed = r("base.turningSpeed"),
        turningSpeedRatio = turningSpeed / baseTurningSpeed,

        //enginePower = r("player.enginePower"),
        //ratio = enginePower / weight,
        //ratio = ratio * ratio,
        //maxSpeed = r("baseSpeed") + (r("baseSpeed") * Math.pow(ratio,2)),
        //acceleration = ratio*en..ginePower  / FPS,
        //accelaration = ()/();
        //turningSpeed = Math.pow((1+ratio),5) / FPS,
        smoothing = r("smoothing"),
        element = false,
        target = {
            x: 0,
            y: 0,
            rotation: 0
        };

    return {

        setElement: function(k){
            k.handler = this;
            element = k;
            target.x = k.position.x;
            target.y = k.position.y;
            target.rotation = k.rotation;
        },

        handle: function (k) {
            switch (k) {
                case "+up":
                case "-up":
                    accelerating = k=="+up"?1:0;
                    break;

                case "+down":
                case "-down":
                    accelerating = k=="+down"?-1:0;
                    break;
                case "+left":
                case "-left":
                    turning = k=="+left"?1:0;
                    break;
                case "+right":
                case "-right":
                    turning = k=="+right"?-1:0;
                    break;
            }
        },

        tick: function () {
            this.calc();
            this.update();
        },

        calc: function(){
            if(accelerating == 1){
                // moving forward
                if(speed < maxSpeed) {
                    // accelerating
                    //speed += ((acceleration*(1+ratio)) + ((maxSpeed-speed))/FPS);
                    speed += ((maxSpeed - speed)/FPS) * engineRatio;
                }else if(speed >= maxSpeed){
                    // at top speed
                    speed = maxSpeed;
                }
            }else if(accelerating == 0){
                // no acceleration
                var t;
                if(speed > 0) {
                    t = 1;
                    // speed is positive
                    speed = speed - ((speed/FPS)*weightRatio * 2 * weightRatio);
                }else if(speed < 0){
                    // speed is negative;
                    t = -1;
                    speed = speed + ((Math.abs(speed)/FPS)*weightRatio * 2 * weightRatio);
                }

                // shifted from positibe to negative speed or vice versa
                if(speed > 0 && t == -1 || speed < 0 && t == 1){
                   speed = 0;
                }
            }else if(accelerating == -1){
                if(speed > -maxSpeed) {
                    speed -= ((maxSpeed-Math.abs(speed))/FPS)*weightRatio * 2 * maxSpeedRatio;
                }else if(speed <= -maxSpeed) {
                    speed = -maxSpeed
                }
            }


            if(turning == 1){
                target.rotation -= turningSpeedRatio / FPS;
            }else if(turning == -1){
                target.rotation += turningSpeedRatio / FPS;
            }
        },

        nudge: function(){
            element.rotation += (target.rotation - element.rotation)/smoothing;
            element.position.x += (target.x - element.position.x)/smoothing;
            element.position.y += (target.y - element.position.y)/smoothing;
        },

        update: function(){
            target.x = element.position.x + (speed * Math.cos(element.rotation));
            target.y = element.position.y + (speed * Math.sin(element.rotation));
        }
    }
}();

var main = {

    init: function () {
        render.init();
        player.setElement(render.addPlayer());


        keyboard(dispatch);
        dispatch.listen(["+up","-up","+left","-left","+down","-down","+right","-right"  ], player.handle.bind(player));


        setInterval(function(){
            player.tick.apply(player);
        }, r("fps"));
    }
};

/*

 Work in progress

 */
/*


 var main = function () {
 return {
 websocket: false,
 lastShot: 0,
 objects: [],
 lookup: [],

 init: function () {
 var me = this;
 render.init();
 var host = window.document.location.host.replace(/:.*!/, '');
 me.websocket = new WebSocket('ws://' + host + ':9999');
 me.websocket.onopen = function () {
 me.websocket.send('hello');
 };

 me.websocket.onmessage = me.onMessage.bind(me);
 me.websocket.onclose = me.onClose.bind(me);
 keyboard(me.websocket);
 me.setupShot();
 },

 setupShot: function () {
 var me = this;

 render.stage.on('mousedown', function (event) {
 if (((new Date()).getTime() - me.lastShot) > 100) {
 var pos = event.data.getLocalPosition(render.stage);
 me.websocket.send('+shot:' + (pos.x - (RULES.SCREEN_WIDTH / 2)) + ":" + (pos.y - (RULES.SCREEN_HEIGHT / 2)));
 me.lastShot = (new Date()).getTime();
 }
 });
 },

 onClose: function () {

 },

 onMessage: function (e) {
 var obj = JSON.parse(e.data);

 switch (obj.type) {
 case "wake":
 render.setSepia(0);
 break;
 case "hit":
 render.setSepia(1);
 break;
 case "score":
 this.log('<div class="circle" style="background-color: #' + obj.data.shooter + ';"></div> <span style="float: left; padding: 0 5px 0 3px;"> < </span> <div class="circle" style="background-color: #' + obj.data.target + ';"></div>');
 break;
 case "stats":
 this.updateScore(obj.data);
 break;
 case "state":
 var k;

 for (var s = 0; s < obj.data.length; s++) {
 k = this.lookup[obj.data[s].id];
 k.read.call(k, obj.data[s]);

 if (k.self) {
 this.selfProcess(k);
 }
 };
 break;

 case "+self":
 obj.data.self = true;
 case "+object":
 var player = this.addObject(obj.data);
 break;
 case "-object":
 var k = this.lookup[obj.data.id];
 k.read.call(k,obj.data);
 break;
 }
 },

 addObject: function (conf) {
 var obj;

 if (conf.type == "player") {
 obj = new Player(conf);
 this.tag(' has joined', String("#" + obj.color.value));
 }
 if (conf.type == "shot") {
 obj = new Shot(conf);
 }

 this.objects.push(obj);
 this.lookup[obj.id] = obj;
 render.addObject.call(render, obj.get.call(obj));
 return obj;
 },

 selfProcess: function (obj) {
 document.getElementById('progress').value = obj.fuel;
 document.getElementById('shots').innerHTML = obj.shots;
 },

 updateScore: function(arr){
 var t = "";

 for(var s = 0; s < arr.length; s++){
 t += '<div class="circle big" style="background-color: #' + arr[s].color + ';"></div><div class="score">' + arr[s].score + '</div><br>';
 }

 document.getElementById('stats').innerHTML = t;
 },

 tag: function (t, c) {
 this.log('<div class="circle" style="background-color: ' + c + ';"></div>' + t);
 },

 log: function (t) {
 document.getElementById('log').innerHTML = t + "<br>" + document.getElementById('log').innerHTML;
 }
 }
 */
//}();