<template>
  <view class="pages record-in">
    <van-sticky>
      <view class="record-in-filter-search">
        <filter-search ref="filterSearch" valkey="status" :filterList.sync="filterList" @search="onSearch" @cancel="onCancel" @confirm="onConfirmFilterSearch" />
      </view>
    </van-sticky>

    <view class="record-in-content">
      <scroll-view class="record-in-scroll-area" scroll-y="true" bindscrolltolower="onReachBottom" v-if="recordInList.length>0">
        <record-item :list.sync="recordInList" />
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
  name: "goodsInRecord",
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
        manifestType: "entry",
        state: null,
        keywords: null
      },

      // 筛选
      filterList: [],

      curStatus: 0,
      curPage: 1,
      pageSize: 20,
      allPage: 0,
      recordInList: [],
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
    this.getInStoreRecordList();
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
      this.recordInList = [];
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
      this.getInStoreRecordList();
    },

    // 取消搜索
    onCancel() {
      this.queryTrem.keywords = null;
    },

    /**
     * 获取出库记录列表
     */
    getInStoreRecordList() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: this.queryTrem
      };
      getOutInStoreList(data).then(res => {
        const data = res.page;
        let _list = data.list;
        let _recordInList = this.recordInList;

        this.allPage = data.totalPage;
        if (_list.length > 0) {
          if (_list.length < this.pageSize) this.noMore = !0;
          else this.noMore = !1;
          this.recordInList = [..._recordInList, ..._list];
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
    if (this.curPage <= this.allPage) this.getInStoreRecordList();
    else this.noMore = !0;
  }
};
</script>

<style lang="scss">
.record-in {
  position: relative;
  height: 100%;
  .record-in-filter-search {
  }
  .record-in-content {
    box-sizing: border-box;
    .record-in-scroll-area {
      height: 100%;
    }
  }
}
</style>
