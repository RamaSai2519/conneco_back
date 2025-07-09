// types/post.ts
export interface CreatePostRequest {
    text?: string; // Optional but at least one of text or image_url is required
    image_url?: string; // Optional but at least one of text or image_url is required
    date?: string; // Optional date field from frontend (ISO string format)
}

export interface Post {
    id: number;
    user_id: number;
    text: string;
    image_url: string;
    date: string | null; // Date field from frontend - nullable since it's optional
    created_at: string;
}

export interface CreatePostResponse {
    post: Post;
}

export interface GetPostsResponse {
    posts: Post[];
}

export interface SearchPostsRequest {
    names: string[]; // Array of user names to search for
    page?: number; // Page number (default: 1)
    limit?: number; // Posts per page (default: 10, max: 50)
}

export interface SearchPostsResponse {
    posts: PostWithUser[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface PostWithUser extends Post {
    user: {
        id: number;
        name: string;
    };
}
