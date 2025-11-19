import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectionWebsocket = (url: string): Socket => {
  socket = io(url, {
    autoConnect: false, // 手動で connect() する
    transports: ["websocket"], // 純粋な WebSocket に近い動作
  });

  socket.on("connect", () => {
    const token = localStorage.getItem("playerToken");
    if (token) {
      socket?.emit("auth", { playerToken: token }); // サーバー側で "auth" を受ける
    } else {
      console.error("No player token found in cookies.");
    }
    console.log("Socket.IO connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket.IO disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.IO error:", error);
  });

  socket.connect(); // 明示的に接続する（autoConnect:false のため）

  return socket;
};
