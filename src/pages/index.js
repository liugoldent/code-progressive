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
      <main className={styles.hero}>
        <div className={styles.hero__content}>
          <p className={styles.hero__eyebrow}>FRONTEND NOTES · SINCE 2019</p>
          <Heading as="h1" className={styles.hero__title}>
            Build with curiosity.
            <span>寫下每一次理解。</span>
          </Heading>
          <p className={styles.hero__description}>
            從 JavaScript、React、Vue 到前端工程，
            <br className={styles.desktopBreak} />
            把學習過程整理成可以反覆查閱的技術筆記。
          </p>
          <div className={styles.hero__actions}>
            <Link className={styles.primaryAction} to="/docs/intro">
              開始閱讀 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className={styles.hero__visual} aria-hidden="true">
          <img
            className={styles.hero__backdrop}
            src="/img/hero-workspace.jpg"
            alt=""
            loading="eager"
            fetchPriority="low"
            decoding="async"
            width="1400"
            height="933"
          />
          <img
            className={styles.hero__logo}
            src="/img/code.png"
            alt=""
            loading="eager"
            fetchPriority="low"
            decoding="async"
            width="500"
            height="500"
          />
        </div>

        <p className={styles.hero__signature} aria-hidden="true">
          {siteConfig.title}
        </p>
      </main>
    </Layout>
  );
}
