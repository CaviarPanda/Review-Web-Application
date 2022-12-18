
exports.sendError = (res, message, statusCode=401) => {
    res.status(statusCode).json({ message });
}