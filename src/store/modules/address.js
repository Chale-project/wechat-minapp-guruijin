const state = {
  addressInfo: {},
}

const mutations = {

  SET_ADDRESS_OPTIONS(state, data) {
    state.addressInfo = data
  }

}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
