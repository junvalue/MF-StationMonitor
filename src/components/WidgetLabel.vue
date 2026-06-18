<template>
  <button
    class="label"
    :class="`label-${variant}`"
    :data-testid="`${variant}-drilldown-${id}`"
    type="button"
    @click="$emit('select', id)"
  >
    <span>{{ variant === 'building' ? '厂房下钻' : '设备下钻' }}</span>
    {{ name }}
  </button>
</template>
<script setup lang="ts">
interface PropsType {
  id: string
  name: string
  variant: 'device' | 'building'
}
defineProps<PropsType>()
defineEmits<{ (event: 'select', id: string): void }>()
</script>
<style lang="scss" scoped>
.label {
  display: flex;
  flex-direction: column;
  gap: 1px;
  align-items: center;
  justify-content: center;
  width: 144px;
  height: 44px;
  padding: 0;
  font-family: inherit;
  font-size: 12px;
  font-weight: bolder;
  color: #fff;
  pointer-events: all;
  cursor: pointer;
  background-image: url(@/assets/label_bg.png);
  filter: drop-shadow(0 0 5px rgb(65 205 255 / 38%));
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: 0;
  transition: 0.2s ease;
  span {
    font-size: 8px;
    font-weight: 400;
    color: #6edcff;
    letter-spacing: 2px;
    opacity: 0.85;
  }
  &:hover {
    color: #fff;
    filter: brightness(1.3) drop-shadow(0 0 9px rgb(65 205 255 / 65%));
    transform: translateY(-2px) scale(1.03);
  }
}
.label-building {
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  color: #fff4d1;
  background-image: linear-gradient(135deg, rgb(100 61 8 / 88%), rgb(35 54 67 / 94%));
  filter: drop-shadow(0 0 6px rgb(255 190 58 / 35%));
  border: 1px solid rgb(255 199 80 / 68%);
  span { color: #ffc75d; }
  &:hover {
    filter: brightness(1.25) drop-shadow(0 0 10px rgb(255 190 58 / 64%));
  }
}
</style>
