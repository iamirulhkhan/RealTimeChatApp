// src/components/CreateRoom.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CreateRoom = ({ onRoomCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomData, setRoomData] = useState({ name: '', isPrivate: false });
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      if (response.ok) {
        setRoomData({ name: '', isPrivate: false });
        setIsOpen(false);
        onRoomCreated();
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Room
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-gray-700 rounded">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Room name"
              value={roomData.name}
              onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
              className="w-full p-2 mb-2 rounded"
            />
            <label className="flex items-center text-white mb-4">
              <input
                type="checkbox"
                checked={roomData.isPrivate}
                onChange={(e) =>
                  setRoomData({ ...roomData, isPrivate: e.target.checked })
                }
                className="mr-2"
              />
              Private Room
            </label>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
