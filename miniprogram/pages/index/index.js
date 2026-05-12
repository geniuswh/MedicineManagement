const app = getApp();
const { mockApi } = require('../../utils/db');
const util = require('../../utils/util');

Page({
  data: {
    userInfo: null,
    roleName: '',
    statistics: {
      totalProducts: 0,
      todayInbound: 0,
      todayOutbound: 0,
      warnings: 0
    },
    warnings: [],
    recentRecords: []
  },

  onLoad: function() {
    this.checkLogin();
  },

  onShow: function() {
    if (app.globalData.userInfo) {
      this.loadData();
    }
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
      roleName: roleNames[app.globalData.userRole] || '普通用户'
    });
  },

  // 加载数据
  loadData: async function() {
    wx.showLoading({ title: '加载中...' });
    
    try {
      // 加载统计数据
      const statsResult = await mockApi.getStatistics();
      if (statsResult.success) {
        this.setData({
          statistics: statsResult.data
        });
      }

      // 加载库存预警
      const warningsResult = await mockApi.getWarnings();
      if (warningsResult.success) {
        this.setData({
          warnings: warningsResult.data
        });
      }
    } catch (err) {
      console.error('加载数据失败:', err);
    } finally {
      wx.hideLoading();
    }
  },

  // 页面导航方法
  goToInbound: function() {
    wx.navigateTo({
      url: '/pages/inventory/inbound/inbound'
    });
  },

  goToOutbound: function() {
    wx.navigateTo({
      url: '/pages/inventory/outbound/outbound'
    });
  },

  goToMedicineList: function() {
    wx.navigateTo({
      url: '/pages/medicine/list/list'
    });
  },

  goToDeviceList: function() {
    wx.navigateTo({
      url: '/pages/device/list/list'
    });
  },

  goToStatistics: function() {
    wx.switchTab({
      url: '/pages/statistics/statistics'
    });
  },

  goToRecords: function() {
    wx.navigateTo({
      url: '/pages/inventory/inventory'
    });
  },

  goToDetail: function(e) {
    const { id, type } = e.currentTarget.dataset;
    const url = type === 'medicine' 
      ? `/pages/medicine/detail/detail?id=${id}`
      : `/pages/device/detail/detail?id=${id}`;
    wx.navigateTo({ url });
  },

  // 扫码
  scanCode: function() {
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果:', res);
        wx.showToast({
          title: '扫码成功',
          icon: 'success'
        });
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh: async function() {
    await this.loadData();
    wx.stopPullDownRefresh();
  }
});
