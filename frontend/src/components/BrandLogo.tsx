import logoUrl from "../assets/hush-lush-logo.svg";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={compact ? "brand-logo brand-logo--compact" : "brand-logo"}>
      <img className="brand-logo__mark" src={logoUrl} alt="Hush Lush" />
      {!compact && (
        <>
          <div className="brand-logo__divider" />
          <div>
            <div className="brand-logo__name">Hush Lush</div>
            <div className="brand-logo__tagline">Advertising &amp; Technologies</div>
          </div>
        </>
      )}
    </div>
  );
}
