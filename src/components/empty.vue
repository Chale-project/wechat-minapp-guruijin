<template>
  <view class="empty-data">
    <image src="/static/images/icon_empty.png" mode="widthFix" />
    <text>{{desc}}</text>
  </view>
</template>

<script>
export default {
  name: "empty",
  props: {
    desc: {
      type: String,
      default: "没有找到任何记录~"
    }
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="scss">
.empty-data {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 50px 15px;
  image {
    width: 80px;
  }
  text {
    padding: 10px 0;
    color: #999;
  }
}
</style>