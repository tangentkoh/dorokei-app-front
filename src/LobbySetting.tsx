import React, { useState, useEffect } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import "./LobbySetting.css";
import { getRoomStatus } from "./api";
import { updateRoomSettings } from "./api";
import type { PlayerRole } from "./api";
import { useLocation, useNavigate } from "react-router-dom";

const LobbySetting: React.FC = () => {
  const [players, setPlayers] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [roles, setRoles] = useState<string[]>([]);
  const [limitTime, setLimitTime] = useState(100);
  const [police, setPolice] = useState(1);
  const [thief, setThief] = useState(2);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;

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
    updateRoomSettings(
      localStorage.getItem("playerToken") ?? "",
      localStorage.getItem("passcode") ?? "",
      buildSettings()
    );
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

  const back = () => {
    if (from === "/lobby/host") {
      navigate("/lobby/host");
    } else if (from === "/lobby/host/shut") {
      navigate("/lobby/host/shut");
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await getRoomStatus(
        localStorage.getItem("playerToken") ?? "",
        localStorage.getItem("passcode") ?? ""
      );
      setPlayers(res.players.map(({ id, name }) => ({ id, name }))); // プレイヤー情報をstateにセット);
      setRoles(
        res.players.map((player) => {
          return player.role === "POLICE" ? "警察" : "泥棒";
        })
      ); // 初期化
    };
    fetchStatus();
  }, []);

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
        setPlayers(player.map(({ id, name }) => ({ id, name }))); // プレイヤー情報をstateにセット);
        setRoles(
          player.map((p) => {
            return p.role === "POLICE" ? "警察" : "泥棒";
          })
        ); // 役割情報をstateにセット);
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
              <li key={player.id}>
                {player.name}
                <select
                  value={roles[index]}
                  onChange={(e) =>
                    handleRoleChange(index, e.target.value as "警察" | "泥棒")
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
