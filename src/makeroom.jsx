import React from "react";

// スタイルをオブジェクトとして定義
const styles = {
  // 🎨 全体コンテナ
  container: {
    // 薄い紫色の背景
    backgroundColor: "#f3e5f5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "0",
    margin: "0",
  },

  // 🟣 ヘッダー部分
  header: {
    backgroundColor: "#ce93d8", // 少し濃いめの紫色
    width: "90%",
    maxWidth: "400px",
    padding: "20px 0",
    textAlign: "center",
    color: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  headerText: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
  },

  // 📱 中央のコンテンツ
  mainContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    maxWidth: "400px",
    padding: "20px",
    textAlign: "center",
  },

  // 📝 入力欄
  inputField: {
    width: "100%",
    padding: "10px",
    margin: "20px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    textAlign: "center",
  },

  // 🔘 作成ボタンコンテナ（右下に配置）
  buttonContainer: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    justifyContent: "flex-end", // 右寄せにする
    padding: "0 20px 40px", // 下に余白
    boxSizing: "border-box",
    // 画面下部に固定したい場合は position: 'fixed', bottom: 0, などの追加が必要ですが、今回はコンテンツに続く形で配置します
  },

  // 🔘 ボタン
  button: {
    padding: "12px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ab47bc", // 紫色のボタン
    color: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
};

// Reactコンポーネントの定義
const MakeRoomPage = () => {
  const [password, setPassword] = React.useState("");

  return (
    <div style={styles.container}>
      {/* 画面上部のヘッダー */}
      <header style={styles.header}>
        <h1 style={styles.headerText}>部屋を作る</h1>
      </header>

      {/* 中央のコンテンツ */}
      <div style={styles.mainContent}>
        <h2>合言葉を入力</h2>

        {/* 合言葉入力欄 */}
        <input
          type="text"
          placeholder="合言葉（パスワード）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.inputField}
        />
      </div>

      {/* 画面右下のボタン（ここではレイアウトを調整するため、画面下部に寄せる） */}
      <div style={styles.buttonContainer}>
        <button style={styles.button}>作成</button>
      </div>
    </div>
  );
};

export default MakeRoomPage;
