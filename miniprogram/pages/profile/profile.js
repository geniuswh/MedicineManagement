const app = getApp();
const util = require('../../utils/util');
const auth = require('../../utils/auth');
const { mockApi } = require('../../utils/db');

Page({
  data: {
    userInfo: null,
    roleName: '',
    isAdmin: false,
    hasUserPermission: false,
    hasPermissionManage: false,
    statistics: {
      inboundCount: 0,
      outboundCount: 0,
      days: 0
    }
  },

  onLoad: function() {
    this.checkLogin();
  },

  onShow: function() {
    this.loadStatistics();
  },

  // 检查登录状态
  checkLogin: function() {
    if (!app.globalData.userInfo) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }

    const roleNames = {
      'admin': '管理员',
      'manager': '经理',
      'warehouse': '仓库管理员',
      'viewer': '查看者'
    };

    this.setData({
      userInfo: app.globalData.userInfo,
      roleName: roleNames[app.globalData.userRole] || '普通用户',
      isAdmin: app.globalData.userRole === 'admin',
      hasUserPermission: app.globalData.userRole === 'admin',
      hasPermissionManage: app.globalData.userRole === 'admin'
    });
  },

  // 加载统计数据
  loadStatistics: async function() {
    try {
      const inboundResult = await mockApi.getInboundRecords();
      const outboundResult = await mockApi.getOutboundRecords();
      
      const userId = app.globalData.userId;
      const inboundCount = inboundResult.success ? inboundResult.data.filter(r => r.operatorName === app.globalData.userInfo?.name).length : 0;
      const outboundCount = outboundResult.success ? outboundResult.data.filter(r => r.operatorName === app.globalData.userInfo?.name).length : 0;

      this.setData({
        'statistics.inboundCount': inboundCount,
        'statistics.outboundCount': outboundCount,
        'statistics.days': 30
      });

    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  },

  // 编辑个人信息
  editProfile: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 我的记录
  goToRecords: function() {
    wx.navigateTo({
      url: '/pages/inventory/inventory'
    });
  },

  // 系统设置
  goToSettings: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 用户管理
  goToUserManage: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 权限管理
  goToPermissionManage: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 帮助中心
  showHelp: function() {
    wx.showModal({
      title: '帮助中心',
      content: '如有问题，请联系管理员或拨打客服热线：400-XXX-XXXX',
      showCancel: false
    });
  },

  // 关于我们
  showAbout: function() {
    wx.showModal({
      title: '关于我们',
      content: '医药管理系统 V1.0.0\n药品与医疗器械出入库管理平台\n© 2024 医药管理系统团队',
      showCancel: false
    });
  },

  // 退出登录
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');

          // 清除全局数据
          app.globalData.userInfo = null;
          app.globalData.userId = null;
          app.globalData.userRole = null;
          app.globalData.permissions = [];

          // 跳转到登录页
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh: async function() {
    await this.loadStatistics();
    wx.stopPullDownRefresh();
  }
});
