import React, { useState, useEffect } from "react";
import "./LobbyHost.css";
import { useWebSocket } from "./hooks/useWebSocket";
import { getRoomStatus } from "./api";
import { closeRoom } from "./api";
import { useNavigate } from "react-router-dom";

const LobbyHost: React.FC = () => {
  const [limitTime, setLimitTime] = useState<number>(0);
  const [police, setPoloce] = useState<number>(0);
  const [thief, setThief] = useState<number>(0);

  const navigate = useNavigate();

  const disbandRoom = () => {
    navigate("/title.tsx");
  };
  const changeRules = () => {
    navigate("/lobby/setting", { state: { from: "/lobby/host" } });
  };
  const shutRoom = async (): Promise<void> => {
    closeRoom(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? ""
    );
    navigate("/lobby/host/shut");
  };

  type player = {
    id: string;
    name: string;
    role: "POLICE" | "THIEF";
    isCaptured: boolean;
  };

  useEffect(() => {
    getRoomStatus(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? ""
    );
  }, []);
  //{ id: "player-1", name: "名前 1", role: "THIEF", isCaptured: false },
  const [players, setPlayers] = useState<player[]>([]);

  useEffect(() => {
    getRoomStatus(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? ""
    );
  }, []);

  useWebSocket(
    //websocket開始
    "https://dorokei-app-back.onrender.com/",
    (data) => {
      try {
        const player: player[] = data.players;
        setLimitTime(data.room.durationSeconds);
        setThief(player.filter((player) => player.role === "THIEF").length);
        setPoloce(player.filter((player) => player.role === "POLICE").length);
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
                {player.name} -{player.role === "THIEF" ? "泥棒" : "警察"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default LobbyHost;
