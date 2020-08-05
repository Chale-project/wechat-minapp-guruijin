<template>
  <view class="record-container">
    <view class="record-item" v-for="(v,i) of list" :key="i">
      <view class="record-item-header">
        <view class="record-number ellipsis">出库批次号：{{v.putNumber}}</view>

        <view class="record-status" v-if="v.state=='truckCar'">
          <image src="/static/images/icon_order_status_ec7101.png" mode="widthFix" />
        </view>
        <view class="record-status" v-else-if="v.state=='dispatching'">
          <image src="/static/images/icon_order_status_d81e06.png" mode="widthFix" />
        </view>
        <view class="record-status" v-else-if="v.state=='success'">
          <image src="/static/images/icon_order_status_1afa29.png" mode="widthFix" />
        </view>
        <view class="record-status" v-else>
          <image src="/static/images/icon_order_status_bf.png" mode="widthFix" />
        </view>
      </view>
      <view class="record-item-body" @click="seeDetail(v.id)">

        <view class="record-goods-list" v-for="(k,j) of v.speModelList" :key="j">
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

      <view class="record-item-others">合计：<text>{{v.goodsVariety}}个品种，</text><text>{{v.battlements}}垛</text><text> {{v.totalNum}}块</text></view>

      <view class="record-item-footer">
        <view class="record-time-operate ellipsis"><text class="date-time">出库日期：{{v.addDataTime|formatDateTime}}</text><text>操作员：{{v.operatorName}}</text></view>
        <!-- 已装车 -->
        <block v-if="v.state=='truckCar'">
          <form @submit="onTapOperate($event,'send',v.id,i)" class="operation-form-but" :report-submit='true'>
            <button type="default" class="but-operation operate-sacn" form-type="submit">
              <!-- <uni-icons type="scan" size="20" color="#0d6eb8" class="but-icon" /> -->
              <text>立即发车</text>
            </button>
          </form>
        </block>
        <!-- 配送中 -->
        <block v-else-if="v.state=='dispatching'">
          <form @submit="onTapOperate($event,'served',v.id,i)" class="operation-form-but" :report-submit='true'>
            <button type="default" class="but-operation operate-send" form-type="submit">
              <!-- <uni-icons type="list" size="20" color="#d81e06" class="but-icon" /> -->
              <text>确认送达</text>
            </button>
          </form>
        </block>
        <!-- 已送达 -->
        <block v-else-if="v.state=='success'">
        </block>
      </view>
    </view>

    <!-- 模态操作 -->
    <modal ref="modal" :title="operates.title" :message="operates.message" @confirm="onConfirmOperate" />

  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import modal from "@/components/modal";
import util from "@/common/utils";
import { startDelivery, sureDelivery } from "@/common/api";

export default {
  name: "recordItem",
  components: {
    uniIcons,
    modal
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      operates: {
        id: null,
        index: 0,
        type: "send",
        title: "提示",
        message: "确认开始配送"
      },
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
    seeDetail(id) {
      util.navigateTo(`/pages/subPackageB/stockOut/goodsOutRecordDetail?id=${id}`);
    },

    // 操作
    onTapOperate(e, type, id, index) {
      util.saveFormid(e.detail.formId);
      this.operates.type = type;
      this.operates.id = id;
      this.operates.index = index;
      switch (type) {
        case "send":
          this.operates.message = "确认开始配送吗？";
          break;
        case "served":
          this.operates.message = "确认已经送达了？";
          break;
      }
      this.$refs.modal.openPopup();
    },

    // 模态确认操作
    onConfirmOperate() {
      const _type = this.operates.type;
      switch (_type) {
        case "send":
          this.startSend();
          break;
        case "served":
          this.sureServed();
          break;
      }
      this.$refs.modal.closePopup();
    },

    // 开始配送
    startSend() {
      const _index = this.operates.index;
      const _List = this.list;
      startDelivery(this.operates.id).then(res => {
        util.showToastSuccess("操作成功!");
        _List[_index].state = "dispatching";
      });
    },

    // 已送达
    sureServed() {
      const _index = this.operates.index;
      const _List = this.list;
      sureDelivery(this.operates.id).then(res => {
        util.showToastSuccess("操作成功!");
        _List[_index].state = "success";
      });
    },

    //处理no found 图片
    errImg(i, j) {
      this.list[i].speModelList[j].specificationImages = this.defaultImage;
    }
  }
};
</script>

<style lang="scss">
.record-item {
  margin-top: 20upx;
  background-color: #fff;
  .record-item-header {
    position: relative;
    padding: 20upx 30upx;

    .record-number {
      padding-right: 100upx;
      font-weight: 700;
      font-size: 30upx;
    }
    .record-status {
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
  .record-item-header::after {
    @include backgroundLine(0, 0, 0);
  }
  .record-item-body {
    position: relative;
    .record-goods-list {
      position: relative;
      padding: 20upx 30upx;
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
    .record-goods-list::after {
      @include backgroundLine(30upx, 0, 2upx);
    }
    .record-goods-list:last-child::after {
      @include backgroundLine(0, 0, 0);
    }
  }
  .record-item-body::after {
    @include backgroundLine(0, 0, 2upx);
  }
  .record-item-others {
    position: relative;
    padding: 10px 15px;
    text-align: right;
  }
  .record-item-others::after {
    @include backgroundLine(0, 0, 2upx);
  }
  .record-item-footer {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    text-align: right;
    .record-time-operate {
      text-align: left;
      .date-time {
        margin-right: 10upx;
      }
    }
    .operation-form-but {
      display: inline-block;
      width: 168upx;
      margin-left: 20upx;
      .but-operation.operate-sacn {
        color: $uni-color-primary;
      }
      .but-operation.operate-sacn::after {
        border: 1px solid $uni-color-primary;
      }
      .but-operation.operate-send {
        color: #4cd964;
      }
      .but-operation.operate-send::after {
        border: 1px solid #4cd964;
      }
    }
  }
}
</style>