const app = getApp();
const util = require('../../utils/util');
const auth = require('../../utils/auth');
const { mockApi } = require('../../utils/db');

Page({
  data: {
    account: '',
    phone: '',
    name: '',
    password: '',
    confirmPassword: '',
    departmentIndex: -1,
    departments: ['仓库管理部', '药品管理部', '器械管理部', '质量管理部', '综合管理部'],
    agreed: false,
    loading: false
  },

  onLoad: function(options) {
    if (options.phone) {
      this.setData({
        phone: options.phone
      });
    }
  },

  onAccountInput: function(e) {
    this.setData({ account: e.detail.value });
  },

  onPhoneInput: function(e) {
    this.setData({ phone: e.detail.value });
  },

  onNameInput: function(e) {
    this.setData({ name: e.detail.value });
  },

  onPasswordInput: function(e) {
    this.setData({ password: e.detail.value });
  },

  onConfirmPasswordInput: function(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  onDepartmentChange: function(e) {
    this.setData({
      departmentIndex: e.detail.value
    });
  },

  toggleAgreement: function() {
    this.setData({
      agreed: !this.data.agreed
    });
  },

  showAgreement: function() {
    wx.showModal({
      title: '用户协议',
      content: '感谢您使用医药管理系统。请遵守相关法律法规，保护账号安全，规范使用系统功能。',
      showCancel: false
    });
  },

  // 注册 (Mock模式 - 仅演示)
  handleRegister: async function() {
    const { account, phone, name, password, confirmPassword, departmentIndex, departments, agreed } = this.data;

    // 表单验证
    if (!account) {
      util.showToast('请输入账号');
      return;
    }

    if (!/^[a-zA-Z0-9_]{4,20}$/.test(account)) {
      util.showToast('账号需为4-20位字母、数字或下划线');
      return;
    }

    if (!phone) {
      util.showToast('请输入手机号');
      return;
    }

    if (!util.isValidPhone(phone)) {
      util.showToast('手机号格式不正确');
      return;
    }

    if (!name) {
      util.showToast('请输入姓名');
      return;
    }

    if (!password) {
      util.showToast('请输入密码');
      return;
    }

    if (password.length < 6) {
      util.showToast('密码至少需要6位');
      return;
    }

    if (password !== confirmPassword) {
      util.showToast('两次密码输入不一致');
      return;
    }

    if (departmentIndex < 0) {
      util.showToast('请选择所属部门');
      return;
    }

    if (!agreed) {
      util.showToast('请先同意用户协议');
      return;
    }

    this.setData({ loading: true });

    // Mock模式：模拟注册成功
    setTimeout(() => {
      util.showToast('注册成功，请联系管理员激活账号', 'success');
      this.setData({ loading: false });
      
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login'
        });
      }, 1500);
    }, 1000);
  },

  // 跳转登录
  goToLogin: function() {
    wx.redirectTo({
      url: '/pages/login/login'
    });
  }
});
