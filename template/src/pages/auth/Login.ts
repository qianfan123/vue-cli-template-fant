import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    // 你的组件
  }
})
export default class Login extends Vue {
  mounted() {
    console.log('登录界面')
  }
}
