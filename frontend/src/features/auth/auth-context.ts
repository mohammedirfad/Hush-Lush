import { createContext, useContext } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "guest";
};

export type AuthSession = {
  token: string;
  expiresAt: number;
  user: AuthUser;
};

type AuthContextValue = {
  session: AuthSession | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthContext.Provider");
  }

  return context;
}
