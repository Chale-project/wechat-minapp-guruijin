<template>
  <view class="cell-item">
    <view class="cell-item-label ellipsis">{{label?label:''}}：</view>
    <view class="cell-item-value ellipsis">{{value?value:''}}</view>
    <view class="cell-item-operate ellipsis">
      <form @submit="operateCall" class="operation-form-but" :report-submit='true' v-if="operate">
        <button type="default" size="mini" class="but-operation" form-type="submit">
          <text>{{operate?operate:'操作'}}</text>
        </button>
      </form>
    </view>
  </view>
</template>

<script>
export default {
  name: "cellItem",
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    operate: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },

  created() {},

  mounted() {},

  onLoad() {},

  onShow() {},

  methods: {
    operateCall(e) {
      this.$emit("click", e);
    }
  }
};
</script>

<style lang="scss">
.cell-item {
  display: flex;
  align-items: center;
  padding: $uni-spacing-row-base 0;
  &-label {
    width: 180upx;
    color: $uni-text-color-grey;
  }
  &-value {
    width: calc(100% - 320upx);
  }
  &-operate {
    text-align: right;
    width: 140upx;
    .operation-form-but {
      display: inline-block;
      .but-operation {
        padding: 0 10upx;
        line-height: 1.7;
        background-color: #d8d8d8;
      }
    }
  }
}
</style>