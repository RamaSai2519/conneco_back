from dataclasses import dataclass


@dataclass
class Preferences:
    cookingTime: str
    dietaryRestrictions: list
    duration: int
    goal: str
    mealTypes: list
    servings: int
    skillLevel: str
