// src/components/modals/GlobalEditModal.tsx
import { useWordActionStore } from "../../store/useWordActionStore";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const GlobalEditModal = () => {
  const { editingId, closeEditModal } = useWordActionStore();

  // Dialog sẽ tự mở nếu editingId có giá trị (không phải null)
  const isOpen = editingId !== null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => !open && closeEditModal()}
    >
      <DialogContent>
        <DialogTitle>Chỉnh sửa thẻ (ID: {editingId})</DialogTitle>

        {/* Render Form chỉnh sửa của bạn ở đây */}
        <div>Đang chỉnh sửa dữ liệu cho ID: {editingId}</div>
      </DialogContent>
    </Dialog>
  );
};
