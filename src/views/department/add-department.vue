<template>
  <div>
    <el-dialog title="新增部门" :visible="showDialog" @close="closeDialog">
      <el-form label-width="100px" class="form">
        <el-form-item label="部门名称">
          <el-input style="width: 80%" placeholder="2-10个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门编码">
          <el-input style="width: 80%" placeholder="2-10个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人">
          <el-select style="width: 80%" placeholder="请选择负责人">
            <el-option value="a">a</el-option>
            <el-option value="b">b</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍">
          <el-input style="width: 80%" :rows="4" type="textarea" placeholder="1-100个字符"></el-input>
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
export default {
  name: 'AddDepartment',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped>
.form {
  text-align: center;
}
</style>
