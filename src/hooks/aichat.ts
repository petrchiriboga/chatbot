import { useState, useCallback } from 'react';

// UIMessage format that matches Vercel AI SDK
interface UIMessage {
  role: 'user' | 'assistant';
  id: string;
  parts: Array<{
    type: 'text';
    text: string;
  }>;
}

type Status = 'idle' | 'streaming' | 'error';

export function useAIChat() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(async (params: { text: string }) => {
    if (!params.text.trim()) return;

    const userMessage: UIMessage = {
      role: 'user',
      id: `user-${Date.now()}`,
      parts: [
        {
          type: 'text',
          text: params.text
        }
      ]
    };

    setMessages(prev => [...prev, userMessage]);
    setStatus('streaming');
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/ai/chat/vetChatAgent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: params.text }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      const assistantId = `assistant-${Date.now()}`;

      // Add empty assistant message placeholder
      const emptyAssistantMessage: UIMessage = {
        role: 'assistant',
        id: assistantId,
        parts: [{ type: 'text', text: '' }]
      };
      setMessages(prev => [...prev, emptyAssistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataContent = line.slice(6).trim();

            // Skip [DONE] marker
            if (dataContent === '[DONE]') {
              console.log('Stream finished with [DONE]');
              continue;
            }

            try {
              const data = JSON.parse(dataContent);
              console.log('Received SSE data:', data);

              // Handle text-delta events (note: field is 'delta' not 'textDelta')
              if (data.type === 'text-delta' && data.delta) {
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  const currentText = lastMessage.parts[0].text;
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    id: assistantId,
                    parts: [{ type: 'text', text: currentText + data.delta }]
                  };
                  return newMessages;
                });
              }

              // Handle finish event
              if (data.type === 'finish') {
                console.log('Stream finished');
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', line, e);
            }
          }
        }
      }

      setStatus('idle');
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setStatus('error');
    }
  }, []);

  return {
    messages,
    sendMessage,
    status,
    error
  };
}
