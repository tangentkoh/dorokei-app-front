import React, { useState } from "react";
import "./LobbyHost.css";
import { useWebSocket } from "./hooks/useWebSocket";

const LobbyHost: React.FC = () => {
  const [limitTime, setLimitTime] = useState<number>(0);
  const [police, setPoloce] = useState<number>(0);
  const [thief, setThief] = useState<number>(0);

  const disbandRoom = () => {};
  const changeRules = () => {};
  const shutRoom = async (): Promise<void> => {};

  type player = {
    id: string;
    name: string;
    role: "POLICE" | "THIEF";
    isCaptured: boolean;
  };
  const [players, setplayers] = useState<player[]>([]); //playerName,roleの配列定義

  useWebSocket(
    //websocket開始
    "localhost:3001/websocket",
    (data: string) => {
      try {
        const parsed = JSON.parse(data); //オブジェクト化して、イベントで処理を分岐
        switch (parsed.type) {
          case "statusUpdated": //updatedイベントの処理
            const parsed_player: player[] = JSON.parse(data).players;
            setLimitTime(parsed.durationSeconds / 60);
            setThief(
              parsed_player.filter((player) => player.role === "THIEF").length
            );
            setPoloce(
              parsed_player.filter((player) => player.role === "POLICE").length
            );
            setplayers(parsed_player);
            break;
          case "terminatedNotification": //terminatedイベントの処理
            if (parsed.reason === "TERMINATED_BY_HOST") {
              alert(parsed.message);
              console.log(parsed.timestamp);
            } else {
              alert("通信エラー");
              console.log(parsed);
            }
            break;
        }
      } catch (e) {
        console.error("WebSocketデータの解析に失敗", e);
      }
    }
  );
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
            {players.map((player, index) => (
              <li key={index}>
                {player.name} -{player.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default LobbyHost;
