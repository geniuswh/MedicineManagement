// pages/medicine/list/list.js
Page({
  data: {
    medicines: [],
    loading: true,
    keyword: '',
    categories: ['全部', '抗生素', '解热镇痛', '感冒用药', '维生素', '止咳化痰', '消化系统', '抗过敏'],
    currentCategory: '全部',
    currentCategoryIndex: 0
  },

  onLoad() {
    this.loadMedicines()
  },

  async loadMedicines() {
    this.setData({ loading: true })
    
    const mockData = [
      { id: 1, name: '阿莫西林胶囊', spec: '0.5g*24粒', unit: '盒', category: '抗生素', price: 25.00, stock: 500, minStock: 100, manufacturer: '哈药集团' },
      { id: 2, name: '布洛芬缓释胶囊', spec: '0.3g*20粒', unit: '盒', category: '解热镇痛', price: 18.50, stock: 800, minStock: 150, manufacturer: '中美史克' },
      { id: 3, name: '感冒灵颗粒', spec: '10g*9袋', unit: '盒', category: '感冒用药', price: 12.00, stock: 1200, minStock: 200, manufacturer: '广州白云山' },
      { id: 4, name: '维生素C片', spec: '100mg*100片', unit: '瓶', category: '维生素', price: 8.00, stock: 2000, minStock: 300, manufacturer: '东北制药' },
      { id: 5, name: '头孢克肟分散片', spec: '0.1g*6片', unit: '盒', category: '抗生素', price: 35.00, stock: 300, minStock: 80, manufacturer: '广州白云山' },
      { id: 6, name: '阿司匹林肠溶片', spec: '100mg*30片', unit: '盒', category: '解热镇痛', price: 28.00, stock: 50, minStock: 100, manufacturer: '拜耳医药' },
      { id: 7, name: '复方甘草片', spec: '100片', unit: '瓶', category: '止咳化痰', price: 6.50, stock: 1500, minStock: 250, manufacturer: '上海医药' },
      { id: 8, name: '蒙脱石散', spec: '3g*10袋', unit: '盒', category: '消化系统', price: 32.00, stock: 600, minStock: 120, manufacturer: '博福-益普生' },
      { id: 9, name: '氯雷他定片', spec: '10mg*6片', unit: '盒', category: '抗过敏', price: 45.00, stock: 280, minStock: 60, manufacturer: '西安杨森' },
      { id: 10, name: '奥美拉唑肠溶胶囊', spec: '20mg*14粒', unit: '盒', category: '消化系统', price: 58.00, stock: 350, minStock: 70, manufacturer: '阿斯利康' }
    ]
    
    setTimeout(() => {
      this.setData({ 
        medicines: mockData,
        loading: false
      })
    }, 500)
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
    this.filterMedicines()
  },

  onCategoryTap(e) {
    const index = e.currentTarget.dataset.index
    const category = this.data.categories[index]
    this.setData({ 
      currentCategoryIndex: index,
      currentCategory: category
    })
    this.filterMedicines()
  },

  filterMedicines() {
    // 简单的筛选逻辑
    this.loadMedicines()
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/medicine/detail/detail?id=${id}`
    })
  },

  onPullDownRefresh() {
    this.loadMedicines()
    wx.stopPullDownRefresh()
  }
})
