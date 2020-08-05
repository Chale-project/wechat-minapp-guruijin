<template>
  <view class="no-more" v-if="noMore">
    <image src="/static/images/icon_no_more.png" mode="widthFix" />
    <text>{{desc}}</text>
  </view>
</template>

<script>
export default {
  name: "noMore",
  props: {
    noMore: {
      type: Boolean,
      default: !1
    },
    desc: {
      type: String,
      default: "没有更多记录了！"
    }
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="scss">
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $uni-spacing-row-base $uni-spacing-col-lg;
  text-align: center;
  font-size: $uni-font-size-sm;
  color: $uni-text-color-grey;
  image {
    width: 40upx;
    margin-right: $uni-spacing-row-sm;
  }
}
</style>