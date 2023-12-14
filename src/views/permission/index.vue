<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary">添加权限</el-button>
      <el-table default-expand-all :data="list" row-key="id">
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="标识" prop="code"/>
        <el-table-column label="描述" prop="description"/>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <!-- row.type中的type是后端返回数据添加的属性，值为1时可以显示添加，2时不显示 -->
            <el-button v-if="row.type === 1" size="mini" type="text">添加</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹层 -->
    <el-dialog :visible.sync="showDialog">
      <el-form :model="formData" :rules="formRules">
        <el-form-item label="权限名称">
          <el-input/>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input/>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input type="textarea"/>
        </el-form-item>
        <el-form-item label="开启">

        </el-form-item>
        <el-row type="flex" justify="end" align="middle">
          <el-button type="primary" size="mini">确定</el-button>
          <el-button size="mini">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'

export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {

      },
      formRules: {

      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), 0)
    }
  }
}
</script>

<style>
.btn-add {
  margin: 10px;
}
</style>
