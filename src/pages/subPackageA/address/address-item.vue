<template>
  <view class="address-list-item" @tap="onTap">
    <view class="list-item-content">
      <view class="title ellipsis">{{options.contact}} <text class="sub-title">{{options.mobile}}</text></view>
      <view class="note ellipsis">{{options.province}} {{options.city}} {{options.town}} {{options.address}}</view>
    </view>
    <view class="list-item-extra">
      <uni-badge text="默认" type="success" v-if="options.acquiescent=='yes'" />
      <uni-icons type="arrowright" />
    </view>
  </view>
</template>

<script>
import { uniIcons, uniBadge } from "@dcloudio/uni-ui";
import util from "@/common/utils";

export default {
  name: "addressItem",
  components: {
    uniIcons,
    uniBadge
  },
  props: {
    options: {
      type: Object,
      default: e => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},

  methods: {
    onTap(e) {
      this.$emit("click", e);
    }
  }
};
</script>

<style lang="scss">
.address-list-item {
  position: relative;
  padding: 20upx 30upx;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  .list-item-content {
    width: calc(100% - 150upx);
    flex: 1;
    .title {
      margin-bottom: 6upx;
      margin-right: 10upx;
      .sub-title {
        padding-left: 10upx;
        color: #999;
      }
    }
    .note {
      color: #999;
    }
  }
  .list-item-extra {
    width: 120upx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.address-list-item::after {
  @include backgroundLine(30upx, 0, 2upx);
}
</style>
