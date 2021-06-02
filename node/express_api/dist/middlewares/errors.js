"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.withErrorStack = void 0;
function withErrorStack(error) {
    if (process.env.NODE_ENV == "production" || "production") {
        return { error: error.message, stack: error.stack };
    }
    return {
        error: error.message
    };
}
exports.withErrorStack = withErrorStack;
function errorHandler(err, req, res, next) {
    if (err) {
        res.status(500).json(withErrorStack(err));
    }
    else {
        next(err);
    }
}
exports.errorHandler = errorHandler;
