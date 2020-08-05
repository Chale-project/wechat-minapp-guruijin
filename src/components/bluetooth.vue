<template >
  <uni-popup ref="popup" :custom="true" :mask-click="false">
    <view class="bluetooth">

      <view class="bluetooth-header">请选择蓝牙连接</view>
      <scroll-view scroll-y class="bluetooth-body">
        <view class="bluetooth-item" v-for="item of bluetoothList" :key="item.deviceId" @tap="choose(item)">
          <view class="name ellipsis">{{item.name}}</view>
          <view class="status">{{item.status?'已连接':'未连接'}}</view>
          <view class="loading" v-if="item.loading">
            <uni-icons type="spinner-cycle" size="20" color="#ccc"></uni-icons>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="bluetooth-close" @tap="closePopup">
      <uni-icons type="close" size="30" color="#ccc"></uni-icons>
    </view>
  </uni-popup>
</template>

<script>
import { uniPopup, uniIcons } from "@dcloudio/uni-ui";

export default {
  name: "Bluetooth",
  components: {
    uniPopup,
    uniIcons
  },
  props: {
    bluetoothList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  computed: {},

  created() {},

  mounted() {},

  onLoad() {},

  onShow() {},

  methods: {
    closePopup() {
      this.$refs.popup.close();
    },

    openPopup() {
      this.$refs.popup.open();
    },

    choose(e) {
      this.$emit("connect", e);
    }
  }
};
</script>

<style lang="scss">
.bluetooth {
  box-sizing: border-box;
  width: 600upx;
  // max-height: 620upx;
  margin: 0 auto;
  background: $uni-bg-color;
  border-radius: $uni-border-radius-base;
  text-align: center;
  padding: $uni-spacing-row-lg;
  overflow: hidden;
  &-header {
    padding: $uni-spacing-row-base 0;
    text-align: center;
    color: $uni-text-color;
    font-size: $uni-font-size-lg;
  }
  &-body {
    box-sizing: border-box;
    width: 100%;
    height: 480upx;
    padding: $uni-spacing-row-base;
    overflow: hidden;

    .bluetooth-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $uni-spacing-row-base;
      .name {
        width: calc(100% - 130upx);
        text-align: left;
      }
      .status {
        width: 90upx;
        text-align: left;
        color: $uni-text-color-grey;
      }
      .loading {
        width: 40upx;
        height: 40upx;
        text-align: center;
        line-height: 20px;
        overflow: hidden;
        animation: rotate 2s linear infinite;
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
    }
    .bluetooth-item::after {
      @include backgroundLine;
    }
  }
}

.bluetooth-close {
  width: 30px;
  height: 30px;
  margin: 15px auto 0;
}
</style>
