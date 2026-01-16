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
            {siteConfig.tagline}
          </Heading>
          <h2 className={styles.heroTagline}>AI-driven Portfolio Deep Dives</h2>
          <h3 className={styles.heroSubheading}>
            Consensus analysis. Clear entries. Disciplined exits. Better
            returns.
          </h3>
          <div className={styles.ctaButtons}>
            <div className={styles.ctaPrimary}>
              <Link to="/docs/intro">Start Deep Diving</Link>
            </div>
            <div className={styles.ctaSecondary}>
              <Link to="/docs/intro">Explore Analytics Directory</Link>
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
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
      className="layout--homepage"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
