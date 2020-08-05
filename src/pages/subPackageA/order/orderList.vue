<template>
  <view class="pages order">
    <view class="order-type">
      <van-tabs :active="curStatus" color="#0d6eb8" @change="switchOrderStatus" swipe-threshold="4">
        <van-tab :title="v.title" v-for="(v,i) of orderHeader" :key="i"></van-tab>
      </van-tabs>
    </view>
    <view class="order-content">
      <scroll-view class="order-scroll-area" scroll-y="true" bindscrolltolower="onReachBottom" v-if="orderList.length>0">
        <order-item :list.sync="orderList" />
        <no-more :noMore="noMore" />
      </scroll-view>

      <empty v-else desc="没有此状态下的订单哦~" />

    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import empty from "@/components/empty";
import noMore from "@/components/no-more";
import orderItem from "./order-item";
import util from "@/common/utils";
import { getSalesOrderList } from "@/common/api";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "order",
  components: {
    uniIcons,
    empty,
    noMore,
    orderItem
  },
  data() {
    return {
      orderHeader: [
        { title: "全部" },
        { title: "待出库" },
        { title: "配送中" },
        { title: "已完成" }
      ],
      curStatus: 0,
      curPage: 1,
      pageSize: 20,
      allPage: 0,
      orderType: null,
      orderList: [],
      noMore: !1
    };
  },
  computed: {},
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();

    const status = options.status;
    switch (status) {
      case "1":
        this.curStatus = 1;
        this.orderType = "waitOut";
        break;
      case "2":
        this.curStatus = 2;
        this.orderType = "dispatching";
        break;
      case "3":
        this.curStatus = 3;
        this.orderType = "success";
        break;
      default:
        this.curStatus = 0;
        this.orderType = null;
    }

    this.getOrderData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // initData
    initData() {
      this.curPage = 1;
      this.allPage = 0;
      this.orderList = [];
      this.noMore = !1;
    },

    switchOrderStatus(e) {
      const _type = e.detail.index;
      switch (_type) {
        case 1:
          this.curStatus = 1;
          this.orderType = "waitOut";
          break;
        case 2:
          this.curStatus = 2;
          this.orderType = "dispatching";
          break;
        case 3:
          this.curStatus = 3;
          this.orderType = "success";
          break;
        default:
          this.curStatus = 0;
          this.orderType = null;
      }
      this.initData();
      this.getOrderData();
    },

    /**
     * 获取订单列表
     */
    getOrderData() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          orderState: this.orderType
        }
      };
      getSalesOrderList(data).then(res => {
        const data = res.page;
        let _list = data.list;
        let _orderList = this.orderList;

        this.allPage = data.totalPage;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;
          this.orderList = [..._orderList, ..._list];
        } else {
          this.noMore = !0;
        }
      });
    },

    /**
     * 查看订单详情
     */
    goDetail(id) {
      util.navigateTo(`/pages/subPackageA/order/orderDetail?id=${id}`);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.initData();
    this.getOrderData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) this.getOrderData();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.order {
  position: relative;
  height: 100%;
  .order-type {
    position: fixed;
    height: 88upx;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 999;
    background-color: #fff;
  }
  .order-content {
    box-sizing: border-box;
    padding-top: 88upx;
    .order-scroll-area {
      height: 100%;
    }
  }
}
</style>
