<template>
  <div>
    <el-dialog title="新增部门" :visible="showDialog" @close="closeDialog">
      <el-form label-width="100px" class="form" :rules="formRules" :model="dataForm">
        <el-form-item label="部门名称" prop="depName">
          <el-input v-model="dataForm.depName" style="width: 90%" placeholder="2-10个字符"/>
        </el-form-item>
        <el-form-item label="部门编码" prop="depCode">
          <el-input v-model="dataForm.depCode" style="width: 90%" placeholder="2-10个字符"/>
        </el-form-item>
        <el-form-item label="部门负责人" prop="managerID">
          <el-select v-model="dataForm.managerID" style="width: 90%" placeholder="请选择负责人">
            <!-- 下拉选项，循环负责人数据 label表示显示的字段 value表示存储的数据 -->
            <el-option
              v-for="item in managerList"
              :key="item.id"
              :value="item.id"
              :label="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="description">
          <el-input v-model="dataForm.description" style="width: 90%" :rows="4" type="textarea" placeholder="1-100个字符"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">确认</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment, getManagerList } from '@/api/department'

export default {
  name: 'AddDepartment',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getManagerList()
  },
  data() {
    return {
      managerList: [], // 存储管理人列表
      dataForm: {
        pid: '', // 父级部门ID
        depName: '', // 部门名称
        depCode: '', // 部门编码
        managerID: '', // 管理员ID
        description: '' // 部门描述
      },
      formRules: {
        depName: [{
          required: true,
          message: '请输入部门名称',
          trigger: 'blur'
        }, {
          min: 2,
          max: 10,
          message: '部门名称长度为2-10个字符',
          trigger: 'blur'
        }, {
          trigger: 'blur',
          // 自定义校验，查看是否和已有名称重复
          validator: async(rule, value, callback) => {
            // value就是输入的名称
            const result = await getDepartment()
            // result数组中是否存在value值
            if (result.some(item => item.code === value)) {
              callback(new Error('部门中已经有该名称了'))
            } else {
              callback()
            }
          }
        }],
        depCode: [{
          required: true,
          message: '请输入部门编码',
          trigger: 'blur'
        }, {
          min: 2,
          max: 10,
          message: '部门编码长度为2-10个字符',
          trigger: 'blur'
        }, {
          trigger: 'blur',
          // 自定义校验，查看是否和已有部门重复
          validator: async(rule, value, callback) => {
            // value就是输入的编码
            const result = await getDepartment()
            // result数组中是否存在value值
            if (result.some(item => item.code === value)) {
              callback(new Error('部门中已经有该编码了'))
            } else {
              callback()
            }
          }
        }],
        manager: [{
          required: true,
          message: '请选择一个负责人',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入部门介绍',
          trigger: 'blur'
        }, {
          max: 100,
          message: '部门介绍长度为1-100个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:showDialog', false)
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    }
  }
}
</script>

<style scoped>

</style>
