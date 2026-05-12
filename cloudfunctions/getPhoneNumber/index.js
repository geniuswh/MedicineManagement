// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.getOpenData({
      list: [event.cloudID]
    })
    
    return {
      phoneNumber: result.list[0].data.phoneNumber
    }
  } catch (err) {
    console.error(err)
    return {
      error: err.message
    }
  }
}
