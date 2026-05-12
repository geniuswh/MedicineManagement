// 用户相关 Mock 数据
export const users = [
  {
    id: 1,
    name: '管理员',
    account: 'admin',
    password: 'admin123',
    phone: '13800000000',
    avatar: '',
    role: 'admin',
    status: 1,
    permissions: ['*'],
    createTime: '2024-01-01'
  },
  {
    id: 2,
    name: '仓库管理员',
    account: 'warehouse',
    password: '123456',
    phone: '13800000001',
    avatar: '',
    role: 'warehouse',
    status: 1,
    permissions: ['inventory:view', 'inbound:view', 'inbound:edit', 'outbound:view', 'outbound:edit'],
    createTime: '2024-01-15'
  },
  {
    id: 3,
    name: '采购员',
    account: 'purchaser',
    password: '123456',
    phone: '13800000002',
    avatar: '',
    role: 'purchaser',
    status: 1,
    permissions: ['medicine:view', 'device:view', 'inbound:view', 'inbound:edit'],
    createTime: '2024-02-01'
  },
  {
    id: 4,
    name: '普通用户',
    account: 'user',
    password: '123456',
    phone: '13800000003',
    avatar: '',
    role: 'user',
    status: 1,
    permissions: ['inventory:view'],
    createTime: '2024-02-15'
  }
]

export const roles = [
  { id: 1, name: 'admin', label: '超级管理员', description: '拥有所有权限' },
  { id: 2, name: 'warehouse', label: '仓库管理员', description: '管理出入库操作' },
  { id: 3, name: 'purchaser', label: '采购员', description: '负责采购入库' },
  { id: 4, name: 'user', label: '普通用户', description: '只读权限' }
]

export const permissions = [
  { id: 1, code: 'medicine:view', name: '查看药品', module: '药品管理' },
  { id: 2, code: 'medicine:edit', name: '编辑药品', module: '药品管理' },
  { id: 3, code: 'device:view', name: '查看器械', module: '器械管理' },
  { id: 4, code: 'device:edit', name: '编辑器械', module: '器械管理' },
  { id: 5, code: 'inventory:view', name: '查看库存', module: '库存管理' },
  { id: 6, code: 'inbound:view', name: '查看入库', module: '入库管理' },
  { id: 7, code: 'inbound:edit', name: '入库操作', module: '入库管理' },
  { id: 8, code: 'outbound:view', name: '查看出库', module: '出库管理' },
  { id: 9, code: 'outbound:edit', name: '出库操作', module: '出库管理' },
  { id: 10, code: 'user:view', name: '查看用户', module: '用户管理' },
  { id: 11, code: 'user:edit', name: '编辑用户', module: '用户管理' }
]
