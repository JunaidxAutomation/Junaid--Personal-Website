/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ARCTIC WATER FUSION — 3-Layer Background Animation
   Layer 1: Aurora volumetric light orbs (deep ocean)
   Layer 2: Hex grid + ice particles (arctic glass)
   Layer 3: Stars + shooting stars + mouse glow (sky)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function(){
  'use strict';
  var PI2=Math.PI*2;
  var NM=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var mouse={x:innerWidth/2,y:innerHeight/2};
  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;},{passive:true});
  window.addEventListener('touchmove',function(e){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY;},{passive:true});
  function lerp(a,b,t){return a+(b-a)*t;}
  function rnd(a,b){return Math.random()*(b-a)+a;}

  /* ── LAYER 1: AURORA ── */
  (function Aurora(){
    var cv=document.getElementById('bg-aurora');
    if(!cv)return;
    var cx=cv.getContext('2d');
    var W=0,H=0,t=0;
    var orbs=[
      {xf:.10,yf:.15,rx:.58,ry:.44,c:'0,150,199',  p:0,   s:.00042,a:.17},
      {xf:.80,yf:.52,rx:.50,ry:.36,c:'72,202,228', p:2.1, s:.00055,a:.13},
      {xf:.40,yf:.85,rx:.55,ry:.32,c:'0,70,130',   p:4.2, s:.00038,a:.19},
      {xf:.88,yf:.18,rx:.38,ry:.42,c:'0,100,170',  p:1.1, s:.00065,a:.11},
      {xf:.22,yf:.60,rx:.42,ry:.30,c:'18,175,225', p:3.5, s:.00072,a:.12},
      {xf:.55,yf:.06,rx:.46,ry:.26,c:'0,190,240',  p:5.1, s:.00048,a:.09},
    ];
    function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;}
    rs();
    function draw(){
      cx.clearRect(0,0,W,H);
      /* deep base gradient */
      var bg=cx.createLinearGradient(0,0,W*.6,H);
      bg.addColorStop(0,'#020c1c');bg.addColorStop(1,'#040e22');
      cx.fillStyle=bg;cx.fillRect(0,0,W,H);
      /* aurora orbs */
      orbs.forEach(function(o){
        var ox=(o.xf+Math.sin(t*o.s+o.p)*.10)*W;
        var oy=(o.yf+Math.cos(t*o.s*.72+o.p)*.07)*H;
        var rx=o.rx*W,ry=o.ry*H,rr=Math.max(rx,ry);
        var av=o.a*(.58+.42*Math.sin(t*o.s*2.1+o.p));
        var g=cx.createRadialGradient(ox,oy,0,ox,oy,rr);
        g.addColorStop(0,'rgba('+o.c+','+av+')');
        g.addColorStop(.38,'rgba('+o.c+','+(av*.32)+')');
        g.addColorStop(.72,'rgba('+o.c+','+(av*.07)+')');
        g.addColorStop(1,'rgba('+o.c+',0)');
        cx.save();
        cx.globalCompositeOperation='screen';
        cx.scale(1,ry/rx);cx.fillStyle=g;
        cx.beginPath();cx.arc(ox,oy*(rx/ry),rx,0,PI2);
        cx.fill();cx.restore();
        cx.globalCompositeOperation='source-over';
      });
      /* sky gradient band top */
      var top=cx.createLinearGradient(0,0,0,H*.28);
      top.addColorStop(0,'rgba(0,60,140,0.14)');top.addColorStop(1,'rgba(0,60,140,0)');
      cx.fillStyle=top;cx.fillRect(0,0,W,H);
      /* depth fog bottom */
      var fog=cx.createLinearGradient(0,H*.5,0,H);
      fog.addColorStop(0,'rgba(3,12,28,0)');fog.addColorStop(1,'rgba(3,12,28,0.62)');
      cx.fillStyle=fog;cx.fillRect(0,0,W,H);
      t++;
    }
    if(!NM)(function L(){draw();requestAnimationFrame(L);})();else draw();
    window._bgA=rs;
  })();

  /* ── LAYER 2: HEX + ICE PARTICLES ── */
  (function HexIce(){
    var cv=document.getElementById('bg-hex');
    if(!cv)return;
    var cx=cv.getContext('2d');
    var W=0,H=0,t=0,hexes=[],flakes=[];
    var COLS=['rgba(144,224,239,','rgba(72,202,228,','rgba(0,180,216,','rgba(180,235,255,'];
    function buildH(){
      hexes=[];
      var sz=Math.max(Math.min(W/22,48),24);
      var dx=sz*1.732,dy=sz*1.5;
      for(var r=-1;r<H/dy+2;r++){
        for(var c=-1;c<W/dx+2;c++){
          var ox=(r%2)*(dx/2);
          hexes.push({
            x:c*dx+ox,y:r*dy,sz:sz,
            a:rnd(.01,.048),ph:rnd(0,PI2),sp:rnd(.0004,.0011),
            col:COLS[Math.floor(Math.random()*4)],
            fill:Math.random()>.84
          });
        }
      }
    }
    function buildF(){
      flakes=[];
      var n=Math.floor(W*H/16000);
      for(var i=0;i<n;i++)flakes.push({
        x:rnd(0,W),y:rnd(0,H),
        vx:rnd(-.11,.11),vy:rnd(-.06,-.28),
        r:rnd(.5,2.6),a:rnd(.06,.4),
        ph:rnd(0,PI2),col:COLS[Math.floor(Math.random()*4)]
      });
    }
    function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;buildH();buildF();}
    rs();
    function hex(x,y,r){
      cx.beginPath();
      for(var i=0;i<6;i++){var a=PI2/6*i-Math.PI/6;cx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));}
      cx.closePath();
    }
    var mx=0,my=0;
    function draw(){
      cx.clearRect(0,0,W,H);
      mx=lerp(mx,mouse.x,.026);my=lerp(my,mouse.y,.026);
      var sx=(mx/W-.5)*20,sy=(my/H-.5)*11;
      /* hex grid */
      cx.save();cx.translate(sx*.5,sy*.38);
      hexes.forEach(function(h){
        var a=h.a*(.42+.58*Math.sin(t*h.sp+h.ph));
        cx.strokeStyle=h.col+a+')';cx.lineWidth=.52;
        hex(h.x,h.y,h.sz);cx.stroke();
        if(h.fill){cx.fillStyle=h.col+(a*.11)+')';cx.fill();}
      });
      cx.restore();
      /* ice particles */
      cx.save();cx.translate(sx*1.2,sy*.82);
      flakes.forEach(function(f){
        f.x+=f.vx;f.y+=f.vy;
        if(f.y<-8){f.y=H+8;f.x=rnd(0,W);}
        if(f.x<0)f.x=W;if(f.x>W)f.x=0;
        var a=f.a*(.52+.48*Math.sin(t*.009+f.ph));
        cx.beginPath();cx.arc(f.x,f.y,f.r,0,PI2);
        cx.fillStyle=f.col+a+')';cx.fill();
      });
      cx.restore();
      t++;
    }
    if(!NM)(function L(){draw();requestAnimationFrame(L);})();else draw();
    window._bgH=rs;
  })();

  /* ── LAYER 3: STARS + SHOOTING STARS + MOUSE GLOW ── */
  (function Stars(){
    var cv=document.getElementById('bg-stars');
    if(!cv)return;
    var cx=cv.getContext('2d');
    var W=0,H=0,t=0,stars=[],shooters=[];
    function buildS(){
      stars=[];
      var n=Math.floor(W*H/5200);
      for(var i=0;i<n;i++)stars.push({
        x:rnd(0,W),y:rnd(0,H*.68),
        r:rnd(.3,1.6),a:rnd(.05,.52),
        ph:rnd(0,PI2),sp:rnd(.004,.015)
      });
    }
    function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;buildS();}
    rs();
    function spawn(){
      if(Math.random()>.0085)return;
      shooters.push({
        x:rnd(W*.05,W*.95),y:rnd(0,H*.26),
        vx:rnd(3,7)*(Math.random()>.5?1:-1),vy:rnd(2,4.5),
        life:1
      });
    }
    var gx=0,gy=0;
    function draw(){
      cx.clearRect(0,0,W,H);
      gx=lerp(gx,mouse.x,.042);gy=lerp(gy,mouse.y,.042);
      /* mouse glow */
      var r=Math.min(W,H)*.22;
      var mg=cx.createRadialGradient(gx,gy,0,gx,gy,r);
      mg.addColorStop(0,'rgba(144,224,239,0.055)');
      mg.addColorStop(.52,'rgba(0,180,216,0.022)');
      mg.addColorStop(1,'rgba(0,150,199,0)');
      cx.fillStyle=mg;cx.fillRect(0,0,W,H);
      /* stars */
      stars.forEach(function(s){
        var a=s.a*(.36+.64*Math.sin(t*s.sp+s.ph));
        cx.beginPath();cx.arc(s.x,s.y,s.r,0,PI2);
        cx.fillStyle='rgba(210,240,255,'+a+')';cx.fill();
      });
      /* shooting stars */
      spawn();
      shooters=shooters.filter(function(s){return s.life>0;});
      shooters.forEach(function(s){
        cx.save();cx.globalAlpha=s.life;
        cx.strokeStyle='rgba(180,238,255,.92)';cx.lineWidth=1.2;
        cx.shadowColor='rgba(144,224,239,1)';cx.shadowBlur=7;
        cx.beginPath();cx.moveTo(s.x,s.y);
        cx.lineTo(s.x-s.vx*18,s.y-s.vy*18);
        cx.stroke();cx.restore();
        s.x+=s.vx;s.y+=s.vy;s.life-=.021;
      });
      t++;
    }
    if(!NM)(function L(){draw();requestAnimationFrame(L);})();else draw();
    window._bgS=rs;
  })();

  /* ── RESIZE ALL ── */
  var _rt;
  window.addEventListener('resize',function(){
    clearTimeout(_rt);
    _rt=setTimeout(function(){
      window._bgA&&window._bgA();
      window._bgH&&window._bgH();
      window._bgS&&window._bgS();
    },140);
  });
})();
