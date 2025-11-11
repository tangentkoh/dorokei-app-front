import React from "react";
import "./JoinRoom.css";

const JoinRoom: React.FC = () => {
  const goLobbyPlayer = () => {};
  const goTitle = () => {};
  const [roomName, setroomName] = React.useState("");

  return (
    <div className="center-wrapper">
      <h1 className="title-text">部屋に入る</h1>
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
      <button className="select-button" onClick={goLobbyPlayer}>
        入場
      </button>
    </div>
  );
};

export default JoinRoom;
