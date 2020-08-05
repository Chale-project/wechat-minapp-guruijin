<template>
  <view class="order-container">
    <view class="order-item" v-for="(v,i) of list" :key="i">
      <view class="order-item-header">
        <view class="order-number ellipsis">订单编号：{{v.orderNumber}}</view>

        <view class="order-status" v-if="v.orderState=='waitOut'">
          <image src="/static/images/icon_order_status_0d6eb8.png" mode="widthFix" />
        </view>
        <view class="order-status" v-else-if="v.orderState=='loaded'">
          <image src="/static/images/icon_order_status_ec7101.png" mode="widthFix" />
        </view>
        <view class="order-status" v-else-if="v.orderState=='dispatching'">
          <image src="/static/images/icon_order_status_d81e06.png" mode="widthFix" />
        </view>
        <view class="order-status" v-else-if="v.orderState=='delivered'">
          <image src="/static/images/icon_order_status_04f4c5.png" mode="widthFix" />
        </view>
        <view class="order-status" v-else-if="v.orderState=='receipted'">
          <image src="/static/images/icon_order_status_f4ea2a.png" mode="widthFix" />
        </view>
        <view class="order-status" v-else-if="v.orderState=='cancel'">
          <image src="/static/images/icon_order_status_bfbfbf.png" mode="widthFix" />
        </view>
        <view class="order-status" v-else-if="v.orderState=='refund'">
          <image src="/static/images/icon_order_status_bfbfbf.png" mode="widthFix" />
        </view>
        <view class="order-status" v-else-if="v.orderState=='success'">
          <image src="/static/images/icon_order_status_1afa29.png" mode="widthFix" />
        </view>
        <view class="order-status" v-else>
          <image src="/static/images/icon_order_status_bf.png" mode="widthFix" />
        </view>
      </view>
      <view class="order-item-body" @click="seeOrderDetail(v.id)">

        <view class="order-goods-list" v-for="(k,j) of v.speModelList" :key="j">
          <view class="goods-thumb">
            <image :src="k.specificationImages?k.specificationImages:defaultImage" @error="errImg(i,j)" />
          </view>
          <view class="goods-others">
            <view class="goods-others-t ellipsis">
              <view class="goods-title ellipsis">{{k.goodsTitle}}</view>
              <view class="goods-number ellipsis">X {{k.specificationNumber}}(块)</view>
            </view>
            <view class="goods-others-m ellipsis">
              <view class="goods-spec ellipsis">{{k.specificationName}} {{k.specificationAttributes}}</view>
              <view class="goods-added ellipsis">≈ ͏{{k.battlementsNumber}}(垛)</view>
            </view>
            <view class="goods-others-b ellipsis">
              <view class="goods-volume ellipsis">{{k.parameters}}</view>
              <view class="goods-added ellipsis">≈ {{k.totalArer}}(平方)</view>
            </view>
          </view>
        </view>

      </view>

      <view class="order-item-others">合计：<text>{{v.goodsVariety}}个品种，</text><text>{{v.battlements}} 垛</text><text>{{v.totalNum}} 块</text></view>

      <view class="order-item-footer">

        <!-- 待出库 -->
        <block v-if="v.orderState=='waitOut'">
          <form @submit="scanCodeO($event,v.id,i)" class="operation-form-but" :report-submit='true'>
            <button type="default" class="but-operation operate-sacn" form-type="submit">
              <uni-icons type="scan" size="20" color="#0d6eb8" class="but-icon" />
              <text>扫码出库</text>
            </button>
          </form>
        </block>
        <!-- 已装车 -->
        <block v-else-if="v.orderState=='loaded'">
          <form @submit="scanCodeO($event,v.id,i)" class="operation-form-but" :report-submit='true'>
            <button type="default" class="but-operation operate-sacn" form-type="submit">
              <uni-icons type="scan" size="20" color="#0d6eb8" class="but-icon" />
              <text>扫码出库</text>
            </button>
          </form>
        </block>
        <!-- 配送中 -->
        <block v-else-if="v.orderState=='dispatching'">
          <form @submit="seeSendInfo($event,v.id,i)" class="operation-form-but" :report-submit='true'>
            <button type="default" class="but-operation operate-send" form-type="submit">
              <uni-icons type="list" size="20" color="#d81e06" class="but-icon" />
              <text>配送信息</text>
            </button>
          </form>
        </block>
        <!-- 已送达 -->
        <block v-else-if="v.orderState=='delivered'">
        </block>
        <!-- 已签收 -->
        <block v-else-if="v.orderState=='receipted'">
        </block>
        <!-- 已取消 -->
        <block v-else-if="v.orderState=='cancel'">
        </block>
        <!-- 售后 -->
        <block v-else-if="v.orderState=='refund'">
        </block>
        <!-- 已完成 -->
        <block v-else-if="v.orderState=='success'">
        </block>

      </view>

    </view>
  </view>

</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import util from "@/common/utils";

export default {
  name: "orderItem",
  components: {
    uniIcons
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      defaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {},
  watch: {
    list: {
      immediate: true,
      handler(e) {
        this.$emit("update:list", e);
      }
    }
  },

  created() {},

  mounted() {},

  methods: {
    // 查看订单详情
    seeOrderDetail(id) {
      util.navigateTo(`/pages/subPackageA/order/orderDetail?id=${id}`);
    },

    // 扫码出库
    scanCodeO(e, id, index) {
      util.saveFormid(e.detail.formId);
      uni.scanCode({
        success: res => {
          const _goodsId = res.result;

          if (_goodsId.length != 32) {
            util.showToastError("请扫描有效的商品码！");
            return;
          }
          const _orderGoodsList = this.list[index].speModelList;
          const _newOrderGoodsList = _orderGoodsList.filter(item => {
            return item.goodsSpecificationId == _goodsId;
          });
          if (_newOrderGoodsList.length == 0) {
            util.showToastError("该订单中没有此商品！");
            return;
          }

          const url = `/pages/subPackageB/stockOut/goodsOut?orderId=${id}&goodsId=${_goodsId}`;
          util.navigateTo(url);
        }
      });
    },

    // 查看配送信息
    seeSendInfo(id) {
      this.seeOrderDetail(id);
    },

    //处理no found 图片
    errImg(i, j) {
      this.list[i].speModelList[j].specificationImages = this.defaultImage;
    }
  }
};
</script>

<style lang="scss">
.order-item {
  margin-top: 20upx;
  background-color: #fff;
  .order-item-header {
    position: relative;
    padding: 20upx 30upx;

    .order-number {
      padding-right: 100upx;
      font-weight: 700;
      font-size: 30upx;
    }
    .order-status {
      position: absolute;
      width: 80upx;
      height: 80upx;
      right: 30upx;
      top: -10upx;
      border-radius: 50%;
      overflow: hidden;
      image {
        width: 100%;
      }
    }
  }
  .order-item-header::after {
    @include backgroundLine(0, 0, 0);
  }
  .order-item-body {
    position: relative;
    .order-goods-list {
      position: relative;
      padding: 10px 15px;
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
      @include backgroundLine(30upx, 0, 2upx);
    }
    .order-goods-list:last-child::after {
      @include backgroundLine(0, 0, 0);
    }
  }
  .order-item-body::after {
    @include backgroundLine(0, 0, 2upx);
  }
  .order-item-others {
    position: relative;
    padding: 10px 15px;
    text-align: right;
  }
  .order-item-others::after {
    @include backgroundLine(0, 0, 2upx);
  }
  .order-item-footer {
    position: relative;
    padding: 10px 15px;
    text-align: right;
    .operation-form-but {
      display: inline-block;
      margin-left: 20upx;
      .but-operation.operate-sacn {
        color: $uni-color-primary;
      }
      .but-operation.operate-sacn::after {
        border: 1px solid $uni-color-primary;
      }
      .but-operation.operate-send {
        color: #d81e06;
      }
      .but-operation.operate-send::after {
        border: 1px solid #d81e06;
      }
    }
  }
}
</style>