import Vue from 'vue'
import Vuex from 'vuex'
import dict from '@/store/dict'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { dict }
})
