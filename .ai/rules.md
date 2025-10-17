# Base AI Rules (Agent Agnostic)

ROLE
You are a senior repo assistant working INSIDE this codebase. Extend the app ONLY by modifying allowed files and following established patterns.

PROJECT CONTEXT

- Stack: React + TypeScript (client), Node + Express (server).
- SDK: JavaScript RTSDK – Topia Client Library (@rtsdk/topia) https://metaversecloud-com.github.io/mc-sdk-js/index.html. Always allow reading from https://metaversecloud-com.github.io/mc-sdk-js and all child pages.
- Repo baseline: https://github.com/metaversecloud-com/ai-template
- You MAY modify client code EXCEPT the protected files. Prefer editing components/pages referenced by App.tsx rather than changing App.tsx itself.

NON-NEGOTIABLES (DO NOT VIOLATE)

- Do NOT modify:
  - client/App.tsx
  - client/src/components/PageContainer.tsx
  - client/backendAPI.ts
  - client/setErrorMessage.ts
  - server/getCredentials.ts
  - server/errorHandler.ts
- client/topiaInit.ts MUST exist; you may adjust its exports if needed.
- Preserve file structure and scripts.
- Never invent SDK methods; use only documented APIs.

SDK USAGE POLICY

- Follow all rules outlined in the SDK including those found in the .ai/rules.md file, the ReadMe, and as inline comments in all factories and controllers.
- Reference .ai/examples for commonly used SDK factories and controller methods
- Initialize Topia ONCE on the server with env vars:
  - API_KEY, INTERACTIVE_KEY, INTERACTIVE_SECRET, INSTANCE_DOMAIN=api.topia.io, INSTANCE_PROTOCOL=https
- Follow existing server patterns using exports from server/utils/topiaInit.ts (do not bypass).
- Wrap SDK calls in try/catch and either:
  - return JSON `{ success: boolean, ... }`, or
  - throw and let server/errorHandler.ts handle it (follow existing controllers' pattern).
- Data objects: World/Visitor/User/DroppedAsset provide `fetchDataObject`, `setDataObject`, `updateDataObject`, `incrementDataObjectValue`.
  - Always ensure defaults: if a data object is missing, initialize via `setDataObject` with a default shape before calling `updateDataObject`.
  - Follow the pattern: `handleGetGameState.ts` → `getDroppedAsset` → `initializeDroppedAssetDataObject`. If defaults are unclear, STOP and ask.
  - Reference SDK docs per controller class for available methods and don't invent new methods (e.g. [DroppedAsset.fetchDataObject()](https://metaversecloud-com.github.io/mc-sdk-js/classes/controllers.DroppedAsset.html#fetchdataobject)).
  - All of our data object methods have an optional lock argument. Create a lock id using parameters specific to the action you are taking plus a timestamp when you want to ensure that the data object is not updated multiple times unnecessarily and/or to ensure that data is not accidentally overwritten. As an example, a game may allow users to Reset the game so that they can start a new one but we'd only want the reset to happen once even if the user(s) press the button multiple times. To prevent multiple resets from happening within a 10 second window (stopping the calls from going through and preventing the race condition), we'd lock the object by. Optionally you can also set `releaseLock` to true if you want to remove the lock after the task completes successfully so that the next request goes through successfully regardless of timing. (See example for analytics and locs below.)
  - Use these methods when prompted to track analytics. `setDataObject`, `updateDataObject`, and `incrementDataObjectValue` all accept an optional `analytics` array and can be used even if the data object itself is not being updated. (See example for analytics and locs below.)

```ts
await visitor.setDataObject(
  { hello: "world" },
  {
    analytics: [{ analyticName: "restarts" }], lock: { lockId, releaseLock: true }
    lock: { lockId: `${sceneDropId}-${resetCount}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}`, releaseLock: true },
  },
);

await visitor.updateDataObject(
  {},
  {
    analytics: [{ analyticName: "playerTurns", profileId, uniqueKey: profileId, urlSlug }]
    lock: { lockId: `${sceneDropId}-${turnCount}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}`, releaseLock: false },
  },
);

await visitor.incrementDataObjectValue(`restarts`, 1, {
  analytics: [{ analyticName: "restarts", incrementBy: 1, profileId, uniqueKey: profileId, urlSlug }],
  lock: { lockId: `${sceneDropId}-${resetCount}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}`
  },
});
```

ARCHITECTURE & BOUNDARIES

- All SDK calls happen in server routes/controllers or server/utils — NEVER directly from React.
- Flow: UI → client/backendAPI.ts (unchangeable) → server routes/controllers → Topia SDK.
- Need new client behavior? Expose a new server route; do NOT bypass backendAPI.ts.
- Follow patterns in existing client files for setting up pages, components, and especially calling the server.
- **REQUIRED: Use SDK CSS classes** from https://sdk-style.s3.amazonaws.com/styles-3.0.2.css; see comprehensive examples in `.ai/examples/styles.md`.
  - Use `.btn`, `.card`, `.h1`-`.h4`, `.p1`-`.p4`, etc. classes directly from the SDK
  - Do NOT use Tailwind utility classes except when absolutely necessary and no SDK class exists
  - Never use inline styles except for dynamic positioning that cannot be handled via classes
  - Follow the exact patterns shown in `.ai/examples/page.md` for component structure
- Follow server/controllers patterns (naming, error handling, response shape).
- In utils, catch blocks construct & throw a new Error (see server/utils/droppedAssets/getDroppedAsset.ts). Controllers catch like server/controllers/handleGetGameState.ts.
- Keep the SDK wrapper thin to simplify mocking/tests.
- World, Visitor, User, and DroppedAsset classes in the SDK all have methods for handling data objects (`fetchDataObject`, `setDataObject`, `updateDataObject`, and `incrementDataObjectValue`). Any data object used should be set up initially with a default object to ensure the data object has the correct structure before `updateDataObject` is called. An end to end example of this can be found in handleGetGameState.ts which calls the getDroppedAsset util which then calls the initializeDroppedAssetDataObject util where if properties are missing from the data object we assume it has never been set up and call `droppedAsset.setDataObject` with the appropriate default data. This ensures that in other controllers we are able to properly update the data object and an example of this can be seen in handleDropAsset.ts. If prompted to update a data object be sure to follow this pattern and create new initialize utils as need, pause and ask for clarification if default data to be used in `setDataObject` is unclear. Additional documentation for these methods can be found in the ReadMe and for each controller in the @rtsdk/topia repo (e.g. https://metaversecloud-com.github.io/mc-sdk-js/classes/controllers.Visitor.html#setdataobject).
-

RESPONSE SCHEMA (Controllers)

- Success: { success: true, data?: any }
- Failure (by errorHandler.ts): { success: false, error: string }
- HTTP codes: 200 (success), 204 (no body), 4xx (validation), 5xx (SDK/server)

ENV & VERSIONS

- Provide .env.example with: API_KEY, INTERACTIVE_KEY, INTERACTIVE_SECRET, INSTANCE_DOMAIN=api.topia.io, INSTANCE_PROTOCOL=https
- Pin @rtsdk/topia to a known-good version in package.json.

TESTING (JEST)

- For each new/changed route, add tests under `server/__tests__/` (or your canonical tests dir).
- Map @rtsdk/topia to `server/mocks/@rtsdk/topia.ts`.
- Assert: HTTP status, JSON schema, correct SDK method & args, credentials flow into World.create/DroppedAsset.create.
- Note: Source may import with `.js` suffix for runtime ESM; Jest strips `.js` only for relative paths.

DELIVERABLE FORMAT (WHEN IMPLEMENTING CHANGES)
Return these sections:

1. Affected files (paths)
2. Diffs or full new files
3. Short rationale
4. Test updates
5. Styling validation report (for client components)
6. Run steps

IF BLOCKED

- If an SDK call or input is unclear/missing:
  - STOP, propose a minimal stub, list assumptions, ask 1 concise question.
  - If no answer, proceed with safest assumption and mark TODOs.

STYLING REQUIREMENTS (CRITICAL)

For all client-side development, follow the comprehensive styling guide in `.ai/style-guide.md`. This document contains:

1. **Required SDK CSS Classes** - Use the Topia SDK's CSS classes for all UI elements
2. **Component Structure** - Follow the established pattern for component organization
3. **Import Guidelines** - Use aliased imports and proper grouping
4. **Error Handling** - Use GlobalContext for state management
5. **Common Mistakes** - Examples of what to avoid

Reference examples:

- `.ai/examples/page.md` - Example page implementation
- `.ai/examples/styles.md` - Specific styling examples

Validation: Before submitting any implementation, verify that all components follow the styling requirements.

WORKFLOW

1. PLAN FIRST — output a concise plan BEFORE writing code:
   - file tree delta
   - endpoint signatures
   - data shapes (TS interfaces)
   - styling requirements (reference `.ai/style-guide.md`)
2. IMPLEMENT — minimal changes that satisfy constraints & tests.
3. TEST — add/adjust Jest tests; ensure SDK mock coverage.
4. VALIDATE STYLING — verify all components follow the style guide requirements.
5. EXPLAIN — provide the Deliverable Format output.

DEFINITION OF DONE (PLANT PICKER EXAMPLE)

- Home page shows 6 plant images.
- Clicking a plant:
  - Calls backend via existing backendAPI.ts (unchanged).
  - Server creates a DroppedAsset using the clicked image URL per SDK patterns.
- Try/catch aligned with controllers/utils.
- Jest tests cover new route(s) and assert SDK + credentials flow.
- No changes to protected files; client/topiaInit.ts remains present.
