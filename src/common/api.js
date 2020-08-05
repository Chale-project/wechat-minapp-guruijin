import requestClass from './requestClass'
import uploadFileClass from './fileUploadClass'
const Request = new requestClass
const Upload = new uploadFileClass


/**
 * 公共接口
 */
// 文件上传
export const uploadFile = (params) => Upload.upload({ url: 'basic/file/upload/local', files: params })

// 获取短信验证码
export const getSmsVerifyCode = (mobile) => Request.send({ url: 'loginAndRegister/registerSmsSend/' + mobile })

// 存储用户小程序formId
export const saveFormId = (id) => Request.send({ url: 'customerData/saveFormId/' + id })

/**
 * 系统菜单
 */
// 获取当前应用菜单列表
export const getAppMenu = () => Request.send({ url: 'basic/menu/list' })

// 获取当前应用导航菜单
export const getAppNav = () => Request.send({ url: 'basic/menu/nav' })

// 获取用户所有权限
export const getAppAccountAuth = () => Request.send({ url: 'basic/menu/perms/list' })

/**
 * 系统角色（岗位）
 */
// 添加当前应用角色
export const addAppRole = (params) => Request.send({ url: 'basic/role/app/new/add', data: params, type: 'post' })

// 获取当前应用角色信息
export const getAppRoleInfo = (id) => Request.send({ url: 'basic/role/app/new/info/' + id })

// 删除当前应用角色
export const deleteAppRole = (id) => Request.send({ url: 'basic/role/app/remove/' + id, type: 'delete' })

// 设置当前应用角色状态（启用禁用）
export const setAppRoleState = (params) => Request.send({ url: 'basic/role/app/new/revise/' + params.status + '/' + params.id, type: 'put' })

// 修改当前应用角色
export const modifyAppRole = (params) => Request.send({ url: 'basic/role/app/new/modify', data: params, type: 'put' })

// 获取当前应用角色列表分页
export const getAppRoleList = (params) => Request.send({ url: 'basic/role/app/new/pageList', data: params, type: 'post' })

// 获取当前应用所有角色列表
export const getAppRoleListAll = () => Request.send({ url: 'basic/role/app/select' })

/**
 * 系统操作员（账号）
 */
// 注册当前应用操作员
export const regAppOperator = (params) => Request.send({ url: 'loginAndRegister/register/operator', data: params, type: 'post' })

// 添加当前应用操作员
export const addAppOperator = (params) => Request.send({ url: 'basic/operator/app/add', data: params, type: 'post' })

// 获取当前应用操作员信息
export const getAppOperatorInfo = (id) => Request.send({ url: 'basic/operator/app/info/' + id })

// 删除当前应用操作员
export const deleteAppOperator = (id) => Request.send({ url: 'basic/operator/app/remove/' + id, type: 'delete' })

// 设置当前应用操作员状态（启用禁用）
export const setAppOperatorState = (params) => Request.send({ url: 'basic/operator/app/status/' + params.status + '/' + params.id, type: 'put' })

// 修改当前应用操作员
export const modifyAppOperator = (params) => Request.send({ url: 'basic/operator/app/modify', data: params, type: 'put' })

// 修改当前应用操作员密码
export const modifyAppOperatorPassword = (params) => Request.send({ url: 'customerData/modifyLoginPwd/' + params.userNumber + '/' + params.oldPassword + '/' + params.newPassword, type: 'put' })

// 获取当前应用操作员列表
export const getAppOperatorList = (params) => Request.send({ url: 'basic/operator/app/new/pageList', data: params, type: 'post' })

/**
 * 系统设置
 */
// 获取属性数据
export const getPropertyData = () => Request.send({ url: 'account/properties/list' })

// 修改属性数据
export const modifyPropertyData = (params) => Request.send({ url: 'account/properties/revise', data: params, type: 'post' })

// 获取当前操作员类型config配置
export const getPropertyConfig = () => Request.send({ url: 'account/properties/config' })

/**
 * 打印
 */
// 获取商品打印码
export const getGoodsPrintCode = (params) => Request.send({ url: 'goods/code/getCode/' + params.id + '/' + params.count })

/**
 * 登录相关
 */
// 通过code获取openid
export const getOpenIdByCode = (code) => Request.send({ url: 'loginAndRegister/getOpenIdByCode/' + code })

// 通过encryptedData，session_key，iv解密用户信息， 在满足UnionID下发条件的情况下会返回 绑定微信
export const decryptUserInfoBindWechat = (params) => Request.send({ url: 'customerData/bindingWeChat', data: params, type: 'post' })

// 通过encryptedData，session_key，iv，openid解密用户手机号
//获取微信手机号
export const bindWxMobile = (params) => Request.send({ url: 'customerData/binding/phone', data: params, type: 'post' })

// 统一登录接口（手机号或账号密码）
export const loginUnified = (params) => Request.send({ url: 'loginAndRegister/login', data: params, type: 'post' })

/**
 * 首页统计
 */
// 获取商品统计数据
export const getHomeStatisticsView = () => Request.send({ url: 'statistics/home/operate' })

/**
 * 商品分类
 */
// 添加商品分类
export const addCategory = (params) => Request.send({ url: 'category/add', data: params, type: 'post' })

// 编辑商品分类
export const editCategory = (params) => Request.send({ url: 'category/modify', data: params, type: 'put' })

// 删除商品分类
export const deleteCategory = (ids) => Request.send({ url: 'category/deleted/' + ids, type: 'delete' })

// 排序商品分类
export const sortCategory = (params) => Request.send({ url: 'category/sort/' + params.id + '/' + params.type, type: 'put' })

// 获取所有分类list
export const getCategoryList = () => Request.send({ url: 'category/list/all' })

// 获取一级分类list
export const getFirstCategoryList = () => Request.send({ url: 'category/list/one' })

/**
 * 商品
 */
// 添加商品
export const addGoods = (params) => Request.send({ url: 'goods/add', data: params, type: 'post' })

// 获取商品列表
export const getGoodsList = (params) => Request.send({ url: 'goods/page', data: params, type: 'post' })

// 获取商品详情
export const getGoodsInfo = (id) => Request.send({ url: 'goods/info/' + id })

// 获取订单所需商品列表
export const getGoodsListOrder = (params) => Request.send({ url: 'goods/page/sell', data: params, type: 'post' })

// 获取销售商品详情
export const getGoodsInfoOrder = (id) => Request.send({ url: 'goods/info/sell/' + id })

/**
 * 商品规格属性
 */
// 添加规格属性
export const addGoodAttribute = (params) => Request.send({ url: 'goods/attribute/add', data: params, type: 'post' })

// 获取所有规格属性
export const getGoodAttributeList = (id) => Request.send({ url: 'goods/attribute/list/' + id })

// 添加商品尺寸
export const addGoodSize = (params) => Request.send({ url: 'goods/parameter/add', data: params, type: 'post' })

// 获取所有商品尺寸
export const getGoodSizeListAll = (id) => Request.send({ url: 'goods/parameter/list/' + id })

// 添加装件数
export const addGoodQuantity = (params) => Request.send({ url: 'goods/battlementsAmount/add', data: params, type: 'post' })

// 获取所有装件数
export const getGoodQuantityListAll = (id) => Request.send({ url: 'goods/battlementsAmount/list/' + id })

/**
 * 配送员相关
 */
// 添加配送员
export const registerDelivery = (params) => Request.send({ url: 'deliveryman/add', data: params, type: 'post' })

// 获取配送员详情
export const getDeliveryInfo = (id) => Request.send({ url: 'deliveryman/info/' + id })

// 删除配送员
export const deleteDelivery = (id) => Request.send({ url: 'deliveryman/deleted/' + id, type: 'delete' })

// 启用禁用
export const setDeliveryState = (params) => Request.send({ url: 'deliveryman/revise/' + params.status + '/' + params.id, type: 'put' })

// 修改配送员
export const modifyDelivery = (params) => Request.send({ url: 'deliveryman/modify', data: params, type: 'put' })

// 获取配送员列表
export const getDeliveryList = (params) => Request.send({ url: 'deliveryman/page', data: params, type: 'post' })

// 获取所有可配送的配送员
export const getDeliveryListAll = () => Request.send({ url: 'deliveryman/list' })

/**
 * 客户相关
 */
// 添加客户
export const registerCustomer = (params) => Request.send({ url: 'customerData/register/client', data: params, type: 'post' })

// 获取客户详情
export const getCustomerInfo = (id) => Request.send({ url: 'customerData/info/' + id })

// 删除客户
export const deleteCustomer = (id) => Request.send({ url: 'customerData/deleted/' + id, type: 'delete' })

// 启用禁用
export const setCustomerState = (params) => Request.send({ url: 'customerData/revise/' + params.status + '/' + params.id, type: 'put' })

// 修改客户
export const modifyCustomer = (params) => Request.send({ url: 'customerData/modify', data: params, type: 'put' })

// 获取客户列表
export const getCustomerList = (params) => Request.send({ url: 'customerData/page', data: params, type: 'post' })

// 获取所有客户列表
export const getCustomerListAll = () => Request.send({ url: 'customerData/list' })

// 获取客户地址列表
export const getCustomerAddressListAll = (id) => Request.send({ url: 'address/list/' + id })

// 获取客户地址信息
export const getCustomerAddressInfo = (id) => Request.send({ url: 'address/default/by/' + id })

/**
 * 客户地址
 */
// 添加地址
export const addAddress = (params) => Request.send({ url: 'address/add', data: params, type: 'post' })

// 获取地址详情
export const getAddressInfo = (id) => Request.send({ url: 'address/info/' + id })

// 设为默认
export const setAddressState = (id) => Request.send({ url: 'address/default/' + id })

// 删除地址
export const deleteAddress = (id) => Request.send({ url: 'address/deleted/' + id, type: 'delete' })

// 修改地址
export const modifyAddress = (params) => Request.send({ url: 'address/modify', data: params, type: 'put' })

/**
 * 订单录入
 */
// 添加销售订单
export const addSalesOrder = (params) => Request.send({ url: 'order/sell/add', data: params, type: 'post' })

// 获取订单详情
export const getSalesOrderInfo = (id) => Request.send({ url: 'order/sell/info/' + id })

// 获取订单列表
export const getSalesOrderList = (params) => Request.send({ url: 'order/sell/page', data: params, type: 'post' })

/**
 * 扫码入库
 */
// 添加入库商品
export const addGoodsStoreIn = (ids) => Request.send({ url: 'order/storage/scanSpeId/add/' + ids, type: 'put' })

/**
 * 扫码出库
 */
// 添加出库商品
export const addGoodsStoreOut = (params) => Request.send({ url: 'order/storage/scan/truckCar/spe', data: params, type: 'post' })

// 获取出入库记录列表
export const getOutInStoreList = (params) => Request.send({ url: 'order/storage/page', data: params, type: 'post' })

// 获取出入库记录列表
export const getOutInStoreInfo = (id) => Request.send({ url: 'order/storage/info/' + id })

// 开始配送
export const startDelivery = (id) => Request.send({ url: 'deliveryman/start/only/' + id, type: 'put' })

// 确认送达
export const sureDelivery = (id) => Request.send({ url: 'deliveryman/delivered/' + id, type: 'put' })

