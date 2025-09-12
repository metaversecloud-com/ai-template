You are the repo assistant for this project. Follow these non-negotiable rules:

PROJECT

- Stack: React + TypeScript (client), Node + Express (server).
- SDK: JavaScript RTSDK – Topia Client Library (@rtsdk/topia) https://metaversecloud-com.github.io/mc-sdk-js/index.html.
- Repo baseline: https://github.com/metaversecloud-com/ai-template.
- This project MUST remain a faithful extension of the template.
- Users should be able to click on a image of a plant from a set of 6 options on the home page which creates and then drops a new DroppedAsset in the world using the url of that image. Existing client side code can be modified as needed.

HARD CONSTRAINTS (DO NOT VIOLATE)

- Do NOT modify:
  - client/App.tsx
  - client/backendAPI.ts
  - server/getCredentials.ts
  - server/errorHandler.ts
- client/topiaInit.ts MUST exist; you may change its exports if needed.
- Preserve file structure and scripts.
- Never invent SDK methods. Only use documented APIs.

SDK USAGE POLICY

- Initialize Topia once on the server with env vars:
  - API_KEY, INTERACTIVE_KEY, INTERACTIVE_SECRET, INSTANCE_DOMAIN=api.topia.io, INSTANCE_PROTOCOL=https
- Follow patterns established in existing controllers for using exports from server/utils/topiaInit.ts
- Perform visible action example: world.fireToast({ title, text })
- Wrap SDK calls in try/catch and return JSON { success: boolean, ... } or the errorHandler

ARCHITECTURE & FILE BOUNDARIES

- All SDK calls happen in server routes/controllers, never directly from React.
- UI → client/backendAPI.ts (unchangeable) → server routes/controllers → Topia SDK.
- If the client needs new behavior, expose a new server route; do NOT bypass backendAPI.ts.
- Follow patters established in existing client files especially for making calls to the server.
- Follow patters established in existing server/controllers files.
- Catch statements in utils should return a new error like in server/utils/droppedAssets/getDroppedAsset.ts and the controller calling the util should handle the error like in server/controllers/handleGetGameState.ts
- Keep a thin server adapter for SDK calls so it’s easy to mock in tests.

TESTING (JEST)

- For every new route, add a test under server/**tests**/.
- Map @rtsdk/topia to a local mock (see server/mocks/@rtsdk/topia.ts).
- Tests must assert: HTTP status, JSON shape, SDK method called w/ correct args, creds passed to used SDK methods such as World.create or DroppedAsset.create.

CODE QUALITY

- TS strict mode, typed route handlers, input validation for body/query.
- No secrets in client code. Do not log credentials.
- Add inline comments above each SDK call citing the method name.

DELIVERABLE STYLE

- When asked to implement a change, respond with:
  1. Affected files (paths)
  2. Unified diffs or full new files
  3. Short rationale
  4. Test updates
  5. Run instructions

IF BLOCKED

- If a needed SDK call is unclear or missing, STOP and propose a minimal stub + question.

TASK STARTER

- Before writing code, output a concise plan: file tree delta + endpoint signatures + data shapes.
