<template>
  <view class="pages record-out">
    <van-sticky>
      <view class="record-out-filter-search">
        <filter-search ref="filterSearch" valkey="status" :filterList.sync="filterList" @search="onSearch" @cancel="onCancel" @confirm="onConfirmFilterSearch" />
      </view>
    </van-sticky>

    <view class="record-out-content">
      <scroll-view class="record-out-scroll-area" scroll-y="true" bindscrolltolower="onReachBottom" v-if="recordOutList.length>0">
        <record-item :list.sync="recordOutList" />
        <no-more :noMore="noMore" />
      </scroll-view>

      <empty v-else desc="没有此状态下的出库记录哦~" />

    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui";
import filterSearch from "@/components/filter-search";

import empty from "@/components/empty";
import noMore from "@/components/no-more";
import recordItem from "./record-item";
import util from "@/common/utils";
import { getOutInStoreList } from "@/common/api";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "goodsOutRecord",
  components: {
    uniIcons,
    filterSearch,
    empty,
    noMore,
    recordItem
  },
  data() {
    return {
      //查询
      queryTrem: {
        manifestType: "outbound",
        state: null,
        keywords: null
      },

      // 筛选
      filterList: [
        {
          title: "批次状态",
          type: "radio",
          mode: "B",
          checked: false,
          subMenu: []
        }
      ],

      curStatus: 0,
      curPage: 1,
      pageSize: 20,
      allPage: 0,
      recordOutList: [],
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
    this.filterList[0].subMenu = [
      { name: "已装车", checked: !1, status: "truckCar", children: [] },
      { name: "配送中", checked: !1, status: "dispatching", children: [] },
      { name: "已送达", checked: !1, status: "success", children: [] }
    ];

    this.getOutStoreRecordList();
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
      this.recordOutList = [];
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
      this.getOutStoreRecordList();
    },

    // 取消搜索
    onCancel() {
      this.queryTrem.keywords = null;
    },

    // 确认查询
    onConfirmFilterSearch(e) {
      if (e.length < 1) return;
      this.queryTrem.state = e[0];
      this.initData();
      this.getOutStoreRecordList();
    },

    /**
     * 获取出库记录列表
     */
    getOutStoreRecordList() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: this.queryTrem
      };
      getOutInStoreList(data).then(res => {
        const data = res.page;
        let _list = data.list;
        let _recordOutList = this.recordOutList;

        this.allPage = data.totalPage;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;
          this.recordOutList = [..._recordOutList, ..._list];
        } else {
          this.noMore = !0;
        }
      });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) this.getOutStoreRecordList();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.record-out {
  position: relative;
  height: 100%;
  .record-out-filter-search {
  }
  .record-out-content {
    box-sizing: border-box;
    .record-out-scroll-area {
      height: 100%;
    }
  }
}
</style>
