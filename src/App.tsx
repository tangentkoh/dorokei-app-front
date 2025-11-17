import React, { useState, useEffect } from "react";
import Title from "./Title";
import MakeRoom from "./MakeRoom";
import JoinRoom from "./JoinRoom";
import LobbyHost from "./LobbyHost"; // LobbyHostをインポート
import LobbyPlayer from "./LobbyPlayer"; // LobbyPlayerをインポート
import "./App.css";

type Screen = "TITLE" | "MAKEROOM" | "JOINROOM" | "LOBBY_HOST" | "LOBBY_PLAYER";

const PLAYER_NAME_KEY = "cadro_player_name";
const PLAYER_TOKEN_KEY = "playerToken"; // 認証トークンのキー
const PASSCODE_KEY = "passcode"; // 合言葉のキー

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("TITLE");
  const [playerName, setPlayerName] = useState("");
  // 認証情報を保持する状態
  const [playerToken, setPlayerToken] = useState<string | null>(null);
  const [passcode, setPasscode] = useState<string | null>(null);

  // アプリ起動時の初期ロード
  useEffect(() => {
    const savedName = localStorage.getItem(PLAYER_NAME_KEY);
    const savedToken = localStorage.getItem(PLAYER_TOKEN_KEY);
    const savedPasscode = localStorage.getItem(PASSCODE_KEY);

    if (savedName) {
      setPlayerName(savedName);
    }

    // 認証情報があれば状態に設定
    if (savedToken && savedPasscode) {
      setPlayerToken(savedToken);
      setPasscode(savedPasscode);
    }
  }, []);

  const handleSetPlayerName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem(PLAYER_NAME_KEY, name);
  };

  // 画面遷移ロジック
  const goToTitle = () => {
    // タイトルに戻る際は、すべての認証情報をリセット
    setPlayerName("");
    setPlayerToken(null);
    setPasscode(null);
    localStorage.removeItem(PLAYER_NAME_KEY);
    localStorage.removeItem(PLAYER_TOKEN_KEY);
    localStorage.removeItem(PASSCODE_KEY);
    setCurrentScreen("TITLE");
  };
  const goToMakeRoom = () => setCurrentScreen("MAKEROOM");
  const goToJoinRoom = () => setCurrentScreen("JOINROOM");

  // 部屋作成成功時の遷移 (MakeRoom.tsxから呼ばれる)
  const goToLobbyHost = (token: string, code: string) => {
    setPlayerToken(token);
    setPasscode(code);
    setCurrentScreen("LOBBY_HOST");
  };

  // 部屋参加成功時の遷移 (JoinRoom.tsxから呼ばれる)
  const goToLobbyPlayer = (token: string, code: string) => {
    setPlayerToken(token);
    setPasscode(code);
    setCurrentScreen("LOBBY_PLAYER");
  };

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
            goToLobbyHost={goToLobbyHost} // 遷移関数をPropsとして渡す
          />
        );
      case "JOINROOM":
        return (
          <JoinRoom
            playerName={playerName}
            goToTitle={goToTitle}
            goToLobbyPlayer={goToLobbyPlayer} // 遷移関数をPropsとして渡す
          />
        );
      case "LOBBY_HOST":
        // 認証情報がセットされていることを確認して渡す
        if (!playerToken || !passcode)
          return <div>エラー: 認証情報がありません</div>;
        return (
          <LobbyHost
            playerToken={playerToken}
            passcode={passcode}
            goToTitle={goToTitle}
          />
        );
      case "LOBBY_PLAYER":
        // 認証情報がセットされていることを確認して渡す
        if (!playerToken || !passcode)
          return <div>エラー: 認証情報がありません</div>;
        return (
          <LobbyPlayer
            playerToken={playerToken}
            passcode={passcode}
            goToTitle={goToTitle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
      <div className="debug-info">
        Debug: Screen: {currentScreen} | Token:{" "}
        {playerToken ? playerToken.substring(0, 8) + "..." : "None"} | Passcode:{" "}
        {passcode || "None"}
      </div>
    </div>
  );
};

export default App;
