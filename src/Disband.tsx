import React from "react";
import "./Disband.css";
import { useNavigate } from "react-router-dom";

const Disband: React.FC = () => {
  const navigate = useNavigate();
  const goTitle = () => {
    navigate("/");
  };

  return (
    <div className="center-wrapper">
      <h1 className="center-text">部屋が解散されました</h1>
      <button className="center-button" onClick={goTitle}>
        タイトルへ戻る
      </button>
    </div>
  );
};

export default Disband;
