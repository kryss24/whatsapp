import React, { useEffect, useState } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { chatService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../contexts/AuthContext';
import type { Chat, Message } from '../types';

export function ChatApp() {
  const [selectedChat, setSelectedChat] = useState<string | undefined>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const { user } = useAuth();
  const echo = useWebSocket();

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (!echo || !user) return;

    try {
      const channel = echo.private(`App.Models.User.${user.id}`);
      
      channel.listen('.message.new', (e: { message: Message }) => {
        handleNewMessage(e.message);
      });

      channel.listen('.message.read', (e: { chatId: string }) => {
        handleMessageRead(e.chatId);
      });

      return () => {
        channel.stopListening('.message.new');
        channel.stopListening('.message.read');
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [echo, user]);

  const loadChats = async () => {
    try {
      const { data } = await chatService.getChats();
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const handleChatSelect = async (chatId: string) => {
    setSelectedChat(chatId);
    if (!messages[chatId]) {
      try {
        const { data } = await chatService.getMessages(chatId);
        setMessages(prev => ({ ...prev, [chatId]: data }));
        await chatService.markAsRead(chatId);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChat) return;

    try {
      const { data: newMessage } = await chatService.sendMessage(selectedChat, content);
      handleNewMessage(newMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewMessage = (message: Message) => {
    const chatId = message.chat_id;
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message]
    }));

    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, lastMessage: message }
          : chat
      )
    );
  };

  const handleMessageRead = (chatId: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, unreadCount: 0 }
          : chat
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleChatSelect}
      />
      <ChatWindow
        chat={chats.find(c => c.id === selectedChat)}
        messages={messages[selectedChat || ''] || []}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}