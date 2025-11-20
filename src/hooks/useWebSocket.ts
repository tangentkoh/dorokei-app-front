import { useEffect, useRef } from "react";
import { connectionWebsocket } from "../lib/webSockets";
import { Socket } from "socket.io-client";

type status = {
  room: {
    id: string; // UUID v4
    status: "WAITING" | "CLOSED" | "IN_GAME" | "FINISHED"; // 'WAITING' | ‘CLOSED’|'IN_GAME' | 'FINISHED'
    durationSeconds: number; // 鬼ごっこの時間
    gracePeriodSeconds: number; // 鬼が動けない時間
    startedAt: string | null; // ISO 8601形式
  };
  players: Array<{
    id: string; // UUID v4
    name: string; // プレイヤー名
    role: "POLICE" | "THIEF"; // 'POLICE' | 'THIEF'
    isCaptured: boolean; // 確保フラグ
  }>;
};
type timer = {
  remainingSeconds: number; // 残り秒数
  elapsedSeconds: number; // 経過秒数
  totalSeconds: number; // 合計秒数
  isGracePeriod: boolean; // 猶予時間中か
  gracePeriodRemaining: number; // 猶予時間の残り（猶予時間中のみ）
};
type terminate = {
  reason: "TIME_UP" | "ALL_CAPTURED" | "TERMINATED_BY_HOST"; // 'TIME_UP' | 'ALL_CAPTURED' | 'TERMINATED_BY_HOST'
  message: string; // 終了メッセージ
  timestamp: string;
};

export const useWebSocket = (
  url: string,
  statusUpdated: (data: status) => void,
  timerTick: (data: timer) => void,
  terminatedNotification: (data: terminate) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = connectionWebsocket(url); // Socket.IO の Socket を取得
    socketRef.current = socket;

    // メッセージ受信（サーバー側のイベントを listen）
    socket.on("statusUpdated", (data: status) => {
      statusUpdated(data);
    });
    socket.on("timerTick", (data: timer) => {
      timerTick(data);
    });
    socket.on("terminatedNotification", (data: terminate) => {
      terminatedNotification(data);
    });

    return () => {
      socket.off("statusUpdated"); // イベントの解除
      socket.disconnect(); // Socket.IO の切断
    };
  }, [url, statusUpdated]);
};
