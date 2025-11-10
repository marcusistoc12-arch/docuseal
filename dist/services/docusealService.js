"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocusealSubmission = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importStar(require("../config"));
const errors_1 = require("../utils/errors");
const normalizedBaseUrl = () => {
    const base = config_1.default.docusealApiBaseUrl || 'https://api.docuseal.com';
    return base.endsWith('/') ? base.slice(0, -1) : base;
};
const mapSigner = (signer) => {
    const payload = {
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
const buildPayload = (input) => {
    const payload = {
        template_id: input.templateId ?? config_1.default.docusealTemplateId,
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
    if (config_1.default.docusealSubmitterEmail || config_1.default.docusealSubmitterName) {
        payload.submitter = {
            ...(config_1.default.docusealSubmitterEmail ? { email: config_1.default.docusealSubmitterEmail } : {}),
            ...(config_1.default.docusealSubmitterName ? { name: config_1.default.docusealSubmitterName } : {})
        };
        if (config_1.default.docusealSubmitterEmail) {
            payload.submitter_email = config_1.default.docusealSubmitterEmail;
        }
        if (config_1.default.docusealSubmitterName) {
            payload.submitter_name = config_1.default.docusealSubmitterName;
        }
    }
    if (input.additionalPayload) {
        Object.assign(payload, input.additionalPayload);
    }
    return payload;
};
const createDocusealSubmission = async (input) => {
    (0, config_1.ensureDocusealConfig)();
    if (!input.signers.length) {
        throw new errors_1.DocusealApiError('At least one signer is required to create a submission.', 400);
    }
    const payload = buildPayload(input);
    try {
        const url = `${normalizedBaseUrl()}/submissions`;
        const response = await axios_1.default.post(url, payload, {
            headers: {
                Authorization: `Bearer ${config_1.default.docusealApiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            const status = axiosError.response?.status;
            const data = axiosError.response?.data;
            const message = data?.message ??
                data?.error ??
                axiosError.message ??
                'Unexpected error while communicating with DocuSeal.';
            throw new errors_1.DocusealApiError(message, status, data?.error_code, data);
        }
        if (error instanceof Error) {
            throw new errors_1.DocusealApiError(error.message);
        }
        throw new errors_1.DocusealApiError('Unknown error while communicating with DocuSeal.');
    }
};
exports.createDocusealSubmission = createDocusealSubmission;
//# sourceMappingURL=docusealService.js.map