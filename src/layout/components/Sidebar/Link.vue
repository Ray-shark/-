<template>
<!-- <component :is="type">：这是 Vue.js 中的动态组件语法，:is="type" 绑定了一个动态的组件类型，这个组件类型会根据 type 变量的值来动态切换不同的组件。 -->
<!-- v-bind="linkProps(to)"：这里使用 v-bind 指令将 linkProps(to) 的返回值绑定到 <component> 组件上，它会将 linkProps(to) 返回的对象中的属性作为组件的属性进行传递。 -->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
