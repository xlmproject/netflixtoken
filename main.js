// Live US Eastern clock
const clockEl=document.getElementById('clock');
function updateClock(){clockEl.textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}).format(new Date());}
updateClock();setInterval(updateClock,1000);

// WebGL orb: animated sphere with a zoom-responsive fractal-like interior.
const canvas=document.getElementById('globe'),stage=document.getElementById('orbStage');
const gl=canvas.getContext('webgl',{antialias:true,alpha:true,powerPreference:'high-performance'});
let zoom=1.0,rotX=0,rotY=0,targetX=0,targetY=0,dragging=false,lastX=0,lastY=0;
if(gl){
const vertex=`attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const fragment=`precision highp float; varying vec2 uv; uniform float t; uniform float zoom; uniform vec2 tilt;
vec3 palette(float x){return .5+.5*cos(6.28318*(x+vec3(0.0,.33,.67)));}
void main(){vec2 q=(uv-.5)*2.0; q.x*=1.0; float r=length(q); if(r>1.0)discard;
float z=sqrt(max(0.0,1.0-r*r)); vec3 n=normalize(vec3(q,z));
float spin=t*.12; float ca=cos(spin),sa=sin(spin); n.x=ca*n.x-sa*n.z;n.z=sa*n.x+ca*n.z;
vec2 c=(n.xy*1.9+vec2(-.28,.02))/pow(zoom,1.0); c+=tilt*.15;
vec2 a=c; float it=0.0; float m=0.0; for(int i=0;i<96;i++){if(dot(a,a)>4.0)break; a=vec2(a.x*a.x-a.y*a.y,2.0*a.x*a.y)+c;it+=1.0; m=dot(a,a);}
float smoothIt=it-log(max(log(max(m,1.01)),.001))/log(2.0); float hue=smoothIt*.025+t*.045+zoom*.13;
vec3 col=palette(hue+smoothIt*.018); float inside=step(96.0,it); float glow=pow(max(0.0,1.0-r),2.0);
col=mix(col,vec3(.045,.018,.035),inside*.65); col*=.85+.35*glow;
float bands=sin(smoothIt*.13+atan(q.y,q.x)*5.0+t*.7)*.08; col+=bands;
float edge=pow(max(0.,1.-r),.35); float light=max(0.,dot(n,normalize(vec3(-.6,.65,.8))));
col*=.55+.7*light; col+=vec3(.95,.07,.04)*pow(max(0.,dot(n,normalize(vec3(-.5,.4,1.)))),18.0)*.7;
float rim=pow(1.0-z,.7);col+=vec3(.9,.08,.06)*rim*.35; gl_FragColor=vec4(col,1.0);}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));return null;}return s;}
const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
if(vs&&fs){const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.useProgram(program);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);const timeLoc=gl.getUniformLocation(program,'t'),zoomLoc=gl.getUniformLocation(program,'zoom'),tiltLoc=gl.getUniformLocation(program,'tilt');
function resize(){const d=Math.min(window.devicePixelRatio||1,2.5);canvas.width=Math.floor(canvas.clientWidth*d);canvas.height=Math.floor(canvas.clientHeight*d);gl.viewport(0,0,canvas.width,canvas.height);}
window.addEventListener('resize',resize);resize();let start=performance.now();function draw(now){gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(timeLoc,(now-start)/1000);gl.uniform1f(zoomLoc,zoom);gl.uniform2f(tiltLoc,rotY,rotX);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(draw);}requestAnimationFrame(draw);
}
}else{canvas.style.background='radial-gradient(circle,#ff5340,#9b2d24 70%,transparent 72%)';}
function setZoom(v){zoom=Math.max(1,Math.min(1000000,v));stage.style.cursor=zoom>1.1?'zoom-out':'zoom-in';}
stage.addEventListener('wheel',e=>{e.preventDefault();setZoom(zoom*Math.exp(-e.deltaY*.001));},{passive:false});
stage.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;stage.setPointerCapture?.(e.pointerId);});stage.addEventListener('pointerup',()=>dragging=false);stage.addEventListener('pointercancel',()=>dragging=false);
stage.addEventListener('pointermove',e=>{if(dragging){rotY+=(e.clientX-lastX)*.006;rotX+=(e.clientY-lastY)*.006;lastX=e.clientX;lastY=e.clientY;}else{targetY=(e.clientX-stage.getBoundingClientRect().left-stage.clientWidth/2)/stage.clientWidth;targetX=(e.clientY-stage.getBoundingClientRect().top-stage.clientHeight/2)/stage.clientHeight;}});
window.addEventListener('pointermove',e=>{if(!dragging){const dx=(e.clientX/window.innerWidth-.5),dy=(e.clientY/window.innerHeight-.5);document.documentElement.style.setProperty('--mx',dx);document.documentElement.style.setProperty('--my',dy);}});
