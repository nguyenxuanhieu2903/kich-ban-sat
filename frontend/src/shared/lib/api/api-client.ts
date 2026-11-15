import { ApiResponse } from "@/shared/types";

export class ApiException extends Error {
  public status: number;
  public errorCode?: string;
  public errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    status: number,
    errorCode?: string,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${DEFAULT_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");

    let responseData: ApiResponse<T>;
    if (contentType && contentType.includes("application/json")) {
      responseData = (await response.json()) as ApiResponse<T>;
    } else {
      const text = await response.text();
      responseData = {
        success: response.ok,
        message: text || response.statusText,
        data: null as unknown as T,
        timestamp: new Date().toISOString(),
      };
    }

    if (!response.ok) {
      throw new ApiException(
        responseData.message || "Yêu cầu thất bại",
        response.status,
        responseData.errorCode,
        responseData.errors
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Lỗi kết nối máy chủ";
    throw new ApiException(message, 0, "NETWORK_ERROR");
  }
}
