import { Router } from 'express';
import { z } from 'zod';
import { createDocusealSubmission } from '../services/docusealService';
import { HttpError } from '../utils/errors';

const signerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.string().min(1).optional(),
  passcode: z.string().min(1).optional(),
  phoneNumber: z.string().min(3).optional(),
  language: z.string().min(2).optional(),
  fields: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
  sendEmail: z.boolean().optional()
});

const carbonCopySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional()
});

const createSubmissionSchema = z
  .object({
    templateId: z.string().min(1).optional(),
    subject: z.string().min(1).optional(),
    message: z.string().min(1).optional(),
    sendEmail: z.boolean().optional(),
    redirectUrl: z.string().url().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    tags: z.array(z.string().min(1)).optional(),
    expiresAt: z.string().min(1).optional(),
    signers: z.array(signerSchema).min(1),
    cc: z.array(carbonCopySchema).optional(),
    additionalPayload: z.record(z.string(), z.unknown()).optional()
  })
  .strict();

const router = Router();

router.post('/', async (request, response, next) => {
  try {
    const parsed = createSubmissionSchema.parse(request.body);
    const submission = await createDocusealSubmission(parsed);

    response.status(201).json({
      message: 'Submission created successfully.',
      submission
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new HttpError('Invalid submission payload.', 400, error.flatten()));
    }

    return next(error);
  }
});

export const submissionsRouter = router;
