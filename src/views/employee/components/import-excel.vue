<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <!-- @change事件:点击了弹出的文件选择器的打开时触发 -->
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadChange"
        >
        <div class="drop">
          <i class="el-icon-upload"/>
          <el-button type="text" @click="getTemplate">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="handleUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { getExportTemplate, uploadExcel } from '@/api/employee'
import FileSaver from 'file-saver'

export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getTemplate() {
      const data = await getExportTemplate()
      // console.log(data)
      FileSaver.saveAs(data, '员工导入模板.xlsx')
    },
    // 弹出文件选择器-只有一种方式 通过input的file类型的dom对象的点击事件
    handleUpload() {
      this.$refs['excel-upload-input'].click() // this.$refs.属性名和this.$refs[属性名]等价
    },
    async uploadChange(event) {
      // console.log(event)
      // console.log(event.target.files)
      // 调用上传接口
      // uploadExcel() // 需要参数 form-data 需要文件file
      const files = event.target.files // input上传的文件列表
      if (files.length > 0) {
        // 大于0 说明有文件上传
        const data = new FormData() // new一个表单数据类型的对象，可以用.append('key', 'value')方式添加键值对数据
        data.append('file', files[0]) // files[0]:上传file后，得到的files对象是一个数组，第一项files[0]是一个file文件
        try {
          await uploadExcel(data)
          // 上传成功（await后面的代码一定是成功后执行的）
          this.$emit('uploadSuccess') // 通知父组件 我上传成功
          this.$emit('update:showExcelDialog', false) // 关闭弹层
          // this.$refs['excel-upload-input'].value = ''
        } catch (error) {
          // 捕获失败 清空文件选择器
          // this.$refs['excel-upload-input'].value = ''
        } finally {
          this.$refs['excel-upload-input'].value = ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 360px;
  height: 180px;
  align-items: center;
  color: #697086;

  .excel-upload-input {
    display: none;
    z-index: -9999;
  }

  .btn-upload,
  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 160px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .drop {
    line-height: 40px;
    color: #bbb;

    i {
      font-size: 60px;
      display: block;
      color: #c0c4cc;
    }
  }
}
</style>
