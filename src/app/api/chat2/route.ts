import { mastraClientRaw } from "@/lib/mastra";
import { toAISdkFormat } from "@mastra/ai-sdk";
import type { ChunkType, MastraModelOutput } from "@mastra/core/stream";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('message', messages);

    console.log('Forwarding request to Mastra with messages:', messages.length);

    const agent = mastraClientRaw.getAgent('vetChatAgent');

    const response = await agent.stream(
      {
        messages
      }
    );

    const chunkStream: ReadableStream<ChunkType> = new ReadableStream<ChunkType>({
      start(controller) {
        response
          .processDataStream({
            onChunk: async (chunk) => {
              controller.enqueue(chunk as ChunkType);
            },
          })
          .finally(() => controller.close());
      },
    });


    const uiMessageStream = createUIMessageStream({
      execute: async ({ writer }) => {
        for await (const part of toAISdkFormat(
          chunkStream as unknown as MastraModelOutput,
          { from: "agent" },
        )) {
          writer.write(part);
        }
      },
    });


    // Return the streaming response from Mastra (already in AI SDK format)
    return createUIMessageStreamResponse({
      stream: uiMessageStream
    })
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Error connecting to Mastra AI' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

