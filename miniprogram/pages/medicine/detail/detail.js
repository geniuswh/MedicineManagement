// pages/medicine/detail/detail.js
Page({
  data: {
    medicine: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options
    this.loadMedicine(id)
  },

  loadMedicine(id) {
    // 模拟数据
    const mockMedicine = {
      id: 1,
      name: '阿莫西林胶囊',
      spec: '0.5g*24粒',
      unit: '盒',
      category: '抗生素',
      price: 25.00,
      stock: 500,
      minStock: 100,
      barcode: '6901234567890',
      manufacturer: '哈药集团',
      batchNo: '20240101',
      expiryDate: '2026-01-01',
      description: '用于敏感菌所致的各种感染，如上呼吸道感染、泌尿系统感染、消化道感染等。'
    }
    
    setTimeout(() => {
      this.setData({
        medicine: mockMedicine,
        loading: false
      })
    }, 300)
  },

  onEdit() {
    wx.showToast({ title: '编辑功能开发中', icon: 'none' })
  },

  onInbound() {
    wx.navigateTo({
      url: '/pages/inventory/inbound/inbound?medicineId=' + this.data.medicine.id
    })
  },

  onOutbound() {
    wx.navigateTo({
      url: '/pages/inventory/outbound/outbound?medicineId=' + this.data.medicine.id
    })
  }
})
