import store from '@/store'
import util from "@/common/utils";

class Request {
    constructor() {
        // #ifndef H5
        switch (process.env.NODE_ENV) {
            case 'development':
                // this.ApiRootUrl = "https://api.guruijin.com/gateway/"//线上环境
                this.ApiRootUrl = "http://192.168.1.33:9199/gateway/"
                break;
            case 'production':
                this.ApiRootUrl = "https://api.guruijin.com/gateway/"//线上环境
                break;
        }
        // #endif
        // #ifdef H5
        this.ApiRootUrl = "/gateway/"
        // #endif

        this.invalid = 0
    }

    upload(p, b = false) {
        let requestUrl = this.ApiRootUrl + p.url

        if (p.rootUrl) requestUrl = p.url

        if (!p.type) p.type = 'POST'

        return new Promise((resolve, reject) => {
            uni.showNavigationBarLoading()
            uni.uploadFile({
                url: requestUrl,
                filePath: p.files.filePath,
                name: 'file',
                method: p.type.toUpperCase(),
                formData: null,
                header: {
                    'content-type': 'multipart/form-data',
                    'token': uni.getStorageSync('token')
                },
            }).then(data => {
                const [error, res] = data;
                uni.hideNavigationBarLoading()

                if (!error) {
                    const _data = JSON.parse(res.data);
                    if (_data.code === 0) {
                        return resolve(_data)
                    } else if (_data.code === 401) {
                        // #ifdef APP-PLUS  || H5
                        ++this.invalid
                        util.showToastError("登录失效，请重新登录！");
                        if (this.invalid < 2) {
                            this.destory()
                        }
                        // #endif

                        // #ifdef MP
                        if (!b) {
                            const _data = uni.getStorageSync('loginData')
                            switch (_data.loginWay) {
                                case 'account':
                                    resolve(this.refetch(p))
                                    break;
                                case 'shortcut':
                                    ++this.invalid
                                    util.showToastError("登录失效，请重新登录！");
                                    if (this.invalid < 2) {
                                        this.destory()
                                    }
                                    break;
                            }
                        }
                        // #endif
                    } else {
                        util.showToastError(_data.msg);
                        return reject(_data)
                    }
                } else {
                    util.showToastError("请求失败，请稍后再试！");
                    return reject(error.errMsg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => { })
        })
    }

    refetch(p) {
        return new Promise((resolve, reject) => {
            const _data = uni.getStorageSync('loginData')
            store.dispatch("user/UnifiedLogin", _data).then((res) => {
                resolve(this.upload(p, true))
            }).catch(err => {
                reject(err)
            })
        })
    }

    destory() {
        store.dispatch("user/Logout").then(() => {
            setTimeout(() => {
                util.reLaunch("/pages/login/login")
            }, 1e3);
        })
    }
}


export default Request