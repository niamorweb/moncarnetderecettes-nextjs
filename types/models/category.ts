import type { Recipe } from "./recipe";

export interface Category {
  id: string;
  name: string;
  userId: string;
  recipes?: Recipe[];
  createdAt: string;
  updatedAt: string;
}
