import React, { useState, useEffect } from "react";
import "./GamePreStart.css";
import { useWebSocket } from "./hooks/useWebSocket";
import { getRoomStatus } from "./api";
import { useNavigate } from "react-router-dom";

interface Player {
  id: string;
  name: string;
  role: "POLICE" | "THIEF";
  isCaptured: boolean;
}

const GamePreStart: React.FC = () => {
  const [gracePeriodRemaining, setGracePeriodRemaining] = useState<number>(60);
  const [players, setPlayers] = useState<Player[]>([]);
  const navigate = useNavigate();

  const playerToken = localStorage.getItem("playerToken") || "";
  const passcode = localStorage.getItem("passcode") || "";

  // 自分の役職を取得する
  const myRole =
    players.find((p) => p.id === localStorage.getItem("playerId"))?.role ||
    "THIEF";

  useEffect(() => {
    getRoomStatus(playerToken, passcode).then((res) => {
      setPlayers(res.players);
    });
  }, []);

  // WebSocket でリアルタイム更新
  useWebSocket(
    "https://dorokei-app-back.onrender.com/",
    (data) => {
      // game:statusUpdated
      setPlayers(data.players);

      if (data.room.status === "IN_GAME") {
        navigate("/game/ingame");
      }

      if (data.room.status === "CLOSED" || data.room.status === "WAITING") {
        navigate("/lobby/host");
      }
    },
    (data) => {
      // game:timerTick
      if (data.isGracePeriod) {
        setGracePeriodRemaining(data.gracePeriodRemaining || 0);
      }
    },
    (data) => {
      alert(data.message);
    }
  );

  return (
    <div className="prestart-container">
      {/* 大きく役職表示 */}
      <div className={`my-role-box ${myRole === "POLICE" ? "police" : "thief"}`}>
        {myRole === "POLICE" ? "警察" : "逃走者"}
      </div>

      <p className="grace-time">
        残り猶予時間：<span>{gracePeriodRemaining}</span> 秒
      </p>

      <h3 className="member-title">参加者</h3>

      <ul className="player-list">
        {players.map((p) => (
          <li key={p.id}>
            <span className="player-name">{p.name}</span>
            <span className={`role-tag ${p.role === "POLICE" ? "police" : "thief"}`}>
              {p.role === "POLICE" ? "警察" : "逃走者"}
            </span>
          </li>
        ))}
      </ul>

      <p className="waiting-message">
        ゲーム開始を待っています…
      </p>
    </div>
  );
};

export default GamePreStart;
