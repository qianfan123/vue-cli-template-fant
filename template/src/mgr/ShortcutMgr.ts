import store from 'store/index'
import router from 'router/index'

export default class ShortcutMgr {

  /**
   * 统一注销方法
   */
  static logout() {
    router.push('/login')
    setTimeout(() => {
      store.dispatch('clear')
    }, 300)
  }
}
