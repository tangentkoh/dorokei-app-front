import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate をインポート
import "./Title.css";

// 認証情報のキーを定義
const PLAYER_NAME_KEY = "cadro_player_name";

const Title: React.FC = () => {
  // useNavigateフックを使用して遷移関数を取得
  const navigate = useNavigate();

  // プレイヤーネームは、ここで入力し、LocalStorageに保存する
  const [localPlayerName, setLocalPlayerName] = useState("");

  const handleGoMakeRoom = () => {
    if (localPlayerName.length > 0) {
      // 1. プレイヤーネームをlocalStorageに保存（nameGuardLoaderでチェックされる）
      localStorage.setItem(PLAYER_NAME_KEY, localPlayerName);

      // 2. /make ルートへ遷移
      navigate("/make");
    }
  };

  const handleGoJoinRoom = () => {
    if (localPlayerName.length > 0) {
      // 1. プレイヤーネームをlocalStorageに保存
      localStorage.setItem(PLAYER_NAME_KEY, localPlayerName);
      // 2. /join ルートへ遷移
      navigate("/join");
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
        onClick={handleGoMakeRoom} // 遷移ロジックを修正
        disabled={isButtonDisabled}
      >
        部屋を作る
      </button>
      <h2> </h2>
      <button
        className="select-button"
        onClick={handleGoJoinRoom} // 遷移ロジックを修正
        disabled={isButtonDisabled}
      >
        部屋に入る
      </button>
    </div>
  );
};

export default Title;
