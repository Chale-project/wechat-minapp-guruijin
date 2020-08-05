import util from '@/common/utils'

const state = {
  BLEInformation: {
    platform: "",
    deviceId: "",
    writeCharaterId: "",
    writeServiceId: "",
    notifyCharaterId: "",
    notifyServiceId: "",
    readCharaterId: "",
    readServiceId: ""
  },

  bleList: [],
  bleServices: [],
  service: {
    serviceIndex: 0,
    writeCharacter: false,
    readCharacter: false,
    notifyCharacter: false
  },
  bleConnectStatus: !1
}

const mutations = {

  SET_BLEINFO_PLATFORM(state, platform) {
    state.BLEInformation.platform = platform
  },

  SET_BLEINFO_DEVICEID(state, deviceId) {
    state.BLEInformation.deviceId = deviceId
  },

  SET_BLEINFO_WRITECHARATERID(state, writeCharaterId) {
    state.BLEInformation.writeCharaterId = writeCharaterId
  },

  SET_BLEINFO_WRITESERVICEID(state, writeServiceId) {
    state.BLEInformation.writeServiceId = writeServiceId
  },

  SET_BLEINFO_NOTIFYCHARATERID(state, notifyCharaterId) {
    state.BLEInformation.notifyCharaterId = notifyCharaterId
  },

  SET_BLEINFO_NOTIFYSERVICEID(state, notifyServiceId) {
    state.BLEInformation.notifyServiceId = notifyServiceId
  },

  SET_BLEINFO_READCHARATERID(state, readCharaterId) {
    state.BLEInformation.readCharaterId = readCharaterId
  },

  SET_BLEINFO_READSERVICEID(state, readServiceId) {
    state.BLEInformation.readServiceId = readServiceId
  },

  SET_BLELIST(state, list) {
    state.bleList = list
  },

  SET_BLESERVICES(state, list) {
    state.bleServices = list
  },

  SET_SERVICE_INDEX(state, index) {
    state.service.serviceIndex = index
  },

  SET_SERVICE_WRITECHARACTER(state, boolean) {
    state.service.writeCharacter = boolean
  },

  SET_SERVICE_READCHARACTER(state, boolean) {
    state.service.readCharacter = boolean
  },

  SET_SERVICE_NOTIFYCHARACTER(state, boolean) {
    state.service.notifyCharacter = boolean
  },

  SET_BLECONNECTSTATUS(state, boolean) {
    state.bleConnectStatus = boolean
  },
}

const actions = {
  /**
   * 初始化蓝牙模块
   */
  OpenBluetoothAdapter({ dispatch }) {
    return new Promise((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: (res) => {
          dispatch('GetBluetoothAdapterState')
          resolve(res)
        },
        fail: (err) => {
          util.showToastError("蓝牙初始化失败，请打开蓝牙")
          reject(err)
        }
      })
    })
  },

  /**
  * 获取本机蓝牙适配器状态
  */
  GetBluetoothAdapterState({ dispatch }) {
    return new Promise((resolve, reject) => {
      uni.getBluetoothAdapterState({
        success: (res) => {
          if (res.available) {
            if (res.discovering) {
              uni.stopBluetoothDevicesDiscovery()
            }
            dispatch('CheckPemission')
            resolve(res)
          } else {
            util.showToastError("本机蓝牙不可用，请检查蓝牙链接")
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },


  /**
  * 检测平台版本
  */
  CheckPemission({ dispatch, commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      const platform = rootGetters.sysinfo.platform
      const system = rootGetters.sysinfo.system
      if (platform == "ios") {
        dispatch('SearchStartBluetoothDevicesDiscovery')
        resolve()
      } else if (platform == "android") {
        app.globalData.platform = "android"
        console.log(system.substring(system.length - (system.length - 8), system.length - (system.length - 8) + 1))
        if (system.substring(system.length - (system.length - 8), system.length - (system.length - 8) + 1) > 5) {
          util.getSetting().then(res => {
            if (!res.authSetting['scope.userLocation']) {
              util.authorize('scope.userLocation').then(res => {
                dispatch('SearchStartBluetoothDevicesDiscovery')
                resolve()
              })
            } else {
              dispatch('SearchStartBluetoothDevicesDiscovery')
              resolve()
            }
          })
        }
      }
    })
  },

  /**
  * 搜索附近的蓝牙设备
  */
  SearchStartBluetoothDevicesDiscovery({ commit }) {
    return new Promise((resolve, reject) => {
      util.showLoading('蓝牙搜索中')
      uni.startBluetoothDevicesDiscovery({
        success: (res) => {
          setTimeout(() => {
            uni.getBluetoothDevices({
              success: (res) => {
                let devices = res.devices.filter(item => {
                  return item.name != "未知设备"
                })
                devices.map(item => {
                  item.loading = false
                  item.status = false
                })

                commit('SET_BLELIST', devices)
                util.hideLoading()
                uni.stopPullDownRefresh();
                resolve()
              },
            })
          }, 1e3)
        },
      })
    })
  },

  /**
  * 连接低功耗蓝牙设备
  */
  CreateBLEConnection({ dispatch, commit }, deviceId) {
    console.log(deviceId)
    return new Promise((resolve, reject) => {

      uni.stopBluetoothDevicesDiscovery();

      commit('SET_SERVICE_INDEX', 0)
      commit('SET_SERVICE_WRITECHARACTER', false)
      commit('SET_SERVICE_READCHARACTER', false)
      commit('SET_SERVICE_NOTIFYCHARACTER', false)

      commit('SET_BLECONNECTSTATUS', false)

      util.showLoading("连接中");
      uni.createBLEConnection({
        deviceId: deviceId,
        success: (res) => {
          console.log(res);
          commit('SET_BLEINFO_DEVICEID', deviceId);
          dispatch('GetBLEDeviceServices');
          resolve(res)
        },
        fail: (err) => {
          console.log(err);
          util.showToastError("连接失败");
          util.hideLoading();
          reject(err)
        },
        complete: (err) => {
          console.log(err);
          reject(err)
        }
      })
    })
  },


  /**
   * 获取蓝牙设备所有服务(service)
   */
  GetBLEDeviceServices({ dispatch, commit, rootGetters }) {
    return new Promise((resolve, reject) => {

      uni.getBLEDeviceServices({
        deviceId: rootGetters.BLEInformation.deviceId,
        success: (res) => {
          console.log(res);
          commit('SET_BLESERVICES', res.services);
          dispatch('GetBLEDeviceCharacteristics');
          resolve(res)
        },
        fail: (err) => {
          console.log(err);
          reject(err)
        },
        complete: (err) => {
          console.log(err);
          reject(err)
        }
      })
    })
  },

  /**
   * 获取蓝牙设备某个服务中所有特征值(characteristic)
   */
  GetBLEDeviceCharacteristics({ dispatch, commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      const _list = rootGetters.bleServices
      let _index = rootGetters.service.serviceIndex
      let _write = rootGetters.service.writeCharacter
      let _read = rootGetters.service.readCharacter
      let _notify = rootGetters.service.notifyCharacter
      uni.getBLEDeviceCharacteristics({
        deviceId: rootGetters.BLEInformation.deviceId,
        serviceId: _list[_index].uuid,
        success: (res) => {
          console.log(res)
          for (let i = 0; i < res.characteristics.length; ++i) {
            const properties = res.characteristics[i].properties
            const item = res.characteristics[i].uuid
            if (!_notify) {
              if (properties.notify) {
                commit('SET_BLEINFO_NOTIFYCHARATERID', item)
                commit('SET_BLEINFO_NOTIFYSERVICEID', _list[_index].uuid)
                _notify = true
              }
            }
            if (!_write) {
              if (properties.write) {
                commit('SET_BLEINFO_WRITECHARATERID', item)
                commit('SET_BLEINFO_WRITESERVICEID', _list[_index].uuid)
                _write = true
              }
            }
            if (!_read) {
              if (properties.read) {
                commit('SET_BLEINFO_READCHARATERID', item)
                commit('SET_BLEINFO_READSERVICEID', _list[_index].uuid)
                _read = true
              }
            }
          }
          if (!_write || !_notify || !_read) {
            _index++
            commit('SET_SERVICE_INDEX', _index)
            commit('SET_SERVICE_WRITECHARACTER', _write)
            commit('SET_SERVICE_READCHARACTER', _read)
            commit('SET_SERVICE_NOTIFYCHARACTER', _notify)
            if (_index == _list.length) {
              util.showToastError("找不到该读写的特征值");
            } else {
              dispatch('GetBLEDeviceCharacteristics')
            }
          } else {
            commit('SET_BLECONNECTSTATUS', true)
            resolve()
          }
          util.hideLoading();

        }, fail: (err) => {
          console.log(err)
          reject(err)
        }, complete: (err) => {
          console.log("write:" + rootGetters.BLEInformation.writeCharaterId)
          console.log("read:" + rootGetters.BLEInformation.readCharaterId)
          console.log("notify:" + rootGetters.BLEInformation.notifyCharaterId)
        }
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
