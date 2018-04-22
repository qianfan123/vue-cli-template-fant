/**
 * Created by neil on 2017/5/12.
 */
import axios from 'axios'
import store from '../store'
import CommonUtil from 'util/CommonUtil'
import ShortcutMgr from 'mgr/ShortcutMgr'

const qs = require('qs')
axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'repeat' })
}
axios.defaults.timeout = 60000

export default class ApiClient {
  static file(baseUrl: string) {
    return axios.create({
      baseURL: baseUrl
    })
  }

  static server(baseUrl: string) {
    // 可以在这里拦截
    return ApiClient.create(baseUrl)
  }

  static create(baseUrl: string) {
    let instance = axios.create({
      baseURL: baseUrl,
      withCredentials: true
    })

    instance.interceptors.request.use(function (config) {
      let traceId
      if (store.state.user) {
        traceId = store.state.user.id + '_' + new Date().getTime()
      } else {
        traceId = CommonUtil.uuid()
      }
      config.headers['trace_id'] = traceId
      return config
    }, function (error) {
      return Promise.reject(error)
    })

    instance.interceptors.response.use(function (response) {
      if (response.data instanceof ArrayBuffer) {
        return response
      }
      if (response.data.success) {
        return response
      } else {
        let error = new Error()
        if (response.data.message) {
          error.message = response.data.message[0]
        } else {
          error.message = response.status + '服务器内部异常'
        }
        (error as any).response = response.data
        throw error
      }
    }, function (error) {
      if (!error.response) {
        error.message = '请检查网络设置'
        return Promise.reject(error)
      }
      switch (error.response.status) {
        case 101:
          break
        case 401:
          error.message = '登录已过期,请重新登录!'
          ShortcutMgr.logout()
          break
        case 403:
          error.message = '禁止访问!'
          break
        case 503:
          error.message = '服务器升级中!'
          break
        case 500:
          error.message = '服务内部异常!'
          break
        default:
          error.message = '未知错误'
      }
      return Promise.reject(error)
    })
    return instance
  }
}
