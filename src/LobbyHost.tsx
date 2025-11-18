import React from "react";
import "./LobbyHost.css";

interface LobbyHostProps {
  playerToken: string;
  passcode: string;
  goToTitle: () => void;
}

// Propsの型を適用
const LobbyHost: React.FC<LobbyHostProps> = ({
  playerToken,
  passcode,
  goToTitle,
}) => {
  // ダミーデータ
  const items = Array.from({ length: 10 }, (_, i) => `名前 ${i + 1} -泥棒`);
  const limitTime: number = 100;
  const police: number = 1;
  const thief: number = 2;

  // 部屋解散ボタンはタイトルに戻るロジックに一時的に置き換え
  const disbandRoom = () => {
    // 実際にはAPI: POST /rooms/terminate を呼び出す
    if (window.confirm("部屋を解散しますか？")) {
      goToTitle(); // App.tsxで認証情報がリセットされる
    }
  };
  const changeRules = () => {
    /* 設定画面へ遷移 */
  };
  const shutRoom = () => {
    /* API: POST /rooms/close を呼び出す */
  };

  return (
    <div className="container">
      {/* ボタン配置 */}
      <button className="btn top-left" onClick={disbandRoom}>
        部屋を解散する
      </button>
      <button className="btn top-right" onClick={changeRules}>
        ルール変更
      </button>
      <button className="btn bottom-right" onClick={shutRoom}>
        部屋を締め切る
      </button>

      {/* 中央コンテンツ */}
      <div className="center">
        <div className="text-block">
          <h1>ロビー（親）</h1>
          <h2>合言葉: {passcode}</h2>
          {/* 認証情報を表示 */}
          <p>認証トークン (一部): {playerToken.substring(0, 8)}...</p>
          <p>制限時間 {limitTime} 分</p>
          <p>警察 {police} 人</p>
          <p>泥棒 {thief} 人</p>
        </div>

        <div className="list-container">
          <ul>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LobbyHost;
