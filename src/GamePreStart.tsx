import React, { useState, useEffect } from "react";
import "./GamePreStart.css";
import { useWebSocket } from "./hooks/useWebSocket";
import { useNavigate } from "react-router-dom";
import { getRoomStatus, startGame } from "./api";

interface Player {
  id: string;
  name: string;
  role: "POLICE" | "THIEF";
  isCaptured?: boolean;
}

const GamePreStart: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gracePeriodRemaining, setGracePeriodRemaining] = useState<number>(0);
  const navigate = useNavigate();

  const playerToken = localStorage.getItem("playerToken") ?? "";
  const passcode = localStorage.getItem("passcode") ?? "";

  // ページ遷移関数
  const goToInGame = () => navigate("/game/ingame");
  const leaveRoomPage = () => navigate("/");

  // ゲーム開始（ホスト用）
  const handleStartGame = async () => {
    try {
      await startGame(playerToken, passcode);
      goToInGame();
    } catch (e) {
      console.error("ゲーム開始に失敗しました", e);
    }
  };

  // 初期状態取得
  useEffect(() => {
    getRoomStatus(playerToken, passcode)
      .then((res) => {
        setPlayers(res.players);
        setGracePeriodRemaining(res.room.gracePeriodSeconds);
      })
      .catch((err) => console.error("ルーム状態取得に失敗", err));
  }, []);

  // WebSocket
  useWebSocket(
    localStorage.getItem("socketUrl") ?? "",
    (data) => {
      setPlayers(data.players);
      if (data.room.status === "IN_GAME") goToInGame();
    },
    (data) => {
      if (data.isGracePeriod && data.gracePeriodRemaining !== undefined) {
        setGracePeriodRemaining(data.gracePeriodRemaining);
      }
    },
    (data) => {
      alert(data.message);
    }
  );

  return (
    <div className="prestart-container">
      <h2 className="title">逃走準備中</h2>
      <p className="timer">残り猶予時間: {gracePeriodRemaining} 秒</p>

      <div className="players-list">
        <h3>参加者</h3>
        <ul>
          {players.map((p) => (
            <li key={p.id}>
              {p.name} - {p.role === "POLICE" ? "警察" : "逃走者"}
            </li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <button className="action-button start-button" onClick={handleStartGame}>
          ゲーム開始
        </button>
        <button className="action-button leave-button" onClick={leaveRoomPage}>
          退出
        </button>
      </div>
    </div>
  );
};

export default GamePreStart;
