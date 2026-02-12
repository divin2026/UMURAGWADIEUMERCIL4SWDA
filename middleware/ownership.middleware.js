module.exports = (req, res, next) => {
    const requestedId = parseInt(req.params.id);
    const tokenUserId = req.user.id;
  
    if (req.user.role === 'admin') return next(); // admin bypass
  
    if (requestedId !== tokenUserId) {
      return res.status(403).json({ message: "Not owner of resource" });
    }
  
    next();
  };
  