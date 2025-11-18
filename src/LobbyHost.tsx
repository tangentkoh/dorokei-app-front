import React, { useState } from "react";
import "./LobbyHost.css";
import { useWebSocket } from "./hooks/useWebSocket";

const LobbyHost: React.FC = () => {
  const limitTime: number = 100;
  const police: number = 1;
  const thief: number = 2;

  const disbandRoom = () => {};
  const changeRules = () => {};
  const shutRoom = async (): Promise<void> => {};

  type Player_wait = {
    //実際に表示される配列の定義
    name: string;
    role: "POLICE" | "THIEF";
  };

  const [players, setplayers] = useState<Player_wait[]>([]); //playerName,roleの配列定義

  useWebSocket(
    //websocket開始
    "localhost:3001/websocket",
    (data: string) => {
      try {
        const parsed = JSON.parse(data); //オブジェクト化して、イベントで処理を分岐
        switch (parsed.type) {
          case "statusUpdated": //updatedイベントの処理
            const PlayerName: string[] = parsed.players.map(
              //player配列からnameだけを取り出す
              (p: { name: string }) => p.name
            );
            const Playerrole: ("POLICE" | "THIEF")[] = parsed.players.map(
              //配列からroleだけを取り出す
              (p: { role: "POLICE" | "THIEF" }) => p.role
            );
            const combined: Player_wait[] = PlayerName.map(
              //nameとroleの結合
              (name: string, index: number) => ({
                name,
                role: Playerrole[index],
              })
            );
            setplayers(combined);
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
