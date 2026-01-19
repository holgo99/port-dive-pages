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
        Conviction isn't certainty. It's preparation. PortDive reveals which
        signals align with your thesis and which contradict it. Strong entry
        thesis but weak technicals? You know. That's the edge.
      </>
    ),
  },
  {
    title: "Multiple Views. Single Decision.",
    Png: consensusConvergenceImg,
    description: (
      <>
        Macro trends support your thesis. But do the technicals? What's the
        sentiment telling you? PortDive answers all simultaneously, showing
        where your conviction aligns across perspectives — and where it faces
        headwinds. That's the analysis that changes decisions.
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
    <div
      className={clsx(
        "col col--4",
        styles.portdiveCard,
        styles.portdiveAccentGradient,
      )}
    >
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
