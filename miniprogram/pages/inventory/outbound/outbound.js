const app = getApp();
const util = require('../../../utils/util');
const { mockApi } = require('../../../utils/db');

Page({
  data: {
    loading: false,
    productList: [],
    selectedProduct: null,
    
    // 表单数据
    productId: '',
    productName: '',
    spec: '',
    batchNo: '',
    quantity: '',
    unit: '',
    price: '',
    totalAmount: '0.00',
    department: '',
    receiver: '',
    remark: ''
  },

  onLoad: function() {
    this.loadProducts();
  },

  // 加载产品列表
  loadProducts: async function() {
    this.setData({ loading: true });
    
    const medResult = await mockApi.getMedicines();
    const devResult = await mockApi.getDevices();
    
    const productList = [
      ...(medResult.success ? medResult.data.map(m => ({ ...m, type: 'medicine' })) : []),
      ...(devResult.success ? devResult.data.map(d => ({ ...d, type: 'device' })) : [])
    ];
    
    this.setData({ productList, loading: false });
  },

  // 选择产品
  selectProduct: function(e) {
    const product = e.currentTarget.dataset.product;
    this.setData({
      selectedProduct: product,
      productId: product._id,
      productName: product.name,
      spec: product.spec,
      unit: product.unit,
      price: product.price
    });
    this.calculateTotal();
  },

  // 输入数量
  onQuantityInput: function(e) {
    this.setData({ quantity: e.detail.value });
    this.calculateTotal();
  },

  // 计算总额
  calculateTotal: function() {
    const { quantity, price } = this.data;
    const total = (parseFloat(quantity) || 0) * (parseFloat(price) || 0);
    this.setData({ totalAmount: total.toFixed(2) });
  },

  // 提交出库
  submitForm: async function() {
    const { productId, productName, quantity, unit, price, department, receiver, remark } = this.data;
    
    if (!productId) {
      util.showToast('请选择产品');
      return;
    }
    if (!quantity || quantity <= 0) {
      util.showToast('请输入有效数量');
      return;
    }

    this.setData({ loading: true });

    try {
      await mockApi.addOutbound({
        productId,
        productName,
        productType: this.data.selectedProduct.type === 'medicine' ? '药品' : '医疗器械',
        spec: this.data.spec,
        batchNo: Date.now().toString(),
        quantity: parseInt(quantity),
        unit,
        price: parseFloat(price),
        totalAmount: parseFloat(this.data.totalAmount),
        department,
        receiver,
        operatorName: app.globalData.userInfo?.name || '管理员',
        date: util.formatDate(new Date(), 'YYYY-MM-DD'),
        remark
      });

      util.showToast('出库成功', 'success');
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (err) {
      util.showToast('出库失败');
    } finally {
      this.setData({ loading: false });
    }
  }
});
