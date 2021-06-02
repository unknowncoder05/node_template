export function withErrorStack(error: any) {
    if (process.env.NODE_ENV=="production"||"production") {
        return { error: error.message, stack: error.stack };
    }

    return {
        error: error.message
    };
}

export function errorHandler(err: any, req: any, res: any, next: any) { // eslint-disable-line
    if (err) {
        res.status(500).json(withErrorStack(err));
    } else {
        next(err);
    }

}