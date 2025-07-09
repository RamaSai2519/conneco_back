// utils/response.ts
import { HTTP_STATUS } from "../constants/index.ts";

export interface StandardResponse<T = unknown> {
    success: boolean;
    data: T;
    error: string;
}

export class ResponseUtil {
    static success<T = unknown>(data: T, status: number = HTTP_STATUS.OK): Response {
        const response: StandardResponse<T> = {
            success: true,
            data,
            error: ""
        };
        return new Response(JSON.stringify(response), {
            status,
            headers: { "Content-Type": "application/json" }
        });
    }

    static error(error: string, status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, data: unknown = null): Response {
        const response: StandardResponse = {
            success: false,
            data,
            error
        };
        return new Response(JSON.stringify(response), {
            status,
            headers: { "Content-Type": "application/json" }
        });
    }
}
