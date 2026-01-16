import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import consensusConvergenceImg from "@site/static/img/consensus-convergence.png";
import dashboardsImg from "@site/static/img/dashboards.png";
import workstationImg from "@site/static/img/workstation.png";

const FeatureList = [
  {
    title: "Analyze Like You Mean It",
    Png: dashboardsImg,
    description: (
      <>
        Multiple AI models converge on one decision. No single perspective
        dominates. Just rigorous consensus from macro trends, technicals,
        sentiment, and fundamentals. Your portfolio deserves that depth.
      </>
    ),
  },
  {
    title: "Multiple Views. Single Decision.",
    Png: consensusConvergenceImg,
    description: (
      <>
        Market analysis doesn't happen in a vacuum. PortDive synthesizes macro
        trends, technical patterns, sentiment indicators, and fundamental
        metrics—then converges on a unified conviction you can act on. That's
        deep-dive analysis.
      </>
    ),
  },
  {
    title: "Outsmart. Outprepare.",
    Png: workstationImg,
    description: (
      <>
        Every trade starts with preparation. PortDive gives you the analytical
        edge: clear entries when conditions align, conviction to hold through
        volatility, and disciplined exits when the thesis breaks.
        Professional-grade analysis. Zero excuses.
      </>
    ),
  },
];

function Feature({ Png, title, description }) {
  return (
    <div className={clsx("col col--4 .portdive-accent-gradient")}>
      <div className="text--center">
        <img src={Png} className={styles.featurePng} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
