// pages/device/list/list.js
Page({
  data: {
    devices: [],
    loading: true,
    keyword: ''
  },

  onLoad() {
    this.loadDevices()
  },

  loadDevices() {
    const mockData = [
      { id: 1, name: '电子血压计', spec: 'HEM-7121', unit: '台', category: '诊断设备', price: 299.00, stock: 150, manufacturer: '欧姆龙' },
      { id: 2, name: '血糖仪', spec: '稳步型', unit: '台', category: '诊断设备', price: 198.00, stock: 200, manufacturer: '强生' },
      { id: 3, name: '一次性注射器', spec: '5ml', unit: '支', category: '耗材', price: 0.50, stock: 10000, manufacturer: '江西洪达' },
      { id: 4, name: '医用口罩', spec: '成人款', unit: '个', category: '防护用品', price: 0.80, stock: 50000, manufacturer: '振德医疗' },
      { id: 5, name: '医用手套', spec: 'M号', unit: '双', category: '防护用品', price: 1.20, stock: 8000, manufacturer: '蓝帆医疗' },
      { id: 6, name: '体温计', spec: '水银型', unit: '支', category: '诊断设备', price: 5.00, stock: 500, manufacturer: '东阿阿胶' },
      { id: 7, name: '雾化器', spec: '压缩式', unit: '台', category: '治疗设备', price: 399.00, stock: 80, manufacturer: '鱼跃医疗' },
      { id: 8, name: '轮椅', spec: '折叠式', unit: '辆', category: '康复设备', price: 680.00, stock: 30, manufacturer: '鱼跃医疗' }
    ]
    
    setTimeout(() => {
      this.setData({ devices: mockData, loading: false })
    }, 500)
  },

  goToDetail(e) {
    wx.navigateTo({
      url: `/pages/device/detail/detail?id=${e.currentTarget.dataset.id}`
    })
  }
})
