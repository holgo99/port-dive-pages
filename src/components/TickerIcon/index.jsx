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
  theme = { PORTDIVE_THEME },
}) {
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
        alt={"${ticker} Icon"}
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
