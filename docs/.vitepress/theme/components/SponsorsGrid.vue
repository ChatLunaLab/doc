<script setup lang="ts">
import type { GridSize } from '../composables/sponsor-grid'
import { ref } from 'vue'
import { useSponsorsGrid } from '../composables/sponsor-grid'

export interface Sponsor {
  name: string
  img: string
  url: string
}
interface Props {
  size?: GridSize
  data: Sponsor[]
}
const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const el = ref(null)

useSponsorsGrid({ el, size: props.size })

const handleMouseEnter = (event: MouseEvent, name: string) => {
  const box = event.currentTarget as HTMLElement
  if (!box.querySelector('.sponsor-grid-name')) {
    const nameEl = document.createElement('div')
    nameEl.className = 'sponsor-grid-name'
    nameEl.textContent = name
    box.appendChild(nameEl)
    // 强制重绘以触发动画
    nameEl.offsetHeight
    nameEl.classList.add('show')
  }
}

const handleMouseLeave = (event: MouseEvent) => {
  const box = event.currentTarget as HTMLElement
  const nameEl = box.querySelector('.sponsor-grid-name')
  if (nameEl) {
    nameEl.classList.remove('show')
    // 等待动画完成后移除元素
    nameEl.addEventListener('transitionend', () => {
      nameEl.remove()
    }, { once: true })
  }
}
</script>

<template>
  <div class="sponsor-grid" :class="[size]" ref="el">
    <div
      v-for="sponsor in data"
      :key="sponsor.name"
      class="sponsor-grid-item"
    >
      <div class="sponsor-grid-link">
        <article 
          class="sponsor-grid-box"
          @mouseenter="(e) => handleMouseEnter(e, sponsor.name)"
          @mouseleave="handleMouseLeave"
        >
          <img
            class="sponsor-grid-image"
            :src="sponsor.img"
            :alt="sponsor.name"
          />
        </article>
      </div>
    </div>
  </div>
</template>


