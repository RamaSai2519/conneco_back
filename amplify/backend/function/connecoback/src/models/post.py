"""
Type definitions for post-related data structures.
"""
from typing import Dict, Any, Optional, List, TypedDict, Literal
from dataclasses import dataclass

PostType = Literal['text', 'image', 'mixed']


class CreatePostRequest(TypedDict, total=False):
    """Create post request payload."""
    type: PostType
    content: Optional[str]
    caption: Optional[str]
    image_url: Optional[str]
    date: Optional[str]


@dataclass
class Post:
    """Post data structure."""
    id: str
    type: PostType
    content: Optional[str]
    caption: Optional[str]
    user_id: str
    user_name: str
    image_url: Optional[str]
    date: Optional[str]
    created_at: str
    updated_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert post to dictionary."""
        return {
            'id': self.id,
            'type': self.type,
            'content': self.content,
            'caption': self.caption,
            'user_id': self.user_id,
            'user_name': self.user_name,
            'image_url': self.image_url,
            'date': self.date,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


@dataclass
class CreatePostResponse:
    """Create post response payload."""
    post: Post

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'post': self.post.to_dict()
        }


@dataclass
class GetPostsResponse:
    """Get posts response payload."""
    posts: List[Post]

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'posts': [post.to_dict() for post in self.posts]
        }


class SearchPostsRequest(TypedDict, total=False):
    """Search posts request payload."""
    names: List[str]
    page: Optional[int]
    limit: Optional[int]


@dataclass
class PaginationInfo:
    """Pagination information."""
    page: int
    limit: int
    total: int
    total_pages: int
    has_next: bool
    has_prev: bool

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'page': self.page,
            'limit': self.limit,
            'total': self.total,
            'totalPages': self.total_pages,
            'hasNext': self.has_next,
            'hasPrev': self.has_prev
        }


@dataclass
class PostWithUser:
    """Post with user information."""
    post: Post
    user: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        post_dict = self.post.to_dict()
        post_dict['user'] = self.user
        return post_dict


@dataclass
class SearchPostsResponse:
    """Search posts response payload."""
    posts: List[PostWithUser]
    pagination: PaginationInfo

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'posts': [post.to_dict() for post in self.posts],
            'pagination': self.pagination.to_dict()
        }
