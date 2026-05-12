App({
  globalData: {
    userInfo: null,
    userId: null,
    userRole: null,
    permissions: [],
    useCloud: false  // 是否使用云开发，默认false使用本地mock
  },

  onLaunch: function () {
    // 检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('token');
    
    if (userInfo && token) {
      this.globalData.userInfo = userInfo;
      this.globalData.userId = userInfo._id;
      this.globalData.userRole = userInfo.role;
      this.globalData.permissions = userInfo.permissions || [];
    }
  },

  // 检查权限
  hasPermission: function(permission) {
    return this.globalData.permissions.includes(permission);
  },

  // 检查角色
  hasRole: function(role) {
    return this.globalData.userRole === role;
  }
});
