// App.tsx
import React, { useState, useEffect } from "react";
import Title from "./Title";
import MakeRoom from "./MakeRoom";
import JoinRoom from "./JoinRoom";
// ロビーコンポーネントのインポートは削除
// RoomResponseのインポートは不要
import "./App.css";

type Screen = "TITLE" | "MAKEROOM" | "JOINROOM"; // ロビー画面を削除

const PLAYER_NAME_KEY = "cadro_player_name";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("TITLE");
  const [playerName, setPlayerName] = useState("");
  // roomDataの状態管理は削除

  useEffect(() => {
    const savedName = localStorage.getItem(PLAYER_NAME_KEY);
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleSetPlayerName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem(PLAYER_NAME_KEY, name);
  };

  // 画面遷移ロジック
  const goToTitle = () => {
    setPlayerName("");
    localStorage.removeItem(PLAYER_NAME_KEY);
    // roomDataのリセットは不要
    setCurrentScreen("TITLE");
  };
  const goToMakeRoom = () => setCurrentScreen("MAKEROOM");
  const goToJoinRoom = () => setCurrentScreen("JOINROOM");

  const renderScreen = () => {
    switch (currentScreen) {
      case "TITLE":
        return (
          <Title
            setPlayerName={handleSetPlayerName}
            goToMakeRoom={goToMakeRoom}
            goToJoinRoom={goToJoinRoom}
          />
        );
      case "MAKEROOM":
        return (
          <MakeRoom
            playerName={playerName}
            goToTitle={goToTitle}
            // goToLobbyHostのPropsは削除
          />
        );
      case "JOINROOM":
        return (
          <JoinRoom
            playerName={playerName}
            goToTitle={goToTitle}
            // goToLobbyPlayerのPropsは削除
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
      {/* デバッグ情報のスタイルを外部CSSに分離 */}
      <div className="debug-info">
        Debug: Screen: {currentScreen} | Player Name: {playerName}
      </div>
    </div>
  );
};

export default App;
