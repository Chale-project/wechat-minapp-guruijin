<template>
  <view class="pages address-form">
    <view class="form-content">
      <van-cell-group>
        <van-field :value="address.contact" label="联系人" placeholder="请填写联系人" border="false" @change="onChangeContact" />
        <van-field :value="address.mobile" label="联系电话" type="number" placeholder="请填写联系人手机号" border="false" maxlength="11" @change="onChangeMobile" />

        <view class="address-region">
          <view class="title">送货地址</view>
          <view class="value">
            <picker @change="onChangeRegion" mode="region" :value="regionArr">
              <view class="picker-checked" v-if="regionArr.length>0">
                {{regionArr[0]+' '+regionArr[1]+' '+regionArr[2]}}
              </view>
              <view class="picker" v-else>
                请选择
              </view>
            </picker>
          </view>
          <van-icon name="arrow" size="16" color="#969799" custom-class="picker-icon" />
        </view>

        <van-field :value="address.address" label="详细地址" type="textarea" placeholder="请填写详细地址" autosize border="false" @change="onChangeAddress" />
      </van-cell-group>
    </view>

    <view class="form-operate">
      <form @submit="saveAddress" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-address-add" form-type="submit">保存</button>
      </form>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import util from "@/common/utils";

import { addAddress, getAddressInfo, modifyAddress } from "@/common/api";

export default {
  name: "addressAdd",
  components: {
    uniIcons
  },
  data() {
    return {
      operate: "add",
      id: null,
      regionArr: [],
      address: {}
    };
  },
  computed: {},
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();
    const _id = options.id;
    const _customerNumber = options.customerNumber;
    this.address.customerNumber = _customerNumber || null;
    if (_id) {
      this.id = _id;
      this.operate = "edit";
      this.getAddressDetail();
    } else {
      this.id = null;
      this.operate = "add";
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // initData
    initData() {
      this.operate = "add";
      this.id = null;
      this.regionArr = [];

      const _address = {
        customerNumber: null,
        contact: null,
        mobile: null,
        province: null,
        city: null,
        town: null,
        address: null
      };
      this.address = _address;
    },

    //省市区选择
    onChangeRegion(e) {
      const _regionArr = e.detail.value;
      this.regionArr = _regionArr;
      this.address.province = _regionArr[0];
      this.address.city = _regionArr[1];
      this.address.town = _regionArr[2];
    },

    // 联系人
    onChangeContact(e) {
      this.address.contact = e.detail;
    },

    // 联系人手机号
    onChangeMobile(e) {
      this.address.mobile = e.detail;
    },

    // 微信
    onChangeAddress(e) {
      this.address.address = e.detail;
    },

    // 校验数据
    checkData() {
      const _address = this.address;
      const mobileReg = /^(1)[0-9]{10}$/;
      if (!_address.contact) {
        util.showToastError("请填写联系人！");
        return false;
      } else if (!mobileReg.test(_address.mobile)) {
        util.showToastError("请填写有效的手机号！");
        return false;
      } else if (!_address.province) {
        util.showToastError("请选择省市区！");
        return false;
      } else if (!_address.address) {
        util.showToastError("请填写详情地址！");
        return false;
      } else {
        return true;
      }
    },

    // 保存客户信息
    saveAddress(e) {
      util.saveFormid(e.detail.formId);
      const flag = this.checkData();
      if (flag) {
        switch (this.operate) {
          case "add":
            this.addAddress();
            break;
          case "edit":
            this.editAddress();
            break;
        }
      }
    },

    // 添加
    addAddress() {
      addAddress(this.address).then(res => {
        this.initData();
        util.showToastSuccess("添加成功!");
        util.navigateBack();
      });
    },

    // 编辑
    editAddress() {
      modifyAddress(this.address).then(res => {
        this.initData();
        util.showToastSuccess("编辑成功!");
        util.navigateBack();
      });
    },

    // 获取客户详情
    getAddressDetail() {
      getAddressInfo(this.id).then(res => {
        const _info = res.info;
        const _address = this.address;
        this.regionArr = [_info.province, _info.city, _info.town];
        this.address = Object.assign(_address, _info);
      });
    }
  }
};
</script>

<style lang="scss">
.address-form {
  .form-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
    .address-region {
      position: relative;
      padding: 20upx 30upx;
      display: flex;
      align-items: center;
      line-height: 48upx;
      background-color: #fff;
      .title {
        width: 180upx;
        max-width: 180upx;
        flex: 1;
      }
      .value {
        flex: 2;
        overflow: hidden;
        text-align: left;
        vertical-align: middle;
        color: #333;
        .picker {
          color: #969799;
          text-align: right;
        }
      }
      .picker-icon {
        width: 32upx;
        height: 48upx;
        line-height: 48upx;
      }
    }
    .address-region::after {
      position: absolute;
      box-sizing: border-box;
      transform-origin: center;
      content: " ";
      pointer-events: none;
      top: auto;
      right: 0;
      bottom: 0;
      left: 30upx;
      border-bottom: 2upx solid #ebedf0;
      transform: scaleY(0.5);
    }
  }
  .form-operate {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10upx 30upx;
    background-color: #fff;
    z-index: 99;
  }
}
</style>
