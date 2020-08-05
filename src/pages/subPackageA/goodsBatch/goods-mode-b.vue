<template>
  <view class="goods-container">
    <view class="goods-item>" v-for="(v,i) of list" :key="i">
      <view class="goods-thumb">
        <image :src="v.coverImage?v.coverImage:defaultImage" @error="errImg(i)" />
      </view>
      <view class="goods-info">
        <view class="goods-title ellipsis">{{v.goodsTitle}}</view>
        <view class="goods-spec ellipsis">{{v.specificationName}} {{v.parameters}} {{v.specificationAttributes}}</view>
        <view class="goods-others">
          <view class="goods-price-stock">
            <view class="price">￥<text>{{v.goodsPrice/100}}</text>/块</view>
            <view class="stock">库存：{{v.totalBattlement}}垛，{{v.battlementNum}}块/垛</view>
          </view>
          <view class="goods-operate">
            <uni-icons type="minus" size="24" color="#0d6eb8" v-if="v.number>0" @click="onTapMinus(i)" />
            <view class="input-number ellipsis" v-if="v.number>0">
              <input :value="v.number" maxlength="6" type="number" class="number" :disabled="v.number==1?true:false" @input="onInputNumber($event,i)" />
              <text class="unit">垛</text>
            </view>
            <uni-icons type="plus" size="24" color="#0d6eb8" @click="onTapPlus(i)" />
          </view>
        </view>
      </view>
    </view>
  </view>

</template>
<script>
import { uniIcons } from "@dcloudio/uni-ui";

import util from "@/common/utils";

export default {
  name: "goodsItemB",
  components: {
    uniIcons
  },
  props: {
    list: {
      type: Array,
      observer: e => {
        console.log(e);
        // return [];
      }
    }
  },
  data() {
    return {
      defaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {},
  watch: {},

  created() {},

  mounted() {},

  methods: {
    // 减少
    onTapMinus(i) {
      this.$emit("minus", i);
    },

    // onInputNumber
    onInputNumber(e, i) {
      e.detail.index = i;
      this.$emit("input", e);
    },

    // 增加
    onTapPlus(i) {
      this.$emit("plus", i);
    },

    //处理no found 图片
    errImg(i) {
      this.$emit("error", i);
    }
  }
};
</script>

<style lang="scss" >
.goods-container {
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
        font-size: 30upx;
      }
      .goods-spec {
        font-size: 24upx;
        color: #999;
      }
      .goods-others {
        display: flex;
        align-items: center;
        .goods-price-stock {
          width: 50%;
          .price.stock {
            font-size: 24upx;
          }
          .price {
            color: #dd524d;
            text {
              font-size: 32upx;
            }
          }
          .stock {
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
</style>