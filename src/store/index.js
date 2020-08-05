import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import sys from './modules/sys'
import ble from './modules/ble'
import user from './modules/user'
import goods from './modules/goods'
import address from './modules/address'
import delivery from './modules/delivery'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    sys,
    ble,
    user,
    goods,
    address,
    delivery,
    permission,
  },
  getters
})

export default store
