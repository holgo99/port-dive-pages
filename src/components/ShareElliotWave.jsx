export function ShareElliotWave() {
  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://portdive.com/analysis/nbis-elliot-waves-analysis";

  const title = "Elliott Wave Principle Analysis - PortDive";
  const text =
    "Interactive Elliott Wave analysis tool for technical market analysis";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
        padding: "16px 0",
        marginBottom: "24px",
      }}
    >
      {/* X/Twitter */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          background: "var(--ifm-color-emphasis-100)",
          color: "var(--ifm-font-color-base)",
          textDecoration: "none",
          transition: "all 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--ifm-color-primary)";
          e.currentTarget.style.color = "var(--ifm-font-color-base-inverse)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--ifm-color-emphasis-100)";
          e.currentTarget.style.color = "var(--ifm-font-color-base)";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.693-5.848 6.693h-3.308l7.73-8.835L.424 2.25h6.679l4.882 6.45 5.259-6.45zM17.002 20.331h1.834L6.822 4.169H4.881z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          background: "var(--ifm-color-emphasis-100)",
          color: "var(--ifm-font-color-base)",
          textDecoration: "none",
          transition: "all 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--ifm-color-primary)";
          e.currentTarget.style.color = "var(--ifm-font-color-base-inverse)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--ifm-color-emphasis-100)";
          e.currentTarget.style.color = "var(--ifm-font-color-base)";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.83 0-9.74h3.554v1.378c.43-.664 1.195-1.61 2.91-1.61 2.126 0 3.719 1.395 3.719 4.393v5.579zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.71 0-.956.77-1.71 1.906-1.71.954 0 1.914.754 1.914 1.71 0 .952-.96 1.71-1.905 1.71zm1.646 11.597H3.583V9.712h3.4v10.74zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          background: "var(--ifm-color-emphasis-100)",
          color: "var(--ifm-font-color-base)",
          textDecoration: "none",
          transition: "all 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--ifm-color-primary)";
          e.currentTarget.style.color = "var(--ifm-font-color-base-inverse)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--ifm-color-emphasis-100)";
          e.currentTarget.style.color = "var(--ifm-font-color-base)";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>

      {/* Share/Forward */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title,
              text,
              url: pageUrl,
            });
          } else {
            navigator.clipboard.writeText(pageUrl);
            alert("Link copied to clipboard!");
          }
        }}
        title="Share more"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          background: "var(--ifm-color-emphasis-100)",
          color: "var(--ifm-font-color-base)",
          border: "none",
          cursor: "pointer",
          transition: "all 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--ifm-color-primary)";
          e.currentTarget.style.color = "var(--ifm-font-color-base-inverse)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--ifm-color-emphasis-100)";
          e.currentTarget.style.color = "var(--ifm-font-color-base)";
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    </div>
  );
}
