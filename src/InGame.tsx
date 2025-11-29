import React, { useState, useEffect } from "react";
import "./InGame.css";
import { useWebSocket } from "./hooks/useWebSocket";
import { capturePlayer, releasePlayer, leaveRoom, getRoomStatus } from "./api";
import { useNavigate } from "react-router-dom";

interface Player {
  id: string;
  name: string;
  role: "POLICE" | "THIEF";
  isCaptured: boolean;
}

const InGame: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const navigate = useNavigate();

  const playerToken = localStorage.getItem("playerToken") || "";
  const passcode = localStorage.getItem("passcode") || "";

  useEffect(() => {
    getRoomStatus(playerToken, passcode).then((res) => {
      setPlayers(res.players);
      setRemainingSeconds(res.room.durationSeconds);
    });
  });

  const handleCapture = async (playerId: string) => {
    await capturePlayer(playerToken, passcode, playerId);
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isCaptured: true } : p))
    );
  };

  const handleRelease = async (playerId: string) => {
    await releasePlayer(playerToken, passcode, playerId);
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isCaptured: false } : p))
    );
  };

  const handleLeave = async () => {
    await leaveRoom(playerToken, passcode);
    navigate("/");
  };

  useWebSocket(
    "https://dorokei-app-back.onrender.com/",
    (data) => {
      // game:statusUpdated
      setPlayers(data.players);
      if (data.room.status === "FINISHED") {
        navigate("/game/result");
      }
    },
    (data) => setRemainingSeconds(data.remainingSeconds),
    (data) => alert(data.message)
  );

  return (
    <div className="ingame-container">
      <button className="leave-button" onClick={handleLeave}>
        離脱
      </button>

      <h2>ゲーム進行中</h2>
      <p>残り時間：{remainingSeconds} 秒</p>

      <ul className="player-list">
        {players.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span>
            <span className={p.role === "POLICE" ? "police" : "thief"}>
              {p.role === "POLICE" ? "警察" : "逃走者"}
            </span>
            {p.role === "POLICE" && !p.isCaptured && (
              <button
                className="action-button capture"
                onClick={() => handleCapture(p.id)}
              >
                確保
              </button>
            )}
            {p.role === "THIEF" && p.isCaptured && (
              <button
                className="action-button release"
                onClick={() => handleRelease(p.id)}
              >
                解放
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InGame;
