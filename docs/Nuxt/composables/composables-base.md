---
description: 介紹composable
tags:
  - nuxt
  - composable
keywords:
  [nuxt, js, javascript, composable, composable api, seo, nuxt composable api]
---

# base

## 概念

- 把通用功能另外寫在一個 JS 檔案，有需要時 import

## 命名建議

- 建議使用 use 開頭命名

## 範例

### composable part

```js
// products.js
import { ref } from "vue";

// 定義一個用於管理產品數據的 Composables
export function useProducts() {
  // 創建一個 ref 來存儲產品列表
  const products = ref([]);

  // 從後端獲取產品數據的函數
  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      products.value = data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // 返回產品列表和獲取產品數據的函數
  return {
    products,
    fetchProducts,
  };
}
```

### vue part

```html
<template>
  <div>
    <h2>產品列表</h2>
    <ul>
      <li v-for="product in products" :key="product.id">{{ product.name }}</li>
    </ul>
    <button @click="loadProducts">加載產品</button>
  </div>
</template>

<script>
  import { useProducts } from "@/composables/products";

  export default {
    name: "ProductList",
    setup() {
      // 使用 useProducts Composables 函數來獲取產品數據
      const { products, fetchProducts } = useProducts();

      // 當點擊按鈕時，加載產品數據
      const loadProducts = () => {
        fetchProducts();
      };

      // 返回 products 和 loadProducts 以供模板使用
      return {
        products,
        loadProducts,
      };
    },
  };
</script>
```

## 如何避免 composables 方法內的變數被修改？

1. 指定變數為：readOnly

```js
return {
  products: readonly(products),
  fetchProducts,
};
```

## 參考資料

[EzDoc](https://ezdoc.cn/docs/nuxtjs/composables/use-async-data)
