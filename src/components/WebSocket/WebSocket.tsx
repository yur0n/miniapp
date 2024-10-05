import { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './websocket-components/ConnectionState';
import { ConnectionManager } from './websocket-components/ConnectionManager';
import { Events } from "./websocket-components/Events";
import { MyForm } from './websocket-components/MyForm';

export default function WebSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<string[]>([]);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: string) {
      setFooEvents(previous => [...previous, value]);
    }

    function onClicksEvent(value: number) {
      setClicks(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);
    socket.on('clicks', onClicksEvent)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={ isConnected } />
      <Events events={ fooEvents } clicks={clicks}/>
      <ConnectionManager />
      <MyForm />

    </div>
  );
}