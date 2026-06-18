<template>
  <div class="detail-page">
    <DetailPageHeader
      eyebrow="EQUIPMENT INTERNAL DRILL-DOWN"
      :title="device.name"
      :subtitle="`${device.code} · ${device.location}`"
      :status="device.status"
      @back="$emit('back')"
    />

    <main class="detail-main">
      <aside class="side-column">
        <section class="panel identity-panel">
          <div class="panel-title">设备档案 <span>PROFILE</span></div>
          <div class="device-symbol" :class="`symbol-${device.modelType}`">
            <i :class="deviceIcon"></i>
            <span>{{ device.voltageLevel }}</span>
          </div>
          <div class="status-line">
            <span class="status-dot"></span>
            {{ device.status }}
          </div>
          <dl class="info-list">
            <div><dt>设备类型</dt><dd>{{ device.category }}</dd></div>
            <div><dt>设备编码</dt><dd>{{ device.code }}</dd></div>
            <div><dt>所属位置</dt><dd>{{ device.location }}</dd></div>
            <div><dt>最近巡检</dt><dd>{{ device.lastInspection }}</dd></div>
            <div><dt>下次维保</dt><dd>{{ device.nextMaintenance }}</dd></div>
          </dl>
        </section>

        <section class="panel health-panel">
          <div class="panel-title">健康评估 <span>HEALTH</span></div>
          <div class="health-ring" :style="{ '--health': `${device.health * 3.6}deg` }">
            <div><strong>{{ device.health }}</strong><small>健康指数</small></div>
          </div>
          <div class="health-bars">
            <div>
              <span>运行可靠度</span><b>97%</b>
              <i><em style="width: 97%"></em></i>
            </div>
            <div>
              <span>绝缘寿命</span><b>91%</b>
              <i><em style="width: 91%"></em></i>
            </div>
            <div>
              <span>机械状态</span><b>94%</b>
              <i><em style="width: 94%"></em></i>
            </div>
          </div>
        </section>
      </aside>

      <section class="center-column">
        <div class="section-heading">
          <div>
            <span>INTERNAL STRUCTURE / 结构剖面</span>
            <h2>设备内部结构透视</h2>
          </div>
          <div class="legend"><i></i>正常部件 <i class="warning"></i>关注部件</div>
        </div>
        <DeviceStructureDiagram
          :device-name="device.name"
          :model-type="device.modelType"
          :parts="device.parts"
          :selected-part-id="selectedPart.id"
          @select="selectPart"
        />
        <div class="metric-grid">
          <article v-for="metric in device.metrics" :key="metric.label" class="metric-card">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}<small>{{ metric.unit }}</small></strong>
            <i :class="metric.trend">{{ trendText(metric.trend) }}</i>
          </article>
        </div>
      </section>

      <aside class="side-column right-column">
        <section class="panel part-panel">
          <div class="panel-title">部件详情 <span>COMPONENT</span></div>
          <div class="part-index">{{ selectedIndex }}</div>
          <div class="part-name-row">
            <h3>{{ selectedPart.name }}</h3>
            <span :class="`state-${selectedPart.state}`">{{ selectedPart.state }}</span>
          </div>
          <p>{{ selectedPart.description }}</p>
          <div class="part-readings">
            <div><span>实时温度</span><strong>{{ selectedPart.temperature }} ℃</strong></div>
            <div><span>最近检查</span><strong>{{ selectedPart.lastInspection }}</strong></div>
          </div>
          <div class="part-selector">
            <button
              v-for="(part, index) in device.parts"
              :key="part.id"
              :class="{ active: part.id === selectedPart.id }"
              type="button"
              @click="selectPart(part.id)"
            >
              <span>{{ String(index + 1).padStart(2, '0') }}</span>{{ part.name }}
            </button>
          </div>
        </section>

        <section class="panel event-panel">
          <div class="panel-title">运行事件 <span>EVENTS</span></div>
          <div class="event-list">
            <div v-for="event in device.recentEvents" :key="`${event.time}-${event.content}`" class="event-item">
              <i :class="event.level"></i>
              <div><span>{{ event.time }}</span><p>{{ event.content }}</p></div>
            </div>
          </div>
        </section>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DetailPageHeader from '@/components/DetailPageHeader.vue'
import DeviceStructureDiagram from '@/components/DeviceStructureDiagram.vue'
import type { DeviceDetail, MetricItem } from '@/types/drilldown'

const props = defineProps<{ device: DeviceDetail }>()
defineEmits<{ (event: 'back'): void }>()

const selectedPartId = ref(props.device.parts[0].id)
const selectedPart = computed(
  () => props.device.parts.find((part) => part.id === selectedPartId.value) ?? props.device.parts[0]
)
const selectedIndex = computed(() =>
  String(props.device.parts.findIndex((part) => part.id === selectedPart.value.id) + 1).padStart(2, '0')
)
const deviceIcon = computed(() => ({
  reactor: 'fa-solid fa-wave-square',
  transformer: 'fa-solid fa-transformer-bolt',
  switch: 'fa-solid fa-toggle-large-on',
})[props.device.modelType])

watch(
  () => props.device.id,
  () => {
    selectedPartId.value = props.device.parts[0].id
  }
)

const selectPart = (partId: string) => {
  selectedPartId.value = partId
}

const trendText = (trend: MetricItem['trend']) => ({
  up: '↗ 较昨日 +1.2%',
  down: '↘ 较昨日 -0.8%',
  stable: '— 运行稳定',
})[trend ?? 'stable']
</script>

<style lang="scss" scoped>
/* stylelint-disable declaration-block-single-line-max-declarations, selector-class-pattern */
.detail-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #d9f5ff;
  background:
    radial-gradient(circle at 50% 25%, rgb(12 91 140 / 24%), transparent 36%),
    url('@/assets/page_bg.png') center / cover,
    #020a16;
}
.detail-main {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr) 350px;
  gap: 18px;
  height: calc(100% - 92px);
  padding: 18px 24px 22px;
}
.side-column,
.center-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  min-height: 0;
}
.panel {
  position: relative;
  padding: 18px;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  background: linear-gradient(145deg, rgb(7 39 70 / 88%), rgb(3 19 40 / 90%));
  border: 1px solid rgb(61 176 224 / 24%);
  box-shadow: inset 0 0 28px rgb(22 121 167 / 8%);
}
.panel-title {
  padding-bottom: 12px;
  margin-bottom: 14px;
  font-size: 16px;
  color: #e9fbff;
  border-bottom: 1px solid rgb(72 181 224 / 20%);
  span {
    float: right;
    font-size: 10px;
    color: rgb(102 208 241 / 54%);
    letter-spacing: 2px;
  }
}
.identity-panel { flex: 1.15; }
.health-panel { flex: 0.85; }
.part-panel { flex: 1.2; }
.event-panel { flex: 0.8; }
.device-symbol {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  margin: 10px auto 2px;
  font-size: 34px;
  color: #64ddff;
  background: radial-gradient(circle, rgb(25 133 177 / 28%), transparent 68%);
  border: 1px solid rgb(77 211 255 / 44%);
  border-radius: 50%;
  box-shadow: 0 0 24px rgb(57 199 246 / 12%);
  &::before,
  &::after {
    position: absolute;
    inset: -8px;
    content: '';
    border: 1px dashed rgb(84 219 255 / 28%);
    border-radius: 50%;
  }
  &::after {
    inset: 10px;
    border-color: rgb(94 221 255 / 12%);
    border-style: solid;
  }
  span {
    position: absolute;
    bottom: -8px;
    padding: 2px 7px;
    font-size: 10px;
    color: #ffe29a;
    background: #082441;
  }
}
.status-line {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin: 20px 0 10px;
  font-size: 13px;
  color: #70edb6;
}
.status-dot {
  width: 7px;
  height: 7px;
  background: #55ecad;
  border-radius: 50%;
  box-shadow: 0 0 9px #55ecad;
}
.info-list {
  margin: 0;
  div {
    display: grid;
    grid-template-columns: 82px 1fr;
    gap: 12px;
    padding: 9px 0;
    font-size: 12px;
    border-bottom: 1px dashed rgb(83 167 205 / 16%);
  }
  dt { color: rgb(163 211 229 / 56%); }
  dd { margin: 0; color: #d7f3fb; text-align: right; }
}
.health-ring {
  display: grid;
  place-items: center;
  width: 118px;
  height: 118px;
  margin: 8px auto 16px;
  background: conic-gradient(#51e1b0 var(--health), rgb(31 84 105 / 32%) 0);
  border-radius: 50%;
  &::before {
    width: 88px;
    height: 88px;
    content: '';
    background: #071d35;
    border-radius: 50%;
  }
  div {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  strong { font-family: DsDigital; font-size: 34px; color: #7af1c4; }
  small { font-size: 10px; color: rgb(177 223 234 / 64%); }
}
.health-bars > div {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 5px;
  margin-top: 10px;
  font-size: 11px;
  color: rgb(188 226 238 / 68%);
  b { color: #69e7bc; }
  i {
    grid-column: 1 / -1;
    height: 3px;
    overflow: hidden;
    background: rgb(52 111 130 / 35%);
    em { display: block; height: 100%; background: linear-gradient(90deg, #1d91c2, #59e8b8); }
  }
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 64px;
  padding: 0 6px;
  span { font-size: 10px; color: #54d7ff; letter-spacing: 3px; }
  h2 { margin-top: 4px; font-size: 21px; font-weight: 400; color: #f0fbff; }
}
.legend {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  color: rgb(175 221 236 / 60%);
  i { width: 7px; height: 7px; margin-left: 8px; background: #52e2bb; border-radius: 50%; box-shadow: 0 0 8px #52e2bb; }
  i.warning { background: #ffc656; box-shadow: 0 0 8px #ffc656; }
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  min-height: 126px;
}
.metric-card {
  position: relative;
  padding: 15px;
  overflow: hidden;
  background: linear-gradient(135deg, rgb(8 49 79 / 78%), rgb(5 26 51 / 92%));
  border: 1px solid rgb(64 181 226 / 22%);
  &::after {
    position: absolute;
    right: -16px;
    bottom: -28px;
    width: 70px;
    height: 70px;
    content: '';
    border: 1px solid rgb(79 211 255 / 14%);
    transform: rotate(45deg);
  }
  > span { display: block; font-size: 11px; color: rgb(167 215 232 / 58%); }
  strong { display: block; margin: 8px 0 5px; font-family: DsDigital; font-size: 30px; font-weight: 400; color: #7ee7ff; }
  small { margin-left: 4px; font-family: inherit; font-size: 11px; color: #9fc7d4; }
  > i { font-size: 10px; font-style: normal; color: #61dfb2; }
  > i.up { color: #ffd276; }
}
.part-index {
  font-family: DsDigital;
  font-size: 48px;
  line-height: 50px;
  color: rgb(85 217 255 / 26%);
}
.part-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 12px;
  h3 { font-size: 21px; font-weight: 400; color: #f2fcff; }
  span { padding: 4px 8px; font-size: 10px; color: #6ce5b5; background: rgb(48 197 139 / 12%); border: 1px solid rgb(81 225 172 / 25%); }
  .state-关注 { color: #ffd06f; background: rgb(255 186 70 / 10%); border-color: rgb(255 198 92 / 28%); }
}
.part-panel > p {
  min-height: 56px;
  font-size: 12px;
  line-height: 1.7;
  color: rgb(197 230 239 / 70%);
}
.part-readings {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 8px;
  margin: 14px 0;
  div { padding: 10px; background: rgb(15 70 102 / 34%); }
  span { display: block; margin-bottom: 5px; font-size: 10px; color: rgb(164 209 224 / 55%); }
  strong { font-size: 12px; font-weight: 400; color: #8ce7ff; }
}
.part-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
  button {
    display: flex;
    gap: 10px;
    align-items: center;
    height: 34px;
    padding: 0 10px;
    font: inherit;
    font-size: 11px;
    color: rgb(189 225 236 / 68%);
    text-align: left;
    cursor: pointer;
    background: rgb(7 38 64 / 42%);
    border: 1px solid transparent;
    span { color: rgb(87 207 245 / 55%); }
    &:hover,
    &.active { color: #fff; background: rgb(17 100 137 / 55%); border-color: rgb(83 215 255 / 40%); }
  }
}
.event-list { display: flex; flex-direction: column; gap: 17px; }
.event-item {
  display: grid;
  grid-template-columns: 10px 1fr;
  gap: 10px;
  > i { width: 7px; height: 7px; margin-top: 5px; background: #55dfb1; border-radius: 50%; box-shadow: 0 0 8px #55dfb1; }
  > i.warning { background: #ffc656; box-shadow: 0 0 8px #ffc656; }
  span { font-size: 10px; color: #54ccef; }
  p { margin-top: 4px; font-size: 11px; line-height: 1.5; color: rgb(191 225 235 / 66%); }
}
</style>
