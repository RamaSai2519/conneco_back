// utils/logger.ts
export class Logger {
    static info(message: string, ...args: unknown[]) {
        console.log(`ℹ️  ${message}`, ...args);
    }

    static warn(message: string, ...args: unknown[]) {
        console.warn(`⚠️  ${message}`, ...args);
    }

    static error(message: string, ...args: unknown[]) {
        console.error(`❌ ${message}`, ...args);
    }

    static success(message: string, ...args: unknown[]) {
        console.log(`✅ ${message}`, ...args);
    }

    static debug(message: string, ...args: unknown[]) {
        if (Deno.env.get("DEBUG") === "true") {
            console.log(`🐛 ${message}`, ...args);
        }
    }
}
