'use server'

import { signIn } from "../auth"

export async function SignIn(email: string, password: string) {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    return result;
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: "Authentication failed" };
  }
}