<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示组织架构,默认展开子节点 -->
      <el-tree default-expand-all :data="datas" :props="defaultProps" :expand-on-click-node="false">
        <!-- 节点结构 -->
        <!-- v-slot="{ node, data }" 只能作用在template 下面解构出data数据项 -->
        <template v-slot="{ data }">
          <el-row style="width: 100%; height: 40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">管理员</span>
              <el-dropdown @command="operateDept($event, data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="delete">删除部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!--  展示弹窗 此处的.sync表示自动监听update:showDialog事件，实现自动监听  -->
    <add-department :show-dialog.sync="showDialog" :current-node-id="currentNodeId" @updateDepartment="getDepartment" />
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AddDepartment from '@/views/department/add-department'

export default {
  name: 'Department',
  data() {
    return {
      currentNodeId: null, // 存储当前点击的id
      showDialog: false,
      datas: [], // 数据属性
      // 与datas中的属性对应
      defaultProps: [{
        label: 'name', // 要显示的字段的名字
        children: 'children' // 读取子节点的字段名
      }]
    }
  },
  components: { AddDepartment },
  created() {
    this.getDepartment()
  },
  methods: {
    // 封装获取部门信息的方法
    async getDepartment() {
      const result = await getDepartment()
      this.datas = transListToTreeData(result, 0)
    },
    // 操作部门的方法
    operateDept(type, id) {
      if (type === 'add') {
        // 添加子部门
        this.showDialog = true
        this.currentNodeId = id
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
