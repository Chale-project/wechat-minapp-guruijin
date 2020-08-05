import { getAppNav, getAppAccountAuth } from '@/common/api'
import util from '@/common/utils'

const state = {
    navList: [{
        menuName: "公司介绍",
        menuIcon: "/static/images/icon_home_company.png",
        menuPath: "/pages/subPackageC/about/about"
    },
    {
        menuName: "最新动态",
        menuIcon: "/static/images/icon_home_trends.png",
        menuPath: "/pages/subPackageC/trends/trends"
    },
    {
        menuName: "产品介绍",
        menuIcon: "/static/images/icon_home_production.png",
        menuPath: "/pages/subPackageC/production/production"
    }],
    permissionList: [],
}

const mutations = {

    SET_NAV_LIST(state, list) {
        state.navList = list
    },

    SET_PERMISSION_LIST(state, list) {
        state.permissionList = list
    },

}

const actions = {

    /**
     * 获取当前登陆账号权限菜单
     */
    GetAuthNavList({ commit }) {
        return new Promise((resolve, reject) => {
            return getAppNav().then((res) => {
                commit('SET_NAV_LIST', res.menuList)
                resolve()
            }).catch((err) => {
                reject(err);
            })
        })
    },

    /**
     * 获取当前登录用户权限列表
     */
    GetPermissionList({ commit }) {
        return new Promise((resolve, reject) => {
            return getAppAccountAuth().then(res => {
                commit('SET_NAV_LIST', res)
                resolve()
            }).catch((err) => {
                reject(err);
            })
        })
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
