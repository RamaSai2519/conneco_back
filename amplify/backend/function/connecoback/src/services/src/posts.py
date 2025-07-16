from flask import request
from bson import ObjectId
from models.auth import Output
from flask_restful import Resource
from shared.models.common import Common
from flask_jwt_extended import jwt_required, get_jwt_identity
from shared.db.users import get_posts_collection, get_user_by_id
from datetime import datetime, timedelta


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
            date = data.get('date')
            ist_dt = datetime.strptime(date, "%Y-%m-%dT%H:%M")
            utc_dt = ist_dt - timedelta(hours=5, minutes=30)
            date = utc_dt
            

            if not post_type:
                return {'success': False, 'error': 'Post type is required'}, 400

            post_data = {
                'date': date,
                'type': post_type,
                'content': content,
                'caption': caption,
                'image_url': image_url,
                'user_name': user['name'],
                'user_id': ObjectId(current_user_id),
                'created_at': Common.get_current_utc_time(),
                'updated_at': Common.get_current_utc_time()
            }

            # Insert post
            posts_collection = get_posts_collection()
            result = posts_collection.insert_one(post_data)
            created_post = posts_collection.find_one(
                {'_id': result.inserted_id})

            # Format response
            post_response = Common.jsonify(created_post)

            return Output(**{
                'success': True,
                'data': post_response
            }).to_dict(), 201

        except Exception as e:
            return Output(**{
                'success': False,
                'error': str(e)
            }).to_dict(), 500


class PostUserPostsService(Resource):
    @jwt_required()
    def get(self):
        """Get posts by user ID."""
        try:
            current_user_id = get_jwt_identity()
            user = get_user_by_id(current_user_id)
            partner_id = None
            if 'partner' in user:
                partner_id = user['partner']

            posts_collection = get_posts_collection()
            query = {'$or': [
                {'user_id': ObjectId(current_user_id)},
                {'user_id': ObjectId(partner_id)}
            ]}
            sort_field = request.args.get('sort', 'date')
            sort_order = request.args.get('order', 'desc')
            sort_order = -1 if sort_order == 'desc' else 1
            posts_cursor = posts_collection.find(query)
            posts_cursor = posts_cursor.sort(sort_field, sort_order)
            page = 1
            limit = 10
            if 'page' and 'limit' in request.args:
                try:
                    page = int(request.args['page'])
                    limit = int(request.args['limit'])
                except:
                    pass
            posts_cursor = Common.paginate_cursor(posts_cursor, page, limit)
            posts = Common.jsonify(list(posts_cursor))
            total = posts_collection.count_documents(query)
            return Output(**{
                'data': {
                    'posts': posts,
                    'total': total,
                    'page': page,
                    'limit': limit
                }
            }).to_dict(), 200

        except Exception as e:
            return Output(**{
                'success': False,
                'error': str(e)
            }).to_dict(), 500


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
