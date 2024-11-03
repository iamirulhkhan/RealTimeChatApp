// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ... (existing code)

  const getPrivateConversations = async () => {
    const response = await fetch('/api/private-messages', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  };

  const getPrivateMessageHistory = async (recipient) => {
    const response = await fetch(`/api/private-messages/${recipient}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  };

  const sendPrivateMessage = async (recipient, content) => {
    await fetch('/api/private-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ recipient, content }),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        login,
        logout,
        getPrivateConversations,
        getPrivateMessageHistory,
        sendPrivateMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);