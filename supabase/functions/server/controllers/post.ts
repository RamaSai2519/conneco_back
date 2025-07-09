// controllers/post.ts
import { ResponseUtil } from "../utils/response.ts";
import { HTTP_STATUS } from "../constants/index.ts";
import { supabaseService } from "../services/supabase.ts";
import { verifyToken, extractTokenFromHeader } from "../utils/auth.ts";
import type { CreatePostRequest, CreatePostResponse, GetPostsResponse, Post, SearchPostsRequest, SearchPostsResponse, PostWithUser } from "../types/post.ts";
import type { User } from "../types/auth.ts";

export class PostController {
    static async createPost(req: Request): Promise<Response> {
        try {
            const body: CreatePostRequest = await req.json();
            console.log("🚀 ~ PostController ~ createPost ~ body:", body);

            // Validate that at least one of text or image_url is provided
            if ((!body.text || body.text.trim() === '') && (!body.image_url || body.image_url.trim() === '')) {
                return ResponseUtil.error("At least one of text or image_url is required", HTTP_STATUS.BAD_REQUEST);
            }

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

            // Create the post with only provided fields
            const postData: any = {
                user_id: user.id
            };

            if (body.text && body.text.trim() !== '') {
                postData.text = body.text.trim();
            }

            if (body.image_url && body.image_url.trim() !== '') {
                postData.image_url = body.image_url.trim();
            }

            if (body.date && body.date.trim() !== '') {
                postData.date = body.date.trim();
            }

            const { data: newPost, error: insertError } = await supabaseService.database
                .from('posts')
                .insert(postData)
                .select('*')
                .single();

            if (insertError) {
                console.error("Database insert error:", insertError);
                return ResponseUtil.error("Failed to create post", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            if (!newPost) {
                console.error("No post data returned from insert");
                return ResponseUtil.error("Failed to create post", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            const response: CreatePostResponse = {
                post: newPost
            };

            return ResponseUtil.success(response, HTTP_STATUS.CREATED);
        } catch (error) {
            console.error("Create post error:", error);
            return ResponseUtil.error("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    static async getUserPosts(req: Request): Promise<Response> {
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

            // Get user's posts
            const { data: posts, error: postsError } = await supabaseService.database
                .from('posts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (postsError) {
                console.error("Database error while fetching posts:", postsError);
                return ResponseUtil.error("Database error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            const response: GetPostsResponse = {
                posts: posts || []
            };

            return ResponseUtil.success(response);
        } catch (error) {
            console.error("Get posts error:", error);
            return ResponseUtil.error("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    static async searchPostsByNames(req: Request): Promise<Response> {
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

            // Verify user still exists (for token validation)
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

            const body: SearchPostsRequest = await req.json();
            console.log("🚀 ~ PostController ~ searchPostsByNames ~ body:", body);

            // Validate request
            if (!body.names || !Array.isArray(body.names) || body.names.length === 0) {
                return ResponseUtil.error("Names array is required and must not be empty", HTTP_STATUS.BAD_REQUEST);
            }

            // Sanitize and validate pagination parameters
            const page = Math.max(1, body.page || 1);
            const limit = Math.min(50, Math.max(1, body.limit || 10)); // Max 50 posts per page
            const offset = (page - 1) * limit;

            // Filter out empty names and trim whitespace
            const cleanNames = body.names
                .filter(name => name && typeof name === 'string' && name.trim() !== '')
                .map(name => name.trim());

            if (cleanNames.length === 0) {
                return ResponseUtil.error("At least one valid name is required", HTTP_STATUS.BAD_REQUEST);
            }

            console.log("Searching for users with names:", cleanNames);

            // First, get the total count for pagination
            const { count: totalCount, error: countError } = await supabaseService.database
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .inner('users', 'posts.user_id', 'users.id')
                .in('users.name', cleanNames);

            if (countError) {
                console.error("Database error while counting posts:", countError);
                return ResponseUtil.error("Database error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            // Get posts with user information using a join
            const { data: postsWithUsers, error: postsError } = await supabaseService.database
                .from('posts')
                .select(`
                    id,
                    user_id,
                    text,
                    image_url,
                    date,
                    created_at,
                    users!inner(
                        id,
                        name
                    )
                `)
                .in('users.name', cleanNames)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (postsError) {
                console.error("Database error while fetching posts:", postsError);
                return ResponseUtil.error("Database error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            // Transform the data to match our expected format
            const posts: PostWithUser[] = (postsWithUsers || []).map(post => ({
                id: post.id,
                user_id: post.user_id,
                text: post.text,
                image_url: post.image_url,
                date: post.date,
                created_at: post.created_at,
                user: {
                    id: post.users.id,
                    name: post.users.name
                }
            }));

            const total = totalCount || 0;
            const totalPages = Math.ceil(total / limit);

            const response: SearchPostsResponse = {
                posts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };

            return ResponseUtil.success(response);
        } catch (error) {
            console.error("Search posts error:", error);
            return ResponseUtil.error("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}
