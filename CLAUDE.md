# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

游戏王卡牌收藏网站 - 全栈应用，支持抽卡、卡牌管理、卡组构建和后台管理。

## 技术栈

**前端**: Vue.js 3 + Vite + Vue Router 4 + Pinia + Axios + yugioh-card
**后端**: Node.js + Express + MongoDB + JWT + bcryptjs

## 项目结构

```
my-yugioh/
├── frontend/           # Vue 3 应用 (端口 3000)
│   ├── src/
│   │   ├── views/     # 路由页面
│   │   ├── components/# 可复用组件
│   │   ├── stores/    # Pinia 状态管理
│   │   ├── router/    # 路由配置 + 守卫
│   │   └── api/       # Axios 实例
│   └── public/img/    # 卡牌图片
│
├── backend/           # Express 服务 (端口 5000)
│   ├── routes/        # API 路由
│   ├── models/        # MongoDB 模型
│   ├── middleware/    # JWT 验证
│   └── server.js      # 应用入口
│
└── cards.json         # 卡牌数据库
```

## 开发命令

### 后端
```bash
cd backend
npm run dev      # 监视模式
npm start        # 正常启动
node seed.js     # 初始化数据
```

### 前端
```bash
cd frontend
npm run dev      # 开发服务器
npm run build    # 生产构建
```

## 认证流程

1. 用户登录 → 后端生成 JWT Token (7 天有效期)
2. 前端存储到 localStorage
3. Axios 拦截器自动注入 `Authorization: Bearer <token>`
4. 401 错误时清除 Token 并重定向到 `/login`

## 主要 API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| GET | `/api/cards` | 获取所有卡牌 |
| POST | `/api/gacha` | 抽卡 |
| GET | `/api/decks` | 获取用户卡组 |
| POST | `/api/decks` | 创建卡组 |
| GET | `/api/user/collection` | 获取收藏 |
| POST | `/api/admin/cards` | 添加卡牌 (管理员) |

## 数据模型

### User
```javascript
{
  username: String (unique),
  password: String (bcrypt hashed),
  role: 'user' | 'admin',
  ownedCards: [{ cardId: String, count: Number }]
}
```

### Card
```javascript
{
  id: String,
  name: String,
  rarity: 'N' | 'R' | 'SR' | 'UR',
  image: String,
  description: String
}
```

### Deck
```javascript
{
  userId: String,
  name: String,
  mainDeck: [{ cardId: String, count: Number }],
  extraDeck: [{ cardId: String, count: Number }],
  sideDeck: [{ cardId: String, count: Number }]
}
```

## 卡组规则 (OCG)

- 主卡组: 40-60 张
- 额外卡组: 0-15 张
- 副卡组: 0-15 张
- 同名卡: 最多 3 张

## 抽卡概率

| 稀有度 | 概率 |
|--------|------|
| N | 60% |
| R | 25% |
| SR | 12% |
| UR | 3% |

## 默认账号

- 管理员: `admin` / `admin123`
- 测试用户: `test` / `123456`

## 环境变量

### 后端
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yugioh
JWT_SECRET=yugioh-secret-key-2024
```

## 常见任务

### 添加新的 API 端点
1. 在 `backend/routes/` 中创建或编辑路由文件
2. 在 `backend/server.js` 中注册路由
3. 在 `frontend/src/api/` 中添加 API 调用函数

### 添加新的 Vue 页面
1. 在 `frontend/src/views/` 中创建 `*.vue` 文件
2. 在 `frontend/src/router/index.js` 中添加路由
3. 如需认证，添加 `meta: { requiresAuth: true }`

### 上传卡牌图片
将图片放入 `frontend/public/img/`，文件名与卡牌数据中的 `image` 字段对应

## 故障排除

### 后端无法连接 MongoDB
确保 MongoDB 服务运行在 localhost:27017

### 前端 API 请求 401
检查 localStorage 中的 token 是否存在且未过期

### 卡牌图片不显示
确保图片文件在 `frontend/public/img/` 且文件名匹配
