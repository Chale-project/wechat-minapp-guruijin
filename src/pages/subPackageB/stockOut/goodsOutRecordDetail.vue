<template>
  <view class="pages goods-out-detail">
    <view class="goods-out-detail-top">
      <view class="goods-out-detail-status">
        <image :src="recordInfo.state=='truckCar'?'/static/images/icon_order_status_2.png':recordInfo.state=='dispatching'?'/static/images/icon_order_status_3.png':recordInfo.state=='success'?'/static/images/icon_order_status_4.png':'/static/images/icon_order_status_0.png'" class="status-icon" mode="widthFix" />
        <text>{{recordInfo.state=='truckCar'?'已装车':recordInfo.state=='dispatching'?'配送中':recordInfo.state=='success'?'已完成':'未知'}}</text>
      </view>

      <view class="goods-out-detail-delivery">
        <cell-item label="出库批次号" :value="recordInfo.putNumber" operate="复制" @click="copyOrderNumber" />
        <cell-item label="出库时间" :value="recordInfo.addDataTime" />
        <cell-item label="操作员" :value="recordInfo.operatorName" />
      </view>

    </view>
    <view class="goods-out-detail-content">
      <!-- <view class="goods-out-detail-address">
        <view class="address-icon">
          <image src="/static/images/icon_location.png" mode="widthFix" />
        </view>
        <view class="address-info">
          <view class="consignee-info ellipsis">
            <text class="consignee-name">{{recordInfo.receiver}} （{{recordInfo.clientCorporate}}）</text>
            <text class="consignee-phone">{{recordInfo.receiverMobile}}</text>
          </view>
          <view class="consignee-address-detail">
            <text>{{recordInfo.receiverAreaName}}</text>
          </view>
        </view>
      </view> -->

      <view class="order-flow-panel">
        <cell-item label="配送员" :value="recordInfo.deliverymanName" />
        <cell-item label="配送车牌" :value="recordInfo.carPlate" />
      </view>

      <view class="order-goods-panel" v-if="recordInfo.speModelList.length>0">
        <view class="goods-item" v-for="(v,i) of recordInfo.speModelList" :key="i">
          <view class="goods-thumb">
            <image :src="v.specificationImages?v.specificationImages:defaultImage" @error="errImg(i,j)" />
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

        <view class="order-goods-count">合计：{{recordInfo.goodsVariety}}个品种，{{recordInfo.battlements}}垛，{{recordInfo.totalNum}}块，{{recordInfo.totalArer}}M²</view>
      </view>

      <empty v-else desc="没有出库的商品~" />

    </view>

  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import cellItem from "@/components/cell-item";
import empty from "@/components/empty";
import mPicker from "@/components/m-picker";

import util from "@/common/utils";
import { getOutInStoreInfo } from "@/common/api";

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
      id: null,
      recordInfo: {},
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
    if (!_id) {
      util.showToastError("没有有效的出库记录！");
      return;
    }
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
      this.id = null;
      this.recordInfo = {};
    },

    // 复制订单号
    copyOrderNumber() {
      uni.setClipboardData({
        data: this.recordInfo.putNumber,
        success: () => {}
      });
    },

    // 获取订单详情
    getOrderDetail() {
      getOutInStoreInfo(this.id).then(res => {
        const _info = res.info;
        _info.carPlate =
          _info.carPlateNum +
          "（" +
          (_info.carPlateColour == "yellow"
            ? "黄色"
            : _info.carPlateColour == "blue"
            ? "蓝色"
            : _info.carPlateColour == "green"
            ? "绿色"
            : "") +
          "）";
        this.recordInfo = _info;
      });
    },

    //处理no found 图片
    errImg(i) {
      this.recordInfo.speModelList[i].specificationImages = this.defaultImage;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {}
};
</script>

<style lang="scss">
.goods-out-detail {
  &-top {
    position: relative;
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    background-color: $uni-color-primary;
    .goods-out-detail-status {
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
    .goods-out-detail-delivery {
      position: relative;
      padding: 16upx 20upx;
      border-radius: $uni-border-radius-base;
      box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.4);
      background-color: #fff;
      z-index: 99;
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
    padding: $uni-spacing-col-lg 0;
    background-color: $uni-bg-color;
    padding-bottom: 110upx;
    .goods-out-detail-address {
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
      padding: 0 30upx;
    }
    .order-goods-panel {
      margin-bottom: 20upx;
      .goods-item {
        position: relative;
        display: flex;
        padding: 20upx 30upx;
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
      .goods-item::after {
        @include backgroundLine(170upx, 0, 2upx);
      }
      .goods-item:last-child::after {
        @include backgroundLine(0, 0, 0);
      }

      .order-goods-count {
        margin-top: 100upx;
        padding: 20upx 30upx;
      }
    }
  }
}
</style>
