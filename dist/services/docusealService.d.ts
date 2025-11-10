export interface SignerInput {
    email: string;
    name: string;
    role?: string | undefined;
    passcode?: string | undefined;
    phoneNumber?: string | undefined;
    language?: string | undefined;
    fields?: Record<string, unknown> | undefined;
    sendEmail?: boolean | undefined;
}
export interface CarbonCopyInput {
    email: string;
    name?: string | undefined;
}
export interface CreateSubmissionInput {
    templateId?: string | undefined;
    subject?: string | undefined;
    message?: string | undefined;
    sendEmail?: boolean | undefined;
    redirectUrl?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    tags?: string[] | undefined;
    expiresAt?: string | undefined;
    signers: SignerInput[];
    cc?: CarbonCopyInput[] | undefined;
    additionalPayload?: Record<string, unknown> | undefined;
}
export type CreateSubmissionResult = Record<string, unknown>;
export declare const createDocusealSubmission: (input: CreateSubmissionInput) => Promise<CreateSubmissionResult>;
//# sourceMappingURL=docusealService.d.ts.map