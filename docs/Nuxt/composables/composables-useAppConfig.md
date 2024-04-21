---
description: 介紹useAppConfig
tags:
  - nuxt
  - composable
keywords:
  [
    nuxt,
    js,
    javascript,
    composable,
    composable api,
    useAppConfig,
    seo,
    nuxt useAppConfig,
  ]
---

# useAppConfig

## 概念

- 這個 Composables 函數通常用於在應用程式中訪問全域配置，例如 API 端點、語言設置、樣式設定等。使用 useAppConfig 可以讓您更輕鬆地管理應用程式的配置，並在整個應用程式中重複使用這些配置。

## 範例

### composable part

```js
// composables/useAppConfig.js

import { ref } from "vue";

// 定義一個用於訪問應用程式配置的 Composables
export function useAppConfig() {
  // 創建一個 ref 來存儲應用程式配置
  const config = ref({
    apiUrl: "https://api.example.com",
    language: "en",
    theme: "light",
    // 其他配置設置...
  });

  // 返回應用程式配置
  return config;
}
```

### vue part

```html
<!-- components/ExampleComponent.vue -->
<template>
  <div>
    <h2>範例組件</h2>
    <p>API URL: {{ config.apiUrl }}</p>
    <p>語言: {{ config.language }}</p>
    <p>主題: {{ config.theme }}</p>
  </div>
</template>

<script>
  import { useAppConfig } from "~/composables/useAppConfig";

  export default {
    name: "ExampleComponent",
    setup() {
      // 使用 useAppConfig composable 函數來獲取應用程式配置
      const config = useAppConfig();

      // 返回應用程式配置以供模板使用
      return {
        config,
      };
    },
  };
</script>
```
