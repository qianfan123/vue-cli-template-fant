import Vue from 'vue'
import Router from 'vue-router'
import store from 'store'
import Component from 'vue-class-component'
import ApiClient from 'http/ApiClient'

Vue.use(Router)

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
])

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { requiresAuth: false },
      component: resolve => require(['pages/auth/Login.vue'], resolve)
    }
  ]
})

var lastUpdate = null
var versionUpdated = false
const updateChecker = window.setInterval(() => {
  var path = window.location.pathname
  if (path.indexOf('index.html') < 0) {
    path += '/index.html'
  }
  ApiClient.file(window.location.origin).get(path).then(resp => {
    let lastModified = new Date(resp.headers['last-modified'])
    if (!isNaN(lastModified)) {
      if (lastUpdate === null) {
        lastUpdate = lastModified
      } else if (lastUpdate.getTime() !== lastModified.getTime()) {
        versionUpdated = true
        window.clearInterval(updateChecker)
      }
    }
  })
}, 60000)

router.beforeEach((to, from, next) => {
  if (versionUpdated) {
    if (to.name === 'login') {
      router.doNext(to, from, next)
      window.location.reload(true)
    } else {
      // MessageBox.info('更新啦!', '我们正在为产品而努力，刚刚已悄悄更新了版本，点击确定后会刷新界面哦 ^_^', () => {
      //   router.doNext(to, from, next)
      //   window.location.reload(true)
      // })
    }
  } else {
    router.doNext(to, from, next)
  }
})

router.doNext = function (to, from, next) {
  // 非登录用户退回登录界面
  if (!store.state.user && to.meta.requiresAuth !== false) {
    next('/login')
  } else {
    next()
  }
}

export default router
