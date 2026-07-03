const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 20; 

const hits = new Map(); 
setInterval(() => {
    const cutoff = Date.now() - WINDOW_MS;
    for (const [ip, timestamps] of hits) {
        const kept = timestamps.filter((t) => t > cutoff);
        if (kept.length) hits.set(ip, kept);
        else hits.delete(ip);
    }
}, WINDOW_MS).unref();

function chatRateLimiter(req, res, next) {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    const cutoff = now - WINDOW_MS;

    const timestamps = (hits.get(ip) || []).filter((t) => t > cutoff);

    if (timestamps.length >= MAX_REQUESTS) {
        const retryAfterSec = Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000);
        res.setHeader("Retry-After", String(retryAfterSec));
        return res.status(429).json({
            message: "Too many messages. Please wait a moment before trying again.",
        });
    }

    timestamps.push(now);
    hits.set(ip, timestamps);
    next();
}

module.exports = chatRateLimiter;