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

# 談談 hydration
웹 개발에서 "hydration(하이드레이션)"은 서버 측 렌더링(SSR) 후에 서버에서 생성된 HTML 요소를 클라이언트 측에서 상호 작용적인 동적 요소로 변환하는 과정을 의미합니다. 간단히 말해, 정적인 HTML 요소를 동적인 동작을 가진 요소로 변환하는 과정입니다.

SSR에서는 서버가 HTML 콘텐츠를 생성하고 클라이언트로 전송하여 초기 페이지 로딩을 가속화하고 SEO를 향상시키기 위해 사용됩니다. 그러나 이러한 HTML 요소는 일반적으로 JavaScript 동작과 관련이 없습니다. 더 풍부한 사용자 경험을 위해 이러한 정적 HTML 요소를 클라이언트 측에서 상호 작용적인 요소로 변환해야 합니다.

이것이 hydration의 역할입니다. 이는 클라이언트 측에서 JavaScript 동작을 다시 생성하고 첨부하여 정적인 HTML 요소를 동적인 요소로 변환합니다. 이렇게 함으로써 이벤트 처리, 상태 관리, 동적 업데이트와 같은 기능을 구현하여 더 나은 사용자 경험을 제공할 수 있습니다.

Vue.js, React, Nuxt.js 등의 프레임워크 및 라이브러리에서는 hydration이 프레임워크나 라이브러리 자체에 의해 자동으로 처리되므로 개발자가 수동으로 구현할 필요가 없습니다. 페이지의 동적 기능이 제대로 작동하도록 클라이언트 측에서 다시hydration하는 프로세스를 자동으로 처리합니다.
