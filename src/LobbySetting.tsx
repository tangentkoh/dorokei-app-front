import React, { useState } from "react";
import { useWebSocket } from "./hooks/useWebSocket";

import "./LobbySetting.css";

const LobbySetting: React.FC = () => {
  const [limitTime, setLimitTime] = useState(100);
  const [police, setPolice] = useState(1);
  const [thief, setThief] = useState(2);
  const [players, setplayers] = useState<player[]>([]); //playerName,roleの配列定義

  const handleRoleChange = (index: number, value: "POLICE" | "THIEF") => {
    const update: player = players[index];
    update.role = value;
    const updatedRoles: player[] = players;
    updatedRoles[index] = update;
    setplayers(updatedRoles);
  };

  const limitTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    setLimitTime(value);
  };
  const policeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    setPolice(value);
  };
  const thiefChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    setThief(value);
  };

  const back = () => {};
  type player = {
    id: string;
    name: string;
    role: "POLICE" | "THIEF";
    isCaptured: boolean;
  };
  useWebSocket(
    //websocket開始
    "https://dorokei-app-back.onrender.com/",
    (data) => {
      try {
        const player: player[] = data.players;
        setLimitTime(data.room.durationSeconds);
        setplayers(player);
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
      <button className="btn top-left" onClick={back}>
        戻る
      </button>

      {/* 中央コンテンツ */}
      <div className="center">
        <div className="text-block">
          <h1>ルール設定</h1>
          <p>
            制限時間{" "}
            <input
              type="number"
              value={limitTime}
              onChange={limitTimeChange}
              className="inline-input"
            />{" "}
            分
          </p>
          <p>
            警察{" "}
            <input
              type="number"
              value={police}
              onChange={policeChange}
              className="inline-input"
            />{" "}
            人
          </p>
          <p>
            泥棒{" "}
            <input
              type="number"
              value={thief}
              onChange={thiefChange}
              className="inline-input"
            />{" "}
            人
          </p>
        </div>

        <div className="list-container">
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                {player.name}-{player.role}
                <select
                  value={players[index].role}
                  onChange={(e) =>
                    handleRoleChange(
                      index,
                      e.target.value as "POLICE" | "THIEF"
                    )
                  }
                  className="role-select"
                >
                  <option value="POLICE">警察</option>
                  <option value="THIEF">泥棒</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LobbySetting;
