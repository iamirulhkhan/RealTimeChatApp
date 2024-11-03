// src/components/RoomList.jsx
import React from 'react';

const RoomList = ({ rooms, selectedRoom, onRoomSelect }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4 text-white">Rooms</h2>
      <div className="space-y-2">
        {rooms.map((room) => (
          <button
            key={room._id}
            onClick={() => onRoomSelect(room)}
            className={`w-full p-3 rounded ${
              selectedRoom?._id === room._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            <div className="font-bold">{room.name}</div>
            <div className="text-sm opacity-75">
              {room.isPrivate ? 'Private' : 'Public'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomList