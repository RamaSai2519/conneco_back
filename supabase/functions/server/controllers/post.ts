// controllers/post.ts
import { ResponseUtil } from "../utils/response.ts";
import { HTTP_STATUS } from "../constants/index.ts";
import { supabaseService } from "../services/supabase.ts";
import type { CreatePostRequest, CreatePostResponse, GetPostsResponse, SearchPostsRequest, SearchPostsResponse, PostWithUser } from "../types/post.ts";
import type { AuthContext } from "../middleware/auth.ts";

export class PostController {
    static async createPost(req: Request, authContext: AuthContext): Promise<Response> {
        try {
            const body: CreatePostRequest = await req.json();
            console.log("🚀 ~ PostController ~ createPost ~ body:", body);

            // Validate that at least one of text or image_url is provided
            if ((!body.text || body.text.trim() === '') && (!body.image_url || body.image_url.trim() === '')) {
                return ResponseUtil.error("At least one of text or image_url is required", HTTP_STATUS.BAD_REQUEST);
            }

            const user = authContext.user;

            // Create the post with only provided fields
            const postData: Partial<CreatePostRequest> & { user_id: number } = {
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

    static async getUserPosts(_req: Request, authContext: AuthContext): Promise<Response> {
        try {
            const user = authContext.user;

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

    static async searchPostsByNames(req: Request, _authContext: AuthContext): Promise<Response> {
        try {
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
                .select('*, users!inner(*)', { count: 'exact', head: true })
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
            interface PostWithUserData {
                id: number;
                user_id: number;
                text: string;
                image_url: string;
                date: string | null;
                created_at: string;
                users: {
                    id: number;
                    name: string;
                }[];
            }

            const posts: PostWithUser[] = (postsWithUsers || []).map((post: PostWithUserData) => ({
                id: post.id,
                user_id: post.user_id,
                text: post.text,
                image_url: post.image_url,
                date: post.date,
                created_at: post.created_at,
                user: {
                    id: post.users[0].id,
                    name: post.users[0].name
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
