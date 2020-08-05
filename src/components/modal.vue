<template >
  <uni-popup ref="popup" :custom="true" :mask-click="false">
    <view class="popup-content">
      <view class="popup-header">
        <view class="title">{{title?title:'提示'}}</view>
      </view>
      <view class="popup-body">
        <view class="message" v-if="message">{{message}}</view>
        <slot v-else />
      </view>
      <view class="popup-footer">
        <form @submit="cancelOperate" class="operation-form-but" :report-submit='true'>
          <button type="default" class="operate-cancel" form-type="submit">{{cancelButText}}</button>
        </form>
        <form @submit="confirmOperate" class="operation-form-but" :report-submit='true' v-if="!openType">
          <button type="default" class="operate-confirm" form-type="submit">{{confirmButText}}</button>
        </form>
        <form class="operation-form-but" v-else>
          <button type="default" class="operate-confirm" :open-type="openType" lang="zh_CN" :business-id="businessId" :session-from="sessionFrom" :send-message-title="sendMessageTitle" :send-message-path="sendMessagePath" :send-message-img="sendMessageImg" :show-message-card="showMessageCard" :app-parameter="appParameter" @getuserinfo="bindGetUserInfo" @contact="bindContact" @getphonenumber="bindGetPhoneNumber" @error="bindError" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting">{{confirmButText}}</button>
        </form>

      </view>
    </view>
  </uni-popup>
</template>

<script>
import { uniPopup } from "@dcloudio/uni-ui";
import util from "@/common/utils";

export default {
  name: "modal",
  components: {
    uniPopup
  },
  props: {
    title: {
      type: String,
      default: "提示"
    },
    message: {
      type: String,
      default: ""
    },
    cancelButText: {
      type: String,
      default: "取消"
    },
    confirmButText: {
      type: String,
      default: "确认"
    },
    openType: {
      type: String,
      default: ""
    },
    businessId: Number,
    sessionFrom: String,
    sendMessageTitle: String,
    sendMessagePath: String,
    sendMessageImg: String,
    showMessageCard: Boolean,
    appParameter: String,
    ariaLabel: String
  },
  data() {
    return {};
  },
  computed: {},

  created() {},

  mounted() {},

  methods: {
    closePopup() {
      this.$refs.popup.close();
    },

    openPopup() {
      this.$refs.popup.open();
    },

    cancelOperate(e) {
      util.saveFormid(e.detail.formId);
      this.closePopup();
      this.$nextTick(() => {
        this.$emit("cancel");
      });
    },

    confirmOperate(e) {
      util.saveFormid(e.detail.formId);
      this.$emit("confirm");
    },

    bindGetUserInfo(e) {
      this.$emit("getuserinfo", e);
    },
    bindContact(e) {
      this.$emit("contact", e);
    },
    bindGetPhoneNumber(e) {
      this.$emit("getphonenumber", e);
    },
    bindError(e) {
      this.$emit("error", e);
    },
    bindLaunchApp(e) {
      this.$emit("launchapp", e);
    },
    bindOpenSetting(e) {
      this.$emit("opensetting", e);
    }
  }
};
</script>

<style lang="scss">
.popup-content {
  position: relative;
  width: 600upx;
  border-radius: $uni-border-radius-base;
  background-color: #fff;
  .popup-header {
    padding: 20upx 30upx;
    .title {
      text-align: center;
      font-size: 30upx;
      font-weight: 700;
    }
  }
  .popup-body {
    min-height: 100upx;
    padding: 20upx 0;
    .message {
      padding: 20upx 30upx;
      text-align: center;
      color: #666;
    }
  }
  .popup-footer {
    display: flex;
    align-items: center;
    .operation-form-but {
      flex: 1;
      .operate-cancel,
      .operate-confirm {
        background-color: transparent;
        border-radius: 0;
      }
      .operate-cancel::after,
      .operate-confirm::after {
        border-radius: 0;
      }
      .operate-cancel {
        color: $uni-text-color;
      }
      .operate-confirm {
        color: $uni-color-primary;
      }
    }
  }
}
</style>
