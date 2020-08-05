<template>
  <view class="pages address-list">
    <view class="address-content">
      <uni-swipe-action v-if="addressList.length>0">
        <uni-swipe-action-item :options="operate" v-for="(v,i) of addressList" :key="i" @click="onTapOperate($event,v.id,i)">
          <address-item :options="v" class="address-list" @click="switchAddress(v)" />
        </uni-swipe-action-item>

        <no-more :noMore="noMore" />
      </uni-swipe-action>

      <empty v-else desc="没有地址哦~" />
    </view>

    <view class="address-operate">
      <form @submit="navigateTo" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-address-creater" form-type="submit">添加地址</button>
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
import addressItem from "./address-item";
import util from "@/common/utils";

import {
  getCustomerAddressListAll,
  setAddressState,
  deleteAddress
} from "@/common/api";

import { mapMutations } from "vuex";

export default {
  name: "addressList",
  components: {
    empty,
    noMore,
    modal,
    uniIcons,
    addressItem,
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

      customerNumber: null,
      addressList: [],
      operate: [
        {
          text: "设为默认",
          style: {
            backgroundColor: "#4cd964"
          }
        },
        {
          text: "编辑",
          style: {
            backgroundColor: "#007aff"
          }
        }
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
        type: "default",
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
  onLoad(options) {
    const _customerNumber = options.customerNumber;
    if (_customerNumber) {
      this.customerNumber = _customerNumber;
    } else {
      this.customerNumber = null;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.customerNumber) {
      this.getCustomerAddressAll();
    }
  },

  methods: {
    ...mapMutations("address", ["SET_ADDRESS_OPTIONS"]),

    // 点击按钮组事件
    onTapOperate(e, id, _index) {
      const index = e.index;
      const title = e.content.text;
      this.operates.id = id;
      this.operates.index = _index;
      switch (index) {
        case 0:
          this.operates.type = "default";
          this.operates.title = "设为默认";
          this.operates.message = "确认要设此地址为默认地址吗？";
          break;
        case 1:
          this.operates.type = "edit";
          this.operates.title = "编辑";
          this.operates.message = "确认要编辑此地址吗？";
          break;
        case 2:
          this.operates.type = "delete";
          this.operates.title = "删除";
          this.operates.message = "确认要删除此地址吗？";
          break;
      }
      this.$refs.modal.openPopup();
    },

    // 模态确认操作
    onConfirmOperate() {
      const _type = this.operates.type;
      switch (_type) {
        case "default":
          this.setAddressStatus();
          break;
        case "edit":
          this.editAddress();
          break;
        case "delete":
          this.removeAddress();
          break;
      }
      this.$refs.modal.closePopup();
    },

    // 跳转到地址添加页面
    navigateTo(e) {
      util.saveFormid(e.detail.formId);
      const _customerNumber = this.customerNumber;
      let url = "";
      if (_customerNumber) {
        url = `/pages/subPackageA/address/addressAdd?customerNumber=${_customerNumber}`;
      } else {
        url = `/pages/subPackageA/address/addressAdd`;
      }
      util.navigateTo(url);
    },

    // 编辑地址
    editAddress() {
      const _customerNumber = this.customerNumber;
      const _id = this.operates.id;
      let url = "";
      if (_customerNumber) {
        url = `/pages/subPackageA/address/addressAdd?customerNumber=${_customerNumber}&id=${_id}`;
      } else {
        url = `/pages/subPackageA/address/addressAdd?id=${_id}`;
      }
      util.navigateTo(url);
    },

    // 切换收货地址
    switchAddress(e) {
      const _customerNumber = this.customerNumber;

      if (!_customerNumber) return;

      this.SET_ADDRESS_OPTIONS(e);
      util.navigateBack();
    },

    // 设为默认
    setAddressStatus() {
      const _index = this.operates.index;
      const _addressList = this.addressList;
      setAddressState(this.operates.id).then(res => {
        util.showToastSuccess("操作成功!");
        _addressList.map((item, index) => {
          if (index == _index) item.acquiescent = "yes";
          else item.acquiescent = "no";
        });
      });
    },

    // 删除地址
    removeAddress() {
      const _index = this.operates.index;
      const _addressList = this.addressList;
      deleteAddress(this.operates.id).then(res => {
        util.showToastSuccess("删除成功!");
        _addressList.splice(_index, 1);
      });
    },

    // 获取当前客户地址
    getCustomerAddressAll() {
      getCustomerAddressListAll(this.customerNumber).then(res => {
        const _list = res.list;
        if (_list.length > 0) {
          this.addressList = _list;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.address-list {
  .address-content {
    padding-bottom: 110upx;
    margin-bottom: 20upx;
    .address-list {
      flex: 1;
      width: 100%;
    }
  }
  .address-operate {
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
