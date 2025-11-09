"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

const page = () => {
  const DEFAULT_USERS = [
    {
      id: 1,
      name: "Yuito",
      content: "こんにちは！掲示板です。",
      time: "2025-06-24 10:30",
    },
    {
      id: 2,
      name: "Taro",
      content: "プログラミング楽しいですね！",
      time: "2025-06-24 11:00",
    },
    {
      id: 3,
      name: "Hoshi☆",
      content: "マリカds神げー",
      time: "2025-06-24 10:21",
    },
  ];

  const [posts, setPosts] = useState(DEFAULT_USERS);
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newHai, setNewHai] = useState("何のよーなのよー");
  const [newHaii, setNewHaii] = useState("どこかに何かを人力");

  const handleChange = (e) => {
    setNewName(e.target.value);
  };
  const handleChangeee = (e) => {
    setNewContent(e.target.value);
  };
  const addPost = (e) => {
    if (newName.trim() && newContent.trim()) {
      const newPost = {
        id: Date.now(),
        name: newName,
        content: newContent,
        time: new Date().toLocaleString("ja-JP"),
      };
      setPosts([...posts, newPost]);
      setNewName("");
      setNewContent("");
      setNewHai("何のよーなのよー");
      setNewHaii("どこかに何かを人力");
    } else {
      setNewHai("何か入力してください");
      setNewHaii("何か入力してください");
    }
  };
  const deletePost = (id) => {
    console.log(id);

    const filteredPosts = posts.filter((post) => post.id !== id);
    setPosts(filteredPosts);
  };

  const [isShut, setisShut] = useState(False);

  const disband = (e) => {};
  const changerule = (e) => {};
  const start = (e) => {};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ロビー</h1>
      <div className={styles.flexBoxColumn}>
        <button onClick={disband}>部屋を解散する</button>
        <button onClick={changerule}>ルール変更</button>
      </div>
      <div className={styles.postsList}>
        <h3 className={styles.postsTitle}>参加者一覧</h3>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <div className={styles.postHeader}>
              <strong className={styles.postName}>{post.name}</strong>
              <small className={styles.postTime}>{post.time}</small>
            </div>
            <p className={styles.postContent}>{post.content}</p>
          </div>
        ))}
      </div>
      <button onClick={start}>{isOn ? "部屋を閉め切る" : "開始する"}</button>
    </div>
  );
};

export default page;
