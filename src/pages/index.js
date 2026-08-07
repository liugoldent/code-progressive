import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import Heading from "@theme/Heading";
import styles from "./index.module.css";

const HOME_DESCRIPTION =
  "前端、JavaScript、React、Vue、TypeScript、Node.js 與 LeetCode 的繁體中文學習筆記與實作整理。";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    url: siteConfig.url,
    description: HOME_DESCRIPTION,
    inLanguage: "zh-TW",
  };

  return (
    <Layout description={HOME_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="前端開發, JavaScript, React, Vue, TypeScript, Node.js, LeetCode, 程式設計"
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <Link to="/docs/intro">
        <div className={styles.header}>
          <img
            className={styles.header__img}
            src="/img/code.png"
            alt="進入 __yeah! Code 技術筆記"
            loading="eager"
            fetchPriority="high"
            width="500"
            height="500"
          />
          <Heading as="h1" className={styles.header__text}>
            {siteConfig.title}
          </Heading>
        </div>
      </Link>
    </Layout>
  );
}
