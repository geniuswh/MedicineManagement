/**
 * 权限管理工具
 */

// 权限定义
const PERMISSIONS = {
  // 药品管理
  MEDICINE_VIEW: 'medicine:view',
  MEDICINE_ADD: 'medicine:add',
  MEDICINE_EDIT: 'medicine:edit',
  MEDICINE_DELETE: 'medicine:delete',
  
  // 医疗器械管理
  DEVICE_VIEW: 'device:view',
  DEVICE_ADD: 'device:add',
  DEVICE_EDIT: 'device:edit',
  DEVICE_DELETE: 'device:delete',
  
  // 出入库管理
  INBOUND_VIEW: 'inbound:view',
  INBOUND_ADD: 'inbound:add',
  OUTBOUND_VIEW: 'outbound:view',
  OUTBOUND_ADD: 'outbound:add',
  
  // 统计查看
  STATISTICS_VIEW: 'statistics:view',
  STATISTICS_EXPORT: 'statistics:export',
  
  // 用户管理
  USER_VIEW: 'user:view',
  USER_ADD: 'user:add',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  
  // 权限管理
  PERMISSION_MANAGE: 'permission:manage'
};

// 角色定义
const ROLES = {
  ADMIN: 'admin',           // 管理员 - 所有权限
  MANAGER: 'manager',       // 经理 - 大部分权限
  WAREHOUSE: 'warehouse',   // 仓库管理员 - 出入库权限
  VIEWER: 'viewer'          // 查看者 - 只读权限
};

// 角色权限映射
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  
  [ROLES.MANAGER]: [
    PERMISSIONS.MEDICINE_VIEW,
    PERMISSIONS.MEDICINE_ADD,
    PERMISSIONS.MEDICINE_EDIT,
    PERMISSIONS.DEVICE_VIEW,
    PERMISSIONS.DEVICE_ADD,
    PERMISSIONS.DEVICE_EDIT,
    PERMISSIONS.INBOUND_VIEW,
    PERMISSIONS.INBOUND_ADD,
    PERMISSIONS.OUTBOUND_VIEW,
    PERMISSIONS.OUTBOUND_ADD,
    PERMISSIONS.STATISTICS_VIEW,
    PERMISSIONS.STATISTICS_EXPORT,
    PERMISSIONS.USER_VIEW
  ],
  
  [ROLES.WAREHOUSE]: [
    PERMISSIONS.MEDICINE_VIEW,
    PERMISSIONS.DEVICE_VIEW,
    PERMISSIONS.INBOUND_VIEW,
    PERMISSIONS.INBOUND_ADD,
    PERMISSIONS.OUTBOUND_VIEW,
    PERMISSIONS.OUTBOUND_ADD,
    PERMISSIONS.STATISTICS_VIEW
  ],
  
  [ROLES.VIEWER]: [
    PERMISSIONS.MEDICINE_VIEW,
    PERMISSIONS.DEVICE_VIEW,
    PERMISSIONS.INBOUND_VIEW,
    PERMISSIONS.OUTBOUND_VIEW,
    PERMISSIONS.STATISTICS_VIEW
  ]
};

/**
 * 检查用户是否有某个权限
 */
function hasPermission(userPermissions, permission) {
  return userPermissions.includes(permission);
}

/**
 * 检查用户是否有某些权限（满足任意一个即可）
 */
function hasAnyPermission(userPermissions, permissions) {
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * 检查用户是否有所有权限
 */
function hasAllPermissions(userPermissions, permissions) {
  return permissions.every(p => userPermissions.includes(p));
}

/**
 * 根据角色获取权限列表
 */
function getPermissionsByRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * 验证权限并跳转
 */
function checkPermissionAndNavigate(permission, redirectUrl = '/pages/index/index') {
  const app = getApp();
  if (!app.hasPermission(permission)) {
    wx.showToast({
      title: '无权限访问',
      icon: 'none'
    });
    setTimeout(() => {
      wx.redirectTo({
        url: redirectUrl
      });
    }, 1500);
    return false;
  }
  return true;
}

module.exports = {
  PERMISSIONS,
  ROLES,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsByRole,
  checkPermissionAndNavigate
};
