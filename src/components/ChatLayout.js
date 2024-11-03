// src/components/ChatLayout.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import ChatRoom from './ChatRoom';
import RoomList from './RoomList';
import CreateRoom from './CreateRoom';

const ChatLayout = () => {
  const { token, username } = useAuth();
  const [socket, setSocket] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPrivateConversation, setSelectedPrivateConversation] = useState(null);
  const [rooms, setRooms] = useState([]);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 p-4">
       
        <RoomList
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomSelect={setSelectedRoom}
        />
        
      <div className="flex-1">
       
          <ChatRoom
            room={selectedRoom}
            socket={socket}
            username={username}
          />
      </div>
      </div>
    </div>
  );
};

export default ChatLayout;