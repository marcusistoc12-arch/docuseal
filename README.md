## DocuSeal Submission Service

Small Express + TypeScript service that creates DocuSeal submissions and emails recipients to collect signatures for your existing DocuSeal templates.

### Features

- Validates request payloads (via `zod`) before sending them to DocuSeal.
- Supports multiple signers, carbon copies, custom metadata, tags, and redirect URLs.
- Allows per-signer pre-filled field values so that only the intended recipient can edit their inputs.
- Provides a simple REST endpoint that you can integrate into your own app or trigger from automation tools.

### Prerequisites

- Node.js 18+
- A DocuSeal account with an API key and an existing document template ID

### Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

   Required values:

   - `DOCUSEAL_API_KEY`: API key from your DocuSeal dashboard.
   - `DOCUSEAL_TEMPLATE_ID`: Template ID for the document that should be sent for signature.
   - `DOCUSEAL_SUBMITTER_EMAIL` / `DOCUSEAL_SUBMITTER_NAME`: (Optional) defaults for who is requesting the signature.

3. Start the development server:

   ```bash
   npm run dev
   ```

   The service listens on `http://localhost:3000` by default. You can change the port via the `PORT` environment variable.

4. Deploy/build:

   ```bash
   npm run build     # transpile to dist/
   npm start         # run the compiled output
   ```

### API

#### `POST /api/submissions`

Creates a DocuSeal submission (which triggers DocuSeal to email signers).

Request body schema:

```jsonc
{
  "templateId": "optional-template-id-override",
  "subject": "New contract for ACME Corp",
  "message": "Please complete the highlighted fields and sign.",
  "sendEmail": true,
  "redirectUrl": "https://your-app.com/thank-you",
  "metadata": {
    "opportunityId": "opp_123"
  },
  "tags": ["sales", "q4"],
  "expiresAt": "2025-12-31T23:59:59Z",
  "signers": [
    {
      "email": "jane.partner@example.com",
      "name": "Jane Partner",
      "role": "Partner",
      "fields": {
        "partner_name": "Jane Partner",
        "partner_title": "VP Operations"
      }
    }
  ],
  "cc": [
    {
      "email": "legal@example.com",
      "name": "Legal Team"
    }
  ],
  "additionalPayload": {
    // Optional: any extra DocuSeal payload fields you want to pass through directly.
  }
}
```

Example `curl`:

```bash
curl --request POST http://localhost:3000/api/submissions \
  --header "Content-Type: application/json" \
  --data '{
    "subject": "Signature required: NDA",
    "message": "Please sign this NDA before Friday.",
    "signers": [
      {
        "email": "recipient@example.com",
        "name": "Alex Recipient",
        "fields": {
          "recipient_name": "Alex Recipient",
          "recipient_company": "Example Co."
        }
      }
    ]
  }'
```

The response includes the raw DocuSeal API response so you can extract signer URLs, submission IDs, etc.

### Customising Field Assignments

Assign any template field to a signer by sending `fields` within each signer object. DocuSeal only allows the assigned signer to edit those fields; any values you send are pre-filled for them.

If you need to send other DocuSeal-specific settings (like reminders, locale, or webhook settings), add them to the `additionalPayload` object. They are merged into the request body that is sent to DocuSeal.

### Error Handling

- Validation errors return HTTP `400` with details about what needs fixing.
- DocuSeal API failures are proxied with the DocuSeal status code when available.
- Any unexpected server errors return HTTP `500`.

### Next Steps

- Add authentication (API keys, OAuth, etc.) in front of the `/api/submissions` endpoint before exposing it publicly.
- Persist submission metadata in your own database so you can track status updates via DocuSeal webhooks.
- Extend the service with webhook handlers to receive real-time status updates from DocuSeal.
