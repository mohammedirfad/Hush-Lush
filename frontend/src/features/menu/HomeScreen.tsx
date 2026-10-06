import {
  Building2,
  ChevronRight,
  CircleUserRound,
  Flame,
  Menu as MenuIcon,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Utensils,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "../../components/BrandLogo";
import { fetchMenu, type MenuItem } from "../../services/api";
import { useAuth } from "../auth/auth-context";

type CartLine = {
  item: MenuItem;
  quantity: number;
};

const promos = [
  {
    title: "UAE New Year Promo",
    subtitle: "From March 1 to April 1",
    chip: "Live Offer",
    image:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1400&q=85"
  },
  {
    title: "Weekend Biryani Feast",
    subtitle: "Free cooler with every family bucket",
    chip: "Live Offer",
    image:
      "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=1400&q=85"
  },
  {
    title: "Crispy Chicken Nights",
    subtitle: "Freshly fried, served hot at your table",
    chip: "Live Offer",
    image:
      "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=1400&q=85"
  }
];

type HomeScreenProps = {
  onNavigate: (screen: "menu" | "account") => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
};

export function HomeScreen({ onNavigate, showToast }: HomeScreenProps) {
  const { session } = useAuth();
  const [categories, setCategories] = useState<string[]>(["For You"]);
  const [activeCategory, setActiveCategory] = useState("For You");
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activePromo, setActivePromo] = useState(0);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  // Auto-advance promo banner
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePromo((c) => (c + 1) % promos.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  // Fetch all items once on mount
  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError("");

    fetchMenu("For You", "")
      .then((data) => {
        if (ignore) return;
        setCategories(data.categories);
        setAllItems(data.items);
      })
      .catch(() => {
        if (ignore) return;
        setError("Menu could not be loaded. Please refresh and try again.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, []);

  // Client-side filtering by category + search
  const filteredItems = useMemo(() => {
    let list = allItems;

    if (activeCategory !== "For You") {
      list = list.filter(
        (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          (item.badge?.toLowerCase().includes(term) ?? false)
      );
    }

    return list;
  }, [allItems, activeCategory, search]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((total, line) => total + line.quantity, 0),
    [cart]
  );

  function addToCart(item: MenuItem) {
    setCart((current) => ({
      ...current,
      [item.id]: {
        item,
        quantity: (current[item.id]?.quantity || 0) + 1
      }
    }));
    showToast(`${item.name} added to cart.`, "success");
  }

  function openSearch() {
    setSearchOpen(true);
    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 80);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchDraft("");
    setSearch("");
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSearch(searchDraft);
    // Scroll results into view after state update
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleCategoryClick(category: string) {
    setActiveCategory(category);
    setSearch("");
    setSearchDraft("");
    // Scroll to results
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  const promo = promos[activePromo];

  return (
    <main className="app-shell menu-page">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="menu-topbar">
        <BrandLogo compact />
        <div className="menu-topbar__title">
          <p>Table 13 (4 PAX)</p>
          <span>
            {session?.user.role === "guest" ? "Guest access" : `Hi, ${session?.user.name}`}
          </span>
        </div>
        <button
          aria-label="Search menu"
          className="icon-button topbar-search-btn"
          onClick={openSearch}
          type="button"
        >
          <Search size={22} />
        </button>
      </header>

      {/* ── Search panel ────────────────────────────────────────── */}
      {searchOpen && (
        <div className="search-panel">
          <form className="menu-search" onSubmit={handleSearchSubmit}>
            <Search size={18} aria-hidden="true" />
            <input
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Search chicken, fish, burger, fries..."
              ref={searchInputRef}
              value={searchDraft}
            />
            {searchDraft && (
              <button
                aria-label="Clear search"
                className="search-clear-btn"
                onClick={() => { setSearchDraft(""); setSearch(""); }}
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </form>
          <button
            aria-label="Close search"
            className="search-close-btn"
            onClick={closeSearch}
            type="button"
          >
            <X size={20} />
            <span>Close</span>
          </button>
        </div>
      )}

      {/* ── Promo hero ──────────────────────────────────────────── */}
      <section className="promo-hero" aria-label={promo.title}>
        <img alt={promo.title} key={promo.image} src={promo.image} />
        <div className="promo-hero__overlay">
          <span className="promo-chip">
            <Flame size={14} />
            {promo.chip}
          </span>
          <h1>{promo.title}</h1>
          <p>{promo.subtitle}</p>
          <div className="promo-dots" aria-label="Promo slides">
            {promos.map((item, index) => (
              <button
                aria-label={`Show ${item.title}`}
                className={index === activePromo ? "active" : ""}
                key={item.title}
                onClick={() => setActivePromo(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Category pills ──────────────────────────────────────── */}
      <section className="menu-controls">
        <div className="category-row" aria-label="Food categories">
          {categories.map((category) => (
            <button
              className={category === activeCategory ? "category-pill active" : "category-pill"}
              key={category}
              onClick={() => handleCategoryClick(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* ── Menu content ────────────────────────────────────────── */}
      <section className="menu-content" ref={resultsRef} aria-live="polite">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Restaurant Menu</span>
            <h2>{search ? `Results for "${search}"` : activeCategory}</h2>
          </div>
        </div>

        {isLoading && (
          <div className="menu-status">
            <div className="menu-status__spinner" aria-hidden="true" />
            <p>Loading menu…</p>
            <span>Fresh dishes are on the way.</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="menu-status menu-status--error">
            <div className="menu-status__icon" aria-hidden="true">⚠️</div>
            <p>{error}</p>
            <span>Check your connection and refresh.</span>
          </div>
        )}

        {!isLoading && !error && filteredItems.length === 0 && (
          <div className="menu-status menu-status--empty">
            <div className="menu-status__icon" aria-hidden="true">🍽️</div>
            <p>No dishes found</p>
            <span>
              {search
                ? `No results for "${search}". Try a different keyword.`
                : `No items in "${activeCategory}" yet.`}
            </span>
          </div>
        )}

        {!isLoading && !error && filteredItems.length > 0 && (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article className="dish-card" key={item.id}>
                <div className="dish-card__image">
                  <img alt={item.name} src={item.image} />
                  <button
                    aria-label={`Add ${item.name} to cart`}
                    onClick={() => addToCart(item)}
                    type="button"
                  >
                    <Plus size={22} />
                  </button>
                </div>
                <div className="dish-card__body">
                  <div className="dish-card__meta">
                    <span className="dish-card__rating">
                      <Star size={13} fill="currentColor" />
                      {item.rating}
                    </span>
                    {item.badge && <span className="dish-badge">{item.badge}</span>}
                  </div>
                  <h3>{item.name}</h3>
                  <div className="dish-card__footer">
                    <strong>${item.price.toFixed(2)}</strong>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── Cart FAB ────────────────────────────────────────────── */}
      <button className="cart-fab" aria-label={`${cartCount} items in cart`} type="button">
        <ShoppingCart size={26} />
        {cartCount > 0 && <span>{cartCount}</span>}
      </button>

      {/* ── Bottom navigation ───────────────────────────────────── */}
      <nav className="bottom-nav" aria-label="Primary navigation">
        <button type="button">
          <Building2 size={24} />
          <span>Outlet</span>
        </button>
        <button className="active" type="button">
          <Utensils size={24} />
          <span>Menu</span>
        </button>
        <button onClick={() => onNavigate("account")} type="button">
          <CircleUserRound size={24} />
          <span>Account</span>
        </button>
        <button type="button">
          <MenuIcon size={24} />
          <span>More</span>
        </button>
      </nav>

      <footer className="powered-by">
        <span>Powered By</span>
        <strong>Hush Lush</strong>
      </footer>
    </main>
  );
}
