import React from "react";
import "./LobbyHost.css";

const LobbyHost: React.FC = () => {
  const items = Array.from({ length: 10 }, (_, i) => `名前 ${i + 1} -泥棒`);
  const limitTime: number = 100;
  const police: number = 1;
  const thief: number = 2;

  const disbandRoom = () => {};
  const changeRules = () => {};
  const shutRoom = () => {};

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
