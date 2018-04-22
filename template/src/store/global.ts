import { Commit, ActionTree } from 'vuex'

// state
export interface State {
  defaultParam?: any // 默认界面间参数传递
}

export const state: State = {
  defaultParam: null
}

/**
 * 通常不直接调用这个方法
 */
export const mutations = {
  defaultParam(state: State, param?: any) {
    state.defaultParam = param
  },

  /**
   * 清除状态，通常在退出应用时执行
   *
   * @param {State} state
   */
  clear(state: State) {
  }
}

export const getters = {
}

/**
 * 修改状态只提倡用dispatch
 */
export const actions: ActionTree<State, any> = {
  defaultParam(context: { commit: Commit }, param?: any) {
    context.commit('defaultParam', param)
  },

  clear(context: { commit: Commit }) {
    context.commit('clear')
  }
}

export default { state, getters, mutations, actions }
