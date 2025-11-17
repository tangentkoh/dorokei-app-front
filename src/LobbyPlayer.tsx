import React from "react";
import "./LobbyPlayer.css";

interface LobbyPlayerProps {
  playerToken: string;
  passcode: string;
  goToTitle: () => void;
}

// Propsの型を適用
const LobbyPlayer: React.FC<LobbyPlayerProps> = ({
  playerToken,
  passcode,
  goToTitle,
}) => {
  // ダミーデータ（実際には/rooms/status APIから取得）
  const items = Array.from({ length: 10 }, (_, i) => `名前 ${i + 1} -泥棒`);
  const limitTime: number = 100;
  const police: number = 1;
  const thief: number = 2;

  // 部屋を抜けるボタンはタイトルに戻るロジックに一時的に置き換え
  const escapeRoom = () => {
    // 実際にはAPI: POST /rooms/leave (仕様書にはないが、必要) を呼び出し、成功したら遷移
    if (window.confirm("部屋から抜けますか？")) {
      goToTitle(); // App.tsxで認証情報がリセットされる
    }
  };

  return (
    <div className="container">
      {/* ボタン配置 */}
      <button className="btn top-left" onClick={escapeRoom}>
        部屋を抜ける
      </button>
      {/* 参加者は変更権限がないためボタンを無効化 */}
      <button className="btn top-right" disabled>
        ルール変更
      </button>
      <button className="btn bottom-righ" disabled>
        部屋を締め切る
      </button>

      {/* 中央コンテンツ */}
      <div className="center">
        <div className="text-block">
          <h1>ロビー（子）</h1>
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

export default LobbyPlayer;
