<template>
  <!-- element-ui级联组件 -->
  <!-- options:选项数据，props:展示与存储的字段，separator分隔符 -->
  <el-cascader
    v-model="value"
    size="mini"
    :options="treeDate"
    :props="props"
    separator="-"
    @change="changeValue"
  />
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'

export default {
  name: 'SelectTree',
  props: {
    value: {
      type: Number, // 存储的是部门id
      default: null
    }
  },
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
  methods: {
    async getDepartment() {
      this.treeDate = transListToTreeData(await getDepartment(), 0) // 将组织架构的数据 转化为树形赋值给treeData
    },
    changeValue(list) {
      // 取到数组的最后一位
      if (list.length > 0) {
        this.$emit('input', list[list.length - 1]) // 将最后一位的id取出来，传出去传给父组件selectTree组件，父组件v-model监听了传出去的值后绑定数据
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>

<style scoped>

</style>
