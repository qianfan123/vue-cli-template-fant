/**
 * 对vuex state进行持久化存储，主要用来跨页面间调用
 *
 * @param store
 */
import CommonUtil from 'util/CommonUtil'

const storagePlugin = (store) => {
  var key = 'vuex'

  // 从缓存中读取
  var storageState = sessionStorage.getItem(key)
  let initState =　JSON.parse(JSON.stringify(store.state))
  Object.assign(initState, storageState)
  store.replaceState(initState)

  store.subscribe((mutation, state) => {
    sessionStorage.setItem(key, state)
  })
}

export default storagePlugin
