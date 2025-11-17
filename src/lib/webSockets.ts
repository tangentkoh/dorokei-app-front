let socket: WebSocket | null = null;
const getPlayerToken = (): string | null => {
  const value = document.cookie
    .split(/;\s*/)
    .find((row) => row.startsWith("playerToken="))
    ?.split("=")[1];
  return value ? decodeURIComponent(value) : null;
};

export const connectionWebsocket = (url: string): WebSocket => {
  socket = new WebSocket(url);

  socket.onopen = () => {
    if (socket && getPlayerToken()) {
      socket.send(
        JSON.stringify({
          playerToken: getPlayerToken(),
        })
      );
    } else {
      console.error("No player token found in cookies.");
    }
    console.log("Websocket connected");
  };

  socket.onclose = () => {
    console.log("Websocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("Websocket error:", error);
  };

  return socket;
};
