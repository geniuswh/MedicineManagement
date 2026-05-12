// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { startDate, endDate } = event
  
  try {
    // 获取入库数据
    const inboundResult = await db.collection('inbound_records')
      .where({
        date: _.gte(startDate).and(_.lte(endDate))
      })
      .get()
    
    // 获取出库数据
    const outboundResult = await db.collection('outbound_records')
      .where({
        date: _.gte(startDate).and(_.lte(endDate))
      })
      .get()
    
    // 整理数据
    const data = {
      inbound: inboundResult.data,
      outbound: outboundResult.data
    }
    
    // 这里应该生成Excel文件
    // 由于云函数限制，这里返回数据，前端处理
    // 实际项目中可以使用云存储生成Excel
    
    return {
      success: true,
      data: data,
      message: '数据获取成功'
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: err.message
    }
  }
}
