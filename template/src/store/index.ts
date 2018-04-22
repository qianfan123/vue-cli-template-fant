import Vue from 'vue'
import Vuex from 'vuex'
import { state, getters, actions, mutations } from './global'
import StoragePlugin from './StoragePlugin'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [StoragePlugin],

  state,
  getters,
  mutations,
  actions,

  modules: {
  }
})

export default store
