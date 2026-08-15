// services/wordService.ts
import { apiClient } from "../utils/apiClient.js";
import type {
  CreateWordDto,
  CreateWordResponse,
  GetAllWordsResponse,
} from "../types/word.ts";
export const wordService = {
  /**
   * Tạo từ vựng mới
   */
  createWord: (data: CreateWordDto) => {
    return apiClient<CreateWordResponse>("/words", {
      method: "POST",
      data, // Payload
    });
  },

  /**
   * Ví dụ: Lấy danh sách từ vựng
   */
  getWords: (page: number, limit: number) => {
    return apiClient<GetAllWordsResponse>(
      `/words/?page=${page}&limit=${limit}`,
      {
        method: "GET",
      },
    );
  },

  /**
   * Ví dụ: Xóa từ vựng
   */
  deleteWord: (id: string) => {
    return apiClient<any>(`/words/${id}`, {
      method: "DELETE",
    });
  },
};
