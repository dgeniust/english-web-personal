import type { CollectionDetail } from "@/types/deck";
import { apiClient } from "@/utils/apiClient";

export const deckService = {
  /**
   * Lấy chi tiết một deck kèm danh sách từ vựng bên trong
   */
  getDeckDetail: (deckId: string) => {
    return apiClient<CollectionDetail>(`/decks/${deckId}`, {
      method: "GET",
    });
  },
};
