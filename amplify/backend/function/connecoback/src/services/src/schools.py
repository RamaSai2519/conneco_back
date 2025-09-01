import traceback
from flask import request
from models.auth import Output
from flask_restful import Resource
from shared.db.schools import SchoolDatabase


class SchoolsService(Resource):
    def __init__(self):
        self.db = SchoolDatabase()

    def post(self):
        try:
            data = request.get_json()
            school_id = data.get("id")
            if school_id:
                # Update existing school
                self.db.update_school(school_id, **data)
            else:
                # Create new school
                self.db.create_school(**data)
            return Output(data="School created/updated successfully").to_dict(), 200
        except Exception as e:
            traceback.print_exc()
            return Output(**{
                'success': False,
                'error': str(e)
            }).to_dict(), 500

    def get(self):
        try:
            filters = request.args.to_dict()
            limit = request.args.get("limit", type=int)
            offset = request.args.get("offset", type=int)
            search_name = request.args.get("search_name")
            schools = self.db.get_schools(
                filters=filters if filters else None,
                limit=limit,
                offset=offset,
                search_name=search_name
            )
            return Output(data=schools).to_dict(), 200
        except Exception as e:
            traceback.print_exc()
            return Output(**{
                'success': False,
                'error': str(e)
            }).to_dict(), 500
