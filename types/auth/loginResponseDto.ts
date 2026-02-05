import type { User } from "../models/user";

export interface LoginResponseDto {
  access_token: string;
  user: User;
}
