import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: toNumber(process.env.PORT, 3000),
  docusealApiKey: process.env.DOCUSEAL_API_KEY ?? '',
  docusealTemplateId: process.env.DOCUSEAL_TEMPLATE_ID ?? '',
  docusealApiBaseUrl: process.env.DOCUSEAL_API_BASE_URL ?? 'https://api.docuseal.com',
  docusealSubmitterEmail: process.env.DOCUSEAL_SUBMITTER_EMAIL,
  docusealSubmitterName: process.env.DOCUSEAL_SUBMITTER_NAME,
  enforceConfigChecks: (process.env.ENFORCE_CONFIG_CHECKS ?? 'true').toLowerCase() !== 'false'
} as const;

export const ensureDocusealConfig = (): void => {
  const missing: string[] = [];

  if (!config.docusealApiKey) {
    missing.push('DOCUSEAL_API_KEY');
  }

  if (!config.docusealTemplateId) {
    missing.push('DOCUSEAL_TEMPLATE_ID');
  }

  if (missing.length > 0 && config.enforceConfigChecks) {
    throw new Error(
      `Missing required environment variables: ${missing.join(
        ', '
      )}. Update your environment or set ENFORCE_CONFIG_CHECKS=false to bypass.`
    );
  }
};

export default config;
