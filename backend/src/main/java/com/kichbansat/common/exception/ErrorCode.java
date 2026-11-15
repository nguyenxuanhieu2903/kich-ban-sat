package com.kichbansat.common.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // 400 Bad Request
    INVALID_REQUEST_PAYLOAD(HttpStatus.BAD_REQUEST, "Dữ liệu yêu cầu không hợp lệ"),
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "Xác thực dữ liệu thất bại"),
    BUSINESS_RULE_VIOLATION(HttpStatus.BAD_REQUEST, "Vi phạm quy tắc nghiệp vụ"),

    // 401 Unauthorized
    UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "Yêu cầu đăng nhập để tiếp tục"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Thông tin đăng nhập không chính xác"),

    // 403 Forbidden
    FORBIDDEN_ACTION(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này"),
    RESOURCE_ACCESS_DENIED(HttpStatus.FORBIDDEN, "Không có quyền truy cập tài nguyên này"),

    // 404 Not Found
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy tài nguyên yêu cầu"),

    // 409 Conflict
    STATE_CONFLICT(HttpStatus.CONFLICT, "Xung đột trạng thái hệ thống"),
    CONCURRENT_MODIFICATION(HttpStatus.CONFLICT, "Dữ liệu đã được cập nhật bởi một phiên thao tác khác"),

    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau");

    private final HttpStatus httpStatus;
    private final String defaultMessage;

    ErrorCode(HttpStatus httpStatus, String defaultMessage) {
        this.httpStatus = httpStatus;
        this.defaultMessage = defaultMessage;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
