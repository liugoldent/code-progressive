---
description: element-ui 設定自身的狀態
tags:
  - Vue
  - elementUI
---
# [ElementUI] 常見使用

## el-table-column設置width and min-width
[el-table-column中设置width和min-width注意点](https://blog.csdn.net/JasonSangHaoBin/article/details/113851976)
#### 不設置width & min-width
每一列寬度相同

#### 設置width=30%
無效，會被當成width=30px

#### 設置min-width="30" or 30%
每一列都設置才能實現每一列的百分比狀態

#### 同時設置min-width & width
該表格會依照width來排列


## el-form使用
[Form 表单](https://cloud.tencent.com/developer/section/1489884)
```html
<el-form ref="form" :model="form" label-width="80px">
  <!-- form-item:為了讓其有label -->
  <el-form-item label="活动名称">
    <!-- 而這個表格內有什麼，要設定 -->
    <el-input v-model="form.name"></el-input>
  </el-form-item>
</el-form>
```


