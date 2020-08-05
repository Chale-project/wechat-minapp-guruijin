<template>
  <view class="pages property">
    <view class="property-type">
      <uni-segmented-control :current="curTypeIndex" :values="propertyList" @clickItem="onSwitchPropertyType" style-type="text" active-color="#0d6eb8" />
    </view>
    <view class="property-content">
      <div :class="'property-content-list content-'+i" v-show="curType === i" v-for="(v,i) of propertyData" :key="i">
        <div class="property-item" v-for="(k,j) of v" :key="j">
          <div class="label">{{k.propertiesChinaName}}</div>
          <div class="operate">
            <switch :checked="k.propertiesState=='enabled'?true:false" color="#0d6eb8" @change="switchChangePropertyItem($event,i,j)" />
          </div>
        </div>
      </div>
    </view>

    <view class="form-operate">
      <form @submit="saveProperty" class="operation-form-but" :report-submit='true'>
        <button type="default" class="but-save-property" form-type="submit">保存修改</button>
      </form>
    </view>

  </view>
</template>

<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui";
import util from "@/common/utils";
import { mapMutations } from "vuex";

import {
  getPropertyData,
  modifyPropertyData,
  getPropertyConfig
} from "@/common/api";

export default {
  name: "property",
  components: {
    uniSegmentedControl
  },
  data() {
    return {
      propertyList: ["全部", "员工", "客户", "配送员"],
      curTypeIndex: 0,
      curType: "all",
      propertyData: {}
    };
  },
  computed: {},
  watch: {},

  onLoad(options) {
    this.getPropertyList();
  },

  onShow() {},

  mounted() {},

  methods: {
    ...mapMutations("user", ["SET_USER_CONFIG"]),

    // 切换账号类型
    onSwitchPropertyType(e) {
      const { currentIndex } = e;
      if (this.curType !== currentIndex) this.curType = currentIndex;
      switch (currentIndex) {
        case 0:
          this.curType = "all";
          break;
        case 1:
          this.curType = "clerk";
          break;
        case 2:
          this.curType = "client";
          break;
        case 3:
          this.curType = "deliveryman";
          break;
      }
    },

    // 设置每个属性的显示
    switchChangePropertyItem(e, i, j) {
      let _value = e.detail.value ? "enabled" : "disabled";
      let _propertyData = this.propertyData;
      _propertyData[i][j].propertiesState = _value;
    },

    // 保存配置
    saveProperty(e) {
      util.saveFormid(e.detail.formId);
      const data = this.propertyData;
      modifyPropertyData(data).then(res => {
        this.getPropertyConfigData();
      });
    },

    // 获取配置
    getPropertyConfigData() {
      getPropertyConfig().then(res => {
        util.showToastSuccess("操作成功！");
        const _config = res.result;
        uni.setStorageSync("userConfig", _config);
        this.SET_USER_CONFIG(_config);
      });
    },

    // 获取账号属性数据
    getPropertyList() {
      getPropertyData().then(res => {
        this.propertyData = res.result;
      });
    }
  }
};
</script>

<style lang="scss">
.property {
  position: relative;
  .property-type {
    padding: 20upx 30upx 0;
  }
  .property-content {
    position: relative;
    padding-bottom: 100upx;
    border-top: 1upx solid $uni-border-color;
    .property-content-list {
      .property-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20upx 30upx;
        background-color: #fff;
        .label {
        }
        .operate {
        }
      }
      .property-item::after {
        @include backgroundLine(30upx, 0, 2upx);
      }
    }
  }
  .form-operate {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10upx 30upx;
    background-color: #fff;
    z-index: 99;
  }
}
</style>
