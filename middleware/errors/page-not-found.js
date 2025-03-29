const pageNotFoundErrorhandler = (req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;

    return next(error);
};

export default pageNotFoundErrorhandler;
