const { getDb } = require('./database');

function initTables() {
  const db = getDb();

  db.exec(`
    -- 用户表
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      department TEXT DEFAULT '',
      role TEXT NOT NULL DEFAULT 'viewer',
      permissions TEXT DEFAULT '[]',
      status INTEGER NOT NULL DEFAULT 1,
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
      updateTime DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 药品分类表
    CREATE TABLE IF NOT EXISTS medicine_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT ''
    );

    -- 药品表
    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      barcode TEXT DEFAULT '',
      category TEXT DEFAULT '',
      spec TEXT DEFAULT '',
      unit TEXT DEFAULT '',
      manufacturer TEXT DEFAULT '',
      approvalNumber TEXT DEFAULT '',
      price REAL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      minStock INTEGER DEFAULT 0,
      batchNo TEXT DEFAULT '',
      expiryDate TEXT DEFAULT '',
      status INTEGER DEFAULT 1,
      remark TEXT DEFAULT '',
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
      updateTime DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 器械分类表
    CREATE TABLE IF NOT EXISTS device_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT ''
    );

    -- 医疗器械表
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      barcode TEXT DEFAULT '',
      category TEXT DEFAULT '',
      spec TEXT DEFAULT '',
      unit TEXT DEFAULT '',
      manufacturer TEXT DEFAULT '',
      registrationNumber TEXT DEFAULT '',
      price REAL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      minStock INTEGER DEFAULT 0,
      batchNo TEXT DEFAULT '',
      expiryDate TEXT DEFAULT '',
      status INTEGER DEFAULT 1,
      remark TEXT DEFAULT '',
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
      updateTime DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 入库记录表
    CREATE TABLE IF NOT EXISTS inbound_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      productName TEXT NOT NULL,
      productType TEXT NOT NULL DEFAULT 'medicine',
      spec TEXT DEFAULT '',
      batchNo TEXT DEFAULT '',
      quantity INTEGER NOT NULL DEFAULT 0,
      unit TEXT DEFAULT '',
      price REAL DEFAULT 0,
      totalAmount REAL DEFAULT 0,
      supplier TEXT DEFAULT '',
      productionDate TEXT DEFAULT '',
      expiryDate TEXT DEFAULT '',
      operatorId INTEGER DEFAULT 0,
      operatorName TEXT DEFAULT '',
      date TEXT DEFAULT '',
      remark TEXT DEFAULT '',
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 出库记录表
    CREATE TABLE IF NOT EXISTS outbound_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      productName TEXT NOT NULL,
      productType TEXT NOT NULL DEFAULT 'medicine',
      spec TEXT DEFAULT '',
      batchNo TEXT DEFAULT '',
      quantity INTEGER NOT NULL DEFAULT 0,
      unit TEXT DEFAULT '',
      price REAL DEFAULT 0,
      totalAmount REAL DEFAULT 0,
      department TEXT DEFAULT '',
      receiver TEXT DEFAULT '',
      purpose TEXT DEFAULT '',
      operatorId INTEGER DEFAULT 0,
      operatorName TEXT DEFAULT '',
      date TEXT DEFAULT '',
      remark TEXT DEFAULT '',
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 操作日志表
    CREATE TABLE IF NOT EXISTS operation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER DEFAULT 0,
      userName TEXT DEFAULT '',
      action TEXT NOT NULL,
      module TEXT DEFAULT '',
      description TEXT DEFAULT '',
      ip TEXT DEFAULT '',
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 角色表
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      description TEXT DEFAULT ''
    );

    -- 权限表
    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      module TEXT DEFAULT ''
    );
  `);
}

function seedData() {
  const db = getDb();

  // 检查是否已有数据
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    console.log('数据已存在，跳过初始化');
    return;
  }

  console.log('初始化种子数据...');

  // 用户
  const insertUser = db.prepare(`
    INSERT INTO users (account, name, password, phone, department, role, permissions, status, createTime, updateTime)
    VALUES (@account, @name, @password, @phone, @department, @role, @permissions, @status, @createTime, @updateTime)
  `);

  const users = [
    { account: 'admin', name: '系统管理员', password: 'admin123', phone: '13800138000', department: '技术部', role: 'admin', permissions: '["*"]', status: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
    { account: 'manager', name: '张经理', password: '123456', phone: '13800138001', department: '管理部', role: 'manager', permissions: '["medicine:view","medicine:add","medicine:edit","device:view","device:add","device:edit","inbound:view","inbound:add","outbound:view","outbound:add","statistics:view"]', status: 1, createTime: '2024-01-02 10:00:00', updateTime: '2024-01-02 10:00:00' },
    { account: 'warehouse', name: '李仓管', password: '123456', phone: '13800138002', department: '仓库管理部', role: 'warehouse', permissions: '["medicine:view","device:view","inbound:view","inbound:add","outbound:view","outbound:add","statistics:view"]', status: 1, createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00' },
    { account: 'viewer', name: '王查看', password: '123456', phone: '13800138003', department: '质量部', role: 'viewer', permissions: '["medicine:view","device:view","inbound:view","outbound:view","statistics:view"]', status: 1, createTime: '2024-01-04 10:00:00', updateTime: '2024-01-04 10:00:00' }
  ];
  users.forEach(u => insertUser.run(u));

  // 药品分类
  const insertMedCat = db.prepare('INSERT INTO medicine_categories (name, description) VALUES (@name, @description)');
  [
    { name: '抗生素', description: '抗菌消炎类药物' },
    { name: '解热镇痛', description: '退烧止痛类药物' },
    { name: '感冒用药', description: '治疗感冒相关药物' },
    { name: '维生素', description: '维生素及营养补充剂' },
    { name: '止咳化痰', description: '止咳化痰类药物' },
    { name: '消化系统', description: '消化系统疾病用药' },
    { name: '抗过敏', description: '抗过敏药物' },
    { name: '清热解毒', description: '清热解毒类药物' }
  ].forEach(c => insertMedCat.run(c));

  // 器械分类
  const insertDevCat = db.prepare('INSERT INTO device_categories (name, description) VALUES (@name, @description)');
  [
    { name: '诊断设备', description: '用于诊断疾病的设备' },
    { name: '治疗设备', description: '用于治疗疾病的设备' },
    { name: '康复设备', description: '用于康复训练的设备' },
    { name: '防护用品', description: '个人防护用品' },
    { name: '耗材', description: '一次性医用耗材' },
    { name: '注射穿刺类', description: '注射穿刺器械' },
    { name: '输液类', description: '输液相关器械' },
    { name: '敷料类', description: '医用敷料' },
    { name: '消毒用品', description: '消毒相关用品' }
  ].forEach(c => insertDevCat.run(c));

  // 药品
  const insertMedicine = db.prepare(`
    INSERT INTO medicines (name, barcode, category, spec, unit, manufacturer, approvalNumber, price, stock, minStock, batchNo, expiryDate, status, remark, createTime, updateTime)
    VALUES (@name, @barcode, @category, @spec, @unit, @manufacturer, @approvalNumber, @price, @stock, @minStock, @batchNo, @expiryDate, @status, @remark, @createTime, @updateTime)
  `);

  const medicines = [
    { name: '阿莫西林胶囊', barcode: '6901234567890', category: '抗生素', spec: '0.5g*24粒', unit: '盒', manufacturer: '哈药集团制药总厂', approvalNumber: '国药准字H23021603', price: 15.50, stock: 580, minStock: 100, batchNo: '20240101', expiryDate: '2026-01-01', status: 1, remark: '处方药', createTime: '2024-01-05 08:00:00', updateTime: '2024-01-15 14:30:00' },
    { name: '布洛芬片', barcode: '6901234567891', category: '解热镇痛', spec: '0.2g*100片', unit: '瓶', manufacturer: '中美史克制药有限公司', approvalNumber: '国药准字H10900089', price: 22.00, stock: 420, minStock: 80, batchNo: '20240115', expiryDate: '2026-02-01', status: 1, remark: '', createTime: '2024-01-06 09:00:00', updateTime: '2024-01-15 11:20:00' },
    { name: '维生素C片', barcode: '6901234567892', category: '维生素', spec: '0.1g*100片', unit: '瓶', manufacturer: '东北制药集团沈阳第一制药有限公司', approvalNumber: '国药准字H21020778', price: 8.50, stock: 850, minStock: 200, batchNo: '20240201', expiryDate: '2026-03-01', status: 1, remark: '', createTime: '2024-01-07 10:00:00', updateTime: '2024-01-14 16:45:00' },
    { name: '阿奇霉素分散片', barcode: '6901234567893', category: '抗生素', spec: '0.25g*6片', unit: '盒', manufacturer: '石药集团欧意药业有限公司', approvalNumber: '国药准字H20057598', price: 35.00, stock: 45, minStock: 60, batchNo: '20240301', expiryDate: '2026-04-01', status: 1, remark: '处方药', createTime: '2024-01-08 11:00:00', updateTime: '2024-01-15 09:15:00' },
    { name: '复方感冒灵颗粒', barcode: '6901234567894', category: '感冒用药', spec: '10g*9袋', unit: '盒', manufacturer: '广州白云山制药股份有限公司', approvalNumber: '国药准字Z44022234', price: 18.00, stock: 320, minStock: 100, batchNo: '20240401', expiryDate: '2026-05-01', status: 1, remark: '', createTime: '2024-01-09 12:00:00', updateTime: '2024-01-13 14:30:00' },
    { name: '板蓝根颗粒', barcode: '6901234567895', category: '清热解毒', spec: '10g*20袋', unit: '盒', manufacturer: '广州白云山和记黄埔中药有限公司', approvalNumber: '国药准字Z44022267', price: 25.00, stock: 650, minStock: 150, batchNo: '20240501', expiryDate: '2026-06-01', status: 1, remark: '', createTime: '2024-01-10 08:30:00', updateTime: '2024-01-15 10:00:00' },
    { name: '头孢克肟胶囊', barcode: '6901234567896', category: '抗生素', spec: '0.1g*10粒', unit: '盒', manufacturer: '广州白云山制药股份有限公司', approvalNumber: '国药准字H20050749', price: 48.00, stock: 220, minStock: 50, batchNo: '20240601', expiryDate: '2026-07-01', status: 1, remark: '处方药', createTime: '2024-01-11 09:45:00', updateTime: '2024-01-14 15:20:00' },
    { name: '感冒清热颗粒', barcode: '6901234567897', category: '感冒用药', spec: '12g*10袋', unit: '盒', manufacturer: '北京同仁堂科技发展股份有限公司', approvalNumber: '国药准字Z11020363', price: 16.00, stock: 480, minStock: 100, batchNo: '20240701', expiryDate: '2026-08-01', status: 1, remark: '', createTime: '2024-01-12 10:15:00', updateTime: '2024-01-15 08:45:00' },
    { name: '银翘解毒片', barcode: '6901234567898', category: '感冒用药', spec: '0.6g*36片', unit: '盒', manufacturer: '广州中药有限公司', approvalNumber: '国药准字Z44021021', price: 12.00, stock: 560, minStock: 120, batchNo: '20240801', expiryDate: '2026-09-01', status: 1, remark: '', createTime: '2024-01-13 11:30:00', updateTime: '2024-01-15 13:00:00' },
    { name: '氯雷他定片', barcode: '6901234567899', category: '抗过敏', spec: '10mg*6片', unit: '盒', manufacturer: '西安杨森制药有限公司', approvalNumber: '国药准字H20070030', price: 28.00, stock: 380, minStock: 80, batchNo: '20240901', expiryDate: '2026-10-01', status: 1, remark: '', createTime: '2024-01-14 12:00:00', updateTime: '2024-01-15 16:30:00' },
    { name: '阿司匹林肠溶片', barcode: '6901234567900', category: '解热镇痛', spec: '100mg*30片', unit: '盒', manufacturer: '拜耳医药', approvalNumber: '国药准字H20070031', price: 28.00, stock: 50, minStock: 100, batchNo: '20241001', expiryDate: '2026-11-01', status: 1, remark: '', createTime: '2024-01-15 08:00:00', updateTime: '2024-01-15 16:30:00' },
    { name: '蒙脱石散', barcode: '6901234567901', category: '消化系统', spec: '3g*10袋', unit: '盒', manufacturer: '博福-益普生', approvalNumber: '国药准字H20070032', price: 32.00, stock: 600, minStock: 120, batchNo: '20241101', expiryDate: '2026-12-01', status: 1, remark: '', createTime: '2024-01-15 09:00:00', updateTime: '2024-01-15 16:30:00' }
  ];
  medicines.forEach(m => insertMedicine.run(m));

  // 医疗器械
  const insertDevice = db.prepare(`
    INSERT INTO devices (name, barcode, category, spec, unit, manufacturer, registrationNumber, price, stock, minStock, batchNo, expiryDate, status, remark, createTime, updateTime)
    VALUES (@name, @barcode, @category, @spec, @unit, @manufacturer, @registrationNumber, @price, @stock, @minStock, @batchNo, @expiryDate, @status, @remark, @createTime, @updateTime)
  `);

  const devices = [
    { name: '一次性使用无菌注射器', barcode: '6902345678901', category: '注射穿刺类', spec: '5ml', unit: '支', manufacturer: '山东威高集团医用高分子制品股份有限公司', registrationNumber: '国械注准20153151564', price: 1.50, stock: 2500, minStock: 500, batchNo: '20240101', expiryDate: '2027-01-01', status: 1, remark: '', createTime: '2024-01-05 08:00:00', updateTime: '2024-01-15 14:30:00' },
    { name: '医用外科口罩', barcode: '6902345678902', category: '防护用品', spec: '17.5cm×9.5cm', unit: '个', manufacturer: '河南飘安集团有限公司', registrationNumber: '国械注准20162641234', price: 0.50, stock: 800, minStock: 300, batchNo: '20240201', expiryDate: '2027-02-01', status: 1, remark: '', createTime: '2024-01-06 09:00:00', updateTime: '2024-01-15 11:20:00' },
    { name: '一次性使用输液器', barcode: '6902345678903', category: '输液类', spec: '带针型', unit: '套', manufacturer: '江西洪达医疗器械集团有限公司', registrationNumber: '国械注准20153151234', price: 3.20, stock: 1800, minStock: 400, batchNo: '20240301', expiryDate: '2027-03-01', status: 1, remark: '', createTime: '2024-01-07 10:00:00', updateTime: '2024-01-14 16:45:00' },
    { name: '医用手套（乳胶）', barcode: '6902345678904', category: '防护用品', spec: 'M号', unit: '副', manufacturer: '蓝帆医疗股份有限公司', registrationNumber: '国械注准20162645678', price: 2.50, stock: 1200, minStock: 200, batchNo: '20240401', expiryDate: '2027-04-01', status: 1, remark: '', createTime: '2024-01-08 11:00:00', updateTime: '2024-01-15 09:15:00' },
    { name: '电子血压计', barcode: '6902345678905', category: '诊断设备', spec: '臂式', unit: '台', manufacturer: '欧姆龙（大连）有限公司', registrationNumber: '国械注准20172215678', price: 299.00, stock: 25, minStock: 10, batchNo: '20240501', expiryDate: '', status: 1, remark: '', createTime: '2024-01-09 12:00:00', updateTime: '2024-01-13 14:30:00' },
    { name: '血糖仪', barcode: '6902345678906', category: '诊断设备', spec: '便携式', unit: '台', manufacturer: '强生（上海）医疗器材有限公司', registrationNumber: '国械注准20182216789', price: 188.00, stock: 32, minStock: 15, batchNo: '20240601', expiryDate: '', status: 1, remark: '', createTime: '2024-01-10 08:30:00', updateTime: '2024-01-15 10:00:00' },
    { name: '一次性使用导尿管', barcode: '6902345678907', category: '注射穿刺类', spec: 'F16', unit: '根', manufacturer: '湛江市事达实业有限公司', registrationNumber: '国械注准20163667890', price: 15.00, stock: 450, minStock: 100, batchNo: '20240701', expiryDate: '2027-07-01', status: 1, remark: '', createTime: '2024-01-11 09:45:00', updateTime: '2024-01-14 15:20:00' },
    { name: '医用纱布块', barcode: '6902345678908', category: '敷料类', spec: '10cm×10cm', unit: '块', manufacturer: '河南稳健医疗器械有限公司', registrationNumber: '国械注准20162642345', price: 0.80, stock: 3000, minStock: 800, batchNo: '20240801', expiryDate: '2027-08-01', status: 1, remark: '', createTime: '2024-01-12 10:15:00', updateTime: '2024-01-15 08:45:00' },
    { name: '创可贴', barcode: '6902345678909', category: '敷料类', spec: '7cm×2cm', unit: '片', manufacturer: '云南白药集团股份有限公司', registrationNumber: '国械注准20173623456', price: 0.50, stock: 2500, minStock: 500, batchNo: '20240901', expiryDate: '2027-09-01', status: 1, remark: '', createTime: '2024-01-13 11:30:00', updateTime: '2024-01-15 13:00:00' },
    { name: '医用酒精棉球', barcode: '6902345678910', category: '消毒用品', spec: '75%酒精', unit: '瓶', manufacturer: '江苏华卫医药有限公司', registrationNumber: '国械注准20182345678', price: 5.50, stock: 1500, minStock: 300, batchNo: '20241001', expiryDate: '2027-10-01', status: 1, remark: '', createTime: '2024-01-14 12:00:00', updateTime: '2024-01-15 16:30:00' },
    { name: '雾化器', barcode: '6902345678911', category: '治疗设备', spec: '压缩式', unit: '台', manufacturer: '鱼跃医疗', registrationNumber: '国械注准20182345679', price: 399.00, stock: 15, minStock: 20, batchNo: '20241101', expiryDate: '', status: 1, remark: '', createTime: '2024-01-15 08:00:00', updateTime: '2024-01-15 16:30:00' },
    { name: '轮椅', barcode: '6902345678912', category: '康复设备', spec: '折叠式', unit: '辆', manufacturer: '鱼跃医疗', registrationNumber: '国械注准20182345680', price: 680.00, stock: 5, minStock: 10, batchNo: '20241201', expiryDate: '', status: 1, remark: '', createTime: '2024-01-15 09:00:00', updateTime: '2024-01-15 16:30:00' }
  ];
  devices.forEach(d => insertDevice.run(d));

  // 入库记录
  const insertInbound = db.prepare(`
    INSERT INTO inbound_records (productId, productName, productType, spec, batchNo, quantity, unit, price, totalAmount, supplier, productionDate, expiryDate, operatorId, operatorName, date, remark, createTime)
    VALUES (@productId, @productName, @productType, @spec, @batchNo, @quantity, @unit, @price, @totalAmount, @supplier, @productionDate, @expiryDate, @operatorId, @operatorName, @date, @remark, @createTime)
  `);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const dayBefore = new Date(Date.now() - 172800000).toISOString().split('T')[0];

  [
    { productId: 1, productName: '阿莫西林胶囊', productType: 'medicine', spec: '0.5g*24粒', batchNo: '2024011501', quantity: 100, unit: '盒', price: 15.50, totalAmount: 1550.00, supplier: '哈药集团', productionDate: '2024-01-01', expiryDate: '2026-01-01', operatorId: 3, operatorName: '李仓管', date: today, remark: '常规补货', createTime: `${today} 09:30:00` },
    { productId: 2, productName: '医用外科口罩', productType: 'device', spec: '17.5cm×9.5cm', batchNo: '2024011502', quantity: 500, unit: '个', price: 0.50, totalAmount: 250.00, supplier: '河南飘安集团', productionDate: '2024-01-05', expiryDate: '2026-01-05', operatorId: 3, operatorName: '李仓管', date: today, remark: '防疫物资', createTime: `${today} 10:15:00` },
    { productId: 2, productName: '布洛芬片', productType: 'medicine', spec: '0.2g*100片', batchNo: '2024011503', quantity: 50, unit: '瓶', price: 22.00, totalAmount: 1100.00, supplier: '中美史克', productionDate: '2024-01-03', expiryDate: '2026-01-03', operatorId: 3, operatorName: '李仓管', date: today, remark: '', createTime: `${today} 14:20:00` },
    { productId: 3, productName: '维生素C片', productType: 'medicine', spec: '0.1g*100片', batchNo: '2024011401', quantity: 200, unit: '瓶', price: 8.50, totalAmount: 1700.00, supplier: '东北制药集团', productionDate: '2024-01-02', expiryDate: '2026-01-02', operatorId: 3, operatorName: '李仓管', date: yesterday, remark: '', createTime: `${yesterday} 08:45:00` },
    { productId: 3, productName: '一次性使用输液器', productType: 'device', spec: '带针型', batchNo: '2024011402', quantity: 300, unit: '套', price: 3.20, totalAmount: 960.00, supplier: '江西洪达医疗器械集团', productionDate: '2024-01-01', expiryDate: '2027-01-01', operatorId: 3, operatorName: '李仓管', date: yesterday, remark: '', createTime: `${yesterday} 11:30:00` },
    { productId: 6, productName: '板蓝根颗粒', productType: 'medicine', spec: '10g*20袋', batchNo: '2024011301', quantity: 150, unit: '盒', price: 25.00, totalAmount: 3750.00, supplier: '广州白云山和记黄埔中药有限公司', productionDate: '2023-12-20', expiryDate: '2025-12-20', operatorId: 3, operatorName: '李仓管', date: dayBefore, remark: '', createTime: `${dayBefore} 09:00:00` }
  ].forEach(r => insertInbound.run(r));

  // 出库记录
  const insertOutbound = db.prepare(`
    INSERT INTO outbound_records (productId, productName, productType, spec, batchNo, quantity, unit, price, totalAmount, department, receiver, purpose, operatorId, operatorName, date, remark, createTime)
    VALUES (@productId, @productName, @productType, @spec, @batchNo, @quantity, @unit, @price, @totalAmount, @department, @receiver, @purpose, @operatorId, @operatorName, @date, @remark, @createTime)
  `);

  [
    { productId: 1, productName: '阿莫西林胶囊', productType: 'medicine', spec: '0.5g*24粒', batchNo: '2024011501', quantity: 20, unit: '盒', price: 15.50, totalAmount: 310.00, department: '内科', receiver: '张医生', purpose: '门诊用药', operatorId: 3, operatorName: '李仓管', date: today, remark: '', createTime: `${today} 10:30:00` },
    { productId: 2, productName: '医用外科口罩', productType: 'device', spec: '17.5cm×9.5cm', batchNo: '2024011502', quantity: 100, unit: '个', price: 0.50, totalAmount: 50.00, department: '外科', receiver: '王护士', purpose: '日常使用', operatorId: 3, operatorName: '李仓管', date: today, remark: '', createTime: `${today} 11:45:00` },
    { productId: 1, productName: '一次性使用无菌注射器', productType: 'device', spec: '5ml', batchNo: '2024011001', quantity: 200, unit: '支', price: 1.50, totalAmount: 300.00, department: '注射室', receiver: '李护士', purpose: '日常注射', operatorId: 3, operatorName: '李仓管', date: today, remark: '', createTime: `${today} 15:00:00` },
    { productId: 2, productName: '布洛芬片', productType: 'medicine', spec: '0.2g*100片', batchNo: '2024011201', quantity: 15, unit: '瓶', price: 22.00, totalAmount: 330.00, department: '内科', receiver: '刘医生', purpose: '门诊用药', operatorId: 3, operatorName: '李仓管', date: yesterday, remark: '', createTime: `${yesterday} 09:20:00` },
    { productId: 8, productName: '医用纱布块', productType: 'device', spec: '10cm×10cm', batchNo: '2024011101', quantity: 100, unit: '块', price: 0.80, totalAmount: 80.00, department: '外科', receiver: '赵护士', purpose: '换药使用', operatorId: 3, operatorName: '李仓管', date: yesterday, remark: '', createTime: `${yesterday} 14:30:00` },
    { productId: 3, productName: '维生素C片', productType: 'medicine', spec: '0.1g*100片', batchNo: '2024011002', quantity: 30, unit: '瓶', price: 8.50, totalAmount: 255.00, department: '药房', receiver: '周药师', purpose: '零售', operatorId: 3, operatorName: '李仓管', date: dayBefore, remark: '', createTime: `${dayBefore} 10:15:00` }
  ].forEach(r => insertOutbound.run(r));

  // 操作日志
  const insertLog = db.prepare(`
    INSERT INTO operation_logs (userId, userName, action, module, description, ip, createTime)
    VALUES (@userId, @userName, @action, @module, @description, @ip, @createTime)
  `);

  [
    { userId: 1, userName: '系统管理员', action: '登录', module: '用户管理', description: '管理员登录系统', ip: '192.168.1.1', createTime: `${today} 08:00:00` },
    { userId: 3, userName: '李仓管', action: '入库', module: '药品管理', description: '入库：阿莫西林胶囊 100盒', ip: '192.168.1.100', createTime: `${today} 09:30:00` },
    { userId: 3, userName: '李仓管', action: '出库', module: '药品管理', description: '出库：阿莫西林胶囊 20盒 → 内科', ip: '192.168.1.100', createTime: `${today} 10:30:00` },
    { userId: 3, userName: '李仓管', action: '入库', module: '器械管理', description: '入库：医用外科口罩 500个', ip: '192.168.1.100', createTime: `${today} 10:15:00` },
    { userId: 2, userName: '张经理', action: '编辑', module: '药品管理', description: '修改药品信息：布洛芬片', ip: '192.168.1.101', createTime: `${today} 11:00:00` },
    { userId: 3, userName: '李仓管', action: '出库', module: '器械管理', description: '出库：一次性使用无菌注射器 200支 → 注射室', ip: '192.168.1.100', createTime: `${today} 15:00:00` }
  ].forEach(l => insertLog.run(l));

  // 角色
  const insertRole = db.prepare('INSERT INTO roles (name, label, description) VALUES (@name, @label, @description)');
  [
    { name: 'admin', label: '管理员', description: '拥有所有权限' },
    { name: 'manager', label: '经理', description: '管理药品、器械和出入库' },
    { name: 'warehouse', label: '仓库管理员', description: '负责出入库操作' },
    { name: 'viewer', label: '查看者', description: '只能查看数据' }
  ].forEach(r => insertRole.run(r));

  // 权限
  const insertPerm = db.prepare('INSERT INTO permissions (code, name, module) VALUES (@code, @name, @module)');
  [
    { code: 'medicine:view', name: '查看药品', module: '药品管理' },
    { code: 'medicine:add', name: '添加药品', module: '药品管理' },
    { code: 'medicine:edit', name: '编辑药品', module: '药品管理' },
    { code: 'medicine:delete', name: '删除药品', module: '药品管理' },
    { code: 'device:view', name: '查看器械', module: '器械管理' },
    { code: 'device:add', name: '添加器械', module: '器械管理' },
    { code: 'device:edit', name: '编辑器械', module: '器械管理' },
    { code: 'device:delete', name: '删除器械', module: '器械管理' },
    { code: 'inbound:view', name: '查看入库', module: '入库管理' },
    { code: 'inbound:add', name: '入库操作', module: '入库管理' },
    { code: 'outbound:view', name: '查看出库', module: '出库管理' },
    { code: 'outbound:add', name: '出库操作', module: '出库管理' },
    { code: 'statistics:view', name: '查看统计', module: '统计分析' },
    { code: 'statistics:export', name: '导出报表', module: '统计分析' },
    { code: 'user:view', name: '查看用户', module: '用户管理' },
    { code: 'user:edit', name: '编辑用户', module: '用户管理' }
  ].forEach(p => insertPerm.run(p));

  console.log('种子数据初始化完成！');
}

module.exports = { initTables, seedData };
