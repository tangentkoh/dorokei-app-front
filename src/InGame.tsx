import React, { useState, useEffect } from "react";
import "./InGame.css";
import { useWebSocket } from "./hooks/useWebSocket";
import { useNavigate } from "react-router-dom";
import { capturePlayer, releasePlayer, leaveRoom } from "./api";

interface Player {
  id: string;
  name: string;
  role: "POLICE" | "THIEF";
  isCaptured: boolean;
}

const InGame: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const navigate = useNavigate();
  const playerToken = localStorage.getItem("playerToken") ?? "";
  const passcode = localStorage.getItem("passcode") ?? "";

  const currentPlayer = players.find(
    (p) => p.id === localStorage.getItem("playerId")
  );

  // ページ遷移関数
  const goToResult = () => navigate("/game/result");
  const leaveGame = async () => {
    try {
      await leaveRoom(playerToken, passcode);
      navigate("/");
    } catch (e) {
      console.error("ルームから退出できませんでした", e);
    }
  };

  // 逃走者の捕獲 / 復活切り替え
  const toggleCaptured = async () => {
    if (!currentPlayer) return;
    try {
      if (currentPlayer.isCaptured) {
        await releasePlayer(playerToken, passcode, currentPlayer.id);
      } else {
        await capturePlayer(playerToken, passcode, currentPlayer.id);
      }
    } catch (e) {
      console.error("状態切り替えエラー", e);
    }
  };

  // WebSocket
  useWebSocket(
    localStorage.getItem("socketUrl") ?? "",
    (data) => {
      setPlayers(data.players);
      setRemainingTime(data.room.durationSeconds);
      if (data.room.status === "FINISHED") goToResult();
    },
    (data) => setRemainingTime(data.remainingSeconds),
    (data) => {
      alert(data.message);
      if (data.reason === "TIME_UP" || data.reason === "ALL_CAPTURED") goToResult();
    }
  );

  return (
    <div className="ingame-container">
      {/* 離脱ボタン */}
      <button className="retire-button" onClick={leaveGame}>
        離脱
      </button>

      {/* メインUI */}
      <div className="left-panel">
        <h2 className="title">ゲーム進行中</h2>
        <p>残り時間: {remainingTime} 秒</p>

        {currentPlayer?.role === "THIEF" && (
          <button className="action-button thief-button" onClick={toggleCaptured}>
            {currentPlayer.isCaptured ? "復活" : "捕まった"}
          </button>
        )}

        <div className="role-box">
          <p>あなたの役職: {currentPlayer?.role === "POLICE" ? "警察" : "逃走者"}</p>
        </div>
      </div>

      {/* 参加者一覧 */}
      <div className="right-panel">
        <h3>参加者一覧</h3>
        <ul>
          {players.map((p) => (
            <li key={p.id}>
              {p.name} - {p.role === "POLICE" ? "警察" : "逃走者"}{" "}
              {p.isCaptured ? "(捕獲中)" : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InGame;
