// utils/apiClient.ts

// Tùy chỉnh URL dựa trên môi trường
const BASE_URL = "http://localhost:3000/api";

interface FetchOptions extends RequestInit {
  data?: unknown; // Dữ liệu payload cho POST/PUT
}

export async function apiClient<T>(
  endpoint: string,
  { data, headers: customHeaders, ...customConfig }: FetchOptions = {},
): Promise<T> {
  // Lấy token (Thay đổi cách lấy token tùy theo hệ thống của bạn: localStorage, Zustand, Redux...)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    method: data ? "POST" : "GET", // Mặc định là POST nếu có data
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Xử lý lỗi HTTP chung
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}
