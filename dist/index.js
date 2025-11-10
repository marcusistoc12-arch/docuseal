"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const submissions_1 = require("./routes/submissions");
const errors_1 = require("./utils/errors");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
});
app.use('/api/submissions', submissions_1.submissionsRouter);
app.use((_request, response) => {
    response.status(404).json({
        message: 'Not found'
    });
});
app.use((error, _request, response, _next) => {
    if (error instanceof errors_1.HttpError) {
        return response.status(error.status).json({
            message: error.message,
            details: error.details
        });
    }
    if (error instanceof errors_1.DocusealApiError) {
        return response.status(error.status && error.status >= 100 ? error.status : 502).json({
            message: error.message,
            errorCode: error.errorCode,
            details: error.details
        });
    }
    if (error instanceof Error) {
        return response.status(500).json({
            message: error.message
        });
    }
    return response.status(500).json({
        message: 'Unexpected error'
    });
});
app.listen(config_1.default.port, () => {
    console.log(`DocuSeal submission service listening on port ${config_1.default.port}`);
});
//# sourceMappingURL=index.js.map