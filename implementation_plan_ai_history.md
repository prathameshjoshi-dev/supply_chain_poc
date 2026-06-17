# AI Query History Plan

## Goal Description
Implement query history for the AI Assistant module so that users can view and maintain a history of their past prompts and AI responses. This history will be persisted in MongoDB and displayed in a sidebar within the AI Assistant layout.

## User Review Required
None.

## Proposed Changes

### Backend
#### [NEW] `src/modules/ai/schemas/ai-history.schema.ts`
- Create a Mongoose schema storing:
  - `userId` (to link history to the logged-in user)
  - `prompt` (the user's query)
  - `response` (the AI's response)
  - `timestamp`

#### [MODIFY] `src/modules/ai/ai.module.ts`
- Import `MongooseModule` and register the `AiHistory` schema.

#### [MODIFY] `src/modules/ai/ai.service.ts`
- Inject the `AiHistory` model.
- Upon successful generation from Ollama, save the `prompt` and `response` pair to the database.
- Add a new method `getHistory(userId: string)` to fetch past queries sorted by newest first.

#### [MODIFY] `src/modules/ai/ai.controller.ts`
- Add a `GET /api/v1/ai/history` endpoint to fetch the logged-in user's query history.

### Frontend
#### [MODIFY] `src/features/ai/api/aiApi.ts`
- Add a `getHistory` query to fetch the past prompts.
- Ensure `sendMessage` mutation invalidates or optimistically updates the history cache.

#### [MODIFY] `src/features/ai/pages/AiAssistantPage.tsx`
- Refactor the layout to include a history sidebar on the left side (or a collapsible drawer).
- Display previous prompts. Clicking a prompt will load that specific conversation or context (for now, simply displaying the log of past prompts in the main view or as clickable items).
- On page load, initialize the chat window with the historical messages.

## Verification Plan
- Send a new prompt.
- Refresh the page and verify the chat history is still present and loaded from the backend.
