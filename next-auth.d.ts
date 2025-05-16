import { ExtendedUser } from './next-auth.d';
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: string;
  phoneNumber: string;
  access_token: string;
};



declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
  interface User{
    id: string;
    role: string;
    phoneNumber: string;
    access_token: string;
  }
}