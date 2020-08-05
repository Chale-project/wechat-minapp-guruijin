<template >
  <view :class="required?'m-picker m-picker-required':'m-picker'">
    <view class="m-picker-label" v-if="label">{{label}}</view>
    <view :class="label?'m-picker-value':'m-picker-no-label-value'">
      <picker :mode="mode" :value="index" :range-key="rangekey" :range="range" :disabled="disabled" @change="onChangePicker" @columnchange="onColumnChangePicker">
        <view class="picker">
          <view class="picker-text ellipsis" v-if="mode=='selector'"><text v-if="label">{{range.length>0?range[index][rangekey]||'请选择':'请选择'}}</text><text v-else>请选择</text></view>
          <view class="picker-text ellipsis" v-else-if="mode=='multiSelector'"><text v-if="label"><text v-if="index.length>0"><text>{{range[0][index[0]][rangekey]}}</text> <text v-if="range[1].length>0">，{{range[1][index[1]][rangekey]}}</text></text><text v-else>请选择</text></text><text v-else>请选择</text></view>
          <view class="picker-icon" v-if="icon">
            <uni-icons type="arrowright" size="20" :color="color" />
          </view>
        </view>
      </picker>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import util from "@/common/utils";

export default {
  name: "mPicker",
  components: { uniIcons },
  props: {
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: "#969799"
    },
    mode: {
      type: String,
      default: "selector"
    },
    label: {
      type: String,
      default: ""
    },
    index: {
      type: [Number, Array],
      default: 0 || []
    },
    rangekey: {
      type: String,
      default: ""
    },
    range: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},

  mounted() {},

  methods: {
    onChangePicker(e) {
      this.$emit("change", e);
    },

    onColumnChangePicker(e) {
      this.$emit("columnchange", e);
    }
  }
};
</script>

<style lang="scss">
.m-picker {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 20upx 0;
  .m-picker-label {
    width: 180upx;
  }

  .m-picker-value,
  .m-picker-no-label-value {
    width: calc(100% - 180upx);
    .picker {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .picker-text {
        width: calc(100% - 40upx);
        color: #999;
        text-align: right;
      }
      .picker-icon {
        width: 36upx;
        height: 48upx;
        line-height: 48upx;
        text-align: center;
        overflow: hidden;
      }
    }
  }
  .m-picker-no-label-value {
    width: 100%;
  }
}
.m-picker.m-picker-required::before {
  position: absolute;
  content: "*";
  left: -14upx;
  color: #ee0a24;
}
.m-picker::after {
  @include backgroundLine(0, 0, 2upx);
}
</style>
