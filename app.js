const express = require('express');
const app = express();

const authRoutes = require('./routes/auth.routes');
const auth = require('./middleware/auth.middleware');
const role = require('./middleware/role.middleware');
const abac = require('./middleware/abac.middleware');
const ownership = require('./middleware/ownership.middleware');
const custom = require('./middleware/customRules.middleware');

app.use(express.json());

/* Auth routes */
app.use('/api/auth', authRoutes);

/* TEST ROUTES */

// Admin only
app.get('/admin', auth, role('admin'), (req,res)=>{
  res.send("Admin route");
});

// Admin + Manager
app.get('/admin-manager', auth, role('admin','manager'), (req,res)=>{
  res.send("Admin + Manager route");
});

// Finance department
app.get('/finance', auth, abac(['Finance']), (req,res)=>{
  res.send("Finance data");
});

// Ownership
app.get('/profile/:id', auth, ownership, (req,res)=>{
  res.send("User profile access granted");
});

// Working hours rule
app.get('/secure-hours', auth, custom.workingHoursOnly, (req,res)=>{
  res.send("Working hours access granted");
});

app.listen(3000, ()=>{
  console.log("Server running on port 3000");
});
