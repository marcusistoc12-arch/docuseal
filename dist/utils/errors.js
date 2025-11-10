"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocusealApiError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, status = 500, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
exports.HttpError = HttpError;
class DocusealApiError extends Error {
    constructor(message, status, errorCode, details) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.details = details;
    }
}
exports.DocusealApiError = DocusealApiError;
//# sourceMappingURL=errors.js.map