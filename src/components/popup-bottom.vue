<template >
  <uni-popup ref="popup" type="bottom" :custom="true" :mask-click="false">
    <view class="popup-content">
      <view class="popup-header">
        <view class="title">请选择</view>
        <view class="close" @tap="closePopup">
          <uni-icons type="clear" size="24" color="#ddd" />
        </view>
      </view>
      <view class="popup-body">
        <slot />
      </view>
      <view class="popup-footer">
        <form @submit="confirmOperate" class="operation-form-but" :report-submit='true'>
          <button type="default" class="operate-confirm" form-type="submit">确认</button>
        </form>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { uniPopup, uniIcons } from "@dcloudio/uni-ui";

export default {
  name: "popupBottom",
  components: {
    uniPopup,
    uniIcons
  },
  props: {},
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

    confirmOperate(e) {
      this.$emit("confirm", e);
    }
  }
};
</script>

<style lang="scss">
.popup-content {
  position: relative;
  border-top-left-radius: $uni-border-radius-base;
  border-top-right-radius: $uni-border-radius-base;
  background-color: #fff;
  .popup-header {
    padding: 20upx 30upx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      width: calc(100% - 48upx);
      text-align: center;
      font-size: 30upx;
      font-weight: 700;
    }
    .close {
      width: 48upx;
      height: 48upx;
      line-height: 48upx;
    }
  }
  .popup-body {
    min-height: 200upx;
    padding: 20upx 0;
    .popup-scroll-area {
      height: 100px;
    }
  }
  .popup-footer {
    padding: 20upx 30upx;
  }
}
</style>
