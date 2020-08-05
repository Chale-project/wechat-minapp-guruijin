<template>
  <view class="goods-container">
    <view class="goods-item" v-for="(v,i) of list" :key="i">
      <view class="list-checkbox">
        <uni-icons type="checkbox-filled" size="24" color="#0d6eb8" v-if="v.checked" />
        <uni-icons type="circle" size="24" color="#ddd" v-else />
      </view>
      <view class="goods-thumb">
        <image :src="v.coverImage?v.coverImage:defaultImage" @error="errImg(i)" />
      </view>
      <view class="goods-others">
        <view class="goods-title ellipsis">{{v.goodsTitle}}</view>
        <view class="goods-spec ellipsis">步道砖 红色 透水</view>
        <view class="goods-volume ellipsis">200*160*60</view>
        <view class="goods-sales-stock ellipsis"><text class="sales">总销量：{{v.salesNum}}件</text><text class="stock">库存：{{v.stockNum}}件</text></view>
        <view class="goods-time ellipsis">{{v.addDataTime}}</view>
      </view>
    </view>
  </view>

</template>
<script>
import { uniIcons } from "@dcloudio/uni-ui";

import util from "@/common/utils";

export default {
  name: "goodsItemA",
  components: {
    uniIcons
  },
  props: {
    list: {
      type: Array,
      default: e => {
        return [];
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
    onTap(e) {
      this.$emit("click", e);
    },
    //处理no found 图片
    errImg(i) {
      this.goodsList[i].coverImage = this.defaultImage;
    }
  }
};
</script>

<style lang="scss" >
.goods-container {
  .goods-item {
    position: relative;
    padding: 20upx 30upx;
    display: flex;
    align-items: center;
    .list-checkbox {
      width: 48upx;
      margin-right: 10upx;
    }
    .goods-thumb {
      position: relative;
      width: 130upx;
      height: 130upx;
      margin-right: 20upx;
      overflow: hidden;
      border-radius: $uni-border-radius-base;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .goods-others {
      width: calc(100% - 208upx);
      .goods-title,
      .goods-spec,
      .goods-volume,
      .goods-sales-stock,
      .goods-time {
        margin-bottom: 4upx;
        font-size: 24upx;
        color: #999;
        .stock {
          padding-left: 10upx;
        }
      }
      .goods-title {
        font-size: 28upx;
        color: #333;
      }
      .goods-time {
        margin-bottom: 0;
      }
    }
  }
  .goods-item::after {
    @include backgroundLine(30upx, 0, 2upx);
  }
  .goods-item:last-child::after {
    @include backgroundLine(0, 0, 0);
  }
}
</style>