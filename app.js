(function(){
var canvas =null,ctx = null;
var lastPress=null;
var KEY_LEFT=37,KEY_UP=38,KEY_RIGHT=39,KEY_DOWN=40,KEY_SPACE=32,KEY_ENTER=13;
var pressing=[];
var player  = new Circle(150,100,5);
var speed=0,k=0.5;
var score=0;
var spriteSheet = new Image();
var background = new Image();
var aTimer=0;
var shots = [];
var track = 0;
var enemies = [];
var explotion =[];
var lives =3;
var pause=true;

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
function playerReset(){
    player.x=canvas.width/2;
    player.y=canvas.height/2;
    player.rotation=0;
    player.speed=0;
}
function init(){
    canvas= document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width=300;
    canvas.height=200;

    console.log('se ha iniciado')

    spriteSheet.src = 'assets/sprite_sheet.png';
    background.src='assets/nebula2.jpg';

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
    // ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(background,0,0)
    ctx.fillStyle='#fff';
    ctx.fillText('Speed: '+player.speed.toFixed(1),0,10);
    ctx.fillText('Score: '+score,0,20);
    ctx.strokeStyle='#0f0';
    if(player.timer<21&&player.timer%2==0){
    if(pressing[KEY_UP]){
    player.drawImageArea(ctx,spriteSheet,(~~(aTimer*10)%3)*10,0,10,10);   
    }
     else player.drawImageArea(ctx,spriteSheet, 0,0,10,10);
    }

    for(var i = 0,l=shots.length;i<l;i++){
        shots[i].drawImageArea(ctx,spriteSheet,30,(~~(aTimer*10)%2)*5,5,5);
    }

    for(var l = 0;l<enemies.length;l++){
        enemies[l].drawImageArea(ctx,spriteSheet,0,10,40,40)
    }

    for(var m =0;m<explotion.length;m++){
        explotion[m].drawImageArea(ctx,spriteSheet,35,(aTimer%2)*5,5,5);
    }
}
function act (deltaTime){
    // speed =0;
    if(!pause){
        if(lastPress===KEY_ENTER){
            pause=!pause
        }
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
                var e = new Circle(-20,-20,20);
                e.rotation= random(360);
                enemies.push(e);
            }
        }
        
        for(var i =0,l=enemies.length;i<l;i++){
            enemies[i].move((enemies[i].rotation-90)*Math.PI/180,2)
            for(var j=0,ll=shots.length;j<ll;j++){
                if(enemies[i].distance(shots[j])<0){
                    if(enemies[i].radius>5){
                        for(var k=0;k<3;k++){
                            var e = new Circle(enemies[i].x,enemies[i].y,enemies[i].radius/2);
                            e.rotation=shots[j].rotation+120*k;
                            enemies.push(e)
                        }
                    }
                    score++;
                    enemies.splice(i--,1);
                    l--;
                    shots.splice(j--,1);
                    ll--;
                }
            }
                //Player collision
            if(player.timer<1&&enemies[i].distance(player)<0){
                lives--;
                player.timer=60;
                for(var m=0;m<8;m++){
                    var e = new Circle(player.x,player.y,2.5);
                    e.rotation=m*45;
                    e.timer=40;
                    explotion.push(e);
                }
            }
        }
        for(var i = 0,l=explotion.length ; i<l;i++){
            explotion[i].move((explotion[i].rotation-90)*Math.PI/180,1);
            explotion[i].timer--;
            if(explotion[i].timer<1){
                explotion.splice(i--,1);
                l--;
            }
        }
        //player timer
        if(player.timer>0){
            player.timer--;
            if(player.timer===20){
                playerReset();
            }
        }

        //player screen boundaries
        if(player.x<player.radius*2){
            player.x=player.radius*2;
        }
        if(player.x >canvas.width-player.radius*2){
            player.x=canvas.width-player.radius*2;
        }
        if(player.y<=0+player.radius*2){
            player.y=0+player.radius*2;
        }
        if(player.y >=canvas.height-player.radius*2){
            player.y=canvas.height-player.radius*2;
        }
        player.move((player.rotation-90)*Math.PI/180,player.speed);//player.move((player.rotation-90)*Math.PI/180,player.speed);

        //TIMER
        aTimer+=deltaTime;
        if(aTimer>3600){
            aTimer-=3600;
        }
        lastPress=null
    }
    if(pause){
        if(lastPress===KEY_ENTER){
            pause=!pause
            lastPress=null;
        }
    }
}
function run (){
    setTimeout(run,50)
    act(0.05)
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
    this.timer=0;
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

    //OFFSCREEN
    if(this.x>canvas.width)
    this.x=0;
    if(this.x<0)
    this.x=canvas.width;
    if(this.y>canvas.height)
    this.y=0;
    if(this.y<0)
    this.y=canvas.height;
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