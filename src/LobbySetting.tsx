import React, { useState } from "react";

import "./LobbySetting.css";

const LobbySetting: React.FC = () => {
  const items = Array.from({ length: 10 }, (_, i) => `名前 ${i + 1} -`);
  const [roles, setRoles] = useState<string[]>(Array(10).fill("泥棒"));

  const [limitTime, setLimitTime] = useState(100);
  const [police, setPolice] = useState(1);
  const [thief, setThief] = useState(2);

  const handleRoleChange = (index: number, value: string) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = value;
    setRoles(updatedRoles);
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
            {items.map((item, index) => (
              <li key={index}>
                {item}
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
