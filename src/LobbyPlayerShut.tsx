import React, { useState } from "react";
import "./LobbyPlayerShut.css";
import { useWebSocket } from "./hooks/useWebSocket";

const LobbyPlayerShut: React.FC = () => {
  const [limitTime, setLimitTime] = useState<number>(0);
  const [police, setPoloce] = useState<number>(0);
  const [thief, setThief] = useState<number>(0);

  type player = {
    id: string;
    name: string;
    role: "POLICE" | "THIEF";
    isCaptured: boolean;
  };
  const [players, setplayers] = useState<player[]>([]); //playerName,roleの配列定義

  useWebSocket(
    //websocket開始
    "https://dorokei-app-back.onrender.com/",
    (data) => {
      try {
        const player: player[] = data.players;
        setLimitTime(data.room.durationSeconds);
        setThief(player.filter((player) => player.role === "THIEF").length);
        setPoloce(player.filter((player) => player.role === "POLICE").length);
        setplayers(player);
      } catch (e) {
        console.error("WebSocketデータの解析に失敗", e);
      }
    },
    (data) => {
      try {
        console.log(data);
      } catch (e) {
        console.error("WebSocketデータの解析に失敗", e);
      }
    },
    (data) => {
      try {
        if (data.reason === "TERMINATED_BY_HOST") {
          alert(data.message);
          console.log(data.timestamp);
        } else {
          alert("通信エラー");
          console.log(data);
        }
      } catch (e) {
        console.error("WebSocketデータの解析に失敗", e);
      }
    }
  );
  return (
    <div className="container">
      {/* ボタン配置 */}
      <button className="btn top-left" disabled>
        部屋を抜ける
      </button>
      <button className="btn top-right" disabled>
        ルール変更
      </button>
      <button className="btn bottom-righ" disabled>
        締め切られました
      </button>

      {/* 中央コンテンツ */}
      <div className="center">
        <div className="text-block">
          <h1>ロビー（子）</h1>
          <p>制限時間 {limitTime} 分</p>
          <p>警察 {police} 人</p>
          <p>泥棒 {thief} 人</p>
        </div>

        <div className="list-container">
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                {player.name}-{player.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LobbyPlayerShut;
