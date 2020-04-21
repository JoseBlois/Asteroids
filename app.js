(function(){
var canvas =null,ctx = null;
var lastPress=null;
var KEY_LEFT=37,KEY_UP=38,KEY_RIGHT=39,KEY_DOWN=40,KEY_SPACE=32;
var pressing=[];
var player  = new Circle(150,100,5);
var speed=0,k=0.5;
var ship_img = new Image();
var spriteSheet = new Image();
var aTimer=0;
var shots = [];
var track = 0;
var enemies = [];

function random(max){
    return ~~(Math.random()*max);
}
function enableInputs(){
    document.addEventListener('keydown',function(evt){
        lastPress=evt.which;
        pressing[evt.which]=true
    },false);
    document.addEventListener('keyup',function(evt){
        pressing[evt.which]=false;
    },false);
}

function init(){
    canvas= document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width=300;
    canvas.height=200;

    console.log('se ha iniciado')

    ship_img.src='assets/spaceShip.png';
    spriteSheet.src = 'assets/sprite_sheet.png';

    enableInputs();
    run()
    repaint()
}
function repaint(){
    window.requestAnimationFrame(repaint);
    paint(ctx);
}
function paint(ctx){
    ctx.fillStyle='#000'
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#fff';
    ctx.fillText('Speed: '+player.speed.toFixed(1),0,10);
    ctx.strokeStyle='#0f0';
    if(pressing[KEY_UP]){
    player.drawImageArea(ctx,spriteSheet,(~~(aTimer*10)%3)*10,0,10,10);   
    }
     else player.drawImageArea(ctx,spriteSheet, 0,0,10,10);
    for(var i = 0,l=shots.length;i<l;i++){
        shots[i].drawImageArea(ctx,spriteSheet,30,(~~(aTimer*10)%2)*5,5,5);
    }
}
function act (){
    // speed =0;
    if(pressing[KEY_DOWN]){
        if(player.speed>-5){
            player.speed--;
        }
    }
    if(pressing[KEY_UP]){
        if(player.speed<5){
            player.speed++;
        }
    }
    if(pressing[KEY_RIGHT]){
        player.rotation+=10
    }
    if(pressing[KEY_LEFT]){
        player.rotation-=10;
    }
    if(pressing[KEY_SPACE] && track ===10){
        var s = new Circle(player.x,player.y,2.5);
        s.speed = player.speed+10;
        s.rotation=player.rotation;
        s.timer=15;
        shots.push(s);
        console.log('shot')
        track=0;
    }else{
        if(track<10){
            track+=5;
        }
    }
    for(var i = 0,l=shots.length;i<l;i++){
        shots[i].timer--
        if(shots[i].timer<=0){
            shots.splice(i--,1)
            l--;
            continue
        }
    shots[i].move((shots[i].rotation-90)*Math.PI/180,shots[i].speed)
    // shots[i].move((shots[i].rotation-90)*Math.PI/180,shots[i].speed);
    }
    //ENEMIES MANAGEMENT
    if(enemies.length<1){
        for (var p = 0 ; p<3;p++){
            var e = new Circle();
        }
    }

    if(player.x<0){
        player.x=canvas.width;
    }
    if(player.x >canvas.width){
        player.x=0;
    }
    if(player.y<=0+player.radius*2){
        player.y=0+player.radius*2;
    }
    if(player.y >=canvas.height-player.radius*2){
        player.y=canvas.height-player.radius*2;
    }
    player.move((player.rotation-90)*Math.PI/180,player.speed);//player.move((player.rotation-90)*Math.PI/180,player.speed);

    //TIMER
    aTimer++
    if(aTimer>3600){
        aTimer-=3600;
    }
}
function run (){
    setTimeout(run,50)
    act()
}
window.addEventListener('load',function(){
    init();
},false)
//function Circle
function Circle(x,y,radius){
    this.x = (x === null)?0:x;
    this.y = (y === null)?0:y;
    this.radius = (radius ===null)?0:radius;
    this.scale=1;
    this.timer;
    this.rotation=0;
    this.speed=0;
}
Circle.prototype.fill = function(ctx){
    ctx.beginPath()
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
    ctx.fill();
};
Circle.prototype.draw = function(ctx){
    ctx.beginPath()
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
    ctx.stroke();
}
Circle.prototype.distance=function(circle){
    if(circle!=null){
        var dx=this.x-circle.x;
        var dy=this.y-circle.y;
        return(Math.sqrt(dx*dx+dy*dy)-(this.radius+circle.radius));}
    };
Circle.prototype.drawImage = function (ctx,img){
    if(img.width){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.scale(this.scale,this.scale);
        ctx.rotate(this.rotation*Math.PI/180);
        ctx.drawImage(img,-img.width/2,-img.height/2);//SE PUEDE PONER ESTO PORQUE HICISTE EL TRANSLATE ANTES.
        ctx.restore();
    }else this.stroke(ctx)
};
Circle.prototype.move = function (angle,speed){
    if(speed != null){
    this.x+=Math.cos(angle)*speed;
    this.y+=Math.sin(angle)*speed;
    }
};
Circle.prototype.getAngle = function(circle){
    if(circle!=null){
        return (Math.atan2(circle.y-this.y,circle.x-this.x));
    }
};
Circle.prototype.drawImageArea = function(ctx,img,sx,sy,sw,sh){
    if(img.width){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.scale(this.scale,this.scale);
        ctx.rotate(this.rotation*Math.PI/180);
        ctx.drawImage(img,sx,sy,sw,sh,-this.radius,-this.radius,this.radius*2,this.radius*2);
        ctx.restore();
    }else this.stroke(ctx)
}
window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback,17);
            };
    }());

})()