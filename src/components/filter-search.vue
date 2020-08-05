<template >
  <view class="filter-search">
    <view class="filter-nav ellipsis">
      <view class="filter-menu" v-if="filterList.length>0">
        <view class="menu-item" v-for="(i,k) of filterList" :key="k" @tap="changeFilterMenu(k)">
          <text class="title">{{i.title}}</text>
          <uni-icons type="arrowdown" size="16" color="#333" />
        </view>
      </view>
      <view class="filter-input" v-if="showSearch">
        <uni-search-bar :radius="100" @confirm="confirmSearch" @cancel="cancelSearch"></uni-search-bar>
      </view>
    </view>

    <uni-popup ref="popup" type="top" :custom="true">
      <view class="popup-content">
        <!-- <view class="popup-header">
          <view class="title">请选择</view>
          <view class="close" @tap="closePopup">
            <uni-icons type="clear" size="24" color="#ddd" />
          </view>
        </view> -->
        <view class="popup-body">
          <scroll-view class="filter-scroll-area" scroll-y="true">
            <view class="filter-content filter-content-A" v-if="filterList[curNavIndex].mode==='A'">
              <block v-if="filterList[curNavIndex].subMenu.length>0">
                <view class="filter-item" v-for="(p,i) of filterList[curNavIndex].subMenu" :key="i">
                  <view class="item-title">{{p[namekey]}}</view>
                  <view class="item-panel" v-if="p[childrenkey].length>0">
                    <view :class="c.checked?'label active':'label'" v-for="(c,j) of p[childrenkey]" :key="j" @tap="onTapLabel(i,j)">{{c[namekey]}}</view>
                  </view>
                </view>
              </block>
            </view>
            <view class="filter-content filter-content-B" v-if="filterList[curNavIndex].mode==='B'">
              <block v-if="filterList[curNavIndex].subMenu.length>0">
                <view class="filter-item" v-for="(p,i) of filterList[curNavIndex].subMenu" :key="i" @tap="onTapItem(i)">
                  <view class="item-title">
                    <text>{{p[namekey]}}</text>
                    <uni-icons type="checkmarkempty" size="20" :color="p.checked?'#0d6eb8':'#ddd'" />
                  </view>
                </view>
              </block>
            </view>

          </scroll-view>
        </view>
        <view class="popup-footer">
          <form @submit="resetOperate" class="operation-form-but" :report-submit='true'>
            <button type="default" class="operate-reset" form-type="submit">重置</button>
          </form>
          <form @submit="confirmOperate" class="operation-form-but" :report-submit='true'>
            <button type="default" class="operate-confirm" form-type="submit">确认</button>
          </form>
        </view>
      </view>
    </uni-popup>
  </view>

</template>

<script>
import { uniSearchBar, uniPopup, uniIcons } from "@dcloudio/uni-ui";

export default {
  name: "popupBottom",
  components: {
    uniSearchBar,
    uniPopup,
    uniIcons
  },
  props: {
    namekey: {
      type: String,
      default: "name"
    },
    childrenkey: {
      type: String,
      default: "children"
    },
    valkey: {
      type: String,
      default: "id"
    },
    filterList: {
      type: Array,
      default: [
        {
          title: "筛选",
          type: "radio",
          mode: "A",
          checked: false,
          subMenu: []
        }
      ]
    },
    showSearch: {
      type: Boolean,
      default: !0
    }
  },
  data() {
    return {
      curNavIndex: 0
    };
  },
  computed: {
    showPopups() {
      return this.$refs.popup.showPopup;
    }
  },
  watch: {
    filterList: {
      handler(e) {
        this.$emit("update:filterList", e);
      },
      deep: true
    },
    // 监听filterList变化并更新到父组件
    // filterList(e) {
    //   this.$emit("update:filterList", e);
    // }
  },
  created() {},

  mounted() {},

  onLoad() {},

  onShow() {},

  methods: {
    // 关闭popup
    closePopup() {
      this.$refs.popup.close();
    },

    // 打开popup
    openPopup() {
      this.$refs.popup.open();
    },

    //  筛选菜单切换
    changeFilterMenu(k) {
      this.curNavIndex = k;
      this.filterList.map((item, index) => {
        if (index == k) item.checked = !0;
        else item.checked = !1;
      });
      if (this.showPopups) this.closePopup();
      else this.openPopup();
    },

    // 取消搜索
    cancelSearch(e) {
      this.$emit("cancel", e);
    },

    // 搜索
    confirmSearch(e) {
      this.$emit("search", e);
    },

    // label点击事件
    onTapLabel(i, j) {
      let _filterObj = this.filterList[this.curNavIndex];
      const _type = _filterObj.type;
      switch (_type) {
        case "radio":
          _filterObj.subMenu.map((p, m) => {
            if (i == m) {
              p[this.childrenkey].map((q, n) => {
                if (j == n) q.checked = true;
                else q.checked = !1;
              });
            } else {
              p[this.childrenkey].map(o => {
                o.checked = !1;
              });
            }
          });
          break;
        case "checkbox":
          _filterObj.subMenu.map((p, m) => {
            if (i == m)
              p[this.childrenkey].map((q, n) => {
                if (j == n) q.checked = !q.checked;
              });
          });

          break;
      }
      this.filterList[this.curNavIndex] = _filterObj;
    },

    //item点击事件
    onTapItem(i) {
      let _filterObj = this.filterList[this.curNavIndex];
      const _type = _filterObj.type;
      switch (_type) {
        case "radio":
          _filterObj.subMenu.map((p, m) => {
            if (i == m) p.checked = !0;
            else p.checked = !1;
          });
          break;
        case "checkbox":
          _filterObj.subMenu.map((p, m) => {
            if (i == m) p.checked = !p.checked;
          });
          break;
      }
      this.filterList[this.curNavIndex] = _filterObj;
    },

    // 重置
    resetOperate(e) {
      let _filterObj = this.filterList[this.curNavIndex];
      _filterObj.subMenu.map(c => {
        c.checked = !1;
        c[this.childrenkey].map(g => {
          g.checked = !1;
        });
      });
      this.$emit("reset", e);
    },

    // 确认
    confirmOperate(e) {
      let _arr = [];
      let _filterObj = this.filterList[this.curNavIndex];
      const _mode = _filterObj.mode;
      const _type = _filterObj.type;
      if (_mode == "A") {
        switch (_type) {
          case "radio":
            _filterObj.subMenu.map(c => {
              c[this.childrenkey].map(g => {
                if (g.checked) {
                  _arr = [c[this.valkey], [g[this.valkey]]];
                }
              });
            });
            break;

          case "checkbox":
            _filterObj.subMenu.map(c => {
              let _cStr = null;
              let _gArr = c[this.childrenkey].filter(g => {
                if (g.checked) {
                  _cStr = c[this.valkey];
                  return g;
                }
              });
              let _ngArr = _gArr.map(i => {
                return i[this.valkey];
              });
              _cStr && _ngArr.length > 0 && _arr.push([_cStr, [..._ngArr]]);
            });
            break;
        }
      } else if (_mode == "B") {
        switch (_type) {
          case "radio":
            _filterObj.subMenu.map(c => {
              if (c.checked) {
                _arr = [c[this.valkey]];
              }
            });
            break;

          case "checkbox":
            let _cArr = _filterObj.subMenu.filter(c => {
              if (c.checked) {
                return c;
              }
            });
            let _ncArr = _cArr.map(i => {
              return i[this.valkey];
            });
            _arr = _ncArr;
            break;
        }
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.closePopup();
        }, 100);
      });
      this.$emit("confirm", _arr);
    }
  }
};
</script>

<style lang="scss">
.filter-search {
  display: flex;
  background-color: #fff;
  .filter-nav {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .menu-item {
      padding: 16upx 0 16upx 30upx;
      .title {
        margin-right: 6upx;
      }
    }
  }
  .filter-input {
    flex: 2;
    padding-right: 14upx;
  }
}

.popup-content {
  position: relative;
  border-bottom-left-radius: $uni-border-radius-base;
  border-bottom-right-radius: $uni-border-radius-base;
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
    display: flex;
    padding-top: 20upx;
    .operation-form-but {
      flex: 1;
      button::after {
        border-radius: 0;
      }
      .operate-reset {
        color: #333;
        border-radius: 0;
        background-color: #ddd;
      }
      .operate-confirm {
        border-radius: 0;
      }
    }
  }
}

.filter-scroll-area {
  min-height: 300upx;
  .filter-content {
    .filter-item {
      margin-bottom: 20upx;
      .item-title {
        padding: 16upx 30upx;
        background-color: #f8f8f8;
        font-weight: 700;
      }
      .item-panel {
        padding: 10upx 60upx;
        .label {
          display: inline-block;
          margin-right: 20upx;
          padding: 6upx 30upx;
          line-height: 38upx;
          border-radius: 26upx;
          text-align: center;
          background-color: #ddd;
          border: 1upx solid $uni-border-color;
        }
        .label.active {
          border: 1upx solid $uni-color-primary;
          background-color: #82c9ff;
          color: $uni-color-primary;
        }
      }
    }
  }
  .filter-content.filter-content-B {
    .item-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
