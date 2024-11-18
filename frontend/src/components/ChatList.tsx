import React from 'react';
import { Search, MoreVertical, MessageSquarePlus } from 'lucide-react';
import type { Chat } from '../types';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';


interface ChatListProps {
  chats: Chat[];
  selectedChat?: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  console.log(chats);
  const { user } = useAuth();
  return (
    <div className="w-[350px] border-r border-gray-200 h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex gap-4 items-center">
          {user?.name}
        </div>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MessageSquarePlus className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-12 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          // Trouver l'autre utilisateur (différent de celui connecté)
          const otherUser = chat.users.find((u: { id: string | undefined; }) => u.id !== user?.id)
          return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
              selectedChat === chat.id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="relative">
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full"
              />
              {otherUser.status=='online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {format(chat.lastMessage.created_at, 'HH:mm')}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate max-w-[200px]">
                  {chat.typing ? (
                    <span className="text-green-500">Typing...</span>
                  ) : (
                    chat.lastMessage?.content
                  )}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}