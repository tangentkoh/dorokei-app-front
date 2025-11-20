import React from "react";
import { Outlet } from "react-router-dom"; // Outletをインポート

// 認証情報のキー (main.tsxと同期)
const PLAYER_TOKEN_KEY = "playerToken";
const PASSCODE_KEY = "passcode";
const PLAYER_NAME_KEY = "cadro_player_name";

// デバッグ情報表示のために、ローカルストレージから認証データを取得するフック
const useAuthData = () => {
  const playerToken = localStorage.getItem(PLAYER_TOKEN_KEY);
  const passcode = localStorage.getItem(PASSCODE_KEY);
  const playerName = localStorage.getItem(PLAYER_NAME_KEY);

  return { playerToken, passcode, playerName };
};

const App: React.FC = () => {
  // useAuthDataでデバッグ情報表示用のデータを取得
  const { playerToken, passcode, playerName } = useAuthData();

  return (
    <div className="app-container">
      {/* Outletがルーティングされた子コンポーネント（Title, MakeRoom, LobbyHostなど）を表示 */}
      <Outlet />

      {/* デバッグ情報 */}
      <div className="debug-info">
        Debug: Screen: Router | Player Name: {playerName || "None"} | Token:{" "}
        {playerToken ? playerToken.substring(0, 8) + "..." : "None"} | Passcode:{" "}
        {passcode || "None"}
      </div>
    </div>
  );
};

export default App;
