var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function l(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function u(t){return null==t?"":t}function c(t,n){t.appendChild(n)}function i(t,n,e){t.insertBefore(n,e||null)}function s(t){t.parentNode.removeChild(t)}function a(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function f(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function p(){return d(" ")}function h(){return d("")}function m(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function $(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function g(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function v(t,n){t.value=null==n?"":n}function y(t,n,e){t.classList[e?"add":"remove"](n)}let _;function k(t){_=t}function b(){if(!_)throw new Error("Function called outside component initialization");return _}function w(){const t=b();return(n,e)=>{const o=t.$$.callbacks[n];if(o){const r=function(t,n,e=!1){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,e,!1,n),o}(n,e);o.slice().forEach((n=>{n.call(t,r)}))}}}const x=[],E=[],q=[],C=[],M=Promise.resolve();let j=!1;function O(t){q.push(t)}function L(t){C.push(t)}const N=new Set;let A=0;function U(){const t=_;do{for(;A<x.length;){const t=x[A];A++,k(t),H(t.$$)}for(k(null),x.length=0,A=0;E.length;)E.pop()();for(let t=0;t<q.length;t+=1){const n=q[t];N.has(n)||(N.add(n),n())}q.length=0}while(x.length);for(;C.length;)C.pop()();j=!1,N.clear(),k(t)}function H(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(O)}}const T=new Set;let B;function S(t,n){t&&t.i&&(T.delete(t),t.i(n))}function z(t,n,e,o){if(t&&t.o){if(T.has(t))return;T.add(t),B.c.push((()=>{T.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}}function D(t,n,e){const o=t.$$.props[n];void 0!==o&&(t.$$.bound[o]=e,e(t.$$.ctx[o]))}function F(t){t&&t.c()}function K(t,e,l,u){const{fragment:c,on_mount:i,on_destroy:s,after_update:a}=t.$$;c&&c.m(e,l),u||O((()=>{const e=i.map(n).filter(r);s?s.push(...e):o(e),t.$$.on_mount=[]})),a.forEach(O)}function P(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function R(t,n){-1===t.$$.dirty[0]&&(x.push(t),j||(j=!0,M.then(U)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function G(n,r,l,u,c,i,a,f=[-1]){const d=_;k(n);const p=n.$$={fragment:null,ctx:null,props:i,update:t,not_equal:c,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(d?d.$$.context:[])),callbacks:e(),dirty:f,skip_bound:!1,root:r.target||d.$$.root};a&&a(p.root);let h=!1;if(p.ctx=l?l(n,r.props||{},((t,e,...o)=>{const r=o.length?o[0]:e;return p.ctx&&c(p.ctx[t],p.ctx[t]=r)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](r),h&&R(n,t)),e})):[],p.update(),h=!0,o(p.before_update),p.fragment=!!u&&u(p.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);p.fragment&&p.fragment.l(t),t.forEach(s)}else p.fragment&&p.fragment.c();r.intro&&S(n.$$.fragment),K(n,r.target,r.anchor,r.customElement),U()}k(d)}class I{$destroy(){P(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function J(t,n,e){const o=t.slice();return o[4]=n[e],o[5]=n,o[6]=e,o}function Q(t){let n,e;return{c(){n=f("span"),$(n,"class","non-letter svelte-71ydpk"),$(n,"name",e=t[4])},m(t,e){i(t,n,e)},p(t,o){2&o&&e!==(e=t[4])&&$(n,"name",e)},d(t){t&&s(n)}}}function V(t){let n,e,r,l;function u(){t[3].call(n,t[4])}return{c(){n=f("input"),$(n,"class","letter svelte-71ydpk"),$(n,"name",e=t[4]),$(n,"maxlength","2")},m(e,o){i(e,n,o),v(n,t[0][t[4]]),r||(l=[m(n,"input",t[2]),m(n,"input",u)],r=!0)},p(o,r){t=o,2&r&&e!==(e=t[4])&&$(n,"name",e),3&r&&n.value!==t[0][t[4]]&&v(n,t[0][t[4]])},d(t){t&&s(n),r=!1,o(l)}}}function W(t){let n;function e(t,n){return" "!==t[4]?V:" "===t[4]?Q:void 0}let o=e(t),r=o&&o(t);return{c(){r&&r.c(),n=h()},m(t,e){r&&r.m(t,e),i(t,n,e)},p(t,l){o===(o=e(t))&&r?r.p(t,l):(r&&r.d(1),r=o&&o(t),r&&(r.c(),r.m(n.parentNode,n)))},d(t){r&&r.d(t),t&&s(n)}}}function X(n){let e,o=n[1],r=[];for(let t=0;t<o.length;t+=1)r[t]=W(J(n,o,t));return{c(){e=f("div");for(let t=0;t<r.length;t+=1)r[t].c();$(e,"class","input-row svelte-71ydpk")},m(t,n){i(t,e,n);for(let t=0;t<r.length;t+=1)r[t].m(e,null)},p(t,[n]){if(7&n){let l;for(o=t[1],l=0;l<o.length;l+=1){const u=J(t,o,l);r[l]?r[l].p(u,n):(r[l]=W(u),r[l].c(),r[l].m(e,null))}for(;l<r.length;l+=1)r[l].d(1);r.length=o.length}},i:t,o:t,d(t){t&&s(e),a(r,t)}}}function Y(t,n,e){let{pattern:o=[]}=n,{sltn_key:r}=n;return t.$$set=t=>{"pattern"in t&&e(1,o=t.pattern),"sltn_key"in t&&e(0,r=t.sltn_key)},[r,o,function(t){let n=t.target.value;n=n.trim(),n=n.toUpperCase(),null==r[n]&&(n=" "),t.target.value=n},function(t){r[t]=this.value,e(0,r),e(1,o)}]}class Z extends I{constructor(t){super(),G(this,t,Y,X,l,{pattern:1,sltn_key:0})}}function tt(t,n,e){const o=t.slice();return o[17]=n[e],o[19]=e,o}function nt(n){let e,o,r=n[17]+"";return{c(){e=f("h2"),o=d(r),$(e,"class","svelte-ifi6ih")},m(t,n){i(t,e,n),c(e,o)},p(t,n){4&n&&r!==(r=t[17]+"")&&g(o,r)},i:t,o:t,d(t){t&&s(e)}}}function et(t){let n,e,o;function r(n){t[7](n)}let l={pattern:t[17]};return void 0!==t[0]&&(l.sltn_key=t[0]),n=new Z({props:l}),E.push((()=>D(n,"sltn_key",r))),{c(){F(n.$$.fragment)},m(t,e){K(n,t,e),o=!0},p(t,o){const r={};4&o&&(r.pattern=t[17]),!e&&1&o&&(e=!0,r.sltn_key=t[0],L((()=>e=!1))),n.$set(r)},i(t){o||(S(n.$$.fragment,t),o=!0)},o(t){z(n.$$.fragment,t),o=!1},d(t){P(n,t)}}}function ot(t){let n,e,o,r;const l=[et,nt],u=[];return~(n=function(t,n){return t[19]%2==0?0:t[19]%2!=0?1:-1}(t))&&(e=u[n]=l[n](t)),{c(){e&&e.c(),o=h()},m(t,e){~n&&u[n].m(t,e),i(t,o,e),r=!0},p(t,n){e&&e.p(t,n)},i(t){r||(S(e),r=!0)},o(t){z(e),r=!1},d(t){~n&&u[n].d(t),t&&s(o)}}}function rt(t){let n,e,r,l,u,h,m=t[2],v=[];for(let n=0;n<m.length;n+=1)v[n]=ot(tt(t,m,n));const y=t=>z(v[t],1,1,(()=>{v[t]=null}));return{c(){n=f("div");for(let t=0;t<v.length;t+=1)v[t].c();e=p(),r=f("p"),l=d("- "),u=d(t[1]),$(r,"class","svelte-ifi6ih"),$(n,"class","quote-group svelte-ifi6ih")},m(t,o){i(t,n,o);for(let t=0;t<v.length;t+=1)v[t].m(n,null);c(n,e),c(n,r),c(r,l),c(r,u),h=!0},p(t,[r]){if(5&r){let l;for(m=t[2],l=0;l<m.length;l+=1){const o=tt(t,m,l);v[l]?(v[l].p(o,r),S(v[l],1)):(v[l]=ot(o),v[l].c(),S(v[l],1),v[l].m(n,e))}for(B={r:0,c:[],p:B},l=m.length;l<v.length;l+=1)y(l);B.r||o(B.c),B=B.p}(!h||2&r)&&g(u,t[1])},i(t){if(!h){for(let t=0;t<m.length;t+=1)S(v[t]);h=!0}},o(t){v=v.filter(Boolean);for(let t=0;t<v.length;t+=1)z(v[t]);h=!1},d(t){t&&s(n),a(v,t)}}}function lt(t,n,e){let o,r,l,u,{quote:c}=n,{author:i}=n,{width:s=25}=n,{sltn_key:a}=n;const f=[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];let d=f,p=new Map;function h(t){return void 0!==o.get(t)}function m(t){let n=[];return t.forEach((t=>{n.push(function(t){let n=[...t];return n=n.map((t=>h(t)?t:" ")),n=n.join(""),n}(t)),n.push(t)})),n}function $(t){let n=t.toUpperCase();return n=[...n],n=n.map((t=>{return h(n=t)?d[o.get(n)]:n;var n})),n=n.join(""),n}var g;return g=()=>{!function(t){let n,e=t.length;for(;0!=e;)n=Math.floor(Math.random()*e),e--,[t[e],t[n]]=[t[n],t[e]]}(d)},b().$$.on_mount.push(g),t.$$set=t=>{"quote"in t&&e(3,c=t.quote),"author"in t&&e(1,i=t.author),"width"in t&&e(4,s=t.width),"sltn_key"in t&&e(0,a=t.sltn_key)},t.$$.update=()=>{8&t.$$.dirty&&e(6,r=$(c)),80&t.$$.dirty&&e(5,l=function(t,n){let e=t.replace(new RegExp(`(?![^\\n]{1,${n}}$)([^\\n]{1,${n}})\\s`,"g"),"$1\n");return e=e.split("\n"),e}(r,s)),32&t.$$.dirty&&e(2,u=m(l))},o=function(t,n){const e=t.length;for(let o=0;o<e;o++){let e=t[o];n.set(e,o)}return n}(f,p),[a,i,u,c,s,l,r,function(t){a=t,e(0,a)}]}class ut extends I{constructor(t){super(),G(this,t,lt,rt,l,{quote:3,author:1,width:4,sltn_key:0})}}function ct(t,n,e){const o=t.slice();return o[5]=n[e],o[7]=e,o}function it(t){let n,e=t[1],o=[];for(let n=0;n<e.length;n+=1)o[n]=st(ct(t,e,n));return{c(){n=f("div");for(let t=0;t<o.length;t+=1)o[t].c();$(n,"class","buttons svelte-srnxl")},m(t,e){i(t,n,e);for(let t=0;t<o.length;t+=1)o[t].m(n,null)},p(t,r){if(15&r){let l;for(e=t[1],l=0;l<e.length;l+=1){const u=ct(t,e,l);o[l]?o[l].p(u,r):(o[l]=st(u),o[l].c(),o[l].m(n,null))}for(;l<o.length;l+=1)o[l].d(1);o.length=e.length}},d(t){t&&s(n),a(o,t)}}}function st(t){let n,e,o,r,l,a,p,h=t[5].toUpperCase()+"";return{c(){n=f("button"),e=d(h),n.value=o=t[5],$(n,"name",t[2]),$(n,"id",r=t[5]),$(n,"class",l=u(ft(t[7],t[1].length))+" svelte-srnxl"),y(n,"selected",t[5]===t[0])},m(o,r){i(o,n,r),c(n,e),a||(p=m(n,"click",t[3]),a=!0)},p(t,c){2&c&&h!==(h=t[5].toUpperCase()+"")&&g(e,h),2&c&&o!==(o=t[5])&&(n.value=o),4&c&&$(n,"name",t[2]),2&c&&r!==(r=t[5])&&$(n,"id",r),2&c&&l!==(l=u(ft(t[7],t[1].length))+" svelte-srnxl")&&$(n,"class",l),3&c&&y(n,"selected",t[5]===t[0])},d(t){t&&s(n),a=!1,p()}}}function at(n){let e,o=n[1].length>1&&it(n);return{c(){o&&o.c(),e=h()},m(t,n){o&&o.m(t,n),i(t,e,n)},p(t,[n]){t[1].length>1?o?o.p(t,n):(o=it(t),o.c(),o.m(e.parentNode,e)):o&&(o.d(1),o=null)},i:t,o:t,d(t){o&&o.d(t),t&&s(e)}}}function ft(t,n){return 0==t?"first":t==n-1?"last":"middle"}function dt(t,n,e){let{options:o=[]}=n,{value:r=o[0]}=n,{name:l}=n;const u=w();return t.$$set=t=>{"options"in t&&e(1,o=t.options),"value"in t&&e(0,r=t.value),"name"in t&&e(2,l=t.name)},[r,o,l,function(t){let n=t.target.value;e(0,r=n),u("change",{value:r})}]}class pt extends I{constructor(t){super(),G(this,t,dt,at,l,{options:1,value:0,name:2})}}function ht(t){let n,e,o,r,l,u,a;function d(n){t[6](n)}let h={author:t[3],quote:t[2]};return void 0!==t[0]&&(h.sltn_key=t[0]),o=new ut({props:h}),E.push((()=>D(o,"sltn_key",d))),u=new pt({props:{options:t[4],name:"Difficulty",value:t[1]}}),u.$on("change",t[5]),{c(){n=f("center"),e=f("div"),F(o.$$.fragment),l=p(),F(u.$$.fragment),$(e,"class","column svelte-scqo9z"),$(n,"class","svelte-scqo9z")},m(t,r){i(t,n,r),c(n,e),K(o,e,null),c(e,l),K(u,e,null),a=!0},p(t,[n]){const e={};8&n&&(e.author=t[3]),4&n&&(e.quote=t[2]),!r&&1&n&&(r=!0,e.sltn_key=t[0],L((()=>r=!1))),o.$set(e);const l={};2&n&&(l.value=t[1]),u.$set(l)},i(t){a||(S(o.$$.fragment,t),S(u.$$.fragment,t),a=!0)},o(t){z(o.$$.fragment,t),z(u.$$.fragment,t),a=!1},d(t){t&&s(n),P(o),P(u)}}}async function mt(t,n){const e=`https://api.quotable.io/random?minLength=${t}&maxLength=${n}`;let o=await fetch(e);return o=await o.json(),o}function $t(t,n,e){let o={A:" ",B:" ",C:" ",D:" ",E:" ",F:" ",G:" ",H:" ",I:" ",J:" ",K:" ",L:" ",M:" ",N:" ",O:" ",P:" ",Q:" ",R:" ",S:" ",T:" ",U:" ",V:" ",W:" ",X:" ",Y:" ",Z:" "};const r={Easy:"Easy",Medium:"Medium",Hard:"Hard"};let l=[...Object.values(r)],u=r.Medium;let c="Oops a quote should go here. Click a difficulty!",i="Keagen Thomson";return[o,u,c,i,l,async function(t){e(1,u=t.detail.value),function(t){Object.keys(t).forEach((n=>t[n]=" "))}(o);let n=await async function(t){return t===r.Easy?await mt(50,100):t===r.Medium?await mt(101,150):t===r.Hard?await mt(151,200):await mt(50,200)}(u);e(2,c=await n.content),console.log(c),e(3,i=await n.author)},function(t){o=t,e(0,o)}]}return new class extends I{constructor(t){super(),G(this,t,$t,ht,l,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
