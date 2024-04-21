---
description: hydration是什麼、注水是什麼
tags:
  - html
  - interview
keywords:
  [
    hydration,
    html,
    css,
    js,
    javascript,
    this,
    interview,
    js 面試,
    js interview,
    前端面試題,
    frontend interview,
    フロントエンドの面接質問,
    프론트엔드 면접 문제,
  ]
---

# talk hydration
In web development, "hydration" refers to the process of converting server-generated HTML elements into interactive dynamic elements on the client-side after server-side rendering (SSR). Simply put, it is the process of transforming static HTML elements into elements with dynamic behavior.

In SSR, the server generates HTML content and sends it to the client to speed up initial page loading and improve SEO. However, these HTML elements are typically static and not associated with JavaScript behavior. To achieve a richer user experience, we need to convert these static HTML elements into elements with interactivity on the client-side.

This is where hydration comes in: it recreates and attaches JavaScript behavior on the client-side to convert static HTML elements into dynamic ones. This way, we can implement features such as event handling, state management, and dynamic updates to provide a better user experience.

In frameworks and libraries like Vue.js, React, and Nuxt.js, hydration is handled automatically by the framework or library itself, so developers don't need to implement it manually. They automatically handle the process of rehydrating on the client-side to ensure that dynamic functionality of the page works properly.
