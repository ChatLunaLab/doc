import{j as n,o as i,c as o}from"./chunks/framework.4719a631.js";function c(){return fetch("https://api.github.com/repos/ChatLunaLab/chatluna/releases").then(t=>t.json()).then(t=>{var e;return((e=t==null?void 0:t[0])==null?void 0:e.name)??""}).then(t=>{if(!t)return;console.log(t);const e=document.querySelector("div.VPHero.VPHomeHero > div > div.main > p.tagline"),a=document.createElement("samp");a.classList.add("docs-chathub-release-tag"),a.innerText=t,e==null||e.appendChild(a)})}const l=JSON.parse('{"title":"ChatLuna Doc","description":"","frontmatter":{"layout":"home","title":"ChatLuna Doc","editLink":true,"hero":{"name":"ChatLuna ChatHub","text":"使用教程 & 开发指南","tagline":"提供多平台语言模型聊天服务，可选多种输出格式，另配高度可扩展插件系统","actions":[{"theme":"brand","text":"了解更多","link":"/guide/introduction"},{"theme":"alt","text":"在 GitHub 上查看","link":"https://github.com/ChatLunaLab/chatluna"}]},"features":[{"icon":"🛠️","title":"快速部署","details":"无需编写复杂配置文件，安装插件后，在 Koishi Web UI 简单配置后即可使用。"},{"icon":"🌻","title":"多平台模型接入","details":"支持 OpenAI (API)、Bing Chat、文心一言（API）等平台，仍将继续接入更多平台。"},{"icon":"🔩","title":"高扩展性","details":"拥有中间件系统、多平台模型接入，丰富的 API 等，便于开发者使用或扩展。"}]},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1699318105000}'),s={name:"index.md"},h=Object.assign(s,{setup(t){return n(()=>{c()}),(e,a)=>(i(),o("div"))}});export{l as __pageData,h as default};
