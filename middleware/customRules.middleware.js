module.exports = {
    workingHoursOnly: (req,res,next)=>{
      const hour = new Date().getHours();
      if(hour < 9 || hour > 17){
        return res.status(403).json({message:"Access only during working hours"});
      }
      next();
    },
  
    blockInactive: (req,res,next)=>{
      if(req.user.active === false){
        return res.status(403).json({message:"User inactive"});
      }
      next();
    },
  
    ipRestriction: (allowedIps)=> (req,res,next)=>{
      if(!allowedIps.includes(req.ip)){
        return res.status(403).json({message:"IP not allowed"});
      }
      next();
    }
  };
  