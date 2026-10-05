import { ArrowLeft, BadgeCheck, Clock, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";
import { useAuth } from "../auth/auth-context";

type AccountScreenProps = {
  onNavigate: (screen: "menu" | "account") => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
};

export function AccountScreen({ onNavigate, showToast }: AccountScreenProps) {
  const { session, signOut } = useAuth();
  const expiry = session ? new Date(session.expiresAt * 1000).toLocaleString() : "";

  function handleSignOut() {
    signOut();
    showToast("Signed out successfully.", "success");
  }

  return (
    <main className="app-shell account-page">
      <header className="site-header">
        <button className="icon-button back-button" onClick={() => onNavigate("menu")} type="button">
          <ArrowLeft size={22} />
          <span>Menu</span>
        </button>
        <BrandLogo compact />
      </header>

      <section className="account-hero">
        <div className="account-avatar">
          <UserRound size={54} />
        </div>
        <div>
          <p className="eyebrow">Account</p>
          <h1>{session?.user.name}</h1>
          <span>{session?.user.role === "guest" ? "Guest dining session" : "Registered customer"}</span>
        </div>
      </section>

      <section className="account-grid">
        <article>
          <Mail size={24} />
          <span>Email</span>
          <strong>{session?.user.email}</strong>
        </article>
        <article>
          <ShieldCheck size={24} />
          <span>Session</span>
          <strong>JWT secured</strong>
        </article>
        <article>
          <Clock size={24} />
          <span>Valid Until</span>
          <strong>{expiry}</strong>
        </article>
        <article>
          <BadgeCheck size={24} />
          <span>Status</span>
          <strong>Active table order</strong>
        </article>
      </section>

      <section className="account-actions">
        <button className="primary-button" onClick={() => onNavigate("menu")} type="button">
          Continue Ordering
        </button>
        <button className="secondary-button" onClick={handleSignOut} type="button">
          <LogOut size={18} />
          Sign Out
        </button>
      </section>
    </main>
  );
}
