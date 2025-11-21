import React, { useState } from "react"; // useEffectを一時削除
import "./GamePreStart.css";
import { useWebSocket } from "./hooks/useWebSocket";
import { useNavigate } from "react-router-dom";

interface Player {
  id: string;
  name: string;
  role: "POLICE" | "THIEF";
}

//interface Props { // 一時削除
//  currentPlayerId?: string;
//  playerToken?: string;
//  passcode?: string;
//  apiBaseUrl?: string;
//  socketUrl?: string;
//}

const GamePreStart: React.FC = () => {
  const [gracePeriodRemaining, setgracePeriodRemaining] = useState<number>(60);
  const [players] = useState<Player[]>([
    { id: "p1", name: "自分", role: "THIEF" },
    { id: "p2", name: "田中", role: "THIEF" },
    { id: "p3", name: "佐藤", role: "POLICE" },
  ]);
  const navigate = useNavigate();

  useWebSocket(
    //websocket開始
    "https://dorokei-app-back.onrender.com/",
    (data) => {
      try {
        alert("通信エラー");
        console.log(data);
        //const navigate = useNavigate();
        if (data.room.status === "IN_GAME" || data.room.status === "FINISHED") {
          //ゲーム開始画面へ遷移
          navigate("/game/ingame");
        } else if (data.room.status === "WAITING") {
          //締め切り画面へ遷移
          navigate("/lobby/host");
        }
      } catch (e) {
        console.error("WebSocketデータの解析に失敗", e);
      }
    },
    (data) => {
      try {
        setgracePeriodRemaining(data.gracePeriodRemaining);
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
    <div className="text-center">
      <h2 className="text-xl font-bold mb-3">逃走準備中</h2>
      <p className="text-lg mb-4">残り時間：{gracePeriodRemaining} 秒</p>

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
