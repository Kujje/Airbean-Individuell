export default function errorHandler(error, req, res, next) {
  const status = error.status || 500;  // fallback till 500 om status saknas
  res.status(status).json({
    success: false,  
    message: error.message || "Internal Server Error",
  });
}
