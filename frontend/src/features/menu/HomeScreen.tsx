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
  Utensils
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "../../components/BrandLogo";
import { StatusView } from "../../components/StatusView";
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
    image:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1400&q=85"
  },
  {
    title: "Weekend Biryani Feast",
    subtitle: "Free cooler with every family bucket",
    image:
      "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=1400&q=85"
  },
  {
    title: "Crispy Chicken Nights",
    subtitle: "Freshly fried, served hot at your table",
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [activePromo, setActivePromo] = useState(0);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePromo((current) => (current + 1) % promos.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError("");

    fetchMenu(activeCategory, search)
      .then((data) => {
        if (ignore) return;
        setCategories(data.categories);
        setItems(data.items);
      })
      .catch(() => {
        if (ignore) return;
        setError("Menu could not be loaded. Please refresh and try again.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [activeCategory, search]);

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

  function toggleSearch() {
    setSearchOpen((current) => !current);
    window.setTimeout(() => searchRef.current?.focus(), 80);
  }

  const promo = promos[activePromo];

  return (
    <main className="app-shell menu-page">
      <header className="menu-topbar site-header">
        <BrandLogo compact />
        <div>
          <p>Table 13 (4 PAX)</p>
          <span>{session?.user.role === "guest" ? "Guest access" : `Hi, ${session?.user.name}`}</span>
        </div>
        <button aria-label="Search menu" className="icon-button" onClick={toggleSearch} type="button">
          <Search size={31} />
        </button>
      </header>

      {searchOpen && (
        <section className="search-panel">
          <label className="menu-search">
            <Search size={18} />
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search chicken, fish, burger, fries..."
              ref={searchRef}
              value={search}
            />
          </label>
        </section>
      )}

      <section className="promo-hero" aria-label={promo.title}>
        <img alt={promo.title} key={promo.image} src={promo.image} />
        <div className="promo-hero__overlay">
          <span className="promo-chip">
            <Flame size={16} />
            Live Offer
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

      <section className="menu-controls">
        <div className="category-row" aria-label="Food categories">
          {categories.map((category) => (
            <button
              className={category === activeCategory ? "category-pill active" : "category-pill"}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="menu-content" aria-live="polite">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Restaurant Menu</span>
            <h2>{search ? `Results for "${search}"` : activeCategory}</h2>
          </div>
        </div>

        {isLoading && <StatusView title="Loading menu..." description="Fresh dishes are on the way." />}
        {error && <StatusView title={error} />}
        {!isLoading && !error && items.length === 0 && (
          <StatusView title="No dishes found" description="Try another category or search term." />
        )}
        {!isLoading && !error && items.length > 0 && (
          <div className="menu-grid">
            {items.map((item) => (
              <article className="dish-card" key={item.id}>
                <div className="dish-card__image">
                  <img alt={item.name} src={item.image} />
                  <button
                    aria-label={`Add ${item.name} to cart`}
                    onClick={() => addToCart(item)}
                    type="button"
                  >
                    <Plus size={31} />
                  </button>
                </div>
                <div className="dish-card__body">
                  <div className="dish-card__meta">
                    <span className="dish-card__rating">
                      <Star size={14} fill="currentColor" />
                      {item.rating}
                    </span>
                    {item.badge && <span className="dish-badge">{item.badge}</span>}
                  </div>
                  <h3>{item.name}</h3>
                  <div className="dish-card__footer">
                    <strong>${item.price.toFixed(2)}</strong>
                    <ChevronRight size={24} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <button className="cart-fab" aria-label={`${cartCount} items in cart`} type="button">
        <ShoppingCart size={42} />
        {cartCount > 0 && <span>{cartCount}</span>}
      </button>

      <nav className="bottom-nav" aria-label="Primary navigation">
        <button type="button">
          <Building2 size={30} />
          <span>Outlet</span>
        </button>
        <button className="active" type="button">
          <Utensils size={30} />
          <span>Menu</span>
        </button>
        <button onClick={() => onNavigate("account")} type="button">
          <CircleUserRound size={33} />
          <span>Account</span>
        </button>
        <button type="button">
          <MenuIcon size={34} />
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
