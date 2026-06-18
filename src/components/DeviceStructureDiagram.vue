<template>
  <div class="structure-canvas" :class="`is-${modelType}`">
    <div class="scan-line"></div>
    <svg viewBox="0 0 720 520" role="img" :aria-label="`${deviceName}内部结构示意图`">
      <defs>
        <linearGradient id="shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#163f66" stop-opacity=".86" />
          <stop offset="1" stop-color="#061b35" stop-opacity=".42" />
        </linearGradient>
        <linearGradient id="copper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffcf6c" />
          <stop offset="1" stop-color="#b76d22" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g class="grid-lines">
        <path v-for="line in 10" :key="`h-${line}`" :d="`M60 ${line * 44} H660`" />
        <path v-for="line in 13" :key="`v-${line}`" :d="`M${line * 50} 40 V480`" />
      </g>

      <g v-if="modelType === 'transformer'" class="device-drawing">
        <path class="shell" d="M210 138 L510 138 L548 188 L548 408 L172 408 L172 188 Z" />
        <path class="top" d="M220 138 L240 82 L286 82 L302 138 M418 138 L434 82 L480 82 L500 138" />
        <rect class="core" x="292" y="175" width="136" height="190" rx="10" />
        <path class="coil" d="M300 194 H420 M300 218 H420 M300 242 H420 M300 266 H420 M300 290 H420 M300 314 H420 M300 338 H420" />
        <path class="cooler" d="M180 210 H132 V356 H180 M548 210 H596 V356 H548 M142 225 V342 M156 225 V342 M566 225 V342 M580 225 V342" />
        <circle class="gauge" cx="500" cy="176" r="18" />
      </g>

      <g v-else-if="modelType === 'reactor'" class="device-drawing">
        <path class="shell" d="M208 130 H512 L540 178 V410 H180 V178 Z" />
        <path class="top" d="M244 130 L258 76 H302 L316 130 M404 130 L418 76 H462 L476 130" />
        <rect class="core" x="325" y="168" width="70" height="210" rx="8" />
        <path class="coil" d="M265 190 Q360 150 455 190 M265 220 Q360 180 455 220 M265 250 Q360 210 455 250 M265 280 Q360 240 455 280 M265 310 Q360 270 455 310 M265 340 Q360 300 455 340" />
        <path class="cooler" d="M190 205 H140 V360 H190 M530 205 H580 V360 H530 M150 220 V345 M164 220 V345 M556 220 V345 M570 220 V345" />
        <circle class="gauge" cx="493" cy="174" r="18" />
      </g>

      <g v-else class="device-drawing">
        <path class="switch-frame" d="M218 392 H502 M255 392 V155 M465 392 V155 M232 155 H278 M442 155 H488" />
        <rect class="core" x="306" y="158" width="108" height="176" rx="52" />
        <path class="coil" d="M324 190 H396 M320 218 H400 M318 246 H402 M324 274 H396" />
        <path class="switch-arm" d="M258 232 L340 280 M462 232 L380 280 M310 334 L268 378 M410 334 L452 378" />
        <rect class="mechanism" x="304" y="350" width="112" height="58" rx="4" />
        <circle class="gauge" cx="360" cy="379" r="14" />
      </g>

      <g class="base-line">
        <path d="M120 428 H600" />
        <path d="M168 444 H552" />
      </g>
    </svg>

    <button
      v-for="(part, index) in parts"
      :key="part.id"
      class="hotspot"
      :class="{ active: part.id === selectedPartId, warning: part.state === '关注' }"
      :style="{ left: `${part.anchor.x}%`, top: `${part.anchor.y}%` }"
      :data-testid="`device-part-${index}`"
      type="button"
      @click="$emit('select', part.id)"
    >
      <span class="hotspot-dot"></span>
      <span class="hotspot-label">{{ String(index + 1).padStart(2, '0') }} {{ part.name }}</span>
    </button>

    <div class="axis-label x">X / 剖面轴</div>
    <div class="axis-label y">Y / 高程轴</div>
  </div>
</template>

<script setup lang="ts">
import type { DeviceDetail, DevicePart } from '@/types/drilldown'

interface PropsType {
  deviceName: string
  modelType: DeviceDetail['modelType']
  parts: DevicePart[]
  selectedPartId: string
}

defineProps<PropsType>()
defineEmits<{ (event: 'select', partId: string): void }>()
</script>

<style lang="scss" scoped>
.structure-canvas {
  position: relative;
  min-height: 570px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 44%, rgb(16 118 172 / 28%), transparent 40%),
    linear-gradient(180deg, rgb(4 24 47 / 45%), rgb(2 13 29 / 72%));
  border: 1px solid rgb(70 191 238 / 19%);
  &::before,
  &::after {
    position: absolute;
    width: 32px;
    height: 32px;
    pointer-events: none;
    content: '';
    border-color: #43d6ff;
  }
  &::before {
    top: 10px;
    left: 10px;
    border-top: 2px solid;
    border-left: 2px solid;
  }
  &::after {
    right: 10px;
    bottom: 10px;
    border-right: 2px solid;
    border-bottom: 2px solid;
  }
}
svg {
  position: absolute;
  inset: 2% 3%;
  width: 94%;
  height: 92%;
}
.grid-lines path {
  fill: none;
  stroke: rgb(52 155 201 / 10%);
  stroke-width: 1;
}
.device-drawing {
  filter: url('#glow');
}
.shell {
  fill: url('#shell');
  stroke: #5bd9ff;
  stroke-dasharray: 9 4;
  stroke-width: 2;
}
.top,
.switch-frame,
.switch-arm {
  fill: none;
  stroke: #81e6ff;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 7;
}
.core {
  fill: rgb(25 78 110 / 58%);
  stroke: #61e2ff;
  stroke-width: 2;
}
.coil {
  fill: none;
  stroke: url('#copper');
  stroke-linecap: round;
  stroke-width: 10;
}
.cooler {
  fill: none;
  stroke: #50c9f5;
  stroke-width: 5;
}
.gauge {
  fill: rgb(9 30 50 / 85%);
  stroke: #ffe185;
  stroke-width: 3;
}
.mechanism {
  fill: url('#shell');
  stroke: #56d9ff;
  stroke-width: 2;
}
.base-line path {
  fill: none;
  stroke: rgb(92 219 255 / 55%);
  stroke-width: 2;
}
.hotspot {
  position: absolute;
  z-index: 3;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0;
  font: inherit;
  color: #c8f4ff;
  cursor: pointer;
  background: transparent;
  border: 0;
  transform: translate(-8px, -50%);
  &::before {
    position: absolute;
    right: calc(100% - 9px);
    width: 34px;
    height: 1px;
    content: '';
    background: #5ddcff;
    opacity: 0.5;
  }
  &:hover,
  &.active {
    z-index: 5;
    .hotspot-dot {
      background: #fff;
      box-shadow: 0 0 0 5px rgb(69 220 255 / 24%), 0 0 16px #45dcff;
    }
    .hotspot-label {
      color: #fff;
      background: rgb(13 110 154 / 92%);
      border-color: #5de4ff;
    }
  }
  &.warning .hotspot-dot {
    background: #ffc756;
    box-shadow: 0 0 10px #ffc756;
  }
}
.hotspot-dot {
  flex: none;
  width: 10px;
  height: 10px;
  background: #53dfff;
  border: 2px solid rgb(222 250 255 / 86%);
  border-radius: 50%;
  transition: 0.2s ease;
}
.hotspot-label {
  min-width: 106px;
  padding: 7px 10px;
  font-size: 12px;
  text-align: left;
  white-space: nowrap;
  background: rgb(6 44 72 / 86%);
  border: 1px solid rgb(85 210 249 / 36%);
  transition: 0.2s ease;
}
.scan-line {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  height: 2px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, #5ce4ff, transparent);
  box-shadow: 0 0 16px #5ce4ff;
  opacity: 0.45;
  animation: scan 5s linear infinite;
}
.axis-label {
  position: absolute;
  font-size: 10px;
  color: rgb(117 201 228 / 54%);
  letter-spacing: 2px;
  &.x {
    right: 26px;
    bottom: 18px;
  }
  &.y {
    top: 28px;
    left: 18px;
    writing-mode: vertical-rl;
  }
}

@keyframes scan {
  from { top: 5%; }
  to { top: 95%; }
}
</style>
