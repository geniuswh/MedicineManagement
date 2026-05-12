// pages/device/detail/detail.js
Page({
  data: {
    device: null,
    loading: true
  },

  onLoad(options) {
    this.loadDevice(options.id)
  },

  loadDevice(id) {
    const mockDevice = {
      id: 1,
      name: '电子血压计',
      spec: 'HEM-7121',
      unit: '台',
      category: '诊断设备',
      price: 299.00,
      stock: 150,
      minStock: 30,
      barcode: '6902345678901',
      manufacturer: '欧姆龙',
      description: '家用电子血压计，精准测量血压'
    }
    
    setTimeout(() => {
      this.setData({ device: mockDevice, loading: false })
    }, 300)
  },

  onInbound() {
    wx.navigateTo({ url: '/pages/inventory/inbound/inbound?deviceId=' + this.data.device.id })
  },

  onOutbound() {
    wx.navigateTo({ url: '/pages/inventory/outbound/outbound?deviceId=' + this.data.device.id })
  }
})
