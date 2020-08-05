<template>

  <view class="customer-list-item" @tap="onTap">
    <view class="list-item-content">
      <view class="title ellipsis">{{options.corporateName}} <text class="sub-title">{{options.corporateNickName}}</text></view>
      <view class="note ellipsis">联系人：{{options.name}} {{options.phoneNumber}}</view>
    </view>
    <view class="list-item-extra">
      <uni-badge text="禁用" type="warning" v-if="options.state=='disabled'" />
      <uni-badge text="启用" type="success" v-else-if="options.state=='enabled'" />
      <uni-icons type="arrowright" />
    </view>
  </view>

</template>

<script>
import { uniIcons, uniBadge } from "@dcloudio/uni-ui";
import util from "@/common/utils";

export default {
  name: "customerItem",
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
.customer-list-item {
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
.customer-list-item::after {
  @include backgroundLine(30upx, 0, 2upx);
}
</style>
