export function BrandLogo({ subtitle }: { subtitle?: string }) {
  return (
    <span className="brand-lockup">
      <span className="brand-logo-icon">
        <img src="/assets/caremizhi-symbol.png" alt="CareMizhi" />
      </span>
      <span className="brand-name">
        CareMizhi
        {subtitle && <small>{subtitle}</small>}
      </span>
    </span>
  );
}
