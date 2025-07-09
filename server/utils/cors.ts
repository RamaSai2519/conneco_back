// utils/cors.ts
import { HTTP_STATUS } from "../constants/index.ts";

export interface CorsOptions {
    origin?: string | string[] | boolean;
    methods?: string[];
    allowedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
}

export class CorsUtil {
    private static defaultOptions: CorsOptions = {
        origin: true, // Allow all origins by default
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
        ],
        credentials: true,
        maxAge: 86400, // 24 hours
    };

    static addCorsHeaders(
        response: Response,
        origin?: string,
        options: CorsOptions = {}
    ): Response {
        const opts = { ...this.defaultOptions, ...options };
        const headers = new Headers(response.headers);

        // Handle origin
        if (typeof opts.origin === "boolean" && opts.origin) {
            headers.set("Access-Control-Allow-Origin", origin || "*");
        } else if (typeof opts.origin === "string") {
            headers.set("Access-Control-Allow-Origin", opts.origin);
        } else if (Array.isArray(opts.origin) && origin) {
            if (opts.origin.includes(origin)) {
                headers.set("Access-Control-Allow-Origin", origin);
            }
        }

        // Set other CORS headers
        if (opts.methods) {
            headers.set("Access-Control-Allow-Methods", opts.methods.join(", "));
        }

        if (opts.allowedHeaders) {
            headers.set("Access-Control-Allow-Headers", opts.allowedHeaders.join(", "));
        }

        if (opts.credentials) {
            headers.set("Access-Control-Allow-Credentials", "true");
        }

        if (opts.maxAge) {
            headers.set("Access-Control-Max-Age", opts.maxAge.toString());
        }

        // Create new response with CORS headers
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    }

    static handlePreflightRequest(origin?: string, options: CorsOptions = {}): Response {
        const opts = { ...this.defaultOptions, ...options };
        const headers = new Headers();

        // Handle origin for preflight
        if (typeof opts.origin === "boolean" && opts.origin) {
            headers.set("Access-Control-Allow-Origin", origin || "*");
        } else if (typeof opts.origin === "string") {
            headers.set("Access-Control-Allow-Origin", opts.origin);
        } else if (Array.isArray(opts.origin) && origin) {
            if (opts.origin.includes(origin)) {
                headers.set("Access-Control-Allow-Origin", origin);
            }
        }

        if (opts.methods) {
            headers.set("Access-Control-Allow-Methods", opts.methods.join(", "));
        }

        if (opts.allowedHeaders) {
            headers.set("Access-Control-Allow-Headers", opts.allowedHeaders.join(", "));
        }

        if (opts.credentials) {
            headers.set("Access-Control-Allow-Credentials", "true");
        }

        if (opts.maxAge) {
            headers.set("Access-Control-Max-Age", opts.maxAge.toString());
        }

        return new Response(null, {
            status: HTTP_STATUS.OK,
            headers,
        });
    }
}
