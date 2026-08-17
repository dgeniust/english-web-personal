export const ACHIEVEMENT_IDS = {
  FIRST_WEBSITE_USER: "FIRST_WEBSITE_USER",
  FIRST_LOGIN: "FIRST_LOGIN",
  S_100: "S_100",
  S_200: "S_200",
  S_500: "S_500",
  S_1000: "S_1000",
  W_10: "W_10",
  W_100: "W_100",
  W_500: "W_500",
  W_1000: "W_1000",
} as const;

export const ACHIEVEMENT_DETAILS = {
  [ACHIEVEMENT_IDS.FIRST_WEBSITE_USER]: {
    name: "Người Tiên Phong",
    description: "Bạn là người dùng đầu tiên đăng ký tài khoản trên hệ thống!",
  },
  [ACHIEVEMENT_IDS.FIRST_LOGIN]: {
    name: "Bước Chân Đầu Tiên",
    description: "Chào mừng bạn lần đầu tiên đăng nhập vào hệ thống.",
  },

  // Thành tựu về điểm số (Scores)
  [ACHIEVEMENT_IDS.S_100]: {
    name: "Khởi Động Hoàn Hảo",
    description:
      "Chúc mừng bạn đã đạt được 100 điểm đầu tiên trong các trò chơi.",
  },
  [ACHIEVEMENT_IDS.S_200]: {
    name: "Đà Tiến Lên",
    description: "Tuyệt vời, bạn đã tích lũy thành công 200 điểm tổng cộng.",
  },
  [ACHIEVEMENT_IDS.S_500]: {
    name: "Thợ Săn Điểm Số",
    description: "Xuất sắc! Cột mốc 500 điểm đã chính thức bị bạn chinh phục.",
  },
  [ACHIEVEMENT_IDS.S_1000]: {
    name: "Cao Thủ Trò Chơi",
    description: "Không thể tin được! Bạn đã vươn tới đẳng cấp 1000 điểm.",
  },

  // Thành tựu về số lượng từ vựng (Words)
  [ACHIEVEMENT_IDS.W_10]: {
    name: "Gieo Hạt Tri Thức",
    description: "Bạn đã thêm thành công 10 từ vựng đầu tiên vào danh sách.",
  },
  [ACHIEVEMENT_IDS.W_100]: {
    name: "Kho Tàng Khởi Sắc",
    description: "Đáng nể! Bạn đã lưu trữ và làm chủ 100 từ vựng.",
  },
  [ACHIEVEMENT_IDS.W_500]: {
    name: "Từ Điển Bách Khoa",
    description:
      "Vốn từ của bạn đang cực kỳ phong phú với cột mốc 500 từ vựng.",
  },
  [ACHIEVEMENT_IDS.W_1000]: {
    name: "Học Giả Ngôn Ngữ",
    description:
      "Phi thường! Bộ sưu tập khổng lồ với 1000 từ vựng đã thuộc về bạn.",
  },
};
