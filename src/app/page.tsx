'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { user: string; ai?: string; typing?: boolean; modalId?: string }[]
  >([]);
  const [modals, setModals] = useState<
    { id: string; html: string; visible: boolean }[]
  >([]);

  const N8N_WEBHOOK_URL =
    'http://localhost:55000/webhook/f3750816-fce1-429d-9717-5b80160d58f8';


    const saveChatToDB = async (
      message: string,
      sender: 'user' | 'ai',
      email: string,
      uuid: string,
      type?: string
    ) => {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sender, email, uuid, type }),
      });
    };
    

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setLoading(true);

    setMessages((prev) => [...prev, { user: userMessage }]);

    const typingTimeout = setTimeout(() => {
      setMessages((prev) => [...prev, { user: '', ai: '', typing: true }]);
    }, 50);

    const payload = {
      message: userMessage,
      email: 'ebenelite@gmail.com',
      uuid: new Date().toISOString().split('T')[0], // Math.random().toString(12)
    };
    await saveChatToDB(userMessage, 'user', payload.email, payload.uuid, 'chat');

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const html = data[0].htmlResponse;
      const chat = data[0].chatResponse;

      let modalId: string | undefined;

      // If HTML content is present, generate modal
      if (html) {
        modalId = uuidv4();
        setModals((prev) => [
          ...prev,
          { id: modalId, html, visible: false },
        ]);

        await saveChatToDB(html, 'ai', payload.email, payload.uuid, 'html');

      }else{
        await saveChatToDB(chat, 'ai', payload.email, payload.uuid, 'chat');
      }

      setMessages((prev) => {
        const updated = [...prev];
        const typingIndex = updated.findIndex((m) => m.typing);
        if (typingIndex !== -1) {
          updated[typingIndex] = {
            user: '',
            ai:
              chat ||
              (html
                ? `<a href="#" data-modal-id="${modalId}">Click here to view content</a>`
                : 'No response.'),
            modalId,
          };
        }
        return updated;
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      clearTimeout(typingTimeout);
      setLoading(false);
    }
  };

  const handleOpenModal = (id: string) => {
    setModals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, visible: true } : m))
    );
  };

  const handleCloseModal = (id: string) => {
    setModals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, visible: false } : m))
    );
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* All modals */}
      {modals.map(
        (modal) =>
          modal.visible && (
            <div
              key={modal.id}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            >
              <div className="relative bg-white w-full h-full max-w-6xl mx-auto rounded shadow-lg">
                <button
                  onClick={() => handleCloseModal(modal.id)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
                >
                  ✕
                </button>
                <iframe
                  srcDoc={modal.html}
                  className="w-full h-full border-0 rounded"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )
      )}

      {/* Chat Box */}
      <div className="flex-grow p-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg.user && (
              <div className="flex justify-start mb-2">
                <div className="bg-blue-100 p-3 rounded-lg shadow text-gray-700">
                  {msg.user}
                </div>
              </div>
            )}
            {msg.typing && (
              <div className="flex justify-end mb-2">
                <div className="bg-gray-200 px-4 py-2 rounded-lg shadow max-w-xs flex items-center space-x-1">
                  <span className="text-gray-600 font-medium">Thinking</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:.1s]" />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:.2s]" />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:.3s]" />
                  </div>
                </div>
              </div>
            )}
            {!msg.typing && msg.ai && (
              <div
                className="flex justify-end mb-2"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  const id = target.getAttribute('data-modal-id');
                  if (id) {
                    e.preventDefault();
                    handleOpenModal(id);
                  }
                }}
              >
                <div
                  className="bg-green-100 p-3 rounded-lg shadow text-gray-700"
                  dangerouslySetInnerHTML={{ __html: msg.ai }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white p-4 border-t flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 text-gray-700"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </main>
  );
}
