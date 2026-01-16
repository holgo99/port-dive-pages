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
            <span>PortDive</span>
            <span> — </span>
            <span>AI driven portfolio deep-dives.</span>
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg portdive-cta"
              to="/docs/intro"
            >
              Start Deep Diving
            </Link>
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
