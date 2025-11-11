import React from "react";
import "./MakeRoom.css";

const MakeRoom: React.FC = () => {
  const goLobbyHost = () => {};
  const goTitle = () => {};
  const [roomName, setroomName] = React.useState("");

  return (
    <div className="center-wrapper">
      <h1 className="title-text">部屋を作る</h1>
      <button className="top-left-button" onClick={goTitle}>
        ←
      </button>
      <h1> </h1>
      <input
        className="select-Button"
        value={roomName}
        placeholder="部屋の名前を入力"
        onChange={(e) => setroomName(e.target.value)}
      ></input>
      <h1> </h1>
      <h1 className="read-text">「{roomName}」でよろしいですね？</h1>
      <h2> </h2>
      <button className="select-button" onClick={goLobbyHost}>
        作成
      </button>
    </div>
  );
};

export default MakeRoom;
