<template>
  <view class="pages delivery-form">
    <view class="form-content">
      <van-cell-group>
        <van-field :value="delivery.deliverymanName" label="姓名" placeholder="请填写姓名" border="false" required @change="onChangeName" />
        <van-field :value="delivery.deliverymanPhone" label="登录账号" type="number" placeholder="请填写手机号" border="false" maxlength="11" required @change="onChangeAccount" />
        <view class="picker-car-plate-type">
          <m-picker mode="selector" label="车牌类型" :index="carTypeIndex" rangekey="title" :range="carTypeList" required @change="onChangeCarPlateType" />
        </view>
        <view class="picker-car-plate-color">
          <m-picker mode="selector" label="车牌颜色" :index="carPlateColorIndex" rangekey="title" :range="carPlateColorList" required @change="onChangeCarPlateColor" />
        </view>
      </van-cell-group>
      <!-- 车牌 -->
      <view class="car-plate-panel">
        <view class="car-plate-title">请输入配送员车牌号</view>
        <view class="car-plate-content">
          <view class="car-plate-p-c">
            <view class="car-plate-province">{{delivery.carPlateCodeProvince}}</view>
            <view class="car-plate-city">{{delivery.carPlateCodeCity}}</view>
            <view class="car-plate-code-picker">
              <m-picker mode="multiSelector" :index="carPlateCodeIndex" :range="carPlateCodeList" :icon="false" @change="onChangeCarPlateCode" @columnchange="onColumnChangeCarPlateCode" />
            </view>
          </view>
          <view class="car-plate-dot"></view>
          <view class="car-plate-number">
            <m-input-code ref="mInputCode" :maxlength="maxCarPlateNumber" :value="delivery.carPlateNum" @finish="onFinishCarPlateNumber" />
          </view>
        </view>
      </view>

      <van-cell-group>
        <van-field :value="delivery.deliverymanCompany" label="公司" placeholder="请填写公司名称，个人可不填" border="false" @change="onChangeCompany" />
        <van-field :value="delivery.remark" label="备注" type="textarea" placeholder="请填写150字以内的描述" autosize border="false" @change="onChangeRemarks" />
      </van-cell-group>
    </view>

    <view class="form-operate">
      <form @submit="saveDelivery" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-delivery-add" form-type="submit">保存</button>
      </form>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import mPicker from "@/components/m-picker";
import mInputCode from "@/components/m-input-code";
import carCode from "@/common/carCode";

import util from "@/common/utils";
import {
  registerDelivery,
  getDeliveryInfo,
  modifyDelivery
} from "@/common/api";

import { mapMutations } from "vuex";

export default {
  name: "deliveryAdd",
  components: {
    uniIcons,
    mPicker,
    mInputCode
  },
  data() {
    return {
      carTypeIndex: 0,
      carTypeList: [
        { title: "小型汽车", type: "smallCar" },
        { title: "大型汽车", type: "largeCar" },
        { title: "小型汽车新能源", type: "smallCarEnergy" },
        { title: "大型汽车新能源", type: "largeCarEnergy" },
        { title: "挂车", type: "trailerCar" }
      ],
      carPlateColorIndex: 0,
      carPlateColorList: [
        { title: "黄色", color: "yellow" },
        { title: "蓝色", color: "blue" },
        { title: "绿色", color: "green" }
      ],
      maxCarPlateNumber: 5, // 普通车牌号 5 位数；新能源车牌 6 位数；
      carPlateCodeIndex: [15, 0],
      carPlateCodeList: [[...carCode.provinceList], [...carCode.cityList]],
      delivery: {},
      orderId: null
    };
  },
  computed: {},
  watch: {
    carTypeIndex(val) {
      if (val == 2 || val == 3) this.maxCarPlateNumber = 6;
      else this.maxCarPlateNumber = 5;

      this.delivery.carType = this.carTypeList[val].type;
    },

    carPlateColorIndex(val) {
      this.delivery.carPlateColor = this.carPlateColorList[val].color;
    },

    carPlateCodeIndex(val) {
      const p = carCode.provinceList[val[0]];
      const c = carCode.cityList[val[1]];
      this.delivery.carPlateCode = `${p}${c}`;
      this.delivery.carPlateCodeProvince = p;
      this.delivery.carPlateCodeCity = c;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();
    const _id = options.id;
    const _orderId = options.orderId;

    this.orderId = _orderId ? _orderId : null;
    if (_id) {
      this.id = _id;
      this.operate = "edit";
      this.getDeliveryDetail();
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
    ...mapMutations("delivery", ["SET_DELIVERY_INFO"]),

    // initData
    initData() {
      this.carTypeIndex = 0;
      this.carPlateColorIndex = 0;
      this.maxCarPlateNumber = 5;
      this.carPlateCodeIndex = [15, 0];

      const _delivery = {
        deliverymanName: null,
        deliverymanPhone: null,
        carType: this.carTypeList[this.carTypeIndex].type,
        carPlateColor: this.carPlateColorList[this.carPlateColorIndex].color,
        carPlateCode: `${carCode.provinceList[this.carPlateCodeIndex[0]]}${
          carCode.cityList[this.carPlateCodeIndex[1]]
        }`,
        carPlateCodeProvince: `${
          carCode.provinceList[this.carPlateCodeIndex[0]]
        }`,
        carPlateCodeCity: `${carCode.cityList[this.carPlateCodeIndex[1]]}`,
        carPlateNum: null,
        deliverymanCompany: null,
        remark: null,
        state: "enabled"
      };
      this.delivery = _delivery;
    },

    // 姓名
    onChangeName(e) {
      this.delivery.deliverymanName = e.detail;
    },

    // 账号手机号
    onChangeAccount(e) {
      this.delivery.deliverymanPhone = e.detail;
    },

    // 选择车牌类型
    onChangeCarPlateType(e) {
      const _index = e.detail.value;
      this.carTypeIndex = _index;
    },

    // 选择车牌颜色
    onChangeCarPlateColor(e) {
      const _index = e.detail.value;
      this.carPlateColorIndex = _index;
    },

    // 车牌前缀
    onChangeCarPlateCode(e) {
      const _index = e.detail.value;
      this.carPlateCodeIndex = _index;
    },

    // 滚动每列
    onColumnChangeCarPlateCode(e) {},

    // 车牌号码
    onFinishCarPlateNumber(e) {
      this.delivery.carPlateNum = e.toUpperCase();
    },

    // 公司名称
    onChangeCompany(e) {
      this.delivery.deliverymanCompany = e.detail;
    },

    // 备注
    onChangeRemarks(e) {
      this.delivery.remark = e.detail;
    },

    // 校验数据
    checkData() {
      const _delivery = this.delivery;
      const mobileReg = /^(1)[0-9]{10}$/;
      const carPlateReg = /^[A-Za-z0-9]+$/;

      if (!_delivery.deliverymanName) {
        util.showToastError("请填写配送员姓名！");
        return false;
      } else if (!mobileReg.test(_delivery.deliverymanPhone)) {
        util.showToastError("请填写有效的手机号！");
        return false;
      } else if (!carPlateReg.test(_delivery.carPlateNum)) {
        util.showToastError("请填写有效的车牌号！");
        return false;
      } else {
        return true;
      }
    },

    // 保存配送员信息
    saveDelivery(e) {
      util.saveFormid(e.detail.formId);
      const flag = this.checkData();
      if (flag) {
        switch (this.operate) {
          case "add":
            this.addDelivery();
            break;
          case "edit":
            this.editDelivery();
            break;
        }
      }
    },

    // 添加
    addDelivery() {
      registerDelivery(this.delivery).then(res => {
        this.initData();
        this.$refs.mInputCode.clear();
        util.showToastSuccess("添加成功!");
        if (this.orderId) {
          this.SET_DELIVERY_INFO(res.info);
          util.navigateBack();
        }
      });
    },

    // 编辑
    editDelivery() {
      modifyDelivery(this.delivery).then(res => {
        this.initData();
        this.$refs.mInputCode.clear();
        util.showToastSuccess("编辑成功!");
        util.navigateBack();
      });
    },

    // 获取客户详情
    getDeliveryDetail() {
      getDeliveryInfo(this.id).then(res => {
        const _info = res.info;
        this.carTypeList.map((item, index) => {
          if (item.type == _info.carType) this.carTypeIndex = index;
        });
        this.carPlateColorList.map((item, index) => {
          if (item.color == _info.carPlateColor)
            this.carPlateColorIndex = index;
        });
        carCode.provinceList.map((item, index) => {
          if (item == _info.carPlateCodeProvince)
            this.carPlateCodeIndex[0] = index;
        });
        carCode.cityList.map((item, index) => {
          if (item == _info.carPlateCodeCity) this.carPlateCodeIndex[1] = index;
        });
        this.delivery = _info;
      });
    }
  }
};
</script>

<style lang="scss">
.delivery-form {
  .form-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;

    .picker-car-plate-type,
    .picker-car-plate-color {
      padding: 0 30upx;
      background-color: #fff;
    }

    .car-plate-panel {
      position: relative;
      background-color: #fff;
      .car-plate-title {
        padding: 20upx 30upx;
        text-align: center;
        border-bottom: 1upx solid $uni-border-color;
      }
      .car-plate-content {
        display: flex;
        align-items: center;
        padding: 20upx 30upx;
        .car-plate-p-c {
          position: relative;
          display: flex;
          align-items: center;
          box-shadow: 0 0 4upx 4upx rgba(13, 110, 184, 0.7);
          .car-plate-province,
          .car-plate-city {
            position: relative;
            width: 50%;
            height: 40upx;
            line-height: 40upx;
            text-align: center;
            padding: 20upx;
          }
          .car-plate-province::after {
            position: absolute;
            content: "";
            top: 0;
            right: 0;
            bottom: 0;
            width: 2rpx;
            -webkit-transform: scaleX(0.5);
            transform: scaleX(0.5);
            overflow: hidden;
            background-color: #ddd;
          }
          .car-plate-code-picker {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 99;
            .picker-text {
              visibility: hidden;
            }
          }
        }

        .car-plate-dot {
          display: inline-block;
          width: 30upx;
          height: 30upx;
          margin: 0 20upx;
          background-color: #ddd;
          border-radius: 50%;
          overflow: hidden;
        }

        .car-plate-number {
          flex: 1;
          position: relative;
          box-shadow: 0 0 4upx 4upx rgba(13, 110, 184, 0.7);
        }
      }
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
