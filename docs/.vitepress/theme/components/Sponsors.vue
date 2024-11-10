<script setup lang="ts">
import type { GridSize } from '../composables/sponsor-grid'
import type { Sponsor } from './SponsorsGrid.vue'
import { computed } from 'vue'
import SponsorsGrid from './SponsorsGrid.vue'

export interface Sponsors {
  tier?: string
  size?: GridSize
  items: Sponsor[]
}
interface Props {
  mode?: 'normal' | 'aside'
  tier?: string
  size?: GridSize
  data: Sponsors[] | Sponsor[]
}
const props = withDefaults(defineProps<Props>(), {
  mode: 'normal'
})

const sponsors = computed(() => {
  const isSponsors = props.data.some((s) => {
    return 'items' in s
  })

  if (isSponsors) {
    return props.data as Sponsors[]
  }

  return [
    { tier: props.tier, size: props.size, items: props.data as Sponsor[] }
  ]
})
</script>

<template>
  <div class="sponsor" :class="[mode]">
    <section
      v-for="(sponsor, index) in sponsors"
      :key="index"
      class="sponsor-section"
    >
      <h3 v-if="sponsor.tier" class="sponsor-tier">{{ sponsor.tier }}</h3>
      <SponsorsGrid :size="sponsor.size" :data="sponsor.items" />
    </section>
  </div>
</template>

