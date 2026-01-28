import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import Heading from "@theme/Heading";
import styles from "./index.module.css";
import heroImg from "@site/static/img/hero-image.png";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={styles.heroContainer}>
        {/* Left side - Text content */}
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            Build Conviction, Not Anxiety
          </Heading>
          <h2 className={styles.heroTagline}>AI-driven Portfolio Deep Dives</h2>
          <h3 className={styles.heroSubheading}>
            Consensus analysis. Clear entries. Disciplined exits. Better
            returns.
          </h3>
          <div className={styles.ctaButtons}>
            <div className={styles.ctaPrimary}>
              <Link to="/ticker-analysis">Start Deep Diving</Link>
            </div>
            <div className={styles.ctaSecondary}>
              <Link to="/docs/overview">Explore Features</Link>
            </div>
          </div>
        </div>

        {/* Right side - Hero image */}
        <div className={styles.heroImageWrapper}>
          <img src={heroImg} alt="Hero" className={styles.heroImage} />
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} — ${siteConfig.tagline}`}
      description="Build conviction without anxiety. PortDive synthesizes Multi-AI models analyzing macro trends, technicals, sentiment, and fundamentals into unified investment decisions. Start your deep dive today."
      className="layout--homepage"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
