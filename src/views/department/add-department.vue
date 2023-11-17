<template>
<div>
  <el-dialog title="新增部门" :visible="showDialog" @close="closeDialog">

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

</style>
