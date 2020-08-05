<template>

  <view class="delivery-list-item" @tap="onTap">
    <view class="list-item-content">
      <view class="title ellipsis">{{options.deliverymanName}} {{options.deliverymanPhone}}</view>
      <view class="note ellipsis">车牌：{{options.carPlateCode}} {{options.carPlateNum}} <text v-for="(v,i) of carPlateColorList" :key="i" v-if="v.color==options.carPlateColor">（{{v.title}}）</text></view>
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
  name: "deliveryItem",
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
    return {
      carPlateColorList: [
        { title: "黄色", color: "yellow" },
        { title: "蓝色", color: "blue" },
        { title: "绿色", color: "green" }
      ]
    };
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
.delivery-list-item {
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
.delivery-list-item::after {
  @include backgroundLine(30upx, 0, 2upx);
}
</style>
