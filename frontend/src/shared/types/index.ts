export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}

export interface PageResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface HealthStatus {
  status: string;
  application: string;
  version: string;
  timestamp: string;
}

export type UserRole = "GUEST" | "PLAYER" | "DM" | "ADMIN";
