// server/index.ts
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { HTTP_STATUS } from "./constants/index.ts";
import { Router } from "./routes/router.ts";
import { Logger } from "./utils/logger.ts";
import { CorsUtil } from "./utils/cors.ts";
import "./config/env.ts";

Logger.info("🚀 Server starting...");

serve(async (req: Request): Promise<Response> => {
  try {
    return await Router.handleRequest(req);
  } catch (error) {
    Logger.error("Unhandled request error:", error);
    const origin = req.headers.get("Origin");
    const errorResponse = new Response("Internal Server Error", { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    return CorsUtil.addCorsHeaders(errorResponse, origin || undefined);
  }
});
