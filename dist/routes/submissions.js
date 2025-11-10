"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionsRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const docusealService_1 = require("../services/docusealService");
const errors_1 = require("../utils/errors");
const signerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    role: zod_1.z.string().min(1).optional(),
    passcode: zod_1.z.string().min(1).optional(),
    phoneNumber: zod_1.z.string().min(3).optional(),
    language: zod_1.z.string().min(2).optional(),
    fields: zod_1.z
        .record(zod_1.z.string(), zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean(), zod_1.z.null()]))
        .optional(),
    sendEmail: zod_1.z.boolean().optional()
});
const carbonCopySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1).optional()
});
const createSubmissionSchema = zod_1.z
    .object({
    templateId: zod_1.z.string().min(1).optional(),
    subject: zod_1.z.string().min(1).optional(),
    message: zod_1.z.string().min(1).optional(),
    sendEmail: zod_1.z.boolean().optional(),
    redirectUrl: zod_1.z.string().url().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    tags: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    expiresAt: zod_1.z.string().min(1).optional(),
    signers: zod_1.z.array(signerSchema).min(1),
    cc: zod_1.z.array(carbonCopySchema).optional(),
    additionalPayload: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional()
})
    .strict();
const router = (0, express_1.Router)();
router.post('/', async (request, response, next) => {
    try {
        const parsed = createSubmissionSchema.parse(request.body);
        const submission = await (0, docusealService_1.createDocusealSubmission)(parsed);
        response.status(201).json({
            message: 'Submission created successfully.',
            submission
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return next(new errors_1.HttpError('Invalid submission payload.', 400, error.flatten()));
        }
        return next(error);
    }
});
exports.submissionsRouter = router;
//# sourceMappingURL=submissions.js.map