<template>
  <StationOverviewPage v-if="route.name === 'overview'" @drilldown="openDrilldown" />
  <DeviceDetailPage
    v-else-if="route.name === 'device' && currentDevice"
    :device="currentDevice"
    @back="backToOverview"
  />
  <BuildingDetailPage
    v-else-if="route.name === 'building' && currentBuilding"
    :building="currentBuilding"
    @back="backToOverview"
  />
  <StationOverviewPage v-else @drilldown="openDrilldown" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import StationOverviewPage from '@/pages/StationOverviewPage.vue'
import DeviceDetailPage from '@/pages/DeviceDetailPage.vue'
import BuildingDetailPage from '@/pages/BuildingDetailPage.vue'
import { getBuildingDetail, getDeviceDetail } from '@/mock/drilldown'
import type { DrilldownTarget } from '@/types/drilldown'

type AppRoute =
  | { name: 'overview' }
  | { name: 'device'; id: string }
  | { name: 'building'; id: string }

const parseHash = (): AppRoute => {
  const [kind, id] = window.location.hash.replace(/^#\/?/, '').split('/')
  if (kind === 'device' && id) return { name: 'device', id: decodeURIComponent(id) }
  if (kind === 'building' && id) return { name: 'building', id: decodeURIComponent(id) }
  return { name: 'overview' }
}

const route = ref<AppRoute>(parseHash())
const currentDevice = computed(() =>
  route.value.name === 'device' ? getDeviceDetail(route.value.id) : undefined
)
const currentBuilding = computed(() =>
  route.value.name === 'building' ? getBuildingDetail(route.value.id) : undefined
)

const syncRoute = () => {
  route.value = parseHash()
}

const openDrilldown = (target: DrilldownTarget) => {
  window.location.hash = `/${target.kind}/${encodeURIComponent(target.id)}`
}

const backToOverview = () => {
  window.location.hash = '/'
}

onMounted(() => window.addEventListener('hashchange', syncRoute))
onBeforeUnmount(() => window.removeEventListener('hashchange', syncRoute))
</script>
