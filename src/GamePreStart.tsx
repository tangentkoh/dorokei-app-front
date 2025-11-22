import React, { useState, useEffect } from "react";
import "./GamePreStart.css";
import { useWebSocket } from "./hooks/useWebSocket";
import { getRoomStatus, startGame } from "./api";
import { useNavigate } from "react-router-dom";

interface Player {
  id: string;
  name: string;
  role: "POLICE" | "THIEF";
  isCaptured: boolean;
}

const GamePreStart: React.FC = () => {
  const [gracePeriodRemaining, setGracePeriodRemaining] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const navigate = useNavigate();

  const playerToken = localStorage.getItem("playerToken") || "";
  const passcode = localStorage.getItem("passcode") || "";

  useEffect(() => {
    getRoomStatus(playerToken, passcode).then((res) => {
      setPlayers(res.players);
      setGracePeriodRemaining(res.room.gracePeriodSeconds);
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
      } else if (data.room.status === "CLOSED" || data.room.status === "WAITING") {
        navigate("/lobby/host");
      }
    },
    (data) => {
      // game:timerTick
      if (data.isGracePeriod) setGracePeriodRemaining(data.gracePeriodRemaining || 0);
    },
    (data) => {
      // game:terminatedNotification
      alert(data.message);
    }
  );

  const handleStartGame = async () => {
    await startGame(playerToken, passcode);
    navigate("/game/ingame");
  };

  return (
    <div className="prestart-container">
      <h2>逃走準備中</h2>
      <p>残り猶予時間：{gracePeriodRemaining} 秒</p>

      <ul className="player-list">
        {players.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span>
            <span className={p.role === "POLICE" ? "police" : "thief"}>
              {p.role === "POLICE" ? "警察" : "逃走者"}
            </span>
          </li>
        ))}
      </ul>

      <button className="start-button" onClick={handleStartGame}>
        ゲーム開始
      </button>
    </div>
  );
};

export default GamePreStart;
