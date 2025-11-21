import React, { useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import { joinRoom, type RoomResponse } from "./api"; // joinRoomをインポート
import "./JoinRoom.css";

// 認証情報のキーを定義 (main.tsxと同期)
const PLAYER_TOKEN_KEY = "playerToken";
const PASSCODE_KEY = "passcode";

// 以前のProps定義は削除

const JoinRoom: React.FC = () => {
  const playerName = useLoaderData() as string;
  const navigate = useNavigate();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 部屋への参加処理
  const handleJoinRoom = async () => {
    setError(null);

    // バリデーション
    if (passcode.length < 6) {
      setError("合言葉は6文字以上で入力してください。");
      return;
    }

    setLoading(true);

    try {
      // API呼び出し
      const roomData: RoomResponse = await joinRoom(playerName, passcode);

      // 成功時処理: 認証情報を保存し、LobbyPlayerへ遷移

      // 1. playerTokenとpasscodeをローカルストレージに保存
      localStorage.setItem(PLAYER_TOKEN_KEY, roomData.playerToken);
      localStorage.setItem(PASSCODE_KEY, roomData.passcode);

      // 2. /lobby/player ルートへ遷移
      navigate("/lobby/player");
    } catch (e) {
      // エラー時
      const errorMessage =
        e instanceof Error
          ? e.message
          : "部屋参加に失敗しました。合言葉が正しいか確認してください。";
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
      <h1 className="title-text">部屋に入る (Player: {playerName})</h1>
      <button className="top-left-button" onClick={goTitle}>
        ←
      </button>
      <h1> </h1>
      <input
        className="select-Button"
        type="text"
        value={passcode}
        placeholder="部屋の合言葉"
        onChange={(e) => setPasscode(e.target.value)}
      ></input>
      <h1> </h1>
      <h1 className="read-text">合言葉「{passcode}」でよろしいですね？</h1>
      <h2> </h2>

      {error && <p className="error-message">エラー: {error}</p>}
      {loading && <p>部屋に参加中...</p>}

      <button
        className="select-button"
        onClick={handleJoinRoom}
        disabled={isButtonDisabled}
      >
        {loading ? "処理中" : "入場"}
      </button>
    </div>
  );
};

export default JoinRoom;
