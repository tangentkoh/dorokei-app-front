import React, { useEffect, useState } from "react";
import "./GamePreStart.css";
import { useWebSocket } from "./hooks/useWebSocket";

interface Player {
  id: string;
  name: string;
  role: "POLICE" | "THIEF";
}

interface Props {
  playerToken: string;
  passcode: string;
  apiBaseUrl: string;
  socketUrl: string;
  currentPlayerId?: string;
}

const GamePreStart: React.FC<Props> = () => {
  const [remaining, setRemaining] = useState(60);
  const [players] = useState<Player[]>([
    { id: "p1", name: "自分", role: "THIEF" },
    { id: "p2", name: "田中", role: "THIEF" },
    { id: "p3", name: "佐藤", role: "POLICE" },
  ]);

  useWebSocket(
    //websocket開始
    "localhost:3001/websocket",
    (data: string) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === "timerTick") {
          setRemaining(parsed.remainingSeconds); //残り時間を更新
        } else {
          console.log("通信エラー");
        }
      } catch (e) {
        console.error("WebSocketデータの解析に失敗", e);
      }
    }
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-3">逃走準備中</h2>
      <p className="text-lg mb-4">残り時間：{remaining} 秒</p>

      <ul className="border rounded p-2 text-left">
        {players.map((p) => (
          <li key={p.id} className="flex justify-between border-b py-1">
            <span>{p.name}</span>
            <span
              className={
                p.role === "POLICE"
                  ? "text-blue-600 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {p.role === "POLICE" ? "警察" : "逃走者"}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-500 mt-3">（ダミーモード：通信なし）</p>
    </div>
  );
};

export default GamePreStart;
