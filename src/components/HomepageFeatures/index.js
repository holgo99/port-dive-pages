import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import consensusConvergenceImg from "@site/static/img/consensus-convergence.png";
import dashboardsImg from "@site/static/img/dashboards.png";
import workstationImg from "@site/static/img/workstation.png";

const FeatureList = [
  {
    title: "Our Mission",
    Png: dashboardsImg,
    description: (
      <>
        The PortDive idea came to live, after retail was tricked out of a winnig
        position.
        <br />
        <b>Never again!</b>
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    Png: consensusConvergenceImg,
    description: (
      <>
        PortDive lets you focus on your investments, while we handle the
        analytics. Go ahead and access our free <code>Analytics</code>{" "}
        directory.
      </>
    ),
  },
  {
    title: "Gain from Conviction",
    Png: workstationImg,
    description: (
      <>
        Leverage our AI-driven platform to build conviction and maximize
        returns, make data-backed investment decisions without <b>FOMO</b>.
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
