# 医药管理系统

一个完整的药品和医疗器械出入库管理系统，包含微信小程序、Web前端和后台管理。

## 🚀 快速开始

### 1. 安装依赖

```bash
# Windows 双击运行
install.bat

# 或手动安装
cd web-frontend && npm install
cd ../admin-frontend && npm install
```

### 2. 启动项目

```bash
# Windows 双击运行
start.bat

# 或手动启动
cd web-frontend && npm run dev     # 端口 3000
cd admin-frontend && npm run dev   # 端口 3001
```

### 3. 访问地址

| 平台 | 地址 | 账号 |
|------|------|------|
| Web前端 | http://localhost:3000 | admin / admin123 |
| 后台管理 | http://localhost:3001 | admin / admin123 |

## 📦 项目结构

```
WXTools/
├── miniprogram/          # 微信小程序
├── web-frontend/         # Web前端 (Vue3)
├── admin-frontend/       # 后台管理 (Vue3)
├── cloudfunctions/       # 云函数
├── docs/                 # 文档
├── install.bat          # 安装脚本
└── start.bat            # 启动脚本
```

## ✨ 功能特性

- 🔐 **用户管理** - 注册登录、角色权限
- 💊 **药品管理** - 增删改查、分类管理
- 🏥 **器械管理** - 医疗器械管理
- 📦 **出入库** - 入库/出库操作、库存更新
- 📊 **统计分析** - 趋势图、饼图、排行榜
- ⚠️ **库存预警** - 低库存提醒

## 🎯 Mock数据

当前项目使用Mock数据，无需数据库即可运行：

- 10个药品数据
- 10个医疗器械数据
- 出入库记录
- 用户数据
- 统计数据

## 📝 开发说明

### Web前端

```bash
cd web-frontend
npm run dev     # 开发
npm run build   # 打包
```

### 后台管理

```bash
cd admin-frontend
npm run dev     # 开发
npm run build   # 打包
```

## 🔧 技术栈

| 端 | 技术 |
|---|---|
| Web前端 | Vue3 + Element Plus + ECharts |
| 后台管理 | Vue3 + Element Plus + ECharts |
| 小程序 | 原生微信小程序 + 云开发 |
| 后端 | 微信云开发 (云函数/云数据库) |

## 📖 文档

- [数据库设计](docs/DATABASE.md)
- [详细说明](docs/README.md)

## 📄 License

MIT
