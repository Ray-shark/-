<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button @click="showDialog = true" size="mini" type="primary">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200" label="角色">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini"/>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <!-- 自定义的列结构：这一列显示什么内容 -->
          <!-- 插槽，ElementUI文档中查看传入对象有哪些数据，解构需要的数据 -->
          <template v-slot="{ row }">
            <!-- {{row}} -->
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0"/>
            <span v-else>{{ row.state === 1 ? '已启用' : row.state === 0 ? '未启用' : '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" type="textarea" size="mini"/>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 放置操作按钮 -->
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button type="primary" size="mini" @click="btnEditOK(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button size="mini" type="text">分配权限</el-button>
              <el-button @click="btnEditRow(row)" size="mini" type="text">编辑</el-button>
              <!-- el-popconfirm:表示气泡框 用slot="reference"插槽显示  -->
              <el-popconfirm
                title="确定删除吗"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <!-- 放置分页组件 layout属性：自己选择显示什么内容（prev：左箭头，pager：页码，next：右箭头） -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          @current-change="changePage"
          layout="prev, pager, next"
        />
      </el-row>
    </div>
    <!-- 放置弹层 -->
    <el-dialog title="新增角色" :visible.sync="showDialog" @close="btnCancel">
      <!-- 表单内容 -->
      <el-form ref="roleForm" label-width="100px" :model="roleForm" :rules="roleRules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" style="width: 550px" size="mini"/>
        </el-form-item>
        <!-- 只有需要校验的属性或者在重置表单时才在表单项中写prop属性 -->
        <el-form-item label="启用" prop="state">
          <!-- active-value:自定义开启时元素的值 inactive-value:关闭时 -->
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width: 550px" size="mini"/>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button size="mini" type="primary" @click="btnOK">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, delRole } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      list: [],
      showDialog: false, // 控制弹层显示隐藏
      // 将分页信息放到一个对象中
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条
        total: 0 // 总数
      },
      roleForm: {
        name: '',
        description: '',
        state: 0 // 状态：1启用，0未启用
      },
      roleRules: {
        name: [{
          required: true,
          message: '角色名称不能为空',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '角色描述不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows // 赋值数据
      this.pageParams.total = total
      // 针对每一行数据添加一个编辑标记
      this.list.forEach(item => {
        // item.isEdit = false
        // 数据响应式问题 数据变化 视图更新
        // 添加的动态属性 不具备响应式特点，没加到_data中
        // this.$set(目标对象，属性名称，初始值) 可以针对目标对象添加响应式属性
        this.$set(item, 'isEdit', false)
        // 缓存每行数据editRow
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    // 切换分页时请求新的数据
    changePage(newPage) {
      // newPage：当前页码  从elUI中current-change事件传入的newPage
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          // 刷新列表
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false // 关闭弹层
    },
    // 点击编辑行
    btnEditRow(row) {
      row.isEdit = true // 改变行的编辑状态
      // 更新缓存数据
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    // 编辑完成点击确定
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        // 如果都填写了 进行下一步操作
        await updateRole({ ...row.editRow, id: row.id })
        // 更新成功
        this.$message.success('更新角色成功')
        // 更新显示数据并退出编辑状态
        // row.isEdit = false // esLint会报错（误判）
        // 为了规避esLint的误判，此时用Object.assign(target, source) 将source的值赋给target
        Object.assign(row, {
          ...row.editRow, // 更新数据
          isEdit: false // 退出编辑模式
        })
      } else {
        this.$message.warning('角色和描述不能为空')
      }
    },
    async confirmDel(id) {
      // 此处删的是后端的数据，前端还没变
      await delRole(id)
      this.$message.success('删除角色成功')
      // 如果删除的是最后一个角色，后端已经删了，前端还没更新，所以还有数据
      if (this.list.length === 1) {
        this.pageParams.page--
      }
      this.getRoleList()
    }
  }
}
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
