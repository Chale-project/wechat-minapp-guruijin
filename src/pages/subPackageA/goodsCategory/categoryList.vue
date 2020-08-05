<template>
  <view class="pages category-list">
    <!-- <view class="unclassified">
      <uni-list>
        <uni-list-item>
          <view class="unclassified-content">
            <view class="label ellipsis">未分类</view>
            <view class="operate ellipsis">{{1}}件商品</view>
          </view>
        </uni-list-item>
      </uni-list>
    </view> -->

    <view class="categories" v-if="categoryList.length>0">
      <view class="category-panel" v-for="(p,i) of categoryList" :key="i">
        <view class="panel-header">
          <view class="category-item">
            <view class="label ellipsis">{{p.name}}</view>
            <view class="operate ellipsis">
              <view class="operate-item" v-if="i>0" @tap="onTapSort('top',p.id)">
                <image src="/static/images/icon_top.png" mode="widthFix" />
              </view>
              <view class="operate-item" v-if="i>0" @tap="onTapSort('up',p.id)">
                <image src="/static/images/icon_up.png" mode="widthFix" />
              </view>
              <view class="operate-item" @tap="onTapEdit(i)">
                <image src="/static/images/icon_edit.png" mode="widthFix" />
              </view>
              <view class="operate-item" @tap="onTapDelete(p.id)">
                <image src="/static/images/icon_delete.png" mode="widthFix" />
              </view>
            </view>
          </view>
        </view>

        <view class="panel-body" v-if="p.twoCategoryList.length>0">
          <view class="category-item" v-for="(c,j) of p.twoCategoryList" :key="j">
            <view class="label ellipsis">{{c.name}}</view>
            <view class="operate ellipsis">
              <view class="operate-item" v-if="j>0" @tap="onTapSort('top',c.id)">
                <image src="/static/images/icon_top.png" mode="widthFix" />
              </view>
              <view class="operate-item" v-if="j>0" @tap="onTapSort('up',c.id)">
                <image src="/static/images/icon_up.png" mode="widthFix" />
              </view>
              <view class="operate-item" @tap="onTapEdit(i,j)">
                <image src="/static/images/icon_edit.png" mode="widthFix" />
              </view>
              <view class="operate-item" @tap="onTapDelete(c.id)">
                <image src="/static/images/icon_delete.png" mode="widthFix" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <empty desc="请添加商品分类~" v-else />

    <view class="category-operate">
      <form @submit="showAddCategoryModal" class="operation-form-but" :report-submit='true'>
        <button type="default" class="operate-category-add" form-type="submit">添加分类</button>
      </form>
    </view>

    <!-- 添加 -->
    <modal ref="modalAdd" title="添加分类" @confirm="addOrEditCategory">
      <view class="modal-form">
        <m-picker label="上级分类" :index="curParentCategoryIndex" rangekey="name" :range="pCategoryList" @change="onChangeParentCategory" />
        <m-input class="m-input" type="text" maxlength="20" clearable v-model="categoryName" placeholder="请输入分类名称(最多10个字)" />
      </view>
    </modal>

    <!-- 删除 -->
    <modal ref="modalOperate" :title="operateTitle" :message="operateMessage" @confirm="operateCategory" />

  </view>
</template>

<script>
import { uniIcons, uniList, uniListItem } from "@dcloudio/uni-ui";

import modal from "@/components/modal";
import mInput from "@/components/m-input";
import mPicker from "@/components/m-picker";
import empty from "@/components/empty";

import util from "@/common/utils";
import {
  addCategory,
  editCategory,
  deleteCategory,
  sortCategory,
  getCategoryList,
  getFirstCategoryList
} from "@/common/api";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "categoryList",
  components: {
    uniIcons,
    uniList,
    uniListItem,
    modal,
    mInput,
    mPicker,
    empty
  },
  data() {
    return {
      operateTitle: "删除",
      operateMessage: "确认删除所选分类吗",
      operateType: "add",
      editId: null,
      categoryName: null,
      curParentCategoryIndex: 0,
      pCategoryList: [],
      categoryList: []
    };
  },
  computed: {},
  watch: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();

    Promise.all([
      this.getGoodsCategoryList(),
      this.getGoodsFirstCategoryList()
    ]);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    // init
    initData() {
      this.operateType = "add";
      this.editId = null;
      this.categoryName = null;
      this.curParentCategoryIndex = 0;
      this.pCategoryList = [];
      this.categoryList = [];
    },

    // 显示添加modal
    showAddCategoryModal(e) {
      this.curParentCategoryIndex = 0;
      this.editId = null;
      this.categoryName = null;
      this.operateType = "add";
      util.saveFormid(e.detail.formId);
      this.$refs.modalAdd.openPopup();
    },

    // 上移置顶
    onTapSort(t, i) {
      if (t === "top") {
        this.operateTitle = "置顶";
        this.operateMessage = "确认置顶所选分类吗";
      } else if (t === "up") {
        this.operateTitle = "上移";
        this.operateMessage = "确认上移所选分类吗";
      }

      this.editId = i;
      this.operateType = t;
      this.$refs.modalOperate.openPopup();
    },

    // 编辑
    onTapEdit(i, j) {
      this.operateType = "edit";
      const _categoryList = this.categoryList;
      if (j >= 0) {
        // 编辑二级分类
        this.curParentCategoryIndex = i + 1;
        this.editId = _categoryList[i].twoCategoryList[j].id;
        this.categoryName = _categoryList[i].twoCategoryList[j].name;
        this.$refs.modalAdd.openPopup();
      } else {
        // 编辑一级分类
        this.curParentCategoryIndex = 0;
        this.editId = _categoryList[i].id;
        this.categoryName = _categoryList[i].name;
        this.$refs.modalAdd.openPopup();
      }
    },

    // 显示删除modal
    onTapDelete(id) {
      this.operateTitle = "删除";
      this.operateMessage = "确认删除所选分类吗";
      this.operateType = "delete";
      this.editId = id;
      this.$refs.modalOperate.openPopup();
    },

    // 选择上级分类
    onChangeParentCategory(e) {
      this.curParentCategoryIndex = e.detail.value;
    },

    // 确认添加or编辑
    addOrEditCategory() {
      const flag = this.checkData();
      flag && this.addOrEditGoodsCategory();
    },

    // 添加or编辑商品分类
    addOrEditGoodsCategory() {
      const type = this.operateType;
      const parentData = this.pCategoryList[this.curParentCategoryIndex];
      const _data = {
        id: this.editId,
        catGrade:
          parentData.catGrade == "one"
            ? "two"
            : parentData.catGrade == "two"
            ? "three"
            : "one",
        parentId: parentData.id ? parentData.id : parentData.parentId,
        name: this.categoryName
      };
      switch (type) {
        case "add":
          addCategory(_data).then(() => {
            util.showToastSuccess("添加成功");
            this.$refs.modalAdd.closePopup();
            this.getGoodsCategoryList();
            this.getGoodsFirstCategoryList();
          });
          break;
        case "edit":
          editCategory(_data).then(() => {
            util.showToastSuccess("编辑成功");
            this.$refs.modalAdd.closePopup();
            this.getGoodsCategoryList();
            this.getGoodsFirstCategoryList();
          });
          break;
      }
    },

    // 数据校验
    checkData() {
      if (!this.categoryName) {
        util.showToastError("请填写分类名称！");
        return false;
      } else if (this.categoryName.length > 20) {
        util.showToastError("最多10个文字！");
        return false;
      } else {
        return true;
      }
    },

    // 确认删除,置顶，上移
    operateCategory() {
      const _type = this.operateType;
      switch (_type) {
        case "delete":
          deleteCategory(this.editId).then(() => {
            util.showToastSuccess("删除成功");
            this.$refs.modalOperate.closePopup();
            this.getGoodsCategoryList();
            this.getGoodsFirstCategoryList();
          });
          break;

        default:
          const _data = {
            id: this.editId,
            type: _type == "up" ? "PgUp" : _type == "down" ? "PgDn" : "Home"
          };
          sortCategory(_data).then(() => {
            util.showToastSuccess("操作成功");
            this.$refs.modalOperate.closePopup();
            this.getGoodsCategoryList();
            this.getGoodsFirstCategoryList();
          });
          break;
      }
    },

    // 获取商品所有分类列表
    getGoodsCategoryList() {
      getCategoryList().then(res => {
        const list = res.list;
        if (list.length > 0) {
          this.categoryList = list;
        }
      });
    },

    // 获取商品一级分类列表
    getGoodsFirstCategoryList() {
      getFirstCategoryList().then(res => {
        const topCategory = [
          {
            id: null,
            name: "顶级分类",
            parentId: "parent",
            catGrade: null
          }
        ];
        const _list = res.list;
        this.pCategoryList = [...topCategory, ..._list];
      });
    }
  }
};
</script>

<style lang="scss">
.category-list {
  .unclassified {
    margin-bottom: 20upx;
    .unclassified-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30upx;
      .label {
      }
      .operate {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #999;
      }
    }
  }
  .categories {
    background-color: #fff;
    margin-bottom: 110upx;
    .category-panel {
      position: relative;
      .panel-header {
        position: relative;
        .label {
          font-size: 30upx;
        }
      }
      .panel-header::after {
        @include backgroundLine(30upx, 0, 2upx);
      }
      .panel-body {
        padding-left: 30upx;
        .label {
          color: #666;
        }
      }

      .category-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30upx;
        .label {
        }
        .operate {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: #999;
          .operate-item {
            position: relative;
            width: 80upx;
            height: 80upx;
            line-height: 80upx;
            text-align: center;
            overflow: hidden;
            image {
              width: 40upx;
            }
          }
          .operate-item::after {
            position: absolute;
            content: "";
            width: 2upx;
            top: 20upx;
            bottom: 20upx;
            right: 0;
            background-color: #ddd;
          }
          .operate-item:last-child::after {
            width: 0;
            height: 0;
          }
        }
      }

      .category-item::after {
        @include backgroundLine(30upx, 0, 2upx);
      }
      .category-item:last-child::after {
        @include backgroundLine(0, 0, 0);
      }
    }
    .category-panel::after {
      @include backgroundLine(0, 0, 2upx);
    }
    .category-panel:last-child::after {
      @include backgroundLine(0, 0, 0);
    }
  }
  .category-operate {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10upx 30upx;
    background-color: #fff;
    z-index: 99;
  }

  .modal-form {
    position: relative;
    padding: 20upx 30upx;
    .m-input {
      .m-input-view {
        position: relative;
        padding: 16upx 0;
      }
      .m-input-view::after {
        @include backgroundLine(0, 0, 2upx);
      }
    }
  }
}
</style>