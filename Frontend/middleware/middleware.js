// middleware.js

// 1. Logger Middleware
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // agla middleware ya route call hoga
  next(); 
};

// 2. Auth Middleware
const checkAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token === "mysecrettoken") {
    next();
  } else {
    res.status(403).send("Unauthorized!");
  }
};

// Export sab middleware
module.exports = {
  logger,
  checkAuth,
};
