'use client';

import ChatForm from '@/components/chatForm';
import { useChat } from '@ai-sdk/react';
import { useAuth } from '@/contexts/AuthContext';
import { createAuthenticatedChatTransport } from '@/lib/chatTransport';
import AuthModal from '@/components/AuthModal';
import PetSelect from '@/components/PetSelect';
import { useState, useMemo } from 'react';

export default function chat() {
  const { isAuthenticated, idToken, user, logout, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  console.log('Page render:', { isAuthenticated, hasToken: !!idToken, tokenPreview: idToken?.substring(0, 20) });

  // Create transport based on auth state and selected pet
  const transport = useMemo(
    () => {
      console.log('Creating new transport with:', { isAuthenticated, hasToken: !!idToken, petKey: selectedPetId });
      return createAuthenticatedChatTransport({
        isAuthenticated,
        idToken,
        petKey: selectedPetId || undefined,
      });
    },
    [isAuthenticated, idToken, selectedPetId]
  );

  // Generate chat ID based on auth state and selected pet to force reset on changes
  const chatId = useMemo(() => {
    if (isAuthenticated) {
      return selectedPetId ? `authenticated-chat-${selectedPetId}` : 'authenticated-chat-no-pet';
    }
    return 'anonymous-chat';
  }, [isAuthenticated, selectedPetId]);

  const { messages, sendMessage, status, error } = useChat({
    transport,
    id: chatId, // Force reinit on auth change or pet change
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Chat Assistant
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <b>{isAuthenticated ? 'Authenticated Mode' : 'Anonymous Mode'}</b> • KrakenD Gateway
            </p>
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-sm text-gray-500">Loading...</span>
            ) : isAuthenticated && user ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-200 font-semibold">Error:</p>
          <p className="text-red-600 dark:text-red-300">{error.message}</p>
        </div>
      )}

      {/* Pet Selection - Only show for authenticated users */}
      {isAuthenticated && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <PetSelect
            value={selectedPetId}
            onChange={setSelectedPetId}
          />
        </div>
      )}

      <ChatForm
        messages={messages}
        sendMessage={sendMessage}
        status={status}
        error={error}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
