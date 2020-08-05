<template>
  <view class="pages home">
    <view class="home-top">
      <view class="user-data-face">
        <view class="user-info">
          <view class="user-info-left">
            <view class="user-info-avatar" @tap="toProfile">
              <image :src="userInfo.headPic?userInfo.headPic:'/static/images/logo.png'" mode="widthFix" />
            </view>
            <view class="user-info-others" @tap="toProfile" v-if="isLogin">
              <view class="user-nickname ellipsis">{{userInfo.nickname||userInfo.name||userInfo.phoneNumber}}</view>
              <view class="user-number ellipsis" v-if="userInfo.clerkNumber">工号：{{userInfo.clerkNumber}}</view>
            </view>
            <view class="user-not-login" v-else @tap="toLogin">
              <text>登陆/注册</text>
              <uni-icons type="arrowright" size="16" />
            </view>
          </view>
          <view class="user-info-right" @tap="onTapScan">
            <view class="scan-icon">
              <uni-icons type="scan" size="34" />
            </view>
            <view class="scan-text">扫一扫</view>
          </view>

        </view>
        <view class="data-face">
          <uni-grid :column="4" :showBorder="false">
            <uni-grid-item class="data-item">
              <form @submit="navigateTo" :report-submit='true'>
                <button class="but-block" form-type="submit">
                  <view class="data-value  ellipsis"><text>{{statisticsInfo.waitOutOrderNum||0}}</text>笔</view>
                  <view class="data-desc ellipsis">待出库订单</view>
                </button>
              </form>
            </uni-grid-item>
            <uni-grid-item class="data-item">
              <form @submit="navigateTo" :report-submit='true'>
                <button class="but-block" form-type="submit">
                  <view class="data-value  ellipsis"><text>{{statisticsInfo.inboundNum||0}}</text>件</view>
                  <view class="data-desc ellipsis">今日入库</view>
                </button>
              </form>
            </uni-grid-item>
            <uni-grid-item class="data-item">
              <form @submit="navigateTo" :report-submit='true'>
                <button class="but-block" form-type="submit">
                  <view class="data-value  ellipsis"><text>{{statisticsInfo.outboundNum||0}}</text>件</view>
                  <view class="data-desc ellipsis">今日出库</view>
                </button>
              </form>
            </uni-grid-item>
            <uni-grid-item class="data-item">
              <form @submit="navigateTo" :report-submit='true'>
                <button class="but-block" form-type="submit">
                  <view class="data-value  ellipsis"><text>{{statisticsInfo.stock||0}}</text>件</view>
                  <view class="data-desc ellipsis">目前库房存量</view>
                </button>
              </form>
            </uni-grid-item>
          </uni-grid>
        </view>
      </view>
      <!-- <view class="system-notice">
        <uni-notice-bar show-icon="true" scrollable="true" single="true" speed="80" background-color="#ffdec9" color="#f04a4a" text="[单行] 这是 NoticeBar 通告栏，这是 NoticeBar 通告栏，这是 NoticeBar 通告栏"></uni-notice-bar>
      </view> -->
    </view>
    <view class="home-content">
      <uni-grid :column="4" :showBorder="false">
        <uni-grid-item class="nav-item" v-for="(v,i) of navList" :key="i">
          <form @submit="navigateTo($event,v.menuPath)" :report-submit='true'>
            <button class="but-block" form-type="submit">
              <view class="nav-icon">
                <image :src="v.menuIcon" mode="widthFix" />
              </view>
              <view class="nav-name ellipsis">{{v.menuName}}</view>
            </button>
          </form>
        </uni-grid-item>

      </uni-grid>
    </view>

    <!-- 模态操作 -->
    <modal ref="modal" :title="modalInfo.title" :message="modalInfo.message" cancelButText="跳过" confirmButText="绑定" @confirm="onConfirmOperate" />

  </view>
</template>

<script>
import { uniIcons, uniGrid, uniGridItem, uniNoticeBar } from "@dcloudio/uni-ui";
import modal from "@/components/modal";

import util from "@/common/utils";

import { getHomeStatisticsView } from "@/common/api";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "home",
  components: {
    uniIcons,
    uniGrid,
    uniGridItem,
    uniNoticeBar,
    modal
  },
  data() {
    return {
      statisticsInfo: {},
      modalInfo: {
        title: "绑定账号",
        message: "您暂未绑定账号或手机号，绑定后可享用更多功能。"
      }
      // navList: [
      //   {
      //     name: "公司介绍",
      //     icon: "/static/images/icon_home_company.png",
      //     path: "/pages/subPackageC/about/about"
      //   },
      //   {
      //     name: "最新动态",
      //     icon: "/static/images/icon_home_trends.png",
      //     path: "/pages/subPackageC/trends/trends"
      //   },
      //   {
      //     name: "产品介绍",
      //     icon: "/static/images/icon_home_production.png",
      //     path: "/pages/subPackageC/production/production"
      //   },
      //   {
      //     name: "统计分析",
      //     icon: "/static/images/icon_home_statistics.png",
      //     path: "/pages/subPackageC/statistics/"
      //   },
      //   {
      //     name: "订单管理",
      //     icon: "/static/images/icon_home_order.png",
      //     path: "/pages/subPackageA/order/orderList"
      //   },
      //   {
      //     name: "入库记录",
      //     icon: "/static/images/icon_home_storeIr.png",
      //     path: "/pages/subPackageB/stockIn/goodsInRecord"
      //   },
      //   {
      //     name: "出库记录",
      //     icon: "/static/images/icon_home_storeOr.png",
      //     path: "/pages/subPackageB/stockOut/goodsOutRecord"
      //   },
      //   {
      //     name: "商品管理",
      //     icon: "/static/images/icon_home_goods.png",
      //     path: "/pages/subPackageA/goods/goodsList"
      //   },
      //   {
      //     name: "打印标签",
      //     icon: "/static/images/icon_home_print.png",
      //     path: "/pages/subPackageB/print/print"
      //   },
      //   {
      //     name: "订单录入",
      //     icon: "/static/images/icon_home_sale.png",
      //     path: "/pages/subPackageA/order/orderCreate"
      //   },
      //   {
      //     name: "配送员管理",
      //     icon: "/static/images/icon_home_delivery.png",
      //     path: "/pages/subPackageA/delivery/deliveryList"
      //   },
      //   {
      //     name: "账号管理",
      //     icon: "/static/images/icon_home_account.png",
      //     path: "/pages/subPackageD/account/accountList"
      //   },
      //   {
      //     name: "采购报批",
      //     icon: "/static/images/icon_home_purchase.png",
      //     path: "/pages/subPackageB/purchaseApproval/"
      //   },
      //   {
      //     name: "生产报批",
      //     icon: "/static/images/icon_home_product.png",
      //     path: "/pages/subPackageB/productApproval/"
      //   },
      //   {
      //     name: "新闻管理",
      //     icon: "/static/images/icon_home_news.png",
      //     path: "/pages/subPackageC/news/"
      //   },
      //   {
      //     name: "客户管理",
      //     icon: "/static/images/icon_home_customer.png",
      //     path: "/pages/subPackageA/customer/customerList"
      //   },
      //   {
      //     name: "系统设置",
      //     icon: "/static/images/icon_home_system.png",
      //     path: "/pages/subPackageD/system/"
      //   }
      // ]
    };
  },
  computed: {
    ...mapGetters(["isLogin", "userInfo", "navList"])
  },
  watch: {
    isLogin() {
      this.isLogin && this.$refs.modal.closePopup();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!this.isLogin) this.$refs.modal.openPopup();
    else this.getHomeStatisticsData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // 去个人中心 
    toProfile(){
      util.navigateTo("/pages/subPackageD/profile/profile");
    },

    // 扫码入库
    onTapScan() {
      uni.scanCode({
        success: res => {
          let url = `/pages/subPackageB/stockIn/goodsIn?id=${res.result}`;
          util.navigateTo(url);
        }
      });
    },

    // 栏目导航链接跳转
    navigateTo(e, p) {
      util.saveFormid(e.detail.formId);
      util.navigateTo(p);
    },

    // 去登录
    toLogin() {
      util.navigateTo("/pages/login/login");
    },

    // 去绑定
    onConfirmOperate() {
      util.navigateTo("/pages/login/login");
    },

    // 获取商品统计数据展示
    getHomeStatisticsData() {
      getHomeStatisticsView().then(res => {
        this.statisticsInfo = res.result;
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
};
</script>

<style lang="scss">
.home {
  &-top {
    position: relative;
    height: 300upx;
    margin-bottom: 60upx;
    padding: 0 $uni-spacing-row-lg;
    background-color: $uni-color-primary;
    .user-data-face {
      position: absolute;
      height: 252upx;
      left: 30upx;
      right: 30upx;
      top: 40upx;
      padding: 24upx 30upx;
      background-color: $uni-bg-color;
      border-radius: $uni-border-radius-base;
      box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.4);
      z-index: 99;
      .user-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30upx;
        .user-info-left {
          width: calc(100% - 100upx);
          display: flex;
          align-items: center;
          overflow: hidden;
          .user-info-avatar {
            width: 100upx;
            height: 100upx;
            margin-right: 20upx;
            overflow: hidden;
            border-radius: $uni-border-radius-base;
            background-color: $uni-bg-color-grey;
            image {
              width: 100%;
            }
          }
          .user-info-others,
          .user-not-login {
            width: calc(100% - 120upx);
            overflow: hidden;
            .user-nickname {
              font-size: $uni-font-size-lg;
              margin-bottom: $uni-spacing-col-sm;
              font-weight: 700;
            }
            .user-number {
              color: $uni-text-color-grey;
            }
            text {
              font-size: $uni-font-size-lg;
            }
          }
        }
        .user-info-right {
          width: 100upx;
          height: 100upx;
          text-align: center;
          overflow: hidden;
          .scan-icon {
            height: 68upx;
            line-height: 68upx;
            overflow: hidden;
          }
          .scan-text {
            font-size: $uni-font-size-sm;
          }
        }
      }
      .data-face {
        .data-item {
          .but-block {
            padding: 10upx 0;
            .data-value {
              padding: 20upx 0 10upx;
              text-align: center;
              font-size: 30rpx;
              font-weight: 700;
            }
            .data-desc {
              padding: 10upx 0 20upx;
              text-align: center;
              font-size: $uni-font-size-sm;
              color: $uni-text-color-grey;
            }
          }
        }
      }
    }
    .system-notice {
      position: relative;

      padding: 180upx $uni-spacing-row-lg 0;
      margin: -180upx -30upx 20upx;
      background-color: $uni-bg-color-grey;
      // background-color: red;
      z-index: 9;
    }
  }
  &-content {
    position: relative;
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    .nav-item {
      .nav-icon {
        text-align: center;
        image {
          width: 80upx;
          height: 80upx;
          border-radius: $uni-border-radius-base;
          overflow: hidden;
        }
      }
      .nav-name {
        padding: 20upx 0;
        text-align: center;
        font-weight: 700;
      }
    }
  }
}
</style>
