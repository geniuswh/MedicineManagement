// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event
  
  switch (action) {
    case 'addMedicine':
      return await addMedicine(data)
    case 'updateMedicine':
      return await updateMedicine(data)
    case 'deleteMedicine':
      return await deleteMedicine(data)
    case 'addDevice':
      return await addDevice(data)
    case 'updateDevice':
      return await updateDevice(data)
    case 'deleteDevice':
      return await deleteDevice(data)
    case 'getInventoryStats':
      return await getInventoryStats(data)
    default:
      return { error: 'Unknown action' }
  }
}

// 添加药品
async function addMedicine(data) {
  try {
    const result = await db.collection('medicines').add({
      data: {
        ...data,
        stock: 0,
        status: 'active',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    
    return { success: true, id: result._id }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 更新药品
async function updateMedicine(data) {
  try {
    const { id, ...updateData } = data
    
    await db.collection('medicines').doc(id).update({
      data: {
        ...updateData,
        updateTime: db.serverDate()
      }
    })
    
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 删除药品
async function deleteMedicine(data) {
  try {
    await db.collection('medicines').doc(data.id).remove()
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 添加医疗器械
async function addDevice(data) {
  try {
    const result = await db.collection('devices').add({
      data: {
        ...data,
        stock: 0,
        status: 'active',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    
    return { success: true, id: result._id }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 更新医疗器械
async function updateDevice(data) {
  try {
    const { id, ...updateData } = data
    
    await db.collection('devices').doc(id).update({
      data: {
        ...updateData,
        updateTime: db.serverDate()
      }
    })
    
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 删除医疗器械
async function deleteDevice(data) {
  try {
    await db.collection('devices').doc(data.id).remove()
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 获取库存统计
async function getInventoryStats(data) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const [medicines, devices, inboundToday, outboundToday] = await Promise.all([
      db.collection('medicines').count(),
      db.collection('devices').count(),
      db.collection('inbound_records').where({ date: today }).count(),
      db.collection('outbound_records').where({ date: today }).count()
    ])
    
    return {
      success: true,
      data: {
        totalProducts: medicines.total + devices.total,
        todayInbound: inboundToday.total,
        todayOutbound: outboundToday.total
      }
    }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
