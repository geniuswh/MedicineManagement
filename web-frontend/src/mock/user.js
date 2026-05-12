// Mock数据 - 用户相关
export const users = [
  {
    id: 1,
    account: 'admin',
    phone: '13800138000',
    name: '系统管理员',
    password: 'admin123',
    avatar: '',
    department: '技术部',
    role: 'admin',
    permissions: ['*'],
    status: 'active',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    account: 'manager',
    phone: '13800138001',
    name: '张经理',
    password: '123456',
    avatar: '',
    department: '管理部',
    role: 'manager',
    permissions: ['medicine:view', 'medicine:add', 'medicine:edit', 'device:view', 'device:add', 'inbound:view', 'inbound:add', 'outbound:view', 'outbound:add', 'statistics:view'],
    status: 'active',
    createTime: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    account: 'warehouse',
    phone: '13800138002',
    name: '李仓管',
    password: '123456',
    avatar: '',
    department: '仓库管理部',
    role: 'warehouse',
    permissions: ['medicine:view', 'device:view', 'inbound:view', 'inbound:add', 'outbound:view', 'outbound:add', 'statistics:view'],
    status: 'active',
    createTime: '2024-01-03 10:00:00'
  },
  {
    id: 4,
    account: 'viewer',
    phone: '13800138003',
    name: '王查看',
    password: '123456',
    avatar: '',
    department: '质量部',
    role: 'viewer',
    permissions: ['medicine:view', 'device:view', 'inbound:view', 'outbound:view', 'statistics:view'],
    status: 'active',
    createTime: '2024-01-04 10:00:00'
  }
]

export const roles = [
  { id: 1, name: 'admin', label: '管理员', description: '拥有所有权限' },
  { id: 2, name: 'manager', label: '经理', description: '管理药品、器械和出入库' },
  { id: 3, name: 'warehouse', label: '仓库管理员', description: '负责出入库操作' },
  { id: 4, name: 'viewer', label: '查看者', description: '只能查看数据' }
]

export const permissions = [
  { id: 1, key: 'medicine:view', label: '查看药品', module: '药品管理' },
  { id: 2, key: 'medicine:add', label: '添加药品', module: '药品管理' },
  { id: 3, key: 'medicine:edit', label: '编辑药品', module: '药品管理' },
  { id: 4, key: 'medicine:delete', label: '删除药品', module: '药品管理' },
  { id: 5, key: 'device:view', label: '查看器械', module: '器械管理' },
  { id: 6, key: 'device:add', label: '添加器械', module: '器械管理' },
  { id: 7, key: 'device:edit', label: '编辑器械', module: '器械管理' },
  { id: 8, key: 'device:delete', label: '删除器械', module: '器械管理' },
  { id: 9, key: 'inbound:view', label: '查看出库', module: '入库管理' },
  { id: 10, key: 'inbound:add', label: '入库操作', module: '入库管理' },
  { id: 11, key: 'outbound:view', label: '查看出库', module: '出库管理' },
  { id: 12, key: 'outbound:add', label: '出库操作', module: '出库管理' },
  { id: 13, key: 'statistics:view', label: '查看统计', module: '统计分析' },
  { id: 14, key: 'statistics:export', label: '导出报表', module: '统计分析' },
  { id: 15, key: 'user:view', label: '查看用户', module: '用户管理' },
  { id: 16, key: 'user:add', label: '添加用户', module: '用户管理' }
]
