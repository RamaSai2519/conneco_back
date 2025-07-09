// middleware/auth.ts
import { verifyToken } from "../utils/auth.ts";
import { ResponseUtil } from "../utils/response.ts";
import { HTTP_STATUS } from "../constants/index.ts";
import type { JWTPayload } from "../types/auth.ts";

export async function authMiddleware(req: Request): Promise<JWTPayload | null> {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") ?? "";

    if (!token) {
        return null;
    }

    return await verifyToken(token);
}

export function requireAuth(payload: JWTPayload | null): Response | null {
    if (!payload) {
        return ResponseUtil.error("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }
    return null;
}
