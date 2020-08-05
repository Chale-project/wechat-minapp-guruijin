const state = {
  attributeObj: {},
  goodsCart: []
}

const mutations = {
  SET_ATTRIBUTE_OPTIONS(state, data) {
    state.attributeObj = data
  },

  SET_GOODS_CART(state, data) {
    state.goodsCart = data
  }
}

const actions = {
  // 加
  Plus({ commit, state }, data) {
    let _goodsCart = state.goodsCart;

    const _id = data.id;
    if (_goodsCart.length > 0) {
      let flag = !1;
      for (let i in _goodsCart) {
        if (_goodsCart[i].id === _id) {
          ++_goodsCart[i].number
          flag = !0;
          break;
        }
      }
      if (!flag) {
        data.number = 1
        _goodsCart.push(data);
      }
    } else {
      data.number = 1
      _goodsCart.push(data);
    }
    commit("SET_GOODS_CART", _goodsCart)
  },

  // input
  Input({ commit, state }, data) {
    let _goodsCart = state.goodsCart;
    for (let i in _goodsCart) {
      if (_goodsCart[i].id === data.id) {
        _goodsCart[i].number = data.number
      }
    }
    commit("SET_GOODS_CART", _goodsCart)
  },

  // 减
  Minus({ commit, state }, data) {
    let _goodsCart = state.goodsCart;
    for (let i in _goodsCart) {
      if (_goodsCart[i].id === data.id) {
        if (_goodsCart[i].number > 0) {
          --_goodsCart[i].number;
          if (_goodsCart[i].number === 0) {
            _goodsCart.splice(i, 1);
          }
        }
      }
    }
    commit("SET_GOODS_CART", _goodsCart)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
