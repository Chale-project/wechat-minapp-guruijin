<template>
  <view class="customer-address-info" @tap="onTap">
    <view class="address-left">
      <uni-icons type="location" size="24" color="#0d6eb8" style="font-weight:700;" />
    </view>
    <view class="address-right">
      <view class="address-name-mobile  ellipsis"><text class="name">{{options.contact||''}}</text><text class="mobile">{{options.mobile||''}}</text></view>
      <view class="address-detail ellipsis-2"><text class="address-p-c-a">{{options.province||''}} {{options.city||''}} {{options.town||''}}</text><text class="address-d">{{options.address||''}}</text></view>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import util from "@/common/utils";

export default {
  name: "addressInfo",
  components: {
    uniIcons
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
.customer-address-info {
  display: flex;
  align-items: center;
  padding: 20upx 30upx;

  background-color: #fff;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAAECAMAAAB/RHsdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDOTc0QTU5Mjg3ODExRUFBQjBFOEJGOTEzQTI0MDE2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDOTc0QTVBMjg3ODExRUFBQjBFOEJGOTEzQTI0MDE2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkM5NzRBNTcyODc4MTFFQUFCMEU4QkY5MTNBMjQwMTYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkM5NzRBNTgyODc4MTFFQUFCMEU4QkY5MTNBMjQwMTYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4av4qvAAAAHlBMVEWt3Pz7raf////+5OLw+P7+8/L7ta+z3/zi8/77sKqzMElvAAAAI0lEQVR42mJgIBJwMGECVjZGIgEnMxbtLOwMo7YPoO0AAQYAR54CeUTrZMIAAAAASUVORK5CYII=")
    left bottom repeat-x;
  .address-left {
    width: 120upx;
  }
  .address-right {
    width: calc(100% - 120upx);
    .address-name-mobile {
      margin-bottom: 10upx;
      .name {
        margin-right: 10upx;
        font-size: 32upx;
      }
      .address-detail {
        color: #666;
      }
    }
  }
}
.customer-address-info::after {
  @include backgroundLine(30upx, 0, 2upx);
}
</style>
