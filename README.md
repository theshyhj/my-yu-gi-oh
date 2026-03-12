# 游戏王卡牌收藏网站

一个基于 Vue.js + Node.js + MongoDB 的游戏王卡牌收集与卡组管理网站。

## 功能特性

- 🎴 **抽卡系统** - 按稀有度概率抽取卡牌
- 📚 **卡牌图鉴** - 浏览所有卡牌，支持筛选搜索
- 💎 **我的收藏** - 管理已拥有的卡牌
- 🃏 **卡组管理** - 按 OCG 规则组建卡组
- ⚙️ **后台管理** - 管理员可添加/编辑/删除卡牌

## 技术栈

- **前端**: Vue.js 3 + Vue Router + Pinia + Vite
- **后端**: Node.js + Express
- **数据库**: MongoDB

## 快速开始

### 1. 安装 MongoDB

确保本地已安装并运行 MongoDB，默认端口 27017。

### 2. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 初始化数据库

```bash
cd backend
node seed.js
```

这将创建示例卡牌数据和以下账号：
- 管理员: `admin` / `admin123`
- 测试用户: `test` / `123456`

### 4. 启动服务

```bash
# 启动后端 (端口 5000)
cd backend
npm run dev

# 新开终端，启动前端 (端口 3000)
cd frontend
npm run dev
```

访问 http://localhost:3000 即可使用。

## 目录结构

```
my-yugioh/
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── views/          # 页面组件
│   │   ├── components/     # 通用组件
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── router/         # 路由配置
│   │   ├── api/            # API 请求
│   │   └── assets/         # 静态资源
│   └── public/
│       └── img/            # 卡牌图片
├── backend/                 # 后端项目
│   ├── routes/             # API 路由
│   ├── models/             # 数据模型
│   ├── middleware/         # 中间件
│   ├── data/               # 初始数据
│   └── uploads/            # 上传文件
└── README.md
```

## 卡牌图片

将卡牌图片放入 `frontend/public/img/` 目录，文件名与卡牌数据中的 `image` 字段对应。

## 稀有度概率

| 稀有度 | 概率 |
|--------|------|
| N (普通) | 60% |
| R (稀有) | 25% |
| SR (超稀有) | 12% |
| UR (极稀有) | 3% |

## 卡组规则 (OCG)

- 主卡组: 40-60 张
- 额外卡组: 0-15 张
- 副卡组: 0-15 张
- 同名卡: 最多 3 张
