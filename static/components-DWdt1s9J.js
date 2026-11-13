import{S as e,_ as t,b as n,d as r,f as i,g as a,h as o,l as s,m as c,n as l,p as u,r as d,t as f,u as p,v as m,x as h,y as g}from"./client-D4UTPX_p.js";var _=0,v=async e=>{try{return e.flat().map(y)}catch(t){if(t instanceof Promise){let n=s();return await t,n(()=>v(e))}throw t}},y=e=>{if(e==null||typeof e==`boolean`)return``;if(typeof e==`string`||Array.isArray(e))return a([e]);if(u(e))return t(e);{let t=e.toString();return t instanceof Promise?t:g(t)}},b=async({children:e,fallback:o,fallbackRender:l,onError:d})=>{if(!e)return g(``);Array.isArray(e)||(e=[e]);let f=r(x)?.scriptNonce,p,h=()=>p||=s(),b,S=()=>b||=(async()=>{let e=await o;if(e==null)return;if(typeof e==`string`||Array.isArray(e))return h()(()=>a([e]));if(u(e))return h()(()=>t(e));let n=await h()(()=>e.toString());return g(n,n.callbacks||e.callbacks)})(),C=async e=>{let t=await S();return h()(async()=>{d?.(e);let n=t===void 0?l&&c(i,{},l(e))||``:t,r=await i({children:n}).toString();return g(r,r.callbacks||n.callbacks)})},w=[];try{w=e.map(y)}catch(t){let n=h();w=t instanceof Promise?[t.then(()=>n(()=>v(e))).catch(e=>C(e))]:[await C(t)]}if(w.some(e=>e instanceof Promise)){h();let e=_++,t=RegExp(`(<template id="E:${e}"></template>)(.*?)(<!--E:${e}-->)`,`s`),r=!1,i=async({error:n,buffer:i})=>{if(r)return``;r=!0;let a=await C(n),o=a.callbacks;return i?(i[0]=i[0].replace(t,()=>a),o?.length?g(``,o):``):g(`<template data-hono-target="E:${e}">${a}</template><script>
((d,c,n) => {
c=d.currentScript.previousSibling
d=d.getElementById('E:${e}')
if(!d)return
do{n=d.nextSibling;n.remove()}while(n.nodeType!=8||n.nodeValue!='E:${e}')
d.replaceWith(c.content)
})(document)
<\/script>`,o)},a,o=Promise.all(w).catch(e=>a=e);return g(`<template id="E:${e}"></template><!--E:${e}-->`,[({phase:r,buffer:s,context:c})=>{if(r!==m.BeforeStream)return o.then(async o=>{if(a)throw a;o=o.flat();let l=o.join(``),u=s?``:`<template data-hono-target="E:${e}">${l}</template><script${f?` nonce="${f}"`:``}>
((d,c) => {
c=d.currentScript.previousSibling
d=d.getElementById('E:${e}')
if(!d)return
d.parentElement.insertBefore(c.content,d.nextSibling)
})(document)
<\/script>`;if(o.every(e=>!e.callbacks?.length))return s&&(s[0]=s[0].replace(t,()=>l)),u;s&&(s[0]=s[0].replace(t,(e,t,n,r)=>`${t}${l}${r}`));let d=o.map(e=>e.callbacks||[]).flat();r===m.Stream&&(u=await n(u,m.BeforeStream,!0,c));let p=0,h=d.map(n=>(...r)=>n(...r)?.then(n=>(p++,s?(p===d.length&&(s[0]=s[0].replace(t,(e,t,n)=>n)),s[0]+=n,g(``,n.callbacks)):g(n+(p===d.length?`<script>
((d,c,n) => {
d=d.getElementById('E:${e}')
if(!d)return
n=d.nextSibling
while(n.nodeType!=8||n.nodeValue!='E:${e}'){n=n.nextSibling}
n.remove()
d.remove()
})(document)
<\/script>`:``),n.callbacks))).catch(e=>i({error:e,buffer:s})));return g(u,h)}).catch(e=>i({error:e,buffer:s}))}])}return i({children:w})};b[h]=f;var x=p(null),S=0,C=e=>typeof e==`string`||Array.isArray(e)?a([e]):e==null||typeof e==`boolean`?``:u(e)?t(e):e.toString(),w=async({children:i,fallback:o})=>{Array.isArray(i)||(i=[i]);let c=r(x)?.scriptNonce,l=[],f={[e]:[0,[]]},p=()=>{d.pop()};try{f[e][0]=0,d.push([[],f]),l=i.map(C)}catch(t){if(t instanceof Promise){let n=s();l=[t.then(()=>n(()=>(f[e][0]=0,d.push([[],f]),v(i).finally(p))))]}else throw t}finally{p()}if(l.some(e=>e instanceof Promise)){let e=S++,r=await(typeof o==`string`||Array.isArray(o)?a([o]):u(o)?t(o):o.toString());return g(`<template id="H:${e}"></template>${r}<!--/$-->`,[...r.callbacks||[],({phase:t,buffer:r,context:i})=>{if(t!==m.BeforeStream)return Promise.all(l).then(async a=>{a=a.flat();let o=a.join(``);r&&(r[0]=r[0].replace(RegExp(`<template id="H:${e}"></template>.*?<!--/\\$-->`,`s`),()=>o));let s=r?``:`<template data-hono-target="H:${e}">${o}</template><script${c?` nonce="${c}"`:``}>
((d,c,n) => {
c=d.currentScript.previousSibling
d=d.getElementById('H:${e}')
if(!d)return
do{n=d.nextSibling;n.remove()}while(n.nodeType!=8||n.nodeValue!='/$')
d.replaceWith(c.content)
})(document)
<\/script>`,l=a.map(e=>e.callbacks||[]).flat();return l.length?(t===m.Stream&&(s=await n(s,m.BeforeStream,!0,i)),g(s,l)):s})}])}return g(l.join(``))};w[h]=l,new TextEncoder;function T(e,t,n){let r;if(!t||!(`children`in t))r=o(e,t,[]);else{let n=t.children;r=Array.isArray(n)?o(e,t,n):o(e,t,[n])}return r.key=n,r}var E=Symbol(),D=Symbol();p({[E]:!1,[D]:!1});export{T as t};