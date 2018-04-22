/**
 * Created by neil on 2017/5/26.
 */
let scrollBarWidth

class CommonUtil {
  static apply(target) {
    for (let i = 1, j = arguments.length; i < j; i++) {
      let source = arguments[i] || {}
      if (source instanceof Array) {
        target.splice(0, target.length)
        for (let item of source) {
          target.push(item)
        }
      } else {
        for (var key in source) {
          if (source[key] instanceof Object && !(source[key] instanceof Function)) {
            if (!target.hasOwnProperty(key) || !target[key]) {
              target[key] = {}
            }
            if (source[key] instanceof Array) {
              target[key] = []
            }
            CommonUtil.apply(target[key], source[key])
          } else {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  }

  static copy(object) {
    return JSON.parse(JSON.stringify(object))
  }

  static getValueByPath(object, prop) {
    prop = prop || ''
    const paths = prop.split('.')
    let current = object
    let result = null
    for (let i = 0, j = paths.length; i < j; i++) {
      const path = paths[i]
      if (!current) break

      if (i === j - 1) {
        result = current[path]
        break
      }
      current = current[path]
    }
    return result
  }

  static valueEquals(a, b) {
    if (a === b) return true
    if (!(a instanceof Array)) return false
    if (!(b instanceof Array)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i !== a.length; ++i) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  static getQueryParam(name, url) {
    url = url || CommonUtil.getUrl()
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || ['', ''])[1].replace(/\+/g, '%20')) || null
  }

  static getUrl() {
    var index = location.href.indexOf('#')
    var href = location.href.substring(0, index)
    return href
  }

  static uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return s4() + s4() + s4() + s4() +
      s4() + s4() + s4() + s4()
  }

  static isNumeric(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj)
  }

  static loadScript(url, callback, fail) {
    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
    var script, options, s

    if (typeof url === 'object') {
      options = url
      url = undefined
    }
    s = options || {}
    url = url || s.url
    callback = callback || s.success
    script = document.createElement('script')
    script.async = s.async || true
    script.type = 'text/javascript'
    if (s.charset) {
      script.charset = s.charset
    }
    if (s.cache === false) {
      url = url + (/\?/.test(url) ? '&' : '?') + '_=' + (new Date()).getTime()
    }
    script.src = url
    head.insertBefore(script, head.firstChild)
    if (callback) {
      document.addEventListener ? script.addEventListener('load', callback, false) : script.onreadystatechange = function () {
        if (/loaded|complete/.test(script.readyState)) {
          script.onreadystatechange = null
          callback()
        }
      }
      script.onerror = function () {
        if (fail) {
          fail()
        }
      }
    }
  }

  static scrollIntoView(container, selected) {
    if (!selected) {
      container.scrollTop = 0
      return
    }

    const top = selected.offsetTop
    const bottom = selected.offsetTop + selected.offsetHeight
    const viewRectTop = container.scrollTop
    const viewRectBottom = viewRectTop + container.clientHeight

    if (top < viewRectTop) {
      container.scrollTop = top
    } else if (bottom > viewRectBottom) {
      container.scrollTop = bottom - container.clientHeight
    }
  }

  static getScrollBarWidth() {
    if (scrollBarWidth !== undefined) return scrollBarWidth

    const outer = document.createElement('div')
    outer.className = 'el-scrollbar__wrap'
    outer.style.visibility = 'hidden'
    outer.style.width = '100px'
    outer.style.position = 'absolute'
    outer.style.top = '-9999px'
    document.body.appendChild(outer)

    const widthNoScroll = outer.offsetWidth
    outer.style.overflow = 'scroll'

    const inner = document.createElement('div')
    inner.style.width = '100%'
    outer.appendChild(inner)

    const widthWithScroll = inner.offsetWidth
    outer.parentNode.removeChild(outer)
    scrollBarWidth = widthNoScroll - widthWithScroll

    return scrollBarWidth
  }

  static getKeyCode(event) {
    let eventKeyCode = event.keyCode
    if (eventKeyCode === 229 || eventKeyCode === 0) {
      if (event.code === 'NumpadAdd') {
        return 107
      } else if (event.code === 'NumpadSubtract') {
        return 109
      } else if (event.code === 'NumpadDivide') {
        return 111
      } else if (event.code === 'NumpadMultiply') {
        return 106
      }
    }
    return eventKeyCode
  }
}

export default CommonUtil
