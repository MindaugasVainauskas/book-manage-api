import winstonLogger from './winston-logger.js'

const loggerMiddleware = (req, res, next) => {
    winstonLogger.debug(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};

export default loggerMiddleware;
