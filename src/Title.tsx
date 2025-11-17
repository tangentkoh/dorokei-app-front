// Title.tsx
import React, { useState } from "react";
import "./Title.css";

// 画面遷移をApp.tsxの模擬としてstateで管理するため、propsを定義
interface TitleProps {
  setPlayerName: (name: string) => void;
  goToMakeRoom: () => void;
  goToJoinRoom: () => void;
}

const Title: React.FC<TitleProps> = ({
  setPlayerName,
  goToMakeRoom,
  goToJoinRoom,
}) => {
  // プレイヤーネームは、ここで入力し、遷移時に親（App.tsx）に渡して保存してもらう
  const [localPlayerName, setLocalPlayerName] = useState("");

  // プレイヤーネームを親コンポーネントに保存し、画面遷移する
  const handleGoMakeRoom = () => {
    if (localPlayerName.length > 0) {
      // 1文字でも入力したらOK
      setPlayerName(localPlayerName); // App.tsxで名前を保存
      goToMakeRoom();
    }
  };

  const handleGoJoinRoom = () => {
    if (localPlayerName.length > 0) {
      // 1文字でも入力したらOK [要件]
      setPlayerName(localPlayerName); // App.tsxで名前を保存
      goToJoinRoom();
    }
  };

  // ボタンが押せるかどうか
  const isButtonDisabled = localPlayerName.length === 0;

  return (
    <div className="center-wrapper">
      <h1 className="title-text">ドロケイ支援アプリ(仮)</h1>
      <h1> </h1>
      <input
        className="select-Button"
        value={localPlayerName}
        placeholder="貴方の名前を入力"
        onChange={(e) => setLocalPlayerName(e.target.value)}
      ></input>
      {/* プレイヤーネームが空の場合は警告を表示 */}
      {isButtonDisabled && (
        <p className="error-message">
          プレイヤー名を入力してください (1文字以上)
        </p>
      )}
      <h1> </h1>
      <button
        className="select-button"
        onClick={handleGoMakeRoom}
        disabled={isButtonDisabled}
      >
        部屋を作る
      </button>
      <h2> </h2>
      <button
        className="select-button"
        onClick={handleGoJoinRoom}
        disabled={isButtonDisabled}
      >
        部屋に入る
      </button>
    </div>
  );
};

export default Title;
