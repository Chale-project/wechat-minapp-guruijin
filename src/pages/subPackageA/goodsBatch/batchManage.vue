<template>
  <view class="pages batch-manage">
    <van-sticky>
      <view class="goods-filter-search">
        <filter-search ref="filterSearch" :filterList.sync="filterList" childrenkey="twoCategoryList" @search="onSearch" @cancel="onCancel" @confirm="onConfirmFilterSearch" />
      </view>
    </van-sticky>

    <view class="goods-status-sort">
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

      <goods-mode-a :list.sync="goodsList" v-if="referer=='goods'" />

      <goods-mode-b :list.sync="goodsList" v-else-if="referer=='order'" @error="errImg" @input="onInputGoodsNum" @minus="onMinusGoodsNum" @plus="onPlusGoodsNum" />

      <no-more :noMore="noMore" />
    </view>

    <empty v-else desc="没有此条件下的商品哦~" />

    <view class="goods-footer">
      <block v-if="referer=='goods'">
        <view class="footer-nav-item" v-for="(v,i) of footerNavList" :key="i" @tap="onTapFooterNav(v.path)">
          <view class="nav-icon">
            <image :src="v.icon" mode="widthFix" />
          </view>
          <view class="nav-name">
            <text>{{v.title}}</text>
          </view>
        </view>
      </block>

      <block v-else-if="referer=='order'">
        <form @submit="onSureChoice" class="operation-form-but" :report-submit='true'>
          <button type="default" class="operate-sure-chioce" form-type="submit">确认</button>
        </form>
      </block>

    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import filterSearch from "@/components/filter-search";
import empty from "@/components/empty";
import noMore from "@/components/no-more";
import goodsModeA from "./goods-mode-a";
import goodsModeB from "./goods-mode-b";

import util from "@/common/utils";

import { getCategoryList, getGoodsList, getGoodsListOrder } from "@/common/api";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "batchManage",
  components: {
    uniIcons,
    filterSearch,
    empty,
    noMore,
    goodsModeA,
    goodsModeB
  },
  data() {
    return {
      // 来源
      referer: "goods",

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
          title: "所有商品",
          type: "radio",
          mode: "A",
          checked: false,
          subMenu: []
        }
      ],

      curStatus: 0,

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
          title: "全选",
          icon: "/static/images/icon_order_wait.png",
          path: "/pages/subPackageA/goods/goodsAdd"
        },
        {
          title: "下架",
          icon: "/static/images/icon_order_wait.png",
          path: "/pages/subPackageA/goods/goodsAdd"
        },
        {
          title: "分类至",
          icon: "/static/images/icon_order_wait.png",
          path: "/pages/subPackageA/goodsCategory/categoryList"
        }
      ],
      defaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapGetters(["goodsCart"])
  },
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const _referer = options.referer;
    if (_referer) this.referer = _referer;
    else this.referer = "goods";
    switch (this.referer) {
      case "order":
        util.setNavigationBarTitle("选择商品-固瑞锦建材");
        break;
      default:
        util.setNavigationBarTitle("批量管理-固瑞锦建材");
        break;
    }

    this.initData();
    this.getGoodsCategoryList();
    this.getGoodsList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    ...mapActions("goods", ["Plus", "Input", "Minus"]),

    // initData
    initData() {
      this.curPage = 1;
      this.allPage = 0;
      this.goodsList = [];
      this.noMore = !1;
    },

    // 取消搜索关键词
    onSearch() {
      this.queryTrem.keywords = null;
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

    // 减少
    onMinusGoodsNum(i) {
      const _list = this.goodsList;
      this.Minus(_list[i]);
      this.setGoodsListOrder(_list);
    },

    // 监听input事件
    onInputGoodsNum(e) {
      let _val = e.detail.value;
      const _index = e.detail.index;
      _val = String(_val).replace(/[^1-9.-]/g, "");
      _val = _val === "" ? 1 : +_val;

      const _list = this.goodsList;
      _list[_index].number = _val;
      this.Input(_list[_index]);

      this.setGoodsListOrder(_list);
    },

    // 增加
    onPlusGoodsNum(i) {
      const _list = this.goodsList;
      this.Plus(_list[i]);
      this.setGoodsListOrder(_list);
    },

    // 底部导航事件
    onTapFooterNav(path) {
      util.navigateTo(path);
    },

    // 确认所选
    onSureChoice() {
      util.navigateBack();
    },

    // 获取商品列表
    getGoodsList() {
      const _mode = this.referer;
      const _data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: this.queryTrem
      };
      switch (_mode) {
        case "order":
          getGoodsListOrder(_data).then(res => {
            const data = res.page;
            this.allPage = data.totalPage;

            let list = this.goodsList;
            const _list = data.list;
            if (_list.length > 0) {
              if (_list.length < this.pageSize) this.noMore = !0;
              else this.noMore = !1;
              _list.map(item => {
                item.number = 0;
              });

              const _goodsList = [...list, ..._list];

              this.setGoodsListOrder(_goodsList);
            }
          });
          break;

        default:
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
          break;
      }
    },

    //
    setGoodsListOrder(list) {
      const _goodsCart = [...this.goodsCart];
      if (_goodsCart.length > 0) {
        for (let i in list) {
          for (let j in _goodsCart) {
            if (list[i].id === _goodsCart[j].id) {
              list[i].number = _goodsCart[j].number;
            }
          }
        }
      }

      this.goodsList = list;
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
.batch-manage {
  .goods-filter-search {
    margin-bottom: 20upx;
  }
  .goods-status-sort {
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
  }

  .goods-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    box-shadow: 0 2upx 2upx rgba(0, 0, 0, 0.7);
    background-color: #f8f8f8;
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
    .operation-form-but {
      flex: 1;
      padding: 10upx 30upx;
    }
  }
}
</style>
