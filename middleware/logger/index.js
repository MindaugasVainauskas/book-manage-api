// Very simple logger to track requests.
const logger = (req, res, next) => {
    console.log(`LOGGING: ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};

export default logger;
