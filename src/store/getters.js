const getters = {
  isLogin: state => state.user.isLogin,
  isBind: state => state.user.isBind,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  userConfig: state => state.user.userConfig,
  openid: state => state.user.openid,

  sysinfo: state => state.sys.sysinfo,
  platform: state => state.sys.platform,
  screenWidth: state => state.sys.screenWidth,
  screenHeight: state => state.sys.screenHeight,

  BLEInformation: state => state.ble.BLEInformation,
  bleList: state => state.ble.bleList,
  bleServices: state => state.ble.bleServices,
  service: state => state.ble.service,
  bleConnectStatus: state => state.ble.bleConnectStatus,

  attributeObj: state => state.goods.attributeObj,
  goodsCart: state => state.goods.goodsCart,

  addressInfo: state => state.address.addressInfo,

  deliveryInfo: state => state.delivery.deliveryInfo,

  navList: state => state.permission.navList,
  permissionList: state => state.permission.permissionList,


}
export default getters
