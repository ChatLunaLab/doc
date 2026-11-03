<script setup lang="ts">
import { useId } from 'vue'

const pattern = useId()
const dots = [0, 2, 4, 6, 8]
</script>

<template>
  <span class="logo">
    <svg class="logo-mark" viewBox="0 0 22 22" aria-hidden="true">
      <defs>
        <pattern :id="pattern" width="8" height="8" patternTransform="translate(-176.54 177.75)" patternUnits="userSpaceOnUse" viewBox="0 0 8 8">
          <template v-for="cx in dots" :key="cx">
            <circle v-for="cy in dots" :key="cy" :cx="cx" :cy="cy" r="0.52" />
          </template>
        </pattern>
      </defs>
      <path d="M10.6,21.2A10.6,10.6,0,1,1,21.2,10.6,10.61,10.61,0,0,1,10.6,21.2ZM10.6,1a9.6,9.6,0,1,0,9.6,9.6A9.62,9.62,0,0,0,10.6,1Z" />
      <path :fill="`url(#${pattern})`" d="M20.7,10.6a9.54,9.54,0,0,1-.12,1.52,4.48,4.48,0,0,0-.11.62A10.1,10.1,0,0,1,1.13,14.13a10.1,10.1,0,0,0,11.14.09,10.08,10.08,0,0,0,4.6-8.47,10,10,0,0,0-.63-3.52A10.07,10.07,0,0,1,20.7,10.6Z" />
      <path d="M21.36,20.41a10.62,10.62,0,0,1-5-1.25.5.5,0,0,1-.06-.84A9.5,9.5,0,0,0,20,12.64a.5.5,0,0,1,.58-.39.49.49,0,0,1,.4.57,9.87,9.87,0,0,0-.11,1.44,9.57,9.57,0,0,0,1.62,5.35.49.49,0,0,1,0,.51.52.52,0,0,1-.43.27l0-.5v.5Zm-3.83-1.79a9.92,9.92,0,0,0,3.65.79,10.65,10.65,0,0,1-1.24-3.78A10.65,10.65,0,0,1,17.53,18.62Z" />
    </svg>
    <span class="logo-word">Chat<span class="logo-luna">Luna</span></span>
  </span>
</template>

<style scoped>
.logo {
  --logo-navy: #34428c;
  --logo-violet: #7665ab;
  display: inline-flex;
  align-items: center;
  gap: 0.42em;
}

.dark .logo {
  --logo-navy: #d3d8ff;
  --logo-violet: #b2a6ee;
}

.logo-mark {
  width: 1.35em;
  height: 1.35em;
  fill: var(--logo-navy);
}

.logo-word {
  color: var(--logo-navy);
  font-family: Montserrat, var(--vp-font-family-base);
  font-weight: 600;
  letter-spacing: 0.05em;
  line-height: 1;
}

.logo-luna {
  color: var(--logo-violet);
}
</style>
