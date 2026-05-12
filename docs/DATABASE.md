# 数据库设计文档

## 1. 用户表 (users)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | string | 用户ID（自动生成） |
| account | string | 账号 |
| phone | string | 手机号 |
| name | string | 姓名 |
| password | string | 密码（加密存储） |
| avatar | string | 头像URL |
| department | string | 所属部门 |
| role | string | 角色（admin/manager/warehouse/viewer） |
| permissions | array | 权限列表 |
| status | string | 状态（active/inactive） |
| createTime | date | 创建时间 |
| updateTime | date | 更新时间 |

## 2. 药品表 (medicines)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | string | 药品ID |
| name | string | 药品名称 |
| spec | string | 规格 |
| unit | string | 单位 |
| manufacturer | string | 生产厂家 |
| approvalNumber | string | 批准文号 |
| category | string | 分类 |
| price | number | 单价 |
| stock | number | 库存数量 |
| minStock | number | 最低库存 |
| barcode | string | 条形码 |
| status | string | 状态 |
| remark | string | 备注 |
| createTime | date | 创建时间 |
| updateTime | date | 更新时间 |

## 3. 医疗器械表 (devices)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | string | 器械ID |
| name | string | 器械名称 |
| spec | string | 规格型号 |
| unit | string | 单位 |
| manufacturer | string | 生产厂家 |
| registrationNumber | string | 注册证号 |
| category | string | 分类 |
| price | number | 单价 |
| stock | number | 库存数量 |
| minStock | number | 最低库存 |
| barcode | string | 条形码 |
| status | string | 状态 |
| remark | string | 备注 |
| createTime | date | 创建时间 |
| updateTime | date | 更新时间 |

## 4. 入库记录表 (inbound_records)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | string | 记录ID |
| productId | string | 产品ID |
| productName | string | 产品名称 |
| productType | string | 产品类型 |
| spec | string | 规格 |
| batchNo | string | 批号 |
| quantity | number | 数量 |
| unit | string | 单位 |
| price | number | 单价 |
| totalAmount | number | 总金额 |
| supplier | string | 供应商 |
| productionDate | string | 生产日期 |
| expiryDate | string | 有效期至 |
| operatorId | string | 操作人ID |
| operatorName | string | 操作人姓名 |
| date | string | 日期 |
| remark | string | 备注 |
| createTime | date | 创建时间 |
| updateTime | date | 更新时间 |

## 5. 出库记录表 (outbound_records)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | string | 记录ID |
| productId | string | 产品ID |
| productName | string | 产品名称 |
| productType | string | 产品类型 |
| spec | string | 规格 |
| batchNo | string | 批号 |
| quantity | number | 数量 |
| unit | string | 单位 |
| price | number | 单价 |
| totalAmount | number | 总金额 |
| department | string | 领用部门 |
| receiver | string | 领用人 |
| purpose | string | 用途说明 |
| operatorId | string | 操作人ID |
| operatorName | string | 操作人姓名 |
| date | string | 日期 |
| remark | string | 备注 |
| createTime | date | 创建时间 |
| updateTime | date | 更新时间 |

## 6. 库存流水表 (inventory_records)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | string | 记录ID |
| productId | string | 产品ID |
| productName | string | 产品名称 |
| type | string | 类型（inbound/outbound） |
| batchNo | string | 批号 |
| quantity | number | 数量 |
| unit | string | 单位 |
| operatorName | string | 操作人 |
| createTime | date | 创建时间 |

## 7. 操作日志表 (operation_logs)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | string | 日志ID |
| userId | string | 用户ID |
| userName | string | 用户名 |
| action | string | 操作类型 |
| module | string | 模块 |
| description | string | 操作描述 |
| ip | string | IP地址 |
| createTime | date | 创建时间 |

## 8. 系统配置表 (system_config)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | string | 配置ID |
| key | string | 配置键 |
| value | string | 配置值 |
| description | string | 配置说明 |
| createTime | date | 创建时间 |
| updateTime | date | 更新时间 |

---

## 数据库索引建议

### users表
- `account` (唯一索引)
- `phone` (唯一索引)
- `role`

### medicines表
- `name`
- `barcode` (唯一索引)
- `category`
- `status`

### devices表
- `name`
- `barcode` (唯一索引)
- `category`
- `status`

### inbound_records表
- `productId`
- `date`
- `batchNo`
- `createTime`

### outbound_records表
- `productId`
- `date`
- `batchNo`
- `createTime`

### inventory_records表
- `productId`
- `type`
- `createTime`

### operation_logs表
- `userId`
- `createTime`
