// middleware/auth.ts
import { verifyToken, extractTokenFromHeader } from "../utils/auth.ts";
import { ResponseUtil } from "../utils/response.ts";
import { HTTP_STATUS } from "../constants/index.ts";
import { supabaseService } from "../services/supabase.ts";
import type { JWTPayload, User } from "../types/auth.ts";

export interface AuthContext {
    payload: JWTPayload;
    user: User;
}

export async function authMiddleware(req: Request): Promise<AuthContext | Response> {
    try {
        // Extract and verify JWT token
        const authHeader = req.headers.get('authorization');
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return ResponseUtil.error("Authorization token is required", HTTP_STATUS.UNAUTHORIZED);
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return ResponseUtil.error("Invalid or expired token", HTTP_STATUS.UNAUTHORIZED);
        }

        // Find user by password from JWT to ensure user still exists and password hasn't changed
        const { data: users, error: userError } = await supabaseService.database
            .from('users')
            .select('*')
            .eq('id', payload.userId)
            .eq('pass', payload.userPass);

        if (userError) {
            console.error("Database error while finding user:", userError);
            return ResponseUtil.error("Database error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        if (!users || users.length === 0) {
            return ResponseUtil.error("User not found or password changed", HTTP_STATUS.UNAUTHORIZED);
        }

        const user: User = users[0];

        return {
            payload,
            user
        };
    } catch (error) {
        console.error("Auth middleware error:", error);
        return ResponseUtil.error("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
}
