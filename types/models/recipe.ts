import type { Category } from "./category";

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
  servings: number;
  prep_time: number;
  cook_time: number;
  image_url?: string;
  cloudinaryPublicId?: string;
  isPublic: boolean;
  userId: string;
  categoryId?: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
  category_id: string;
}
