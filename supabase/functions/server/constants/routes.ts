// constants/routes.ts
export const ROUTES = {
    AUTH: {
        LOGIN: "/server/auth/login",
        SIGNUP: "/server/auth/signup",
        REFRESH: "/server/auth/refresh",
    },
    POSTS: {
        CREATE: "/server/posts/create",
        GET_USER_POSTS: "/server/posts/user",
        SEARCH_BY_NAMES: "/server/posts/search",
    },
} as const;

export const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
    OPTIONS: "OPTIONS",
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;
