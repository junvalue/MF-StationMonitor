<template>
  <div class="building-page">
    <DetailPageHeader
      eyebrow="BUILDING INTERIOR DRILL-DOWN"
      :title="building.name"
      :subtitle="`${building.code} · ${building.category}`"
      :status="building.status"
      @back="$emit('back')"
    />

    <main class="building-main">
      <aside class="side-column">
        <section class="panel profile-panel">
          <div class="panel-title">厂房档案 <span>PROFILE</span></div>
          <div class="building-mark">
            <i class="fa-regular fa-buildings"></i>
            <div><strong>{{ building.floors.length }}</strong><span>楼层</span></div>
          </div>
          <dl class="info-list">
            <div><dt>建筑编号</dt><dd>{{ building.code }}</dd></div>
            <div><dt>建筑面积</dt><dd>{{ building.area.toLocaleString() }} ㎡</dd></div>
            <div><dt>投运日期</dt><dd>{{ building.completedAt }}</dd></div>
            <div><dt>安全责任人</dt><dd>{{ building.manager }}</dd></div>
            <div><dt>当前状态</dt><dd class="ok">● {{ building.status }}</dd></div>
          </dl>
        </section>

        <section class="panel systems-panel">
          <div class="panel-title">建筑子系统 <span>SYSTEMS</span></div>
          <div class="system-list">
            <article v-for="system in building.systems" :key="system.name">
              <i :class="system.status"></i>
              <div><strong>{{ system.name }}</strong><span>{{ system.value }}</span></div>
              <b :class="system.status">{{ system.status }}</b>
            </article>
          </div>
        </section>
      </aside>

      <section class="plan-column">
        <div class="plan-header">
          <div>
            <span>INTERIOR FLOOR PLAN / 室内平面</span>
            <h2>{{ currentFloor.name }}内部结构</h2>
          </div>
          <div class="floor-tabs" role="tablist" aria-label="厂房楼层">
            <button
              v-for="floor in building.floors"
              :key="floor.id"
              :class="{ active: floor.id === currentFloor.id }"
              :data-testid="`floor-${floor.id}`"
              type="button"
              role="tab"
              @click="selectFloor(floor.id)"
            >
              {{ floor.name }}<small>{{ floor.elevation }}</small>
            </button>
          </div>
        </div>

        <div class="floor-plan">
          <div class="north"><i class="fa-solid fa-location-arrow"></i><span>N</span></div>
          <div class="scale">0&nbsp;&nbsp;&nbsp;&nbsp;5&nbsp;&nbsp;&nbsp;&nbsp;10m</div>
          <button
            v-for="(room, index) in currentFloor.rooms"
            :key="room.id"
            class="room"
            :class="{ active: room.id === selectedRoom.id, warning: room.status === '关注' }"
            :style="roomStyle(room)"
            :data-testid="`building-room-${index}`"
            type="button"
            @click="selectedRoomId = room.id"
          >
            <span class="room-code">{{ room.id }}</span>
            <strong>{{ room.name }}</strong>
            <small>{{ room.equipmentCount }} 台设备</small>
            <i></i>
          </button>
          <div class="corridor horizontal">设备运输通道</div>
          <div class="plan-note">点击房间查看环境与设备详情</div>
        </div>

        <div class="metric-grid">
          <article v-for="metric in building.metrics" :key="metric.label">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}<small>{{ metric.unit }}</small></strong>
            <i>{{ metric.trend === 'down' ? '↘ 节能 3.2%' : '— 状态稳定' }}</i>
          </article>
        </div>
      </section>

      <aside class="side-column right-column">
        <section class="panel room-panel">
          <div class="panel-title">空间详情 <span>ROOM</span></div>
          <div class="room-heading">
            <div class="room-icon"><i class="fa-regular fa-door-open"></i></div>
            <div><span>{{ selectedRoom.id }}</span><h3>{{ selectedRoom.name }}</h3></div>
            <b :class="selectedRoom.status">{{ selectedRoom.status }}</b>
          </div>
          <div class="environment-grid">
            <article><i class="fa-regular fa-temperature-half"></i><span>温度</span><strong>{{ selectedRoom.temperature.toFixed(1) }}℃</strong></article>
            <article><i class="fa-regular fa-droplet"></i><span>湿度</span><strong>{{ selectedRoom.humidity }}%</strong></article>
            <article><i class="fa-regular fa-microchip"></i><span>设备</span><strong>{{ selectedRoom.equipmentCount }}台</strong></article>
            <article><i class="fa-regular fa-user-helmet-safety"></i><span>人员</span><strong>{{ selectedRoom.personnel }}人</strong></article>
          </div>
          <div class="room-assets">
            <div><span>烟感探测器</span><b>4 / 4 在线</b></div>
            <div><span>温湿度传感器</span><b>2 / 2 在线</b></div>
            <div><span>门禁控制器</span><b>1 / 1 在线</b></div>
            <div><span>视频监控</span><b>2 / 2 在线</b></div>
          </div>
        </section>

        <section class="panel flow-panel">
          <div class="panel-title">室内动线 <span>ROUTE</span></div>
          <div class="route-steps">
            <div class="done"><i>1</i><span>主入口门禁<strong>通行正常</strong></span></div>
            <div class="done"><i>2</i><span>安全缓冲区<strong>无告警</strong></span></div>
            <div><i>3</i><span>{{ selectedRoom.name }}<strong>当前查看</strong></span></div>
          </div>
        </section>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DetailPageHeader from '@/components/DetailPageHeader.vue'
import type { BuildingDetail, BuildingRoom } from '@/types/drilldown'

const props = defineProps<{ building: BuildingDetail }>()
defineEmits<{ (event: 'back'): void }>()

const selectedFloorId = ref(props.building.floors[0].id)
const selectedRoomId = ref(props.building.floors[0].rooms[0].id)
const currentFloor = computed(
  () => props.building.floors.find((floor) => floor.id === selectedFloorId.value) ?? props.building.floors[0]
)
const selectedRoom = computed(
  () => currentFloor.value.rooms.find((room) => room.id === selectedRoomId.value) ?? currentFloor.value.rooms[0]
)

watch(
  () => props.building.id,
  () => {
    selectedFloorId.value = props.building.floors[0].id
    selectedRoomId.value = props.building.floors[0].rooms[0].id
  }
)

const selectFloor = (floorId: string) => {
  selectedFloorId.value = floorId
  selectedRoomId.value = currentFloor.value.rooms[0].id
}

const roomStyle = (room: BuildingRoom) => ({
  left: `${room.x}%`,
  top: `${room.y}%`,
  width: `${room.width}%`,
  height: `${room.height}%`,
})
</script>

<style lang="scss" scoped>
/* stylelint-disable declaration-block-single-line-max-declarations, selector-class-pattern */
.building-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #d9f5ff;
  background:
    radial-gradient(circle at 50% 35%, rgb(11 102 146 / 22%), transparent 39%),
    url('@/assets/page_bg.png') center / cover,
    #020a16;
}
.building-main {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 340px;
  gap: 18px;
  height: calc(100% - 92px);
  padding: 18px 24px 22px;
}
.side-column,
.plan-column {
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
  span { float: right; font-size: 10px; color: rgb(102 208 241 / 54%); letter-spacing: 2px; }
}
.profile-panel { flex: 1; }
.systems-panel { flex: 0.78; }
.room-panel { flex: 1.15; }
.flow-panel { flex: 0.63; }
.building-mark {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
  height: 112px;
  margin: 2px 0 14px;
  background: linear-gradient(90deg, transparent, rgb(18 103 145 / 24%), transparent);
  > i { font-size: 58px; color: #63d7ff; text-shadow: 0 0 22px rgb(63 209 255 / 35%); }
  div { display: flex; flex-direction: column; align-items: center; }
  strong { font-family: DsDigital; font-size: 38px; font-weight: 400; color: #ffe08a; }
  span { font-size: 10px; color: rgb(184 222 233 / 60%); }
}
.info-list {
  margin: 0;
  div { display: grid; grid-template-columns: 90px 1fr; gap: 10px; padding: 11px 0; font-size: 12px; border-bottom: 1px dashed rgb(83 167 205 / 16%); }
  dt { color: rgb(163 211 229 / 56%); }
  dd { margin: 0; color: #d7f3fb; text-align: right; }
  dd.ok { color: #63e4af; }
}
.system-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  article { display: grid; grid-template-columns: 10px 1fr auto; gap: 10px; align-items: center; padding: 10px; background: rgb(9 51 80 / 46%); border: 1px solid rgb(71 175 213 / 14%); }
  > article > i { width: 7px; height: 7px; background: #53e2ae; border-radius: 50%; box-shadow: 0 0 8px #53e2ae; }
  > article > i.关注 { background: #ffc65d; box-shadow: 0 0 8px #ffc65d; }
  div { display: flex; flex-direction: column; gap: 3px; }
  strong { font-size: 12px; font-weight: 400; }
  span { font-size: 10px; color: rgb(162 209 224 / 54%); }
  b { font-size: 10px; font-weight: 400; color: #5ce0ae; }
  b.关注 { color: #ffc65d; }
}
.plan-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 70px;
  padding: 0 6px;
  > div > span { font-size: 10px; color: #54d7ff; letter-spacing: 3px; }
  h2 { margin-top: 5px; font-size: 21px; font-weight: 400; color: #f0fbff; }
}
.floor-tabs {
  display: flex;
  gap: 8px;
  button {
    min-width: 88px;
    padding: 7px 13px;
    font: inherit;
    font-size: 12px;
    color: rgb(181 220 233 / 65%);
    cursor: pointer;
    background: rgb(8 43 70 / 72%);
    border: 1px solid rgb(69 180 221 / 24%);
    small { display: block; margin-top: 2px; font-size: 8px; color: rgb(115 194 221 / 50%); }
    &:hover,
    &.active { color: #fff; background: rgb(14 104 145 / 66%); border-color: #4ed7ff; box-shadow: 0 0 14px rgb(67 211 255 / 13%); }
  }
}
.floor-plan {
  position: relative;
  flex: 1;
  min-height: 560px;
  overflow: hidden;
  background-color: rgb(3 25 48 / 72%);
  background-image:
    linear-gradient(rgb(49 141 180 / 10%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(49 141 180 / 10%) 1px, transparent 1px),
    linear-gradient(rgb(49 141 180 / 6%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(49 141 180 / 6%) 1px, transparent 1px);
  background-position: center;
  background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
  border: 1px solid rgb(70 191 238 / 24%);
  box-shadow: inset 0 0 60px rgb(18 119 167 / 10%);
  &::before,
  &::after { position: absolute; z-index: 3; width: 36px; height: 36px; pointer-events: none; content: ''; border-color: #4cd7ff; }
  &::before { top: 10px; left: 10px; border-top: 2px solid; border-left: 2px solid; }
  &::after { right: 10px; bottom: 10px; border-right: 2px solid; border-bottom: 2px solid; }
}
.room {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  font: inherit;
  color: #cceef8;
  cursor: pointer;
  background: linear-gradient(135deg, rgb(15 82 113 / 50%), rgb(6 42 72 / 36%));
  border: 2px solid rgb(75 196 236 / 44%);
  box-shadow: inset 0 0 28px rgb(63 199 241 / 7%);
  transition: 0.22s ease;
  &::before,
  &::after { position: absolute; content: ''; background: #57d9ff; opacity: 0.35; }
  &::before { top: -2px; left: 12px; width: 32px; height: 3px; }
  &::after { right: -2px; bottom: 12px; width: 3px; height: 32px; }
  &:hover,
  &.active { z-index: 2; color: #fff; background: linear-gradient(135deg, rgb(17 124 164 / 75%), rgb(7 62 95 / 64%)); border-color: #64e0ff; box-shadow: inset 0 0 34px rgb(77 215 255 / 14%), 0 0 20px rgb(62 211 255 / 18%); transform: translateY(-2px); }
  &.warning { border-color: rgb(255 195 81 / 62%); }
  &.warning > i { background: #ffc657; box-shadow: 0 0 9px #ffc657; }
  > strong { font-size: 15px; font-weight: 400; }
  > small { font-size: 10px; color: rgb(174 217 230 / 52%); }
  > i { position: absolute; top: 10px; right: 10px; width: 6px; height: 6px; background: #57e0ad; border-radius: 50%; box-shadow: 0 0 8px #57e0ad; }
}
.room-code { position: absolute; top: 8px; left: 10px; font-family: DsDigital; font-size: 10px; color: rgb(107 210 243 / 55%); }
.corridor { position: absolute; z-index: 1; display: flex; align-items: center; justify-content: center; font-size: 9px; color: rgb(131 207 229 / 42%); letter-spacing: 3px; background: repeating-linear-gradient(90deg, transparent 0 16px, rgb(83 195 230 / 8%) 16px 32px); border: 1px dashed rgb(84 197 233 / 18%); }
.corridor.horizontal { right: 4%; bottom: 1.5%; left: 4%; height: 4%; }
.north { position: absolute; top: 22px; right: 24px; z-index: 4; display: flex; flex-direction: column; align-items: center; color: #76ddfa; }
.north i { font-size: 20px; transform: rotate(-45deg); }
.north span { margin-top: 4px; font-family: DsDigital; font-size: 12px; }
.scale { position: absolute; bottom: 16px; left: 24px; z-index: 4; padding-top: 4px; font-family: DsDigital; font-size: 9px; color: rgb(118 206 233 / 65%); border-top: 2px solid rgb(89 206 240 / 55%); }
.plan-note { position: absolute; right: 28px; bottom: 17px; z-index: 4; font-size: 9px; color: rgb(115 199 226 / 44%); letter-spacing: 1px; }
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  min-height: 118px;
  article { padding: 14px; background: linear-gradient(135deg, rgb(8 49 79 / 78%), rgb(5 26 51 / 92%)); border: 1px solid rgb(64 181 226 / 22%); }
  span { display: block; font-size: 10px; color: rgb(167 215 232 / 58%); }
  strong { display: block; margin: 7px 0 4px; font-family: DsDigital; font-size: 28px; font-weight: 400; color: #7ee7ff; }
  small { margin-left: 4px; font-family: inherit; font-size: 10px; color: #9fc7d4; }
  i { font-size: 9px; font-style: normal; color: #61dfb2; }
}
.room-heading {
  display: grid;
  grid-template-columns: 52px 1fr auto;
  gap: 12px;
  align-items: center;
  margin: 6px 0 18px;
  .room-icon { display: grid; place-items: center; width: 48px; height: 48px; font-size: 21px; color: #69ddff; background: rgb(15 101 139 / 34%); border: 1px solid rgb(87 210 248 / 30%); }
  span { font-size: 9px; color: #57cbea; letter-spacing: 1px; }
  h3 { margin-top: 4px; font-size: 18px; font-weight: 400; color: #fff; }
  b { padding: 4px 7px; font-size: 9px; font-weight: 400; color: #61e2b0; background: rgb(61 211 157 / 11%); border: 1px solid rgb(77 219 166 / 22%); }
  b.关注 { color: #ffc861; border-color: rgb(255 195 84 / 25%); }
}
.environment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  article { display: grid; grid-template-columns: 30px 1fr; column-gap: 8px; align-items: center; padding: 11px; background: rgb(10 58 88 / 44%); border: 1px solid rgb(68 174 213 / 15%); }
  i { grid-row: 1 / 3; font-size: 18px; color: #5cd8f9; }
  span { font-size: 9px; color: rgb(165 211 226 / 56%); }
  strong { font-family: DsDigital; font-size: 18px; font-weight: 400; color: #e1f8ff; }
}
.room-assets {
  margin-top: 16px;
  div { display: flex; align-items: center; justify-content: space-between; padding: 10px 4px; font-size: 11px; color: rgb(182 221 233 / 64%); border-bottom: 1px dashed rgb(78 168 201 / 18%); }
  b { font-size: 10px; font-weight: 400; color: #63dfaf; }
}
.route-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  > div { position: relative; display: grid; grid-template-columns: 28px 1fr; gap: 10px; min-height: 54px; }
  > div:not(:last-child)::after { position: absolute; top: 24px; bottom: 0; left: 12px; width: 1px; content: ''; background: rgb(78 197 232 / 30%); }
  i { z-index: 1; display: grid; place-items: center; width: 24px; height: 24px; font-family: DsDigital; font-size: 11px; font-style: normal; color: #8ee9ff; background: #0b3d5b; border: 1px solid rgb(83 203 239 / 35%); border-radius: 50%; }
  .done i { color: #6de2b5; border-color: rgb(76 220 166 / 42%); }
  span { font-size: 11px; color: #d5f1f8; }
  strong { display: block; margin-top: 3px; font-size: 9px; font-weight: 400; color: rgb(158 207 223 / 52%); }
}
</style>
