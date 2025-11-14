// App.tsx
import React, { useState, useEffect } from "react";
import Title from "./Title"; // Title.tsxをインポート
import MakeRoom from "./MakeRoom"; // MakeRoom.tsxをインポート
import JoinRoom from "./JoinRoom"; // JoinRoom.tsxをインポート
// import Lobby from './Lobby'; // 今後の画面

// 画面を識別するための型
type Screen = "TITLE" | "MAKEROOM" | "JOINROOM" | "LOBBY_HOST" | "LOBBY_PLAYER";

// 匿名ユーザーの識別と状態復元のため、playerTokenをブラウザのローカルストレージに保存する必要がある [cite: 117, 120]
const PLAYER_NAME_KEY = "cadro_player_name";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("TITLE");
  // プレイヤーネームはフロントエンド側で一時的に保存（cookieやlocalStorageの代替としてstateで管理）
  const [playerName, setPlayerName] = useState("");

  // アプリ起動時にローカルストレージからプレイヤーネームを読み込む（Title.tsxの要件ではないが、利便性のために追加）
  useEffect(() => {
    const savedName = localStorage.getItem(PLAYER_NAME_KEY);
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // プレイヤーネームを設定し、ローカルストレージに保存する関数
  const handleSetPlayerName = (name: string) => {
    setPlayerName(name);
    // 匿名ユーザーの識別のため、フロントエンドで保存
    localStorage.setItem(PLAYER_NAME_KEY, name);
  };

  // 画面遷移ロジック
  const goToTitle = () => {
    // タイトルに戻る際、playerNameもリセット（要件）
    setPlayerName("");
    localStorage.removeItem(PLAYER_NAME_KEY);
    setCurrentScreen("TITLE");
  };
  const goToMakeRoom = () => setCurrentScreen("MAKEROOM");
  const goToJoinRoom = () => setCurrentScreen("JOINROOM");

  // 現在の画面を描画
  const renderScreen = () => {
    switch (currentScreen) {
      case "TITLE":
        return (
          <Title
            setPlayerName={handleSetPlayerName} // プレイヤーネームの保存ロジックを渡す
            goToMakeRoom={goToMakeRoom}
            goToJoinRoom={goToJoinRoom}
          />
        );
      case "MAKEROOM":
        // MakeRoom.tsxにplayerNameとTitleに戻る関数を渡す
        return <MakeRoom playerName={playerName} goToTitle={goToTitle} />;
      case "JOINROOM":
        // JoinRoom.tsxにplayerNameとTitleに戻る関数を渡す
        return <JoinRoom playerName={playerName} goToTitle={goToTitle} />;
      case "LOBBY_HOST":
      case "LOBBY_PLAYER":
        return <div>Lobby Screen (Not Implemented)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
      {/* デバッグ情報 */}
      <div className="debug-info">
        Debug: Screen: {currentScreen} | Player Name: {playerName}
      </div>
    </div>
  );
};

export default App;
