import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { BrandLogo } from "../../components/BrandLogo";
import { ApiError, loginAsGuest, loginUser } from "../../services/api";
import { useAuth } from "./auth-context";
import { validateLogin, type LoginFormErrors } from "./validation";

type LoginScreenProps = {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
};

export function LoginScreen({ showToast }: LoginScreenProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateLogin({ email, password });
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const session = await loginUser(email, password);
      signIn(session);
      showToast("Welcome back. Your table menu is ready.", "success");
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        setErrors(error.errors || {});
        showToast(error.message, "error");
      } else {
        setSubmitError("Unable to sign in right now. Please try again.");
        showToast("Unable to sign in right now.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuestAccess() {
    setSubmitError("");
    setGuestLoading(true);
    try {
      const session = await loginAsGuest();
      signIn(session);
      showToast("Guest session started.", "success");
    } catch {
      setSubmitError("Guest access is temporarily unavailable.");
      showToast("Guest access is temporarily unavailable.", "error");
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <main className="app-shell login-page">
      <div className="status-bar" aria-hidden="true">
        <span>9:41</span>
        <span>LTE WiFi 100%</span>
      </div>

      <section className="login-page__intro">
        <BrandLogo />
        <p>Warely Pass grants access to log in at any of our partnered restaurants.</p>
      </section>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Email</span>
          <input
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Mail ID"
            type="email"
            value={email}
          />
          {errors.email && <small>{errors.email}</small>}
        </label>

        <label className="field">
          <span>Password</span>
          <div className="password-control">
            <input
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff size={26} /> : <Eye size={26} />}
            </button>
          </div>
          {errors.password && <small>{errors.password}</small>}
        </label>

        <button className="email-mode" type="button">
          Use Email-ID Instead
        </button>

        <div className="login-separator">Or</div>

        <div className="social-row" aria-label="Social sign in options">
          {/* Facebook */}
          <button className="social-button social-button--facebook" aria-label="Continue with Facebook" type="button">
            <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#1877F2"/>
              <path d="M22 16h-4v-2c0-.9.4-1.5 1.8-1.5H22V9.1A22 22 0 0 0 19.4 9c-2.7 0-4.4 1.6-4.4 4.6V16h-3v3.5h3V32h4V19.5h2.7L22 16Z" fill="#fff"/>
            </svg>
          </button>

          {/* Telegram */}
          <button className="social-button social-button--telegram" aria-label="Continue with Telegram" type="button">
            <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#29A8E8"/>
              <path d="M6.5 15.6 24.8 8.5c.8-.3 1.6.2 1.3 1.4l-2.9 13.7c-.2 1-.9 1.2-1.8.8l-4.8-3.5-2.3 2.2c-.3.2-.5.4-1 .4l.4-4.9 9.6-8.7c.4-.4-.1-.6-.6-.2L9.2 17.9l-4.7-1.5c-1-.3-1-.9 2-2.8Z" fill="#fff"/>
            </svg>
          </button>

          {/* Google */}
          <button className="social-button social-button--google" aria-label="Continue with Google" type="button">
            <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#fff"/>
              <path d="M28.6 16.3c0-.9-.1-1.8-.2-2.6H16v5h7.1a6 6 0 0 1-2.6 4v3.3h4.2c2.5-2.3 3.9-5.6 3.9-9.7Z" fill="#4285F4"/>
              <path d="M16 29c3.6 0 6.6-1.2 8.7-3.2l-4.2-3.3c-1.2.8-2.7 1.3-4.5 1.3-3.4 0-6.3-2.3-7.4-5.4H4.3v3.4A13 13 0 0 0 16 29Z" fill="#34A853"/>
              <path d="M8.6 18.4A7.8 7.8 0 0 1 8.2 16c0-.8.1-1.6.4-2.4V10.2H4.3A13 13 0 0 0 3 16c0 2.1.5 4.1 1.3 5.8l4.3-3.4Z" fill="#FBBC05"/>
              <path d="M16 8.3c2 0 3.7.7 5.1 2l3.8-3.8C22.6 4.2 19.6 3 16 3A13 13 0 0 0 4.3 10.2l4.3 3.4C9.7 10.6 12.6 8.3 16 8.3Z" fill="#EA4335"/>
            </svg>
          </button>
        </div>

        <p className="terms-copy">
          By ordering, you agree to our <a href="#">Terms of Use</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>

        {submitError && <div className="form-alert">{submitError}</div>}

        <button className="primary-button" disabled={isLoading || guestLoading} type="submit">
          {isLoading ? "Signing in..." : "Submit"}
        </button>

        <button
          className="guest-button"
          disabled={isLoading || guestLoading}
          onClick={handleGuestAccess}
          type="button"
        >
          {guestLoading ? "Opening menu..." : "Sign as Guest"}
        </button>
      </form>

      <footer className="powered-by">
        <span>Powered By</span>
        <strong>Hush Lush</strong>
      </footer>
    </main>
  );
}
