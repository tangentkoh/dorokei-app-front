// api.ts

// ===============================================
// 1. 定数と型定義
// ===============================================

// 環境変数が設定されていない場合、開発用のデフォルトURLを使用
const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

// API仕様書からPlayerRoleとRoomResponseの型を再定義
export type PlayerRole = "POLICE" | "THIEF";

/**
 * 部屋の作成/参加成功時のAPIレスポンスボディの型
 */
export interface RoomResponse {
  playerToken: string;
  passcode: string;
  playerld: string;
  roomld: string;
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
 * @param endpoint - APIエンドポイントのパス (例: /rooms/create)
 * @param method - HTTPメソッド (例: 'POST')
 * @param data - リクエストボディとして送信するデータ (Record<string, unknown> | null)
 */
// data の型を Record<string, unknown> とすることで、any の使用を回避
const apiRequest = async <T>(
  endpoint: string,
  method: string,
  data: Record<string, unknown> | null = null
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const options: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData: ApiErrorResponse | { message: string };
      try {
        errorData = (await response.json()) as ApiErrorResponse;
      } catch {
        // JSON解析失敗の場合
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      // NestJSの一般的なエラー形式を想定
      const errorMessage =
        (errorData as ApiErrorResponse).message ||
        "不明なエラーが発生しました。";
      throw new Error(errorMessage);
    }

    const text = await response.text();
    // text が空でないか確認してからJSONを解析
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (error) {
    // error は 'unknown' 型として処理
    console.error("API Request Failed:", error);

    if (error instanceof Error) {
      throw error; // Errorオブジェクトであればそのままスロー
    }

    // それ以外のエラーの場合、新しいErrorとしてスロー
    throw new Error("予期せぬエラーが発生しました。");
  }
};

// ===============================================
// 3. エンドポイント関数
// ===============================================

/**
 * 部屋を作成し、ホストとして参加する
 * POST /rooms/create
 */
export const createRoom = async (
  playerName: string,
  passcode: string
): Promise<RoomResponse> => {
  const endpoint = "/rooms/create";
  const requestBody = {
    playerName: playerName,
    passcode: passcode,
  };
  return apiRequest<RoomResponse>(endpoint, "POST", requestBody);
};

/**
 * 既存の部屋に合言葉で参加する
 * POST /rooms/join
 */
export const joinRoom = async (
  playerName: string,
  passcode: string
): Promise<RoomResponse> => {
  const endpoint = "/rooms/join";
  const requestBody = {
    playerName: playerName,
    passcode: passcode,
  };
  return apiRequest<RoomResponse>(endpoint, "POST", requestBody);
};
