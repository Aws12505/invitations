import{c as i,a as s}from"./createLucideIcon-C2aymxlh.js";import{j as e}from"./app-B1nR4NzJ.js";import{b as r}from"./button-DGdyzzYv.js";import{C as l}from"./app-layout-CYLlFGuF.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],u=i("ChevronLeft",p);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]],d=i("Ellipsis",x);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],y=i("Eye",m);function N({className:a,...n}){return e.jsx("nav",{role:"navigation","aria-label":"pagination","data-slot":"pagination",className:s("mx-auto flex w-full justify-center",a),...n})}function k({className:a,...n}){return e.jsx("ul",{"data-slot":"pagination-content",className:s("flex flex-row items-center gap-1",a),...n})}function v({...a}){return e.jsx("li",{"data-slot":"pagination-item",...a})}function t({className:a,isActive:n,size:o="icon",...c}){return e.jsx("a",{"aria-current":n?"page":void 0,"data-slot":"pagination-link","data-active":n,className:s(r({variant:n?"outline":"ghost",size:o}),a),...c})}function P({className:a,...n}){return e.jsxs(t,{"aria-label":"Go to previous page",size:"default",className:s("gap-1 px-2.5 sm:pl-2.5",a),...n,children:[e.jsx(u,{}),e.jsx("span",{className:"hidden sm:block",children:"Previous"})]})}function b({className:a,...n}){return e.jsxs(t,{"aria-label":"Go to next page",size:"default",className:s("gap-1 px-2.5 sm:pr-2.5",a),...n,children:[e.jsx("span",{className:"hidden sm:block",children:"Next"}),e.jsx(l,{})]})}function E({className:a,...n}){return e.jsxs("span",{"aria-hidden":!0,"data-slot":"pagination-ellipsis",className:s("flex size-9 items-center justify-center",a),...n,children:[e.jsx(d,{className:"size-4"}),e.jsx("span",{className:"sr-only",children:"More pages"})]})}export{y as E,N as P,k as a,v as b,P as c,E as d,t as e,b as f};
