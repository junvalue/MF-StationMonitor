<template>
  <header class="detail-header">
    <button class="back-button" data-testid="detail-back" type="button" @click="$emit('back')">
      <i class="fa-regular fa-arrow-left"></i>
      返回厂区总览
    </button>
    <div class="title-wrap">
      <div class="eyebrow">{{ eyebrow }}</div>
      <h1>{{ title }}</h1>
      <div class="subtitle">{{ subtitle }}</div>
    </div>
    <div class="header-state">
      <span class="pulse"></span>
      MOCK DATA · {{ status }}
    </div>
  </header>
</template>

<script setup lang="ts">
interface PropsType {
  eyebrow: string
  title: string
  subtitle: string
  status: string
}

defineProps<PropsType>()
defineEmits<{ (event: 'back'): void }>()
</script>

<style lang="scss" scoped>
.detail-header {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  align-items: center;
  height: 92px;
  padding: 0 38px;
  color: #fff;
  background: linear-gradient(180deg, rgb(5 29 57 / 98%), rgb(4 17 37 / 92%));
  border-bottom: 1px solid rgb(61 197 255 / 42%);
  box-shadow: 0 8px 32px rgb(0 0 0 / 28%);
  &::after {
    position: absolute;
    right: 28%;
    bottom: -1px;
    left: 28%;
    height: 2px;
    content: '';
    background: linear-gradient(90deg, transparent, #43d9ff, transparent);
    box-shadow: 0 0 14px #43d9ff;
  }
}
.back-button {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  justify-self: start;
  height: 42px;
  padding: 0 18px;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  font: inherit;
  color: #aeeeff;
  cursor: pointer;
  background: rgb(14 73 111 / 45%);
  border: 1px solid rgb(77 208 255 / 46%);
  transition: 0.2s ease;
  &:hover {
    color: #fff;
    background: rgb(26 129 176 / 68%);
    box-shadow: 0 0 18px rgb(67 217 255 / 24%);
  }
}
.title-wrap {
  min-width: 0;
  text-align: center;
  .eyebrow {
    margin-bottom: 2px;
    font-size: 12px;
    color: #55dbff;
    letter-spacing: 5px;
  }
  h1 {
    overflow: hidden;
    font-family: DouYu;
    font-size: 28px;
    font-weight: 400;
    line-height: 34px;
    color: #f4fcff;
    text-overflow: ellipsis;
    text-shadow: 0 0 16px rgb(71 205 255 / 44%);
    white-space: nowrap;
  }
  .subtitle {
    font-size: 11px;
    color: rgb(174 221 238 / 66%);
    letter-spacing: 1.5px;
  }
}
.header-state {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-self: end;
  font-size: 13px;
  color: #9de9c8;
  letter-spacing: 1px;
}
.pulse {
  width: 8px;
  height: 8px;
  background: #54f0b0;
  border-radius: 50%;
  box-shadow: 0 0 12px #54f0b0;
  animation: pulse 1.8s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.45;
    transform: scale(0.75);
  }
}
</style>
