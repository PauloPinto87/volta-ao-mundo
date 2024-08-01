// src/components/ConnectionManager.js
import { socket } from '../socket';
import { useEffect } from 'react';

const ConnectionManager = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const connect = () => {
    console.log('Connecting...');
    socket.connect();
  };

  const disconnect = () => {
    console.log('Disconnecting...');
    socket.disconnect();
  };

  return (
    <>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
};

export default ConnectionManager;
