import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";

// ============================================================================
// TICKER ICON COMPONENT
// ============================================================================
export function TickerIcon({
  tickerIconUrl,
  ticker,
  tickerName,
  size = 48,
  showWordmark = false,
  iconOnly = false,
  theme = { PORTDIVE_THEME },
}) {
  // If iconOnly, just return the image
  if (iconOnly) {
    return (
      <img
        src={tickerIconUrl}
        alt={`${ticker} Icon`}
        width={size}
        height={size}
        style={{ flexShrink: 0, display: "block" }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <img
        src={tickerIconUrl}
        alt={`${ticker} Icon`}
        width="48px"
        style={{ flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: size * 0.6,
          fontWeight: 700,
          color: theme.text,
          letterSpacing: "-0.02em",
          flexShrink: 0,
        }}
      >
        {ticker}
      </span>
      {showWordmark && (
        <>
          &nbsp;•&nbsp;
          <span
            style={{
              fontSize: size * 0.6,
              fontWeight: 700,
              color: theme.text,
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          >
            {tickerName}
          </span>
        </>
      )}
    </div>
  );
}
