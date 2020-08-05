<template>
  <view class="pages order-detail">
    <view class="order-detail-top">
      <view class="order-detail-status">
        <image :src="orderInfo.orderState=='waitOut'?'/static/images/icon_order_status_1.png':orderInfo.orderState=='loaded'?'/static/images/icon_order_status_2.png':orderInfo.orderState=='dispatching'?'/static/images/icon_order_status_3.png':orderInfo.orderState=='delivered'?'/static/images/icon_order_status_4.png':orderInfo.orderState=='receipted'?'/static/images/icon_order_status_5.png':orderInfo.orderState=='cancel'?'/static/images/icon_order_status_6.png':orderInfo.orderState=='refund'?'/static/images/icon_order_status_7.png':orderInfo.orderState=='success'?'/static/images/icon_order_status_8.png':'/static/images/icon_order_status_0.png'" class="status-icon" mode="widthFix" />
        <text>{{orderInfo.orderState=='waitOut'?'待出库':orderInfo.orderState=='loaded'?'已装车':orderInfo.orderState=='dispatching'?'配送中':orderInfo.orderState=='delivered'?'已送达':orderInfo.orderState=='receipted'?'已签收':orderInfo.orderState=='cancel'?'已取消':orderInfo.orderState=='refund'?'售后':orderInfo.orderState=='success'?'已完成':'未知'}}</text>
      </view>

      <view class="order-detail-sub-info">
        <view class="information-a ellipsis" v-if="orderInfo.orderState=='dispatching'||orderInfo.orderState=='delivered'||orderInfo.orderState=='receipted'||orderInfo.orderState=='refund'||orderInfo.orderState=='success'">
          <view class="information-car">
            配送车牌：<text>鄂A10245（黄牌）</text>
          </view>
          <view class="information-time" v-if="orderInfo.orderState=='dispatching'||orderInfo.orderState=='delivered'||orderInfo.orderState=='receipted'">
            已出库：30分钟45秒
          </view>
        </view>
      </view>
      <view class="order-detail-operate">
        <block v-if="orderInfo.orderState=='waitOut'">
          <form @submit="scanOutOfStock" class="operation-form-but" :report-submit='true'>
            <button type="default" class="operate-delivery-clerk" form-type="submit">
              <uni-icons type="scan" size="20" color="#0d6eb8" class="but-icon" />
              <text>扫码出库</text>
            </button>
          </form>
        </block>
        <block v-else-if="orderInfo.orderState=='loaded'"></block>
        <block v-else-if="orderInfo.orderState=='dispatching'">
          <form @submit="callOperate" class="operation-form-but" :report-submit='true'>
            <button type="default" class="operate-delivery-clerk" form-type="submit">
              <uni-icons type="phone" size="20" color="#40f427" class="but-icon" />
              <text>呼叫配送员</text>
            </button>
          </form>
        </block>
      </view>
      <view class="order-detail-address">
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

    </view>
    <view class="order-detail-content">
      <view class="order-goods-panel" v-if="orderInfo.speModelList.length>0">
        <view class="order-goods-list" v-for="(v,i) of orderInfo.speModelList" :key="i">
          <view class="goods-thumb">
            <image :src="v.specificationImages?v.specificationImages:defaultImage" @error="errImg(i)" />
          </view>
          <view class="goods-others">
            <view class="goods-others-t ellipsis">
              <view class="goods-title ellipsis">{{v.goodsTitle}}</view>
              <view class="goods-number ellipsis">X {{v.specificationNumber}}(块)</view>
            </view>
            <view class="goods-others-m ellipsis">
              <view class="goods-spec ellipsis">{{v.specificationName}} {{v.specificationAttributes}}</view>
              <view class="goods-added ellipsis">≈ ͏{{v.battlementsNumber}}(垛)</view>
            </view>
            <view class="goods-others-b ellipsis">
              <view class="goods-volume ellipsis">{{v.parameters}}</view>
              <view class="goods-added ellipsis">≈ {{v.totalArer}}(平方)</view>
            </view>
          </view>
        </view>
        <view class="order-goods-count">合计：<text>{{orderInfo.goodsVariety}}个品种，</text><text>{{orderInfo.battlements}}垛</text><text> {{orderInfo.totalNum}}块</text></view>
      </view>
      <empty v-else desc="订单商品缺失~" />

      <view class="order-flow-panel">
        <cell-item label="订单编号" :value="orderInfo.orderNumber" operate="复制" @click="copyOperate" />
        <cell-item label="下单时间" :value="orderInfo.addDataTime" />
        <cell-item label="支付方式" value="记账" />
      </view>
      <view class="order-delivery-panel" v-if="orderInfo.orderState=='dispatching'||orderInfo.orderState=='delivered'||orderInfo.orderState=='receipted'||orderInfo.orderState=='refund'||orderInfo.orderState=='success'">
        <cell-item label="配送员" value="F2019120115547852" operate="呼叫" @click="copyVaule" />
        <cell-item label="配送车牌" value="鄂A12035 （黄牌）" operate="配送清单" @click="copyOperate" />
        <cell-item label="出库批次号" value="OS201912014578526" operate="复制" @click="copyOperate" />
        <cell-item label="出库时间" value="2019-12-10 12：45：34" />
      </view>

    </view>

  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import cellItem from "@/components/cell-item";
import empty from "@/components/empty";

import util from "@/common/utils";
import { getSalesOrderInfo } from "@/common/api";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "orderDetail",
  components: {
    uniIcons,
    cellItem,
    empty
  },
  data() {
    return {
      id: null,
      orderInfo: {},
      defaultImage: "/static/images/default_logo_1x1.jpg"
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
    this.id = _id;

    this.getOrderDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // initData
    initData() {
      this.orderInfo = {};
    },

    // 扫码出库
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

          const url = `/pages/subPackageB/stockOut/goodsOut?orderId=${this.id}&goodsId=${_goodsId}`;
          util.navigateTo(url);
        }
      });
    },

    // 呼叫配送员
    callOperate(e) {
      console.log(e);
    },

    // 复制
    copyOperate(e) {
      util.saveFormid(e.detail.formId);
      uni.setClipboardData({
        data: "data",
        success: () => {}
      });
    },

    // 获取订单详情
    getOrderDetail() {
      getSalesOrderInfo(this.id).then(res => {
        const _info = res.info;
        this.orderInfo = _info;
      });
    },

    //处理no found 图片
    errImg(i) {
      this.orderInfo.speModelList[i].specificationImages = this.defaultImage;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.initData();
    this.getOrderDetail();
  }
};
</script>

<style lang="scss">
.order-detail {
  &-top {
    position: relative;
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    background-color: $uni-color-primary;
    .order-detail-status {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40upx;
      text-align: center;
      font-size: 30upx;
      color: #fff;
      .status-icon {
        display: inline-block;
        width: 20px;
        margin-right: 20upx;
      }
    }
    .order-detail-sub-info {
      margin-bottom: 40upx;
      text-align: center;
      color: #fff;
      .information-a {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .order-detail-operate {
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
    .order-detail-address {
      position: relative;
      display: flex;
      padding: 16upx 20upx;
      border-radius: $uni-border-radius-base;
      box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.4);
      background-color: #fff;
      z-index: 99;
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
    .order-goods-panel {
      margin-bottom: 40upx;
      .order-goods-list {
        position: relative;
        padding: 10px 0;
        display: flex;
        .goods-thumb {
          position: relative;
          width: 160upx;
          height: 160upx;
          margin-right: 20upx;
          overflow: hidden;
          border-radius: $uni-border-radius-base;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .goods-others {
          width: calc(100% - 180upx);
          .goods-others-t,
          .goods-others-m,
          .goods-others-b {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20upx;
            font-weight: 700;
            .goods-title,
            .goods-spec,
            .goods-volume {
              width: calc(100% - 180upx);
            }
            .goods-number,
            .goods-added {
              width: 180upx;
              text-align: right;
            }
          }
          .goods-others-m,
          .goods-others-b {
            color: #999;
            font-size: 24upx;
          }
          .goods-others-b {
            margin-bottom: 0;
          }
        }
      }
      .order-goods-list::after {
        @include backgroundLine(180upx, 0, 2upx);
      }
      .order-goods-list:last-child::after {
        @include backgroundLine(0, 0, 0);
      }
      .order-goods-count {
        position: relative;
        padding: 10px 0;
        text-align: right;
      }
      .order-goods-count::after {
        @include backgroundLine(0, 0, 2upx);
      }
    }
    .order-flow-panel {
      margin-bottom: 40upx;
    }
    .order-delivery-panel {
      margin-bottom: 40upx;
    }
  }
}
</style>
