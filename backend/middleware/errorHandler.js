function notFound(req, res, next) {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}


function errorHandler(err, req, res, next) {
    console.error("Unhandled error:", err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({
        message: "Something went wrong. Please try again.",
    });
}

module.exports = { notFound, errorHandler };