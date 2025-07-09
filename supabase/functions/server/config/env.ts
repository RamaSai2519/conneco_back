// config/env.ts
export interface EnvConfig {
    supabaseUrl: string;
    supabaseServiceRoleKey: string;
    jwtSecret: string;
    adminPassword: string;
}

export function validateEnvironment(): EnvConfig {
    const config: EnvConfig = {
        supabaseUrl: Deno.env.get("SUPABASE_URL") || "",
        supabaseServiceRoleKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
        jwtSecret: Deno.env.get("JWT_SECRET") || "default-secret-key-for-development",
        adminPassword: Deno.env.get("ADMIN_PASSWORD") || "admin123",
    };

    // Environment validation
    console.log("🔧 Environment check:");
    console.log("- SUPABASE_URL:", config.supabaseUrl ? "✅ Set" : "❌ Missing");
    console.log("- SUPABASE_SERVICE_ROLE_KEY:", config.supabaseServiceRoleKey ? "✅ Set" : "❌ Missing");
    console.log("- JWT_SECRET:", config.jwtSecret);
    console.log("- ADMIN_PASSWORD:", config.adminPassword);

    if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
        throw new Error("Missing required environment variables");
    }

    if (config.jwtSecret.length < 32) {
        console.warn("⚠️  JWT_SECRET is not set or too short. Using default secret for development.");
    }

    return config;
}

export const env = validateEnvironment();
