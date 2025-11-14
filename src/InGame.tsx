import React, { useState, useEffect } from "react";
import "./InGame.css";

interface Player {
  id: string;
  name: string;
  role: "POLICE" | "THIEF";
  isCaptured: boolean;
}

interface Props {
  currentPlayerId?: string;
  playerToken?: string;
  passcode?: string;
  apiBaseUrl?: string;
  socketUrl?: string;
}

const InGame: React.FC<Props> = ({
  currentPlayerId = "p1",  // デフォルト値
}) => {
  const [remaining, setRemaining] = useState(300);
  const [players, setPlayers] = useState<Player[]>([
    { id: "p1", name: "自分", role: "THIEF", isCaptured: false },
    { id: "p2", name: "田中", role: "THIEF", isCaptured: false },
    { id: "p3", name: "佐藤", role: "POLICE", isCaptured: false },
  ]);

  const currentPlayer = players.find((p) => p.id === currentPlayerId)!;

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleCapture = () => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id ? { ...p, isCaptured: !p.isCaptured } : p
      )
    );
  };

  const capturedList = players.filter((p) => p.isCaptured);

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-3">ゲーム進行中</h2>
      <p className="text-lg mb-4">残り時間：{remaining} 秒</p>

      <h3 className="font-semibold mb-2">捕まっているプレイヤー</h3>
      <ul className="border rounded p-2 text-left min-h-[50px] mb-4">
        {capturedList.length ? (
          capturedList.map((p) => (
            <li key={p.id} className="text-red-600">
              {p.name}
            </li>
          ))
        ) : (
          <li className="text-gray-400">なし</li>
        )}
      </ul>

      {currentPlayer.role === "THIEF" && (
        <button
          onClick={toggleCapture}
          className={`px-4 py-2 rounded font-bold text-white ${
            currentPlayer.isCaptured ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {currentPlayer.isCaptured ? "復活した！" : "捕まった！"}
        </button>
      )}

      {currentPlayer.role === "POLICE" && (
        <p className="text-blue-600 font-semibold">警察モード中</p>
      )}

      <p className="text-sm text-gray-500 mt-3">（ダミーモード：通信なし）</p>
    </div>
  );
};

export default InGame;
