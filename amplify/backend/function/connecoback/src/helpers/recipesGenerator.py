from models.meal import Preferences
from shared.helpers.openai import OSS_Client
from shared.models.constants import nutribot_system_prompt


class Generator:
    def __init__(self, prefs: Preferences):
        self.prefs = prefs
        self.oss_client = OSS_Client().client

    def generate_recipes(self) -> str | None:
        prefs = str(self.prefs.__dict__)
        # completion = self.oss_client.chat.completions.create(
        #     extra_body={},
        #     model="meituan/longcat-flash-chat:free",
        #     messages=[
        #         {
        #             "role": "system",
        #             "content": nutribot_system_prompt,
        #         },
        #         {
        #             "role": "user",
        #             "content": "Generate 5 recipes based on these preferences: " + prefs,
        #         }
        #     ],
        #     response_format={
        #         "type": "json_schema",
        #         "json_schema": {
        #             "name": "recipes",
        #             "schema": {
        #                 "type": "array",
        #                 "items": {
        #                     "type": "object",
        #                     "properties": {
        #                         "title": {"type": "string", "description": "The title of the recipe"},
        #                         "ingredients": {
        #                             "type": "array",
        #                             "items": {"type": "string"},
        #                             "description": "A list of ingredients needed for the recipe",
        #                         },
        #                         "cook_time": {"type": "string", "description": "The total cook time"},
        #                         "instructions": {
        #                             "type": "array",
        #                             "items": {"type": "string"},
        #                             "description": "Step-by-step instructions for preparing the recipe",
        #                         },
        #                         "servings": {"type": "integer", "description": "The number of servings the recipe makes"},
        #                         "nutritional_info": {
        #                             "type": "object",
        #                             "properties": {
        #                                 "calories": {"type": "integer", "description": "The number of calories per serving"},
        #                                 "protein": {"type": "integer", "description": "The amount of protein per serving (in grams)"},
        #                                 "fat": {"type": "integer", "description": "The amount of fat per serving (in grams)"},
        #                                 "carbohydrates": {"type": "integer", "description": "The amount of carbohydrates per serving (in grams)"}
        #                             }
        #                         },
        #                         "meal_type": {"type": "string", "description": "The type of meal (e.g., breakfast, lunch, dinner, snack)"},
        #                         "cuisine": {"type": "string", "description": "The cuisine type (e.g., Italian, Chinese, Mexican)"},
        #                         "dietary_considerations": {"type": "array", "items": {"type": "string"}, "description": "Any dietary considerations (e.g., vegan, gluten-free)"}
        #                     }
        #                 }
        #             }
        #         }
        #     }
        # )
        # print(completion.choices[0].message.content)
        # return completion.choices[0].message.content
        return """
{
    "title": "Quick Vegan Chickpea Curry",
    "description": "A simple and flavorful chickpea curry perfect for a quick weeknight meal. It's packed with protein and vegetables, and naturally vegan and dairy-free.",
    "ingredients": [
        {
            "name": "Chickpeas",
            "quantity": "1 (15-ounce) can"
        },
        {
            "name": "Diced Tomatoes",
            "quantity": "1 (14.5-ounce) can"
        },
        {
            "name": "Coconut Milk",
            "quantity": "1/2 cup"
        },
        {
            "name": "Onion",
            "quantity": "1 medium, chopped"
        },
        {
            "name": "Garlic",
            "quantity": "2 cloves, minced"
        },
        {
            "name": "Ginger",
            "quantity": "1 tsp, grated"
        },
        {
            "name": "Curry Powder",
            "quantity": "1 tbsp"
        },
        {
            "name": "Spinach",
            "quantity": "5 oz"
        }
    ],
    "instructions": [
        "Heat a tablespoon of oil in a large pan over medium heat.",
        "Add the chopped onion and cook until softened, about 5 minutes.",
        "Add the minced garlic and grated ginger and cook for another minute.",
        "Stir in the curry powder and cook for 30 seconds.",
        "Add the diced tomatoes and chickpeas and bring to a simmer.",
        "Pour in the coconut milk and stir to combine.",
        "Let the curry simmer for 10-15 minutes to allow the flavors to meld.",
        "Stir in the spinach and cook until wilted, about 2-3 minutes.",
        "Season with salt and pepper to taste.",
        "Serve hot with rice or naan bread."
    ]
}
        """


if __name__ == "__main__":
    prefs = Preferences(
        cookingTime="30 minutes",
        dietaryRestrictions=["vegetarian", "gluten-free"],
        duration=7,
        goal="weight loss",
        mealTypes=["breakfast", "lunch", "dinner"],
        servings=2,
        skillLevel="beginner"
    )
    generator = Generator(prefs)
    recipe = generator.generate_recipes()
    print(recipe)
