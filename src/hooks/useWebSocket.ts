import { useEffect, useRef } from "react";
import { connectionWebsocket } from "../lib/webSockets";

export const useWebSocket = (
  url: string,
  onMessage: (data: string) => void
) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = connectionWebsocket(url);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      onMessage(event.data);
    };

    return () => {
      socket.close();
    };
  }, [url, onMessage]);
};
