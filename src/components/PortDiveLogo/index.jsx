const portdiveLogoUrl = "/portdive-pages/img/portdive-logo-primary.svg";

// ============================================================================
// PORTDIVE LOGO COMPONENT
// ============================================================================
const PortDiveLogo = memo(({ size = 48, showWordmark = false, theme }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <img src={portdiveLogoUrl} alt="PortDive Logo" width="48px" />
    {showWordmark && (
      <span
        style={{
          fontSize: size * 0.6,
          fontWeight: 700,
          color: theme.text,
          letterSpacing: "-0.02em",
        }}
      >
        PortDive
      </span>
    )}
  </div>
));
