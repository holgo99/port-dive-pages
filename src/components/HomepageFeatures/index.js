import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Rocket from "@site/static/img/multi-rocket.png";
import Workstation from "@site/static/img/workstation.png";
import Gains from "@site/static/img/gains.png";

const FeatureList = [
  {
    title: "Our Mission",
    Png: Rocket,
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
    Png: Workstation,
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
    Png: Gains,
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
    <div className={clsx("col col--4")}>
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
