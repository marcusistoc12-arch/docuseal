"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDocusealConfig = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const toNumber = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};
exports.config = {
    port: toNumber(process.env.PORT, 3000),
    docusealApiKey: process.env.DOCUSEAL_API_KEY ?? '',
    docusealTemplateId: process.env.DOCUSEAL_TEMPLATE_ID ?? '',
    docusealApiBaseUrl: process.env.DOCUSEAL_API_BASE_URL ?? 'https://api.docuseal.com',
    docusealSubmitterEmail: process.env.DOCUSEAL_SUBMITTER_EMAIL,
    docusealSubmitterName: process.env.DOCUSEAL_SUBMITTER_NAME,
    enforceConfigChecks: (process.env.ENFORCE_CONFIG_CHECKS ?? 'true').toLowerCase() !== 'false'
};
const ensureDocusealConfig = () => {
    const missing = [];
    if (!exports.config.docusealApiKey) {
        missing.push('DOCUSEAL_API_KEY');
    }
    if (!exports.config.docusealTemplateId) {
        missing.push('DOCUSEAL_TEMPLATE_ID');
    }
    if (missing.length > 0 && exports.config.enforceConfigChecks) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}. Update your environment or set ENFORCE_CONFIG_CHECKS=false to bypass.`);
    }
};
exports.ensureDocusealConfig = ensureDocusealConfig;
exports.default = exports.config;
//# sourceMappingURL=config.js.map