import React, { useState } from 'react';
import { bookingService } from '../services/api';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to Petchly. How can I assist you today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { 
      id: prev.length + 1, 
      text: inputText, 
      isBot: false 
    }]);

    const result = await bookingService.getAIAssistance(inputText);

    // Add bot response placeholder
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: result.response, 
        isBot: true 
      }]);
    }, 1000);

    setInputText('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button - Updated to match navbar button styling */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-4 border border-transparent text-base font-medium rounded-full text-white bg-[#2A3342] hover:bg-[#1F2937] transition-colors duration-300 shadow-lg hover:shadow-xl"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-[#FDF8F4] rounded-2xl shadow-2xl border border-[#2A3342]/10 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#2A3342] text-white p-4">
            <h3 className="font-semibold text-lg">Petchly Assistant</h3>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-[#FDF8F4]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                    message.isBot
                      ? 'bg-[#2A3342] text-white'
                      : 'bg-[#1F2937] text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t border-[#2A3342]/10 p-4 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-2 border-[#2A3342] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A3342]/50 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-[#2A3342] text-white px-6 py-2 rounded-full hover:bg-[#1F2937] transition-all duration-300 transform hover:scale-105 font-medium"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot; 