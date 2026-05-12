// 医疗器械 Mock 数据
export const devices = [
  { id: 1, name: '电子血压计', barcode: '6902345678901', category: '诊断设备', spec: 'HEM-7121', unit: '台', manufacturer: '欧姆龙', price: 299.00, stock: 150, minStock: 30, batchNo: '20240101', status: 1 },
  { id: 2, name: '血糖仪', barcode: '6902345678902', category: '诊断设备', spec: '稳步型', unit: '台', manufacturer: '强生', price: 198.00, stock: 200, minStock: 40, batchNo: '20240201', status: 1 },
  { id: 3, name: '一次性注射器', barcode: '6902345678903', category: '耗材', spec: '5ml', unit: '支', manufacturer: '江西洪达', price: 0.50, stock: 10000, minStock: 2000, batchNo: '20240301', expiryDate: '2027-03-01', status: 1 },
  { id: 4, name: '医用口罩', barcode: '6902345678904', category: '防护用品', spec: '成人款', unit: '个', manufacturer: '振德医疗', price: 0.80, stock: 50000, minStock: 10000, batchNo: '20240401', expiryDate: '2027-04-01', status: 1 },
  { id: 5, name: '医用手套', barcode: '6902345678905', category: '防护用品', spec: 'M号', unit: '双', manufacturer: '蓝帆医疗', price: 1.20, stock: 8000, minStock: 1500, batchNo: '20240501', expiryDate: '2027-05-01', status: 1 },
  { id: 6, name: '体温计', barcode: '6902345678906', category: '诊断设备', spec: '水银型', unit: '支', manufacturer: '东阿阿胶', price: 5.00, stock: 500, minStock: 100, batchNo: '20240601', status: 1 },
  { id: 7, name: '创可贴', barcode: '6902345678907', category: '耗材', spec: '100mm*60mm', unit: '片', manufacturer: '云南白药', price: 0.50, stock: 3000, minStock: 500, batchNo: '20240701', expiryDate: '2026-07-01', status: 1 },
  { id: 8, name: '雾化器', barcode: '6902345678908', category: '治疗设备', spec: '压缩式', unit: '台', manufacturer: '鱼跃医疗', price: 399.00, stock: 15, minStock: 20, batchNo: '20240801', status: 1 },
  { id: 9, name: '医用棉签', barcode: '6902345678909', category: '耗材', spec: '单头', unit: '包', manufacturer: '稳健医疗', price: 5.00, stock: 2000, minStock: 400, batchNo: '20240901', expiryDate: '2026-09-01', status: 1 },
  { id: 10, name: '轮椅', barcode: '6902345678910', category: '康复设备', spec: '折叠式', unit: '辆', manufacturer: '鱼跃医疗', price: 680.00, stock: 5, minStock: 10, batchNo: '20241001', status: 1 },
  { id: 11, name: '听诊器', barcode: '6902345678911', category: '诊断设备', spec: '双用型', unit: '个', manufacturer: '鱼跃医疗', price: 89.00, stock: 100, minStock: 20, batchNo: '20241101', status: 1 },
  { id: 12, name: '酒精棉球', barcode: '6902345678912', category: '耗材', spec: '75%', unit: '瓶', manufacturer: '稳健医疗', price: 12.00, stock: 500, minStock: 100, batchNo: '20241201', expiryDate: '2026-12-01', status: 1 }
]

export const deviceCategories = [
  { id: 1, name: '诊断设备', description: '用于诊断疾病的设备' },
  { id: 2, name: '治疗设备', description: '用于治疗疾病的设备' },
  { id: 3, name: '康复设备', description: '用于康复训练的设备' },
  { id: 4, name: '防护用品', description: '个人防护用品' },
  { id: 5, name: '耗材', description: '一次性医用耗材' }
]
