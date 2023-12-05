<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索"/>
        <!-- 树形组件，需要到时候去ElementUI里面查 -->
        <!-- node-key:树节点唯一标识，:data:树里面的数据，
        :props:label表示展示data里面的哪个属性，children表示子树是data中哪个属性，
        default-expand-all:默认展开树，@current-change:切换节点时触发哪个方法，传递node作为参数到方法中
        -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <!-- 根据接口返回的数据结构，用prop表示 -->
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <!-- 显示头像 staffPhoto:头像路径 -->
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30"/>
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名"/>
          <el-table-column prop="mobile" label="手机号" sortable/>
          <el-table-column prop="workNumber" label="工号" sortable/>
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门"/>
          <el-table-column prop="timeOfEntry" label="入职时间" sortable/>
          <el-table-column label="操作" width="280px">
            <template>
              <el-button type="text" size="mini">查看</el-button>
              <el-button type="text" size="mini">角色</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" style="height: 60px" align="middle" justify="end">
          <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pageSize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { getEmployeeList } from '@/api/employee'
import { transListToTreeData } from '@/utils'

export default {
  name: 'Employee',
  data() {
    return {
      depts: [], // 树组织数据
      defaultProps: {
        label: 'name', // 显示data数据中的name
        children: 'children'
      },
      // 存储查询参数
      queryParams: {
        departmentId: null,
        page: 1,
        pageSize: 10
      },
      total: 0, // 记录员工总数
      list: [] // 存储员工列表的数据
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      // 递归方法，将列表转换为树形结构
      this.depts = transListToTreeData(await getDepartment(), 0)
      // 记录首个节点的id
      this.queryParams.departmentId = this.depts[0].id
      // 设置选中节点
      // 树组件渲染是异步的 必须等到更新完毕 用nextTick将后面的操作等待
      this.$nextTick(() => {
        // 此时意味着树渲染完毕
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 这个时候已经记录了id，可以接着通过id调用获取员工列表的方法，完成列表初始化
      this.getEmployeeList()
    },
    // 切换树节点时改变查询参数（departmentId）
    selectNode(node) {
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    // 获取员工列表的方法
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    // 切换页码,el-pagination的current-change事件会传入newPage（当前页）参数
    changePage(newPage) {
      this.queryParams.page = newPage
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;

  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .opeate-tools {
      margin: 10px;
    }

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
