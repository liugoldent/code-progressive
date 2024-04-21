import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import Heading from "@theme/Heading";
import styles from "./index.module.css";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <Link to="/docs/intro">
        <div className={styles.header}>
          <img
            className={styles.header__img}
            src="https://picsum.photos/2048/2048/?blur=5"
            loading="eager"
          />
          <p className={styles.header__text}>{`${siteConfig.title}`}</p>
        </div>
      </Link>
    </Layout>
  );
}
