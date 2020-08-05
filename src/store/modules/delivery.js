const state = {
  deliveryInfo: {},
}

const mutations = {

  SET_DELIVERY_INFO(state, data) {
    state.deliveryInfo = data
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
