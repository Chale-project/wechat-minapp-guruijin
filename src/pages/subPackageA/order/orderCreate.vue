<template>
  <view class="pages order-create">
    <view class="customer-info">
      <van-cell-group>
        <view class="customer-picker-choice">
          <m-picker mode="selector" label="选择客户" :index="curCustomerIndex" rangekey="corporateName" :range="customerList" @change="onChoiceCustomer" />
        </view>

        <address-info :options="addressInfo" v-if="addressInfo.id" @click="onChoiceAddress" />
        <van-cell :value="addressInfo.id?'已选择':'请选择'" title="选择地址" border="false" is-link @click="onChoiceAddress" v-else />

      </van-cell-group>
    </view>
    <view class="order-goods">
      <view class="order-goods-header">
        <view class="header-title"> 已选购商品清单 </view>
        <!-- <view class="header-minus">
          <uni-icons type="minus" size="16" color="#dd524d" />
          <text>删除已选</text>
        </view> -->
        <view class="header-plus" @tap="showChoiceGoods">
          <uni-icons type="plus" size="16" color="#0d6eb8" />
          <text>添加商品</text>
        </view>
      </view>
      <view class="order-goods-body">
        <goods-mode-b :list="goodsCart" v-if="goodsCart.length>0" @error="errImg" @input="onInputGoodsNum" @minus="onMinusGoodsNum" @plus="onPlusGoodsNum" />

        <empty v-else desc="请选择下单商品~" />

      </view>
    </view>
    <view class="order-operate">
      <form @submit="createOrder" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-order-creater" form-type="submit">提交订单</button>
      </form>
    </view>

  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import empty from "@/components/empty";
import mPicker from "@/components/m-picker";
import addressInfo from "../address/address-info";
import goodsModeB from "../goodsBatch/goods-mode-b";

import util from "@/common/utils";

import {
  getCustomerListAll,
  getCustomerAddressInfo,
  addSalesOrder
} from "@/common/api";

import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "orderCreate",
  components: {
    uniIcons,
    empty,
    mPicker,
    addressInfo,
    goodsModeB
  },
  data() {
    return {
      curCustomerIndex: 0,
      customerList: [],
      orderData: {}
    };
  },
  computed: {
    ...mapGetters(["addressInfo", "goodsCart"])
  },
  watch: {
    addressInfo(e) {
      this.orderData.addressId = e.id;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();
    this.getCustomerAll().then(() => {
      this.getCustomerAddress();
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    ...mapMutations("address", ["SET_ADDRESS_OPTIONS"]),
    ...mapMutations("goods", ["SET_GOODS_CART"]),
    ...mapActions("goods", ["Plus", "Input", "Minus"]),

    // initData
    initData() {
      this.curCustomerIndex = 0;
      this.customerList = [];

      const _orderObj = {
        customerNumber: null,
        addressId: null,
        goodsCartStr: null
      };
      this.orderData = _orderObj;
    },

    // 选择客户
    onChoiceCustomer(e) {
      if (this.customerList.length < 1) {
        util.showToastError("请先去添加客户！");
        return;
      }
      const _index = e.detail.value;
      this.curCustomerIndex = _index;
      this.orderData.customerNumber = this.customerList[_index].customerNumber;
      this.getCustomerAddress();
    },

    // 选择地址
    onChoiceAddress() {
      if (this.customerList.length < 1) {
        util.showToastError("请先去添加客户！");
        return;
      }
      const _number = this.customerList[this.curCustomerIndex].customerNumber;

      const url = `/pages/subPackageA/address/addressList?customerNumber=${_number}`;
      util.navigateTo(url);
    },

    // 选择商品
    showChoiceGoods() {
      const url = "/pages/subPackageA/goodsBatch/batchManage?referer=order";
      util.navigateTo(url);
    },

    // 减少
    onMinusGoodsNum(i) {
      const _list = this.goodsCart;
      this.Minus(_list[i]);
    },

    // 监听input事件
    onInputGoodsNum(e) {
      let _val = e.detail.value;
      const _index = e.detail.index;
      const _list = this.goodsCart;
      _val = String(_val).replace(/[^1-9.-]/g, "");
      _val = _val === "" ? 1 : +_val;

      _list[_index].number = _val;
      this.Input(_list[_index]);
    },

    // 增加
    onPlusGoodsNum(i) {
      const _list = this.goodsCart;
      this.Plus(_list[i]);
    },

    setGoodsCartStr() {
      const _list = this.goodsCart;
      const _arr = _list.map(item => {
        return `${item.id}~${item.number}`;
      });
      return _arr;
    },

    // 数据校验
    checkData() {
      let _data = this.orderData;
      _data.goodsCartStr = this.setGoodsCartStr().join(",");
      if (!_data.customerNumber) {
        util.showToastError("请选择客户！");
        return false;
      } else if (!_data.addressId) {
        util.showToastError("请选择客户收货地址！");
        return false;
      } else if (!_data.goodsCartStr) {
        util.showToastError("请选择商品！");
        return false;
      } else {
        return true;
      }
    },

    // 创建订单
    createOrder(e) {
      util.saveFormid(e.detail.formId);
      const flag = this.checkData();
      if (flag) {
        addSalesOrder(this.orderData).then(res => {
          util.showToastSuccess("添加成功!");
          this.SET_GOODS_CART([]);
          this.orderData.goodsCartStr = null;
        });
      }
    },

    // 获取所有客户
    getCustomerAll() {
      return new Promise((resolve, reject) => {
        getCustomerListAll().then(res => {
          const _list = res.list;
          if (_list.length > 0) {
            this.customerList = _list;
            this.orderData.customerNumber =
              _list[this.curCustomerIndex].customerNumber;
            resolve();
          }
        });
      });
    },

    // 获取当前客户地址
    getCustomerAddress() {
      const _customerNumber = this.customerList[this.curCustomerIndex]
        .customerNumber;
      getCustomerAddressInfo(_customerNumber).then(res => {
        const _info = res.info;
        this.SET_ADDRESS_OPTIONS(_info);
      });
    }
  }
};
</script>

<style lang="scss">
.order-create {
  .customer-info {
    position: relative;
    margin-bottom: 20upx;
    padding-bottom: 20upx;
    background-color: $uni-bg-color;
    .customer-picker-choice {
      padding: 0 30upx;
    }
  }
  .order-goods {
    position: relative;
    margin-bottom: 130upx;
    padding: 20upx $uni-spacing-row-lg;
    background-color: #fff;
    .order-goods-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20upx 0;
    }
    .order-goods-body {
      margin: 0 -30upx;
    }
  }
  .order-operate {
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
