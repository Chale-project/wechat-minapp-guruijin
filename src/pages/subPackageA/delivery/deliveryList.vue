<template>
  <view class="pages delivery-list">
    <view class="delivery-content">
      <uni-swipe-action v-if="deliveryList.length>0">
        <uni-swipe-action-item :options="operate" v-for="(v,i) of deliveryList" :key="i" @click="onTapOperate($event,v.id,i)">
          <delivery-item :options="v" class="delivery-list" @click="goToDelivery(v.id)" />
        </uni-swipe-action-item>

        <no-more :noMore="noMore" />
      </uni-swipe-action>

      <empty v-else desc="没有配送员哦~" />
    </view>

    <view class="delivery-operate">
      <form @submit="navigateTo" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-delivery-creater" form-type="submit">添加配送员</button>
      </form>
    </view>

    <!-- 模态操作 -->
    <modal ref="modal" :title="operates.title" :message="operates.message" @confirm="onConfirmOperate" />

  </view>
</template>

<script>
import {
  uniIcons,
  uniBadge,
  uniSwipeAction,
  uniSwipeActionItem
} from "@dcloudio/uni-ui";
import empty from "@/components/empty";
import noMore from "@/components/no-more";
import modal from "@/components/modal";
import deliveryItem from "./delivery-item";
import util from "@/common/utils";
import {
  getDeliveryList,
  setDeliveryState,
  deleteDelivery
} from "@/common/api";

export default {
  name: "deliveryList",
  components: {
    empty,
    noMore,
    modal,
    uniIcons,
    deliveryItem,
    uniBadge,
    uniSwipeAction,
    uniSwipeActionItem
  },
  data() {
    return {
      //分页
      curPage: 1,
      pageSize: 20,
      allPage: 0,
      noMore: !1,

      deliveryList: [],
      operate: [
        {
          text: "禁用"
        },
        {
          text: "启用",
          style: {
            backgroundColor: "#007aff"
          }
        },
        {
          text: "删除",
          style: {
            backgroundColor: "#ff3a31"
          }
        }
      ],

      operates: {
        id: null,
        index: 0,
        type: "enabled",
        title: "提示",
        message: ""
      }
    };
  },
  computed: {},
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initData();
    this.getDeliveryList();
  },

  methods: {
    // initData
    initData() {
      this.curPage = 1;
      this.deliveryList = [];
    },

    // 点击按钮组事件
    onTapOperate(e, id, _index) {
      const index = e.index;
      const title = e.content.text;
      this.operates.id = id;
      this.operates.index = _index;
      switch (index) {
        case 0:
          this.operates.type = "disabled";
          this.operates.title = "禁用";
          this.operates.message = "确认要禁用此配送员？";
          break;
        case 1:
          this.operates.type = "enabled";
          this.operates.title = "启用";
          this.operates.message = "确认要启用此配送员？";
          break;
        case 2:
          this.operates.type = "delete";
          this.operates.title = "删除";
          this.operates.message = "确认要删除此配送员？";
          break;
      }
      this.$refs.modal.openPopup();
    },

    // 模态确认操作
    onConfirmOperate() {
      const _type = this.operates.type;
      switch (_type) {
        case "disabled":
          this.setDeliveryStatus();
          break;
        case "enabled":
          this.setDeliveryStatus();
          break;
        case "delete":
          this.removeDelivery();
          break;
      }
      this.$refs.modal.closePopup();
    },

    // 跳转到配送员添加页面
    navigateTo(e) {
      util.saveFormid(e.detail.formId);
      util.navigateTo("/pages/subPackageA/delivery/deliveryAdd");
    },

    // 跳转配送员编辑
    goToDelivery(id) {
      util.navigateTo(`/pages/subPackageA/delivery/deliveryAdd?id=${id}`);
    },

    // 禁用or启用
    setDeliveryStatus() {
      const _index = this.operates.index;
      const _deliveryList = this.deliveryList;
      const _data = {
        id: this.operates.id,
        status: this.operates.type
      };
      setDeliveryState(_data).then(res => {
        util.showToastSuccess("操作成功!");
        _deliveryList[_index].state = this.operates.type;
      });
    },

    // 删除配送员
    removeDelivery() {
      const _index = this.operates.index;
      const _deliveryList = this.deliveryList;
      deleteDelivery(this.operates.id).then(res => {
        util.showToastSuccess("删除成功!");
        _deliveryList.splice(_index, 1);
      });
    },

    // 获取配送员列表
    getDeliveryList() {
      const _data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          customerType: "deliveryman"
        }
      };
      getDeliveryList(_data).then(res => {
        const data = res.page;
        this.allPage = data.totalPage;

        let list = this.deliveryList;
        const _list = data.list;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;

          let _newList = [...list, ..._list];
          this.deliveryList = _newList;
        }
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) this.getDeliveryList();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.delivery-list {
  .delivery-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
    .delivery-list {
      width: 100%;
      flex: 1;
    }
  }
  .delivery-operate {
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
