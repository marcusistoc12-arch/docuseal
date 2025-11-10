import axios, { AxiosError } from 'axios';
import config, { ensureDocusealConfig } from '../config';
import { DocusealApiError } from '../utils/errors';

const normalizedBaseUrl = (): string => {
  const base = config.docusealApiBaseUrl || 'https://api.docuseal.com';
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

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

const mapSigner = (signer: SignerInput): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    email: signer.email,
    name: signer.name
  };

  if (signer.role) {
    payload.role = signer.role;
  }

  if (signer.passcode) {
    payload.passcode = signer.passcode;
  }

  if (signer.phoneNumber) {
    payload.phone = signer.phoneNumber;
  }

  if (signer.language) {
    payload.language = signer.language;
  }

  if (typeof signer.sendEmail === 'boolean') {
    payload.send_email = signer.sendEmail;
  }

  if (signer.fields && Object.keys(signer.fields).length > 0) {
    payload.fields = signer.fields;
    payload.prefill_fields = signer.fields;
  }

  return payload;
};

const buildPayload = (input: CreateSubmissionInput): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    template_id: input.templateId ?? config.docusealTemplateId,
    signers: input.signers.map(mapSigner),
    send_email: input.sendEmail ?? true
  };

  if (input.subject) {
    payload.subject = input.subject;
    payload.email_subject = input.subject;
  }

  if (input.message) {
    payload.message = input.message;
    payload.email_message = input.message;
  }

  if (input.redirectUrl) {
    payload.redirect_url = input.redirectUrl;
  }

  if (input.metadata) {
    payload.metadata = input.metadata;
  }

  if (input.tags) {
    payload.tags = input.tags;
  }

  if (input.cc && input.cc.length > 0) {
    payload.cc = input.cc.map((copy) => ({
      email: copy.email,
      ...(copy.name ? { name: copy.name } : {})
    }));
  }

  if (input.expiresAt) {
    payload.expires_at = input.expiresAt;
  }

  if (config.docusealSubmitterEmail || config.docusealSubmitterName) {
    payload.submitter = {
      ...(config.docusealSubmitterEmail ? { email: config.docusealSubmitterEmail } : {}),
      ...(config.docusealSubmitterName ? { name: config.docusealSubmitterName } : {})
    };

    if (config.docusealSubmitterEmail) {
      payload.submitter_email = config.docusealSubmitterEmail;
    }

    if (config.docusealSubmitterName) {
      payload.submitter_name = config.docusealSubmitterName;
    }
  }

  if (input.additionalPayload) {
    Object.assign(payload, input.additionalPayload);
  }

  return payload;
};

export const createDocusealSubmission = async (
  input: CreateSubmissionInput
): Promise<CreateSubmissionResult> => {
  ensureDocusealConfig();

  if (!input.signers.length) {
    throw new DocusealApiError('At least one signer is required to create a submission.', 400);
  }

  const payload = buildPayload(input);

  try {
    const url = `${normalizedBaseUrl()}/submissions`;
    const response = await axios.post<CreateSubmissionResult>(url, payload, {
      headers: {
        Authorization: `Bearer ${config.docusealApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string; message?: string; error_code?: string }>;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;
      const message =
        data?.message ??
        data?.error ??
        axiosError.message ??
        'Unexpected error while communicating with DocuSeal.';

      throw new DocusealApiError(message, status, data?.error_code, data);
    }

    if (error instanceof Error) {
      throw new DocusealApiError(error.message);
    }

    throw new DocusealApiError('Unknown error while communicating with DocuSeal.');
  }
};
