# AI Query History Walkthrough

## Overview
The AI Assistant now has a fully persistent query history mechanism. All your past prompts and Ollama's generated responses are saved to MongoDB and immediately accessible when you return to the chat!

## Accomplishments

### Backend
1. **`AiHistory` Schema**: Designed a Mongoose schema tying `userId`, `prompt`, and `response` securely.
2. **Auto-Save**: Integrated `aiHistoryModel.create(...)` seamlessly inside `AiService.sendMessage()` to automatically log interactions to the DB every time you send a prompt.
3. **History Retrieval Endpoint**: Exposed `GET /api/v1/ai/history` which fetches chronological conversations for the logged-in user.

### Frontend
1. **Redux caching**: Added `useGetHistoryQuery` to `aiApi` and linked it with `['AiHistory']` cache tags. Whenever a new message is sent via `useSendMessageMutation`, it automatically invalidates the tag and forces an instant UI refresh.
2. **Sidebar Interface**: Redesigned `AiAssistantPage.tsx` to utilize a dual-column layout:
   - **Left**: A sleek, scrollable sidebar showing truncated snippets of past prompts and timestamps.
   - **Right**: The main chat window.
3. **Chat Hydration**: Upon loading the page, the main chat window automatically hydrates itself with the retrieved history from MongoDB, so you never lose the context of your previous conversations.

## Verification
- Navigate to the **AI Assistant** screen.
- Send a test prompt like "What are the common KPIs for logistics?".
- Check the left sidebar—you will see the query recorded instantly!
- Refresh your browser—your chat bubbles and sidebar will securely reload from the database.
