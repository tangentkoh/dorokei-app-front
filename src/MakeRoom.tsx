// MakeRoom.tsx
import React, { useState } from "react";
import "./MakeRoom.css";
// API連携のためにインポート
import { createRoom, type RoomResponse } from "./api";

interface MakeRoomProps {
  playerName: string;
  goToTitle: () => void;
  // goToLobbyHost は削除
}

const MakeRoom: React.FC<MakeRoomProps> = ({ playerName, goToTitle }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // 成功メッセージの状態を追加
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 部屋の作成処理
  const handleCreateRoom = async () => {
    setError(null);
    setSuccessMessage(null); // 毎回リセット

    // バリデーション
    if (passcode.length < 6) {
      setError("合言葉は6文字以上で入力してください。");
      return;
    }

    setLoading(true);

    try {
      // API呼び出し
      const roomData: RoomResponse = await createRoom(playerName, passcode);

      // 成功時: 遷移せず、成功メッセージを表示
      const playerIdSnippet =
        roomData.playerld?.substring(0, 8) || "ID取得エラー";

      setSuccessMessage(
        `部屋作成成功！合言葉: ${roomData.passcode} (Player ID: ${playerIdSnippet}...)`
      );
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
    goToTitle();
  };

  // 成功したらボタンを無効化
  const isButtonDisabled =
    passcode.length < 6 || loading || successMessage !== null;

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

      {/* 成功/エラーメッセージの表示 */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">エラー: {error}</p>}
      {loading && <p>部屋を作成中...</p>}

      <button
        className="select-button"
        onClick={handleCreateRoom}
        disabled={isButtonDisabled}
      >
        {loading ? "処理中" : "作成"}
      </button>

      {successMessage && (
        <button className="select-button" onClick={goTitle}>
          タイトルへ戻る
        </button>
      )}
    </div>
  );
};

export default MakeRoom;
