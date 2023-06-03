---
description: VueRouter知識點
tags: 
    - vue
    - vue router
    - frontend
---

# FE-Vue Router
![vue router分類](https://www.leyeah.com/upload/images/2022/12/01/63889748cd28e.jpg)
## vue-router怎麼重新定向頁面
[vue-router怎么重定向页面？](https://github.com/haizlin/fe-interview/issues/419)
```js
export default {
   path: '',
   name: '',
   meta: {  //元信息（非必填）
      icon: '',  //路由图标
      title: '',   //路由名称
      light: '',    //高亮显示那个路由name
      show: true,   //是否显示
   },
   redirect: {   
      name: '',    //重定向，指向哪个路由的name
   },
   component: '',    //当前路由时要显示的组件
   children: [],    //嵌套子路由
}
```

## vue-router 如何配置404頁面
```js
{
// 会匹配所有路径
// 含有通配符的路由应该放在最后
// 一定要放在最後！！
path: '*',
name: '404',
component: () => import('../views/404.vue')
}
```


