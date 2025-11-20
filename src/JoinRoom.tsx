// JoinRoom.tsx

import React, { useState } from "react";
import "./JoinRoom.css";
import { joinRoom, type RoomResponse } from "./api"; // joinRoomをインポート

interface JoinRoomProps {
  playerName: string;
  goToTitle: () => void; // 遷移先の追加
  goToLobbyPlayer: (playerToken: string, passcode: string) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({
  playerName,
  goToTitle,
  goToLobbyPlayer,
}) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 成功メッセージの状態は削除 // 部屋への参加処理
  const handleJoinRoom = async () => {
    setError(null); // 成功メッセージのリセットも削除 // バリデーション
    if (passcode.length < 6) {
      setError("合言葉は6文字以上で入力してください。");
      return;
    }

    setLoading(true);

    try {
      // API呼び出し
      const roomData: RoomResponse = await joinRoom(playerName, passcode); // 成功時処理: 認証情報を保存し、LobbyPlayerへ遷移

      // 1. playerTokenとpasscodeをローカルストレージに保存
      localStorage.setItem("playerToken", roomData.playerToken);
      localStorage.setItem("passcode", roomData.passcode);

      // 2. LobbyPlayerへ遷移
      goToLobbyPlayer(roomData.playerToken, roomData.passcode);

      // 以前の成功メッセージ表示ロジックは削除
      /*
const playerIdSnippet = roomData.playerld?.substring(0, 8) || "ID取得エラー";
 setSuccessMessage(
 `部屋参加成功！合言葉: ${roomData.passcode} (Player ID: ${playerIdSnippet}...)`
 );
      */
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
    goToTitle();
  }; // 遷移したらボタンの無効化条件は不要になるが、処理中とバリデーションは残す

  const isButtonDisabled = passcode.length < 6 || loading;

  return (
    <div className="center-wrapper">
      <h1 className="title-text">部屋に入る (Player: {playerName})</h1>{" "}
      <button className="top-left-button" onClick={goTitle}>
        ←{" "}
      </button>
      <h1> </h1>{" "}
      <input
        className="select-Button"
        type="text"
        value={passcode}
        placeholder="部屋の合言葉"
        onChange={(e) => setPasscode(e.target.value)}
      ></input>
      <h1> </h1>{" "}
      <h1 className="read-text">合言葉「{passcode}」でよろしいですね？</h1>{" "}
      <h2> </h2> {/* 成功メッセージは削除 */}{" "}
      {error && <p className="error-message">エラー: {error}</p>}{" "}
      {loading && <p>部屋に参加中...</p>}{" "}
      <button
        className="select-button"
        onClick={handleJoinRoom}
        disabled={isButtonDisabled}
      >
        {loading ? "処理中" : "入場"}{" "}
      </button>{" "}
    </div>
  );
};

export default JoinRoom;
