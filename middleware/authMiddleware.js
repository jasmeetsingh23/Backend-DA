import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const checkRole = (roles) => (req, res, next) => {
  const query = 'SELECT * FROM users WHERE employeeID = ?';
  db.query(query, [req.user.employeeID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result[0];
    if (roles.includes(user.designation)) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  });
};
