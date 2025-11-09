import { Link } from "react-router-dom";
import React from "react";
("use client");

// スタイルをオブジェクトとして定義
const styles = {
  container: {
    backgroundColor: "#b2f6ffff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "0",
    margin: "0",
  },

  // ヘッダー部分
  header: {
    backgroundColor: "#c5e1a5",
    width: "90%",
    maxWidth: "400px",
    padding: "20px 0",
    textAlign: "center",
    color: "#333",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  headerText: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
  },

  // 中央のコンテンツ（入力欄とボタンを内包）
  mainContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    // ヘッダーと同じ最大幅に制限
    width: "90%",
    maxWidth: "400px",
    padding: "20px",
    textAlign: "center",
  },

  // 入力欄
  inputField: {
    width: "100%",
    padding: "10px",
    margin: "20px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    textAlign: "center",
  },

  // ボタンコンテナ
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "15px",
    marginTop: "20px",
    marginBottom: "40px",
  },

  // ボタン共通
  button: {
    padding: "12px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  createButton: {
    backgroundColor: "#81c784",
    color: "white",
  },
  joinButton: {
    backgroundColor: "#64b5f6",
    color: "white",
  },
};

// Reactコンポーネントの定義
const StartPage = () => {
  // プレイヤーネーム
  const [playerName, setPlayerName] = React.useState("");

  return (
    <div style={styles.container}>
      {/* 全体のコンテナ */}
      <header style={styles.header}>
        <h1 style={styles.headerText}>ドロケイ支援アプリ</h1>
      </header>
      {/* 中央のコンテンツ（入力欄とボタンを内包） */}
      <div style={styles.mainContent}>
        <h2>プレイヤーネーム</h2>

        {/* プレイヤーネーム入力欄 */}
        <input
          type="text"
          placeholder="名前を入力してください"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={styles.inputField}
        />

        {/* 画面下部のボタンをまとめるコンテナ */}
        <div style={styles.buttonContainer}>
          {/* 「部屋を作る」ボタン */}
          <Link to="/make" style={{ textDecoration: "none" }}>
            {" "}
            {/* 👈 Linkで囲む (to="/make") */}
            <button style={{ ...styles.button, ...styles.createButton }}>
              部屋を作る
            </button>
          </Link>

          {/* 「部屋に入る」ボタン */}
          <Link to="/join" style={{ textDecoration: "none" }}>
            {" "}
            {/* 👈 Linkで囲む (to="/join") */}
            <button style={{ ...styles.button, ...styles.joinButton }}>
              部屋に入る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
