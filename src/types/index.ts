


export type UserWithoutPassword = {
  id: number;
  email: string;
  userName: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
export type User={
  sub:number;
  iat: number;
}
export type MessageRecovery = {
  from: string;
  to: string;
  subject: string;
  html: string;
};
export type MessageUnauthorized = {
  statusCode: number;
  message: string;
  error:string;
}