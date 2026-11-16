export interface Ingredient {
  name: string;
  amount?: string;
  unit?: string;
  notes?: string;
}

export interface Nutrition {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  cuisine?: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: Nutrition;
  source_url?: string;
  source_name?: string;
  is_clone_recipe: boolean;
  secret_hacks: string[];
}

export interface FeedResponse {
  items: Recipe[];
  total: number;
  page: number;
  has_more: boolean;
}

