from typing import List, Optional
from pydantic import BaseModel, Field

class Ingredient(BaseModel):
    name: str
    amount: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None

class Nutrition(BaseModel):
    calories: Optional[str] = None
    protein: Optional[str] = None
    carbs: Optional[str] = None
    fat: Optional[str] = None

class Recipe(BaseModel):
    id: str
    title: str
    description: str
    image_url: str
    prep_time_minutes: Optional[int] = 15
    cook_time_minutes: Optional[int] = 30
    total_time_minutes: Optional[int] = 45
    servings: int = 4
    difficulty: str = "Medium"  # Easy, Medium, Advanced
    cuisine: Optional[str] = "Global"
    tags: List[str] = Field(default_factory=list)
    ingredients: List[Ingredient] = Field(default_factory=list)
    instructions: List[str] = Field(default_factory=list)
    nutrition: Optional[Nutrition] = None
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    is_clone_recipe: bool = False
    secret_hacks: List[str] = Field(default_factory=list)

class FeedResponse(BaseModel):
    items: List[Recipe]
    total: int
    page: int
    has_more: bool

class SearchRequest(BaseModel):
    query: str
    dietary_preferences: Optional[List[str]] = Field(default_factory=list)
    include_ingredients: Optional[List[str]] = Field(default_factory=list)
    exclude_ingredients: Optional[List[str]] = Field(default_factory=list)
    page: int = 1
    page_size: int = 20

