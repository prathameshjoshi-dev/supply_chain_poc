# AI Assistant Integration Plan

## Goal Description
Develop the "AI Assistant" module for Nexus Logistics. This module will integrate with the locally hosted Ollama server (running `qwen3:4b`) to provide users with an intelligent chat interface. The UI will follow the established Nexus Logistics design system (dark mode, glassmorphism) and integrate seamlessly into the existing layout.

## User Review Required
> [!IMPORTANT]
> Since the direct Stitch API access token/URL isn't currently available to download the exact `e3a4dd4ef0be490b88a73459b0e0fd6a` HTML payload, I will build the chat interface based on the premium Nexus Logistics design standards (glassmorphism, dark surface containers, modern typography). Please confirm if you are okay with this, or if you can provide the exact `curl` link for the Stitch HTML file.

## Open Questions
- Should the AI Assistant be aware of the internal system state (e.g., retrieving actual shipment data via tools/function calling), or should it just be a conversational AI for logistics advice for this initial version? I plan to implement it as a conversational AI that answers general supply chain and system questions first.

## Proposed Changes

### Backend Implementation
#### [NEW] `src/modules/ai/ai.module.ts`
- Creates the dedicated module for AI operations.
#### [NEW] `src/modules/ai/services/ai.service.ts`
- Implements `sendMessage(prompt: string)`.
- Uses native `fetch` (or a lightweight HTTP client) to call `http://localhost:11434/api/generate` with the `qwen3:4b` model.
#### [NEW] `src/modules/ai/controllers/ai.controller.ts`
- Exposes `POST /api/v1/ai/chat` which takes a `{ message: string }` body and returns the Ollama response.
#### [MODIFY] `src/app.module.ts`
- Register `AiModule`.

### Frontend Implementation
#### [NEW] `src/features/ai/api/aiApi.ts`
- RTK Query definitions for the `sendMessage` mutation.
#### [NEW] `src/features/ai/pages/AiAssistantPage.tsx`
- A premium, full-height chat interface.
- Glassmorphic message bubbles.
- User messages aligned to the right, AI responses aligned to the left.
- Typing indicators and smooth scroll-to-bottom behavior.
#### [MODIFY] `src/store/index.ts`
- Register the `aiApi` reducer.
#### [MODIFY] `src/components/layout/Layout.tsx`
- Add the "AI Assistant" navigation link (using `smart_toy` or `auto_awesome` icon) to the left sidebar menu.
#### [MODIFY] `src/App.tsx`
- Add routing for `/ai-assistant`.

## Verification Plan
### Automated Tests
- E2E Test ensuring `POST /api/v1/ai/chat` securely accepts messages and returns a properly formatted response.
### Manual Verification
- Navigate to the "AI Assistant" page.
- Send a message like "What is the optimal routing strategy for perishable goods?"
- Ensure the UI displays a loading state and successfully renders the response from the local Ollama instance.
