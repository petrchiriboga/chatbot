'use client';

import ChatInterface from '@/components/chatInterface';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export default function chat() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat3'
    })
  });

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Chat Assistant (krakenD)
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          AI UI SDK -> API Route (Mastra Client) -> KrakenD -> Mastra REST API
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-200 font-semibold">Error:</p>
          <p className="text-red-600 dark:text-red-300">{error.message}</p>
        </div>
      )}


      <ChatInterface
        messages={messages}
        sendMessage={sendMessage}
        status={status}
        error={error}
      />
    </div>
  );
}
