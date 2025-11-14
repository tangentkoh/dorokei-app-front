// JoinRoom.tsx
import React, { useState } from "react";
import "./JoinRoom.css";
import { joinRoom } from "./api"; // 模擬APIをインポート

interface JoinRoomProps {
  playerName: string;
  goToTitle: () => void; // タイトルに戻る（playerNameリセットを含む）
  // goLobbyPlayer: (roomData: RoomResponse) => void; // 遷移先は未実装のため、一旦不要
}

const JoinRoom: React.FC<JoinRoomProps> = ({ playerName, goToTitle }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 部屋への参加処理
  const handleJoinRoom = async () => {
    setError(null);

    // バリデーション: 6文字以上 [要件/cite: 8]
    if (passcode.length < 6) {
      setError("合言葉は6文字以上で入力してください。");
      return;
    }

    setLoading(true);

    try {
      // API呼び出し: 既存の部屋に合言葉で参加する
      const roomData = await joinRoom(playerName, passcode);

      // 成功時: 本来は goLobbyPlayer(roomData) を呼び出すが、今は暫定的にエラー扱い [要件]
      console.log("部屋参加成功:", roomData);
      setError(
        `部屋参加成功！ (暫定的にエラー扱いとして処理停止) 部屋ID: ${roomData.roomld}`
      );
      // goLobbyPlayer(roomData); // 本来の実装
    } catch (e) {
      // エラー時: 部屋が存在しない、または満員の場合など
      const errorMessage =
        e instanceof Error
          ? e.message
          : "部屋への入場に失敗しました。合言葉を確認し再入力してください。";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goTitle = () => {
    goToTitle(); // playerNameもリセットしてタイトルに戻る [要件]
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
        type="text" // パスコードとして適切な型
        value={passcode}
        placeholder="部屋の合言葉 (6文字以上)"
        onChange={(e) => setPasscode(e.target.value)}
      ></input>
      <h1> </h1>
      <h1 className="read-text">合言葉「{passcode}」でよろしいですね？</h1>
      <h2> </h2>
      {error && <p className="error-message">エラー: {error}</p>}
      {loading && <p>部屋に入場中...</p>}

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
