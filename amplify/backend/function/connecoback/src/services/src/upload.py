import json
import boto3
from flask import request
from models.auth import Output
from flask_restful import Resource
from shared.configs import CONFIG as config
from flask_jwt_extended import jwt_required


class UploadService(Resource):
    @jwt_required()
    def post(self):
        """Generate a presigned URL for file upload."""
        try:
            input = json.loads(request.get_data())
            filename = input.get('filename')
            filetype = input.get('filetype')
            if not filename or not filetype:
                return Output(**{
                    'success': False,
                    'error': 'Filename and filetype are required'
                }).to_dict(), 400

            s3_client = boto3.client(
                's3', region_name=config.REGION,
                aws_access_key_id=config.ACCESS_KEY,
                aws_secret_access_key=config.SECRET_ACCESS_KEY
            )
            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={'Bucket': 'conneco', 'Key': filename,
                        'ContentType': filetype},
                ExpiresIn=3600
            )

            return Output(**{
                'success': True,
                'data': {
                    'url': presigned_url,
                    'filename': filename,
                    'filetype': filetype
                }
            }).to_dict(), 200

        except Exception as e:
            return Output(**{
                'success': False,
                'error': str(e)
            }).to_dict(), 500
