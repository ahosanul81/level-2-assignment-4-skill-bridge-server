export declare global {
  interface IJwtPayload {
    email: string;
    role: string;
    iat: number;
    exp: number;
  }
}
