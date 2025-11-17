import { DefaultChatTransport } from 'ai';

interface AuthenticatedChatTransportOptions {
  isAuthenticated: boolean;
  idToken: string | null;
  petKey?: string;
  baseUrl?: string;
}

/**
 * Creates a custom chat transport that switches between authenticated and anonymous endpoints
 * and adds Firebase ID token and pet key to requests when authenticated
 */
export function createAuthenticatedChatTransport({
  isAuthenticated,
  idToken,
  petKey,
  baseUrl = 'http://localhost:8080',
}: AuthenticatedChatTransportOptions) {
  console.log('Transport creation:', { isAuthenticated, hasToken: !!idToken, petKey, tokenLength: idToken?.length });

  // Return authenticated transport with JWT token and pet key
  if (isAuthenticated && idToken) {
    console.log("Using Authenticated transport with pet key:", petKey)
    const headers: Record<string, string> = {
      Authorization: `Bearer ${idToken}`,
    };

    // Add pet key header if provided
    if (petKey) {
      headers['X-Pet-Key'] = petKey;
    }

    return new DefaultChatTransport({
      api: `${baseUrl}/ai/authenticated/chat/vetChatAgent`,
      headers,
    });
  }

  // Return anonymous transport without auth header
  console.log("Using Anonymous transport")
  return new DefaultChatTransport({
    api: `${baseUrl}/ai/anonymous/chat/vetChatAgent`,
  });
}
