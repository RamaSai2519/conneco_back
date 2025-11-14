from dataclasses import dataclass


@dataclass
class Preferences:
    goal: str
    servings: int
    duration: int
    mealTypes: list
    groceries: list
    skillLevel: str
    cookingTime: str
    dietaryRestrictions: list
