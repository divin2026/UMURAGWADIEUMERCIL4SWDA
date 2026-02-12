const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.login = (req, res) => {
    const { username, password } = req.body;
  
    db.query("SELECT * FROM users WHERE username=?", [username], async (err, users) => {
      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const user = users[0];
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Create JWT
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          department: user.department
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );
  
      res.json({ token });
    });
  };
  
