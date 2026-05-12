const app = getApp();
const util = require('../../utils/util');

Page({
  data: {
    currentTab: 'day',
    overview: {
      inboundCount: 0,
      inboundAmount: 0,
      outboundCount: 0,
      outboundAmount: 0
    },
    rankList: []
  },

  onLoad: function() {
    this.loadStatistics();
  },

  onShow: function() {
    this.loadStatistics();
  },

  // 切换时间标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadStatistics();
  },

  // 加载统计数据
  loadStatistics: async function() {
    wx.showLoading({ title: '加载中...' });
    
    // 模拟数据
    const mockOverview = {
      day: { inboundCount: 5, inboundAmount: 2580.00, outboundCount: 8, outboundAmount: 1560.00 },
      week: { inboundCount: 23, inboundAmount: 15800.00, outboundCount: 35, outboundAmount: 12500.00 },
      month: { inboundCount: 86, inboundAmount: 68500.00, outboundCount: 120, outboundAmount: 52600.00 },
      year: { inboundCount: 1024, inboundAmount: 856000.00, outboundCount: 1350, outboundAmount: 625000.00 }
    };

    const mockRankList = [
      { name: '阿莫西林胶囊', spec: '0.5g*24粒', count: 156, quantity: 3120 },
      { name: '医用外科口罩', spec: '成人款', count: 98, quantity: 4900 },
      { name: '布洛芬片', spec: '0.2g*100片', count: 75, quantity: 1500 },
      { name: '一次性注射器', spec: '5ml', count: 68, quantity: 3400 },
      { name: '维生素C片', spec: '0.1g*100片', count: 52, quantity: 1040 }
    ];

    setTimeout(() => {
      this.setData({
        overview: mockOverview[this.data.currentTab],
        rankList: mockRankList
      });
      wx.hideLoading();
    }, 500);
  },

  // 导出报表
  exportReport: function() {
    wx.showToast({
      title: '导出功能开发中',
      icon: 'none'
    });
  },

  // 下拉刷新
  onPullDownRefresh: async function() {
    await this.loadStatistics();
    wx.stopPullDownRefresh();
  }
});
