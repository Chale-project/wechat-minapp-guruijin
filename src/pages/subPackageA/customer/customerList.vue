<template>
  <view class="pages customer-list">
    <view class="customer-content">
      <uni-swipe-action v-if="customerList.length>0">
        <uni-swipe-action-item :options="operate" v-for="(v,i) of customerList" :key="i" @click="onTapOperate($event,v.id,i)">
          <customer-item :options="v" class="customer-list" @click="goToCustomer(v.id)" />
        </uni-swipe-action-item>

        <no-more :noMore="noMore" />
      </uni-swipe-action>

      <empty v-else desc="没有客户哦~" />
    </view>

    <view class="customer-operate">
      <form @submit="navigateTo" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-customer-creater" form-type="submit">添加客户</button>
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
import customerItem from "./customer-item";
import util from "@/common/utils";
import {
  getCustomerList,
  setCustomerState,
  deleteCustomer
} from "@/common/api";

export default {
  name: "customerList",
  components: {
    empty,
    noMore,
    modal,
    uniIcons,
    customerItem,
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

      customerList: [],
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
        // {
        //   text: "删除",
        //   style: {
        //     backgroundColor: "#ff3a31"
        //   }
        // }
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
    this.getCustomerList();
  },

  methods: {
    // initData
    initData() {
      this.curPage = 1;
      this.customerList = [];
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
          this.operates.message = "确认要禁用此客户吗？";
          break;
        case 1:
          this.operates.type = "enabled";
          this.operates.title = "启用";
          this.operates.message = "确认要启用此客户吗？";
          break;
        case 2:
          this.operates.type = "delete";
          this.operates.title = "删除";
          this.operates.message = "确认要删除此客户吗？";
          break;
      }
      this.$refs.modal.openPopup();
    },

    // 模态确认操作
    onConfirmOperate() {
      const _type = this.operates.type;
      switch (_type) {
        case "disabled":
          this.setCustomerStatus();
          break;
        case "enabled":
          this.setCustomerStatus();
          break;
        case "delete":
          this.removeCustomer();
          break;
      }
      this.$refs.modal.closePopup();
    },

    // 跳转到客户添加页面
    navigateTo(e) {
      util.saveFormid(e.detail.formId);
      util.navigateTo("/pages/subPackageA/customer/customerAdd");
    },

    // 跳转客户编辑
    goToCustomer(id) {
      util.navigateTo(`/pages/subPackageA/customer/customerAdd?id=${id}`);
    },

    // 禁用or启用
    setCustomerStatus() {
      const _index = this.operates.index;
      const _customerList = this.customerList;
      const _data = {
        id: this.operates.id,
        status: this.operates.type
      };
      setCustomerState(_data).then(res => {
        util.showToastSuccess("操作成功!");
        _customerList[_index].state = this.operates.type;
      });
    },

    // 删除客户
    removeCustomer() {
      const _index = this.operates.index;
      const _customerList = this.customerList;
      deleteCustomer(this.operates.id).then(res => {
        util.showToastSuccess("删除成功!");
        _customerList.splice(_index, 1);
      });
    },

    // 获取客户列表
    getCustomerList() {
      const _data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          customerType: "client"
        }
      };
      getCustomerList(_data).then(res => {
        const data = res.page;
        this.allPage = data.totalPage;

        let list = this.customerList;
        const _list = data.list;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;

          let _newList = [...list, ..._list];
          this.customerList = _newList;
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
    if (this.curPage <= this.allPage) this.getCustomerList();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.customer-list {
  .customer-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
    .customer-list {
      width: 100%;
      flex: 1;
    }
  }
  .customer-operate {
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
