// src/store/useWordActionStore.ts
import { create } from "zustand";

interface WordActionStore {
  // Trạng thái lưu ID của card đang thao tác (để truyền vào Modal)
  editingId: string | number | null;
  deletingId: string | number | null;

  // Các hàm global bạn yêu cầu
  handleEdit: (id: string | number) => void;
  handleDelete: (id: string | number) => void;
  handleAddToCollection: (id: string | number) => void;

  // Các hàm hỗ trợ dọn dẹp state khi đóng Modal
  closeEditModal: () => void;
  closeDeleteModal: () => void;
}

export const useWordActionStore = create<WordActionStore>((set) => ({
  editingId: null,
  deletingId: null,

  handleEdit: (id) => {
    console.log("Global - Mở modal chỉnh sửa cho id:", id);
    // Lưu id vào state để Global Modal biết đang edit từ nào
    set({ editingId: id });
  },

  handleDelete: (id) => {
    console.log("Global - Thực hiện xoá id:", id);
    // Lưu id vào state để Global Dialog biết đang muốn xoá từ nào
    set({ deletingId: id });
  },

  handleAddToCollection: (id) => {
    console.log("Global - Thêm id vào collection:", id);
    // Thường hàm này sẽ gọi API trực tiếp và có thể kết hợp bắn Toast (shadcn)
    // Ví dụ: toast({ title: "Đã thêm vào bộ sưu tập" })
  },

  closeEditModal: () => set({ editingId: null }),
  closeDeleteModal: () => set({ deletingId: null }),
}));
