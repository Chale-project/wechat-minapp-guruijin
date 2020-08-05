const state = {
  sysinfo: {},
}

const mutations = {

  SET_SYSTEM_INFO_SYNC(state, info) {
    state.sysinfo = info
  }

}

const actions = {
  /**
   * getSystemInfoSync
   */
  GetSystemInfoSync({ commit }) {
    return new Promise((resolve, reject) => {
      const _info = uni.getSystemInfoSync()
      commit('SET_SYSTEM_INFO_SYNC', _info)
      resolve(_info)
    })

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
