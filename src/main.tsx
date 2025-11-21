// routerの役割に変更
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// React Router の主要なフックとプロバイダをインポート
import {
  createBrowserRouter,
  RouterProvider,
  //Outlet, //この辺りは一旦無効にします
  //Navigate,
  redirect,
  //useLoaderData,
} from "react-router-dom";

import "./main.css";

// 各コンポーネントをインポート
// App.tsx をレイアウトコンポーネントとして使用
import App from "./App.tsx";
import Title from "./Title.tsx";
import MakeRoom from "./MakeRoom.tsx";
import JoinRoom from "./JoinRoom.tsx";
import LobbyHost from "./LobbyHost.tsx";
import LobbyPlayer from "./LobbyPlayer.tsx";
import LobbySetting from "./LobbySetting";
import LobbyHostShut from "./LobbyHostShut";
import LobbyPlayerShut from "./LobbyPlayerShut";
import Disband from "./Disband";
import GamePreStart from "./GamePreStart";
import InGame from "./InGame";

// 認証情報のキー
const PLAYER_NAME_KEY = "cadro_player_name";
const PLAYER_TOKEN_KEY = "playerToken";
const PASSCODE_KEY = "passcode";

const API_BASE_URL = "http://localhost:3001";
const SOCKET_URL = "https://dorokei-app-back.onrender.com/";

// ----------------------------------------------------
// 認証ガード (Loader Functions)
// ----------------------------------------------------

/**
 * プレイヤーネームが設定されているかチェックするガード
 * @returns playerName | Redirect
 */
const nameGuardLoader = () => {
  const playerName = localStorage.getItem(PLAYER_NAME_KEY);
  // playerName.length === 0 は、以前のコードで対応
  if (!playerName || playerName.length === 0) {
    return redirect("/");
  }
  return playerName;
};

/**
 * 認証情報 (playerToken, passcode) が設定されているかチェックするガード
 * @returns {playerToken: string, passcode: string, playerName: string} | Redirect
 */
const authGuardLoader = () => {
  const playerToken = localStorage.getItem(PLAYER_TOKEN_KEY);
  const passcode = localStorage.getItem(PASSCODE_KEY);
  const playerName = localStorage.getItem(PLAYER_NAME_KEY);

  if (!playerToken || !passcode || !playerName) {
    return redirect("/");
  }

  // 必要な情報をオブジェクトとして返す
  return {
    playerToken,
    passcode,
    playerName,
    apiBaseUrl: API_BASE_URL, // URLを追加
    socketUrl: SOCKET_URL, // URLを追加
  };
};

// ----------------------------------------------------
// ルーターの定義
// ----------------------------------------------------

const router = createBrowserRouter([
  {
    // Appコンポーネントをレイアウトのルートとして使用
    // App.tsx 内で Outlet を使用して子ルートを描画する
    element: <App />,
    children: [
      // 1. 認証不要なルート
      {
        path: "/",
        element: <Title />,
      },

      // 2. プレイヤーネーム必須ルート
      {
        path: "/make",
        element: <MakeRoom />,
        loader: nameGuardLoader,
      },
      {
        path: "/join",
        element: <JoinRoom />,
        loader: nameGuardLoader,
      },

      // 3. 認証情報必須ルート
      {
        path: "/lobby/host",
        element: <LobbyHost />,
        loader: authGuardLoader,
      },
      {
        path: "/lobby/player",
        element: <LobbyPlayer />,
        loader: authGuardLoader,
      },

      // 以下、今後の認証必須ルート
      {
        path: "/lobby/settings",
        element: <LobbySetting />,
        loader: authGuardLoader,
      },
      {
        path: "/lobby/host/shut",
        element: <LobbyHostShut />,
        loader: authGuardLoader,
      },
      {
        path: "/lobby/player/shut",
        element: <LobbyPlayerShut />,
        loader: authGuardLoader,
      },
      { path: "/disband", element: <Disband />, loader: authGuardLoader },
      {
        path: "/game/prestart",
        element: <GamePreStart />,
        loader: authGuardLoader,
      },
      { path: "/game/ingame", element: <InGame />, loader: authGuardLoader },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* RouterProvider でルーター全体を提供 */}
    <RouterProvider router={router} />
  </StrictMode>
);

// ダミーコンポーネントの定義 (エラー回避のため)
//const LobbySetting = () => (
//  <div className="debug-info">Lobby Setting (WIP)</div>
//);
//const LobbyHostShut = () => (
//  <div className="debug-info">Lobby Host Shut (WIP)</div>
//);
//const LobbyPlayerShut = () => (
//  <div className="debug-info">Lobby Player Shut (WIP)</div>
//);
//const Disband = () => <div className="debug-info">Disband (WIP)</div>;
//const GamePreStart = () => (
//  <div className="debug-info">Game Pre Start (WIP)</div>
//);
//const InGame = () => <div className="debug-info">In Game (WIP)</div>;
