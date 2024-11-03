
// src/components/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { EmojiHappyIcon, PaperAirplaneIcon } from '@heroicons/react/outline';

const ChatRoom = ({ room, socket, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join room', room._id);

    socket.on('message history', (history) => {
      setMessages(history);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user typing', (user) => {
      setTypingUsers((prev) => new Set([...prev, user]));
    });

    socket.on('user stopped typing', (user) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(user);
        return newSet;
      });
    });

    socket.on('active users', (users) => {
      setActiveUsers(users);
    });

    socket.on('message reaction', ({ messageId, reaction }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, reactions: [...msg.reactions, reaction] }
            : msg
        )
      );
    });

    return () => {
      socket.off('message history');
      socket.off('message');
      socket.off('user typing');
      socket.off('user stopped typing');
      socket.off('active users');
      socket.off('message reaction');
    };
  }, [socket, room._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('new message', {
      roomId: room._id,
      content: newMessage,
    });
    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.emit('typing', room._id);
    
    // Debounce stop typing
    const timeoutId = setTimeout(() => {
      socket.emit('stop typing', room._id);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleReaction = (messageId, emoji) => {
    socket.emit('add reaction', {
      messageId,
      roomId: room._id,
      emoji,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow p-4">
        <h2 className="text-xl font-bold">{room.name}</h2>
        <div className="text-sm text-gray-500">
          {activeUsers.length} active users
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 ${
              message.sender === username ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-md p-3 rounded-lg ${
                message.sender === username
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <div className="text-sm font-bold mb-1">{message.sender}</div>
              <div>{message.content}</div>
              <div className="text-xs mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
              <div className="flex mt-2 space-x-1">
                {message.reactions.map((reaction, index) => (
                  <span key={index} className="text-sm">
                    {reaction.emoji}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-1">
              <button
                onClick={() => handleReaction(message._id, '👍')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                <EmojiHappyIcon className="h-4 w-4 inline" />
              </button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.size > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500">
          {Array.from(typingUsers).join(', ')} is typing...
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4 bg-white shadow">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom