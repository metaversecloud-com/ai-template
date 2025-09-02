You are building a React + TypeScript client and Node + Express server app that runs inside a Topia iframe and uses the JavaScript RTSDK – Topia Client Library (@rtsdk/topia).

Constraints (do not violate):

- Do NOT modify: client/App.tsx, client/backendAPI.ts, client/setErrorMessage.ts, server/getCredentials.ts, server/errorHandler.ts
- client/topiaInit.ts MUST exist; you may change its exports to fit needs
- Use .env vars: API_KEY, INSTANCE_DOMAIN, INSTANCE_PROTOCOL, INTERACTIVE_KEY, INTERACTIVE_SECRET
- Do not invent SDK methods; only use those documented

References (follow their patterns exactly):

- [SDK docs](https://metaversecloud-com.github.io/mc-sdk-js/index.html) (initialization, credentials, factories, data objects, and examples of creating World/DroppedAsset with credentials; use fireToast or data object CRUD as smoke tests)
- [AI Template repository]() for project structure and env names
- [Getting Started tutorial](https://docs.google.com/presentation/d/12F72CH-MsvcfbEMZ4mO-OyLhViJeq1IfLgjk9xadEaw/edit?usp=sharing)

Deliverables:

1. Keep existing file tree; add routes under server/routes and client components/pages as needed
2. Implement a minimal end-to-end flow:
   - Client reads iframe query params (assetId, interactivePublicKey, interactiveNonce, visitorId, urlSlug) via client/topiaInit.ts
   - Calls backend endpoints WITHOUT changing client/backendAPI.ts (respect its interface)
   - Server instantiates Topia and uses World/DroppedAsset factories with credentials to perform one visible action (fireToast) and one persistence action (updateDataObject)
3. Provide README updates: local run, environment, and a smoke test checklist
4. Type annotations everywhere; never leak secrets to client

Smoke Test:

1. Navigate to your Topia world or create a new new one here.
2. Generate credentials by navigating directly to the [integrations page](https://topia.io/t/dashboard/integrations) and then click the “Add Key Pair” button. This is going to be your public / private key pair for your app.32. From the toolbar select Assets and drop a new asset in your world.
3. While still in Builder Mode, click on the dropped asset to open the Edit Asset drawer.
4. Navigate to Configurations > Integrations and add your Developer Public Key from step 2 and be sure “Add player session credentials to asset interactions” is toggled on.
5. Navigate to Configurations > Links and select Add a website from the Link Type dropdown, add a Title, and select Open in drawer iframe from the Link Behavior dropdown.
6. Enter `http://localhost:3001/` into the Link input field.
7. Click on Leave Build Mode from the toolbar and then click on the dropped asset again to open the app in an iframe in the drawer.

Rules:

- If a needed SDK call is unclear or not in docs, STOP and propose a stub.
- Add inline comments above each SDK call referencing the method you’re using.
