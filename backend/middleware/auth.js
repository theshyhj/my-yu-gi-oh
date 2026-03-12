import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'yugioh-secret-key-2024'

export function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: '无效的认证令牌' })
  }
}

export function adminAuth(req, res, next) {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '需要管理员权限' })
    }
    next()
  })
}
