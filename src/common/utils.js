import { uploadFileUrl, saveFormId } from '@/common/api';

/**
 * 获取打包环境中配置的服务商service：'oauth'、'share'、'payment'、'push'
 */
function getProvider(service) {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: service,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		})
	});
}

/**
 * 检查会话是否过期 //支付宝小程序无此接口
 */
function checkSession() {
	return new Promise((resolve, reject) => {
		uni.checkSession({
			success: () => {
				resolve(true);
			},
			fail: () => {
				reject(false);
			}
		})
	});
}

/**
 * 调用登录
 */
function login(provider) {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: provider,
			// #ifdef MP-ALIPAY
			scopes: 'auth_base', // 支付宝小程序需设置授权类型auth_base（静默授权）/ auth_user（主动授权）/ auth_zhima （获取用户芝麻信息）
			// #endif
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 获取微信授权项 // 不支持 5+app、H5
 */
function getSetting() {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 打开授权设置页面 // 不支持 5+app、H5
 */
function openSetting() {
	return new Promise((resolve, reject) => {
		uni.openSetting({
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 拉起授权项 // 不支持 5+app、H5、支付宝
 */
function authorize(scope) {
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope: scope,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 选择地址
 */
function chooseLocation() {
	return new Promise((resolve, reject) => {
		uni.chooseLocation({
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 获取经纬度
 */
function getLocation() {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: "gcj02",
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		});
	})
}

/**
 * 调用获取用户信息接口，需要button授权
 */
function getUserInfo(provider) {
	return new Promise((resolve, reject) => {
		uni.getUserInfo({
			provider: provider,
			// #ifdef MP-WEIXIN || MP-TOUTIAO
			withCredentials: true,
			lang: 'zh_CN',
			// #endif
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

/**
 * 调用选择图片接口
 */
function chooseImage(count) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: count,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				// tempFilePath可以作为img标签的src属性显示图片
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

/**
 * 调用上传图片接口
 */
function uploadFile(f, i) {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: uploadFileUrl,
			filePath: f[i],
			header: {
				'token': uni.getStorageSync('token')
			},
			name: 'file',
			formData: null,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

/**
 * 统一支付
 */
function requestPayment(provider, payParam) {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: provider,
			// #ifdef APP-PLUS || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
			orderInfo: payParam.orderInfo,
			// #endif

			// #ifdef MP-WEIXIN
			timeStamp: payParam.timeStamp,
			nonceStr: payParam.nonceStr,
			package: payParam.package,
			signType: payParam.signType,
			paySign: payParam.paySign,
			// #endif

			// #ifdef MP-BAIDU
			bannedChannels: payParam.bannedChannels, // 仅百度小程序需要隐藏的支付方式(['Alipay','BDWallet','WeChat'])
			// #endif

			// #ifdef MP-TOUTIAO
			service: payParam.service, // 1:头条小程序支付；3:微信支付；4:支付宝支付
			_debug: 1,
			getOrderStatus: (ttRes) => { // 商户前端实现的查询支付订单状态方法（该方法需要返回个Promise对象）。 service=3、4时不需要传。
				resolve(ttRes);
			},
			// #endif

			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			},
			complete: () => {
				reject();
			}
		})
	})
}

/**
 * 储存formid
 */
function saveFormid(id) {
	if (id === 'the formId is a mock one') return false;
	saveFormId(id)
}


function redirectTo(url) {
	uni.redirectTo({
		url: url
	});
}

function navigateTo(url) {
	uni.navigateTo({
		url: url
	});
}

function navigateBack(n = 1) {
	uni.navigateBack({
		delta: n
	});
}

function reLaunch(url) {
	uni.reLaunch({
		url: url
	});
}

function showToastSuccess(msg) {
	uni.showToast({
		title: msg,
		icon: 'success',
		duration: 2000
	})
}

function showToastError(msg) {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: 3000
	})
}


function showLoading(msg) {
	uni.showLoading({
		title: msg || '加载中',
	})
}

function hideLoading() {
	uni.hideLoading()
}

function setNavigationBarTitle(title) {
	uni.setNavigationBarTitle({
		title: title || "固瑞锦建材"
	})
}

function makePhoneCall(phone) {
	uni.makePhoneCall({
		phoneNumber: phone
	})
}

//支付成功后跳转
function goToPaySuccess(url = "/pages/success/success") {
	redirectTo(url);
}


function getQueryString(url, key) {
	var _url = decodeURIComponent(url)
	var reg = new RegExp("(^|&|/?)" + key + "=([^&|/?]*)(&|/?|$)", 'i');
	var result = _url.substr(1).match(reg);
	return result ? result[2] : null;
}



function mobileToStar(mobile) {
	var str = mobile.substring(0, 3) + "****" + mobile.substring(7, 11);
	return str;
}

function dateTimeStr(time) {
	var str = time.substring(5);
	return str;
}

function setBeforeDate(n) {
	var myDate = new Date()
	var year = myDate.getFullYear() - n
	return new Date(year, 0, 1).getTime()
}

function setAfterDate(n) {
	var myDate = new Date()
	var year = myDate.getFullYear() + n
	return new Date(year, 11, 31).getTime()
}

function strToObj(str) {
	let obj = {},
		_str = decodeURIComponent(str),
		_arr = _str.split('&');
	for (let i in _arr) {
		obj[_arr[i].split("=")[0]] = _arr[i].split("=")[1];
	}
	return obj;
}

function moneyFormat(money) {
	if (isNaN(money)) {
		return "0.00"
	}
	const formatMoney = (money / 100).toFixed(2)
	return formatMoney;
}

function formatTime(timeStamp) {
	var date = new Date(timeStamp)
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('-');
	//return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n;
}

function timeStamp(str) {
	const dateTmp = str.replace(/-/g, '/')
	return new Date(dateTmp).getTime()
}

function timeToTime(time) {
	//2019-09-22 15:33:00
	var result = ""
	const dateTimeStamp = timeStamp(time)
	var result = ""
	var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
	var hour = minute * 60;
	var day = hour * 24;
	var week = day * 7;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime(); //获取当前时间毫秒
	var diffValue = now - dateTimeStamp; //时间差
	if (diffValue < 0) {
		return;
	}
	var minC = diffValue // minute;  //计算时间差的分，时，天，周，月
	var hourC = diffValue / hour;
	var dayC = diffValue / day;
	var weekC = diffValue / week;
	var monthC = diffValue / month;

	var datetime = new Date();
	datetime.setTime(dateTimeStamp);
	var Nyear = datetime.getFullYear();
	var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
	var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();

	var nowDay = new Date().getDate();
	var day = new Date(dateTimeStamp).getDate();
	var num = nowDay - day
	if (num == 0) {
		result = "今天" + "  " + Nhour + ":" + Nminute
	} else if (num == 1) {
		result = "昨天" + "  " + Nhour + ":" + Nminute
	} else if (num == -29 || num == -30 || num == -27 || num == -28) {
		result = "昨天" + "  " + Nhour + ":" + Nminute
	} else {
		result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	}
	// if (monthC >= 12) {
	// 	result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// } else if (monthC >= 1 && monthC < 12) {
	// 	result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// } else if (weekC >= 1 && weekC <= 3) {
	// 	result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// } else if (dayC >= 1 && dayC <= 30) {
	// 	if (dayC == 1) {
	// 		result = "昨天" + "  " + Nhour + ":" + Nminute
	// 	} else {
	// 		result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// 	}
	// } else if (hourC >= 1 && hourC <= 24) {
	// 	var nowDay = new Date().getDate();
	// 	var day = new Date(dateTimeStamp).getDate();
	// 	if (nowDay == day) {
	// 		result = "今天" + "  " + Nhour + ":" + Nminute
	// 	} else {
	// 		result = "昨天" + "  " + Nhour + ":" + Nminute
	// 	}
	// } else if (minC >= 1 && minC <= 59) {
	// 	result = "今天" + "  " + Nhour + ":" + Nminute
	// } else if (diffValue >= 0 && diffValue <= minute) {
	// 	result = "今天" + "  " + Nhour + ":" + Nminute
	// } else {
	// 	var nowDay = new Date().getDate();
	// 	var day = new Date(dateTimeStamp).getDate();
	// 	if (nowDay == day) {
	// 		result = "今天" + "  " + Nhour + ":" + Nminute
	// 	} else {
	// 		result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// 	}
	// }
	return result;
}


function timeago(dateTimeStamp) { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
	var result = ""
	// console.log("================================",dateTimeStamp)
	var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
	var hour = minute * 60;
	var day = hour * 24;
	var week = day * 7;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime(); //获取当前时间毫秒
	// console.log("now=", now)
	var diffValue = now - dateTimeStamp; //时间差
	// console.log("diffValue=", diffValue)
	if (diffValue < 0) {
		return;
	}
	var minC = diffValue / minute; //计算时间差的分，时，天，周，月
	var hourC = diffValue / hour;
	var dayC = diffValue / day;
	var weekC = diffValue / week;
	var monthC = diffValue / month;
	// console.log("minC==", minC)
	// console.log("hourC==", hourC)
	// console.log("dayC==", dayC)
	// console.log("weekC==", weekC)
	// console.log("monthC==", monthC)



	if (monthC >= 12) {
		result = " " + parseInt(monthC / 12) + "年前"
	} else if (monthC >= 1 && monthC < 12) {
		result = " " + parseInt(monthC) + "月前"
	} else if (weekC >= 1 && weekC <= 3) {
		result = " " + parseInt(weekC) + "周前"
	} else if (dayC >= 1 && dayC <= 30) {
		result = " " + parseInt(dayC) + "天前"
	} else if (hourC >= 1 && hourC <= 23) {
		result = " " + parseInt(hourC) + "小时前"
	} else if (minC >= 1 && minC <= 59) {
		result = " " + parseInt(minC) + "分钟前"
	} else if (diffValue >= 0 && diffValue <= minute) {
		result = "刚刚"
	} else {
		var datetime = new Date();
		datetime.setTime(dateTimeStamp);
		var Nyear = datetime.getFullYear();
		var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
		var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
		var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
		var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
		var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
		result = Nyear + "-" + Nmonth + "-" + Ndate
	}
	return result;
}


function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};


// 构建菜单树
function toTree(data) {
	if (!data) return
	// 删除 所有 children,以防止多次调用
	data.forEach(function (item) {
		delete item.children
	})

	// 将数据存储为 以 id 为 KEY 的 map 索引数据列
	var map = {}
	data.forEach(function (item, index) {
		map[item.id] = item
		map[item.id].key = item.id
		map[item.id].value = item.id
		map[item.id].name = item.menuName
		map[item.id].children = []
	})
	// console.log(map);
	var val = []
	data.forEach(function (item) {
		// 以当前遍历项，的pid,去map对象中找到索引的id
		var parent = map[item.parentMenuId]
		// 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
		if (parent) {
			(parent.children || (parent.children = [])).push(item)
		} else {
			// 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
			val.push(item)
		}
	})
	return val
}

const util = {
	getProvider,
	checkSession,
	login,
	getSetting,
	openSetting,
	authorize,
	chooseLocation,
	getLocation,
	getUserInfo,
	chooseImage,
	uploadFile,
	requestPayment,
	saveFormid,
	redirectTo,
	navigateTo,
	navigateBack,
	reLaunch,
	showToastSuccess,
	showToastError,
	showLoading,
	hideLoading,
	setNavigationBarTitle,
	makePhoneCall,
	goToPaySuccess,
	getQueryString,
	mobileToStar,
	dateTimeStr,
	setBeforeDate,
	setAfterDate,
	strToObj,
	moneyFormat,
	formatTime,
	formatNumber,
	timeStamp,
	timeToTime,
	timeago,
	formatLocation,
	dateUtils,
	toTree
}
export default util
