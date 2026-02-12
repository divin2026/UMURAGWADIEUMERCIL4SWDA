module.exports = (allowedDepartments) => {
    return (req, res, next) => {
      if (!allowedDepartments.includes(req.user.department)) {
        return res.status(403).json({ message: "Access denied (department)" });
      }
      next();
    };
  };
  