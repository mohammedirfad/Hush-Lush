import { useMemo, useState } from "react";
import { ToastStack, type ToastMessage } from "./components/Toast";
import { AccountScreen } from "./features/account/AccountScreen";
import { HomeScreen } from "./features/menu/HomeScreen";
import { LoginScreen } from "./features/auth/LoginScreen";
import { AuthContext, type AuthSession } from "./features/auth/auth-context";

type Screen = "menu" | "account";

export function App() {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const saved = window.localStorage.getItem("hush-lush-session");
    if (!saved) return null;

    const parsed = JSON.parse(saved) as AuthSession;
    if (parsed.expiresAt * 1000 < Date.now()) {
      window.localStorage.removeItem("hush-lush-session");
      return null;
    }

    return parsed;
  });
  const [screen, setScreen] = useState<Screen>("menu");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function showToast(message: string, type: ToastMessage["type"] = "info") {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }

  const authValue = useMemo(
    () => ({
      session,
      signIn(nextSession: AuthSession) {
        window.localStorage.setItem("hush-lush-session", JSON.stringify(nextSession));
        setSession(nextSession);
        setScreen("menu");
      },
      signOut() {
        window.localStorage.removeItem("hush-lush-session");
        setSession(null);
        setScreen("menu");
      }
    }),
    [session]
  );

  return (
    <AuthContext.Provider value={authValue}>
      {session ? (
        screen === "account" ? (
          <AccountScreen onNavigate={setScreen} showToast={showToast} />
        ) : (
          <HomeScreen onNavigate={setScreen} showToast={showToast} />
        )
      ) : (
        <LoginScreen showToast={showToast} />
      )}
      <ToastStack
        toasts={toasts}
        onClose={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))}
      />
    </AuthContext.Provider>
  );
}
