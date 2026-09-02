---
sidebar_position: 21
title: "React Hooks 六題反射題庫：內建與第三方 Hook 全覽"
description: "React Hooks 練習總覽：React 18 內建 Hook、React 19 新 Hook，以及 TanStack Query、Redux、React Router、React Hook Form、Zustand 常用 Hook，每個 Hook 固定六題。"
tags:
  - React
  - Hooks
  - Interview
  - Practice
keywords: ["React Hooks 題庫", "React Hook 面試題", "useState 題目", "useEffect 題目", "第三方 Hooks 題目", "React Hooks 六題"]
---

# React Hooks 六題反射題庫

> 第一次接觸或還不確定該選哪個 Hook，先讀：[React Hooks 為什麼存在：常用 Hook 解決問題全覽](./17-react-hooks-purpose-guide.md)

這套題庫不是叫你背 API。每個 Hook 都固定六題，依序練：

1. **預測執行結果**：render、commit、callback、畫面各會發生什麼。
2. **找出錯誤假設**：程式把 Hook 想成了什麼。
3. **定位 identity / dependency**：什麼改變會觸發更新。
4. **判斷適用邊界**：這裡真的需要這個 Hook 嗎。
5. **修正 production edge case**：race、cleanup、SSR、cache 或訂閱。
6. **完成面試口述**：不用背程式也能說清楚取捨。

題目後的答案預設收合。先把畫面、console、render 次數或資料流寫下來，再展開答案。

## 題庫範圍

| 類別 | 收錄 Hook | 題數 |
| --- | --- | ---: |
| [State / Context / Ref](./18-react-state-context-ref-hooks-drills.md) | `useState`、`useReducer`、`useContext`、`useRef`、`useImperativeHandle`、`useId` | 36 |
| [Effect / Memo](./19-react-effect-memo-hooks-drills.md) | `useEffect`、`useLayoutEffect`、`useInsertionEffect`、`useMemo`、`useCallback`、`useDebugValue` | 36 |
| [Concurrent / External Store](./20-react-concurrent-external-hooks-drills.md) | `useTransition`、`useDeferredValue`、`useSyncExternalStore` | 18 |
| [React 19 新 Hook](./21-react-19-hooks-drills.md) | `useActionState`、`useOptimistic`、`useEffectEvent` | 18 |
| [Server / Global State 第三方 Hook](./22-third-party-server-global-hooks-drills.md) | `useQuery`、`useMutation`、`useQueryClient`、`useSelector`、`useDispatch`、Zustand store Hook | 36 |
| [Router / Form 第三方 Hook](./23-third-party-router-form-hooks-drills.md) | `useNavigate`、`useParams`、`useSearchParams`、`useForm`、`useWatch`、`useFieldArray` | 36 |
| **合計** | **30 種 Hook** | **180 題** |

:::info 這裡的「所有常見 Hook」怎麼定義？

- React 18：收錄 React 官方 Hook 清單中的全部 15 個 Hook，包含較少直接寫在產品程式裡的 library hooks。
- React 19：另外收錄目前最需要認識的三個新 Hook；本專案仍是 React 18，所以這一頁的程式是升級後才能執行的概念題。
- 第三方：第三方套件沒有有限的「全部」；這套先以本專案既有學習路線中的 TanStack Query、React Redux、React Router、React Hook Form，加上常見的 Zustand 為邊界。

:::

## 建議作答順序

第一次不要從 180 題一路刷到底。用四輪比較容易真的記住：

```text
第一輪：useState → useEffect → useRef → useContext
第二輪：useReducer → useMemo → useCallback → useLayoutEffect
第三輪：useTransition → useDeferredValue → useSyncExternalStore
第四輪：第三方 Hooks → React 19 Hooks → 其餘 library hooks
```

每一種 Hook 的六題，建議分兩天完成：

- 第一天做 1～3 題，建立執行模型。
- 第二天先不看答案重講一次，再做 4～6 題。
- 一週後隨機抽一題，只看錯誤程式完成口述與修正。

## 判斷 Hook 的共同入口

看到任何 Hook，先回答以下五件事：

| 問題 | 你要找的東西 |
| --- | --- |
| 它從哪裡 import？ | React 內建、第三方套件，還是專案 custom Hook |
| 它保存或訂閱什麼？ | local state、Context、DOM、external store、server cache、URL |
| 什麼改變會讓 component render？ | setter、dispatch、Context value、selector result、query observer |
| callback 讀到哪次 render 的值？ | snapshot、dependency、latest ref、Effect Event |
| unmount 或輸入切換時要清什麼？ | listener、timer、request、subscription、optimistic state |

## 版本界線

目前 `package.json` 使用 React 18，因此前 15 個內建 Hook 可直接放進本專案執行。React 19 題庫會清楚標示版本，不會假裝 React 18 已經支援。

第三方題目使用各套件目前主流的 API 形狀，但本專案沒有安裝這些套件；題目是閱讀與推導用，不會在 Docusaurus 頁面中直接 import 它們。

## 官方參考

- [React Built-in Hooks](https://react.dev/reference/react/hooks)
- [TanStack Query React API](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
- [React Router Hooks](https://reactrouter.com/api/hooks/useNavigate)
- [React Hook Form API](https://react-hook-form.com/docs)
- [Zustand Hooks](https://zustand.docs.pmnd.rs/reference/hooks/use-store)
