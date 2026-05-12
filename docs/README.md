# 医药管理系统 - 项目说明

## 项目概述

这是一个完整的药品和医疗器械出入库管理系统，包含：
- 微信小程序端（用户使用）
- Web前端页面（展示查询）
- 后台管理系统（管理员使用）
- 微信云开发后端

## 技术栈

### 小程序端
- 原生微信小程序框架
- 微信云开发
- 云数据库 + 云函数 + 云存储

### Web前端
- Vue 3
- Element Plus
- ECharts
- Pinia
- Vue Router
- Vite

### 后台管理
- Vue 3
- Element Plus
- ECharts
- Pinia
- Vue Router
- Vite

### 后端服务
- 微信云开发
- 云函数（Node.js）

## 项目结构

```
WXTools/
├── miniprogram/              # 小程序端
│   ├── pages/                # 页面
│   │   ├── login/           # 登录
│   │   ├── register/        # 注册
│   │   ├── index/           # 首页
│   │   ├── inventory/       # 出入库
│   │   │   ├── inbound/     # 入库
│   │   │   └── outbound/    # 出库
│   │   ├── statistics/      # 统计
│   │   ├── profile/         # 我的
│   │   ├── medicine/        # 药品
│   │   └── device/          # 器械
│   ├── utils/               # 工具函数
│   │   ├── auth.js         # 权限管理
│   │   ├── db.js           # 数据库操作
│   │   └── util.js         # 通用工具
│   ├── app.js
│   ├── app.json
│   └── app.wxss
│
├── web-frontend/            # Web前端
│   ├── src/
│   │   ├── api/            # API接口
│   │   ├── components/     # 组件
│   │   ├── layout/         # 布局
│   │   ├── router/         # 路由
│   │   ├── stores/         # 状态管理
│   │   ├── styles/         # 样式
│   │   ├── utils/          # 工具
│   │   └── views/          # 页面
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── admin-frontend/          # 后台管理
│   ├── src/
│   │   ├── api/            # API接口
│   │   ├── components/     # 组件
│   │   ├── layout/         # 布局
│   │   ├── router/         # 路由
│   │   ├── stores/         # 状态管理
│   │   ├── styles/         # 样式
│   │   ├── utils/          # 工具
│   │   └── views/          # 页面
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── cloudfunctions/          # 云函数
│   ├── getPhoneNumber/     # 获取手机号
│   ├── exportStatistics/   # 导出统计
│   └── syncData/           # 数据同步
│
└── docs/                    # 文档
    ├── DATABASE.md         # 数据库设计
    └── README.md           # 项目说明
```

## 功能特性

### 1. 用户管理
- 用户注册/登录
- 微信一键登录
- 角色权限管理
- 用户信息管理

### 2. 权限管理
- 角色定义：管理员、经理、仓库管理员、查看者
- 权限细分：药品管理、器械管理、出入库、统计等
- 动态权限控制

### 3. 药品管理
- 药品信息录入
- 药品查询搜索
- 药品分类管理
- 批次管理

### 4. 医疗器械管理
- 器械信息录入
- 器械查询搜索
- 器械分类管理
- 批次管理

### 5. 出入库管理
- 扫码入库/出库
- 批次选择
- 库存实时更新
- 出入库记录

### 6. 统计分析
- 出入库趋势图
- 品类分布图
- 排行榜
- 多维度数据统计

### 7. 库存预警
- 低库存预警
- 过期预警
- 预警通知

### 8. 报表导出
- 数据导出Excel
- 自定义时间范围

## 部署说明

### 小程序部署

1. 下载微信开发者工具
2. 导入 `miniprogram` 目录
3. 开通云开发环境
4. 修改 `app.js` 中的云开发环境ID
5. 上传并部署云函数
6. 创建数据库集合（参考 DATABASE.md）
7. 上传代码并提交审核

### Web前端部署

```bash
cd web-frontend
npm install
npm run dev    # 开发环境
npm run build  # 生产环境
```

### 后台管理部署

```bash
cd admin-frontend
npm install
npm run dev    # 开发环境
npm run build  # 生产环境
```

## 环境要求

- Node.js >= 16.0
- 微信开发者工具最新版
- 微信云开发环境

## 默认账号

### 后台管理系统
- 账号：admin
- 密码：admin123

## 开发计划

- [ ] 消息推送通知
- [ ] 数据导入导出优化
- [ ] 更多统计维度
- [ ] 移动端适配优化
- [ ] 性能优化

## 版本历史

### v1.0.0 (2024-01-15)
- 初始版本发布
- 完成核心功能开发

## 联系方式

如有问题，请联系开发团队。
