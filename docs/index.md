---
layout: home

title: Koishi ChatHub Doc
editLink: true

hero:
  name: Koishi ChatHub
  text: 使用教程 & 开发指南
  tagline: 基于 Koishi 机器人框架，由 LangChain 驱动开发，提供多平台语言模型聊天服务，支持多种输出格式，具备高度可扩展性的插件
  actions:
    - theme: brand
      text: 了解更多
      link: /guide/introduction
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/ChatHubLab/chathub

features:
  - icon: 🛠️
    title: 快速部署 
    details: 安装相关插件并进行简单配置后即可使用，无需编写复杂配置文件。
  - icon: 🌻
    title: 多平台模型接入
    details: 支持 OpenAI (API)、Bing Chat 等平台接入，并将继续接入更多平台。
  - icon: 🔩
    title: 高扩展性
    details: 拥有中间件系统、多平台模型接入与调用 API 等特性，便于第三方开发者进行扩展。
---

<script setup>

import { onMounted } from 'vue';
import { fetchReleaseTag } from '.vitepress/utils/fetchReleaseTag.js';

onMounted(() => {
  fetchReleaseTag()
})

</script>
