<template>
  <div>
    <el-dialog :title="showTitle" :visible="showDialog" @close="closeDialog">
      <el-form ref="addDept" label-width="100px" class="form" :rules="formRules" :model="dataForm">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="dataForm.name" style="width: 90%" placeholder="2-10个字符"/>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="dataForm.code" style="width: 90%" placeholder="2-10个字符"/>
        </el-form-item>
        <el-form-item label="部门负责人" prop="managerId">
          <el-select v-model="dataForm.managerId" style="width: 90%" placeholder="请选择负责人">
            <!-- 下拉选项，循环负责人数据 label表示显示的字段 value表示存储的数据 -->
            <el-option
              v-for="item in managerList"
              :key="item.id"
              :value="item.id"
              :label="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="dataForm.introduce" style="width: 90%" :rows="4" type="textarea" placeholder="1-100个字符"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="btnOK">确认</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'

export default {
  name: 'AddDepartment',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
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
        name: '', // 部门名称
        code: '', // 部门编码
        managerId: '', // 管理员ID
        introduce: '' // 部门描述
      },
      formRules: {
        name: [{
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
            let result = await getDepartment()
            // 判断是否为编辑操作，通过弹层有无id区别新增与编辑
            if (this.dataForm.id) {
              result = result.filter(item => item.id !== this.dataForm.id)
            }
            // result数组中是否存在value值
            if (result.some(item => item.code === value)) {
              callback(new Error('部门中已经有该名称了'))
            } else {
              callback()
            }
          }
        }],
        code: [{
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
            let result = await getDepartment()
            // 判断是否为编辑操作
            if (this.dataForm.id) {
              result = result.filter(item => item.id !== this.dataForm.id)
            }
            // result数组中是否存在value值
            if (result.some(item => item.code === value)) {
              callback(new Error('部门中已经有该编码了'))
            } else {
              callback()
            }
          }
        }],
        managerId: [{
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
      // 重置表单,resetFields只能重置在模板中绑定的数据,不能重置获取的data中的id
      // 手动重置表单，让表单只包含下面的数据
      this.dataForm = {
        pid: '', // 父级部门ID
        name: '', // 部门名称
        code: '', // 部门编码
        managerId: '', // 管理员ID
        introduce: '' // 部门描述
      }
      // this.$refs.addDept.resetFields()
      this.$emit('update:showDialog', false)
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    // 点击确认时调用
    btnOK() {
      this.$refs.addDept.validate(async isOK => {
        if (isOK) {
          let mes = '新增'
          // 通过dataForm中的id区别场景
          if (this.dataForm.id) {
            // 编辑场景
            mes = '更新'
            await updateDepartment(this.dataForm)
          } else {
            // 新增场景
            await addDepartment({ ...this.dataForm, pid: this.currentNodeId })
          }
          // 通知父组件更新
          this.$emit('updateDepartment')
          // 提示消息
          this.$message.success(`${mes}部门成功`)
          this.closeDialog()
        }
      })
    },
    // 获取组织的详情
    async getDepartmentDetail() {
      this.dataForm = await getDepartmentDetail(this.currentNodeId)
    }
  },
  computed: {
    showTitle() {
      // 有id弹层显示编辑部门，没id显示新增部门
      return this.dataForm.id ? '编辑部门' : '新增部门'
    }
  }
}
</script>

<style scoped>

</style>
