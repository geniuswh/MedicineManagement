const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { getDb } = require('./database');
const { initTables, seedData } = require('./init-db');

const JWT_SECRET = 'medicine_management_secret_key_2024';
const app = express();
const PORT = 3002;

// 初始化数据库
initTables();
seedData();

// 中间件
app.use(cors());
app.use(express.json());

// 响应格式
function response(data, success = true) {
  return { code: success ? 200 : 500, data, message: success ? 'success' : 'error' };
}

// JWT验证中间件
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json(response(null, false));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json(response(null, false));
  }
}

// ========== 认证 ==========
app.post('/api/auth/login', (req, res) => {
  const { account, password } = req.body;
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE (account = ? OR phone = ?) AND password = ?').get(account, account, password);

  if (user) {
    const { password: _, permissions, ...userInfo } = user;
    const token = jwt.sign({ id: user.id, account: user.account, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json(response({
      token,
      userInfo: { ...userInfo, permissions: JSON.parse(permissions) },
      permissions: JSON.parse(permissions)
    }));
  }
  return res.json(response(null, false));
});

app.get('/api/auth/info', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (user) {
    const { password: _, permissions, ...userInfo } = user;
    return res.json(response({ ...userInfo, permissions: JSON.parse(permissions) }));
  }
  return res.json(response(null, false));
});

// ========== 药品管理 ==========
app.get('/api/medicines', (req, res) => {
  const db = getDb();
  let { keyword, category, status, page = 1, pageSize = 20 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  let sql = 'SELECT * FROM medicines WHERE 1=1';
  const params = [];

  if (keyword) { sql += ' AND (name LIKE ? OR barcode LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (status !== undefined && status !== '') { sql += ' AND status = ?'; params.push(parseInt(status)); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM (${sql})`).get(params).count;
  sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(pageSize, (page - 1) * pageSize);

  const list = db.prepare(sql).all(params);
  res.json(response({ list, total, page, pageSize }));
});

app.get('/api/medicines/categories', (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM medicine_categories ORDER BY id').all();
  res.json(response(list));
});

app.post('/api/medicines', authMiddleware, (req, res) => {
  const db = getDb();
  const data = req.body;
  const result = db.prepare(`
    INSERT INTO medicines (name, barcode, category, spec, unit, manufacturer, approvalNumber, price, stock, minStock, batchNo, expiryDate, status, remark)
    VALUES (@name, @barcode, @category, @spec, @unit, @manufacturer, @approvalNumber, @price, @stock, @minStock, @batchNo, @expiryDate, @status, @remark)
  `).run(data);
  const medicine = db.prepare('SELECT * FROM medicines WHERE id = ?').get(result.lastInsertRowid);
  res.json(response(medicine));
});

app.put('/api/medicines/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const data = req.body;
  data.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const sets = Object.keys(data).filter(k => k !== 'id').map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE medicines SET ${sets} WHERE id = @id`).run({ ...data, id: parseInt(req.params.id) });
  const medicine = db.prepare('SELECT * FROM medicines WHERE id = ?').get(req.params.id);
  res.json(response(medicine));
});

app.delete('/api/medicines/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM medicines WHERE id = ?').run(parseInt(req.params.id));
  res.json(response({ success: true }));
});

// ========== 医疗器械管理 ==========
app.get('/api/devices', (req, res) => {
  const db = getDb();
  let { keyword, category, status, page = 1, pageSize = 20 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  let sql = 'SELECT * FROM devices WHERE 1=1';
  const params = [];

  if (keyword) { sql += ' AND (name LIKE ? OR barcode LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (status !== undefined && status !== '') { sql += ' AND status = ?'; params.push(parseInt(status)); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM (${sql})`).get(params).count;
  sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(pageSize, (page - 1) * pageSize);

  const list = db.prepare(sql).all(params);
  res.json(response({ list, total, page, pageSize }));
});

app.get('/api/devices/categories', (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM device_categories ORDER BY id').all();
  res.json(response(list));
});

app.post('/api/devices', authMiddleware, (req, res) => {
  const db = getDb();
  const data = req.body;
  const result = db.prepare(`
    INSERT INTO devices (name, barcode, category, spec, unit, manufacturer, registrationNumber, price, stock, minStock, batchNo, expiryDate, status, remark)
    VALUES (@name, @barcode, @category, @spec, @unit, @manufacturer, @registrationNumber, @price, @stock, @minStock, @batchNo, @expiryDate, @status, @remark)
  `).run(data);
  const device = db.prepare('SELECT * FROM devices WHERE id = ?').get(result.lastInsertRowid);
  res.json(response(device));
});

app.put('/api/devices/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const data = req.body;
  data.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const sets = Object.keys(data).filter(k => k !== 'id').map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE devices SET ${sets} WHERE id = @id`).run({ ...data, id: parseInt(req.params.id) });
  const device = db.prepare('SELECT * FROM devices WHERE id = ?').get(req.params.id);
  res.json(response(device));
});

app.delete('/api/devices/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM devices WHERE id = ?').run(parseInt(req.params.id));
  res.json(response({ success: true }));
});

// ========== 入库记录 ==========
app.get('/api/inbound', (req, res) => {
  const db = getDb();
  let { keyword, productId, startDate, endDate, page = 1, pageSize = 20 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  let sql = 'SELECT * FROM inbound_records WHERE 1=1';
  const params = [];

  if (keyword) { sql += ' AND (productName LIKE ? OR batchNo LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (productId) { sql += ' AND productId = ?'; params.push(parseInt(productId)); }
  if (startDate && endDate) { sql += ' AND date >= ? AND date <= ?'; params.push(startDate, endDate); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM (${sql})`).get(params).count;
  sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(pageSize, (page - 1) * pageSize);

  const list = db.prepare(sql).all(params);
  res.json(response({ list, total, page, pageSize }));
});

app.post('/api/inbound', authMiddleware, (req, res) => {
  const db = getDb();
  const data = req.body;
  data.createTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  if (!data.date) data.date = new Date().toISOString().split('T')[0];

  const insert = db.prepare(`
    INSERT INTO inbound_records (productId, productName, productType, spec, batchNo, quantity, unit, price, totalAmount, supplier, productionDate, expiryDate, operatorId, operatorName, date, remark, createTime)
    VALUES (@productId, @productName, @productType, @spec, @batchNo, @quantity, @unit, @price, @totalAmount, @supplier, @productionDate, @expiryDate, @operatorId, @operatorName, @date, @remark, @createTime)
  `);
  const result = insert.run(data);

  // 更新库存
  const table = data.productType === 'medicine' ? 'medicines' : 'devices';
  db.prepare(`UPDATE ${table} SET stock = stock + ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`).run(data.quantity, data.productId);

  const record = db.prepare('SELECT * FROM inbound_records WHERE id = ?').get(result.lastInsertRowid);
  res.json(response(record));
});

// ========== 出库记录 ==========
app.get('/api/outbound', (req, res) => {
  const db = getDb();
  let { keyword, productId, startDate, endDate, page = 1, pageSize = 20 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  let sql = 'SELECT * FROM outbound_records WHERE 1=1';
  const params = [];

  if (keyword) { sql += ' AND (productName LIKE ? OR batchNo LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (productId) { sql += ' AND productId = ?'; params.push(parseInt(productId)); }
  if (startDate && endDate) { sql += ' AND date >= ? AND date <= ?'; params.push(startDate, endDate); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM (${sql})`).get(params).count;
  sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(pageSize, (page - 1) * pageSize);

  const list = db.prepare(sql).all(params);
  res.json(response({ list, total, page, pageSize }));
});

app.post('/api/outbound', authMiddleware, (req, res) => {
  const db = getDb();
  const data = req.body;
  data.createTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  if (!data.date) data.date = new Date().toISOString().split('T')[0];

  const insert = db.prepare(`
    INSERT INTO outbound_records (productId, productName, productType, spec, batchNo, quantity, unit, price, totalAmount, department, receiver, purpose, operatorId, operatorName, date, remark, createTime)
    VALUES (@productId, @productName, @productType, @spec, @batchNo, @quantity, @unit, @price, @totalAmount, @department, @receiver, @purpose, @operatorId, @operatorName, @date, @remark, @createTime)
  `);
  const result = insert.run(data);

  // 更新库存
  const table = data.productType === 'medicine' ? 'medicines' : 'devices';
  db.prepare(`UPDATE ${table} SET stock = MAX(0, stock - ?), updateTime = CURRENT_TIMESTAMP WHERE id = ?`).run(data.quantity, data.productId);

  const record = db.prepare('SELECT * FROM outbound_records WHERE id = ?').get(result.lastInsertRowid);
  res.json(response(record));
});

// ========== 库存预警 ==========
app.get('/api/warnings', (req, res) => {
  const db = getDb();
  const medWarnings = db.prepare('SELECT *, \'medicine\' as type, CASE WHEN stock <= minStock * 0.5 THEN \'danger\' ELSE \'warning\' END as level FROM medicines WHERE stock <= minStock AND status = 1').all();
  const devWarnings = db.prepare('SELECT *, \'device\' as type, CASE WHEN stock <= minStock * 0.5 THEN \'danger\' ELSE \'warning\' END as level FROM devices WHERE stock <= minStock AND status = 1').all();
  res.json(response([...medWarnings, ...devWarnings]));
});

// ========== 统计分析 ==========
app.get('/api/statistics', (req, res) => {
  const db = getDb();
  const { period = 'month' } = req.query;

  const totalMedicines = db.prepare('SELECT COUNT(*) as count FROM medicines WHERE status = 1').get().count;
  const totalDevices = db.prepare('SELECT COUNT(*) as count FROM devices WHERE status = 1').get().count;
  const totalStock = db.prepare('SELECT COALESCE(SUM(stock), 0) as total FROM medicines WHERE status = 1').get().total +
                     db.prepare('SELECT COALESCE(SUM(stock), 0) as total FROM devices WHERE status = 1').get().total;
  const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM medicines WHERE stock <= minStock AND status = 1').get().count +
                        db.prepare('SELECT COUNT(*) as count FROM devices WHERE stock <= minStock AND status = 1').get().count;

  const today = new Date().toISOString().split('T')[0];
  const todayInbound = db.prepare('SELECT COUNT(*) as count FROM inbound_records WHERE date = ?').get(today).count;
  const todayOutbound = db.prepare('SELECT COUNT(*) as count FROM outbound_records WHERE date = ?').get(today).count;
  const todayInboundAmount = db.prepare('SELECT COALESCE(SUM(totalAmount), 0) as total FROM inbound_records WHERE date = ?').get(today).total;
  const todayOutboundAmount = db.prepare('SELECT COALESCE(SUM(totalAmount), 0) as total FROM outbound_records WHERE date = ?').get(today).total;

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const monthInbound = db.prepare('SELECT COUNT(*) as count FROM inbound_records WHERE date >= ?').get(monthStart).count;
  const monthOutbound = db.prepare('SELECT COUNT(*) as count FROM outbound_records WHERE date >= ?').get(monthStart).count;
  const monthInboundAmount = db.prepare('SELECT COALESCE(SUM(totalAmount), 0) as total FROM inbound_records WHERE date >= ?').get(monthStart).total;
  const monthOutboundAmount = db.prepare('SELECT COALESCE(SUM(totalAmount), 0) as total FROM outbound_records WHERE date >= ?').get(monthStart).total;

  const stats = {
    totalProducts: totalMedicines + totalDevices,
    totalMedicines,
    totalDevices,
    totalStock,
    lowStockCount,
    today: { inboundCount: todayInbound, outboundCount: todayOutbound, inboundAmount: todayInboundAmount, outboundAmount: todayOutboundAmount },
    month: { totalInbound: monthInbound, inboundAmount: monthInboundAmount, totalOutbound: monthOutbound, outboundAmount: monthOutboundAmount, totalProducts: totalMedicines + totalDevices, lowStockCount },
    quarter: { totalInbound: monthInbound * 3, inboundAmount: monthInboundAmount * 3, totalOutbound: monthOutbound * 3, outboundAmount: monthOutboundAmount * 3, totalProducts: totalMedicines + totalDevices, lowStockCount },
    year: { totalInbound: monthInbound * 12, inboundAmount: monthInboundAmount * 12, totalOutbound: monthOutbound * 12, outboundAmount: monthOutboundAmount * 12, totalProducts: totalMedicines + totalDevices, lowStockCount }
  };

  res.json(response(stats));
});

app.get('/api/statistics/trend', (req, res) => {
  const db = getDb();
  const { period = 'week' } = req.query;

  if (period === 'week') {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const inbound = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(totalAmount), 0) as amount FROM inbound_records WHERE date = ?').get(date);
      const outbound = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(totalAmount), 0) as amount FROM outbound_records WHERE date = ?').get(date);
      list.push({ date, inbound: inbound.count, outbound: outbound.count, inboundAmount: inbound.amount, outboundAmount: outbound.amount });
    }
    return res.json(response(list));
  }

  // 月度趋势 - 最近12个月
  const list = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const inbound = db.prepare("SELECT COUNT(*) as count, COALESCE(SUM(totalAmount), 0) as amount FROM inbound_records WHERE strftime('%Y-%m', date) = ?").get(month);
    const outbound = db.prepare("SELECT COUNT(*) as count, COALESCE(SUM(totalAmount), 0) as amount FROM outbound_records WHERE strftime('%Y-%m', date) = ?").get(month);
    list.push({ month, inbound: inbound.count, outbound: outbound.count, inboundAmount: inbound.amount, outboundAmount: outbound.amount });
  }
  res.json(response(list));
});

app.get('/api/statistics/rank', (req, res) => {
  const db = getDb();
  const { type = 'outbound' } = req.query;
  const table = type === 'inbound' ? 'inbound_records' : 'outbound_records';

  const list = db.prepare(`
    SELECT productName as name, spec, SUM(quantity) as quantity, COUNT(*) as count, SUM(totalAmount) as amount
    FROM ${table}
    GROUP BY productName
    ORDER BY quantity DESC
    LIMIT 10
  `).all();

  res.json(response(list));
});

// ========== 用户管理 ==========
app.get('/api/users', authMiddleware, (req, res) => {
  const db = getDb();
  let { keyword, role, page = 1, pageSize = 20 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  let sql = 'SELECT id, account, name, phone, avatar, department, role, permissions, status, createTime, updateTime FROM users WHERE 1=1';
  const params = [];

  if (keyword) { sql += ' AND (name LIKE ? OR account LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (role) { sql += ' AND role = ?'; params.push(role); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM (${sql})`).get(params).count;
  sql += ' ORDER BY id LIMIT ? OFFSET ?';
  params.push(pageSize, (page - 1) * pageSize);

  const list = db.prepare(sql).all(params).map(u => ({ ...u, permissions: JSON.parse(u.permissions) }));
  res.json(response({ list, total, page, pageSize }));
});

app.post('/api/users', authMiddleware, (req, res) => {
  const db = getDb();
  const data = req.body;
  data.createTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  data.updateTime = data.createTime;
  if (!data.permissions) data.permissions = '[]';
  if (!data.role) data.role = 'viewer';
  if (!data.status) data.status = 'active';

  const result = db.prepare(`
    INSERT INTO users (account, name, phone, password, department, role, permissions, status, createTime, updateTime)
    VALUES (@account, @name, @phone, @password, @department, @role, @permissions, @status, @createTime, @updateTime)
  `).run(data);
  const user = db.prepare('SELECT id, account, name, phone, department, role, permissions, status, createTime FROM users WHERE id = ?').get(result.lastInsertRowid);
  if (user) user.permissions = JSON.parse(user.permissions);
  res.json(response(user));
});

app.put('/api/users/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const data = req.body;
  data.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  if (data.permissions && typeof data.permissions !== 'string') data.permissions = JSON.stringify(data.permissions);

  const fields = Object.keys(data).filter(k => k !== 'id');
  const sets = fields.map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE users SET ${sets} WHERE id = @id`).run({ ...data, id: parseInt(req.params.id) });
  const user = db.prepare('SELECT id, account, name, phone, department, role, permissions, status, createTime FROM users WHERE id = ?').get(req.params.id);
  if (user) user.permissions = JSON.parse(user.permissions);
  res.json(response(user));
});

app.delete('/api/users/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM users WHERE id = ?').run(parseInt(req.params.id));
  res.json(response({ success: true }));
});

app.get('/api/roles', (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM roles ORDER BY id').all();
  res.json(response(list));
});

app.get('/api/permissions', (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM permissions ORDER BY id').all();
  res.json(response(list));
});

// ========== 操作日志 ==========
app.get('/api/logs', (req, res) => {
  const db = getDb();
  let { userId, module, page = 1, pageSize = 20 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  let sql = 'SELECT * FROM operation_logs WHERE 1=1';
  const params = [];

  if (userId) { sql += ' AND userId = ?'; params.push(parseInt(userId)); }
  if (module) { sql += ' AND module = ?'; params.push(module); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM (${sql})`).get(params).count;
  sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(pageSize, (page - 1) * pageSize);

  const list = db.prepare(sql).all(params);
  res.json(response({ list, total, page, pageSize }));
});

// ========== 库存盘点 ==========
app.get('/api/stock', (req, res) => {
  const db = getDb();
  const medList = db.prepare("SELECT id, name, category, spec, unit, stock, minStock, price, CASE WHEN stock <= 0 THEN 'out' WHEN stock <= minStock THEN 'low' ELSE 'normal' END as status FROM medicines WHERE status = 1").all();
  const devList = db.prepare("SELECT id, name, category, spec, unit, stock, minStock, price, CASE WHEN stock <= 0 THEN 'out' WHEN stock <= minStock THEN 'low' ELSE 'normal' END as status FROM devices WHERE status = 1").all();
  res.json(response({ medicines: medList, devices: devList }));
});

app.listen(PORT, () => {
  console.log(`医药管理系统后端服务已启动: http://localhost:${PORT}`);
  console.log(`API地址: http://localhost:${PORT}/api`);
});
