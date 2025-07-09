from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from shared.db.users import get_posts_collection, get_user_by_id
from datetime import datetime
from bson import ObjectId


class PostCreateService(Resource):
    @jwt_required()
    def post(self):
        """Create a new post."""
        try:
            current_user_id = get_jwt_identity()
            user = get_user_by_id(current_user_id)

            if not user:
                return {'success': False, 'error': 'User not found'}, 404

            data = request.get_json()
            post_type = data.get('type')
            content = data.get('content')
            caption = data.get('caption')
            image_url = data.get('image_url')

            if not post_type:
                return {'success': False, 'error': 'Post type is required'}, 400

            # Create post data
            post_data = {
                'type': post_type,
                'content': content,
                'caption': caption,
                'user_id': current_user_id,
                'user_name': user['name'],
                'image_url': image_url,
                'date': datetime.utcnow().isoformat(),
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }

            # Insert post
            posts_collection = get_posts_collection()
            result = posts_collection.insert_one(post_data)
            created_post = posts_collection.find_one(
                {'_id': result.inserted_id})

            # Format response
            post_response = {
                'id': str(created_post['_id']),
                'type': created_post['type'],
                'content': created_post.get('content'),
                'caption': created_post.get('caption'),
                'user_id': str(created_post['user_id']),
                'user_name': created_post['user_name'],
                'image_url': created_post.get('image_url'),
                'date': created_post.get('date'),
                'created_at': created_post['created_at'],
                'updated_at': created_post.get('updated_at')
            }

            return {
                'success': True,
                'data': post_response
            }, 201

        except Exception as e:
            return {'success': False, 'error': str(e)}, 500


class PostUserPostsService(Resource):
    @jwt_required()
    def get(self):
        """Get posts by user ID."""
        try:
            current_user_id = get_jwt_identity()

            # Get posts
            posts_collection = get_posts_collection()
            posts_cursor = posts_collection.find(
                {'user_id': current_user_id}
            ).sort('created_at', -1)

            posts = []
            for post in posts_cursor:
                posts.append({
                    'id': str(post['_id']),
                    'type': post['type'],
                    'content': post.get('content'),
                    'caption': post.get('caption'),
                    'user_id': str(post['user_id']),
                    'user_name': post['user_name'],
                    'image_url': post.get('image_url'),
                    'date': post.get('date'),
                    'created_at': post['created_at'],
                    'updated_at': post.get('updated_at')
                })

            return {
                'success': True,
                'data': posts
            }, 200

        except Exception as e:
            return {'success': False, 'error': str(e)}, 500


class PostSearchService(Resource):
    @jwt_required()
    def post(self):
        """Search posts by user names."""
        try:
            data = request.get_json()
            names = data.get('names', [])
            page = data.get('page', 1)
            limit = data.get('limit', 10)

            if not names:
                return {'success': False, 'error': 'Names are required'}, 400

            # Calculate offset
            offset = (page - 1) * limit

            # Get posts
            posts_collection = get_posts_collection()

            # Get total count
            total_count = posts_collection.count_documents(
                {'user_name': {'$in': names}}
            )

            # Get posts with pagination
            posts_cursor = posts_collection.find(
                {'user_name': {'$in': names}}
            ).sort('created_at', -1).skip(offset).limit(limit)

            posts = []
            for post in posts_cursor:
                posts.append({
                    'id': str(post['_id']),
                    'type': post['type'],
                    'content': post.get('content'),
                    'caption': post.get('caption'),
                    'user_id': str(post['user_id']),
                    'user_name': post['user_name'],
                    'image_url': post.get('image_url'),
                    'date': post.get('date'),
                    'created_at': post['created_at'],
                    'updated_at': post.get('updated_at')
                })

            return {
                'success': True,
                'data': {
                    'posts': posts,
                    'total_count': total_count,
                    'page': page,
                    'limit': limit
                }
            }, 200

        except Exception as e:
            return {'success': False, 'error': str(e)}, 500
