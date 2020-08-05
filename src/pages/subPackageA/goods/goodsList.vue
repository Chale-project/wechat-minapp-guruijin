<template>
  <view class="pages goods-list">
    <van-sticky>
      <view class="goods-filter-search">
        <filter-search ref="filterSearch" :filterList.sync="filterList" childrenkey="twoCategoryList" @search="onSearch" @cancel="onCancel" @confirm="onConfirmFilterSearch" />
      </view>
    </van-sticky>

    <view class="goods-statistics">
      <view class="statistics-title">
        <image src="/static/images/icon_statistics.png" mode="widthFix" />
        <text>实时统计</text>
      </view>
      <view class="statistics-panel">
        <view class="panel-deal">
          <view class="panel-value ellipsis">0位</view>
          <view class="panel-title ellipsis">今日成交客户</view>
        </view>
        <view class="panel-sales">
          <view class="panel-value ellipsis">0件</view>
          <view class="panel-title ellipsis">今日销量</view>
        </view>
      </view>
    </view>

    <view class="goods-status-sort">
      <view class="goods-status">
        <van-tabs :active="curStatus" color="#0d6eb8" @change="switchGoodsStatus">
          <van-tab :title="v.title+'('+v.number+')'" v-for="(v,i) of goodsStatusList" :key="i"></van-tab>
        </van-tabs>
      </view>
      <view class="goods-sort">
        <view :class="v.checked?'sort-item active':'sort-item'" v-for="(v,i) of goodsSortList" :key="i" @tap="changeGoodsSort(i)">
          <view class="text">{{v.title}}</view>
          <view class="icon" v-if="v.sortIcon">
            <view class="icon-up">
              <uni-icons type="arrowup" size="14" :color="v.value=='desc'?'#000':'#ddd'" />
            </view>
            <view class="icon-down">
              <uni-icons type="arrowdown" size="14" :color="v.value=='asc'?'#000':'#ddd'" />
            </view>
          </view>
        </view>
      </view>

    </view>

    <view class="goods-content" v-if="goodsList.length>0">
      <view class="goods-list" v-for="(v,i) of goodsList" :key="i">
        <view class="goods-thumb">
          <image :src="v.coverImage?v.coverImage:defaultImage" @error="errImg(i)" />
        </view>
        <view class="goods-others">
          <view class="goods-title ellipsis">{{v.goodsTitle}}</view>
          <view class="goods-spec ellipsis">步道砖 红色 透水</view>
          <view class="goods-volume ellipsis">200*160*60</view>
          <view class="goods-sales-stock ellipsis"><text class="sales">总销量：{{v.salesNum}}件</text><text class="stock">库存：{{v.stockNum}}件</text></view>
          <view class="goods-time ellipsis">{{v.addDataTime}}</view>
        </view>
        <view class="list-arrow">
          <uni-icons type="arrowright" size="20" color="#ddd" />
        </view>
      </view>
      <no-more :noMore="noMore" />
    </view>

    <empty v-else desc="没有此条件下的商品哦~" />

    <view class="goods-footer">
      <view class="footer-nav-item" v-for="(v,i) of footerNavList" :key="i" @tap="onTapFooterNav(v.path)">
        <view class="nav-icon">
          <image :src="v.icon" mode="widthFix" />
        </view>
        <view class="nav-name">
          <text>{{v.title}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import filterSearch from "@/components/filter-search";
import empty from "@/components/empty";
import noMore from "@/components/no-more";

import util from "@/common/utils";

import { getCategoryList, getGoodsList } from "@/common/api";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "goodsList",
  components: {
    uniIcons,
    filterSearch,
    empty,
    noMore
  },
  data() {
    return {
      //查询
      queryTrem: {
        categoryId: null,
        status: "put",
        addDateTime: null,
        sales: null,
        stock: null,
        keywords: null
      },
      //分页
      curPage: 1,
      pageSize: 20,
      allPage: 0,
      noMore: !1,

      //
      goodsList: [],

      // 筛选
      filterList: [
        {
          title: "筛选",
          type: "radio",
          mode: "A",
          checked: false,
          subMenu: []
        }
      ],

      curStatus: 0,
      goodsStatusList: [
        { title: "出售中", status: "put", number: 0 },
        { title: "已下架", status: "out", number: 0 }
      ],
      goodsSortList: [
        {
          title: "添加时间",
          alias: "time",
          value: null,
          sortIcon: true,
          checked: false
        },
        {
          title: "总销量",
          alias: "sales",
          value: null,
          sortIcon: false,
          checked: false
        },
        {
          title: "库存",
          alias: "stock",
          value: null,
          sortIcon: false,
          checked: false
        }
      ],
      footerNavList: [
        {
          title: "添加商品",
          icon: "/static/images/icon_goods_add.png",
          path: "/pages/subPackageA/goods/goodsAdd"
        },
        {
          title: "批量管理",
          icon: "/static/images/icon_goods_batch.png",
          path: "/pages/subPackageA/goodsBatch/batchManage"
        },
        {
          title: "分类管理",
          icon: "/static/images/icon_goods_category.png",
          path: "/pages/subPackageA/goodsCategory/categoryList"
        }
      ],
      defaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {},
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();
    this.getGoodsCategoryList();
    this.getGoodsList();
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
      this.goodsList = [];
      this.noMore = !1;
    },

    // 搜索关键词
    onSearch(e) {
      const _keywords = e.value;
      if (!_keywords) {
        util.showToastError("请输入搜索关键词！");
        return;
      }
      this.queryTrem.keywords = e.value;
      this.initData();
      this.getGoodsList();
    },

    // 取消搜索
    onCancel() {
      this.queryTrem.keywords = null;
    },

    // 确认查询
    onConfirmFilterSearch(e) {
      if (e.length < 1) return;
      this.queryTrem.categoryId = e[1].join(",");
      this.initData();
      this.getGoodsList();
    },

    // 切换出售中 已下架
    switchGoodsStatus(e) {
      const _index = e.detail.index;
      this.curStatus = _index;
      this.queryTrem.status = this.goodsStatusList[_index].status;
      this.initData();
      this.getGoodsList();
    },

    // 切换排序
    changeGoodsSort(i) {
      let _list = this.goodsSortList;
      _list.map((item, index) => {
        if (i == index) {
          item.checked = !0;
          if (item.sortIcon && item.value == "desc") {
            item.value = "asc";
          } else if (item.sortIcon && item.value == "asc") {
            item.value = "desc";
          } else {
            item.value = "desc";
          }
        } else {
          item.checked = !1;
          item.value = null;
        }
      });
      this.sortFilterGoods();
    },

    // 排序筛选
    sortFilterGoods() {
      const _sortArr = this.goodsSortList.filter(e => {
        if (e.checked) return e;
      });
      const _sortObj = _sortArr[0];
      switch (_sortObj.alias) {
        case "time":
          this.queryTrem.addDateTime = _sortObj.value;
          this.queryTrem.sales = null;
          this.queryTrem.stock = null;
          break;
        case "time":
          this.queryTrem.addDateTime = null;
          this.queryTrem.sales = _sortObj.value;
          this.queryTrem.stock = null;
          break;
        case "time":
          this.queryTrem.addDateTime = null;
          this.queryTrem.sales = null;
          this.queryTrem.stock = _sortObj.value;
          break;
      }
      this.initData();
      this.getGoodsList();
    },

    // 底部导航事件
    onTapFooterNav(path) {
      util.navigateTo(path);
    },

    // 获取商品列表
    getGoodsList() {
      const _data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: this.queryTrem
      };
      getGoodsList(_data).then(res => {
        const data = res.page;
        this.allPage = data.totalPage;

        let list = this.goodsList;
        const _list = data.list;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;

          let _newList = [...list, ..._list];
          this.goodsList = _newList;
        }
      });
    },

    // 获取商品分类
    getGoodsCategoryList() {
      getCategoryList().then(res => {
        const _list = res.list;
        if (_list.length > 0) {
          _list.map(item => {
            item.checked = !1;
            item.twoCategoryList.map(ele => {
              ele.checked = !1;
            });
          });
          this.filterList[0].subMenu = _list;
        }
      });
    },

    //处理no found 图片
    errImg(i) {
      this.goodsList[i].coverImage = this.defaultImage;
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
    if (this.curPage <= this.allPage) this.getGoodsList();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.goods-list {
  .goods-filter-search {
    margin-bottom: 20upx;
  }
  .goods-statistics {
    .statistics-title {
      padding: 20upx 30upx;
      image {
        width: 40upx;
        margin-right: 10upx;
        vertical-align: top;
      }
      text {
        font-size: 30upx;
      }
    }
    .statistics-panel {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 20upx;
      text-align: center;
      .panel-deal,
      .panel-sales {
        padding: 0 10upx;
        flex: 1;
        .panel-title {
          padding: 10upx 0;
        }
        .panel-value {
          padding: 10upx 0;
        }
      }
    }
  }
  .goods-status-sort {
    .goods-status {
      margin-bottom: 20upx;
    }
    .goods-sort {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 30upx;
      border-top: 2upx solid $uni-border-color;
      border-bottom: 2upx solid $uni-border-color;
      .sort-item {
        padding: 10upx;
        display: flex;
        align-items: center;
        .icon {
          margin-left: 4upx;
          .icon-up,
          .icon-down {
            height: 28upx;
            overflow: hidden;
          }
          .icon-up {
            line-height: 32upx;
          }
          .icon-down {
            line-height: 22upx;
          }
        }
      }
      .sort-item.active {
        .text {
          color: $uni-color-primary;
        }
      }
    }
  }
  .goods-content {
    padding: 10upx 0 100upx;
    .goods-list {
      position: relative;
      padding: 20upx 18upx 20upx 30upx;
      display: flex;
      align-items: center;

      .goods-thumb {
        position: relative;
        width: 160upx;
        height: 160upx;
        margin-right: 20upx;
        overflow: hidden;
        border-radius: $uni-border-radius-base;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .goods-others {
        width: calc(100% - 220upx);
        .goods-title,
        .goods-spec,
        .goods-volume,
        .goods-sales-stock,
        .goods-time {
          margin-bottom: 4upx;
          font-size: 24upx;
          color: #999;
          .stock {
            padding-left: 10upx;
          }
        }
        .goods-title {
          font-size: 28upx;
          color: #333;
        }
        .goods-time {
          margin-bottom: 0;
        }
      }
      .list-arrow {
        width: 40upx;
        text-align: right;
      }
    }
    .order-goods-list::after {
      @include backgroundLine(30upx, 0, 2upx);
    }
    .order-goods-list:last-child::after {
      @include backgroundLine(0, 0, 0);
    }
  }

  .goods-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    box-shadow: 0 2upx 2upx rgba(0, 0, 0, 0.7);
    background-color: #fff;
    .footer-nav-item {
      flex: 1;
      padding: 10upx;
      text-align: center;
      .nav-icon {
        margin-bottom: 8upx;
        image {
          width: 40upx;
        }
      }
      .nav-name {
        font-size: 24upx;
      }
    }
  }
}
</style>
