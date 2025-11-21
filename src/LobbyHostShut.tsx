import React, { useState, useEffect } from "react";
import "./LobbyHostShut.css";
import { useWebSocket } from "./hooks/useWebSocket";
import { getRoomStatus } from "./api";
import { startGame } from "./api";
import { useNavigate } from "react-router-dom";

const LobbyHostShut: React.FC = () => {
  const [limitTime, setLimitTime] = useState<number>(0);
  const [police, setPolice] = useState<number>(0);
  const [thief, setThief] = useState<number>(0);

  const navigate = useNavigate();

  const disbandRoom = () => {
    navigate("/");
  };
  const changeRules = () => {
    navigate("/lobby/settings", { state: { from: "/lobby/host/shut" } });
  };
  const start = () => {
    startGame(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? ""
    );
    navigate("/game/prestart");
  };

  type player = {
    id: string;
    name: string;
    role: "POLICE" | "THIEF";
    isCaptured: boolean;
  };
  const [players, setPlayers] = useState<player[]>([]); //playerName,roleの配列定義

  useEffect(() => {
    getRoomStatus(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? ""
    ).then((res) => {
      // res が RoomStatusResponse
      setPlayers(res.players); // ← ここで state に反映
      setLimitTime(res.room.durationSeconds);
      setPolice(res.players.filter((p) => p.role === "POLICE").length);
      setThief(res.players.filter((p) => p.role === "THIEF").length);
    });
  }, []);

  useWebSocket(
    //websocket開始
    "https://dorokei-app-back.onrender.com/",
    (data) => {
      try {
        const player: player[] = data.players;
        setLimitTime(data.room.durationSeconds);
        setThief(player.filter((player) => player.role === "THIEF").length);
        setPolice(player.filter((player) => player.role === "POLICE").length);
        setPlayers(player);
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
      <button className="btn top-left" onClick={disbandRoom}>
        部屋を解散する
      </button>
      <button className="btn top-right" onClick={changeRules}>
        ルール変更
      </button>
      <button className="btn bottom-right" onClick={start}>
        開始する
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
                {player.name} -{player.role === "THIEF" ? "泥棒" : "警察"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LobbyHostShut;
