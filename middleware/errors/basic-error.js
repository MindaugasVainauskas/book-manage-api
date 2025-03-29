import { logger } from "../logger/index.js";
// Simple error handler
const errorHandler = (err, req, res, next) => {
    if (err.status) {
        logger.error(`${req.method} ${req.url}; Code: ${err.status}; Message: ${err.message}`);
        res.status(err.status).json({error: err.message});
    } else {
        logger.error(`${req.method} ${req.url}; Code: 500; Message: ${err.message}; Error stack: ${err.stack}`);
        res.status(500).json({error: err.message});
    };

    next();
};

export default errorHandler;
