<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar" alt="...">
          <!-- name?.charAt(0)中的 ? 是可选链操作符
           它的作用是在访问对象的属性之前，先判断对象是否为 null 或 undefined。
           如果对象为 null 或 undefined，表达式的结果会立即返回 undefined，而不会抛出错误
          -->
          <span v-else class="userName">{{ name?.charAt(0) }}</span>
          <!-- 用户名称 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/Ray-shark/people">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- @click.native中的native 是注册组件的根元素的原生事件（因为el-dropdown-item标签没有click事件） -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 放置dialog对话框 -->
    <!-- .sync修饰符作用是使子组件可以传递值给父组件
    使ElementUI组件中el-dialog标签的visible属性值和父组件navbar属性showDialog值双向绑定
    -->
    <!-- ref是为了获取el-dialog组件内部关闭按钮等信息，用this.$refs.passDialog获取
    @close属性是在关闭弹窗时，调用什么方法
    -->
    <el-dialog
      :visible.sync="showDialog"
      title="修改密码"
      width="500px"
      append-to-body
      @close="btnCancel"
    >
      <!-- 放置表单 -->
      <el-form ref="passForm" label-width="80px" :model="passForm" :rules="passRules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" size="small" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" size="small" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" size="small" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="btnOK">确认修改</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import router from '@/router'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false, // 控制对话框（修改密码）弹层的显示
      passForm: {
        oldPassword: '', // 旧密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码
      },
      passRules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        newPassword: [{
          required: true,
          message: '新密码不能为空',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          trigger: 'blur'
        }],
        confirmPassword: [{
          required: true, message: '确认密码不能为空', trigger: 'blur'
        }, {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.passForm.newPassword === value) {
              callback()
            } else {
              callback(new Error('新密码与确认密码不一致'))
            }
          }
        }]
      }
    }
  },
  computed: {
    // ...mapGetters 是 Vue.js 中的一个辅助函数，用于在组件中映射 Vuex store 中的 getters 方法到组件的计算属性中
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      router.push('/login')
    },
    updatePassword() {
      this.showDialog = true
    },
    btnOK() {
      this.$refs.passForm.validate(async isOK => {
        if (isOK) {
          // 调用接口
          await updatePassword(this.passForm)
          // 提示消息，或者用alert
          this.$message.success('修改密码成功')
          // 成功
          // this.$refs.passForm.resetFields() // 重置表单
          // // 关闭弹窗
          // this.showDialog = false
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.passForm.resetFields() // 重置表单
      this.showDialog = false // 关闭弹窗
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .name {
          // 用户名称距离右侧距离
          margin-right: 10px;
          font-size: 16px;
        }

        .userName {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #04c9be;
          border-radius: 50%;
          color: #fff;
          margin-right: 5px;
        }

        .el-icon-setting {
          font-size: 20px;
        }

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 6px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
