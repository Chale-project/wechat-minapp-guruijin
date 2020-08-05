<template>
  <view class="pages goods-in">

    <view class="goods-in-content" v-if="goodsList.length>0">
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
    <empty v-else desc="请扫码添加入库商品~" />

    <view class="goods-in-operate">
      <view class="operate-left">
        合计：<text>{{stack}}垛，</text><text>{{piece}}块，</text><text>{{area}}M²</text>
      </view>

      <view class="operate-right">
        <form @submit="saveGoodsStore" class="operation-form-but" :report-submit='true'>
          <button type="default" class="operate-store-in" form-type="submit">
            <view class="icon">
              <image src="/static/images/icon_store_in.png" mode="widthFix" />
            </view>
            <text>确认入库</text>
          </button>
        </form>
      </view>
    </view>

    <view class="scancode-store-in heartBeat">
      <uni-icons type="scan" size="32" color="#0d6eb8" @click="scanCode" />
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import empty from "@/components/empty";

import util from "@/common/utils";
import { getGoodsInfoOrder, addGoodsStoreIn } from "@/common/api";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "goodsIn",
  components: {
    uniIcons,
    empty
  },
  data() {
    return {
      id: null,
      goodsList: [],
      stack: 0,
      piece: 0,
      area: 0,
      defaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {},
  watch: {
    goodsList: {
      handler(e) {
        this.countTotalStackPieceArea();
      },
      deep: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();

    const _id = options.id;
    this.id = _id;

    this.getGoodsDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // initData
    initData() {
      this.id = null;
      this.stack = 0;
      this.piece = 0;
      this.area = 0;
      this.goodsList = [];
    },

    // 扫码入库
    scanCode() {
      uni.scanCode({
        success: res => {
          if (res.result.length != 32) {
            util.showToastError("请扫描有效的商品码！");
            return;
          }
          this.id = res.result;
          this.getGoodsDetail();
        }
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

    // 商品入库
    saveGoodsStore(e) {
      util.saveFormid(e.detail.formId);
      if (this.goodsList.length < 1) {
        util.showToastError("请扫码添加要入库的商品！");
        return;
      }
      const dataArr = this.goodsList.map(item => {
        return `${item.id}~${item.number}`;
      });
      const dataStr = dataArr.join(",");
      addGoodsStoreIn(dataStr).then(res => {
        util.showToastSuccess("入库成功!");
        this.initData();
      });
    },

    // 获取订单详情
    getGoodsDetail() {
      getGoodsInfoOrder(this.id).then(res => {
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
.goods-in {
  &-content {
    position: relative;
    background-color: $uni-bg-color;
    padding-bottom: 110upx;
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
      .operate-store-in {
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

  .scancode-store-in {
    position: fixed;
    width: 100upx;
    height: 100upx;
    right: 30upx;
    bottom: 150upx;
    text-align: center;
    line-height: 100upx;
    border-radius: $uni-border-radius-circle;
    background-color: #fff;
    overflow: hidden;
    z-index: 999;
  }
  @keyframes heartBeat {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.4);
    }

    100% {
      transform: scale(1);
    }
  }
  .heartBeat {
    animation-name: heartBeat;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease;
  }
}
</style>
