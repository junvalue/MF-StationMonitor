<template>
  <div class="layout">
    <LayoutHeader />
    <LayoutFooter />
    <LayoutLoading :loading="loading" />
    <div class="drilldown-guide">
      <span><i class="device-dot"></i>点击设备标签查看内部结构</span>
      <span><i class="building-dot"></i>点击厂房标签查看室内详情</span>
    </div>
    <div class="layout-main">
      <div class="main-left">
        <WidgetPanel04 />
        <WidgetPanel02 />
        <WidgetPanel03 />
      </div>
      <div class="main-right">
        <WidgetPanel01 />
        <WidgetPanel05 />
        <WidgetPanel06 />
      </div>
      <div ref="container" class="main-middle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import LayoutHeader from '@/components/LayoutHeader.vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
import LayoutLoading from '@/components/LayoutLoading.vue'
import WidgetPanel01 from '@/components/WidgetPanel01.vue'
import WidgetPanel02 from '@/components/WidgetPanel02.vue'
import WidgetPanel03 from '@/components/WidgetPanel03.vue'
import WidgetPanel04 from '@/components/WidgetPanel04.vue'
import WidgetPanel05 from '@/components/WidgetPanel05.vue'
import WidgetPanel06 from '@/components/WidgetPanel06.vue'
import { useStation } from '@/hooks/useStation'
import type { DrilldownTarget } from '@/types/drilldown'

const emit = defineEmits<{ (event: 'drilldown', target: DrilldownTarget): void }>()
const { container, loading, startInspect, stopInspect, startWarming, stopWarming } = useStation({
  onDrilldown: (target) => emit('drilldown', target),
})

provide('events', { startInspect, stopInspect, startWarming, stopWarming })
</script>

<style lang="scss" scoped>
/* stylelint-disable declaration-block-single-line-max-declarations */
.layout {
  width: 100%;
  height: 100%;
  background-color: #000;
  background-image: url(@/assets/page_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.drilldown-guide {
  position: absolute;
  top: 92px;
  left: 50%;
  z-index: 1000;
  display: flex;
  gap: 22px;
  align-items: center;
  padding: 7px 18px;
  font-size: 11px;
  color: rgb(209 239 248 / 74%);
  letter-spacing: 0.5px;
  pointer-events: none;
  background: rgb(4 29 50 / 74%);
  border: 1px solid rgb(78 191 229 / 20%);
  transform: translateX(-50%);
  span { display: flex; gap: 7px; align-items: center; }
  i { width: 7px; height: 7px; border-radius: 50%; }
  .device-dot { background: #4edbff; box-shadow: 0 0 8px #4edbff; }
  .building-dot { background: #ffc85a; box-shadow: 0 0 8px #ffc85a; }
}
.layout-main {
  position: relative;
  width: 100%;
  height: calc(100% - 80px);
  .main-left,
  .main-right {
    position: absolute;
    top: 10px;
    z-index: 999;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    grid-gap: 20px;
    width: 420px;
    height: calc(100% - 20px);
  }
  .main-left { left: 10px; }
  .main-right { right: 10px; }
  .main-middle {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    &::before {
      position: absolute;
      inset: 0;
      z-index: 99;
      width: 100%;
      height: 100%;
      pointer-events: none;
      content: '';
      background-image: radial-gradient(circle, transparent 30%, #000 60%);
    }
  }
}
</style>
