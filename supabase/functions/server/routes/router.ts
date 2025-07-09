// routes/router.ts
import { AuthController } from "../controllers/auth.ts";
import { PostController } from "../controllers/post.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { ResponseUtil } from "../utils/response.ts";
import { CorsUtil } from "../utils/cors.ts";
import { ROUTES, HTTP_METHODS, HTTP_STATUS } from "../constants/index.ts";

export class Router {
    static async handleRequest(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const path = url.pathname;
        const method = req.method;
        const origin = req.headers.get("Origin");

        // Handle CORS preflight requests
        if (method === HTTP_METHODS.OPTIONS) {
            return CorsUtil.handlePreflightRequest(origin || undefined);
        }

        let response: Response;

        // Route: POST /server/auth/login
        if (method === HTTP_METHODS.POST && path === ROUTES.AUTH.LOGIN) {
            response = await AuthController.login(req);
        }

        // Route: POST /server/auth/signup
        else if (method === HTTP_METHODS.POST && path === ROUTES.AUTH.SIGNUP) {
            response = await AuthController.signup(req);
        }

        // Route: POST /auth/refresh
        else if (method === HTTP_METHODS.POST && path === ROUTES.AUTH.REFRESH) {
            response = await AuthController.refresh(req);
        }

        // Protected routes - require authentication
        else if (method === HTTP_METHODS.POST && path === ROUTES.POSTS.CREATE) {
            const authResult = await authMiddleware(req);
            if (authResult instanceof Response) {
                response = authResult; // Auth failed, return error response
            } else {
                response = await PostController.createPost(req, authResult);
            }
        }

        else if (method === HTTP_METHODS.GET && path === ROUTES.POSTS.GET_USER_POSTS) {
            const authResult = await authMiddleware(req);
            if (authResult instanceof Response) {
                response = authResult; // Auth failed, return error response
            } else {
                response = await PostController.getUserPosts(req, authResult);
            }
        }

        else if (method === HTTP_METHODS.POST && path === ROUTES.POSTS.SEARCH_BY_NAMES) {
            const authResult = await authMiddleware(req);
            if (authResult instanceof Response) {
                response = authResult; // Auth failed, return error response
            } else {
                response = await PostController.searchPostsByNames(req, authResult);
            }
        }

        // Default: Not Found
        else {
            response = ResponseUtil.error("Not Found", HTTP_STATUS.NOT_FOUND);
        }

        // Add CORS headers to all responses
        return CorsUtil.addCorsHeaders(response, origin || undefined);
    }
}
