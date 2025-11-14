// MakeRoom.tsx
import React, { useState } from "react";
import "./MakeRoom.css";
import { createRoom } from "./api"; // 模擬APIをインポート

interface MakeRoomProps {
  playerName: string;
  goToTitle: () => void; // タイトルに戻る（playerNameリセットを含む）
  // goLobbyHost: (roomData: RoomResponse) => void; // 遷移先は未実装のため、一旦不要
}

const MakeRoom: React.FC<MakeRoomProps> = ({ playerName, goToTitle }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 部屋の作成処理
  const handleCreateRoom = async () => {
    setError(null);

    // バリデーション: 6文字以上 [要件/cite: 8]
    if (passcode.length < 6) {
      setError("合言葉は6文字以上で入力してください。");
      return;
    }

    setLoading(true);

    try {
      // API呼び出し: 部屋を作成し、ホストとして参加する
      const roomData = await createRoom(playerName, passcode);

      // 成功時: 本来は goLobbyHost(roomData) を呼び出すが、今は暫定的にエラー扱い [要件]
      console.log("部屋作成成功:", roomData);
      setError(
        `部屋作成成功！ (暫定的にエラー扱いとして処理停止) 部屋ID: ${roomData.roomld}`
      );
      // goLobbyHost(roomData); // 本来の実装
    } catch (e) {
      // エラー時: 合言葉が既に使用されている場合など
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
    goToTitle(); // playerNameもリセットしてタイトルに戻る [要件]
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
        type="text" // パスコードとして適切な型
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
