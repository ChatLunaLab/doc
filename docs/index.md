---
layout: home

title: ''
editLink: true

hero:
  name: ChatLuna
  text: ''
  tagline: 多平台模型接入，可扩展，多种输出格式，提供大语言模型聊天服务的插件
  actions:
    - theme: brand
      text: 了解更多
      link: /guide/introduction
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/ChatLunaLab/chatluna

features:
  - icon: 🚀
    title: 快速部署
    details: 无需编写复杂配置文件和部署其他服务，安装系列插件后，在 Koishi 控制面板上配置后即可使用。
  - icon: 🌐
    title: 多模型集成
    details: 集成 OpenAI、Google Gemini、Anthropic Claude 等主流服务，持续扩展更多平台。
  - icon: 🎨
    title: 渲染输出
    details: 可渲染模型回复，支持文本、图片、语音等多种格式。
  - icon: 🔗
    title: 实时联网
    details: 通过 browsing 模式获取最新互联网信息。

---

<script setup>

import { onMounted } from 'vue';
import { fetchReleaseTag } from '.vitepress/utils/fetchReleaseTag.js';

onMounted(() => {
  fetchReleaseTag()
})

</script>
