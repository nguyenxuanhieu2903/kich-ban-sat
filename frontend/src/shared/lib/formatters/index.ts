/**
 * Format số tiền thành định dạng VNĐ chuẩn Việt Nam.
 * Ví dụ: 150000 -> "150.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format chuỗi thời gian sang định dạng hiển thị tiếng Việt: dd/MM/yyyy HH:mm
 */
export function formatDateTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return "Không xác định";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Tính toán tiền cọc 30% theo quy tắc ACC-15:
 * Cọc 30% làm tròn lên hàng nghìn (1.000đ); số tiền còn lại = total - deposit.
 */
export function calculateDepositAndRemaining(totalAmount: number): {
  deposit: number;
  remaining: number;
} {
  const rawDeposit = totalAmount * 0.3;
  // Làm tròn lên hàng nghìn: Math.ceil(raw / 1000) * 1000
  const deposit = Math.ceil(rawDeposit / 1000) * 1000;
  const remaining = Math.max(0, totalAmount - deposit);

  return { deposit, remaining };
}
