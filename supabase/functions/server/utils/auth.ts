// utils/auth.ts
import { create, getNumericDate, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { env } from "../config/env.ts";
import type { AuthTokens, JWTPayload } from "../types/auth.ts";

// Create a proper crypto key for HMAC
const getKey = async () => {
    return await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(env.jwtSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );
};

export async function generateTokens(userId: string, userPass: string): Promise<AuthTokens> {
    try {
        const key = await getKey();

        const access = await create(
            { alg: "HS256", typ: "JWT" },
            { userId, userPass, exp: getNumericDate(60 * 15) }, // 15 minutes
            key,
        );

        const refresh = await create(
            { alg: "HS256", typ: "JWT" },
            { userId, userPass, exp: getNumericDate(60 * 60 * 24 * 7) }, // 7 days
            key,
        );

        return { access, refresh };
    } catch (error) {
        console.error("❌ Error generating tokens:", error);
        throw error;
    }
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        if (!token) {
            return null;
        }
        const key = await getKey();
        const payload = await verify(token, key, "HS256") as JWTPayload;
        return payload;
    } catch (error) {
        console.error("❌ Error verifying token:", error);
        return null;
    }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
}
