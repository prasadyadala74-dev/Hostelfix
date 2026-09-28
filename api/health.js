export default function handler(req, res) {
  const hasMongo = !!process.env.MONGODB_URI;
  const hasJwt = !!process.env.JWT_SECRET;
  
  res.status(200).json({
    ok: true,
    service: "HostelFix API",
    status: "running",
    timestamp: new Date().toISOString(),
    environment: {
      MONGODB_URI_CONFIGURED: hasMongo,
      JWT_SECRET_CONFIGURED: hasJwt,
      NODE_ENV: process.env.NODE_ENV || "development"
    }
  });
}
