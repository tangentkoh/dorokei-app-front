import React, { useState, useEffect } from "react";

import "./LobbySetting.css";
import { getRoomStatus } from "./api";
import { updateRoomSettings } from "./api";
import type { PlayerRole } from "./api";

const LobbySetting: React.FC = () => {
  const [players, setPlayers] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [roles, setRoles] = useState<string[]>([]);

  const [limitTime, setLimitTime] = useState(100);
  const [police, setPolice] = useState(1);
  const [thief, setThief] = useState(2);

  const buildSettings = (): {
    roles: { playerId: string; role: PlayerRole }[];
    gracePeriodSeconds: number;
    durationSeconds: number;
  } => ({
    roles: players.map((player, index) => ({
      playerId: player.id,
      role: roles[index] === "警察" ? "POLICE" : "THIEF",
    })),
    gracePeriodSeconds: 10,
    durationSeconds: limitTime,
  });
  const handleRoleChange = (index: number, value: string) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = value;
    setRoles(updatedRoles);
  };

  const limitTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    updateRoomSettings(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? "",
      buildSettings()
    );
    setLimitTime(value);
  };
  const policeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    updateRoomSettings(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? "",
      buildSettings()
    );
    setPolice(value);
  };
  const thiefChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    updateRoomSettings(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? "",
      buildSettings()
    );
    setThief(value);
  };

  const back = () => {};

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await getRoomStatus(
        localStorage.getItem("playerToken") ?? "",
        localStorage.getItem("passcode") ?? ""
      );
      setPlayers(res.players);
      setRoles(res.players.map(() => "泥棒")); // 初期化
    };
    fetchStatus();
  }, []);
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
              <li key={player.id}>
                {player.name}
                <select
                  value={roles[index]}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  className="role-select"
                >
                  <option value="警察">警察</option>
                  <option value="泥棒">泥棒</option>
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
