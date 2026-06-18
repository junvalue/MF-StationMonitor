import type {
  BuildingDetail,
  BuildingFloor,
  DeviceDetail,
  DevicePart,
  DrilldownTarget,
} from '@/types/drilldown'

const deviceGroups = [
  {
    prefix: 'RE',
    type: 'reactor' as const,
    category: '550kV并联电抗器',
    suffix: '550KV I线高抗',
    z: -22,
    y: 8,
  },
  {
    prefix: 'TR',
    type: 'transformer' as const,
    category: '主变压器',
    suffix: '变压器',
    z: -6,
    y: 8,
  },
  {
    prefix: 'SW',
    type: 'switch' as const,
    category: '隔离开关',
    suffix: '隔离开关',
    z: 14,
    y: 6,
  },
]

const xPositions = [-32, -20.2, -8.4, 3.4, 15.2, 27]

const partTemplates: Record<DeviceDetail['modelType'], Omit<DevicePart, 'id'>[]> = {
  reactor: [
    {
      name: '铁芯柱',
      state: '正常',
      description: '降低磁路损耗并约束主磁通，当前振动和接地电流均在正常范围内。',
      temperature: 56.2,
      lastInspection: '2026-06-16 09:20',
      anchor: { x: 50, y: 26 },
    },
    {
      name: '电抗线圈',
      state: '正常',
      description: '承担无功补偿，线圈层间绝缘状态良好，未发现局部放电异常。',
      temperature: 62.8,
      lastInspection: '2026-06-16 09:25',
      anchor: { x: 37, y: 45 },
    },
    {
      name: '绝缘支架',
      state: '正常',
      description: '固定线圈并保持电气间隙，表面清洁度和绝缘电阻满足运行要求。',
      temperature: 41.5,
      lastInspection: '2026-06-16 09:32',
      anchor: { x: 64, y: 52 },
    },
    {
      name: '冷却风道',
      state: '关注',
      description: '用于带走线圈热量，2号风道风速较基准值下降 6%，建议持续观察。',
      temperature: 48.6,
      lastInspection: '2026-06-18 14:05',
      anchor: { x: 27, y: 69 },
    },
    {
      name: '油位计',
      state: '正常',
      description: '监测绝缘油液位，当前油位处于标准刻度的 72%。',
      temperature: 39.4,
      lastInspection: '2026-06-18 14:12',
      anchor: { x: 72, y: 25 },
    },
  ],
  transformer: [
    {
      name: '铁芯',
      state: '正常',
      description: '硅钢片叠装铁芯构成主磁路，夹件接地电流稳定，无多点接地迹象。',
      temperature: 58.4,
      lastInspection: '2026-06-17 10:10',
      anchor: { x: 50, y: 26 },
    },
    {
      name: '高压绕组',
      state: '正常',
      description: '高压侧绕组绝缘介损与局放量均处于良好区间。',
      temperature: 67.1,
      lastInspection: '2026-06-17 10:18',
      anchor: { x: 36, y: 46 },
    },
    {
      name: '低压绕组',
      state: '正常',
      description: '低压侧绕组直流电阻三相平衡，负载分配稳定。',
      temperature: 64.8,
      lastInspection: '2026-06-17 10:24',
      anchor: { x: 64, y: 46 },
    },
    {
      name: '有载分接开关',
      state: '关注',
      description: '已累计动作 8,421 次，接近本周期维护阈值，建议下月安排检查。',
      temperature: 52.3,
      lastInspection: '2026-06-18 15:40',
      anchor: { x: 74, y: 65 },
    },
    {
      name: '散热器组',
      state: '正常',
      description: '八组散热器运行正常，风机联动和油泵出口压力稳定。',
      temperature: 45.9,
      lastInspection: '2026-06-18 15:46',
      anchor: { x: 24, y: 67 },
    },
  ],
  switch: [
    {
      name: '主触头',
      state: '正常',
      description: '主触头接触电阻稳定，红外测温未发现异常发热。',
      temperature: 43.6,
      lastInspection: '2026-06-15 13:20',
      anchor: { x: 50, y: 28 },
    },
    {
      name: '灭弧室',
      state: '正常',
      description: '真空度与机械行程符合要求，累计开断次数处于维护周期内。',
      temperature: 38.9,
      lastInspection: '2026-06-15 13:26',
      anchor: { x: 35, y: 47 },
    },
    {
      name: '绝缘拉杆',
      state: '正常',
      description: '传递操作力并保持绝缘，外观与爬电距离检查正常。',
      temperature: 35.2,
      lastInspection: '2026-06-15 13:32',
      anchor: { x: 64, y: 46 },
    },
    {
      name: '操作机构',
      state: '关注',
      description: '储能电机电流较上月上升 4.2%，当前不影响分合闸操作。',
      temperature: 46.7,
      lastInspection: '2026-06-18 11:05',
      anchor: { x: 28, y: 70 },
    },
    {
      name: '接地刀闸',
      state: '正常',
      description: '机械闭锁有效，接地回路导通状态正常。',
      temperature: 33.8,
      lastInspection: '2026-06-18 11:11',
      anchor: { x: 72, y: 70 },
    },
  ],
}

const createDevice = (
  group: (typeof deviceGroups)[number],
  index: number
): DeviceDetail => {
  const sequence = index + 1
  const loadBase = group.type === 'switch' ? 63 : group.type === 'reactor' ? 71 : 82
  const temperatureBase = group.type === 'switch' ? 42 : group.type === 'reactor' ? 58 : 66

  return {
    id: `${group.prefix}-${String(sequence).padStart(3, '0')}`,
    kind: 'device',
    name: `${sequence}# ${group.suffix}`,
    category: group.category,
    position: [xPositions[index], group.y, group.z],
    code: `MF-${group.prefix}-${String(sequence).padStart(3, '0')}`,
    modelType: group.type,
    status: sequence === 5 && group.type === 'switch' ? '待机' : '运行中',
    voltageLevel: group.type === 'switch' ? '220kV' : '550kV',
    location: `${sequence}号间隔 / ${group.category}区`,
    health: 96 - index - (group.type === 'transformer' ? 1 : 0),
    loadRate: loadBase + index * 2,
    lastInspection: `2026-06-${String(12 + index).padStart(2, '0')} 09:30`,
    nextMaintenance: `2026-${group.type === 'transformer' ? '08' : '09'}-${String(8 + index).padStart(2, '0')}`,
    metrics: [
      { label: '实时负载', value: String(loadBase + index * 2), unit: '%', trend: 'stable' },
      { label: '核心温度', value: (temperatureBase + index * 0.8).toFixed(1), unit: '℃', trend: 'up' },
      { label: '振动速度', value: (1.1 + index * 0.08).toFixed(2), unit: 'mm/s', trend: 'stable' },
      { label: '绝缘状态', value: (98 - index * 0.4).toFixed(1), unit: '%', trend: 'stable' },
    ],
    parts: partTemplates[group.type].map((part, partIndex) => ({
      ...part,
      id: `${group.prefix}-${sequence}-PART-${partIndex + 1}`,
      temperature: Number((part.temperature + index * 0.5).toFixed(1)),
    })),
    recentEvents: [
      { time: '今天 09:30', content: '例行巡检完成，设备整体状态正常', level: 'info' },
      { time: '06-18 15:40', content: '温度趋势轻微上升，已加入观察队列', level: 'warning' },
      { time: '06-12 11:20', content: '在线油色谱分析完成，指标正常', level: 'info' },
    ],
  }
}

export const deviceDetails: DeviceDetail[] = deviceGroups.flatMap((group) =>
  xPositions.map((_, index) => createDevice(group, index))
)

const createRooms = (floorIndex: number, variant: number): BuildingFloor['rooms'] => {
  const names = [
    ['继电保护室', '通信机房', '蓄电池室', '值班室', '备品间'],
    ['主控大厅', '调度室', '会议室', '资料室', '消防控制室'],
    ['开关设备区', '母线室', '电缆夹层', '工具间', '监控室'],
  ][variant]

  const layouts = [
    { x: 4, y: 6, width: 38, height: 38 },
    { x: 45, y: 6, width: 25, height: 38 },
    { x: 73, y: 6, width: 23, height: 38 },
    { x: 4, y: 49, width: 30, height: 44 },
    { x: 37, y: 49, width: 59, height: 44 },
  ]

  return names.map((name, index) => ({
    id: `F${floorIndex + 1}-R${index + 1}`,
    name,
    type: index < 3 ? '生产区域' : '辅助区域',
    status: index === 2 && floorIndex === 0 ? '关注' : '正常',
    temperature: 22.8 + floorIndex * 0.7 + index * 0.4,
    humidity: 43 + index * 2,
    equipmentCount: 6 + index * 4 + floorIndex * 2,
    personnel: index === 3 ? 3 : index % 2,
    ...layouts[index],
  }))
}

const buildingSeeds = [
  {
    id: 'BLD-CTRL',
    name: '主控通信楼',
    category: '生产管理建筑',
    position: [-41, 10, -3] as [number, number, number],
    code: 'MF-BLD-001',
    area: 2680,
    variant: 1,
  },
  {
    id: 'BLD-220',
    name: '220kV二次设备舱',
    category: '电气设备建筑',
    position: [0, 8, 4] as [number, number, number],
    code: 'MF-BLD-002',
    area: 1860,
    variant: 0,
  },
  {
    id: 'BLD-SWITCH',
    name: '35kV配电室',
    category: '电气设备建筑',
    position: [35, 8, 4] as [number, number, number],
    code: 'MF-BLD-003',
    area: 2140,
    variant: 2,
  },
]

export const buildingDetails: BuildingDetail[] = buildingSeeds.map((building, index) => ({
  ...building,
  kind: 'building',
  status: '运行中',
  completedAt: `201${8 + index}-10-18`,
  manager: ['张伟', '李晨', '周涛'][index],
  floors: [
    {
      id: `${building.id}-F1`,
      name: '一层',
      elevation: '±0.000m',
      rooms: createRooms(0, building.variant),
    },
    {
      id: `${building.id}-F2`,
      name: '二层',
      elevation: '+4.500m',
      rooms: createRooms(1, building.variant),
    },
  ],
  systems: [
    { name: '消防系统', status: '正常', value: '24 / 24 在线' },
    { name: '新风系统', status: index === 1 ? '关注' : '正常', value: index === 1 ? '效率 86%' : '效率 96%' },
    { name: '门禁系统', status: '正常', value: '8 / 8 在线' },
    { name: '视频监控', status: '正常', value: '16 / 16 在线' },
  ],
  metrics: [
    { label: '今日用电', value: String(1180 + index * 230), unit: 'kWh', trend: 'down' },
    { label: '平均温度', value: (23.4 + index * 0.6).toFixed(1), unit: '℃', trend: 'stable' },
    { label: '平均湿度', value: String(46 + index * 2), unit: '%', trend: 'stable' },
    { label: '在线设备', value: String(86 + index * 12), unit: '台', trend: 'stable' },
  ],
}))

export const stationTargets: DrilldownTarget[] = [
  ...deviceDetails.map(({ id, kind, name, category, position }) => ({
    id,
    kind,
    name,
    category,
    position,
  })),
  ...buildingDetails.map(({ id, kind, name, category, position }) => ({
    id,
    kind,
    name,
    category,
    position,
  })),
]

export const getDeviceDetail = (id: string) =>
  deviceDetails.find((device) => device.id === id)

export const getBuildingDetail = (id: string) =>
  buildingDetails.find((building) => building.id === id)
