"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

const page = () => {
  const addPost = (e) => {};
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>部屋が解散されました</h1>
      <button onClick={addPost}>タイトルに戻る</button>
    </div>
  );
};
