<template>
  <view class="login">
    <view class="login-logo">
      <image src="/static/images/logo.png" mode="widthFix" />
    </view>

    <view class="login-form">
      <view class="login-type">
        <uni-segmented-control :current="curType" :values="loginTypeList" @clickItem="onSwitchLoginType" style-type="text" active-color="#0d6eb8" />
      </view>
      <view class="login-content">
        <view class="by-mobile" v-show="curType === 0">
          <view class="input-item">
            <m-input class="m-input" type="text" maxlength="11" clearable focus v-model="mobile" placeholder="请输入手机号"></m-input>
            <view class="operate-but">
              <form @submit="getSmsCode" class="operation-form-but" :report-submit='true'>
                <button type="default" class="operate-get-sms-code" :disabled="codeDisabled" form-type="submit">{{butVerifyCode}}</button>
              </form>
            </view>
          </view>
          <view class="input-item">
            <m-input class="m-input" type="text" maxlength="6" clearable v-model="smscode" placeholder="请输入短信取验证码"></m-input>
          </view>
        </view>

        <view class="by-account" v-show="curType === 1">
          <view class="input-item">
            <m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入账号"></m-input>
          </view>
          <view class="input-item">
            <m-input class="m-input" type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
          </view>
        </view>
      </view>
    </view>

    <view class="login-btn">
      <form @submit="bindLogin" class="operation-form-but" :report-submit='true'>
        <button type="default" :disabled="loginDisabled" form-type="submit">登录</button>
      </form>
    </view>

    <!-- <view class="action-row">
      <navigator url="/pages/home/home" open-type="switchTab">注册账号</navigator>
      <text>|</text>
      <navigator url="/pages/cart/cart" open-type="switchTab">忘记密码</navigator>
    </view> -->

    <!-- <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
      <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
        <image :src="provider.image" @tap="oauth(provider.value)"></image>
      </view>
    </view> -->

    <!-- 微信登录 -->
    <modal ref="modal" title="开通微信免密登录" message="您正在开通微信免密登录，开通后当前微信号会绑定改登录账号。" cancelButText="跳过" confirmButText="开通" openType="getUserInfo" @cancel="onCancelBind" @getuserinfo="getUserInfo" />

  </view>
</template>

<script>
import { uniIcons, uniSegmentedControl } from "@dcloudio/uni-ui";
import mInput from "@/components/m-input";
import modal from "@/components/modal";
import util from "@/common/utils";
import md5 from "md5";
import { getSmsVerifyCode } from "@/common/api";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    mInput,
    modal,
    uniSegmentedControl
  },
  data() {
    return {
      loginTypeList: ["快捷登录", "账号登录"],
      curType: 0, // 0：手机号登录；1：账号密码登录
      loginType: "shortcut", // shortcut：手机号登录；account：账号密码登录
      mobile: null,
      smscode: null,
      account: null,
      password: null,

      butVerifyCode: "获取验证码",
      countDownVal: 59,
      codeDisabled: !1,
      loginDisabled: !1,

      providerList: [],
      hasProvider: false,
      positionTop: 0
    };
  },

  computed: {
    ...mapGetters(["isBind", "openid"])
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  onReady() {
    this.initPosition();
    this.initProvider();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    ...mapActions("user", ["UnifiedLogin", "GetOpenId", "DecryptUserInfoBind"]),

    // 切换登录方式
    onSwitchLoginType(e) {
      const { currentIndex } = e;
      if (this.curType !== currentIndex) this.curType = currentIndex;
      switch (currentIndex) {
        case 0:
          this.loginType = "shortcut";
          break;
        case 1:
          this.loginType = "account";
          break;
      }
    },

    // 获取短信验证码
    getSmsCode() {
      const flag = this.checkMobile();
      if (!flag) {
        util.showToastError("请输入有效的手机号码！");
        return;
      } else {
        const mobile = this.mobile;
        getSmsVerifyCode(mobile).then(res => {
          this.showCountDown();
          util.showToastSuccess("发送成功！");
        });
      }
    },

    // 校验手机号
    checkMobile() {
      const reg = /^(1)[0-9]{10}$/,
        _mobile = this.mobile;
      return reg.test(_mobile);
    },

    //倒计时
    showCountDown() {
      let currentTime = this.countDownVal;
      let timer = setInterval(() => {
        this.butVerifyCode = currentTime + "秒";
        this.codeDisabled = !0;
        currentTime--;
        if (currentTime <= 0) {
          clearInterval(timer);
          this.butVerifyCode = "获取验证码";
          this.countDownVal = 59;
          this.codeDisabled = !1;
        }
      }, 1e3);
    },

    //检验验证码
    checkCode() {
      const reg = /^\d{6}$/,
        _code = this.smscode;
      return reg.test(_code);
    },

    // 登录
    bindLogin(e) {
      util.saveFormid(e.detail.formId);
      const _loginType = this.curType;
      switch (_loginType) {
        case 0:
          const flagMobile = this.checkMobile();
          const flagCode = this.checkCode();
          if (!flagMobile) {
            util.showToastError("请输入有效的手机号码！");
            return;
          }
          if (!flagCode) {
            util.showToastError("请输入6位数字验证码！");
            return;
          }
          this.toLogin();
          break;
        case 1:
          const account = this.account;
          const password = this.password;
          if (!account) {
            util.showToastError("请输入账号！");
            return;
          }
          if (!password) {
            util.showToastError("请输入密码！");
            return;
          }
          this.toLogin();
          break;
      }
    },

    toLogin() {
      const _data = {
        loginWay: this.loginType,
        userNumber: this.curType === 0 ? this.mobile : this.account,
        userSecret: this.curType === 0 ? this.smscode : md5(this.password)
      };
      this.UnifiedLogin(_data).then(res => {
        //  检测用户是否绑定第三方账号，true：进入下一步；false：解密绑定用户第三方账号
        if (!this.isBind) {
          this.GetOpenId().then(res => {
            this.$refs.modal.openPopup();
          });
        } else {
          util.navigateBack("/pages/home/home");
        }
      });
    },

    // 取消绑定
    onCancelBind() {
      util.navigateBack("/pages/home/home");
    },

    // 模态框绑定微信登录
    getUserInfo(e) {
      console.log(e);
      const data = e.detail;
      if (data.errMsg == "getUserInfo:ok") {
        const _decryptData = {
          encryptedData: data.encryptedData,
          iv: data.iv,
          openid: this.openid
        };

        this.DecryptUserInfoBind(_decryptData).then(res => {
          util.navigateBack("/pages/home/home");
        });
      } else {
        util.showToastError("更多精彩将与你擦肩而过哦！");
      }
    },

    initProvider() {
      const filters = ["weixin", "qq", "sinaweibo"];
      util.getProvider("oauth").then(res => {
        if (res.provider && res.provider.length) {
          for (let i = 0; i < res.provider.length; i++) {
            if (~filters.indexOf(res.provider[i])) {
              this.providerList.push({
                value: res.provider[i],
                image: "/static/images/" + res.provider[i] + ".png"
              });
            }
          }
          this.hasProvider = true;
        }
      });
    },

    initPosition() {
      /**
       * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
       * 反向使用 top 进行定位，可以避免此问题。
       */
      this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
    },

    oauth(value) {
      util.login(value).then(res => {
        util.getUserInfo(value).then(infoRes => {
          console.log(infoRes);
        });
      });
    }
  }
};
</script>

<style lang="scss">
.login {
  padding: 10px 15px;
  .login-logo {
    margin: 30px auto;
    text-align: center;
    image {
      width: 120upx;
    }
  }
  .login-form {
    margin-bottom: 20px;
    padding: $uni-spacing-row-base $uni-spacing-col-base;
    background-color: $uni-bg-color;
    border-radius: $uni-border-radius-base;
    .login-type {
      margin-bottom: 20upx;
      .segmented-control__item {
        margin: 0 90upx;
      }
    }
    .login-content {
      padding: 20upx 0;
      .input-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding: $uni-spacing-row-base $uni-spacing-col-base;
        background-color: $uni-bg-color;
        .m-input {
          flex: 1;
        }
        .operate-but {
          width: 180upx;
          margin-left: 10upx;
          .operate-get-sms-code {
            padding-left: 10upx;
            padding-right: 10upx;
            background-color: transparent;
            color: $uni-color-primary;
            line-height: 1.7;
            font-size: 28upx;
          }
          .operate-get-sms-code::after {
            border: 0;
          }
        }
      }
      .input-item::after {
        @include backgroundLine;
      }
    }
  }
  .login-btn {
    margin-bottom: 20px;
  }

  .action-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .action-row navigator {
    color: $uni-color-primary;
    padding: 0 10px;
  }
  .oauth-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .oauth-image {
    width: 50px;
    height: 50px;
    border: 1px solid $uni-border-color;
    border-radius: 50px;
    margin: 0 20px;
    background-color: #ffffff;
  }
  .oauth-image image {
    width: 30px;
    height: 30px;
    margin: 10px;
  }
}
</style>