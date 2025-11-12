# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 chatbot application using the App Router, TypeScript, Tailwind CSS, and Vercel AI SDK. The project uses pnpm as its package manager.

The chatbot is currently implemented with UI only (no backend) using initial messages for demonstration purposes.

## Development Commands

- **Start development server**: `pnpm dev` (runs on http://localhost:3000)
- **Build for production**: `pnpm build`
- **Start production server**: `pnpm start`
- **Run linter**: `pnpm lint`

## Project Architecture

### App Router Structure

This project uses Next.js 14 App Router with the following structure:
- `src/app/` - Application routes and layouts
  - `layout.tsx` - Root layout with font configuration and metadata
  - `page.tsx` - Chat interface component (uses Vercel AI SDK's `useChat` hook)
  - `globals.css` - Global styles and Tailwind directives
  - `fonts/` - Local font files (Geist Sans and Geist Mono)

### Chatbot Implementation

The chatbot uses the **Vercel AI SDK** (`ai` and `@ai-sdk/react` packages):

- **`useChat` hook**: Main functionality from `@ai-sdk/react` that manages chat state and messages
- **Initial messages**: Currently configured with pre-populated sample messages (no backend required)
- **Message structure**: Uses `UIMessage` type with `parts` array for handling text and other content types
- **Client component**: Chat interface is a client component (`'use client'` directive required)

#### Adding a Backend

To connect the chatbot to an AI provider later:

1. Create API route at `src/app/api/chat/route.ts`
2. Install provider package (e.g., `@ai-sdk/openai`, `@ai-sdk/anthropic`)
3. Implement POST handler using `streamText` and `convertToModelMessages`
4. Remove `messages` parameter from `useChat` in `page.tsx` to use API endpoint

Example API route:
```typescript
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

### TypeScript Configuration

- Path alias `@/*` maps to `./src/*` for imports
- Strict mode enabled
- Uses `bundler` module resolution

### Styling

The project uses Tailwind CSS with custom CSS variables for theming:
- Support for light/dark mode via CSS variables
- Custom font variables: `--font-geist-sans` and `--font-geist-mono`
- Responsive design patterns using Tailwind breakpoints

## Code Conventions

- Use TypeScript for all new files
- Server Components are the default (no "use client" directive needed unless using client-side features)
- Import `Image` from `next/image` for optimized images
- Import `Metadata` type from "next" for page metadata
- Chat components must use `'use client'` directive since they rely on React hooks from `@ai-sdk/react`
- Handle message rendering by iterating through `message.parts` array and checking the `type` property
