import React from "react";
import "./Startpage.css";

const Startpage: React.FC = () => {
  const goTitle = () => {};

  return (
    <div className="center-wrapper">
      <h1 className="center-text">ドロケイ支援アプリ(仮)</h1>
      <h1> </h1>
      <button className="center-button" onClick={goTitle}>
        部屋を作る
      </button>
      <h1> </h1>
      <button className="center-button" onClick={goTitle}>
        部屋に入る
      </button>
    </div>
  );
};

export default Startpage;
