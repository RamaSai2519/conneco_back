from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from shared.db.users import get_user_by_password, create_user, get_user_by_id


class AuthLoginService(Resource):
    def post(self):
        """User login endpoint."""
        try:
            data = request.get_json()
            password = data.get('password')

            if not password:
                return {'success': False, 'error': 'Password is required'}, 400

            # Get user by password
            user = get_user_by_password(password)

            if not user:
                return {'success': False, 'error': 'Invalid credentials'}, 401

            # Create tokens
            access_token = create_access_token(identity=user['_id'])
            refresh_token = create_refresh_token(identity=user['_id'])

            return {
                'success': True,
                'data': {
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                    'user': {
                        'id': str(user['_id']),
                        'name': user['name'],
                        'created_at': user.get('created_at')
                    }
                }
            }, 200

        except Exception as e:
            return {'success': False, 'error': str(e)}, 500


class AuthSignupService(Resource):
    def post(self):
        """User signup endpoint."""
        try:
            data = request.get_json()
            name = data.get('name')
            password = data.get('password')

            if not name or not password:
                return {'success': False, 'error': 'Name and password are required'}, 400

            # Create user
            user = create_user(name, password)

            # Create tokens
            access_token = create_access_token(identity=user['_id'])
            refresh_token = create_refresh_token(identity=user['_id'])

            return {
                'success': True,
                'data': {
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                    'user': {
                        'id': str(user['_id']),
                        'name': user['name'],
                        'created_at': user.get('created_at')
                    }
                }
            }, 201

        except Exception as e:
            return {'success': False, 'error': str(e)}, 500


class AuthRefreshService(Resource):
    @jwt_required(refresh=True)
    def post(self):
        """Refresh access token."""
        try:
            current_user_id = get_jwt_identity()
            user = get_user_by_id(current_user_id)

            if not user:
                return {'success': False, 'error': 'User not found'}, 404

            # Create new access token
            access_token = create_access_token(identity=current_user_id)

            return {
                'success': True,
                'data': {
                    'access_token': access_token
                }
            }, 200

        except Exception as e:
            return {'success': False, 'error': str(e)}, 500
