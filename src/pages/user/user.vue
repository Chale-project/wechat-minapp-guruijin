<template>
  <view class="content">
    <image class="logo" src="/static/images/logo.png"></image>
    <view>
      <text class="title">{{title}}</text>
    </view>

  </view>
</template>

<script>
import {} from "@/common/api";
import util from "@/common/utils";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "user",
  data() {
    return {
      title: "我的"
    };
  },
  onLoad() {},
  methods: {}
};
</script>

<style lang="scss">
.content {
  text-align: center;
  height: 400upx;
}

.logo {
  height: 200upx;
  width: 200upx;
  margin-top: 200upx;
}

.title {
  font-size: 36upx;
  color: #8f8f94;
}
</style>
