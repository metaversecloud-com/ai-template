ROLE
You are building on THIS repository. Extend functionality without breaking the template or protected files.

PROJECT

- Client: React + TypeScript
- Server: Node + Express
- SDK: JavaScript RTSDK – Topia Client Library (@rtsdk/topia) https://metaversecloud-com.github.io/mc-sdk-js/index.html
- Repo baseline: https://github.com/metaversecloud-com/ai-template
- Goal: App runs inside a Topia iframe.

HARD CONSTRAINTS (DO NOT VIOLATE)

- Do NOT modify:
  - client/App.tsx
  - client/backendAPI.ts
  - client/setErrorMessage.ts
  - server/getCredentials.ts
  - server/errorHandler.ts
- client/topiaInit.ts MUST exist (you may change its exports).
- Preserve file structure and scripts.
- Never invent SDK methods; only use documented APIs.

SDK USAGE POLICY

- Initialize Topia ONCE on the server with env vars:
  - INTERACTIVE_KEY, INTERACTIVE_SECRET, INSTANCE_DOMAIN=api.topia.io, INSTANCE_PROTOCOL=https
- Follow existing server patterns that use exports from server/utils/topiaInit.ts (do not bypass).
- Example visible action: world.fireToast({ title, text })
- Wrap SDK calls in try/catch and either:
  - return JSON per RESPONSE SCHEMA (below), or
  - throw and let server/errorHandler.ts handle formatting.

ARCHITECTURE & BOUNDARIES

- Flow: UI → client/backendAPI.ts (unchangeable) → server routes/controllers → server/utils (SDK wrapper) → Topia SDK.
- No direct SDK calls from React.
- Need new client behavior? Add/extend a server route; do NOT bypass backendAPI.ts.
- Match established patterns in existing client and server/controllers code.
- In utils, catch blocks construct & throw a new Error (see server/utils/droppedAssets/getDroppedAsset.ts). Controllers handle it like server/controllers/handleGetGameState.ts.

RESPONSE SCHEMA (Controllers)

- Success: { success: true, data?: any }
- Failure (via errorHandler.ts): { success: false, error: string }
- HTTP codes:
  - 200 for success with data
  - 204 when no body (rare)
  - 4xx for client errors (validation)
  - 5xx for SDK or server errors

ENV & VERSIONS

- Provide .env.example with keys: INTERACTIVE_KEY, INTERACTIVE_SECRET, INSTANCE_DOMAIN=api.topia.io, INSTANCE_PROTOCOL=https
- Pin @rtsdk/topia to a known good version in package.json.

TESTING (JEST)

- For each new/changed route, add tests under server/tests/.
- Map @rtsdk/topia to server/mocks/@rtsdk/topia.ts.
- Assert:
  - HTTP status
  - JSON matches RESPONSE SCHEMA
  - Correct SDK method & args invoked
  - Credentials flow into World.create / DroppedAsset.create (as applicable)
- Note: Source may import with .js suffix for runtime ESM; tests strip .js only on relative paths. Keep this convention.

STYLING

- Prefer classes from https://sdk-style.s3.amazonaws.com/styles-3.0.2.css
- If reliability is critical, vendor a pinned copy or document a fallback.

DELIVERABLES

1. Keep existing file tree; add routes in server/routes and client components/pages as needed.
2. Minimal end-to-end flow:
   - Client calls backend endpoints WITHOUT changing client/backendAPI.ts.
   - Server uses Topia SDK via the utils wrapper.
3. README updates: local run, environment, and a smoke test checklist.
4. Type annotations everywhere; never leak secrets to client.
5. New/updated Jest tests for the feature.

SMOKE TEST (Topia)

1. Open your Topia world (or create one).
2. Go to https://topia.io/t/dashboard/integrations → **Add Key Pair** to create your public/private interactive keys (and API key if needed). Populate .env.
3. In Builder Mode: open the **Assets** toolbar and drop a new asset in your world.
4. Click the dropped asset → **Edit Asset** drawer → **Configurations > Integrations** → add your Developer Public Key and ensure **“Add player session credentials to asset interactions”** is ON.
5. **Configurations > Links** → “Add a website” → Title any → **Link Behavior: Open in drawer iframe**.
6. Set Link to `http://localhost:3001/` (or your client dev URL).
7. Leave Builder Mode, click the asset to open the app in an iframe with credentials in the query.

RULES

- If an SDK call is unclear or missing, STOP and propose a minimal stub + question.
- Add an inline comment above each SDK call citing the exact SDK method name.
- Keep the server SDK wrapper thin to simplify mocking and upgrades.
- Follow existing naming, error handling, and response patterns in server/controllers.
- Follow existing client patterns for calling the server via backendAPI.ts.
- Prefer surgical changes; do not refactor protected files.

TASK STARTER (Always Plan First)
Before writing code, output a short plan:

- File tree delta
- Endpoint signatures (method, path, inputs/outputs)
- Data shapes (TS interfaces)
- Tests to add/modify
