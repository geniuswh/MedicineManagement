const app = getApp();
const util = require('../../utils/util');
const { mockApi } = require('../../utils/db');

Page({
  data: {
    keyword: '',
    currentTab: 'all',
    records: [],
    loading: false
  },

  onLoad: function() {
    this.loadRecords();
  },

  onShow: function() {
    this.loadRecords();
  },

  // 搜索
  onSearch: function(e) {
    this.setData({ keyword: e.detail.value });
    this.loadRecords();
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadRecords();
  },

  // 加载记录
  loadRecords: async function() {
    this.setData({ loading: true });

    try {
      let allRecords = [];

      if (this.data.currentTab === 'all' || this.data.currentTab === 'inbound') {
        const inboundResult = await mockApi.getInboundRecords();
        if (inboundResult.success) {
          allRecords = allRecords.concat(inboundResult.data.map(item => ({
            ...item,
            type: 'inbound',
            createTimeStr: util.formatDate(item.createTime, 'MM-DD HH:mm')
          })));
        }
      }

      if (this.data.currentTab === 'all' || this.data.currentTab === 'outbound') {
        const outboundResult = await mockApi.getOutboundRecords();
        if (outboundResult.success) {
          allRecords = allRecords.concat(outboundResult.data.map(item => ({
            ...item,
            type: 'outbound',
            createTimeStr: util.formatDate(item.createTime, 'MM-DD HH:mm')
          })));
        }
      }

      // 搜索过滤
      if (this.data.keyword) {
        allRecords = allRecords.filter(r => r.productName.includes(this.data.keyword));
      }

      // 排序
      allRecords.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

      this.setData({
        records: allRecords,
        loading: false
      });

    } catch (err) {
      console.error('加载记录失败:', err);
      this.setData({ loading: false });
    }
  },

  // 跳转入库
  goToInbound: function() {
    wx.navigateTo({
      url: '/pages/inventory/inbound/inbound'
    });
  },

  // 跳转出库
  goToOutbound: function() {
    wx.navigateTo({
      url: '/pages/inventory/outbound/outbound'
    });
  },

  // 下拉刷新
  onPullDownRefresh: async function() {
    await this.loadRecords();
    wx.stopPullDownRefresh();
  }
});
