/**
 * 通用工具函数
 */

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 格式化金额
 */
function formatMoney(amount, decimals = 2) {
  if (isNaN(amount)) return '0.00';
  return Number(amount).toFixed(decimals);
}

/**
 * 格式化数字（添加千位分隔符）
 */
function formatNumber(num) {
  if (isNaN(num)) return '0';
  return Number(num).toLocaleString('zh-CN');
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 */
function throttle(fn, delay = 500) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 显示加载
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏加载
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示提示
 */
function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title,
    icon,
    duration
  });
}

/**
 * 显示确认弹窗
 */
function showConfirm(content, title = '提示') {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success(res) {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: reject
    });
  });
}

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 深拷贝
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 校验手机号
 */
function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 校验邮箱
 */
function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

/**
 * 获取日期范围
 */
function getDateRange(type) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  
  let startDate, endDate;
  
  switch(type) {
    case 'today':
      startDate = new Date(year, month, day);
      endDate = new Date(year, month, day, 23, 59, 59);
      break;
    case 'week':
      const weekDay = now.getDay() || 7;
      startDate = new Date(year, month, day - weekDay + 1);
      endDate = new Date(year, month, day - weekDay + 7, 23, 59, 59);
      break;
    case 'month':
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0, 23, 59, 59);
      break;
    case 'year':
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
      break;
    default:
      startDate = new Date(year, month, day);
      endDate = new Date(year, month, day, 23, 59, 59);
  }
  
  return {
    startDate: formatDate(startDate, 'YYYY-MM-DD'),
    endDate: formatDate(endDate, 'YYYY-MM-DD')
  };
}

module.exports = {
  formatDate,
  formatMoney,
  formatNumber,
  debounce,
  throttle,
  showLoading,
  hideLoading,
  showToast,
  showConfirm,
  generateId,
  deepClone,
  isValidPhone,
  isValidEmail,
  getDateRange
};
