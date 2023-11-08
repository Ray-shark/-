import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// require.context(目标值，是否扫描子目录，正则表达式)扫描目录中的文件
const req = require.context('./svg', false, /\.svg$/) // 返回一个封装的函数（包含了所有svg图片的信息）

// 将该函数拆成路径文件信息，返回一个数组
// console.log(req.keys())

// 当新增了svg图片时，执行下面部分代码，将所有的svg图片引入到项目中
// 将拆成的数组的每一项（每一个svg路径文件信息）遍历，返回一个数组（每一项都是封装成的svg的函数）
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req) // 调用函数

// webpack svg-sprite-loader 打包所有svg到一个svg上，生成symbol
// 使用时通过<svg-icon icon-class="xxx">, icon组件中的<use :xlink:href="iconName" />
// iconName计算属性会根据symbol中的id去找到对应的svg图片
