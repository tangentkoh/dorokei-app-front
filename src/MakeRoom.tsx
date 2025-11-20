import React, { useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import "./MakeRoom.css";
import { createRoom, type RoomResponse } from "./api";

// 認証情報のキーを定義 (main.tsxと同期)
const PLAYER_TOKEN_KEY = "playerToken";
const PASSCODE_KEY = "passcode";

const MakeRoom: React.FC = () => {
  // 1. loaderからplayerNameを取得 (playerNameはstring型として保証されている)
  const playerName = useLoaderData() as string;
  const navigate = useNavigate();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 部屋の作成処理
  const handleCreateRoom = async () => {
    setError(null);

    // バリデーション
    if (passcode.length < 6) {
      setError("合言葉は6文字以上で入力してください。");
      return;
    }

    setLoading(true);

    try {
      // API呼び出し
      const roomData: RoomResponse = await createRoom(playerName, passcode);

      // 1. playerTokenとpasscodeをローカルストレージに保存
      localStorage.setItem(PLAYER_TOKEN_KEY, roomData.playerToken);
      localStorage.setItem(PASSCODE_KEY, roomData.passcode);

      // 2. /lobby/host ルートへ遷移
      navigate("/lobby/host");
    } catch (e) {
      // エラー時
      const errorMessage =
        e instanceof Error
          ? e.message
          : "部屋作成に失敗しました。合言葉を変えて再入力してください。";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goTitle = () => {
    navigate("/");
  };

  const isButtonDisabled = passcode.length < 6 || loading;

  return (
    <div className="center-wrapper">
      <h1 className="title-text">部屋を作る (Host: {playerName})</h1>
      <button className="top-left-button" onClick={goTitle}>
        ←
      </button>
      <h1> </h1>
      <input
        className="select-Button"
        type="text"
        value={passcode}
        placeholder="部屋の合言葉 (6文字以上の英数字)"
        onChange={(e) => setPasscode(e.target.value)}
      ></input>
      <h1> </h1>
      <h1 className="read-text">合言葉「{passcode}」でよろしいですね？</h1>
      <h2> </h2>

      {error && <p className="error-message">エラー: {error}</p>}
      {loading && <p>部屋を作成中...</p>}

      <button
        className="select-button"
        onClick={handleCreateRoom}
        disabled={isButtonDisabled}
      >
        {loading ? "処理中" : "作成"}
      </button>
    </div>
  );
};

export default MakeRoom;
