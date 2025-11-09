/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/
// 以下はテスト用のそれなので気にしないで下さい
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 作成した3つのコンポーネントをインポート
import StartPage from "./start.jsx";
import MakeRoomPage from "./makeroom.jsx";
import JoinRoomPage from "./joinroom.jsx";

// ルート（パスとコンポーネントの対応）を定義
const router = createBrowserRouter([
  {
    path: "/", // アプリのルートURL
    element: <StartPage />,
  },
  {
    path: "make", // 部屋を作るページ
    element: <MakeRoomPage />,
  },
  {
    path: "join", // 部屋に入るページ
    element: <JoinRoomPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
