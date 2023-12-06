<template>
  <!-- element-ui级联组件 -->
  <!-- options:选项数据，props:展示与存储的字段，separator分隔符 -->
  <el-cascader
    size="mini"
    :options="treeDate"
    :props="props"
    separator="-"
  />
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'

export default {
  name: 'SelectTree',
  data() {
    return {
      treeDate: [], // 赋值给级联组件的options
      props: {
        label: 'name', // 要展示的字段
        value: 'id' // 要存储的字段
      }
    }
  },
  created() {
    this.getDepartment()
  },
  async getDepartment() {
    this.treeDate = transListToTreeData(await getDepartment(), 0) // 将组织架构的数据 转化为树形赋值给treeData
  }
}
</script>

<style scoped>

</style>
