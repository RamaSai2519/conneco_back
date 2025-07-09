// controllers/auth.ts
import { generateTokens, verifyToken } from "../utils/auth.ts";
import { ResponseUtil } from "../utils/response.ts";
import { env } from "../config/env.ts";
import { HTTP_STATUS } from "../constants/index.ts";
import { supabaseService } from "../services/supabase.ts";
import type { LoginRequest, SignupRequest, RefreshRequest, AuthTokens, User, LoginResponse } from "../types/auth.ts";

export class AuthController {
    static async login(req: Request): Promise<Response> {
        try {
            const body: LoginRequest = await req.json();
            console.log("🚀 ~ AuthController ~ login ~ body:", body)

            // Validate that password is provided
            if (!body.password) {
                return ResponseUtil.error("Password is required", HTTP_STATUS.BAD_REQUEST);
            }

            // Query the users table for a matching password
            const { data: users, error } = await supabaseService.database
                .from('users')
                .select('*')
                .eq('pass', body.password);

            if (error) {
                console.error("Database error:", error);
                return ResponseUtil.error("Database error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            // Check if any user was found with the provided password
            if (!users || users.length === 0) {
                return ResponseUtil.error("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);
            }

            // Get the first matching user
            const user: User = users[0];

            // Generate tokens for the authenticated user
            const tokens = await generateTokens(user.id.toString(), user.pass);

            // Prepare response with user data (excluding password) and tokens
            const { pass, ...userWithoutPassword } = user;
            const loginResponse: LoginResponse = {
                user: userWithoutPassword,
                tokens
            };

            return ResponseUtil.success(loginResponse);
        } catch (error) {
            console.error("Login error:", error);
            return ResponseUtil.error("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    static async refresh(req: Request): Promise<Response> {
        try {
            const body: RefreshRequest = await req.json();
            const payload = await verifyToken(body.refresh);

            if (!payload) {
                return ResponseUtil.error("Invalid refresh token", HTTP_STATUS.FORBIDDEN);
            }

            const tokens = await generateTokens(payload.userId, payload.userPass);
            return ResponseUtil.success(tokens);
        } catch (error) {
            console.error("Refresh error:", error);
            return ResponseUtil.error("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    static async signup(req: Request): Promise<Response> {
        try {
            const body: SignupRequest = await req.json();
            console.log("🚀 ~ AuthController ~ signup ~ body:", body);

            // Validate required fields
            if (!body.name || !body.pass) {
                return ResponseUtil.error("Name and password are required", HTTP_STATUS.BAD_REQUEST);
            }

            const { data: newUser, error: insertError } = await supabaseService.database
                .from('users')
                .insert({
                    name: body.name,
                    pass: body.pass
                })
                .select('*')
                .single();

            if (insertError) {
                console.error("Database insert error:", insertError);
                return ResponseUtil.error("Failed to create user", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            if (!newUser) {
                console.error("No user data returned from insert");
                return ResponseUtil.error("Failed to create user", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            // Generate tokens for the new user
            const tokens = await generateTokens(newUser.id.toString(), newUser.pass);

            // Prepare response with user data (excluding password) and tokens
            const { pass, ...userWithoutPassword } = newUser;
            const signupResponse: LoginResponse = {
                user: userWithoutPassword,
                tokens
            };

            return ResponseUtil.success(signupResponse, HTTP_STATUS.CREATED);
        } catch (error) {
            console.error("Signup error:", error);
            return ResponseUtil.error("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}
