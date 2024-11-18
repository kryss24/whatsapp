import React, { useState } from 'react';
import { Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send } from 'lucide-react';
import type { Chat, Message } from '../types';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

interface ChatWindowProps {
  chat?: Chat;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatWindow({ chat, messages, onSendMessage }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">Welcome to WhatsApp</h3>
          <p className="text-gray-500 mt-2">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <div className="flex items-center">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-4">
            <h3 className="font-semibold">{chat.name}</h3>
            <p className="text-sm text-gray-500">
              {chat.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#efeae2]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.user_id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.user_id === 'me'
                    ? 'bg-[#dcf8c6] ml-auto'
                    : 'bg-white'
                }`}
              >
                <p className="text-gray-800">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs text-gray-500">
                    {format(message.created_at, 'HH:mm')}
                  </span>
                  {message.user_id === 'me' && (
                    <span className="text-blue-500">
                      {message.status === 'read' ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Smile className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message"
              className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={1}
            />
          </div>
          {newMessage.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Send className="w-6 h-6 text-gray-600" />
            </button>
          ) : (
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Mic className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}