(this.webpackJsonptetris=this.webpackJsonptetris||[]).push([[0],{10:function(e,t,a){},11:function(e,t,a){"use strict";a.r(t);var o=a(0),n=a(1),s=a.n(n),r=a(3),l=a.n(r);a(9),a(10);const i="spawning",c="descending",p="locking",d="clearing",h="gameOver",m="starting",u="pending",f="paused",v="resuming";var y=e=>()=>{const{state:t,start:a,resume:n}=e(),s=(e,t,a)=>{var o;return e&&(null===(o=e.shape[a-e.top])||void 0===o?void 0:o[t-e.left])};return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsxs)("main",{className:"frame",children:[Object(o.jsx)("div",{"data-testid":"playfield",className:"playfield",children:t.playfield.map(((e,a)=>Object(o.jsx)("div",{className:"row"+("clearing"===t.phase&&e.every((e=>e))?" clearing":""),children:e.map(((e,n)=>Object(o.jsx)("div",{className:s(t.tetromino,n,a)||(s(t.ghostPiece,n,a)?"ghost-piece":"")||e||""},n)))},a)))}),t.phase===u||t.phase===h?Object(o.jsx)("div",{className:"controls",children:Object(o.jsx)("button",{onClick:a,children:"START"})}):null,t.phase===f?Object(o.jsx)("div",{className:"controls",children:Object(o.jsx)("button",{onClick:n,children:"RESUME"})}):null,t.countdown>0?Object(o.jsx)("div",{className:"countdown",children:t.countdown}):null]}),Object(o.jsxs)("div",{className:"frame",children:[Object(o.jsx)("h1",{children:"NEXT"}),Object(o.jsx)("div",{className:"next-tetrominos",children:t.queue.slice(0,3).map(((e,t)=>Object(o.jsx)("div",{className:"next-tetromino",children:e.shape.map(((e,t)=>Object(o.jsx)("div",{className:"row",children:e.map(((e,t)=>Object(o.jsx)("div",{className:e},t)))},t)))},t)))}),Object(o.jsx)("h1",{children:"LINES"}),Object(o.jsx)("div",{className:"lines",children:t.lines})]})]})},g=a.p+"static/media/clear1.fe1236db.mp3",j=a.p+"static/media/clear2.42d27630.mp3",b=a.p+"static/media/clear3.50cd846e.mp3",w=a.p+"static/media/clear4.529df8a4.mp3",x=a.p+"static/media/gameOver.f52cf5f0.mp3",O=a.p+"static/media/hardDrop.d2d4cb32.mp3",P=a.p+"static/media/locked.f92eb651.mp3",k=a.p+"static/media/spawn.dcb5ecc2.mp3";const N=37,L=39,T=40,E={[N]:{left:-1,top:0},[L]:{left:1,top:0},[T]:{left:0,top:1}},A=(e,t)=>{const a=t.length;return e.shape.some(((o,n)=>o.some(((o,s)=>o&&(n+e.top>=a-1||t[n+e.top+1][s+e.left])))))},C=(e,t)=>{const a=t[0].length,o=t.length;return e.shape.some(((n,s)=>n.some(((n,r)=>n&&(r+e.left<0||r+e.left>=a||s+e.top>=o||t[s+e.top][r+e.left])))))},D=[[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],[[0,0],[1,0],[1,1],[0,-2],[1,-2]],[[0,0],[1,0],[1,-1],[0,2],[1,2]],[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]]],R=[D[2],D[1],D[0],D[3]],S=[[[0,0],[-2,0],[1,0],[-2,1],[1,-2]],[[0,0],[-1,0],[2,0],[-1,-2],[2,1]],[[0,0],[2,0],[-1,0],[2,-1],[-1,2]],[[0,0],[1,0],[-2,0],[1,2],[-2,-1]]],I=[[[0,0]],[[0,0]],[[0,0]],[[0,0]]],q={I:[S[1],S[2],S[3],S[0]],O:I,L:R,J:R,Z:R,S:R,T:R},M={I:S,O:I,L:D,J:D,Z:D,S:D,T:D},F=(e,t,a)=>{const o={...e,left:e.left+a[0][0],top:e.top+a[0][1]};return C(o,t)?1===a.length?null:F(e,t,a.slice(1)):o},J=(e,t,a,o)=>{var n;return null!==(n=F(e,a,o))&&void 0!==n?n:t},B=(e,t)=>J({...e,rotationPhase:(e.rotationPhase+1)%4,shape:e.shape.map(((t,a)=>t.map(((t,o)=>e.shape[e.shape.length-1-o][a]))))},e,t,M[e.name][e.rotationPhase]),Z=(e,t,a)=>((e,t,a)=>C(e,a)?t:e)({...e,left:e.left+E[a].left,top:e.top+E[a].top},e,t),U=(e,t)=>t.map(((t,a)=>t.map(((t,o)=>{var n;return t||(null===(n=e.shape[a-e.top])||void 0===n?void 0:n[o-e.left])})))),z=(e,t,a=e.top)=>{const o={...e,top:a};return A(o,t)?o:z(e,t,a+1)},X=(e,t)=>[...Array(t)].map((()=>[...Array(e)].map((()=>{})))),G=[...Array(22)].map((()=>[...Array(10)].map((()=>{})))),H=e=>{const{tetromino:t,playfield:a}=e,o=((e,t)=>{const a=A(e,t);return{playfield:a?U(e,t):t,locked:a}})(t,a);return o.locked?{...e,tetromino:void 0,ghostPiece:void 0,playfield:o.playfield,sfx:"locked",phase:d}:{...e,phase:c}},K={tick:e=>{const{tetromino:t,playfield:a}=e,o=Z(t,a,T);return{...e,tetromino:o,phase:A(o,a)?p:e.phase}},move:(e,t)=>{const{tetromino:a,playfield:o}=e,n=Z(a,o,t.payload);return e.phase===p&&t.payload===T?H(e):{...e,tetromino:n,ghostPiece:z(n,o),phase:A(n,o)?p:c}},lock:H,clear:e=>{const{playfield:t}=e,a=(e=>{const t=e[0].length,a=e.reduceRight(((e,t)=>t.every((e=>e))?e:[t].concat(e)),[]),o=e.length-a.length;return{playfield:X(t,o).concat(a),linesCleared:o}})(t),o=e.lines+a.linesCleared;return{...e,playfield:a.playfield,lines:o,sfx:a.linesCleared>0?"clear"+a.linesCleared:void 0,interval:Math.max(100,1e3-100*Math.floor(o/10)),phase:i}},rotateRight:e=>{const{tetromino:t,playfield:a}=e,o=B(t,a);return{...e,tetromino:B(t,a),ghostPiece:z(o,a)}},rotateLeft:e=>{const{tetromino:t,playfield:a}=e,o=((e,t)=>J({...e,rotationPhase:(e.rotationPhase+3)%4,shape:e.shape.map(((t,a)=>t.map(((t,o)=>e.shape[o][e.shape.length-1-a]))))},e,t,q[e.name][e.rotationPhase]))(t,a);return{...e,tetromino:o,ghostPiece:z(o,a)}},spawn:(e,t)=>{const{queue:a,playfield:o}=e,n=a[0],s=a.slice(1).concat(t.payload||[]),r=!A(n,o)&&!C(n,o);return{...e,tetromino:n,ghostPiece:z(n,o),phase:r?c:h,sfx:r?"spawn":"gameOver",queue:s,alive:r}},hardDrop:e=>{const{tetromino:t,playfield:a}=e,o=z(t,a);return{...e,tetromino:o,sfx:"hardDrop",phase:p}},start:(e,t)=>({playfield:G,queue:t.payload,phase:m,tetromino:void 0,alive:!0,interval:1e3,lines:0,countdown:3,originalPhase:void 0}),countdown:e=>({...e,countdown:Math.max(0,e.countdown-1)}),pause:e=>({...e,phase:f,originalPhase:e.phase}),resume:e=>({...e,phase:v,countdown:3}),restore:e=>({...e,phase:e.originalPhase,originalPhase:void 0})},Q={tick:[c],move:[c,p],lock:[p],clear:[d],rotateLeft:[c,p],rotateRight:[c,p],spawn:[i,m],hardDrop:[c],start:[u,h],countdown:[m,v],pause:[c,p,d,i],resume:[f],restore:[v]},V=(e,t)=>{var a;return(null===(a=Q[t.type])||void 0===a?void 0:a.includes(e.phase))?K[t.type](e,t):e},W={playfield:G,queue:[],phase:u,tetromino:void 0,alive:!1,interval:1e3,lines:0,countdown:0},Y={ArrowLeft:{type:"move",payload:N},ArrowRight:{type:"move",payload:L},ArrowDown:{type:"move",payload:T},ArrowUp:{type:"rotateRight"},x:{type:"rotateRight"}," ":{type:"hardDrop"},Escape:{type:"pause"},F1:{type:"pause"},z:{type:"rotateLeft"},Control:{type:"rotateLeft"}},$=void 0,_="O",ee={top:0,left:4,name:_,rotationPhase:0,shape:[[_,_],[_,_]]},te="I",ae={top:0,left:3,name:te,rotationPhase:0,shape:[[$,$,$,$],[te,te,te,te],[$,$,$,$],[$,$,$,$]]},oe="S",ne={top:0,left:3,name:oe,rotationPhase:0,shape:[[$,oe,oe],[oe,oe,$],[$,$,$]]},se="Z",re={top:0,left:3,name:se,rotationPhase:0,shape:[[se,se,$],[$,se,se],[$,$,$]]},le="T",ie={top:0,left:3,name:le,rotationPhase:0,shape:[[$,le,$],[le,le,le],[$,$,$]]},ce="J",pe={top:0,left:3,name:ce,rotationPhase:0,shape:[[ce,$,$],[ce,ce,ce],[$,$,$]]},de="L",he={top:0,left:3,name:de,rotationPhase:0,shape:[[$,$,de],[de,de,de],[$,$,$]]},me=(e=>{const t=new e,a=e=>{const a=(e=>fetch(e).then((e=>e.arrayBuffer())).then((e=>t.decodeAudioData(e))))(e);return()=>a.then((e=>{const a=t.createBufferSource();a.buffer=e,a.connect(t.destination),a.start()}))};return{clear1:a(g),clear2:a(j),clear3:a(b),clear4:a(w),locked:a(P),spawn:a(k),hardDrop:a(O),gameOver:a(x)}})(AudioContext);var ue,fe;var ve=y((ue=me,fe=()=>(e=>{const t=e.slice(0);let a=t.slice(0).length-1;for(;a>=0;){const e=Math.floor(Math.random()*(a+1)),o=t[a];t[a]=t[e],t[e]=o,a-=1}return t})([ae,ee,ie,ne,re,pe,he]),()=>{const[e,t]=Object(n.useReducer)(V,W),a=e.alive&&void 0!==e.tetromino&&e.phase!==f;return Object(n.useEffect)((()=>{const o=a?setInterval((()=>t({type:"tick"})),e.interval):0;return()=>clearInterval(o)}),[a,e.interval]),Object(n.useEffect)((()=>{e.sfx&&ue[e.sfx]()}),[e.sfx]),Object(n.useEffect)((()=>{var a;const o={[i]:()=>setTimeout((()=>t({type:"spawn",payload:e.queue.length<=3?fe():[]})),500),[p]:()=>setTimeout((()=>t({type:"lock"})),500),[d]:()=>setTimeout((()=>t({type:"clear"})),500),[m]:()=>{e.countdown>0?setTimeout((()=>t({type:"countdown"})),1e3):t({type:"spawn",payload:fe()})},[v]:()=>{e.countdown>0?setTimeout((()=>t({type:"countdown"})),1e3):t({type:"restore"})}};null===(a=o[e.phase])||void 0===a||a.call(o)}),[e.phase,e.queue.length,e.countdown]),Object(n.useEffect)((()=>{const a=e=>{Y[e.key]&&(t(Y[e.key]),e.preventDefault())};return e.alive&&document.body.addEventListener("keydown",a),()=>document.body.removeEventListener("keydown",a)}),[e.alive]),{state:e,start:()=>t({type:"start",payload:fe()}),resume:()=>t({type:"resume"})}}));var ye=()=>Object(o.jsx)(ve,{});var ge=e=>{e&&e instanceof Function&&a.e(3).then(a.bind(null,12)).then((({getCLS:t,getFID:a,getFCP:o,getLCP:n,getTTFB:s})=>{t(e),a(e),o(e),n(e),s(e)}))};l.a.render(Object(o.jsx)(s.a.StrictMode,{children:Object(o.jsx)(ye,{})}),document.getElementById("root")),ge()},9:function(e,t,a){}},[[11,1,2]]]);
//# sourceMappingURL=main.7cc29acd.chunk.js.map