// Simple error handler
const errorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).json({error: err.message});
    } else {
        res.status(500).json({error: err.message});
    };

    next();
};

export default errorHandler;
