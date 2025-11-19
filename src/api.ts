// api.ts(geminiを使いました)

// ===============================================
// 1. 定数と型定義
// ===============================================

// 環境変数が設定されていない場合、開発用のデフォルトURLを使用
const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3001";

// API仕様書から取得
export type PlayerRole = "POLICE" | "THIEF"; // [cite: 23]
export type RoomStatus = "WAITING" | "IN_GAME" | "FINISHED"; // [cite: 22]

/**
 * 部屋の作成/参加成功時のAPIレスポンスボディの型 (No. 1.1, 1.2)
 */
export interface RoomResponse {
  playerToken: string; // 認証トークン (ローカルで保存) [cite: 7]
  passcode: string; // 合言葉 (確認用) [cite: 8]
  playerId: string; // プレイヤーID (UUID v4) [cite: 8]
  roomId: string; // 部屋ID (UUID v4) [cite: 8]
}

/**
 * APIエラーレスポンスの一般的な型 (NestJSのデフォルト形式を想定)
 */
interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

// ===============================================
// 2. 汎用フェッチ関数
// ===============================================

/**
 * 共通のAPIリクエスト処理を行う
 * @param endpoint - APIエンドポイントのパス
 * @param method - HTTPメソッド
 * @param auth - 認証情報 (playerToken, passcode) [cite: 2]
 * @param data - リクエストボディとして送信するデータ
 */
const apiRequest = async <T>(
  endpoint: string,
  method: string,
  auth: { playerToken?: string; passcode?: string },
  data: Record<string, unknown> | null = null
): Promise<T> => {
  let url = `${API_BASE_URL}${endpoint}`;

  // 認証情報(passcode)をクエリパラメータに追加 (認可・部屋特定のため) [cite: 4]
  if (auth.passcode) {
    url += `?passcode=${auth.passcode}`;
  }

  const options: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      // playerTokenをヘッダーに追加 (認証のため) [cite: 4]
      ...(auth.playerToken && { playerToken: auth.playerToken }),
    },
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData: ApiErrorResponse | { message: string };
      try {
        errorData = (await response.json()) as ApiErrorResponse;
      } catch {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const errorMessage =
        (errorData as ApiErrorResponse).message ||
        "不明なエラーが発生しました。";
      throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (error) {
    console.error("API Request Failed:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("予期せぬエラーが発生しました。");
  }
};

// ===============================================
// 3. 部屋の作成・参加 (1.)
// ===============================================

/**
 * 部屋を作成し、ホストとして参加する (POST /rooms/create) [cite: 6]
 */
export const createRoom = async (
  playerName: string,
  passcode: string
): Promise<RoomResponse> => {
  const endpoint = "/rooms/create"; // [cite: 6]
  const requestBody = {
    playerName: playerName, // [cite: 7]
    passcode: passcode, // [cite: 8]
  };
  // 初回はplayerTokenがないため、authは空
  return apiRequest<RoomResponse>(endpoint, "POST", {}, requestBody);
};

/**
 * 既存の部屋に合言葉で参加する (POST /rooms/join) [cite: 6]
 */
export const joinRoom = async (
  playerName: string,
  passcode: string
): Promise<RoomResponse> => {
  const endpoint = "/rooms/join"; // [cite: 6]
  const requestBody = {
    playerName: playerName, // [cite: 8]
    passcode: passcode, // [cite: 8]
  };
  return apiRequest<RoomResponse>(endpoint, "POST", {}, requestBody);
};

// ===============================================
// 4. ゲームの状態取得とホスト操作 (2.)
// ===============================================

// RoomStatusResponse の型定義(足りない所は「神輿」から補完して下さい)
interface RoomStatusResponse {
  room: {
    id: string; // [cite: 19]
    status: RoomStatus; // [cite: 22]
    durationSeconds: number; // [cite: 22]
    // ... 他のroomプロパティ
  };
  players: Array<{
    id: string; // [cite: 23]
    name: string; // [cite: 23]
    role: PlayerRole; // [cite: 23]
    isCaptured: boolean; // [cite: 23]
    // ... 他のplayerプロパティ
  }>; // [cite: 23]
  currentPlayer: {
    playerId: string;
    roomId: string;
    isHost: boolean;
  }; // [cite: 23]
}

/**
 * 参加している部屋の全状態を取得 (GET /rooms/status) [cite: 11]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const getRoomStatus = async (
  playerToken: string,
  passcode: string
): Promise<RoomStatusResponse> => {
  const endpoint = "/rooms/status"; // [cite: 11]
  const auth = { playerToken, passcode };
  return apiRequest<RoomStatusResponse>(endpoint, "GET", auth); // [cite: 16] (なし)
};

/**
 * ホストがゲームの設定を更新 (PATCH /rooms/settings) [cite: 11]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const updateRoomSettings = async (
  playerToken: string,
  passcode: string,
  settings: {
    roles: Array<{ playerId: string; role: PlayerRole }>; // [cite: 24]
    gracePeriodSeconds: number; // [cite: 24]
    durationSeconds: number; // [cite: 24]
  }
) => {
  const endpoint = "/rooms/settings"; // [cite: 11]
  const auth = { playerToken, passcode };
  return apiRequest<{ message: string }>(endpoint, "PATCH", auth, settings); // [cite: 23]
};

/**
 * ホストがゲームを開始 (POST /rooms/start) [cite: 11]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const startGame = async (playerToken: string, passcode: string) => {
  const endpoint = "/rooms/start"; // [cite: 11]
  const auth = { playerToken, passcode };
  return apiRequest<{ status: "IN_GAME" }>(endpoint, "POST", auth); // [cite: 24, 23] (なし)
};

/**
 * ホストがゲームを強制終了 (POST /rooms/terminate) [cite: 11]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const terminateGame = async (playerToken: string, passcode: string) => {
  const endpoint = "/rooms/terminate"; // [cite: 11]
  const auth = { playerToken, passcode };
  return apiRequest<{ status: "FINISHED" }>(endpoint, "POST", auth); // [cite: 24] (なし)
};

/**
 * ゲーム終了後の最終結果ログを取得 (GET /rooms/result) [cite: 11]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const getGameResult = async (playerToken: string, passcode: string) => {
  const endpoint = "/rooms/result"; // [cite: 11]
  const auth = { playerToken, passcode };
  // レスポンス型は status とほぼ同じだが、簡略化のためanyを使用
  return apiRequest<unknown>(endpoint, "GET", auth); // [cite: 24] (なし)
};

/**
 * ルームの参加受付を終了 (POST /rooms/close) [cite: 11]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const closeRoom = async (playerToken: string, passcode: string) => {
  const endpoint = "/rooms/close"; // [cite: 11]
  const auth = { playerToken, passcode };
  return apiRequest<{ message: string }>(endpoint, "POST", auth); // [cite: 25] (なし)
};

/**
 * (リセット操作) (POST /rooms/reset) [cite: 11]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const resetRoom = async (playerToken: string, passcode: string) => {
  const endpoint = "/rooms/reset"; // [cite: 11]
  const auth = { playerToken, passcode };
  return apiRequest<{ message: string }>(endpoint, "POST", auth);
};

// ===============================================
// 5. プレイヤー情報とアクション (3.)
// ===============================================

/**
 * 確保(捕獲)を申告 (PATCH /rooms/players/:playerId/capture) [cite: 28]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const capturePlayer = async (
  playerToken: string,
  passcode: string,
  targetPlayerId: string
) => {
  // :playerId 部分を置き換え
  const endpoint = `/rooms/players/${targetPlayerId}/capture`; // [cite: 29]
  const auth = { playerToken, passcode };
  // リクエストBodyは (なし) [cite: 30]
  return apiRequest<{ message: string }>(endpoint, "PATCH", auth); // [cite: 30]
};

/**
 * 牢屋からの開放を申告 (PATCH /rooms/players/:playerId/release) [cite: 28]
 * 認証情報 (playerToken) が必須 [cite: 10]
 */
export const releasePlayer = async (
  playerToken: string,
  passcode: string,
  targetPlayerId: string
) => {
  // :playerId 部分を置き換え
  const endpoint = `/rooms/players/${targetPlayerId}/release`; // [cite: 29]
  const auth = { playerToken, passcode };
  // リクエストBodyは (なし) [cite: 30]
  return apiRequest<{ message: string }>(endpoint, "PATCH", auth); // [cite: 30]
};
