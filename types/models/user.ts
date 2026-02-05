import type { Profile } from "./profile";
import type { Recipe } from "./recipe";
import type { Category } from "./category";

export interface User {
  id: string;
  email: string;
  isEmailVerified: boolean;
  stripeCustomerId?: string;
  isPremium: boolean;
  profile?: Profile;
  recipes?: Recipe[];
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
}
