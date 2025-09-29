from flask import request
from pprint import pprint
from bson import ObjectId
from models.auth import Output
from flask_restful import Resource
from shared.models.common import Common
from datetime import datetime, timedelta
import traceback
from models.meal import Preferences
from helpers.recipesGenerator import Generator


class Meals(Resource):
    def post(self):
        try:
            data = request.get_json()
            prefs = Preferences(**data['preferences'])
            generator = Generator(prefs)
            recipe = generator.generate_recipes()
            pprint(recipe)

            return Output(**{
                'success': True,
                'data': recipe
            }).to_dict(), 200

        except Exception as e:
            traceback.print_exc()
            return Output(**{
                'success': False,
                'error': str(e)
            }).to_dict(), 500
