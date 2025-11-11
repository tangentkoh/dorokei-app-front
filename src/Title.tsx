import React from "react";
import "./Title.css";

const Title: React.FC = () => {
  const goMakeRoom = () => {};
  const gojoinRoom = () => {};
  const [playerName, setPlayerName] = React.useState("");

  return (
    <div className="center-wrapper">
      <h1 className="title-text">ドロケイ支援アプリ(仮)</h1>
      <h1> </h1>
      <input
        className="select-Button"
        value={playerName}
        placeholder="貴方の名前を入力"
        onChange={(e) => setPlayerName(e.target.value)}
      ></input>
      <h1> </h1>
      <button className="select-button" onClick={goMakeRoom}>
        部屋を作る
      </button>
      <h2> </h2>
      <button className="select-button" onClick={gojoinRoom}>
        部屋に入る
      </button>
    </div>
  );
};

export default Title;
