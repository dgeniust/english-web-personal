// src/store/useCardStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CardStore {
  selectedIds: (string | number)[];
  toggleSelection: (id: string | number) => void;
  clearSelection: () => void;
  isSelected: (id: string | number) => boolean;
  getSelectedCount: () => number;
}

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      selectedIds: [],

      // Thêm nếu chưa có, xoá nếu đã tồn tại trong mảng
      toggleSelection: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((item) => item !== id)
            : [...state.selectedIds, id],
        })),

      // Làm sạch giỏ hàng
      clearSelection: () => set({ selectedIds: [] }),

      // Hàm check nhanh trạng thái của 1 card
      isSelected: (id) => get().selectedIds.includes(id),
      getSelectedCount: () => get().selectedIds.length,
    }),
    {
      name: "card-collection-storage", // Tên key sẽ được lưu trong localStorage của trình duyệt
      storage: createJSONStorage(() => localStorage), // Khai báo rõ là dùng localStorage (mặc định)
      // partialize: (state) => ({ selectedIds: state.selectedIds }), // (Tuỳ chọn) Nếu sau này store có thêm nhiều state khác mà bạn CHỈ muốn lưu selectedIds
    },
  ),
);
