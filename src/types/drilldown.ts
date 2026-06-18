export type DrilldownKind = 'device' | 'building'

export interface DrilldownTarget {
  id: string
  kind: DrilldownKind
  name: string
  category: string
  position: [number, number, number]
}

export interface MetricItem {
  label: string
  value: string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
}

export interface DevicePart {
  id: string
  name: string
  state: '正常' | '关注' | '检修'
  description: string
  temperature: number
  lastInspection: string
  anchor: {
    x: number
    y: number
  }
}

export interface DeviceDetail extends DrilldownTarget {
  kind: 'device'
  code: string
  modelType: 'reactor' | 'transformer' | 'switch'
  status: '运行中' | '待机' | '检修中'
  voltageLevel: string
  location: string
  health: number
  loadRate: number
  lastInspection: string
  nextMaintenance: string
  metrics: MetricItem[]
  parts: DevicePart[]
  recentEvents: Array<{
    time: string
    content: string
    level: 'info' | 'warning'
  }>
}

export interface BuildingRoom {
  id: string
  name: string
  type: string
  status: '正常' | '关注' | '检修'
  temperature: number
  humidity: number
  equipmentCount: number
  personnel: number
  x: number
  y: number
  width: number
  height: number
}

export interface BuildingFloor {
  id: string
  name: string
  elevation: string
  rooms: BuildingRoom[]
}

export interface BuildingDetail extends DrilldownTarget {
  kind: 'building'
  code: string
  status: '运行中' | '待机' | '检修中'
  area: number
  completedAt: string
  manager: string
  floors: BuildingFloor[]
  systems: Array<{
    name: string
    status: '正常' | '关注'
    value: string
  }>
  metrics: MetricItem[]
}
