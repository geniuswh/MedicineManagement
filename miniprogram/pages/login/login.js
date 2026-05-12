const app = getApp();
const util = require('../../utils/util');
const { mockApi } = require('../../utils/db');

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onLoad: function(options) {
    // 检查是否已登录
    if (app.globalData.userInfo) {
      wx.redirectTo({
        url: '/pages/index/index'
      });
    }
  },

  onUsernameInput: function(e) {
    this.setData({
      username: e.detail.value
    });
  },

  onPasswordInput: function(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 登录
  handleLogin: async function() {
    const { username, password } = this.data;

    if (!username) {
      util.showToast('请输入手机号或账号');
      return;
    }

    if (!password) {
      util.showToast('请输入密码');
      return;
    }

    this.setData({ loading: true });

    try {
      // 使用mock数据登录
      const result = await mockApi.login(username, password);

      if (!result.success) {
        util.showToast('账号或密码错误');
        this.setData({ loading: false });
        return;
      }

      const userInfo = result.data.userInfo;
      
      // 更新全局数据
      app.globalData.userInfo = userInfo;
      app.globalData.userId = userInfo._id;
      app.globalData.userRole = userInfo.role;
      app.globalData.permissions = result.data.permissions || [];

      // 保存到本地
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('token', result.data.token);

      util.showToast('登录成功', 'success');

      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/index/index'
        });
      }, 1000);

    } catch (err) {
      console.error('登录失败:', err);
      util.showToast('登录失败，请重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  // 跳转注册页
  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});
