---
layout: home

title: ""
editLink: false

hero:
  name: ChatLuna
  text: ""
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
    details: 无需编写复杂配置文件，在 Koishi 安装相关插件后，即可配置使用。
  - icon: 🌐
    title: 多模型集成
    details: 集成 Deepseek、OpenAI、Google Gemini、Anthropic Claude 等主流平台，并持续扩展更多平台。
  - icon: 🔗
    title: Agentic 能力
    details: 使用 Agent 模式，可以让模型任意调用已有工具。支持 MCP，联网搜索，知识库等复杂工具。
  - icon: 🎨
    title: 多模态与渲染输出
    details: 支持图片多模态，并可渲染模型回复，支持文本、图片、语音等多种格式。
---

<script setup>

import { onMounted } from 'vue';
import { fetchReleaseTag } from './.vitepress/utils/fetchReleaseTag.js';

onMounted(() => {
  fetchReleaseTag()
})

</script>
