export function failResponse(message, status, detail = "No detail provided") {
    return [
        {
            status: "fail",
            message: message,
            detail: detail,
        },
        { status: status },
    ];
}

export function errorResponse(
    message = "We're sorry, but something unexpected happened. Please try again later.",
    status = 500,
) {
    return [
        {
            status: "error",
            message: message,
        },
        { status: status },
    ];
}

export function successResponse(data) {
    return [
        {
            status: "success",
            data: data,
        },
        { status: 200 },
    ];
}
