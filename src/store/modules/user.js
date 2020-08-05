import { getOpenIdByCode, decryptUserInfoBindWechat, loginUnified } from '@/common/api'
import util from '@/common/utils'

const state = {
  isLogin: !1,
  isBind: !1,
  token: uni.getStorageSync('token') || null,
  userInfo: uni.getStorageSync('userInfo') || {},
  openid: null,
  userConfig: uni.getStorageSync('userConfig') || {
    gender: true,
    name: true,
    birthday: true,
    pca: true,
    wxNumber: true,
  },
}

const mutations = {

  SET_IS_LOGIN(state, status) {
    state.isLogin = status
  },

  SET_IS_BIND(state, status) {
    state.isBind = status
  },

  SET_TOKEN(state, token) {
    state.token = token
  },

  SET_USER_INFO(state, userinfo) {
    state.userInfo = userinfo;
  },

  SET_USER_CONFIG(state, userconfig) {
    state.userConfig = userconfig;
  },

  SET_OPENID(state, openid) {
    state.openid = openid;
  },
}

const actions = {

  /**
   * 检测是否登录
   */
  CheckLogin({ commit, state }) {
    return new Promise((resolve, reject) => {
      try {
        if (state.token && state.userInfo) {
          commit('SET_IS_LOGIN', !0)
        }
        else {
          commit('SET_IS_LOGIN', !1)
        }
        resolve(state.isLogin)
      }
      catch (err) {
        reject(err)

      }
    })
  },


  /**
   * 手机号或账号密码统一登录
   */
  UnifiedLogin({ dispatch, commit }, data) {
    return new Promise((resolve, reject) => {
      return loginUnified(data).then((res) => {
        const _token = res.result.token.access_token;
        const _userInfo = res.result.userInfo;
        const _userConfig = res.result.config;

        uni.setStorageSync("loginData", data);

        uni.setStorageSync("token", _token);
        uni.setStorageSync("userInfo", _userInfo);
        uni.setStorageSync("userConfig", _userConfig);

        commit("SET_TOKEN", _token);
        commit("SET_USER_INFO", _userInfo);
        commit("SET_USER_CONFIG", _userConfig);

        commit('SET_IS_LOGIN', !0)
        commit('SET_IS_BIND', res.result.isBind)
        dispatch('permission/GetAuthNavList', {}, { root: true })
        dispatch('permission/GetPermissionList', {}, { root: true })
        resolve(res)
      }).catch((err) => {
        reject(err);
      })
    })
  },

  /**
   * 调用登录 根据code换取openId
   */
  GetOpenId({ commit }) {
    let code = null;
    return new Promise((resolve, reject) => {
      return util.getProvider('oauth').then(res => {
        res.provider.forEach(item => {
          switch (item) {
            case 'weixin':
              return util.login("weixin").then((res) => {
                const code = res.code
                return getOpenIdByCode(code).then((res) => {
                  commit('SET_OPENID', res.result.openid)
                  resolve(res)
                }).catch((err) => {
                  reject(err);
                })
              })
            case 'alipay':
              // TODO
              resolve()
              return item
            case 'qq':
              // TODO
              return item
            case 'sinaweibo':
              // TODO
              return item
            case 'xiaomi':
              return item
          }
        })
      })
    })
  },

  /**
   * 解密用户信息并登录
   */
  DecryptUserInfoBind({ commit }, _data) {
    return new Promise((resolve, reject) => {
      return decryptUserInfoBindWechat(_data).then((res) => {
        const _token = res.result.token.access_token;
        const _userInfo = res.result.userInfo;
        const _userConfig = res.result.config;

        uni.setStorageSync("token", _token);
        uni.setStorageSync("userInfo", _userInfo);
        uni.setStorageSync("userConfig", _userConfig);

        commit("SET_TOKEN", _token);
        commit("SET_USER_INFO", _userInfo);
        commit("SET_USER_CONFIG", _userConfig);

        commit('SET_IS_LOGIN', !0)
        commit('SET_IS_BIND', !0)
        resolve(res)
      }).catch((err) => {
        reject(err);
      })
    })
  },


  // 注销登录
  Logout({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        uni.removeStorageSync("token");
        uni.removeStorageSync("userInfo");
        uni.removeStorageSync("userConfig");
        uni.removeStorageSync("loginData");

        commit("SET_TOKEN", null);
        commit("SET_USER_INFO", {});
        commit("SET_USER_CONFIG", {});

        commit('SET_IS_LOGIN', !1)
        commit('SET_IS_BIND', !1)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
