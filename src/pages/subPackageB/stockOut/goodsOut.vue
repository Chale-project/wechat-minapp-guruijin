<template>
  <view class="pages goods-out">
    <view class="goods-out-top">
      <view class="goods-out-operate-scan">
        <form @submit="scanOutOfStock" class="operation-form-but" :report-submit='true'>
          <button type="default" class="operate-delivery-clerk" form-type="submit">
            <uni-icons type="scan" size="24" color="#0d6eb8" class="but-icon" />
            <text>扫码出库</text>
          </button>
        </form>
      </view>

      <view class="goods-out-delivery">
        <view class="delivery-icon">
          <image src="/static/images/icon_order_delivery_brack.png" mode="widthFix" />
        </view>
        <view class="delivery-info" v-if="deliveryInfo.id">
          <view class="clerk-info ellipsis">
            <text class="clerk-name">{{deliveryInfo.deliverymanName}} <text v-if="deliveryInfo.deliverymanCompany">（{{deliveryInfo.deliverymanCompany}}）</text></text>
            <text class="clerk-phone">{{deliveryInfo.deliverymanPhone}}</text>
          </view>
          <view class="clerk-detail">
            <text>{{deliveryInfo.carPlateJoint}} <text v-if="deliveryInfo.carPlateColor">（{{deliveryInfo.carPlateColor=='blue'?'蓝色':deliveryInfo.carPlateColor=='yellow'?'黄色':deliveryInfo.carPlateColor=='green'?'绿色':''}}）</text></text>
          </view>
          <view class="switch-delivery">
            <m-picker :index="deliveryIndex" rangekey="name" :icon="false" :range="deliveryList" @change="onChangeDelivery" />
          </view>
          <view class="switch-delivery-icon">
            <image src="/static/images/icon_edit.png" mode="widthFix" />
          </view>

        </view>
        <view class="delivery-empty" v-else>
          <m-picker :index="deliveryIndex" rangekey="name" :range="deliveryList" @change="onChangeDelivery" v-if="deliveryList.length>0" />
          <view class="add-delivery" @tap="onTapToDelivery" v-else>
            <text class="but-text">添加配送车辆</text>
            <uni-icons type="arrowright" size="20" color="#969799" class="but-icon" />
          </view>
        </view>
      </view>

    </view>
    <view class="goods-out-content">
      <view class="goods-out-address">
        <view class="address-icon">
          <image src="/static/images/icon_location.png" mode="widthFix" />
        </view>
        <view class="address-info">
          <view class="consignee-info ellipsis">
            <text class="consignee-name">{{orderInfo.receiver}} （{{orderInfo.clientCorporate}}）</text>
            <text class="consignee-phone">{{orderInfo.receiverMobile}}</text>
          </view>
          <view class="consignee-address-detail">
            <text>{{orderInfo.receiverAreaName}}</text>
          </view>
        </view>
      </view>

      <view class="order-flow-panel">
        <cell-item label="订单编号" :value="orderInfo.orderNumber" operate="复制" @click="copyOrderNumber" />
        <cell-item label="下单时间" :value="orderInfo.addDataTime" />
        <cell-item label="操作员" :value="userInfo.nickname" />
      </view>

      <view class="order-goods-panel" v-if="goodsList.length>0">
        <view class="goods-item" v-for="(v,i) of goodsList" :key="i">
          <view class="goods-thumb">
            <image :src="v.coverImage?v.coverImage:defaultImage" @error="errImg(i)" />
          </view>
          <view class="goods-info">
            <view class="goods-title ellipsis">
              <view class="title ellipsis">{{v.goodsTitle}}</view>
              <view class="piece ellipsis">X{{v.battlementNum}}(块)</view>
            </view>
            <view class="goods-spec ellipsis">{{v.specificationName}} {{v.specificationAttributes}}</view>
            <view class="goods-others">
              <view class="goods-volume-num">
                <view class="volume"><text>{{v.parameters}}</text></view>
                <!-- <view class="num">{{v.battlementNum}}块/垛</view> -->
              </view>
              <view class="goods-operate">
                <uni-icons type="minus" size="24" color="#0d6eb8" v-if="v.number>0" @click="onTapMinus(i)" />
                <view class="input-number ellipsis" v-if="v.number>0">
                  <input :value="v.number" maxlength="6" type="number" class="number" :disabled="true" @input="onInputNumber($event,i)" />
                  <text class="unit">垛</text>
                </view>
                <uni-icons type="plus" size="24" color="#0d6eb8" @click="onTapPlus(i)" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <empty v-else desc="请扫码添加出库商品~" />

    </view>

    <view class="goods-out-operate">
      <view class="operate-left">
        合计：<text>{{stack}}垛，</text><text>{{piece}}块，</text><text>{{area}}M²</text>
      </view>

      <view class="operate-right">
        <form @submit="setGoodsStoreOut" class="operation-form-but" :report-submit='true'>
          <button type="default" class="operate-store-out" form-type="submit">
            <view class="icon">
              <image src="/static/images/icon_store_out.png" mode="widthFix" />
            </view>
            <text>确认出库</text>
          </button>
        </form>
      </view>
    </view>

  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import cellItem from "@/components/cell-item";
import empty from "@/components/empty";
import mPicker from "@/components/m-picker";

import util from "@/common/utils";
import {
  getSalesOrderInfo,
  getDeliveryListAll,
  getGoodsInfoOrder,
  addGoodsStoreOut
} from "@/common/api";

import { mapGetters, mapMutations } from "vuex";

export default {
  name: "goodsOut",
  components: {
    uniIcons,
    cellItem,
    empty,
    mPicker
  },
  data() {
    return {
      orderId: null,
      goodsId: null,
      stack: 0,
      piece: 0,
      area: 0,
      orderInfo: {},
      goodsList: [],
      deliveryIndex: null,
      deliveryList: [],
      defaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapGetters(["userInfo", "deliveryInfo"])
  },
  watch: {
    goodsList: {
      handler(e) {
        this.countTotalStackPieceArea();
      },
      deep: true
    },

    deliveryIndex(e) {
      this.deliveryInfo = this.deliveryList[e];
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();

    const _orderId = options.orderId;
    const _goodsId = options.goodsId;
    if (!_orderId) {
      util.showToastError("没有有效的订单！");
      return;
    }
    this.orderId = _orderId;
    this.goodsId = _goodsId;

    this.getOrderDetail();
    this.getGoodsDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getDeliveryList();
  },

  methods: {
    ...mapMutations("delivery", ["SET_DELIVERY_INFO"]),

    // initData
    initData() {
      this.orderId = null;
      this.goodsId = null;
      this.stack = 0;
      this.piece = 0;
      this.area = 0;
      this.orderInfo = {};
      this.goodsList = [];
      this.deliveryIndex = null;
      this.deliveryList = [];
    },

    //  扫码出库
    scanOutOfStock(e) {
      util.saveFormid(e.detail.formId);

      uni.scanCode({
        success: res => {
          const _goodsId = res.result;

          if (_goodsId.length != 32) {
            util.showToastError("请扫描有效的商品码！");
            return;
          }

          const _orderGoodsList = this.orderInfo.speModelList;
          const _newOrderGoodsList = _orderGoodsList.filter(item => {
            return item.goodsSpecificationId == _goodsId;
          });
          if (_newOrderGoodsList.length == 0) {
            util.showToastError("该订单中没有此商品！");
            return;
          }

          this.goodsId = _goodsId;

          this.getGoodsDetail();
        }
      });
    },

    // 添加配送员
    onTapToDelivery() {
      const url = `/pages/subPackageA/delivery/deliveryAdd?orderId=${this.orderId}`;
      util.navigateTo(url);
    },

    // 选择配送车辆配送员
    onChangeDelivery(e) {
      const _index = e.detail.value;
      const _newIndex = Number(_index);
      this.deliveryIndex = _newIndex;
    },

    // 复制订单号
    copyOrderNumber() {
      uni.setClipboardData({
        data: this.orderInfo.orderNumber,
        success: () => {}
      });
    },

    // 加
    onTapPlus(i) {
      let _goodsList = this.goodsList;
      ++_goodsList[i].number;
    },

    // input
    onInputNumber() {},

    // 减
    onTapMinus(i) {
      let _goodsList = this.goodsList;
      --_goodsList[i].number;
      if (_goodsList[i].number === 0) {
        _goodsList.splice(i, 1);
      }
    },

    // 计算总垛数,总块数,总面积
    countTotalStackPieceArea() {
      let _stack = 0,
        _piece = 0,
        _area = 0;
      const _goodsList = this.goodsList;
      _goodsList.map(item => {
        _stack += item.number;
        _piece += item.number * item.battlementNum;

        const _areaArr = item.parameters.split("*");
        let _itemArea = ((_areaArr[0] / 100) * _areaArr[1]) / 100;
        _area += item.number * item.battlementNum * _itemArea;
      });
      this.stack = _stack;
      this.piece = _piece;
      this.area = parseFloat(_area).toFixed(2);
    },

    // 确认出库
    setGoodsStoreOut(e) {
      util.saveFormid(e.detail.formId);
      if (!this.deliveryInfo.id) {
        util.showToastError("请选择配送车辆！");
        return;
      }
      if (this.goodsList.length < 1) {
        util.showToastError("请扫码添加要出库的商品！");
        return;
      }
      const goodsArr = this.goodsList.map(item => {
        return `${item.id}~${item.number}`;
      });
      const goodsStr = goodsArr.join(",");
      const data = {
        deliverymanId: this.deliveryInfo.id,
        goodsCartStr: goodsStr,
        orderSellId: this.orderId
      };

      addGoodsStoreOut(data).then(res => {
        util.showToastSuccess("出库成功!");
        this.initData();
        this.SET_DELIVERY_INFO({});
        setTimeout(() => {
          util.navigateBack();
        }, 500);
      });
    },

    // 获取配送员
    getDeliveryList() {
      getDeliveryListAll(this.orderId).then(res => {
        let _list = res.list;
        if (_list.length > 0) {
          _list.map(item => {
            item.name = `${item.deliverymanName} ${item.carPlateJoint}`;
          });
          this.deliveryList = _list;
        }
      });
    },

    // 获取订单详情
    getOrderDetail() {
      getSalesOrderInfo(this.orderId).then(res => {
        const _info = res.info;
        this.orderInfo = _info;
      });
    },

    // 获取订单详情
    getGoodsDetail() {
      getGoodsInfoOrder(this.goodsId).then(res => {
        let _info = res.info;
        let _goodsList = this.goodsList;
        if (_goodsList.length > 0) {
          let flag = !1;
          for (let i in _goodsList) {
            if (_goodsList[i].id === _info.id) {
              flag = !0;
              ++_goodsList[i].number;
              break;
            }
          }
          if (!flag) {
            _info.number = 1;
            _goodsList.push(_info);
          }
        } else {
          _info.number = 1;
          _goodsList.push(_info);
        }
        this.goodsList = _goodsList;
      });
    },

    //处理no found 图片
    errImg(i) {
      this.goodsList[i].coverImage = this.defaultImage;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {}
};
</script>

<style lang="scss">
.goods-out {
  &-top {
    position: relative;
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    background-color: $uni-color-primary;
    .goods-out-operate-scan {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40upx;
      .operation-form-but {
        display: inline-block;
        .operate-delivery-clerk {
          background-color: #fff;
          color: $uni-text-color;
          line-height: 2.2;
          .but-icon {
            display: inline-block;
            width: 40upx;
            height: 40upx;
            margin-right: 10upx;
            line-height: 40upx;
          }
        }
        .operate-delivery-clerk::after {
          border: 1px solid #fff;
        }
      }
    }
    .goods-out-delivery {
      position: relative;
      display: flex;
      padding: 16upx 20upx;
      border-radius: $uni-border-radius-base;
      box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.4);
      background-color: #fff;
      z-index: 99;
      .delivery-icon {
        width: 60upx;
        image {
          width: 40upx;
        }
      }
      .delivery-info {
        position: relative;
        width: calc(100% - 160upx);
        padding-right: 100upx;
        .clerk-info {
          margin-bottom: 20upx;
          .clerk-name {
            margin-right: 20upx;
          }
        }
        .clerk-detail {
          margin-bottom: 10upx;
        }
        .switch-delivery,
        .switch-delivery-icon {
          position: absolute;
          width: 80upx;
          height: 80upx;
          right: 10upx;
          top: 10upx;
          overflow: hidden;
          text-align: center;
          line-height: 80upx;
          z-index: 88;
          .m-picker {
            padding: 0;
            .picker {
              padding: 20upx 0;
              .picker-text {
                visibility: hidden;
              }
            }
          }
        }
        .switch-delivery {
          z-index: 99;
        }
        .switch-delivery-icon {
          image {
            width: 24px;
          }
        }
      }
      .delivery-empty {
        width: calc(100% - 60upx);
        .m-picker {
          padding: 0;
        }
        .add-delivery {
          text-align: right;
          .but-text {
            color: #999;
          }
          .but-icon {
            margin-left: 10upx;
          }
        }
      }
    }
  }
  &-top::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 85upx;
    background-color: $uni-bg-color;
  }
  &-content {
    position: relative;
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    background-color: $uni-bg-color;
    padding-bottom: 110upx;
    .goods-out-address {
      position: relative;
      display: flex;
      padding: 16upx 20upx;
      margin-bottom: 20upx;
      .address-icon {
        width: 60upx;
        image {
          width: 40upx;
        }
      }
      .address-info {
        width: calc(100% - 60upx);
        .consignee-info {
          margin-bottom: 20upx;
          .consignee-name {
            margin-right: 20upx;
          }
        }
        .consignee-address-detail {
          margin-bottom: 10upx;
        }
      }
    }
    .order-flow-panel {
      margin-bottom: 20upx;
    }
    .order-goods-panel {
      margin-bottom: 20upx;
      .goods-item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 20upx 30upx;
        .goods-thumb {
          width: 130upx;
          height: 130upx;
          margin-right: 10upx;
          overflow: hidden;
          border-radius: $uni-border-radius-base;
          text-align: center;
          line-height: 130upx;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .goods-info {
          width: calc(100% - 140upx);
          .goods-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 30upx;
            .piece {
              width: 200upx;
              text-align: right;
            }
          }
          .goods-spec {
            font-size: 24upx;
            color: #999;
          }
          .goods-others {
            display: flex;
            align-items: center;
            .goods-volume-num {
              width: 50%;
              .volume,
              .num {
                font-size: 26upx;
              }
            }
            .goods-operate {
              width: 50%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .input-number {
                display: flex;
                align-items: center;
                max-width: 100upx;
                min-width: 50upx;
                margin: 0 4upx;
                padding: 0 8upx;
                border: 1upx solid $uni-border-color;
                border-radius: $uni-border-radius-sm;
                .number {
                  display: inline-block;
                  width: 48upx;
                  text-align: center;
                }
                .unit {
                  display: inline-block;
                  width: 32upx;
                  text-align: right;
                  color: #999;
                }
              }
            }
          }
        }
      }
      .goods-item::after {
        @include backgroundLine(170upx, 0, 2upx);
      }
      .goods-item:last-child::after {
        @include backgroundLine(0, 0, 0);
      }
    }
  }

  &-operate {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10upx 30upx;
    background-color: #fff;
    box-shadow: 0 2rpx 2rpx rgba(0, 0, 0, 0.7);
    z-index: 99;
    .operate-left {
      width: calc(100% - 260upx);
      margin-right: 20upx;
    }
    .operate-right {
      width: 240upx;
      .operate-store-out {
        display: flex;
        align-items: center;
        .icon {
          width: 40upx;
          height: 40upx;
          margin-right: 8upx;
          line-height: 40upx;
          text-align: center;
          image {
            width: 100%;
            vertical-align: top;
          }
        }
      }
    }
  }
}
</style>
