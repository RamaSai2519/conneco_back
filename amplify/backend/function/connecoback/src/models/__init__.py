"""
Type definitions initialization.
"""
from .auth import LoginRequest, SignupRequest, RefreshRequest, AuthTokens, User, LoginResponse, JWTPayload
from .post import CreatePostRequest, Post, CreatePostResponse, GetPostsResponse, SearchPostsRequest, PaginationInfo, PostWithUser, SearchPostsResponse, PostType

__all__ = [
    'LoginRequest', 'SignupRequest', 'RefreshRequest', 'AuthTokens', 'User', 'LoginResponse', 'JWTPayload',
    'CreatePostRequest', 'Post', 'CreatePostResponse', 'GetPostsResponse', 'SearchPostsRequest',
    'PaginationInfo', 'PostWithUser', 'SearchPostsResponse', 'PostType'
]
