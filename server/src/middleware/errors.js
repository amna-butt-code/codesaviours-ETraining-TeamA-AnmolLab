export function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }); }
export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || (err.name === "ValidationError" ? 400 : 500);
  res.status(status).json({ message: status === 500 ? "Server error" : err.message });
}
