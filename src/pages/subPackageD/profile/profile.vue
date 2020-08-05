<template>
  <view class="pages profile">
    <view class="profile-avatar">
      <view class="avatar-image">
        <image :src="userInfo.headPic?userInfo.headPic:'/static/images/default_logo_1x1.jpg'" mode="widthFix" />
      </view>
      <view class="avatar-title">{{userInfo.nickname}}</view>
      <view class="avatar-sub-title" v-if="userInfo.clerkNumber">工号：{{userInfo.clerkNumber}}</view>
    </view>
    <van-cell-group>
      <van-field :value="userInfo.phoneNumber" label="登陆账号" placeholder="请填写登陆账号" disabled input-class="textstyle" />
      <van-field :value="userInfo.name" label="真实姓名" placeholder="请填写真实姓名" @change="onChangeName" input-class="textstyle" v-if="userConfig.name" />
      <van-cell :value="userInfo.gender=='man'?'男':userInfo.gender=='woman'?'女':'未知'" title="性别" is-link @click="toggleSex" value-class="textstyle" v-if="userConfig.gender" />
      <view class="user-birthday" v-if="userConfig.birthday">
        <view class="label">出生日期</view>
        <view class="value">
          <picker mode="date" :value="date" @change="onChangeDate">
            <view class="picker">
              <view class="picker-text ellipsis"><text v-if="userInfo.birthday">{{userInfo.birthday}}</text><text class="unselect" v-else>请选择</text></view>
              <view class="picker-icon">
                <uni-icons type="arrowright" color="#969799" size="20" />
              </view>
            </view>
          </picker>
        </view>
      </view>
      <van-field :value="userInfo.phoneNumber" label="手机号" placeholder=" " is-link disabled input-class="textstyle">
        <button slot="button" v-if="!userInfo.phoneNumber" type="default" class="but-default but-bind-mobile" hover-class="but-default-active" open-type="getPhoneNumber" @getphonenumber="goToBindMobile">绑定微信手机号</button>
      </van-field>
      <view class="user-address" v-if="userConfig.provinces">
        <view class="label">省市区</view>
        <view class="value">
          <picker mode="region" :value="regionArr" @change="onChangeRegion">
            <view class="picker">
              <view class="picker-text ellipsis"><text v-if="userInfo.province">{{`${userInfo.province} ${userInfo.city} ${userInfo.area}`}}</text><text class="unselect" v-else>请选择</text></view>
              <view class="picker-icon">
                <uni-icons type="arrowright" color="#969799" size="20" />
              </view>
            </view>
          </picker>
        </view>
      </view>
      <van-field :value="userInfo.wechat" label="微信号" placeholder="请填写微信号" @change="onChangeWechat" input-class="textstyle" v-if="userConfig.wxNumber" />
    </van-cell-group>
    <view class="submit-button">
      <form @submit="saveProfile" class="operation-form-but" :report-submit='true'>
        <button type="default" class="but-save-profile" form-type="submit">保存修改</button>
      </form>
    </view>

  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import util from "@/common/utils";

import { modifyUserInfo } from "@/common/api";

import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "profile",
  components: {
    uniIcons
  },
  data() {
    return {
      showArea: !1,
      areaList: [],
      dateStr: null,
      regionArr: []
    };
  },
  computed: {
    ...mapGetters(["userInfo", "userConfig"])
  },
  watch: {
    userInfo() {
      const _province = this.userInfo.province || "";
      const _city = this.userInfo.city || "";
      const _area = this.userInfo.area || "";
      if (!_province && !_city && !_area) {
        this.regionArr = [];
      } else {
        this.regionArr = [_province, _city, _area];
      }
    }
  },

  onLoad(options) {},

  onShow() {},

  mounted() {},

  methods: {
    ...mapMutations("user", ["SET_USER_INFO"]),
    ...mapActions("user", ["GetOpenId"]),

    //设置真实姓名
    onChangeName(e) {
      const _name = e.detail;
      this.userInfo.name = _name;
    },

    // 设置手机号
    onChangeMobile(e) {
      const _mobile = e.detail;
      this.userInfo.phoneNumber = _mobile;
    },

    //去绑定手机号
    goToBindMobile(e) {
      let data = e.detail;
      if (data.errMsg == "getPhoneNumber:ok") {
        this.GetOpenId()
          .then(openid => {
            const _encodeData = {
              encryptedData: data.encryptedData,
              iv: data.iv,
              openid: openid
            };
            this.bindUserMobile(_encodeData);
          })
          .catch(() => {
            console.log("session_key:获取失败");
          });
      }
    },

    //绑定手机号
    bindUserMobile(_encodeData) {
      bindWxMobile(_encodeData).then(res => {
        const _userInfo = res.info;
        this.SET_USER_INFO(_userInfo);
      });
    },

    //设置微信号
    onChangeWechat(e) {
      const _wechat = e.detail;
      this.userInfo.wxNumber = _wechat;
    },

    //展示性别选择
    toggleSex() {
      uni.showActionSheet({
        itemList: ["男", "女"],
        success: res => {
          if (res.tapIndex == 0) {
            this.userInfo.gender = "man";
          } else if (res.tapIndex == 1) {
            this.userInfo.gender = "woman";
          }
        }
      });
    },

    // 出生日期
    onChangeDate(e) {
      const _dateStr = e.detail.value;
      this.dateStr = _dateStr;
      this.userInfo.birthday = _dateStr;
    },

    //省市区选择
    onChangeRegion(e) {
      const _regionArr = e.detail.value;
      this.regionArr = _regionArr;
      this.userInfo.province = _regionArr[0];
      this.userInfo.city = _regionArr[1];
      this.userInfo.area = _regionArr[2];
    },

    //保存个人信息
    saveProfile(e) {
      util.saveFormid(e.detail.formId);

      const reg = /^(1)[0-9]{10}$/;

      const data = this.userInfo;
      if (data.phoneNumber) {
        if (!reg.test(data.phoneNumber)) {
          util.showToastError("请输入有效的手机号！");
          return;
        }
      }

      modifyUserInfo(data).then(res => {
        util.showToastSuccess("修改成功！");
        this.SET_USER_INFO(this.userInfo);
      });
    }
  }
};
</script>

<style lang="scss">
.profile {
  position: relative;
  .profile-avatar {
    margin: 0 auto;
    padding: 15px;
    text-align: center;
    .avatar-image {
      width: 100upx;
      height: 100upx;
      margin: 0 auto;
      border-radius: 8upx;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      image {
        width: 100%;
      }
    }
    .avatar-title {
      padding: 20upx 0;
    }
  }
  .user-birthday,
  .user-address {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20upx 30upx;
    background-color: #fff;
    .label {
      width: 180upx;
    }
    .value {
      width: calc(100% - 180upx);
      .picker {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .picker-text {
          width: calc(100% - 40upx);
          text-align: right;
          color: #666;
          .unselect {
            color: #969799;
          }
        }
        .picker-icon {
          width: 36upx;
          height: 48upx;
          line-height: 48upx;
          text-align: center;
          overflow: hidden;
        }
      }
    }
  }
  .user-birthday::after,
  .user-address::after {
    @include backgroundLine(30upx, 0, 2upx);
  }

  .textstyle {
    text-align: right;
    color: #666;
  }
  .but-bind-mobile {
    padding-right: 0;
    line-height: 1.7;
    color: #07c160;
    font-size: 28upx;
    background-color: transparent;
  }
  button[type="default"].but-default.but-bind-mobile {
    background-color: transparent;
    color: #07c160;
  }

  button[type="default"].but-bind-mobile.but-default-active {
    opacity: 0.6;
  }

  button[disabled][type="default"].but-default.but-bind-mobile {
    background-color: transparent;
    opacity: 0.6;
  }
  button[type="default"].but-bind-mobile::after {
    width: 0;
    height: 0;
  }
  .submit-button {
    margin: 60upx;
  }
}
</style>
