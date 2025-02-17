export interface TokenPayload {
  id: number;
  email: string;
  roles: string[];
  exp: number;
}
