export function AnalysisCard({
  title,
  description,
  symbol,
  analysisDate,
  attribution,
}) {
  return (
    <div
      style={{
        background: "var(--ifm-background-color)",
        border: "1px solid var(--ifm-color-emphasis-200)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px",
      }}
    >
      <h2>{title}</h2>
      <p style={{ color: "var(--ifm-font-color-secondary)" }}>{description}</p>
      <div
        style={{
          display: "flex",
          gap: "16px",
          fontSize: "14px",
          color: "var(--ifm-font-color-secondary)",
        }}
      >
        <span>
          Symbol: <strong>{symbol}</strong>
        </span>
        <span>
          Analysis Date: <strong>{analysisDate}</strong>
        </span>
        <span>
          Attribution: <strong>{attribution}</strong>
        </span>
      </div>
    </div>
  );
}
